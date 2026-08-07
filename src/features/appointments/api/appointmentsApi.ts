import { axiosClient } from '@/api/axiosClient';
import type {
  TherapistProfile,
  AvailableSlot,
  BookAppointmentPayload,
} from '../types/appointments.types';
import type { SlotHoldSession } from '../types/hold.types';
import type { RecurringBookingPayload, RecurringBookingResponse } from '../types/recurring.types';
import type { PatientAppointment } from '@/features/patient/types/patient.types';

import { useTherapistStatusStore } from '@/stores/therapistStatusStore';

export const appointmentsApi = {
  getTherapists: async (): Promise<TherapistProfile[]> => {
    try {
      const response = await axiosClient.get<unknown, TherapistProfile[]>('/therapists');
      return response;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return [
        {
          id: 'therapist-1',
          name: 'Dr. Sarah Connor',
          specialization: 'Cognitive Behavioral Therapy (CBT)',
          avatarUrl:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuDTf1ffvDkCcFUrkgufSLU5b5rl5E0xYYSfZ1ssnFH-TctvnOzXWey_6Qe-Jd0Ck0b-TsXxVTNdCdKqehwfBNnpFxLAC2kV-n-dDwfE-qpzhT52oWqYgoHZ3Il6FYHeKtIj4tO2VotciFst6JlxEgBpJW6y8iAjgR88DEy4PsgRctla5fSXqPlmJ6I0vwJyDBAh9b-QxBdI49Y3kt96Tg_DyJ4j_4QZuJ8M0LDAxnKZmF1BbLT63qCe',
          bio: 'Specialist in anxiety disorders, depression, and stress management with 8+ years clinical experience.',
          experienceYears: 8,
          rating: 4.9,
          availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        },
        {
          id: 'therapist-2',
          name: 'Dr. Marcus Vance',
          specialization: 'Mindfulness & Mood Care',
          avatarUrl:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuCqZmuUQmcTVzJTMOdgIeA6noCDs1eRLKlJaPfthz5mrVwLWqmpQX2h-Doj7HkphDsRhTwWR388HV8Hrrz9suhMoYYMDkWXLiAgbTYOL0hELQT9g5a_EJfzin8N9hNg8CVb1HR30zxjKcwjQAh0h9ts8RZRI0TqzbeAW8kIeGapeVzZt8r9M2NCNPrC_Z0bYcHB7K4DxyFUO9DCA4_lQIjEWxDwQFQHMd00m7bm8aa1f3eNhpVD9AMA',
          bio: 'Focused on mindfulness-based stress reduction (MBSR) and personal wellness coaching.',
          experienceYears: 6,
          rating: 4.8,
          availableDays: ['Mon', 'Wed', 'Fri'],
        },
        {
          id: 'therapist-3',
          name: 'Dr. Elena Rostova',
          specialization: 'Trauma & Resilience Therapy',
          avatarUrl:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuDllZUXRO5e7rF6Up-dc4pvNDJ0qWv7OphWn2vlLZcPEn3gJis9Q7DOo0DilkDLApu90FgIYAkRaz6PoaBtXIdwAKFLCg9BuwN4-IrK4xmi4NwRId8AiVCXUdfMbvWkwvXO3_591mt9jq8yU818JRbO8uNorJahJ37S2IGe_wRKmqy4ECkBTkkg0fARTOXTKWrQ8RtKeK8_tdah2K5_EyvC1HYbsRa1hRoGa6vQBOitJ0QrtVfJxECd',
          bio: 'Expert in trauma-informed care, relationship counseling, and resilience building.',
          experienceYears: 10,
          rating: 5.0,
          availableDays: ['Tue', 'Thu', 'Sat'],
        },
      ];
    }
  },

  getAvailableSlots: async (therapistId: string, date: string): Promise<AvailableSlot[]> => {
    // Check if therapist is offline (Dr. Sarah Connor / therapist-1)
    const isOnline = useTherapistStatusStore.getState().isOnline;
    if (therapistId === 'therapist-1' && !isOnline) {
      return [];
    }

    try {
      const response = await axiosClient.get<unknown, AvailableSlot[]>(
        `/therapists/${therapistId}/slots`,
        { params: { date } },
      );
      return response;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 600));

      const targetDate = date ? new Date(date) : new Date();

      const times = [
        { hour: 9, minute: 0 },
        { hour: 10, minute: 30 },
        { hour: 13, minute: 0 },
        { hour: 14, minute: 30 },
        { hour: 16, minute: 0 },
      ];

      return times.map((t, index) => {
        const start = new Date(targetDate);
        start.setHours(t.hour, t.minute, 0, 0);

        const end = new Date(start);
        end.setHours(t.hour + 1, t.minute, 0, 0);

        const isBooked = index === 1;

        return {
          id: `slot-${therapistId}-${index + 1}`,
          therapistId,
          startTime: start.toISOString(),
          endTime: end.toISOString(),
          isAvailable: !isBooked,
        };
      });
    }
  },

  holdSlot: async (slotId: string, therapistId: string): Promise<SlotHoldSession> => {
    try {
      const response = await axiosClient.post<unknown, SlotHoldSession>(`/slots/${slotId}/hold`, {
        therapistId,
        durationSeconds: 300,
      });
      return response;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 400));
      // 5-minute optimistic hold lock (300,000ms)
      const expiresAt = Date.now() + 300 * 1000;
      return {
        holdId: `hold-${Date.now()}`,
        slotId,
        therapistId,
        expiresAt,
      };
    }
  },

  releaseSlot: async (holdId: string): Promise<{ success: boolean }> => {
    try {
      const response = await axiosClient.post<unknown, { success: boolean }>(
        `/slots/holds/${holdId}/release`,
      );
      return response;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return { success: true };
    }
  },

  bookAppointment: async (payload: BookAppointmentPayload): Promise<PatientAppointment> => {
    try {
      const response = await axiosClient.post<unknown, PatientAppointment>(
        '/appointments',
        payload,
      );
      return response;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 800));

      const now = new Date();
      return {
        id: `app-${Date.now()}`,
        patientId: payload.patientId,
        therapist: {
          id: payload.therapistId,
          name: 'Dr. Sarah Connor',
          specialization: 'Cognitive Behavioral Therapy (CBT)',
        },
        startTime: new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString(),
        endTime: new Date(now.getTime() + 25 * 60 * 60 * 1000).toISOString(),
        status: 'CONFIRMED',
        notes: payload.notes,
        meetingLink: 'https://meet.therapysync.example.com/new-session',
        createdAt: now.toISOString(),
      };
    }
  },

  bookRecurringAppointment: async (
    payload: RecurringBookingPayload,
  ): Promise<RecurringBookingResponse> => {
    try {
      const response = await axiosClient.post<unknown, RecurringBookingResponse>(
        '/appointments/recurring',
        payload,
      );
      return response;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 900));

      const createdAppointments = Array.from({
        length: payload.recurringRule.occurrencesCount,
      }).map((_, index) => {
        const start = new Date(Date.now() + (index + 1) * 7 * 24 * 60 * 60 * 1000);
        const end = new Date(start.getTime() + 60 * 60 * 1000);
        return {
          id: `app-recurring-${index + 1}`,
          startTime: start.toISOString(),
          endTime: end.toISOString(),
        };
      });

      return {
        seriesId: `series-${Date.now()}`,
        createdCount: payload.recurringRule.occurrencesCount,
        appointments: createdAppointments,
      };
    }
  },
};
