import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  UserCheck,
  ShieldCheck,
  Award,
  Video,
  CheckCircle2,
  Lock,
  ArrowLeft,
  FileText,
} from 'lucide-react';
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

const QUICK_FOCUS_TOPICS = [
  'Anxiety & Stress Management',
  'Depression & Mood Support',
  'Sleep & Insomnia',
  'Life Transition & Growth',
  'Relationship & Family Counseling',
];

export const BookingConfirmationForm: React.FC<BookingConfirmationFormProps> = ({
  patientId,
  therapist,
  slot,
  onBack,
}) => {
  const [notes, setNotes] = useState('');
  const [avatarError, setAvatarError] = useState(false);
  const [recurringRule, setRecurringRule] = useState<RecurringRule>({
    frequency: 'SINGLE',
    occurrencesCount: 1,
  });

  const { mutate: bookSingle, isPending: isSinglePending } = useBookAppointment();
  const { mutate: bookRecurring, isPending: isRecurringPending } = useBookRecurringAppointment();

  const isPending = isSinglePending || isRecurringPending;
  const startDate = new Date(slot.startTime);

  const handleQuickTopicClick = (topic: string) => {
    if (!notes.includes(topic)) {
      setNotes((prev) => (prev ? `${prev}, ${topic}` : topic));
    }
  };

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

  const initials = therapist.name
    .replace('Dr. ', '')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  const sessionTotal =
    recurringRule.frequency === 'SINGLE' ? 150 : 150 * recurringRule.occurrencesCount;

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-6 text-left">
      {/* Clinician & Session Overview Card */}
      <div className="bg-white border border-[#c3c6d6]/40 rounded-2xl p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2 text-[#0052cc]">
            <ShieldCheck className="w-4 h-4 text-[#0052cc]" />
            <h3 className="font-heading font-bold text-sm text-[#191c1e]">
              Confirmed Appointment Summary
            </h3>
          </div>

          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Verified Practitioner Slot
          </span>
        </div>

        {/* Practitioner Details */}
        <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="relative shrink-0">
              {!therapist.avatarUrl || avatarError ? (
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#003d9b] to-[#0052cc] text-white font-bold text-sm flex items-center justify-center border-2 border-white shadow-xs">
                  {initials}
                </div>
              ) : (
                <img
                  src={therapist.avatarUrl}
                  alt=""
                  onError={() => setAvatarError(true)}
                  className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-xs"
                />
              )}
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-heading font-bold text-base text-[#191c1e]">
                  {therapist.name}
                </h4>
                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  ★ {therapist.rating} (128 reviews)
                </span>
              </div>
              <p className="text-xs font-semibold text-[#0052cc]">{therapist.specialization}</p>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-[#f8f9ff] text-[#51606f] px-2.5 py-0.5 rounded-md border border-[#c3c6d6]/40">
                  <Award className="w-3 h-3 text-[#0052cc]" /> MD, PsyD Certified
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-[#f8f9ff] text-[#51606f] px-2.5 py-0.5 rounded-md border border-[#c3c6d6]/40">
                  <Video className="w-3 h-3 text-[#0052cc]" /> 50-Min Telehealth Visit
                </span>
              </div>
            </div>
          </div>

          {/* Pricing Highlight */}
          <div className="sm:text-right bg-[#f8f9ff] p-3 rounded-xl border border-[#c3c6d6]/50 min-w-[130px] shrink-0">
            <span className="text-[10px] text-[#51606f] font-bold uppercase tracking-wider block">
              Session Fee
            </span>
            <span className="font-heading font-bold text-lg text-[#191c1e]">
              $150 <span className="text-[11px] font-normal text-[#51606f]">/ visit</span>
            </span>
          </div>
        </div>

        {/* Date & Time Highlight Boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div className="p-3.5 bg-[#f8f9ff] rounded-xl border border-[#c3c6d6]/50 flex items-center gap-3">
            <div className="p-2 bg-[#0052cc] text-white rounded-lg shrink-0 shadow-2xs">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-[#0052cc] uppercase tracking-wider block">
                Reserved Date
              </span>
              <span className="font-bold text-xs text-[#191c1e]">
                {startDate.toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </div>
          </div>

          <div className="p-3.5 bg-[#f8f9ff] rounded-xl border border-[#c3c6d6]/50 flex items-center gap-3">
            <div className="p-2 bg-[#0052cc] text-white rounded-lg shrink-0 shadow-2xs">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-[#0052cc] uppercase tracking-wider block">
                Session Time
              </span>
              <span className="font-bold text-xs text-[#191c1e]">
                {startDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} EST
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Schedule Type Selector */}
      <RecurringRuleSelector
        value={recurringRule}
        onChange={setRecurringRule}
        baseStartTime={slot.startTime}
      />

      {/* Session Focus & Intake Notes Section */}
      <div className="bg-white border border-[#c3c6d6]/40 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2 text-[#0052cc]">
            <FileText className="w-4 h-4 text-[#0052cc]" />
            <h3 className="font-heading font-bold text-sm text-[#191c1e]">
              Session Focus &amp; Clinical Notes (Optional)
            </h3>
          </div>
          <span className="text-xs text-[#51606f]">Shared only with your therapist</span>
        </div>

        {/* Quick Topic Chips */}
        <div className="space-y-2">
          <span className="text-[11px] font-semibold text-[#51606f] block">
            Click quick topics to include in your session focus note:
          </span>
          <div className="flex flex-wrap gap-2">
            {QUICK_FOCUS_TOPICS.map((topic) => (
              <button
                key={topic}
                type="button"
                onClick={() => handleQuickTopicClick(topic)}
                className="px-3 py-1 rounded-full text-xs font-semibold bg-[#f8f9ff] text-[#51606f] border border-[#c3c6d6]/50 hover:border-[#0052cc] hover:text-[#0052cc] transition cursor-pointer"
              >
                + {topic}
              </button>
            ))}
          </div>
        </div>

        <textarea
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Briefly describe what you would like to focus on during this session (e.g., anxiety management, stress reduction, sleep support)..."
          className="w-full bg-[#f8f9ff] text-[#191c1e] placeholder-slate-400 text-xs rounded-xl border border-[#c3c6d6]/60 p-3.5 outline-none focus:border-[#0052cc] focus:bg-white focus:ring-2 focus:ring-[#0052cc]/15 transition"
        />
      </div>

      {/* Harmonized Brand Checkout Bar */}
      <div className="bg-[#f8f9ff] border border-[#c3c6d6]/60 rounded-2xl p-6 shadow-sm space-y-4 text-[#191c1e]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#c3c6d6]/40 pb-4">
          <div className="space-y-0.5">
            <span className="text-xs text-[#51606f] font-bold block">Total Session Fee</span>
            <div className="flex items-baseline gap-2">
              <span className="font-heading text-2xl font-bold text-[#191c1e]">
                ${sessionTotal}.00
              </span>
              {recurringRule.frequency !== 'SINGLE' && (
                <span className="text-xs text-[#0052cc] font-semibold">
                  ({recurringRule.occurrencesCount} visits @ $150 each)
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-[#003d9b] bg-[#e5eeff] px-3.5 py-2 rounded-xl border border-[#0052cc]/20">
            <Lock className="w-4 h-4 text-[#0052cc]" />
            <span>100% HIPAA Compliant &amp; Encrypted Checkout</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-1">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs font-bold text-[#51606f] hover:text-[#191c1e] transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Change Time Slot
          </button>

          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isPending}
            className="bg-[#0052cc] hover:bg-[#003d9b] text-white font-bold text-xs py-3 px-6 shadow-xs cursor-pointer"
            rightIcon={<UserCheck className="w-4 h-4" />}
          >
            {recurringRule.frequency === 'SINGLE'
              ? 'Confirm & Reserve Session'
              : `Reserve ${recurringRule.occurrencesCount} Recurring Sessions`}
          </Button>
        </div>
      </div>
    </form>
  );
};
