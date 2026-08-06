export type AppointmentStatus = 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'HELD';

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
