import { create } from 'zustand';
import type { User } from '@/types/auth';

// sessionStorage flag — survives page refresh but not new tabs or browser close.
// Used to skip the bootstrap spinner for users who never had a session.
const SESSION_FLAG = 'session_active';

const hasSessionFlag = () => sessionStorage.getItem(SESSION_FLAG) === '1';
const setSessionFlag = () => sessionStorage.setItem(SESSION_FLAG, '1');
const clearSessionFlag = () => sessionStorage.removeItem(SESSION_FLAG);

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
    setSessionFlag();
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
    clearSessionFlag();
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

export { hasSessionFlag };
