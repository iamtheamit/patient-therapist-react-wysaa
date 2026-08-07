import { axiosClient } from '@/api/axiosClient';
import type {
  LoginCredentials,
  RegisterCredentials,
  AuthResponse,
  BackendAuthTokens,
} from '../types/auth.types';

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await axiosClient.post<unknown, BackendAuthTokens | AuthResponse>(
      '/auth/login',
      credentials,
    );

    if ('accessToken' in response && response.accessToken) {
      return {
        user: response.user,
        token: response.accessToken,
        refreshToken: response.refreshToken,
      };
    }

    return response as AuthResponse;
  },

  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const response = await axiosClient.post<unknown, BackendAuthTokens | AuthResponse>(
      '/auth/register',
      credentials,
    );

    if ('accessToken' in response && response.accessToken) {
      return {
        user: response.user,
        token: response.accessToken,
        refreshToken: response.refreshToken,
      };
    }

    return response as AuthResponse;
  },

  getCurrentUser: async (): Promise<AuthResponse['user']> => {
    const response = await axiosClient.get<unknown, AuthResponse['user']>('/auth/me');
    return response;
  },

  logout: async (): Promise<{ success: boolean }> => {
    try {
      await axiosClient.post('/auth/logout');
      return { success: true };
    } catch {
      return { success: true };
    }
  },
};
