import axios from 'axios';
import { axiosClient, resetAuthRefreshCircuit } from '@/api/axiosClient';
import { env } from '@/config/env';
import type {
  LoginCredentials,
  RegisterCredentials,
  AuthResponse,
  BackendAuthTokens,
  RefreshResponse,
} from '../types/auth.types';

const isRefreshResponse = (value: unknown): value is RefreshResponse => {
  return (
    typeof value === 'object' &&
    value !== null &&
    'accessToken' in value &&
    typeof (value as RefreshResponse).accessToken === 'string'
  );
};

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await axiosClient.post<unknown, BackendAuthTokens | AuthResponse>(
      '/auth/login',
      credentials,
    );

    if ('accessToken' in response && response.accessToken) {
      resetAuthRefreshCircuit();
      return {
        user: response.user,
        token: response.accessToken,
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
      resetAuthRefreshCircuit();
      return {
        user: response.user,
        token: response.accessToken,
      };
    }

    return response as AuthResponse;
  },

  getCurrentUser: async (): Promise<AuthResponse['user']> => {
    const response = await axiosClient.get<unknown, AuthResponse['user']>('/auth/me');
    return response;
  },

  refresh: async (): Promise<RefreshResponse> => {
    const response = await axios.post<{ data?: RefreshResponse } | RefreshResponse>(
      `${env.VITE_API_BASE_URL}/auth/refresh`,
      null,
      {
        withCredentials: true,
      },
    );
    const payload = response.data;
    resetAuthRefreshCircuit();
    if (isRefreshResponse(payload)) {
      return payload;
    }
    if (payload.data && isRefreshResponse(payload.data)) {
      return payload.data;
    }
    throw new Error('No access token in refresh response');
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
