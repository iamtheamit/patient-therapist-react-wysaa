import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User } from '@/types/auth';

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;

  // Actions
  setAuth: (user: User, token: string, refreshToken?: string) => void;
  setTokens: (accessToken: string, refreshToken?: string) => void;
  logout: () => void;
  updateUser: (updatedFields: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,

      setAuth: (user: User, token: string, refreshToken?: string) => {
        localStorage.setItem('auth_token', token);
        localStorage.setItem('user_role', user.role);
        if (refreshToken) {
          localStorage.setItem('refresh_token', refreshToken);
        }

        set({
          user,
          token,
          refreshToken: refreshToken || null,
          isAuthenticated: true,
        });
      },

      setTokens: (accessToken: string, refreshToken?: string) => {
        localStorage.setItem('auth_token', accessToken);
        if (refreshToken) {
          localStorage.setItem('refresh_token', refreshToken);
        }

        set((state) => ({
          ...state,
          token: accessToken,
          refreshToken: refreshToken || state.refreshToken,
        }));
      },

      logout: () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_role');

        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
        });
      },

      updateUser: (updatedFields: Partial<User>) =>
        set((state: AuthState) => ({
          user: state.user ? { ...state.user, ...updatedFields } : null,
        })),
    }),
    {
      name: 'therapysync-auth-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
