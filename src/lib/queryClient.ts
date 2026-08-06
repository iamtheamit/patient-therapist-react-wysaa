import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Data is considered fresh for 5 minutes before becoming stale
      staleTime: 1000 * 60 * 5,
      // Unused query data stays in memory cache for 15 minutes before GC
      gcTime: 1000 * 60 * 15,
      // Refetch on window focus disabled to prevent unexpected network requests during booking flow
      refetchOnWindowFocus: false,
      // Refetch on reconnect for network resiliency
      refetchOnReconnect: true,
      // Retry failed queries up to 2 times with backoff, ignoring client-side auth errors
      retry: (failureCount, error: unknown) => {
        if (failureCount >= 2) return false;

        // Do not retry on client authentication or missing resource errors (401, 403, 404)
        if (typeof error === 'object' && error !== null && 'status' in error) {
          const status = (error as { status: number }).status;
          if (status === 401 || status === 403 || status === 404) {
            return false;
          }
        }
        return true;
      },
    },
    mutations: {
      // Do not retry mutations automatically to prevent duplicate state-modifying requests
      retry: false,
    },
  },
});
