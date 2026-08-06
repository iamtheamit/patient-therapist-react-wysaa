import { axiosClient } from '@/api/axiosClient';
import type { LoginCredentials, RegisterCredentials, AuthResponse } from '../types/auth.types';

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await axiosClient.post<unknown, AuthResponse>('/auth/login', credentials);
      return response;
    } catch {
      // Mock Fallback for local demo resilience
      await new Promise((resolve) => setTimeout(resolve, 800));

      const isTherapist = credentials.email.toLowerCase().includes('therapist');
      return {
        user: {
          id: isTherapist ? 'therapist-doc-1' : 'patient-user-1',
          name: isTherapist ? 'Dr. Sarah Connor' : 'Alex Patient',
          email: credentials.email,
          role: isTherapist ? 'THERAPIST' : 'PATIENT',
        },
        token: `mock_jwt_token_${Date.now()}`,
      };
    }
  },

  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    try {
      const response = await axiosClient.post<unknown, AuthResponse>('/auth/register', credentials);
      return response;
    } catch {
      // Mock Fallback for local demo resilience
      await new Promise((resolve) => setTimeout(resolve, 800));

      return {
        user: {
          id: `user-${Date.now()}`,
          name: credentials.name,
          email: credentials.email,
          role: credentials.role,
        },
        token: `mock_jwt_token_${Date.now()}`,
      };
    }
  },

  getCurrentUser: async (): Promise<AuthResponse['user']> => {
    const response = await axiosClient.get<unknown, AuthResponse['user']>('/auth/me');
    return response;
  },
};
