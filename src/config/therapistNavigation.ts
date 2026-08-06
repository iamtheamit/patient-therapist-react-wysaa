import { ROUTES } from './routes';

export interface TherapistNavItem {
  id: string;
  label: string;
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
    icon: 'event',
    href: '#appointments',
  },
  {
    id: 'schedule',
    label: 'Schedule',
    icon: 'calendar_month',
    href: ROUTES.THERAPIST.SCHEDULE,
  },
  {
    id: 'availability',
    label: 'My Availability',
    icon: 'schedule',
    href: '#availability',
  },
  {
    id: 'patients',
    label: 'Patients',
    icon: 'group',
    href: '#patients',
  },
  {
    id: 'messages',
    label: 'Messages',
    icon: 'chat',
    href: '#messages',
    badgeCount: 3,
    badgeVariant: 'error',
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: 'bar_chart',
    href: '#reports',
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: 'settings',
    href: '#settings',
  },
];
