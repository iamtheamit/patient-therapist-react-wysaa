import React, { useState } from 'react';
import { Calendar, Clock, Video, FileText, User as UserIcon } from 'lucide-react';
import type { TherapistAgendaItem } from '../types/therapist.types';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ClinicalNotesModal } from './ClinicalNotesModal';
import { useUpdateAppointmentStatus } from '../hooks/useUpdateAppointmentStatus';
import type { AppointmentStatus } from '@/features/patient/types/patient.types';

interface AgendaListProps {
  items?: TherapistAgendaItem[];
  isLoading?: boolean;
  therapistId: string;
}

export const AgendaList: React.FC<AgendaListProps> = ({ items, isLoading, therapistId }) => {
  const [selectedItemForNotes, setSelectedItemForNotes] = useState<TherapistAgendaItem | null>(
    null,
  );
  const { mutate: updateStatus } = useUpdateAppointmentStatus(therapistId);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-28 bg-slate-100 animate-pulse rounded-2xl border border-slate-200"
          />
        ))}
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="p-8 text-center bg-white border border-slate-200 rounded-2xl shadow-sm">
        <p className="text-sm text-[#505f76]">No client appointments scheduled for this view.</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4 text-left">
        {items.map((item) => {
          const startDate = new Date(item.startTime);
          const isConfirmed = item.status === 'CONFIRMED';
          const isCompleted = item.status === 'COMPLETED';

          return (
            <Card
              key={item.id}
              className="bg-white border-slate-200 hover:border-slate-300 transition-all shadow-sm"
            >
              <CardContent className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-xl bg-[#d1fae5] border border-[#a7f3d0] text-[#005237] flex items-center justify-center font-bold flex-shrink-0 mt-0.5">
                    <UserIcon className="w-5 h-5" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center space-x-3">
                      <h4 className="text-base font-heading font-bold text-[#191c1e]">
                        {item.patient.name}
                      </h4>
                      <Badge
                        variant={isConfirmed ? 'success' : isCompleted ? 'info' : 'neutral'}
                        size="sm"
                      >
                        {item.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-[#505f76]">{item.patient.email}</p>

                    <div className="flex items-center space-x-3 text-xs text-[#505f76] pt-1">
                      <span className="flex items-center gap-1 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-[#005237]" />
                        {startDate.toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 font-medium">
                        <Clock className="w-3.5 h-3.5 text-[#005237]" />
                        {startDate.toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<FileText className="w-3.5 h-3.5" />}
                    onClick={() => setSelectedItemForNotes(item)}
                  >
                    Clinical Notes
                  </Button>

                  {item.meetingLink && isConfirmed && (
                    <a href={item.meetingLink} target="_blank" rel="noopener noreferrer">
                      <Button
                        variant="secondary"
                        size="sm"
                        leftIcon={<Video className="w-3.5 h-3.5" />}
                      >
                        Join Call
                      </Button>
                    </a>
                  )}

                  <select
                    value={item.status.toUpperCase()}
                    onChange={(e) =>
                      updateStatus({
                        appointmentId: item.id,
                        status: e.target.value as AppointmentStatus,
                      })
                    }
                    className="bg-white border border-[#c3c6d6]/70 text-[#191c1e] rounded-lg px-2.5 py-1.5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#0052cc]/30 cursor-pointer"
                  >
                    <option value="SCHEDULED">Scheduled</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="NO_SHOW">No-Show</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <ClinicalNotesModal
        isOpen={Boolean(selectedItemForNotes)}
        onClose={() => setSelectedItemForNotes(null)}
        item={selectedItemForNotes}
      />
    </>
  );
};
