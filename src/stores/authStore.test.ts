import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore } from './authStore';

describe('useAuthStore', () => {
  beforeEach(() => {
    // Reset state before each test
    useAuthStore.getState().logout();
  });

  it('starts with initial unauthenticated state', () => {
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
  });

  it('sets authentication details correctly via setAuth', () => {
    const mockUser = {
      id: 'user-1',
      name: 'John Patient',
      email: 'john@example.com',
      role: 'PATIENT' as const,
    };
    const mockToken = 'mock-jwt-token';

    useAuthStore.getState().setAuth(mockUser, mockToken);

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.user).toEqual(mockUser);
    expect(state.token).toBe(mockToken);
  });

  it('updates user details via updateUser', () => {
    const mockUser = {
      id: 'user-1',
      name: 'John Patient',
      email: 'john@example.com',
      role: 'PATIENT' as const,
    };
    const mockToken = 'mock-jwt-token';

    useAuthStore.getState().setAuth(mockUser, mockToken);
    useAuthStore.getState().updateUser({ name: 'John Doe' });

    const state = useAuthStore.getState();
    expect(state.user?.name).toBe('John Doe');
    expect(state.user?.email).toBe('john@example.com');
  });

  it('clears auth state via logout', () => {
    const mockUser = {
      id: 'user-1',
      name: 'John Patient',
      email: 'john@example.com',
      role: 'PATIENT' as const,
    };
    const mockToken = 'mock-jwt-token';

    useAuthStore.getState().setAuth(mockUser, mockToken);
    useAuthStore.getState().logout();

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
  });
});
