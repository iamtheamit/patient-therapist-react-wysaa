import { useQuery } from '@tanstack/react-query';
import {
  patientApi,
  type AppointmentFilters,
  type PaginatedAppointmentsResponse,
} from '../api/patientApi';
import type { PatientDashboardStats } from '../types/patient.types';

export const usePatientAppointments = (patientId: string, filters?: AppointmentFilters) => {
  return useQuery<PaginatedAppointmentsResponse>({
    queryKey: ['appointments', 'patient', patientId, filters],
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
