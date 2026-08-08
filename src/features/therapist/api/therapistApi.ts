import { axiosClient } from '@/api/axiosClient';
import type {
  TherapistAgendaItem,
  TherapistStats,
  StatusUpdatePayload,
  ClinicalNotesPayload,
  TherapistScheduleConfig,
  DayOfWeek,
  DayScheduleRule,
} from '../types/therapist.types';

interface RawScheduleItem {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  slotDuration?: number;
  isActive?: boolean;
}

interface RawScheduleResponse {
  data?: RawScheduleItem[];
  weeklyRules?: DayScheduleRule[];
  slotDurationMinutes?: number;
  bufferDurationMinutes?: number;
}

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
            email: 'alex.patient@therapysync.com',
          },
          startTime: today10.toISOString(),
          endTime: new Date(today10.getTime() + 60 * 60 * 1000).toISOString(),
          status: 'CONFIRMED',
          notes: 'Patient reports improvement in anxiety symptoms. Review homework.',
          meetingLink: 'https://meet.therapysync.example.com/therapist-session-1',
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
          meetingLink: 'https://meet.therapysync.example.com/therapist-session-2',
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
      const response = await axiosClient.get<unknown, RawScheduleResponse | RawScheduleItem[]>(
        `/therapists/${therapistId}/schedule-config`,
      );

      const DAYS_OF_WEEK: DayOfWeek[] = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
      ];
      const defaultRules: DayScheduleRule[] = [
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
      ];

      // Handle direct weeklyRules object
      if (response && !Array.isArray(response) && response.weeklyRules) {
        return {
          therapistId,
          slotDurationMinutes: response.slotDurationMinutes ?? 50,
          bufferDurationMinutes: response.bufferDurationMinutes ?? 10,
          weeklyRules: response.weeklyRules,
        };
      }

      // Handle raw DB records array (TherapistSchedule[]) returned from GET /api/v1/therapist/schedules
      const dbItems: RawScheduleItem[] = Array.isArray(response)
        ? response
        : (response as RawScheduleResponse)?.data || [];

      if (dbItems.length > 0) {
        const slotDuration = dbItems[0]?.slotDuration ?? 50;
        const ALL_DAYS: DayOfWeek[] = [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday',
        ];
        const weeklyRules: DayScheduleRule[] = ALL_DAYS.map((dayName) => {
          const dayIndex = DAYS_OF_WEEK.indexOf(dayName);
          const found = dbItems.find((item) => item.dayOfWeek === dayIndex);
          if (found) {
            return {
              day: dayName,
              isEnabled: found.isActive ?? true,
              startTime: found.startTime || '09:00',
              endTime: found.endTime || '17:00',
              breakStartTime: '12:00',
              breakEndTime: '13:00',
            };
          }
          return {
            day: dayName,
            isEnabled: false,
            startTime: '09:00',
            endTime: '17:00',
            breakStartTime: '12:00',
            breakEndTime: '13:00',
          };
        });

        return {
          therapistId,
          slotDurationMinutes: slotDuration,
          bufferDurationMinutes: 10,
          weeklyRules,
        };
      }

      return {
        therapistId,
        slotDurationMinutes: 50,
        bufferDurationMinutes: 10,
        weeklyRules: defaultRules,
      };
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
      const DAYS_OF_WEEK: DayOfWeek[] = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
      ];

      // Clean senior payload: map weeklyRules to standard domain Schedule items
      const schedules = (config.weeklyRules || [])
        .filter((rule) => rule.isEnabled)
        .map((rule) => ({
          dayOfWeek: DAYS_OF_WEEK.indexOf(rule.day),
          startTime: rule.startTime,
          endTime: rule.endTime,
          slotDuration: config.slotDurationMinutes || 30,
          isActive: true,
        }));

      const response = await axiosClient.put<unknown, RawScheduleResponse>(
        `/therapists/${config.therapistId}/schedule-config`,
        { schedules },
      );
      return response?.weeklyRules ? (response as TherapistScheduleConfig) : config;
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
