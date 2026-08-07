import React, { useState } from 'react';
import { FileText } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
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
      description={`Manage session observations, progress notes, and treatment plan for ${item.patient.name}.`}
      badge="EHR Medical Record"
      icon={<FileText className="w-6 h-6" />}
      variant="default"
      size="md"
      cancelLabel="Cancel"
      primaryAction={{
        label: 'Save Notes',
        onClick: handleSave,
        loading: isPending,
      }}
    >
      <div className="space-y-4 pt-1 text-left">
        <div>
          <label
            htmlFor="clinicalNotesInput"
            className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
          >
            Session Observations & Progress Notes
          </label>
          <textarea
            id="clinicalNotesInput"
            rows={5}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Type clinical observations, CBT homework exercises, or treatment recommendations..."
            className="w-full bg-slate-50/50 dark:bg-slate-850 text-slate-900 dark:text-slate-100 placeholder-slate-400 text-xs rounded-xl border border-slate-200/80 dark:border-slate-700 p-3.5 outline-none focus:border-[#0052cc] focus:ring-2 focus:ring-[#0052cc]/20 transition shadow-inner"
          />
        </div>
      </div>
    </Modal>
  );
};
