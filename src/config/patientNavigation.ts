import { ROUTES } from './routes';

export interface PatientNavItem {
  id: string;
  label: string;
  href: string;
  icon: string;
  badgeCount?: number;
  badgeVariant?: 'primary' | 'error' | 'secondary';
  dividerAfter?: boolean;
}

export const PATIENT_NAV_ITEMS: PatientNavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: ROUTES.PATIENT.DASHBOARD,
    icon: 'dashboard',
  },
  {
    id: 'appointments',
    label: 'My Appointments',
    href: `${ROUTES.PATIENT.DASHBOARD}#appointments`,
    icon: 'calendar_month',
  },
  {
    id: 'book',
    label: 'Book Session',
    href: ROUTES.PATIENT.BOOK,
    icon: 'add_circle',
    dividerAfter: true,
  },
  {
    id: 'holds',
    label: 'My Holds',
    href: `${ROUTES.PATIENT.DASHBOARD}#holds`,
    icon: 'schedule',
    badgeCount: 1,
    badgeVariant: 'primary',
  },
  {
    id: 'therapists',
    label: 'Therapists',
    href: ROUTES.PATIENT.BOOK,
    icon: 'group',
  },
  {
    id: 'messages',
    label: 'Messages',
    href: '#messages',
    icon: 'chat',
    badgeCount: 2,
    badgeVariant: 'error',
  },
  {
    id: 'payments',
    label: 'Payments',
    href: '#payments',
    icon: 'payments',
    dividerAfter: true,
  },
  {
    id: 'profile',
    label: 'Profile',
    href: '#profile',
    icon: 'person',
  },
  {
    id: 'settings',
    label: 'Settings',
    href: '#settings',
    icon: 'settings',
  },
];
