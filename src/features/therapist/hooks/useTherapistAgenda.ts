import { useQuery } from '@tanstack/react-query';
import { therapistApi } from '../api/therapistApi';
import type { TherapistAgendaItem, TherapistStats } from '../types/therapist.types';
import { QUERY_KEYS } from '@/config/queryKeys';

export const useTherapistAgenda = (therapistId: string, date?: string) => {
  return useQuery<TherapistAgendaItem[]>({
    queryKey: QUERY_KEYS.APPOINTMENTS.THERAPIST_AGENDA(therapistId, date || 'all'),
    queryFn: () => therapistApi.getAgenda(therapistId, date),
    enabled: Boolean(therapistId),
  });
};

export const useTherapistStats = (therapistId: string) => {
  return useQuery<TherapistStats>({
    queryKey: ['therapist', 'stats', therapistId],
    queryFn: () => therapistApi.getStats(therapistId),
    enabled: Boolean(therapistId),
  });
};
