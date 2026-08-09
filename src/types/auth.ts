export type UserRole = 'PATIENT' | 'THERAPIST';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
}

export interface AuthSnapshot {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
}
