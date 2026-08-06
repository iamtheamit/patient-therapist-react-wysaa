/**
 * Type-Safe Query Key Factory
 * Centralizes all query keys used by TanStack Query across features to prevent cache key collisions.
 */

export const QUERY_KEYS = {
  AUTH: {
    ROOT: ['auth'] as const,
    USER: () => [...QUERY_KEYS.AUTH.ROOT, 'user'] as const,
  },
  APPOINTMENTS: {
    ROOT: ['appointments'] as const,
    LIST: (filters?: Record<string, unknown>) =>
      [...QUERY_KEYS.APPOINTMENTS.ROOT, 'list', filters] as const,
    PATIENT_UPCOMING: (patientId: string) =>
      [...QUERY_KEYS.APPOINTMENTS.ROOT, 'patient', patientId, 'upcoming'] as const,
    THERAPIST_AGENDA: (therapistId: string, date: string) =>
      [...QUERY_KEYS.APPOINTMENTS.ROOT, 'therapist', therapistId, 'agenda', date] as const,
    DETAIL: (id: string) => [...QUERY_KEYS.APPOINTMENTS.ROOT, 'detail', id] as const,
  },
  SCHEDULES: {
    ROOT: ['schedules'] as const,
    THERAPIST_RULES: (therapistId: string) =>
      [...QUERY_KEYS.SCHEDULES.ROOT, 'therapist', therapistId, 'rules'] as const,
    THERAPIST_CONFIG: (therapistId: string) =>
      [...QUERY_KEYS.SCHEDULES.ROOT, 'therapist', therapistId, 'config'] as const,
    AVAILABLE_SLOTS: (therapistId: string, date: string) =>
      [...QUERY_KEYS.SCHEDULES.ROOT, 'slots', therapistId, date] as const,
  },
} as const;
