import React, { useState, useMemo } from 'react';
import {
  Search,
  Star,
  Calendar,
  Clock,
  UserCheck,
  ShieldCheck,
  ArrowLeft,
  LayoutGrid,
  List,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import type { AuthState } from '@/stores/authStore';
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

// Directory Therapist Card Component
const TherapistDirectoryCardItem: React.FC<{
  therapist: TherapistProfile;
  onViewProfile: (therapist: TherapistProfile) => void;
  onBookSession: (therapist: TherapistProfile) => void;
}> = ({ therapist, onViewProfile, onBookSession }) => {
  const isTopRated = (therapist.rating || 0) >= 4.8;

  return (
    <div className="bg-white rounded-xl border border-outline-variant/50 hover:border-primary/30 transition-colors duration-200 text-left group">
      {/* Main content row */}
      <div className="p-5 flex gap-4">
        {/* Avatar column */}
        <div className="relative shrink-0 pt-0.5">
          <TherapistAvatar url={therapist.avatarUrl} name={therapist.name} size="w-12 h-12" />
        </div>

        {/* Info column */}
        <div className="flex-1 min-w-0 space-y-2">
          {/* Name + credentials row */}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="font-heading font-semibold text-sm text-on-surface leading-tight truncate">
                {therapist.name}
              </h3>
              <p className="text-xs text-primary font-medium mt-0.5 truncate">
                {therapist.specialization}
              </p>
            </div>
            {isTopRated && (
              <span className="shrink-0 text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200/70 px-2 py-0.5 rounded-md flex items-center gap-1">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                Top Rated
              </span>
            )}
          </div>

          {/* Meta row — clean inline text, not pill badges */}
          <div className="flex items-center gap-3 text-xs text-secondary">
            <span className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="font-semibold text-on-surface">{therapist.rating}</span>
            </span>
            <span className="w-px h-3 bg-outline-variant/60" />
            <span>{therapist.experienceYears || 5}+ yrs experience</span>
            <span className="w-px h-3 bg-outline-variant/60" />
            <span>50 min session</span>
          </div>

          {/* Bio — plain text, no fake quote styling */}
          <p className="text-xs text-secondary leading-relaxed line-clamp-2">
            {therapist.bio ||
              'Specialized clinical psychologist focused on evidence-based cognitive and behavioral therapies.'}
          </p>
        </div>
      </div>

      {/* Footer — pricing + actions */}
      <div className="px-5 py-3 border-t border-outline-variant/30 flex items-center justify-between gap-4">
        {/* Left: price */}
        <div className="flex items-center gap-4 text-xs text-secondary font-medium">
          <span>
            Session Fee: <span className="font-semibold text-on-surface">$150</span> / visit
          </span>
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="ghost" size="sm" onClick={() => onViewProfile(therapist)}>
            View Profile
          </Button>

          <Button variant="primary" size="sm" onClick={() => onBookSession(therapist)}>
            Book Session
          </Button>
        </div>
      </div>
    </div>
  );
};

export const BookAppointmentPage: React.FC = () => {
  const user = useAuthStore((state: AuthState) => state.user);
  const patientId = user?.id || 'patient-user-1';

  const { data: therapists = [], isLoading: isTherapistsLoading } = useTherapists();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All Specialties');
  const [showTopRatedOnly, setShowTopRatedOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'rating' | 'experience' | 'name'>('rating');
  const [layoutMode, setLayoutMode] = useState<'list' | 'grid'>('list');

  // Booking Flow States
  const [selectedTherapist, setSelectedTherapist] = useState<TherapistProfile | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedSlot, setSelectedSlot] = useState<AvailableSlot | null>(null);
  const [bookingStep, setBookingStep] = useState<'directory' | 'slots' | 'confirm'>('directory');
  const [profileModalTherapist, setProfileModalTherapist] = useState<TherapistProfile | null>(null);

  const next7Days = useMemo(() => {
    const days = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const isoDate = d.toISOString().split('T')[0];
      const dayName =
        i === 0
          ? 'Today'
          : i === 1
            ? 'Tomorrow'
            : d.toLocaleDateString('en-US', { weekday: 'short' });
      const monthDay = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      days.push({ isoDate, dayName, monthDay, fullDate: d });
    }
    return days;
  }, []);

  const { data: slots = [], isLoading: isSlotsLoading } = useAvailableSlots(
    selectedTherapist?.id || '',
    selectedDate,
  );

  const { secondsRemaining, isHolding, startHold, releaseHold, holdSession } = useSlotHold();

  const filteredTherapists = useMemo(() => {
    const list = therapists.filter((t) => {
      const isTopRated = (t.rating || 0) >= 4.8;
      const matchesSearch =
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.specialization.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSpecialty =
        selectedSpecialty === 'All Specialties' ||
        t.specialization.toLowerCase().includes(selectedSpecialty.toLowerCase());
      const matchesTopRated = !showTopRatedOnly || isTopRated;

      return matchesSearch && matchesSpecialty && matchesTopRated;
    });

    return list.sort((a, b) => {
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'experience') return (b.experienceYears || 0) - (a.experienceYears || 0);
      return a.name.localeCompare(b.name);
    });
  }, [therapists, searchQuery, selectedSpecialty, showTopRatedOnly, sortBy]);

  const handleStartBooking = (therapist: TherapistProfile) => {
    setSelectedTherapist(therapist);
    setSelectedSlot(null);
    setBookingStep('slots');
  };

  const handleSelectSlot = async (slot: AvailableSlot) => {
    setSelectedSlot(slot);
    if (selectedTherapist) {
      const success = await startHold(slot, selectedTherapist.id);
      // Only advance to confirm step if the hold was successfully acquired.
      // If startHold failed (slot taken, expired, etc.) stay on slot selection.
      if (!success) return;
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
    <div className="space-y-6 text-left w-full">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-outline-variant/30 pb-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-on-surface">
            {bookingStep === 'directory'
              ? 'Find a Therapist'
              : bookingStep === 'slots'
                ? 'Select Appointment Slot'
                : 'Confirm Booking'}
          </h1>
          <p className="text-secondary mt-1 text-sm">
            Browse verified practitioners and book your next session.
          </p>
        </div>

        {bookingStep !== 'directory' && (
          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={handleBackToDirectory}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/5 rounded-lg transition cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
            <span className="text-xs font-medium text-secondary bg-surface-container-low border border-outline-variant/40 px-2.5 py-1 rounded-md tabular-nums">
              Step {bookingStep === 'slots' ? '1' : '2'} of 2
            </span>
          </div>
        )}
      </div>

      {/* Directory Filter Toolbar */}
      {bookingStep === 'directory' && (
        <div className="bg-white rounded-xl border border-outline-variant/40 p-5 space-y-3">
          <div className="flex flex-col md:flex-row md:items-end gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <label className="text-[11px] font-semibold text-secondary uppercase tracking-wider mb-1 block">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Name or specialization…"
                  className="w-full pl-9 pr-9 py-2 bg-surface-container-low border border-outline-variant/60 rounded-lg text-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Quick filters + sort + layout */}
            <div className="flex items-end gap-2 flex-wrap sm:flex-nowrap">
              <button
                type="button"
                onClick={() => setShowTopRatedOnly(!showTopRatedOnly)}
                className={`px-3 py-2 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition cursor-pointer ${
                  showTopRatedOnly
                    ? 'bg-amber-50 border-amber-300 text-amber-800'
                    : 'bg-surface-container-low border-outline-variant/60 text-secondary hover:text-on-surface hover:border-outline-variant'
                }`}
              >
                <Star
                  className={`w-3 h-3 ${
                    showTopRatedOnly ? 'fill-amber-500 text-amber-500' : 'text-outline-variant'
                  }`}
                />
                Top Rated
              </button>

              {/* Sort */}
              <div className="flex items-center gap-1.5 bg-surface-container-low border border-outline-variant/60 px-3 py-2 rounded-lg text-xs text-secondary">
                <SlidersHorizontal className="w-3.5 h-3.5 text-outline" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'rating' | 'experience' | 'name')}
                  className="bg-transparent text-on-surface font-medium focus:outline-none cursor-pointer text-xs"
                >
                  <option value="rating">Rating</option>
                  <option value="experience">Experience</option>
                  <option value="name">Name</option>
                </select>
              </div>

              {/* Layout toggle */}
              <div className="hidden sm:flex items-center bg-surface-container-low border border-outline-variant/60 p-0.5 rounded-lg">
                <button
                  onClick={() => setLayoutMode('list')}
                  className={`p-1.5 rounded-md transition ${
                    layoutMode === 'list'
                      ? 'bg-primary text-white'
                      : 'text-outline hover:text-on-surface'
                  }`}
                  title="List View"
                >
                  <List className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setLayoutMode('grid')}
                  className={`p-1.5 rounded-md transition ${
                    layoutMode === 'grid'
                      ? 'bg-primary text-white'
                      : 'text-outline hover:text-on-surface'
                  }`}
                  title="Grid View"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Specialty filter row */}
          <div className="flex items-center justify-between pt-2 border-t border-outline-variant/20">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
              {SPECIALTY_FILTERS.map((spec) => (
                <button
                  key={spec}
                  onClick={() => setSelectedSpecialty(spec)}
                  className={`px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                    selectedSpecialty === spec
                      ? 'bg-primary text-white'
                      : 'text-secondary hover:bg-surface-container-low hover:text-on-surface'
                  }`}
                >
                  {spec}
                </button>
              ))}
            </div>

            <span className="text-xs text-secondary shrink-0 hidden md:block tabular-nums">
              {filteredTherapists.length} result{filteredTherapists.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      )}

      {/* ACTIVE STEP VIEW */}
      {bookingStep === 'directory' ? (
        isTherapistsLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-outline-variant/40 p-5 animate-pulse"
              >
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-surface-container-high shrink-0" />
                  <div className="flex-1 space-y-2 py-1">
                    <div className="h-3.5 bg-surface-container-high rounded w-2/5" />
                    <div className="h-3 bg-surface-container-low rounded w-1/3" />
                    <div className="h-3 bg-surface-container-low rounded w-4/5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredTherapists.length === 0 ? (
          <EmptyState
            title="No Matching Therapists Found"
            description="We couldn't find any licensed practitioners matching your current search or specialty filters."
            actionLabel="Reset All Filters"
            onAction={() => {
              setSearchQuery('');
              setSelectedSpecialty('All Specialties');
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
            {filteredTherapists.map((therapist) => (
              <TherapistDirectoryCardItem
                key={therapist.id}
                therapist={therapist}
                onViewProfile={(t) => setProfileModalTherapist(t)}
                onBookSession={(t) => handleStartBooking(t)}
              />
            ))}
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

                {/* 7-Day Interactive Date Navigation Bar */}
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <label className="text-xs font-bold text-[#191c1e] flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#003d9b]" /> Select Session Date
                    </label>
                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <span className="text-[11px] font-semibold text-[#51606f]">Custom Date:</span>
                      <input
                        type="date"
                        min={new Date().toISOString().split('T')[0]}
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="px-2.5 py-1 bg-[#f8f9ff] border border-[#c3c6d6]/60 rounded-lg text-xs font-medium text-[#191c1e] focus:outline-none focus:border-[#003d9b]"
                      />
                    </div>
                  </div>

                  {/* Date Pill Cards Carousel */}
                  <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 overflow-x-auto pb-1">
                    {next7Days.map((day) => {
                      const isSelected = selectedDate === day.isoDate;
                      return (
                        <button
                          key={day.isoDate}
                          type="button"
                          onClick={() => setSelectedDate(day.isoDate)}
                          className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center cursor-pointer ${
                            isSelected
                              ? 'bg-[#003d9b] text-white border-[#003d9b] shadow-md shadow-[#003d9b]/20 ring-2 ring-[#003d9b]/30'
                              : 'bg-[#f8f9ff] text-[#191c1e] border-[#c3c6d6]/50 hover:bg-slate-100 hover:border-[#003d9b]/40'
                          }`}
                        >
                          <span
                            className={`text-[10px] uppercase tracking-wider font-bold ${
                              isSelected ? 'text-blue-100' : 'text-[#51606f]'
                            }`}
                          >
                            {day.dayName}
                          </span>
                          <span className="text-xs font-extrabold mt-0.5">{day.monthDay}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Available Slots Section */}
                <div className="space-y-4 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-[#191c1e] flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#003d9b]" />
                      Available Slots for{' '}
                      <span className="text-[#003d9b] font-extrabold">
                        {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </h3>
                    {!isSlotsLoading && slots.filter((s) => s.isAvailable).length > 0 && (
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60">
                        {slots.filter((s) => s.isAvailable).length} Open Slots
                      </span>
                    )}
                  </div>

                  <SlotGrid
                    slots={slots}
                    selectedSlotId={selectedSlot?.id || null}
                    onSelectSlot={handleSelectSlot}
                    isLoading={isSlotsLoading}
                  />

                  {!isSlotsLoading && slots.length === 0 && (
                    <div className="bg-[#f8f9ff] border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
                      <div className="text-xs text-[#51606f]">
                        <p className="font-semibold text-[#191c1e]">
                          No open slots found for this date.
                        </p>
                        <p>Try selecting another date from the bar above.</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const current = new Date(selectedDate + 'T00:00:00');
                          current.setDate(current.getDate() + 1);
                          setSelectedDate(current.toISOString().split('T')[0]);
                        }}
                      >
                        Check Next Day &rarr;
                      </Button>
                    </div>
                  )}
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
                    holdId={holdSession?.holdId}
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
