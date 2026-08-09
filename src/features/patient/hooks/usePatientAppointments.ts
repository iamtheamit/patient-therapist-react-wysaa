import { useQuery } from '@tanstack/react-query';
import {
  patientApi,
  type AppointmentFilters,
  type PaginatedAppointmentsResponse,
} from '../api/patientApi';
import type { PatientDashboardStats } from '@/features/dashboard/types/dashboard.types';
import { QUERY_KEYS } from '@/config/queryKeys';

export const usePatientAppointments = (patientId: string, filters?: AppointmentFilters) => {
  return useQuery<PaginatedAppointmentsResponse>({
    queryKey: QUERY_KEYS.APPOINTMENTS.PATIENT_LIST(patientId, filters as Record<string, unknown>),
    queryFn: () => patientApi.getAppointments(patientId, filters),
    enabled: Boolean(patientId),
  });
};

export const usePatientStats = (patientId: string) => {
  return useQuery<PatientDashboardStats>({
    queryKey: ['patient', 'stats', patientId],
    queryFn: () => patientApi.getStats(patientId),
    enabled: Boolean(patientId),
  });
};
