import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/authApi';
import { useAuthStore } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';
import { ROUTES } from '@/config/routes';

export const useLogout = () => {
  const navigate = useNavigate();
  const logoutStore = useAuthStore((state) => state.logout);
  const addToast = useUIStore((state) => state.addToast);

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSettled: () => {
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
