import React, { useState } from 'react';
import { FileText, MessageSquare } from 'lucide-react';
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
  const [clinicalNotes, setClinicalNotes] = useState('');

  // Sync state during render when a new item is selected (React 19 recommended pattern)
  if (item && item.id !== prevItemId) {
    setPrevItemId(item.id);
    setClinicalNotes(item.clinicalNotes || '');
  }

  const therapistId = item?.therapistId || 'therapist-doc-1';
  const { mutate: saveNotes, isPending } = useUpdateClinicalNotes(therapistId);

  if (!item) return null;

  const handleSave = () => {
    saveNotes(
      { appointmentId: item.id, notes: clinicalNotes },
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
        {/* Patient's booking note — read-only */}
        {item.notes && (
          <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-3.5">
            <div className="flex items-center gap-1.5 mb-2">
              <MessageSquare className="w-3.5 h-3.5 text-[#0052cc]" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#0052cc]">
                Patient's Note
              </span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed italic">"{item.notes}"</p>
          </div>
        )}

        {/* Therapist's editable clinical notes */}
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
            value={clinicalNotes}
            onChange={(e) => setClinicalNotes(e.target.value)}
            placeholder="Type clinical observations, CBT homework exercises, or treatment recommendations..."
            className="w-full bg-slate-50/50 dark:bg-slate-850 text-slate-900 dark:text-slate-100 placeholder-slate-400 text-xs rounded-xl border border-slate-200/80 dark:border-slate-700 p-3.5 outline-none focus:border-[#0052cc] focus:ring-2 focus:ring-[#0052cc]/20 transition shadow-inner"
          />
        </div>
      </div>
    </Modal>
  );
};
