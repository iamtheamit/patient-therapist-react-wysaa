import { ROUTES } from './routes';

export interface PatientNavItem {
  id: string;
  label: string;
  shortLabel?: string;
  href: string;
  icon: string;
  badgeCount?: number;
  badgeVariant?: 'primary' | 'error' | 'secondary';
  dividerAfter?: boolean;
  comingSoon?: boolean;
}

export const PATIENT_NAV_ITEMS: PatientNavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: ROUTES.PATIENT.DASHBOARD,
    icon: 'dashboard',
  },
  {
    id: 'therapists',
    label: 'Therapists',
    href: ROUTES.PATIENT.BOOK,
    icon: 'group',
  },
  {
    id: 'appointments',
    label: 'My Appointments',
    shortLabel: 'Appointments',
    href: `${ROUTES.PATIENT.DASHBOARD}?view=appointments`,
    icon: 'calendar_month',
    dividerAfter: true,
  },
  {
    id: 'messages',
    label: 'Messages',
    href: ROUTES.PATIENT.MESSAGES,
    icon: 'chat',
    badgeCount: 2,
    badgeVariant: 'error',
    comingSoon: true,
  },
  {
    id: 'payments',
    label: 'Payments',
    href: ROUTES.PATIENT.PAYMENTS,
    icon: 'payments',
    dividerAfter: true,
    comingSoon: true,
  },
  {
    id: 'profile',
    label: 'Profile',
    href: ROUTES.PATIENT.PROFILE,
    icon: 'person',
  },
  {
    id: 'settings',
    label: 'Settings',
    href: ROUTES.PATIENT.SETTINGS,
    icon: 'settings',
  },
];
