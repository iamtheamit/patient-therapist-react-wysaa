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
import { normalizeStatus } from '@/features/patient/types/patient.types';

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

export const DAYS_OF_WEEK: DayOfWeek[] = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export const DEFAULT_WEEKLY_RULES: DayScheduleRule[] = [
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

export const therapistApi = {
  getTherapistAppointments: async (status?: string): Promise<TherapistAgendaItem[]> => {
    const response = await axiosClient.get<unknown, TherapistAgendaItem[]>(
      '/appointments/therapist',
      {
        params: { status },
      },
    );
    const items = (
      Array.isArray(response)
        ? response
        : (response as Record<string, unknown>)?.items ||
          (response as { data?: TherapistAgendaItem[] })?.data ||
          []
    ) as Record<string, unknown>[];
    return items.map((item) => {
      const rawStatus =
        (item.status as string) || (item.appointmentStatus as string) || 'SCHEDULED';
      return {
        ...item,
        status: normalizeStatus(rawStatus),
      } as unknown as TherapistAgendaItem;
    });
  },

  getAgenda: async (therapistId: string, date?: string): Promise<TherapistAgendaItem[]> => {
    const response = await axiosClient.get<unknown, TherapistAgendaItem[]>(
      `/therapist/schedules/${therapistId}/agenda`,
      { params: { date } },
    );
    const items = (
      Array.isArray(response)
        ? response
        : (response as Record<string, unknown>)?.items ||
          (response as { data?: TherapistAgendaItem[] })?.data ||
          []
    ) as Record<string, unknown>[];
    return items.map((item) => {
      const rawStatus =
        (item.status as string) || (item.appointmentStatus as string) || 'SCHEDULED';
      return {
        ...item,
        status: normalizeStatus(rawStatus),
      } as unknown as TherapistAgendaItem;
    });
  },

  getStats: async (therapistId: string): Promise<TherapistStats> => {
    const response = await axiosClient.get<unknown, TherapistStats>(
      `/therapists/${therapistId}/stats`,
    );
    return response;
  },

  getScheduleConfig: async (therapistId: string): Promise<TherapistScheduleConfig> => {
    const response = await axiosClient.get<unknown, RawScheduleResponse | RawScheduleItem[]>(
      `/therapists/${therapistId}/schedule-config`,
    );

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
      weeklyRules: DEFAULT_WEEKLY_RULES,
    };
  },

  updateScheduleConfig: async (
    config: TherapistScheduleConfig,
  ): Promise<TherapistScheduleConfig> => {
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
  },

  updateStatus: async (
    payload: StatusUpdatePayload,
  ): Promise<{ success: boolean; payload: StatusUpdatePayload }> => {
    const response = await axiosClient.patch<
      unknown,
      { success: boolean; payload: StatusUpdatePayload }
    >(`/appointments/${payload.appointmentId}/status`, { status: payload.status });
    return response;
  },

  updateNotes: async (
    payload: ClinicalNotesPayload,
  ): Promise<{ success: boolean; payload: ClinicalNotesPayload }> => {
    const response = await axiosClient.patch<
      unknown,
      { success: boolean; payload: ClinicalNotesPayload }
    >(`/appointments/${payload.appointmentId}/notes`, { notes: payload.notes });
    return response;
  },
};
