import type { User, UserRole } from '@/types/auth';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface BackendAuthTokens {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: User;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
}
