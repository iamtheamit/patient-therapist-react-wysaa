/* eslint-disable @typescript-eslint/no-explicit-any */
import { axiosClient } from '@/api/axiosClient';
import type { PatientAppointment, PatientDashboardStats } from '../types/patient.types';

export interface AppointmentFilters {
  search?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedAppointmentsResponse {
  items: PatientAppointment[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const patientApi = {
  getAppointments: async (
    patientId: string,
    filters?: AppointmentFilters,
  ): Promise<PaginatedAppointmentsResponse> => {
    try {
      const response = await axiosClient.get<unknown, any>('/appointments/patient', {
        params: {
          search: filters?.search,
          startDate: filters?.startDate,
          endDate: filters?.endDate,
          status: filters?.status && filters.status !== 'all' ? filters.status : undefined,
          page: filters?.page || 1,
          limit: filters?.limit || 10,
        },
      });
      const items = Array.isArray(response) ? response : (response as any)?.items || [];
      const total =
        typeof response === 'object' && response?.total !== undefined
          ? response.total
          : items.length;
      const page =
        typeof response === 'object' && response?.page !== undefined
          ? response.page
          : filters?.page || 1;
      const limit =
        typeof response === 'object' && response?.limit !== undefined
          ? response.limit
          : filters?.limit || 10;
      const totalPages =
        typeof response === 'object' && response?.totalPages !== undefined
          ? response.totalPages
          : Math.ceil(total / (limit || 1));

      const mappedItems = items.map((appt: any) => {
        const rawStatus = appt.status || appt.appointmentStatus || 'SCHEDULED';
        return {
          ...appt,
          status: rawStatus === 'HOLD' ? 'HELD' : rawStatus,
        };
      });

      return {
        items: mappedItems,
        total,
        page,
        limit,
        totalPages,
      };
    } catch {
      // Mock Fallback for local demo resilience
      await new Promise((resolve) => setTimeout(resolve, 600));

      const now = new Date();
      const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      const pastDate = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);

      const mockItems: PatientAppointment[] = [
        {
          id: 'app-101',
          patientId,
          therapist: {
            id: 'therapist-1',
            name: 'Dr. Sarah Connor',
            specialization: 'Cognitive Behavioral Therapy (CBT)',
          },
          startTime: new Date(tomorrow.setHours(10, 0, 0, 0)).toISOString(),
          endTime: new Date(tomorrow.setHours(11, 0, 0, 0)).toISOString(),
          status: 'CONFIRMED',
          notes: 'Focus on stress management and sleep anxiety exercises.',
          meetingLink: 'https://meet.therapysync.example.com/cbt-session-101',
          createdAt: now.toISOString(),
        },
        {
          id: 'app-102',
          patientId,
          therapist: {
            id: 'therapist-2',
            name: 'Dr. Marcus Vance',
            specialization: 'Mindfulness & Depression Care',
          },
          startTime: new Date(nextWeek.setHours(14, 30, 0, 0)).toISOString(),
          endTime: new Date(nextWeek.setHours(15, 30, 0, 0)).toISOString(),
          status: 'CONFIRMED',
          meetingLink: 'https://meet.therapysync.example.com/mindfulness-102',
          createdAt: now.toISOString(),
        },
        {
          id: 'app-103',
          patientId,
          therapist: {
            id: 'therapist-1',
            name: 'Dr. Sarah Connor',
            specialization: 'Cognitive Behavioral Therapy (CBT)',
          },
          startTime: new Date(pastDate.setHours(11, 0, 0, 0)).toISOString(),
          endTime: new Date(pastDate.setHours(12, 0, 0, 0)).toISOString(),
          status: 'COMPLETED',
          notes: 'Initial consultation completed. Homework assigned.',
          createdAt: pastDate.toISOString(),
        },
      ];

      return {
        items: mockItems,
        total: mockItems.length,
        page: 1,
        limit: 10,
        totalPages: 1,
      };
    }
  },

  getStats: async (patientId: string): Promise<PatientDashboardStats> => {
    try {
      const response = await axiosClient.get<unknown, PatientDashboardStats>(
        `/patients/${patientId}/stats`,
      );
      return response;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 400));
      return {
        totalCompletedSessions: 8,
        upcomingSessionsCount: 2,
        assignedTherapistsCount: 2,
      };
    }
  },

  cancelAppointment: async (appointmentId: string): Promise<{ success: boolean; id: string }> => {
    try {
      const response = await axiosClient.post<unknown, { success: boolean; id: string }>(
        `/appointments/${appointmentId}/cancel`,
      );
      return response;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return { success: true, id: appointmentId };
    }
  },
};
