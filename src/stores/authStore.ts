import { create } from 'zustand';
import type { User } from '@/types/auth';

export interface AuthStoreState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;

  // Actions
  setAuth: (user: User, token: string) => void;
  setTokens: (accessToken: string) => void;
  logout: () => void;
  updateUser: (updatedFields: Partial<User>) => void;
}

export const useAuthStore = create<AuthStoreState>()((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  setAuth: (user: User, token: string) => {
    set({
      user,
      token,
      isAuthenticated: true,
    });
  },

  setTokens: (accessToken: string) => {
    set((state) => ({
      ...state,
      token: accessToken,
    }));
  },

  logout: () => {
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },

  updateUser: (updatedFields: Partial<User>) =>
    set((state: AuthStoreState) => ({
      user: state.user ? { ...state.user, ...updatedFields } : null,
    })),
}));
