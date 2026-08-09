import React, { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Calendar, Clock, Video, XCircle, ShieldCheck, MonitorPlay } from 'lucide-react';
import type { PatientAppointment } from '../types/patient.types';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useCancelAppointment } from '../hooks/useCancelAppointment';
import { useBookAppointment } from '@/features/appointments/hooks/useBookAppointment';
import {
  getStatusBadgeConfig,
  canTransitionStatus,
} from '@/features/appointments/utils/appointmentLifecycle';

interface AppointmentCardProps {
  appointment: PatientAppointment;
}

export const AppointmentCard: React.FC<AppointmentCardProps> = ({ appointment }) => {
  const queryClient = useQueryClient();
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const { mutate: cancelAppt, isPending: isCancelling } = useCancelAppointment(
    appointment.patientId,
  );
  const { mutate: bookSingle, isPending: isBooking } = useBookAppointment();

  const startDate = new Date(appointment.startTime);
  const badgeConfig = getStatusBadgeConfig(appointment.status);

  const [timeLeft, setTimeLeft] = useState<number>(() => {
    if (!appointment.holdExpiresAt) return 0;
    const expires = new Date(appointment.holdExpiresAt).getTime();
    return Math.max(0, Math.floor((expires - Date.now()) / 1000));
  });

  useEffect(() => {
    if (!appointment.holdExpiresAt || timeLeft <= 0) return;
    const interval = setInterval(() => {
      const expires = new Date(appointment.holdExpiresAt!).getTime();
      const diff = Math.max(0, Math.floor((expires - Date.now()) / 1000));
      setTimeLeft(diff);
      if (diff <= 0) {
        clearInterval(interval);
        queryClient.invalidateQueries({ queryKey: ['appointments'] });
        queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [appointment.holdExpiresAt, timeLeft, queryClient]);

  const handleConfirmCancel = () => {
    cancelAppt(appointment.id, {
      onSuccess: () => setIsCancelModalOpen(false),
    });
  };

  const handleCompletePayment = () => {
    bookSingle(
      {
        patientId: appointment.patientId,
        therapistId: appointment.therapist.id,
        slotId: `slot-${appointment.id}`,
        holdId: appointment.id,
        therapistName: appointment.therapist.name,
        notes: appointment.notes,
      },
      {
        onSuccess: () => {
          setIsCheckoutOpen(false);
        },
      },
    );
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const isHoldExpired = appointment.status === 'HELD' && timeLeft <= 0;
  const canCancel = canTransitionStatus(appointment.status, 'CANCELLED') && !isHoldExpired;

  const initials = appointment.therapist.name
    .replace('Dr. ', '')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <>
      <Card className="bg-white border border-[#c3c6d6]/40 hover:border-primary/40 hover:shadow-md transition-all duration-300 text-left rounded-2xl overflow-hidden group">
        <CardContent className="p-6 space-y-5">
          {/* Top Row: Therapist Info & Badge */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div className="flex items-start gap-4">
              {/* Avatar Initial Bubble */}
              <div className="relative shrink-0">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#003d9b] to-[#0052cc] text-white font-bold text-sm flex items-center justify-center border-2 border-white shadow-sm shrink-0 select-none group-hover:scale-105 transition-transform duration-200">
                  {initials}
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-base font-heading font-bold text-[#191c1e] group-hover:text-primary transition-colors duration-200">
                    {appointment.therapist.name}
                  </h4>
                  <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" /> Verified Practitioner
                  </span>
                </div>
                <p className="text-xs text-[#51606f] font-semibold">
                  {appointment.therapist.specialization}
                </p>
                <div className="text-[10px] font-mono text-outline select-all bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100 w-fit">
                  Booking ID: {appointment.id.toUpperCase().substring(0, 8)}
                </div>
              </div>
            </div>

            <div className="self-start sm:self-center flex items-center gap-2">
              {appointment.status === 'HELD' && timeLeft > 0 && (
                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 animate-pulse">
                  Expires in {formattedTime}
                </span>
              )}
              <Badge
                variant={
                  timeLeft <= 0 && appointment.status === 'HELD' ? 'neutral' : badgeConfig.variant
                }
                size="md"
                className="capitalize px-3 py-1 font-semibold rounded-full border"
              >
                {timeLeft <= 0 && appointment.status === 'HELD'
                  ? 'Expired Hold'
                  : badgeConfig.label}
              </Badge>
            </div>
          </div>

          {/* Middle Row: Schedule Badges & Session Info */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-[#191c1e]">
            <div className="flex items-center space-x-2 bg-[#f8f9ff] px-3.5 py-2 rounded-xl border border-[#c3c6d6]/30 font-semibold shadow-2xs">
              <Calendar className="w-4 h-4 text-[#0052cc]" />
              <span>
                {startDate.toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </div>

            <div className="flex items-center space-x-2 bg-[#f8f9ff] px-3.5 py-2 rounded-xl border border-[#c3c6d6]/30 font-semibold shadow-2xs">
              <Clock className="w-4 h-4 text-[#0052cc]" />
              <span>
                {startDate.toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>

            <div className="flex items-center space-x-2 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200 font-medium text-secondary">
              <MonitorPlay className="w-4 h-4 text-[#51606f]" />
              <span>50-Min Telehealth Visit</span>
            </div>
          </div>

          {/* Notes (if any) */}
          {appointment.notes && (
            <div className="bg-[#f8f9ff]/70 p-4 rounded-xl border border-slate-100 relative">
              <span className="text-[10px] text-outline font-bold uppercase tracking-wider block mb-1">
                Client Focus Topics
              </span>
              <p className="text-xs text-[#51606f] leading-relaxed italic">"{appointment.notes}"</p>
            </div>
          )}

          {/* Bottom Actions Row */}
          {(canCancel ||
            appointment.meetingLink ||
            (appointment.status === 'HELD' && timeLeft > 0)) && (
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 gap-4 flex-wrap sm:flex-nowrap">
              {appointment.status === 'HELD' && timeLeft > 0 ? (
                <Button
                  variant="gradient"
                  size="sm"
                  pill
                  onClick={() => setIsCheckoutOpen(true)}
                  leftIcon={<Clock className="w-3.5 h-3.5" />}
                >
                  Pay &amp; Confirm
                </Button>
              ) : appointment.status !== 'CANCELLED' &&
                appointment.status !== 'HOLD_EXPIRED' &&
                appointment.meetingLink ? (
                <a href={appointment.meetingLink} target="_blank" rel="noopener noreferrer">
                  <Button
                    variant="gradient"
                    size="sm"
                    pill
                    leftIcon={<Video className="w-3.5 h-3.5" />}
                  >
                    Join Video Session
                  </Button>
                </a>
              ) : (
                <div />
              )}

              {canCancel && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                  leftIcon={<XCircle className="w-3.5 h-3.5" />}
                  onClick={() => setIsCancelModalOpen(true)}
                >
                  Cancel Session
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Confirmation Modal for Session Cancellation */}
      <Modal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        title="Cancel Therapy Session"
        description="Are you sure you want to cancel this appointment? This action cannot be undone."
      >
        <div className="space-y-4 pt-2">
          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 text-xs text-[#505f76] space-y-1">
            <p>
              <strong className="text-[#191c1e]">Therapist:</strong> {appointment.therapist.name}
            </p>
            <p>
              <strong className="text-[#191c1e]">Scheduled Time:</strong>{' '}
              {startDate.toLocaleString()}
            </p>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-2">
            <Button variant="ghost" size="sm" onClick={() => setIsCancelModalOpen(false)}>
              Keep Appointment
            </Button>
            <Button
              variant="danger"
              size="sm"
              isLoading={isCancelling}
              onClick={handleConfirmCancel}
            >
              Confirm Cancel
            </Button>
          </div>
        </div>
      </Modal>

      {/* Checkout Payment Modal */}
      <Modal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        title="Complete Session Payment"
        description="Review your appointment details and confirm payment to secure your booking."
      >
        <div className="space-y-4 pt-2 text-[#191c1e] text-xs">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <h4 className="font-heading font-bold text-sm text-[#191c1e]">
              {appointment.therapist.name}
            </h4>
            <p className="text-secondary font-medium">{appointment.therapist.specialization}</p>
            <div className="pt-2 border-t border-slate-200/60 flex justify-between font-bold text-[#191c1e]">
              <span>Date:</span>
              <span>
                {new Date(appointment.startTime).toLocaleDateString(undefined, {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </div>
            <div className="flex justify-between font-bold text-[#191c1e]">
              <span>Time:</span>
              <span>
                {new Date(appointment.startTime).toLocaleTimeString(undefined, {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-b border-slate-100 py-3.5 font-bold">
            <span className="text-[#51606f]">Session Fee:</span>
            <span className="text-lg text-[#191c1e]">$150.00</span>
          </div>

          <div className="p-3 bg-[#e5eeff] text-[#003d9b] rounded-xl border border-[#0052cc]/20 flex items-center gap-2 font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#0052cc] animate-ping shrink-0" />
            <span>Secure payment via HSA/FSA Card (•••• 4242)</span>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
            <Button variant="ghost" size="sm" onClick={() => setIsCheckoutOpen(false)}>
              Back
            </Button>
            <Button
              variant="primary"
              size="sm"
              isLoading={isBooking}
              onClick={handleCompletePayment}
            >
              Confirm &amp; Pay $150
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
