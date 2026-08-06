import type { TherapistSummary } from '@/features/patient/types/patient.types';

export interface TherapistProfile extends TherapistSummary {
  bio: string;
  experienceYears: number;
  rating: number;
  availableDays: string[];
}

export interface AvailableSlot {
  id: string;
  therapistId: string;
  startTime: string; // ISO 8601 UTC
  endTime: string; // ISO 8601 UTC
  isAvailable: boolean;
  isHeld?: boolean;
  heldUntil?: string;
}

export interface BookAppointmentPayload {
  patientId: string;
  therapistId: string;
  slotId: string;
  notes?: string;
}

export type BookingStep = 1 | 2 | 3;
