export const ROUTES = {
  HOME: '/',
  AUTH: {
    LOGIN: '/login',
    REGISTER: '/register',
  },
  PATIENT: {
    DASHBOARD: '/patient/dashboard',
    BOOK: '/patient/book',
  },
  THERAPIST: {
    DASHBOARD: '/therapist/dashboard',
    APPOINTMENTS: '/therapist/appointments',
    SCHEDULE: '/therapist/schedule',
    AVAILABILITY: '/therapist/availability',
    PATIENTS: '/therapist/patients',
    // MESSAGES: '/therapist/messages',
    REPORTS: '/therapist/reports',
    SETTINGS: '/therapist/settings',
  },
  NOT_FOUND: '*',
} as const;

export type RoutePath =
  | typeof ROUTES.HOME
  | typeof ROUTES.AUTH.LOGIN
  | typeof ROUTES.AUTH.REGISTER
  | typeof ROUTES.PATIENT.DASHBOARD
  | typeof ROUTES.PATIENT.BOOK
  | typeof ROUTES.THERAPIST.DASHBOARD
  | typeof ROUTES.THERAPIST.APPOINTMENTS
  | typeof ROUTES.THERAPIST.SCHEDULE
  | typeof ROUTES.THERAPIST.AVAILABILITY
  | typeof ROUTES.THERAPIST.PATIENTS
  // | typeof ROUTES.THERAPIST.MESSAGES
  | typeof ROUTES.THERAPIST.REPORTS
  | typeof ROUTES.THERAPIST.SETTINGS;
