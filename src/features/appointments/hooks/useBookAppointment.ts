import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { appointmentsApi } from '../api/appointmentsApi';
import type { BookAppointmentPayload } from '../types/appointments.types';
import type { RecurringBookingPayload, RecurringBookingResponse } from '../types/recurring.types';
import type { PatientAppointment } from '@/features/patient/types/patient.types';
import { QUERY_KEYS } from '@/config/queryKeys';
import { useUIStore } from '@/stores/uiStore';
import type { UIState } from '@/stores/uiStore';
import { ROUTES } from '@/config/routes';

export const useBookAppointment = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const addToast = useUIStore((state: UIState) => state.addToast);

  return useMutation<PatientAppointment, Error, BookAppointmentPayload>({
    mutationFn: (payload) => appointmentsApi.bookAppointment(payload),
    onSuccess: (appointment) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.APPOINTMENTS.PATIENT_UPCOMING(appointment.patientId),
      });

      addToast({
        type: 'success',
        title: 'Session Booked!',
        message: `Your appointment with ${appointment.therapist.name} is confirmed.`,
      });

      navigate(ROUTES.PATIENT.DASHBOARD, { replace: true });
    },
    onError: (error) => {
      addToast({
        type: 'error',
        title: 'Booking Failed',
        message: error.message || 'Could not complete appointment booking.',
      });
    },
  });
};

export const useBookRecurringAppointment = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const addToast = useUIStore((state: UIState) => state.addToast);

  return useMutation<RecurringBookingResponse, Error, RecurringBookingPayload>({
    mutationFn: (payload) => appointmentsApi.bookRecurringAppointment(payload),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.APPOINTMENTS.PATIENT_UPCOMING(variables.patientId),
      });

      addToast({
        type: 'success',
        title: 'Recurring Series Reserved!',
        message: `Successfully booked ${response.createdCount} recurring therapy sessions.`,
      });

      navigate(ROUTES.PATIENT.DASHBOARD, { replace: true });
    },
    onError: (error) => {
      addToast({
        type: 'error',
        title: 'Recurring Booking Failed',
        message: error.message || 'Could not complete recurring booking series.',
      });
    },
  });
};
