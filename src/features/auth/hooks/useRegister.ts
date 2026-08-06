import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/authApi';
import type { RegisterCredentials, AuthResponse } from '../types/auth.types';
import { useAuthStore } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';
import type { UIState } from '@/stores/uiStore';
import { ROUTES } from '@/config/routes';

export const useRegister = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const addToast = useUIStore((state: UIState) => state.addToast);

  return useMutation<AuthResponse, Error, RegisterCredentials>({
    mutationFn: (credentials) => authApi.register(credentials),
    onSuccess: (data) => {
      setAuth(data.user, data.token);

      addToast({
        type: 'success',
        title: 'Account Created',
        message: `Welcome to Wysa Care, ${data.user.name}!`,
      });

      const destination =
        data.user.role === 'PATIENT' ? ROUTES.PATIENT.DASHBOARD : ROUTES.THERAPIST.DASHBOARD;
      navigate(destination, { replace: true });
    },
    onError: (error) => {
      addToast({
        type: 'error',
        title: 'Registration Failed',
        message: error.message || 'Failed to create account.',
      });
    },
  });
};
