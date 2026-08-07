import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Star,
  CheckCircle2,
  Calendar,
  Clock,
  UserCheck,
  ShieldCheck,
  Award,
  ArrowLeft,
  LayoutGrid,
  List,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import type { AuthState } from '@/stores/authStore';
import { useTherapistStatusStore } from '@/stores/therapistStatusStore';
import {
  SlotGrid,
  BookingConfirmationForm,
  HoldCountdownBanner,
  useTherapists,
  useAvailableSlots,
  useSlotHold,
  type TherapistProfile,
  type AvailableSlot,
} from '@/features/appointments';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { EmptyState } from '@/components/common/EmptyState';

const SPECIALTY_FILTERS = [
  'All Specialties',
  'Cognitive Behavioral Therapy (CBT)',
  'Mindfulness & Mood Care',
  'Trauma & Resilience Therapy',
  'Anxiety & Stress Management',
];

// Fallback avatar helper that handles image loading errors gracefully
const TherapistAvatar: React.FC<{ url?: string; name: string; size?: string }> = ({
  url,
  name,
  size = 'w-14 h-14',
}) => {
  const [hasError, setHasError] = useState(false);
  const initials = name
    .replace('Dr. ', '')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  if (!url || hasError) {
    return (
      <div
        className={`${size} rounded-full bg-gradient-to-br from-[#003d9b] to-[#0052cc] text-white font-bold text-xs flex items-center justify-center border-2 border-white shadow-xs shrink-0 select-none`}
      >
        {initials}
      </div>
    );
  }

  return (
    <img
      src={url}
      alt=""
      onError={() => setHasError(true)}
      className={`${size} rounded-full object-cover border-2 border-white shadow-xs shrink-0`}
    />
  );
};

