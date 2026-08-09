// ─── Shared appointment shape returned from dashboard API ─────────────────────

export interface DashboardTherapistSummary {
  id: string;
  name: string;
  email: string;
  specialization?: string;
}

export interface DashboardPatientSummary {
  id: string;
  name: string;
  email: string;
}

export interface DashboardAppointment {
  id: string;
  patientId: string;
  therapistId: string;
  bookingType: string;
  seriesId: string | null;
  recurrenceFrequency: string;
  recurrenceEndDate: string | null;
  status: string;
  appointmentStatus: string;
  paymentStatus: string;
  holdExpiresAt: string | null;
  startTime: string;
  endTime: string;
  createdAt: string;
  updatedAt: string;
  meetingLink?: string;
  // For patient dashboard — therapist is included
  therapist?: DashboardTherapistSummary;
  // For therapist dashboard — patient is included
  patient?: DashboardPatientSummary;
}

// ─── Patient Dashboard ───────────────────────────────────────────────────────

export interface PatientDashboardStats {
  totalCompletedSessions: number;
  upcomingSessionsCount: number;
  activeHoldsCount: number;
  assignedTherapistsCount: number;
}

export interface PatientDashboardData {
  role: 'PATIENT';
  stats: PatientDashboardStats;
  nextSession: DashboardAppointment | null;
  upcomingAppointments: DashboardAppointment[];
  activeHolds: DashboardAppointment[];
  recentAppointments: DashboardAppointment[];
}

// ─── Therapist Dashboard ─────────────────────────────────────────────────────

export interface TherapistDashboardStats {
  todaySessionsCount: number;
  upcomingSessionsCount: number;
  pendingHoldsCount: number;
  totalPatientsCount: number;
  completedSessionsCount: number;
}

export interface TherapistDashboardData {
  role: 'THERAPIST';
  stats: TherapistDashboardStats;
  nextSession: DashboardAppointment | null;
  todaySchedule: DashboardAppointment[];
  upcomingAppointments: DashboardAppointment[];
  recentAppointments: DashboardAppointment[];
}

// ─── Discriminated Union ─────────────────────────────────────────────────────

export type DashboardData = PatientDashboardData | TherapistDashboardData;
