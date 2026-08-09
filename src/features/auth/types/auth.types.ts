import type { User } from '@/types/auth';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

export interface BackendAuthTokens {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  user: User;
}

export interface RefreshResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
}

export interface AuthResponse {
  user: User;
  token: string;
}
