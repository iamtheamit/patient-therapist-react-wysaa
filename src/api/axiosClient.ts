import axios, { AxiosError } from 'axios';
import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { env } from '@/config/env';
import { ROUTES } from '@/config/routes';
import { CustomApiError } from '@/types/api';

export const axiosClient = axios.create({
  baseURL: env.VITE_API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request Interceptor: Attach JWT Authorization Header
axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: unknown) => {
    return Promise.reject(error);
  },
);

// Response Interceptor: Transform errors & handle 401 unauthenticated session expiry
axiosClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Return extracted data payload directly if standard backend envelope exists
    return response.data;
  },
  (
    error: AxiosError<{ message?: string; errorCode?: string; errors?: Record<string, string[]> }>,
  ) => {
    const status = error.response?.status || 500;
    const responseData = error.response?.data;

    const errorPayload = {
      message: responseData?.message || error.message || 'An unexpected error occurred.',
      errorCode: responseData?.errorCode,
      errors: responseData?.errors,
      status,
    };

    // Handle 401 Unauthorized: Clear session and redirect to login if not already on auth page
    if (status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_role');

      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = ROUTES.AUTH.LOGIN;
      }
    }

    return Promise.reject(new CustomApiError(errorPayload));
  },
);
