import React, { useState } from 'react';
import { Calendar, Clock, Video, XCircle } from 'lucide-react';
import type { PatientAppointment } from '../types/patient.types';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useCancelAppointment } from '../hooks/useCancelAppointment';
import {
  getStatusBadgeConfig,
  canTransitionStatus,
} from '@/features/appointments/utils/appointmentLifecycle';

interface AppointmentCardProps {
  appointment: PatientAppointment;
}

export const AppointmentCard: React.FC<AppointmentCardProps> = ({ appointment }) => {
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const { mutate: cancelAppt, isPending: isCancelling } = useCancelAppointment(
    appointment.patientId,
  );

  const startDate = new Date(appointment.startTime);
  const canCancel = canTransitionStatus(appointment.status, 'CANCELLED');
  const badgeConfig = getStatusBadgeConfig(appointment.status);

  const handleConfirmCancel = () => {
    cancelAppt(appointment.id, {
      onSuccess: () => setIsCancelModalOpen(false),
    });
  };

  return (
    <>
      <Card className="bg-slate-900/90 border-slate-800 hover:border-slate-700/80 transition-all text-left">
        <CardContent className="p-5 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h4 className="text-base font-bold text-white">{appointment.therapist.name}</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                {appointment.therapist.specialization}
              </p>
            </div>
            <Badge variant={badgeConfig.variant} size="sm">
              {badgeConfig.label}
            </Badge>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
            <div className="flex items-center space-x-1.5 bg-slate-800/60 px-3 py-1.5 rounded-lg border border-slate-700/50">
              <Calendar className="w-3.5 h-3.5 text-indigo-400" />
              <span>
                {startDate.toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </div>

            <div className="flex items-center space-x-1.5 bg-slate-800/60 px-3 py-1.5 rounded-lg border border-slate-700/50">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              <span>
                {startDate.toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          </div>

          {appointment.notes && (
            <p className="text-xs text-slate-400 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 italic">
              "{appointment.notes}"
            </p>
          )}

          {canCancel && (
            <div className="flex items-center justify-between pt-2 border-t border-slate-800/60">
              {appointment.meetingLink ? (
                <a href={appointment.meetingLink} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm" leftIcon={<Video className="w-3.5 h-3.5" />}>
                    Join Video
                  </Button>
                </a>
              ) : (
                <div />
              )}

              <Button
                variant="ghost"
                size="sm"
                className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
                leftIcon={<XCircle className="w-3.5 h-3.5" />}
                onClick={() => setIsCancelModalOpen(true)}
              >
                Cancel Session
              </Button>
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
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1">
            <p>
              <strong className="text-white">Therapist:</strong> {appointment.therapist.name}
            </p>
            <p>
              <strong className="text-white">Scheduled Time:</strong> {startDate.toLocaleString()}
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
    </>
  );
};
