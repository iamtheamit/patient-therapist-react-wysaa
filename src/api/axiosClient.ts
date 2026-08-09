import axios, { AxiosError } from 'axios';
import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { env } from '@/config/env';
import { ROUTES } from '@/config/routes';
import { useAuthStore } from '@/stores/authStore';
import { CustomApiError } from '@/types/api';

export interface CustomRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export const axiosClient = axios.create({
  baseURL: env.VITE_API_BASE_URL,
  timeout: 15000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

let isRefreshing = false;
// Circuit-breaker: once a refresh attempt has failed in this page session,
// don't try again — go straight to login for any subsequent 401.
let refreshHasFailed = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

const clearSessionAndRedirect = () => {
  useAuthStore.getState().logout();

  if (!window.location.pathname.startsWith('/login')) {
    window.location.href = ROUTES.AUTH.LOGIN;
  }
};

export const resetAuthRefreshCircuit = () => {
  refreshHasFailed = false;
};

// Request Interceptor: Attach JWT Authorization Header
axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().token;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: unknown) => {
    return Promise.reject(error);
  },
);

// Response Interceptor: Transform errors, silent refresh & handle 401 expiry
axiosClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Return extracted data payload directly if standard backend envelope exists ({ status: true, message, data })
    if (
      response.data &&
      typeof response.data === 'object' &&
      'status' in response.data &&
      'data' in response.data
    ) {
      return response.data.data;
    }
    return response.data;
  },

  async (
    error: AxiosError<{ message?: string; errorCode?: string; errors?: Record<string, string[]> }>,
  ) => {
    const originalRequest = error.config as CustomRequestConfig;
    const status = error.response?.status || 500;
    const responseData = error.response?.data;

    // Handle 401 Unauthorized: Attempt silent token refresh if possible
    if (status === 401 && originalRequest && !originalRequest._retry) {
      const isAuthEndpoint =
        originalRequest.url?.includes('/auth/login') ||
        originalRequest.url?.includes('/auth/refresh');

      // Circuit-breaker: if refresh already failed this session, go straight to login
      if (refreshHasFailed || isAuthEndpoint) {
        clearSessionAndRedirect();
        return Promise.reject(error);
      }

      // If a refresh is already in-flight, queue this request
      if (isRefreshing) {
        try {
          const token = await new Promise<string>((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          });
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosClient(originalRequest);
        } catch (err) {
          return Promise.reject(err);
        }
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshRes = await axios.post(`${env.VITE_API_BASE_URL}/auth/refresh`, null, {
          withCredentials: true,
        });

        const resPayload = refreshRes.data;
        const newToken = resPayload?.data?.accessToken || resPayload?.accessToken;

        if (newToken) {
          useAuthStore.getState().setTokens(newToken);
          axiosClient.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          processQueue(null, newToken);
          isRefreshing = false;
          return axiosClient(originalRequest);
        }

        // Refresh returned no token — treat as failure
        throw new Error('No access token in refresh response');
      } catch (refreshErr) {
        refreshHasFailed = true;  // trip the circuit-breaker
        processQueue(refreshErr, null);
        isRefreshing = false;
        clearSessionAndRedirect();
        return Promise.reject(refreshErr);
      }
    }

    const errorPayload = {
      message: responseData?.message || error.message || 'An unexpected error occurred.',
      errorCode: responseData?.errorCode,
      errors: responseData?.errors,
      status,
    };

    return Promise.reject(new CustomApiError(errorPayload));
  },
);
