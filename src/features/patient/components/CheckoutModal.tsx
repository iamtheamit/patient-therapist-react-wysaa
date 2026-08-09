import React from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import type { DashboardAppointment } from '@/features/dashboard';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedHold: DashboardAppointment;
  isBooking: boolean;
  onConfirm: (payload: {
    patientId: string;
    therapistId: string;
    slotId: string;
    holdId: string;
    therapistName: string;
  }) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  selectedHold,
  isBooking,
  onConfirm,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Complete Session Payment"
      description="Review your held appointment details and confirm payment to secure your booking."
    >
      <div className="space-y-4 pt-2 text-[#191c1e] text-xs">
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-left">
          <h4 className="font-heading font-bold text-sm text-[#191c1e]">
            {selectedHold.therapist?.name || 'Therapist Session'}
          </h4>
          <p className="text-secondary font-medium">
            {selectedHold.therapist?.specialization || 'Cognitive Behavioral Therapy (CBT)'}
          </p>
          <div className="pt-2 border-t border-slate-200/60 flex justify-between font-bold text-[#191c1e]">
            <span>Date:</span>
            <span>
              {new Date(selectedHold.startTime).toLocaleDateString(undefined, {
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
              {new Date(selectedHold.startTime).toLocaleTimeString(undefined, {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-b border-slate-100 py-3.5 font-bold">
          <span className="text-[#51606f]">Session Fee:</span>
          <span className="text-lg text-[#191c1e]">
            {(selectedHold as unknown as Record<string, unknown>).price !== undefined
              ? `$${(selectedHold as unknown as Record<string, unknown>).price}`
              : '$150.00'}
          </span>
        </div>

        <div className="p-3 bg-[#e5eeff] text-[#003d9b] rounded-xl border border-[#0052cc]/20 flex items-center gap-2 font-semibold">
          <span className="w-2 h-2 rounded-full bg-[#0052cc] animate-ping shrink-0" />
          <span>Secure payment via payment method on file</span>
        </div>

        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Back
          </Button>
          <Button
            variant="primary"
            size="sm"
            isLoading={isBooking}
            onClick={() => {
              onConfirm({
                patientId: selectedHold.patientId,
                therapistId: selectedHold.therapistId || selectedHold.therapist?.id || '',
                slotId: `slot-${selectedHold.id}`,
                holdId: selectedHold.id,
                therapistName: selectedHold.therapist?.name || 'Therapist',
              });
            }}
          >
            Confirm Booking
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default CheckoutModal;
