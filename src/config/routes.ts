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
    SCHEDULE: '/therapist/schedule',
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
  | typeof ROUTES.THERAPIST.SCHEDULE;
