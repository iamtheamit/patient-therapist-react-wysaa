import React, { useState } from 'react';
import { Calendar, UserCheck, Clock, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import type { AuthState } from '@/stores/authStore';
import {
  TherapistSelector,
  SlotGrid,
  BookingConfirmationForm,
  HoldCountdownBanner,
  useTherapists,
  useAvailableSlots,
  useSlotHold,
  type TherapistProfile,
  type AvailableSlot,
  type BookingStep,
} from '@/features/appointments';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/config/routes';
import { cn } from '@/utils/cn';

export const BookAppointmentPage: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state: AuthState) => state.user);
  const patientId = user?.id || 'patient-user-1';

  const [step, setStep] = useState<BookingStep>(1);
  const [selectedTherapist, setSelectedTherapist] = useState<TherapistProfile | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedSlot, setSelectedSlot] = useState<AvailableSlot | null>(null);

  const { data: therapists, isLoading: isTherapistsLoading } = useTherapists();
  const { data: slots, isLoading: isSlotsLoading } = useAvailableSlots(
    selectedTherapist?.id || '',
    selectedDate,
  );

  const { secondsRemaining, isHolding, startHold, releaseHold } = useSlotHold();

  // Handle automatic hold expiration state reset during render (React 19 pattern)
  if (step === 3 && secondsRemaining === 0 && !isHolding) {
    setSelectedSlot(null);
    setStep(2);
  }

  const handleSelectTherapist = (therapist: TherapistProfile) => {
    setSelectedTherapist(therapist);
    setSelectedSlot(null);
    setStep(2);
  };

  const handleSelectSlot = async (slot: AvailableSlot) => {
    setSelectedSlot(slot);
    if (selectedTherapist) {
      await startHold(slot.id, selectedTherapist.id);
    }
    setStep(3);
  };

  const handleBackToSlots = async () => {
    await releaseHold();
    setSelectedSlot(null);
    setStep(2);
  };

  return (
    <div className="space-y-8 text-left max-w-5xl mx-auto">
      {/* Wizard Header & Progress Bar */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => (step > 1 ? handleBackToSlots() : navigate(ROUTES.PATIENT.DASHBOARD))}
            className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{step > 1 ? 'Back to previous step' : 'Back to Dashboard'}</span>
          </button>

          <span className="text-xs font-semibold text-indigo-400">Step {step} of 3</span>
        </div>

        <div>
          <h1 className="text-2xl font-black text-white">Book Your Therapy Session</h1>
          <p className="mt-1 text-xs text-slate-400">
            Follow the guided wizard to choose a care provider, select a date, and reserve your
            slot.
          </p>
        </div>

        {/* Wizard Progress Tabs */}
        <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-900 border border-slate-800 rounded-2xl text-xs font-bold">
          <div
            className={cn(
              'py-2.5 px-3 rounded-xl flex items-center justify-center space-x-2 transition',
              step === 1 ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400',
            )}
          >
            <UserCheck className="w-4 h-4" />
            <span className="hidden sm:inline">1. Select Practitioner</span>
          </div>

          <div
            className={cn(
              'py-2.5 px-3 rounded-xl flex items-center justify-center space-x-2 transition',
              step === 2 ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400',
            )}
          >
            <Clock className="w-4 h-4" />
            <span className="hidden sm:inline">2. Choose Time Slot</span>
          </div>

          <div
            className={cn(
              'py-2.5 px-3 rounded-xl flex items-center justify-center space-x-2 transition',
              step === 3 ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400',
            )}
          >
            <Calendar className="w-4 h-4" />
            <span className="hidden sm:inline">3. Confirm Booking</span>
          </div>
        </div>
      </div>

      {/* Live Hold Countdown Banner during Step 3 */}
      {step === 3 && isHolding && <HoldCountdownBanner secondsRemaining={secondsRemaining} />}

      {/* Step 1: Select Practitioner */}
      {step === 1 && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white">Choose a Licensed Therapist</h3>
          <TherapistSelector
            therapists={therapists}
            selectedTherapistId={selectedTherapist?.id || null}
            onSelectTherapist={handleSelectTherapist}
            isLoading={isTherapistsLoading}
          />
        </div>
      )}

      {/* Step 2: Select Date & Available Time Slot */}
      {step === 2 && selectedTherapist && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400">Selected Practitioner</p>
              <h4 className="text-base font-bold text-white">{selectedTherapist.name}</h4>
              <p className="text-xs text-indigo-300">{selectedTherapist.specialization}</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => setStep(1)}>
              Change
            </Button>
          </div>

          <div className="space-y-3">
            <label
              htmlFor="bookingDatePicker"
              className="block text-xs font-semibold text-slate-300"
            >
              Select Date
            </label>
            <input
              id="bookingDatePicker"
              type="date"
              value={selectedDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-slate-900 text-white text-xs border border-slate-800 rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 transition"
            />
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white">Available Slots for {selectedDate}</h3>
            <SlotGrid
              slots={slots}
              selectedSlotId={selectedSlot?.id || null}
              onSelectSlot={handleSelectSlot}
              isLoading={isSlotsLoading}
            />
          </div>
        </div>
      )}

      {/* Step 3: Intake Notes & Final Confirmation */}
      {step === 3 && selectedTherapist && selectedSlot && (
        <BookingConfirmationForm
          patientId={patientId}
          therapist={selectedTherapist}
          slot={selectedSlot}
          onBack={handleBackToSlots}
        />
      )}
    </div>
  );
};

export default BookAppointmentPage;
