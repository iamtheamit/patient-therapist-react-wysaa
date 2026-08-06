import React, { useState } from 'react';
import { Calendar, Clock, UserCheck, ShieldCheck } from 'lucide-react';
import type { TherapistProfile, AvailableSlot } from '../types/appointments.types';
import type { RecurringRule } from '../types/recurring.types';
import { RecurringRuleSelector } from './RecurringRuleSelector';
import { Button } from '@/components/ui/Button';
import { useBookAppointment, useBookRecurringAppointment } from '../hooks/useBookAppointment';

interface BookingConfirmationFormProps {
  patientId: string;
  therapist: TherapistProfile;
  slot: AvailableSlot;
  onBack: () => void;
}

export const BookingConfirmationForm: React.FC<BookingConfirmationFormProps> = ({
  patientId,
  therapist,
  slot,
  onBack,
}) => {
  const [notes, setNotes] = useState('');
  const [recurringRule, setRecurringRule] = useState<RecurringRule>({
    frequency: 'SINGLE',
    occurrencesCount: 1,
  });

  const { mutate: bookSingle, isPending: isSinglePending } = useBookAppointment();
  const { mutate: bookRecurring, isPending: isRecurringPending } = useBookRecurringAppointment();

  const isPending = isSinglePending || isRecurringPending;
  const startDate = new Date(slot.startTime);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (recurringRule.frequency === 'SINGLE') {
      bookSingle({
        patientId,
        therapistId: therapist.id,
        slotId: slot.id,
        notes: notes.trim() || undefined,
      });
    } else {
      bookRecurring({
        patientId,
        therapistId: therapist.id,
        baseSlotId: slot.id,
        recurringRule,
        notes: notes.trim() || undefined,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-left max-w-2xl mx-auto">
      {/* Booking Summary Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center space-x-2 text-indigo-400 text-xs font-semibold">
          <ShieldCheck className="w-4 h-4" />
          <span>Appointment Summary</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
          <div>
            <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
              Therapist
            </p>
            <p className="text-sm font-bold text-white mt-0.5">{therapist.name}</p>
            <p className="text-xs text-indigo-300">{therapist.specialization}</p>
          </div>

          <div>
            <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
              Date & Time
            </p>
            <div className="flex items-center space-x-2 text-xs font-medium text-white mt-1">
              <Calendar className="w-3.5 h-3.5 text-indigo-400" />
              <span>
                {startDate.toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-xs font-medium text-slate-300 mt-0.5">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              <span>
                {startDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recurring Schedule Type Selector */}
      <RecurringRuleSelector
        value={recurringRule}
        onChange={setRecurringRule}
        baseStartTime={slot.startTime}
      />

      {/* Intake Notes Input */}
      <div className="space-y-2">
        <label htmlFor="intakeNotes" className="block text-xs font-semibold text-slate-300">
          Session Focus & Intake Notes (Optional)
        </label>
        <textarea
          id="intakeNotes"
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Briefly describe what you would like to focus on during this session (e.g., anxiety management, sleep support)..."
          className="w-full bg-slate-900 text-white placeholder-slate-500 text-xs rounded-xl border border-slate-800 p-3 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-4">
        <Button type="button" variant="ghost" size="md" onClick={onBack}>
          Back to Slots
        </Button>

        <Button
          type="submit"
          variant="primary"
          size="md"
          isLoading={isPending}
          rightIcon={<UserCheck className="w-4 h-4" />}
        >
          {recurringRule.frequency === 'SINGLE'
            ? 'Confirm & Reserve Session'
            : `Reserve ${recurringRule.occurrencesCount} Recurring Sessions`}
        </Button>
      </div>
    </form>
  );
};
