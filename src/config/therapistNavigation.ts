import { ROUTES } from './routes';

export interface TherapistNavItem {
  id: string;
  label: string;
  shortLabel?: string;
  icon: string;
  href: string;
  badgeCount?: number;
  badgeVariant?: 'primary' | 'error' | 'secondary';
  dividerAfter?: boolean;
}

export const THERAPIST_NAV_ITEMS: TherapistNavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: 'dashboard',
    href: ROUTES.THERAPIST.DASHBOARD,
  },
  {
    id: 'appointments',
    label: 'My Appointments',
    shortLabel: 'Appointments',
    icon: 'calendar_month',
    href: ROUTES.THERAPIST.APPOINTMENTS,
  },
  {
    id: 'schedule',
    label: 'Schedule & Availability',
    shortLabel: 'Schedule',
    icon: 'event_available',
    href: ROUTES.THERAPIST.SCHEDULE,
    dividerAfter: true,
  },
  {
    id: 'patients',
    label: 'Patient Directory',
    icon: 'group',
    href: ROUTES.THERAPIST.PATIENTS,
  },
  {
    id: 'messages',
    label: 'Messages',
    icon: 'chat',
    href: ROUTES.THERAPIST.MESSAGES,
    badgeCount: 3,
    badgeVariant: 'error',
    dividerAfter: true,
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: 'bar_chart',
    href: ROUTES.THERAPIST.REPORTS,
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: 'settings',
    href: ROUTES.THERAPIST.SETTINGS,
  },
];
