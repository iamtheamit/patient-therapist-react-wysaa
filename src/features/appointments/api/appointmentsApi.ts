/* eslint-disable @typescript-eslint/no-explicit-any */
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
    // Hardcoded enrichment data keyed by therapist name.
    // The backend User model only stores id/name/email — UI-specific profile
    // fields (specialization, bio, avatar, etc.) are supplemented here until
    // a full therapist-profile table is added.
    const PROFILE_ENRICHMENT: Record<string, Partial<TherapistProfile>> = {
      'Dr. Sarah Connor': {
        specialization: 'Cognitive Behavioral Therapy (CBT)',
        avatarUrl:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuDTf1ffvDkCcFUrkgufSLU5b5rl5E0xYYSfZ1ssnFH-TctvnOzXWey_6Qe-Jd0Ck0b-TsXxVTNdCdKqehwfBNnpFxLAC2kV-n-dDwfE-qpzhT52oWqYgoHZ3Il6FYHeKtIj4tO2VotciFst6JlxEgBpJW6y8iAjgR88DEy4PsgRctla5fSXqPlmJ6I0vwJyDBAh9b-QxBdI49Y3kt96Tg_DyJ4j_4QZuJ8M0LDAxnKZmF1BbLT63qCe',
        bio: 'Specialist in anxiety disorders, depression, and stress management with 8+ years clinical experience.',
        experienceYears: 8,
        rating: 4.9,
        availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      },
      'Dr. Marcus Vance': {
        specialization: 'Mindfulness & Mood Care',
        avatarUrl:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuCqZmuUQmcTVzJTMOdgIeA6noCDs1eRLKlJaPfthz5mrVwLWqmpQX2h-Doj7HkphDsRhTwWR388HV8Hrrz9suhMoYYMDkWXLiAgbTYOL0hELQT9g5a_EJfzin8N9hNg8CVb1HR30zxjKcwjQAh0h9ts8RZRI0TqzbeAW8kIeGapeVzZt8r9M2NCNPrC_Z0bYcHB7K4DxyFUO9DCA4_lQIjEWxDwQFQHMd00m7bm8aa1f3eNhpVD9AMA',
        bio: 'Focused on mindfulness-based stress reduction (MBSR) and personal wellness coaching.',
        experienceYears: 6,
        rating: 4.8,
        availableDays: ['Mon', 'Wed', 'Fri'],
      },
      'Dr. Elena Rostova': {
        specialization: 'Trauma & Resilience Therapy',
        avatarUrl:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuDllZUXRO5e7rF6Up-dc4pvNDJ0qWv7OphWn2vlLZcPEn3gJis9Q7DOo0DilkDLApu90FgIYAkRaz6PoaBtXIdwAKFLCg9BuwN4-IrK4xmi4NwRId8AiVCXUdfMbvWkwvXO3_591mt9jq8yU818JRbO8uNorJahJ37S2IGe_wRKmqy4ECkBTkkg0fARTOXTKWrQ8RtKeK8_tdah2K5_EyvC1HYbsRa1hRoGa6vQBOitJ0QrtVfJxECd',
        bio: 'Expert in trauma-informed care, relationship counseling, and resilience building.',
        experienceYears: 10,
        rating: 5.0,
        availableDays: ['Tue', 'Thu', 'Sat'],
      },
    };

    const DEFAULT_PROFILE: Omit<TherapistProfile, 'id' | 'name'> = {
      specialization: 'General Counseling',
      bio: 'Licensed clinical therapist providing evidence-based care.',
      experienceYears: 5,
      rating: 4.5,
      availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    };

    try {
      const response = await axiosClient.get<unknown, any>('/therapists');
      const items = Array.isArray(response) ? response : (response as any)?.items || [];

      if (Array.isArray(items) && items.length > 0) {
        return items.map((t) => {
          const enrichment = PROFILE_ENRICHMENT[t.name] || {};
          return {
            id: t.id,
            name: t.name,
            specialization: enrichment.specialization || DEFAULT_PROFILE.specialization,
            avatarUrl: enrichment.avatarUrl,
            bio: enrichment.bio || DEFAULT_PROFILE.bio,
            experienceYears: enrichment.experienceYears || DEFAULT_PROFILE.experienceYears,
            rating: enrichment.rating || DEFAULT_PROFILE.rating,
            availableDays: enrichment.availableDays || DEFAULT_PROFILE.availableDays,
          };
        });
      }

      return [];
    } catch {
      // API unreachable — return empty so the UI shows "No therapists found"
      return [];
    }
  },

  getAvailableSlots: async (therapistId: string, date: string): Promise<AvailableSlot[]> => {
    // Check if therapist is offline (Dr. Sarah Connor / therapist-1)
    const isOnline = useTherapistStatusStore.getState().isOnline;
    if (therapistId === 'therapist-1' && !isOnline) {
      return [];
    }

    try {
      const response = await axiosClient.get<unknown, any>('/appointments/availability', {
        params: { therapistId, startDate: date, endDate: date },
      });
      const items = Array.isArray(response) ? response : (response as any)?.items || [];

      if (Array.isArray(items)) {
        return items.map((s: any, index: number) => ({
          id: `slot-${therapistId}-${s.startTime || index}`,
          therapistId,
          startTime: s.startTime,
          endTime: s.endTime,
          isAvailable: true,
        }));
      }

      return [];
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

  holdSlot: async (
    slotId: string,
    therapistId: string,
    startTime: string,
    endTime: string,
  ): Promise<SlotHoldSession> => {
    // No catch/fallback — errors must propagate to useSlotHold so the user
    // sees a meaningful "slot unavailable" message and cannot proceed to checkout.
    const response = await axiosClient.post<unknown, any>('/appointments/hold', {
      therapistId,
      startTime,
      endTime,
      bookingType: 'ONE_TIME',
    });
    const appointments = response as any[];
    const firstAppt = appointments[0];
    return {
      holdId: firstAppt.id,
      slotId,
      therapistId,
      expiresAt: new Date(firstAppt.holdExpiresAt).getTime(),
    };
  },

  releaseSlot: async (holdId: string): Promise<{ success: boolean }> => {
    try {
      await axiosClient.post<unknown, any>(`/appointments/holds/${holdId}/release`);
      return { success: true };
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return { success: true };
    }
  },

  bookAppointment: async (payload: BookAppointmentPayload): Promise<PatientAppointment> => {
    if (!payload.holdId) {
      throw new Error('Hold ID is required to complete booking');
    }
    // Note: No catch/fallback here — errors (e.g. ConflictError from backend) must propagate
    // so the mutation's onError handler shows the correct "Booking Failed" toast.
    const response = await axiosClient.post<unknown, any>(`/appointments/${payload.holdId}/pay`, {
      status: 'SUCCESS',
    });
    return {
      id: response.id,
      patientId: response.patientId,
      therapist: {
        id: response.therapistId,
        name: response.therapist?.name || payload.therapistName || 'Dr. Sarah Connor',
        specialization: response.therapist?.specialization || 'Cognitive Behavioral Therapy (CBT)',
      },
      startTime: response.startTime,
      endTime: response.endTime,
      status: response.appointmentStatus,
      notes: payload.notes || '',
      meetingLink: 'https://meet.therapysync.example.com/new-session',
      createdAt: response.createdAt,
    };
  },

  bookRecurringAppointment: async (
    payload: RecurringBookingPayload,
  ): Promise<RecurringBookingResponse> => {
    try {
      const freq =
        payload.recurringRule.frequency === 'BIWEEKLY'
          ? 'BI_WEEKLY'
          : payload.recurringRule.frequency;

      const holds = await axiosClient.post<unknown, any[]>('/appointments/hold', {
        therapistId: payload.therapistId,
        startTime: payload.startTime,
        endTime: payload.endTime,
        bookingType: 'RECURRING',
        recurrenceFrequency: freq,
        recurrenceEndDate: payload.recurrenceEndDate,
      });

      const confirmedAppointments = [];
      for (const hold of holds) {
        const confirmed = await axiosClient.post<unknown, any>(`/appointments/${hold.id}/pay`, {
          status: 'SUCCESS',
        });
        confirmedAppointments.push(confirmed);
      }

      return {
        seriesId: holds[0]?.seriesId || `series-${Date.now()}`,
        createdCount: confirmedAppointments.length,
        appointments: confirmedAppointments.map((c) => ({
          id: c.id,
          startTime: c.startTime,
          endTime: c.endTime,
        })),
      };
    } catch (error) {
      console.error('Failed to book recurring appointment series, using fallback', error);
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
