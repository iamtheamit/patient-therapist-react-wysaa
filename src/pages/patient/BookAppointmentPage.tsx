import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
    <div className="space-y-8 text-left w-full">
      {/* Wizard Header & Progress Bar */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => (step > 1 ? handleBackToSlots() : navigate(ROUTES.PATIENT.DASHBOARD))}
            className="inline-flex items-center space-x-2 text-xs font-semibold text-[#51606f] hover:text-[#191c1e] transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{step > 1 ? 'Back to previous step' : 'Back to Dashboard'}</span>
          </button>

          <span className="text-xs font-semibold text-[#003d9b]">Step {step} of 3</span>
        </div>

        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-[#191c1e]">
            Book Your Therapy Session
          </h1>
          <p className="mt-1 text-xs text-[#434654]">
            Follow the guided wizard to choose a care provider, select a date, and reserve your
            slot.
          </p>
        </div>

        {/* Wizard Progress Tabs */}
        <div className="grid grid-cols-3 gap-2 p-1.5 bg-white border border-[#c3c6d6]/40 rounded-2xl text-xs font-bold shadow-xs">
          <div
            className={cn(
              'relative py-2.5 px-3 rounded-lg flex items-center justify-center space-x-2 transition-colors z-10',
              step === 1 ? 'text-white' : 'text-[#51606f]',
            )}
          >
            {step === 1 && (
              <motion.div
                layoutId="wizardPill"
                className="absolute inset-0 bg-[#003d9b] rounded-lg shadow-xs -z-10"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <UserCheck className="w-4 h-4" />
            <span className="hidden sm:inline">1. Select Practitioner</span>
          </div>

          <div
            className={cn(
              'relative py-2.5 px-3 rounded-lg flex items-center justify-center space-x-2 transition-colors z-10',
              step === 2 ? 'text-white' : 'text-[#51606f]',
            )}
          >
            {step === 2 && (
              <motion.div
                layoutId="wizardPill"
                className="absolute inset-0 bg-[#003d9b] rounded-lg shadow-xs -z-10"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <Clock className="w-4 h-4" />
            <span className="hidden sm:inline">2. Choose Time Slot</span>
          </div>

          <div
            className={cn(
              'relative py-2.5 px-3 rounded-lg flex items-center justify-center space-x-2 transition-colors z-10',
              step === 3 ? 'text-white' : 'text-[#51606f]',
            )}
          >
            {step === 3 && (
              <motion.div
                layoutId="wizardPill"
                className="absolute inset-0 bg-[#003d9b] rounded-lg shadow-xs -z-10"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <Calendar className="w-4 h-4" />
            <span className="hidden sm:inline">3. Confirm Booking</span>
          </div>
        </div>
      </div>

      {/* Live Hold Countdown Banner during Step 3 */}
      <AnimatePresence>
        {step === 3 && isHolding && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            <HoldCountdownBanner secondsRemaining={secondsRemaining} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Animated Step Content Container */}
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-heading font-bold text-[#191c1e]">
              Choose a Licensed Therapist
            </h3>
            <TherapistSelector
              therapists={therapists}
              selectedTherapistId={selectedTherapist?.id || null}
              onSelectTherapist={handleSelectTherapist}
              isLoading={isTherapistsLoading}
            />
          </motion.div>
        )}

        {step === 2 && selectedTherapist && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            <div className="bg-white border border-[#c3c6d6]/40 p-4 rounded-2xl flex items-center justify-between shadow-xs">
              <div>
                <p className="text-xs text-[#434654]">Selected Practitioner</p>
                <h4 className="text-base font-heading font-bold text-[#191c1e]">
                  {selectedTherapist.name}
                </h4>
                <p className="text-xs text-[#003d9b] font-semibold">
                  {selectedTherapist.specialization}
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={() => setStep(1)}>
                Change
              </Button>
            </div>

            <div className="space-y-3">
              <label
                htmlFor="bookingDatePicker"
                className="block text-xs font-semibold text-[#434654]"
              >
                Select Date
              </label>
              <input
                id="bookingDatePicker"
                type="date"
                value={selectedDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-white text-[#191c1e] text-xs border border-[#c3c6d6]/50 rounded-lg px-4 py-2.5 outline-none focus:border-[#003d9b] focus:ring-2 focus:ring-[#003d9b]/20 transition"
              />
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-heading font-bold text-[#191c1e]">
                Available Slots for {selectedDate}
              </h3>
              <SlotGrid
                slots={slots}
                selectedSlotId={selectedSlot?.id || null}
                onSelectSlot={handleSelectSlot}
                isLoading={isSlotsLoading}
              />
            </div>
          </motion.div>
        )}

        {step === 3 && selectedTherapist && selectedSlot && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            <BookingConfirmationForm
              patientId={patientId}
              therapist={selectedTherapist}
              slot={selectedSlot}
              onBack={handleBackToSlots}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BookAppointmentPage;
