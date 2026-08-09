export type AppointmentStatus =
  | 'SCHEDULED'
  | 'CONFIRMED'
  | 'COMPLETED'
  | 'NO_SHOW'
  | 'CANCELLED'
  | 'HELD'
  | 'HOLD_EXPIRED'
  | 'PAYMENT_FAILED';

export const normalizeStatus = (raw: string): AppointmentStatus => {
  const upper = raw.toUpperCase();
  if (upper === 'HOLD') return 'HELD';
  return upper as AppointmentStatus;
};

export interface TherapistSummary {
  id: string;
  name: string;
  specialization: string;
  avatarUrl?: string;
}

export interface PatientAppointment {
  id: string;
  patientId: string;
  therapist: TherapistSummary;
  startTime: string; // ISO 8601 UTC
  endTime: string; // ISO 8601 UTC
  status: AppointmentStatus;
  notes?: string;
  meetingLink?: string;
  createdAt: string;
  holdExpiresAt?: string;
}
