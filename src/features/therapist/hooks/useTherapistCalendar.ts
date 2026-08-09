import { useQuery } from '@tanstack/react-query';
import { therapistApi } from '../api/therapistApi';
import type { AvailabilityBlock } from '../components/WeeklyAvailabilityCalendar';
import { QUERY_KEYS } from '@/config/queryKeys';
import { useUpdateAppointmentStatus } from './useUpdateAppointmentStatus';

export const THERAPIST_CALENDAR_KEYS = {
  all: ['therapist-calendar'] as const,
  appointments: (therapistId: string) =>
    [...THERAPIST_CALENDAR_KEYS.all, 'appointments', therapistId] as const,
  schedule: (therapistId: string) =>
    [...THERAPIST_CALENDAR_KEYS.all, 'schedule', therapistId] as const,
};

// Helper: Convert ISO Date string to "YYYY-MM-DD"
const toIsoDateString = (isoOrDate: string | Date): string => {
  const d = new Date(isoOrDate);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Helper: Convert Date to "HH:mm"
const toTimeString = (dateObj: Date): string => {
  const hours = String(dateObj.getHours()).padStart(2, '0');
  const minutes = String(dateObj.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};

export const useTherapistCalendar = (therapistId: string) => {
  // Query 1: Real backend appointments
  const appointmentsQuery = useQuery({
    queryKey: THERAPIST_CALENDAR_KEYS.appointments(therapistId),
    queryFn: () => therapistApi.getTherapistAppointments(),
    enabled: Boolean(therapistId),
    staleTime: 30000,
  });

  // Query 2: Schedule configuration (working rules)
  const scheduleConfigQuery = useQuery({
    queryKey: QUERY_KEYS.SCHEDULES.THERAPIST_CONFIG(therapistId),
    queryFn: () => therapistApi.getScheduleConfig(therapistId),
    enabled: Boolean(therapistId),
  });

  // Mutation: Update appointment status (Scheduled -> Completed / Cancelled / No Show)
  const statusMutation = useUpdateAppointmentStatus(therapistId);

  // Map backend appointments to AvailabilityBlock[] format
  const rawAppointments = (appointmentsQuery.data || []) as unknown as Array<{
    id: string;
    startTime: string;
    endTime: string;
    status?: string;
    appointmentStatus?: string;
    patient?: { name?: string };
  }>;

  const mappedAppointmentBlocks: AvailabilityBlock[] = rawAppointments.map((item) => {
    const startDate = new Date(item.startTime);
    const endDate = new Date(item.endTime);
    const dateStr = toIsoDateString(startDate);
    const startTimeStr = toTimeString(startDate);
    const endTimeStr = toTimeString(endDate);

    const startHourNum = startDate.getHours() + startDate.getMinutes() / 60;
    const durationHoursNum = Math.max(
      0.5,
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60),
    );

    const statusLower = (item.status || item.appointmentStatus || 'SCHEDULED').toLowerCase() as
      'scheduled' | 'completed' | 'no_show' | 'cancelled';

    return {
      id: item.id,
      date: dateStr,
      startTime: startTimeStr,
      endTime: endTimeStr,
      startHour: startHourNum,
      durationHours: durationHoursNum,
      location: 'Telehealth',
      type: 'booked',
      status: statusLower,
      patientName: item.patient?.name ? `${item.patient.name} - Consultation` : 'Patient Session',
      title: item.patient?.name ? `Session with ${item.patient.name}` : 'Therapy Session',
    };
  });

  return {
    appointments: appointmentsQuery.data || [],
    appointmentBlocks: mappedAppointmentBlocks,
    customSlotBlocks: [],
    scheduleConfig: scheduleConfigQuery.data,
    isLoading: appointmentsQuery.isLoading || scheduleConfigQuery.isLoading,
    isError: appointmentsQuery.isError || scheduleConfigQuery.isError,
    refetch: () => {
      appointmentsQuery.refetch();
      scheduleConfigQuery.refetch();
    },
    updateStatus: statusMutation.mutateAsync,
    isUpdatingStatus: statusMutation.isPending,
  };
};
