import type { AppointmentStatus } from '@/features/patient/types/patient.types';

export interface PatientSummary {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface TherapistAgendaItem {
  id: string;
  therapistId: string;
  patient: PatientSummary;
  startTime: string; // ISO 8601 UTC
  endTime: string; // ISO 8601 UTC
  status: AppointmentStatus;
  notes?: string;          // Patient's booking note (read-only)
  clinicalNotes?: string;  // Therapist's clinical/session notes (editable)
  meetingLink?: string;
  createdAt: string;
}


export interface TherapistStats {
  todaySessionsCount: number;
  pendingConfirmationsCount: number;
  activePatientsCount: number;
}

export interface StatusUpdatePayload {
  appointmentId: string;
  status: AppointmentStatus;
}

export interface ClinicalNotesPayload {
  appointmentId: string;
  notes: string;
}

export type DayOfWeek =
  'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export interface DayScheduleRule {
  day: DayOfWeek;
  isEnabled: boolean;
  startTime: string; // "09:00"
  endTime: string; // "17:00"
  breakStartTime?: string; // "12:00"
  breakEndTime?: string; // "13:00"
}

export interface TherapistScheduleConfig {
  therapistId: string;
  slotDurationMinutes: number;
  bufferDurationMinutes: number;
  weeklyRules: DayScheduleRule[];
}
