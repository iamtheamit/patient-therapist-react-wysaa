import React, { useState } from 'react';
import { Calendar, ArrowLeft, X } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import {
  SlotGrid,
  BookingConfirmationForm,
  HoldCountdownBanner,
  useAvailableSlots,
  useSlotHold,
  type TherapistProfile,
  type AvailableSlot,
} from '@/features/appointments';
import { useAuthStore } from '@/stores/authStore';
import type { AuthState } from '@/stores/authStore';

interface AppointmentBookingDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  therapist: TherapistProfile | null;
}

export const AppointmentBookingDrawer: React.FC<AppointmentBookingDrawerProps> = ({
  isOpen,
  onClose,
  therapist,
}) => {
  const user = useAuthStore((state: AuthState) => state.user);
  const patientId = user?.id || 'patient-user-1';

  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [selectedSlot, setSelectedSlot] = useState<AvailableSlot | null>(null);
  const [step, setStep] = useState<'slots' | 'confirm'>('slots');

  const { data: slots = [], isLoading: isSlotsLoading } = useAvailableSlots(
    therapist?.id || '',
    selectedDate,
  );

  const { secondsRemaining, isHolding, startHold, releaseHold, holdSession } = useSlotHold();

  // Reset state when modal closes
  const handleClose = async () => {
    if (isHolding) {
      await releaseHold();
    }
    setSelectedSlot(null);
    setStep('slots');
    onClose();
  };

  const handleSelectSlot = async (slot: AvailableSlot) => {
    setSelectedSlot(slot);
    if (therapist) {
      await startHold(slot, therapist.id);
    }
    setStep('confirm');
  };

  const handleBackToSlots = async () => {
    await releaseHold();
    setSelectedSlot(null);
    setStep('slots');
  };

  if (!therapist) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="lg">
      <div className="space-y-6 text-left p-1">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#c3c6d6]/40 pb-4">
          <div className="flex items-center gap-3">
            {step === 'confirm' && (
              <button
                type="button"
                onClick={handleBackToSlots}
                className="p-1.5 hover:bg-slate-100 rounded-lg text-[#51606f] transition"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div>
              <h3 className="font-heading text-lg font-bold text-[#191c1e]">
                {step === 'slots' ? `Book Session with ${therapist.name}` : 'Confirm Booking'}
              </h3>
              <p className="text-xs text-[#51606f] mt-0.5">
                {therapist.specialization} • 50 Minutes Telehealth
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 hover:bg-slate-100 rounded-lg text-[#51606f] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Hold Banner */}
        {isHolding && secondsRemaining > 0 && (
          <HoldCountdownBanner secondsRemaining={secondsRemaining} />
        )}

        {step === 'slots' ? (
          <div className="space-y-6">
            {/* Preferred Date Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#191c1e] flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#003d9b]" />
                Select Preferred Date
              </label>
              <input
                type="date"
                min={todayStr}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-4 py-2.5 bg-[#f8f9fb] border border-[#c3c6d6]/60 rounded-xl text-xs font-medium text-[#191c1e] focus:outline-none focus:border-[#003d9b]"
              />
            </div>

            {/* Time Slot Selection */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#191c1e]">Available Time Slots</span>
                <span className="text-[11px] text-[#51606f]">
                  Timezone: {Intl.DateTimeFormat().resolvedOptions().timeZone}
                </span>
              </div>

              {isSlotsLoading ? (
                <div className="py-8 text-center text-xs text-[#51606f] animate-pulse">
                  Loading available slots...
                </div>
              ) : (
                <SlotGrid
                  slots={slots}
                  selectedSlotId={selectedSlot?.id || null}
                  onSelectSlot={handleSelectSlot}
                />
              )}
            </div>
          </div>
        ) : (
          /* Step 2: Confirmation Form */
          selectedSlot && (
            <BookingConfirmationForm
              therapist={therapist}
              slot={selectedSlot}
              patientId={patientId}
              holdId={holdSession?.holdId}
              onBack={handleBackToSlots}
            />
          )
        )}
      </div>
    </Modal>
  );
};
