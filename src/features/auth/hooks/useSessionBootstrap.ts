import { useEffect, useState } from 'react';
import { authApi } from '../api/authApi';
import { useAuthStore, hasSessionFlag } from '@/stores/authStore';

// Module-level singleton — ensures bootstrap runs exactly once per page load
// even under React Strict Mode (which mounts/unmounts effects twice in dev).
let bootstrapPromise: Promise<void> | null = null;

export const useSessionBootstrap = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const token = useAuthStore((state) => state.token);
  const setAuth = useAuthStore((state) => state.setAuth);
  const setTokens = useAuthStore((state) => state.setTokens);
  const logout = useAuthStore((state) => state.logout);

  // Only show spinner if there's evidence of a prior session (httpOnly cookie
  // exists in browser — we track this via a sessionStorage flag set on login).
  // Fresh visitors skip bootstrap entirely and see the login page immediately.
  const shouldBootstrap = !isAuthenticated && !token && hasSessionFlag();
  const [isBootstrapping, setIsBootstrapping] = useState(() => shouldBootstrap);

  useEffect(() => {
    // No prior session — nothing to do
    if (!shouldBootstrap) {
      return;
    }

    // Re-attach to an in-flight bootstrap (Strict Mode double-invoke, HMR, etc.)
    if (bootstrapPromise) {
      void bootstrapPromise.finally(() => setIsBootstrapping(false));
      return;
    }

    bootstrapPromise = (async () => {
      try {
        const refreshed = await authApi.refresh();
        setTokens(refreshed.accessToken);
        const user = await authApi.getCurrentUser();
        setAuth(user, refreshed.accessToken);
      } catch {
        // Refresh failed — clear the stale flag and redirect to login
        logout();
      } finally {
        setIsBootstrapping(false);
        bootstrapPromise = null;
      }
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once on mount only

  return isBootstrapping;
};