export const BookAppointmentPage: React.FC = () => {
  const user = useAuthStore((state: AuthState) => state.user);
  const patientId = user?.id || 'patient-user-1';
  const isSarahOnline = useTherapistStatusStore((state) => state.isOnline);

  const { data: therapists = [], isLoading: isTherapistsLoading } = useTherapists();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All Specialties');
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [showTopRatedOnly, setShowTopRatedOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'rating' | 'experience' | 'name'>('rating');
  const [layoutMode, setLayoutMode] = useState<'list' | 'grid'>('list');

  // Booking Flow States
  const [selectedTherapist, setSelectedTherapist] = useState<TherapistProfile | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedSlot, setSelectedSlot] = useState<AvailableSlot | null>(null);
  const [bookingStep, setBookingStep] = useState<'directory' | 'slots' | 'confirm'>('directory');
  const [profileModalTherapist, setProfileModalTherapist] = useState<TherapistProfile | null>(null);

  const { data: slots = [], isLoading: isSlotsLoading } = useAvailableSlots(
    selectedTherapist?.id || '',
    selectedDate,
  );

  const { secondsRemaining, isHolding, startHold, releaseHold } = useSlotHold();

  const filteredTherapists = useMemo(() => {
    const list = therapists.filter((t) => {
      const isOnline = t.id === 'therapist-1' ? isSarahOnline : true;
      const isTopRated = (t.rating || 0) >= 4.8;
      const matchesSearch =
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.specialization.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSpecialty =
        selectedSpecialty === 'All Specialties' ||
        t.specialization.toLowerCase().includes(selectedSpecialty.toLowerCase());
      const matchesOnline = !showOnlineOnly || isOnline;
      const matchesTopRated = !showTopRatedOnly || isTopRated;

      return matchesSearch && matchesSpecialty && matchesOnline && matchesTopRated;
    });

    return list.sort((a, b) => {
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'experience') return (b.experienceYears || 0) - (a.experienceYears || 0);
      return a.name.localeCompare(b.name);
    });
  }, [
    therapists,
    searchQuery,
    selectedSpecialty,
    showOnlineOnly,
    showTopRatedOnly,
    sortBy,
    isSarahOnline,
  ]);

  const handleStartBooking = (therapist: TherapistProfile) => {
    setSelectedTherapist(therapist);
    setSelectedSlot(null);
    setBookingStep('slots');
  };

  const handleSelectSlot = async (slot: AvailableSlot) => {
    setSelectedSlot(slot);
    if (selectedTherapist) {
      await startHold(slot.id, selectedTherapist.id);
    }
    setBookingStep('confirm');
  };

  const handleBackToSlots = async () => {
    await releaseHold();
    setSelectedSlot(null);
    setBookingStep('slots');
  };

  const handleBackToDirectory = async () => {
    if (isHolding) {
      await releaseHold();
    }
    setSelectedSlot(null);
    setSelectedTherapist(null);
    setBookingStep('directory');
  };

  return (
    <div className="space-y-8 text-left w-full">
      {/* Clean Page Title Header - Consistent across all steps */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#c3c6d6]/30 pb-4">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl font-bold text-[#191c1e]">
            {bookingStep === 'directory'
              ? 'Find a Therapist'
              : bookingStep === 'slots'
                ? 'Select Appointment Slot'
                : 'Confirm Therapy Booking'}
          </h1>
          <p className="text-[#51606f] mt-1 text-xs">
            Discover licensed psychologists and board-certified therapists verified by TherapySync.
          </p>
        </div>

        {bookingStep !== 'directory' && (
          <div className="flex items-center gap-3 self-start md:self-auto">
            <button
              onClick={handleBackToDirectory}
              className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-[#003d9b] bg-[#f0f4ff] hover:bg-[#d5e4f6] rounded-xl transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Directory
            </button>
            <span className="text-xs font-semibold text-[#51606f] bg-white border border-[#c3c6d6]/40 px-3 py-1.5 rounded-xl shadow-2xs">
              Step {bookingStep === 'slots' ? '1 of 2' : '2 of 2'}
            </span>
          </div>
        )}
      </div>

      {/* Directory Filter Toolbar - Only on Directory step */}
      {bookingStep === 'directory' && (
        <div className="bg-white rounded-2xl border border-[#c3c6d6]/40 p-6 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search Field */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#737685]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search practitioner by name, clinical focus, or condition..."
                className="w-full pl-10 pr-10 py-2.5 bg-[#f8f9ff] border border-[#c3c6d6]/60 rounded-xl text-xs font-medium text-[#191c1e] focus:outline-none focus:border-[#003d9b] focus:ring-1 focus:ring-[#003d9b] transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Online Now & Top Rated Toggles & Sort & Layout */}
            <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
              <button
                type="button"
                onClick={() => setShowOnlineOnly(!showOnlineOnly)}
                className={`px-4 py-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer ${
                  showOnlineOnly
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                    : 'bg-[#f8f9ff] border-[#c3c6d6]/60 text-[#51606f] hover:text-[#191c1e]'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    showOnlineOnly ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'
                  }`}
                />
                Online Now
              </button>

              <button
                type="button"
                onClick={() => setShowTopRatedOnly(!showTopRatedOnly)}
                className={`px-4 py-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer ${
                  showTopRatedOnly
                    ? 'bg-amber-50 border-amber-300 text-amber-900 shadow-2xs'
                    : 'bg-[#f8f9ff] border-[#c3c6d6]/60 text-[#51606f] hover:text-[#191c1e]'
                }`}
              >
                <Star
                  className={`w-3.5 h-3.5 ${
                    showTopRatedOnly ? 'fill-amber-500 text-amber-500' : 'text-slate-400'
                  }`}
                />
                Top Rated
              </button>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-1.5 bg-[#f8f9ff] border border-[#c3c6d6]/60 px-3 py-2 rounded-xl text-xs font-medium text-[#51606f]">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#003d9b]" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'rating' | 'experience' | 'name')}
                  className="bg-transparent text-[#191c1e] font-semibold focus:outline-none cursor-pointer"
                >
                  <option value="rating">Top Rated</option>
                  <option value="experience">Most Experienced</option>
                  <option value="name">Name (A-Z)</option>
                </select>
              </div>

              {/* Layout Toggle */}
              <div className="hidden sm:flex items-center bg-[#f8f9ff] border border-[#c3c6d6]/60 p-1 rounded-xl">
                <button
                  onClick={() => setLayoutMode('list')}
                  className={`p-1.5 rounded-lg transition ${
                    layoutMode === 'list'
                      ? 'bg-[#003d9b] text-white'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                  title="List View"
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setLayoutMode('grid')}
                  className={`p-1.5 rounded-lg transition ${
                    layoutMode === 'grid'
                      ? 'bg-[#003d9b] text-white'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                  title="Grid View"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Specialty Filter Pills */}
          <div className="flex items-center justify-between border-t border-slate-100 pt-3">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <span className="text-xs font-bold text-[#51606f] shrink-0 mr-1 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> Specialty:
              </span>
              {SPECIALTY_FILTERS.map((spec) => (
                <button
                  key={spec}
                  onClick={() => setSelectedSpecialty(spec)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    selectedSpecialty === spec
                      ? 'bg-[#003d9b] text-white shadow-xs'
                      : 'bg-[#f8f9ff] text-[#51606f] border border-[#c3c6d6]/40 hover:bg-slate-100 hover:text-[#191c1e]'
                  }`}
                >
                  {spec}
                </button>
              ))}
            </div>

            <span className="text-xs font-bold text-[#003d9b] shrink-0 hidden md:block">
              {filteredTherapists.length} Practitioners Found
            </span>
          </div>
        </div>
      )}

      {/* ACTIVE STEP VIEW */}
      {bookingStep === 'directory' ? (
        /* STEP 1: Practitioner Directory Cards (Full Width) */
        isTherapistsLoading ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-[#c3c6d6]/40 text-xs text-[#51606f] animate-pulse">
            Loading verified practitioners...
          </div>
        ) : filteredTherapists.length === 0 ? (
          <EmptyState
            title="No Matching Therapists Found"
            description="We couldn't find any licensed practitioners matching your current search or specialty filters."
            actionLabel="Reset All Filters"
            onAction={() => {
              setSearchQuery('');
              setSelectedSpecialty('All Specialties');
              setShowOnlineOnly(false);
              setShowTopRatedOnly(false);
            }}
          />
        ) : (
          <div
            className={
              layoutMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-4 w-full'
            }
          >
            {filteredTherapists.map((therapist) => {
              const isOnline = therapist.id === 'therapist-1' ? isSarahOnline : true;
              const isTopRated = (therapist.rating || 0) >= 4.8;
              return (
                <div
                  key={therapist.id}
                  className="bg-white rounded-2xl border border-[#c3c6d6]/50 p-6 shadow-sm hover:shadow-md hover:border-[#003d9b]/40 transition-all text-left flex flex-col justify-between gap-5 group"
                >
                  <div className="flex items-start gap-4">
                    <div className="relative shrink-0">
                      <TherapistAvatar
                        url={therapist.avatarUrl}
                        name={therapist.name}
                        size="w-14 h-14"
                      />
                      <span
                        className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${
                          isOnline ? 'bg-emerald-500' : 'bg-slate-300'
                        }`}
                      />
                    </div>

                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <h3 className="font-heading font-bold text-base text-[#191c1e] group-hover:text-[#003d9b] transition truncate">
                          {therapist.name}
                        </h3>
                        <div className="flex items-center gap-1.5">
                          {isTopRated && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/80">
                              <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                              Top Rated
                            </span>
                          )}
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Verified
                          </span>
                        </div>
                      </div>

                      <p className="text-xs font-semibold text-[#003d9b] truncate">
                        {therapist.specialization}
                      </p>

                      {/* Ratings & Tags */}
                      <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-[#51606f]">
                        <span className="flex items-center gap-1 font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60 text-xs">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          {therapist.rating} (128 reviews)
                        </span>

                        <span className="flex items-center gap-1 bg-[#f8f9ff] px-2 py-0.5 rounded border border-slate-200 text-[11px] font-medium">
                          <Award className="w-3 h-3 text-[#003d9b]" />
                          {therapist.experienceYears || 8}+ Yrs Exp
                        </span>

                        <span className="flex items-center gap-1 text-[11px] text-[#51606f]">
                          <Clock className="w-3 h-3 text-[#003d9b]" />
                          50 min
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bio snippet */}
                  <p className="text-xs text-[#51606f] leading-relaxed line-clamp-2 bg-[#f8f9ff] p-3 rounded-xl border border-slate-100 italic">
                    "
                    {therapist.bio ||
                      'Specialized clinical psychologist focused on evidence-based cognitive and behavioral therapies.'}
                    "
                  </p>

                  {/* Card Footer Actions - Clean Baseline Alignment & Standard Button Components */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 border-t border-slate-100 gap-3">
                    <div className="shrink-0">
                      <span className="text-[11px] text-[#51606f] block">Session Fee</span>
                      <span className="font-heading font-bold text-base text-[#191c1e]">
                        $150 <span className="text-[11px] font-normal text-[#51606f]">/ visit</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-auto">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setProfileModalTherapist(therapist)}
                      >
                        View Profile
                      </Button>

                      <Button
                        variant="primary"
                        size="sm"
                        leftIcon={<UserCheck className="w-3.5 h-3.5" />}
                        onClick={() => handleStartBooking(therapist)}
                      >
                        Book Session
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )
      ) : (
        /* STEP 2 & STEP 3: Booking Flow 3-Column Layout */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {bookingStep === 'slots' && selectedTherapist ? (
              <div className="bg-white rounded-2xl border border-[#c3c6d6]/40 p-6 shadow-sm space-y-6">
                <div className="p-4 bg-[#f8f9ff] border border-slate-200 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <TherapistAvatar
                      url={selectedTherapist.avatarUrl}
                      name={selectedTherapist.name}
                      size="w-12 h-12"
                    />
                    <div>
                      <h4 className="font-bold text-sm text-[#191c1e]">{selectedTherapist.name}</h4>
                      <p className="text-xs text-[#003d9b] font-semibold">
                        {selectedTherapist.specialization}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleBackToDirectory}>
                    Change Practitioner
                  </Button>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#191c1e] flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#003d9b]" /> Select Preferred Session Date
                  </label>
                  <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="px-4 py-2.5 bg-[#f8f9ff] border border-[#c3c6d6]/60 rounded-xl text-xs font-medium text-[#191c1e] focus:outline-none focus:border-[#003d9b]"
                  />
                </div>

                <div className="space-y-3">
                  <h3 className="font-bold text-sm text-[#191c1e]">
                    Available Slots for {selectedDate}
                  </h3>
                  <SlotGrid
                    slots={slots}
                    selectedSlotId={selectedSlot?.id || null}
                    onSelectSlot={handleSelectSlot}
                    isLoading={isSlotsLoading}
                  />
                </div>
              </div>
            ) : (
              bookingStep === 'confirm' &&
              selectedTherapist &&
              selectedSlot && (
                <div className="space-y-6">
                  {isHolding && secondsRemaining > 0 && (
                    <HoldCountdownBanner secondsRemaining={secondsRemaining} />
                  )}

                  <BookingConfirmationForm
                    patientId={patientId}
                    therapist={selectedTherapist}
                    slot={selectedSlot}
                    onBack={handleBackToSlots}
                  />
                </div>
              )
            )}
          </div>

          {/* Sidebar for Booking Steps */}
          <div className="lg:col-span-1 space-y-6">
            {selectedTherapist && (
              <>
                <div className="bg-white rounded-2xl border border-[#c3c6d6]/40 p-5 shadow-sm space-y-4 text-left">
                  <div className="flex items-center gap-2 text-[#0052cc] font-bold text-xs bg-[#e5eeff] px-2.5 py-1 rounded-full border border-[#0052cc]/20 w-fit">
                    <UserCheck className="w-3.5 h-3.5 text-[#0052cc]" /> Selected Practitioner
                  </div>

                  <div className="flex items-start gap-3 pt-1">
                    <TherapistAvatar
                      url={selectedTherapist.avatarUrl}
                      name={selectedTherapist.name}
                      size="w-12 h-12"
                    />
                    <div>
                      <h4 className="font-bold text-sm text-[#191c1e]">{selectedTherapist.name}</h4>
                      <p className="text-xs text-[#0052cc] font-semibold">
                        {selectedTherapist.specialization}
                      </p>
                      <span className="text-[11px] text-amber-700 font-bold mt-0.5 block">
                        ★ {selectedTherapist.rating} (128 reviews)
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-[#51606f] leading-relaxed bg-[#f8f9ff] p-3 rounded-xl border border-slate-100 italic">
                    "
                    {selectedTherapist.bio ||
                      'Licensed practitioner focused on evidence-based cognitive and behavioral care.'}
                    "
                  </p>

                  <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs text-[#51606f]">
                    <div className="flex justify-between">
                      <span>Experience:</span>
                      <span className="font-semibold text-[#191c1e]">
                        {selectedTherapist.experienceYears || 8}+ Years Clinical
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Format:</span>
                      <span className="font-semibold text-[#191c1e]">50-Min Telehealth</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Rate:</span>
                      <span className="font-bold text-[#191c1e]">$150.00 / session</span>
                    </div>
                  </div>
                </div>

                <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-5 space-y-2 text-emerald-900 text-left">
                  <div className="flex items-center gap-2 font-bold text-xs text-emerald-800">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    HIPAA Secure &amp; Flexible Cancellation
                  </div>
                  <p className="text-xs text-emerald-800 leading-relaxed">
                    Your appointment details are encrypted. You can cancel or reschedule free of
                    charge up to 24 hours before your session.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Practitioner Full Profile Modal */}
      <Modal
        isOpen={Boolean(profileModalTherapist)}
        onClose={() => setProfileModalTherapist(null)}
        title={profileModalTherapist?.name || 'Therapist Profile'}
        size="md"
      >
        {profileModalTherapist && (
          <div className="space-y-6 text-left pt-2">
            <div className="flex items-center gap-4">
              <TherapistAvatar
                url={profileModalTherapist.avatarUrl}
                name={profileModalTherapist.name}
                size="w-16 h-16"
              />
              <div>
                <h4 className="font-bold text-base text-[#191c1e]">{profileModalTherapist.name}</h4>
                <p className="text-xs text-[#003d9b] font-semibold">
                  {profileModalTherapist.specialization}
                </p>
                <span className="text-xs text-amber-600 font-semibold mt-1 inline-block">
                  ★ {profileModalTherapist.rating} (128 Patient Reviews)
                </span>
              </div>
            </div>

            <div className="space-y-2 text-xs text-[#51606f]">
              <h5 className="font-bold text-[#191c1e]">About Practitioner</h5>
              <p className="leading-relaxed">
                {profileModalTherapist.bio ||
                  'Licensed clinical psychologist with extensive expertise in evidence-based Cognitive Behavioral Therapy (CBT), stress reduction, and anxiety management.'}
              </p>
            </div>

            <div className="pt-4 flex justify-end gap-3 border-t border-slate-200">
              <Button variant="ghost" size="sm" onClick={() => setProfileModalTherapist(null)}>
                Close
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  const t = profileModalTherapist;
                  setProfileModalTherapist(null);
                  handleStartBooking(t);
                }}
              >
                Book Session with {profileModalTherapist.name.split(' ')[1]}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default BookAppointmentPage;
