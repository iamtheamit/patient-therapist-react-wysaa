import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { useUpdateClinicalNotes } from '../hooks/useUpdateAppointmentStatus';
import type { TherapistAgendaItem } from '../types/therapist.types';

interface ClinicalNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: TherapistAgendaItem | null;
}

export const ClinicalNotesModal: React.FC<ClinicalNotesModalProps> = ({
  isOpen,
  onClose,
  item,
}) => {
  const [prevItemId, setPrevItemId] = useState<string | null>(null);
  const [notes, setNotes] = useState('');

  // Sync state during render when a new item is selected (React 19 recommended pattern)
  if (item && item.id !== prevItemId) {
    setPrevItemId(item.id);
    setNotes(item.notes || '');
  }

  const therapistId = item?.therapistId || 'therapist-doc-1';
  const { mutate: saveNotes, isPending } = useUpdateClinicalNotes(therapistId);

  if (!item) return null;

  const handleSave = () => {
    saveNotes(
      { appointmentId: item.id, notes },
      {
        onSuccess: () => onClose(),
      },
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Clinical Session Notes"
      description={`Manage session observations and treatment plan for ${item.patient.name}.`}
    >
      <div className="space-y-4 pt-2 text-left">
        <div>
          <label
            htmlFor="clinicalNotesInput"
            className="block text-xs font-semibold text-slate-300 mb-1.5"
          >
            Session Notes & Diagnosis Observations
          </label>
          <textarea
            id="clinicalNotesInput"
            rows={5}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Type clinical progress notes, CBT exercises, or prescription recommendations..."
            className="w-full bg-slate-950 text-white placeholder-slate-500 text-xs rounded-xl border border-slate-800 p-3 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition"
          />
        </div>

        <div className="flex items-center justify-end space-x-3 pt-2">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" isLoading={isPending} onClick={handleSave}>
            Save Clinical Notes
          </Button>
        </div>
      </div>
    </Modal>
  );
};
