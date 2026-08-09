import { useMutation, useQueryClient } from '@tanstack/react-query';
import { therapistApi } from '../api/therapistApi';
import type { StatusUpdatePayload, ClinicalNotesPayload } from '../types/therapist.types';
import { QUERY_KEYS } from '@/config/queryKeys';
import { useUIStore } from '@/stores/uiStore';
import type { UIState } from '@/stores/uiStore';

export const useUpdateAppointmentStatus = (therapistId: string) => {
  const queryClient = useQueryClient();
  const addToast = useUIStore((state: UIState) => state.addToast);

  return useMutation({
    mutationFn: (payload: StatusUpdatePayload) => therapistApi.updateStatus(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.APPOINTMENTS.THERAPIST_AGENDA(therapistId, 'all'),
      });
      queryClient.invalidateQueries({
        queryKey: ['therapist-calendar', 'appointments', therapistId],
      });

      addToast({
        type: 'success',
        title: 'Status Updated',
        message: `Appointment status changed to ${variables.status}.`,
      });
    },
    onError: (error: Error) => {
      addToast({
        type: 'error',
        title: 'Update Failed',
        message: error.message || 'Could not update session status.',
      });
    },
  });
};

export const useUpdateClinicalNotes = (therapistId: string) => {
  const queryClient = useQueryClient();
  const addToast = useUIStore((state: UIState) => state.addToast);

  return useMutation({
    mutationFn: (payload: ClinicalNotesPayload) => therapistApi.updateNotes(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.APPOINTMENTS.THERAPIST_AGENDA(therapistId, 'all'),
      });
      queryClient.invalidateQueries({
        queryKey: ['therapist-calendar', 'appointments', therapistId],
      });

      addToast({
        type: 'success',
        title: 'Notes Saved',
        message: 'Clinical session notes updated successfully.',
      });
    },
    onError: (error: Error) => {
      addToast({
        type: 'error',
        title: 'Save Failed',
        message: error.message || 'Could not save clinical notes.',
      });
    },
  });
};
