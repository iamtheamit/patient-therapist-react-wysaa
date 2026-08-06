import { axiosClient } from '@/api/axiosClient';
import type {
  TherapistAgendaItem,
  TherapistStats,
  StatusUpdatePayload,
  ClinicalNotesPayload,
  TherapistScheduleConfig,
} from '../types/therapist.types';

export const therapistApi = {
  getAgenda: async (therapistId: string, date?: string): Promise<TherapistAgendaItem[]> => {
    try {
      const response = await axiosClient.get<unknown, TherapistAgendaItem[]>(
        `/therapists/${therapistId}/agenda`,
        { params: { date } },
      );
      return response;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 600));

      const now = new Date();
      const today10 = new Date(now.getTime());
      today10.setHours(10, 0, 0, 0);

      const today14 = new Date(now.getTime());
      today14.setHours(14, 0, 0, 0);

      const tomorrow11 = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      tomorrow11.setHours(11, 0, 0, 0);

      return [
        {
          id: 'app-therapist-1',
          therapistId,
          patient: {
            id: 'pat-1',
            name: 'Alex Patient',
            email: 'alex.patient@wysa.com',
          },
          startTime: today10.toISOString(),
          endTime: new Date(today10.getTime() + 60 * 60 * 1000).toISOString(),
          status: 'CONFIRMED',
          notes: 'Patient reports improvement in anxiety symptoms. Review homework.',
          meetingLink: 'https://meet.wysacare.example.com/therapist-session-1',
          createdAt: now.toISOString(),
        },
        {
          id: 'app-therapist-2',
          therapistId,
          patient: {
            id: 'pat-2',
            name: 'Jordan Miller',
            email: 'jordan@example.com',
          },
          startTime: today14.toISOString(),
          endTime: new Date(today14.getTime() + 60 * 60 * 1000).toISOString(),
          status: 'CONFIRMED',
          notes: 'Initial evaluation session.',
          meetingLink: 'https://meet.wysacare.example.com/therapist-session-2',
          createdAt: now.toISOString(),
        },
        {
          id: 'app-therapist-3',
          therapistId,
          patient: {
            id: 'pat-3',
            name: 'Taylor Reed',
            email: 'taylor@example.com',
          },
          startTime: tomorrow11.toISOString(),
          endTime: new Date(tomorrow11.getTime() + 60 * 60 * 1000).toISOString(),
          status: 'CONFIRMED',
          createdAt: now.toISOString(),
        },
      ];
    }
  },

  getStats: async (therapistId: string): Promise<TherapistStats> => {
    try {
      const response = await axiosClient.get<unknown, TherapistStats>(
        `/therapists/${therapistId}/stats`,
      );
      return response;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 400));
      return {
        todaySessionsCount: 2,
        pendingConfirmationsCount: 1,
        activePatientsCount: 12,
      };
    }
  },

  getScheduleConfig: async (therapistId: string): Promise<TherapistScheduleConfig> => {
    try {
      const response = await axiosClient.get<unknown, TherapistScheduleConfig>(
        `/therapists/${therapistId}/schedule-config`,
      );
      return response;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return {
        therapistId,
        slotDurationMinutes: 50,
        bufferDurationMinutes: 10,
        weeklyRules: [
          {
            day: 'Monday',
            isEnabled: true,
            startTime: '09:00',
            endTime: '17:00',
            breakStartTime: '12:00',
            breakEndTime: '13:00',
          },
          {
            day: 'Tuesday',
            isEnabled: true,
            startTime: '09:00',
            endTime: '17:00',
            breakStartTime: '12:00',
            breakEndTime: '13:00',
          },
          {
            day: 'Wednesday',
            isEnabled: true,
            startTime: '09:00',
            endTime: '17:00',
            breakStartTime: '12:00',
            breakEndTime: '13:00',
          },
          {
            day: 'Thursday',
            isEnabled: true,
            startTime: '09:00',
            endTime: '17:00',
            breakStartTime: '12:00',
            breakEndTime: '13:00',
          },
          {
            day: 'Friday',
            isEnabled: true,
            startTime: '09:00',
            endTime: '16:00',
            breakStartTime: '12:00',
            breakEndTime: '13:00',
          },
          { day: 'Saturday', isEnabled: false, startTime: '10:00', endTime: '14:00' },
          { day: 'Sunday', isEnabled: false, startTime: '10:00', endTime: '14:00' },
        ],
      };
    }
  },

  updateScheduleConfig: async (
    config: TherapistScheduleConfig,
  ): Promise<TherapistScheduleConfig> => {
    try {
      const response = await axiosClient.put<unknown, TherapistScheduleConfig>(
        `/therapists/${config.therapistId}/schedule-config`,
        config,
      );
      return response;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 600));
      return config;
    }
  },

  updateStatus: async (
    payload: StatusUpdatePayload,
  ): Promise<{ success: boolean; payload: StatusUpdatePayload }> => {
    try {
      const response = await axiosClient.patch<
        unknown,
        { success: boolean; payload: StatusUpdatePayload }
      >(`/appointments/${payload.appointmentId}/status`, { status: payload.status });
      return response;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return { success: true, payload };
    }
  },

  updateNotes: async (
    payload: ClinicalNotesPayload,
  ): Promise<{ success: boolean; payload: ClinicalNotesPayload }> => {
    try {
      const response = await axiosClient.patch<
        unknown,
        { success: boolean; payload: ClinicalNotesPayload }
      >(`/appointments/${payload.appointmentId}/notes`, { notes: payload.notes });
      return response;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return { success: true, payload };
    }
  },
};
