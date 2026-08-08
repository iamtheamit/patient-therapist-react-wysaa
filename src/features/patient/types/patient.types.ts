export type AppointmentStatus =
  | 'SCHEDULED'
  | 'CONFIRMED'
  | 'COMPLETED'
  | 'NO_SHOW'
  | 'CANCELLED'
  | 'HELD'
  | 'HOLD_EXPIRED'
  | 'PAYMENT_FAILED'
  | 'scheduled'
  | 'completed'
  | 'no_show'
  | 'cancelled';

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
}

export interface PatientDashboardStats {
  totalCompletedSessions: number;
  upcomingSessionsCount: number;
  assignedTherapistsCount: number;
}
