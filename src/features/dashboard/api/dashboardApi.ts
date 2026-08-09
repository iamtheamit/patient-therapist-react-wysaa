import { axiosClient } from '@/api/axiosClient';
import type { DashboardData } from '../types/dashboard.types';

export const dashboardApi = {
  getDashboard: async (): Promise<DashboardData> => {
    const response = await axiosClient.get<unknown, DashboardData>('/dashboard');
    return response;
  },
};
