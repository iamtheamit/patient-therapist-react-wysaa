import React, { useState } from 'react';
import { Calendar, Clock, Video, CheckCircle, FileText, User as UserIcon } from 'lucide-react';
import type { TherapistAgendaItem } from '../types/therapist.types';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ClinicalNotesModal } from './ClinicalNotesModal';
import { useUpdateAppointmentStatus } from '../hooks/useUpdateAppointmentStatus';

interface AgendaListProps {
  items?: TherapistAgendaItem[];
  isLoading?: boolean;
  therapistId: string;
}

export const AgendaList: React.FC<AgendaListProps> = ({ items, isLoading, therapistId }) => {
  const [selectedItemForNotes, setSelectedItemForNotes] = useState<TherapistAgendaItem | null>(
    null,
  );
  const { mutate: updateStatus, isPending: isUpdatingStatus } =
    useUpdateAppointmentStatus(therapistId);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-28 bg-slate-900/60 animate-pulse rounded-2xl border border-slate-800"
          />
        ))}
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="p-8 text-center bg-slate-900/50 border border-slate-800 rounded-2xl">
        <p className="text-sm text-slate-400">No client appointments scheduled for this view.</p>
      </div>
    );
  }

  const handleMarkCompleted = (appointmentId: string) => {
    updateStatus({ appointmentId, status: 'COMPLETED' });
  };

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
              className="bg-slate-900/90 border-slate-800 hover:border-slate-700/80 transition-all"
            >
              <CardContent className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center font-bold flex-shrink-0 mt-0.5">
                    <UserIcon className="w-5 h-5" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center space-x-3">
                      <h4 className="text-base font-bold text-white">{item.patient.name}</h4>
                      <Badge
                        variant={isConfirmed ? 'success' : isCompleted ? 'info' : 'neutral'}
                        size="sm"
                      >
                        {item.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-400">{item.patient.email}</p>

                    <div className="flex items-center space-x-3 text-xs text-slate-300 pt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-teal-400" />
                        {startDate.toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-teal-400" />
                        {startDate.toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800">
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

                  {isConfirmed && (
                    <Button
                      variant="primary"
                      size="sm"
                      className="bg-teal-600 hover:bg-teal-500 border-teal-500/30"
                      isLoading={isUpdatingStatus}
                      leftIcon={<CheckCircle className="w-3.5 h-3.5" />}
                      onClick={() => handleMarkCompleted(item.id)}
                    >
                      Complete
                    </Button>
                  )}
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
