import React, { useState, useMemo } from 'react';
import { ArrowLeft, Clock, UserCheck, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import type { AuthStoreState } from '@/stores/authStore';
import {
  SlotGrid,
  BookingConfirmationForm,
  HoldCountdownBanner,
  useTherapists,
  useAvailableSlots,
  useSlotHold,
  TherapistAvatar,
  TherapistDirectoryCard,
  DatePickerBar,
  TherapistFilterToolbar,
  type TherapistProfile,
  type AvailableSlot,
} from '@/features/appointments';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { EmptyState } from '@/components/common/EmptyState';

export const BookAppointmentPage: React.FC = () => {
  const user = useAuthStore((state: AuthStoreState) => state.user);
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

  const {
    data: slots = [],
    isLoading: isSlotsLoading,
    isError: isSlotsError,
  } = useAvailableSlots(selectedTherapist?.id || '', selectedDate);

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
        <TherapistFilterToolbar
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          selectedSpecialty={selectedSpecialty}
          onSelectedSpecialtyChange={setSelectedSpecialty}
          showTopRatedOnly={showTopRatedOnly}
          onShowTopRatedOnlyChange={setShowTopRatedOnly}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          layoutMode={layoutMode}
          onLayoutModeChange={setLayoutMode}
          resultCount={filteredTherapists.length}
        />
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
              <TherapistDirectoryCard
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

                {/* Date Navigation Bar */}
                <DatePickerBar selectedDate={selectedDate} onSelectDate={setSelectedDate} />

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

                  {isSlotsError ? (
                    <div className="p-6 text-center bg-red-50 border border-red-200 rounded-xl space-y-2">
                      <p className="text-xs font-bold text-red-800">
                        Failed to retrieve slot availability.
                      </p>
                      <p className="text-xs text-red-700">
                        There was a network error connecting to the scheduling server. Please check
                        your connection or try again.
                      </p>
                    </div>
                  ) : (
                    <SlotGrid
                      slots={slots}
                      selectedSlotId={selectedSlot?.id || null}
                      onSelectSlot={handleSelectSlot}
                      isLoading={isSlotsLoading}
                    />
                  )}

                  {!isSlotsLoading && !isSlotsError && slots.length === 0 && (
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
