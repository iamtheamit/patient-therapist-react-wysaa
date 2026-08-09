import { useMutation, useQueryClient } from '@tanstack/react-query';
import { patientApi } from '../api/patientApi';
import { QUERY_KEYS } from '@/config/queryKeys';
import { useUIStore } from '@/stores/uiStore';
import type { UIState } from '@/stores/uiStore';

export const useCancelAppointment = (patientId: string) => {
  const queryClient = useQueryClient();
  const addToast = useUIStore((state: UIState) => state.addToast);

  return useMutation({
    mutationFn: (appointmentId: string) => patientApi.cancelAppointment(appointmentId),
    onSuccess: () => {
      // Invalidate queries so UI updates immediately
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.APPOINTMENTS.PATIENT_LIST(patientId),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.DASHBOARD.ROOT,
      });

      addToast({
        type: 'success',
        title: 'Appointment Cancelled',
        message: 'Your therapy session has been cancelled.',
      });
    },
    onError: (error: Error) => {
      addToast({
        type: 'error',
        title: 'Cancellation Failed',
        message: error.message || 'Could not cancel appointment. Please try again.',
      });
    },
  });
};
