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
import { classifyBookingError } from '@/utils/formatters';

export const useBookAppointment = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const addToast = useUIStore((state: UIState) => state.addToast);

  return useMutation<PatientAppointment, Error, BookAppointmentPayload>({
    mutationFn: (payload) => appointmentsApi.bookAppointment(payload),
    onSuccess: (appointment) => {
      // Invalidate dashboard and all appointment/schedule queries so active holds clear immediately
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD.ROOT });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.APPOINTMENTS.ROOT });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SCHEDULES.ROOT });

      addToast({
        type: 'success',
        title: 'Session Booked!',
        message: `Your appointment with ${appointment.therapist.name} is confirmed.`,
      });

      navigate(ROUTES.PATIENT.DASHBOARD, { replace: true });
    },
    onError: (error: unknown) => {
      const errorType = classifyBookingError(error);
      const isConflict = errorType === 'conflict';
      const isExpired = errorType === 'expired';

      addToast({
        type: 'error',
        title: isConflict
          ? 'Slot Already Taken'
          : isExpired
            ? 'Reservation Expired'
            : 'Booking Failed',
        message: isConflict
          ? 'This slot was just confirmed by another patient. Please go back and choose a different time.'
          : isExpired
            ? 'Your hold on this slot has expired before payment was completed. Please select the slot again.'
            : 'We could not complete your booking. Please try again in a moment.',
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
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD.ROOT });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.APPOINTMENTS.ROOT });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SCHEDULES.ROOT });

      addToast({
        type: 'success',
        title: 'Recurring Series Reserved!',
        message: `Successfully booked ${response.createdCount} recurring therapy sessions.`,
      });

      navigate(ROUTES.PATIENT.DASHBOARD, { replace: true });
    },
    onError: (error: unknown) => {
      const errorType = classifyBookingError(error);
      const isConflict = errorType === 'conflict';
      const isExpired = errorType === 'expired';

      addToast({
        type: 'error',
        title: isConflict
          ? 'Slot Already Taken'
          : isExpired
            ? 'Reservation Expired'
            : 'Recurring Booking Failed',
        message: isConflict
          ? 'One or more slots in your recurring series are already booked. Please choose a different time.'
          : isExpired
            ? 'Your hold expired before the series could be confirmed. Please select the slot again.'
            : 'We could not complete your recurring booking. Please try again in a moment.',
      });
    },
  });
};
