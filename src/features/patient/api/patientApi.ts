import { axiosClient } from '@/api/axiosClient';
import type { PatientAppointment } from '../types/patient.types';
import { normalizeStatus } from '../types/patient.types';
import type { PatientDashboardStats } from '@/features/dashboard';

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
    _patientId: string,
    filters?: AppointmentFilters,
  ): Promise<PaginatedAppointmentsResponse> => {
    const response = await axiosClient.get<unknown, Record<string, unknown>>(
      '/appointments/patient',
      {
        params: {
          search: filters?.search,
          startDate: filters?.startDate,
          endDate: filters?.endDate,
          status: filters?.status && filters.status !== 'all' ? filters.status : undefined,
          page: filters?.page || 1,
          limit: filters?.limit || 10,
        },
      },
    );

    const items: Record<string, unknown>[] = Array.isArray(response)
      ? (response as Record<string, unknown>[])
      : ((response as Record<string, unknown>)?.items as Record<string, unknown>[]) || [];

    const total =
      typeof response === 'object' && (response as Record<string, unknown>)?.total !== undefined
        ? ((response as Record<string, unknown>).total as number)
        : items.length;
    const page =
      typeof response === 'object' && (response as Record<string, unknown>)?.page !== undefined
        ? ((response as Record<string, unknown>).page as number)
        : filters?.page || 1;
    const limit =
      typeof response === 'object' && (response as Record<string, unknown>)?.limit !== undefined
        ? ((response as Record<string, unknown>).limit as number)
        : filters?.limit || 10;
    const totalPages =
      typeof response === 'object' &&
      (response as Record<string, unknown>)?.totalPages !== undefined
        ? ((response as Record<string, unknown>).totalPages as number)
        : Math.ceil(total / (limit || 1));

    const mappedItems: PatientAppointment[] = items.map((appt) => ({
      ...(appt as unknown as PatientAppointment),
      status: normalizeStatus(
        (appt.status as string) || (appt.appointmentStatus as string) || 'SCHEDULED',
      ),
    }));

    return { items: mappedItems, total, page, limit, totalPages };
  },

  getStats: async (patientId: string): Promise<PatientDashboardStats> => {
    const response = await axiosClient.get<unknown, PatientDashboardStats>(
      `/patients/${patientId}/stats`,
    );
    return response;
  },

  cancelAppointment: async (appointmentId: string): Promise<{ success: boolean; id: string }> => {
    const response = await axiosClient.post<unknown, { success: boolean; id: string }>(
      `/appointments/${appointmentId}/cancel`,
    );
    return response;
  },
};
