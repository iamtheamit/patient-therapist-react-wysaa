import { axiosClient } from '@/api/axiosClient';
import type {
  TherapistProfile,
  AvailableSlot,
  BookAppointmentPayload,
} from '../types/appointments.types';
import type { SlotHoldSession } from '../types/hold.types';
import type { RecurringBookingPayload, RecurringBookingResponse } from '../types/recurring.types';
import type { PatientAppointment } from '@/features/patient/types/patient.types';
import { PROFILE_ENRICHMENT, DEFAULT_PROFILE } from '../config/therapistEnrichment';

export const appointmentsApi = {
  getTherapists: async (): Promise<TherapistProfile[]> => {
    try {
      const response = await axiosClient.get<unknown, Record<string, unknown>[]>('/therapists');
      const items: Record<string, unknown>[] = Array.isArray(response)
        ? response
        : ((response as Record<string, unknown>)?.items as Record<string, unknown>[]) || [];

      if (Array.isArray(items) && items.length > 0) {
        return items.map((t) => {
          const name = (t.name as string) || '';
          const enrichment = PROFILE_ENRICHMENT[name] || {};
          return {
            id: t.id as string,
            name,
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
    const response = await axiosClient.get<unknown, Record<string, unknown>[]>(
      '/appointments/availability',
      { params: { therapistId, startDate: date, endDate: date } },
    );
    const items: Record<string, unknown>[] = Array.isArray(response)
      ? response
      : ((response as Record<string, unknown>)?.items as Record<string, unknown>[]) || [];

    if (Array.isArray(items)) {
      return items.map((s, index) => ({
        id: `slot-${therapistId}-${(s.startTime as string) || index}`,
        therapistId,
        startTime: s.startTime as string,
        endTime: s.endTime as string,
        isAvailable: true,
      }));
    }

    return [];
  },

  holdSlot: async (
    slotId: string,
    therapistId: string,
    startTime: string,
    endTime: string,
  ): Promise<SlotHoldSession> => {
    // No catch/fallback — errors must propagate to useSlotHold so the user
    // sees a meaningful "slot unavailable" message and cannot proceed to checkout.
    const response = await axiosClient.post<unknown, Record<string, unknown>[]>(
      '/appointments/hold',
      {
        therapistId,
        startTime,
        endTime,
        bookingType: 'ONE_TIME',
      },
    );
    const appointments = response as Record<string, unknown>[];
    const firstAppt = appointments[0];
    return {
      holdId: firstAppt.id as string,
      slotId,
      therapistId,
      expiresAt: new Date(firstAppt.holdExpiresAt as string).getTime(),
    };
  },

  releaseSlot: async (holdId: string): Promise<{ success: boolean }> => {
    await axiosClient.post<unknown, unknown>(`/appointments/holds/${holdId}/release`);
    return { success: true };
  },

  bookAppointment: async (payload: BookAppointmentPayload): Promise<PatientAppointment> => {
    if (!payload.holdId) {
      throw new Error('Hold ID is required to complete booking');
    }
    // No catch/fallback — errors must propagate to onError handler.
    const response = await axiosClient.post<unknown, Record<string, unknown>>(
      `/appointments/${payload.holdId}/pay`,
      {
        status: 'SUCCESS',
        notes: payload.notes || undefined,
      },
    );
    const therapist = response.therapist as Record<string, unknown> | undefined;
    return {
      id: response.id as string,
      patientId: response.patientId as string,
      therapist: {
        id: (response.therapistId as string) || (therapist?.id as string) || '',
        name: (therapist?.name as string) || payload.therapistName || '',
        specialization: (therapist?.specialization as string) || '',
      },
      startTime: response.startTime as string,
      endTime: response.endTime as string,
      status: response.appointmentStatus as PatientAppointment['status'],
      notes: (response.notes as string) || payload.notes || '',
      // Only include meetingLink if the backend actually provides one
      ...(response.meetingLink ? { meetingLink: response.meetingLink as string } : {}),
      createdAt: response.createdAt as string,
    };
  },

  bookRecurringAppointment: async (
    payload: RecurringBookingPayload,
  ): Promise<RecurringBookingResponse> => {
    // No catch/fallback — errors propagate to useBookRecurringAppointment.onError.
    const freq =
      payload.recurringRule.frequency === 'BIWEEKLY'
        ? 'BI_WEEKLY'
        : payload.recurringRule.frequency;

    // Step 1: Create all HOLDs atomically for the recurring series
    const holds = await axiosClient.post<unknown, Record<string, unknown>[]>('/appointments/hold', {
      therapistId: payload.therapistId,
      startTime: payload.startTime,
      endTime: payload.endTime,
      bookingType: 'RECURRING',
      recurrenceFrequency: freq,
      recurrenceEndDate: payload.recurrenceEndDate,
    });

    const holdsArr = holds as Record<string, unknown>[];
    const seriesId = holdsArr[0]?.seriesId as string | undefined;
    if (!seriesId) {
      throw new Error('Failed to create recurring series — no seriesId returned.');
    }

    // Step 2: Confirm the entire series atomically in one transaction
    const seriesResult = await axiosClient.post<unknown, Record<string, unknown>>(
      `/appointments/series/${seriesId}/pay`,
      { notes: payload.notes || undefined },
    );

    return {
      seriesId: (seriesResult.seriesId as string) || seriesId,
      createdCount: (seriesResult.confirmedCount as number) || holdsArr.length,
      appointments: (seriesResult.appointments as PatientAppointment[]) || [],
    };
  },
};
