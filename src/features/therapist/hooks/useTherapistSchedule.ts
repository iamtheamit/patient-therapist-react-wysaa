import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { therapistApi } from '../api/therapistApi';
import type { TherapistScheduleConfig } from '../types/therapist.types';
import { QUERY_KEYS } from '@/config/queryKeys';
import { useUIStore } from '@/stores/uiStore';
import type { UIState } from '@/stores/uiStore';

export const useTherapistScheduleConfig = (therapistId: string) => {
  return useQuery<TherapistScheduleConfig>({
    queryKey: QUERY_KEYS.SCHEDULES.THERAPIST_CONFIG(therapistId),
    queryFn: () => therapistApi.getScheduleConfig(therapistId),
    enabled: Boolean(therapistId),
  });
};

export const useUpdateScheduleConfig = (therapistId: string) => {
  const queryClient = useQueryClient();
  const addToast = useUIStore((state: UIState) => state.addToast);

  return useMutation<TherapistScheduleConfig, Error, TherapistScheduleConfig>({
    mutationFn: (config) => therapistApi.updateScheduleConfig(config),
    onSuccess: (updatedConfig) => {
      queryClient.setQueryData(QUERY_KEYS.SCHEDULES.THERAPIST_CONFIG(therapistId), updatedConfig);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SCHEDULES.ROOT });
      queryClient.invalidateQueries({ queryKey: ['therapist-calendar'] });

      addToast({
        type: 'success',
        title: 'Schedule Updated',
        message: 'Your working shift rules and slot durations have been saved.',
      });
    },
    onError: (error) => {
      addToast({
        type: 'error',
        title: 'Save Failed',
        message: error.message || 'Could not update working hours.',
      });
    },
  });
};
