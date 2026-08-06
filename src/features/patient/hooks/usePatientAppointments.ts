import { useQuery } from '@tanstack/react-query';
import { patientApi } from '../api/patientApi';
import type { PatientAppointment, PatientDashboardStats } from '../types/patient.types';
import { QUERY_KEYS } from '@/config/queryKeys';

export const usePatientAppointments = (patientId: string) => {
  return useQuery<PatientAppointment[]>({
    queryKey: QUERY_KEYS.APPOINTMENTS.PATIENT_UPCOMING(patientId),
    queryFn: () => patientApi.getAppointments(patientId),
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
