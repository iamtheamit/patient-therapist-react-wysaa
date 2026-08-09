import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../api/dashboardApi';
import type { DashboardData } from '../types/dashboard.types';
import { QUERY_KEYS } from '@/config/queryKeys';

export function useDashboard() {
  return useQuery<DashboardData>({
    queryKey: QUERY_KEYS.DASHBOARD.ROOT,
    queryFn: dashboardApi.getDashboard,
    staleTime: 30_000, // 30 seconds — dashboards can tolerate slight staleness
    refetchOnWindowFocus: true,
  });
}
