import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../api/dashboardApi';
import type { DashboardData } from '../types/dashboard.types';

export const DASHBOARD_QUERY_KEY = ['dashboard'] as const;

export function useDashboard() {
  return useQuery<DashboardData>({
    queryKey: DASHBOARD_QUERY_KEY,
    queryFn: dashboardApi.getDashboard,
    staleTime: 30_000, // 30 seconds — dashboards can tolerate slight staleness
    refetchOnWindowFocus: true,
  });
}
