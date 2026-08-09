import { useEffect, useState } from 'react';
import { authApi } from '../api/authApi';
import { useAuthStore } from '@/stores/authStore';

export const useSessionBootstrap = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const token = useAuthStore((state) => state.token);
  const setAuth = useAuthStore((state) => state.setAuth);
  const setTokens = useAuthStore((state) => state.setTokens);
  const logout = useAuthStore((state) => state.logout);
  const [isBootstrapping, setIsBootstrapping] = useState(!isAuthenticated && !token);

  useEffect(() => {
    let cancelled = false;

    if (isAuthenticated || token) {
      setIsBootstrapping(false);
      return;
    }

    const bootstrap = async () => {
      setIsBootstrapping(true);

      try {
        const refreshed = await authApi.refresh();
        if (cancelled) {
          return;
        }

        setTokens(refreshed.accessToken);
        const user = await authApi.getCurrentUser();
        if (!cancelled) {
          setAuth(user, refreshed.accessToken);
        }
      } catch {
        if (!cancelled) {
          logout();
        }
      } finally {
        if (!cancelled) {
          setIsBootstrapping(false);
        }
      }
    };

    void bootstrap();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, token, setAuth, setTokens, logout]);

  return isBootstrapping;
};
