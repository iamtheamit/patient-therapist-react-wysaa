import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/authApi';
import { useAuthStore } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';
import { ROUTES } from '@/config/routes';
import { useTherapistStatusStore } from '@/stores/therapistStatusStore';

export const useLogout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const logoutStore = useAuthStore((state) => state.logout);
  const addToast = useUIStore((state) => state.addToast);

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSettled: () => {
      // Clear TanStack Query Client cache to prevent stale data leaking between users
      queryClient.clear();

      // Reset therapist online status to default
      useTherapistStatusStore.getState().setIsOnline(true);

      logoutStore();
      addToast({
        type: 'info',
        title: 'Signed Out',
        message: 'You have been logged out securely.',
      });
      navigate(ROUTES.AUTH.LOGIN, { replace: true });
    },
  });
};
