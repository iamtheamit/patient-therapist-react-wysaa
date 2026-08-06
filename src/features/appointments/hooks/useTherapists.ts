import { useQuery } from '@tanstack/react-query';
import { appointmentsApi } from '../api/appointmentsApi';
import type { TherapistProfile, AvailableSlot } from '../types/appointments.types';
import { QUERY_KEYS } from '@/config/queryKeys';

export const useTherapists = () => {
  return useQuery<TherapistProfile[]>({
    queryKey: ['therapists', 'list'],
    queryFn: () => appointmentsApi.getTherapists(),
  });
};

export const useAvailableSlots = (therapistId: string, date: string) => {
  return useQuery<AvailableSlot[]>({
    queryKey: QUERY_KEYS.SCHEDULES.AVAILABLE_SLOTS(therapistId, date),
    queryFn: () => appointmentsApi.getAvailableSlots(therapistId, date),
    enabled: Boolean(therapistId && date),
  });
};
