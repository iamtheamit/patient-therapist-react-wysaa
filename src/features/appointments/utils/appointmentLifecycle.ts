import type { AppointmentStatus } from '@/features/patient/types/patient.types';

export type ExtendedAppointmentStatus = AppointmentStatus | 'IN_PROGRESS' | 'NO_SHOW';

const ALLOWED_TRANSITIONS: Record<ExtendedAppointmentStatus, ExtendedAppointmentStatus[]> = {
  HELD: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW'],
  SCHEDULED: ['CONFIRMED', 'COMPLETED', 'CANCELLED', 'NO_SHOW'],
  IN_PROGRESS: ['COMPLETED', 'CANCELLED'],
  COMPLETED: [],
  CANCELLED: [],
  NO_SHOW: [],
  HOLD_EXPIRED: [],
  PAYMENT_FAILED: [],
};

export const canTransitionStatus = (
  currentStatus: ExtendedAppointmentStatus,
  targetStatus: ExtendedAppointmentStatus,
): boolean => {
  const allowedTargets = ALLOWED_TRANSITIONS[currentStatus];
  return allowedTargets ? allowedTargets.includes(targetStatus) : false;
};

export const getStatusBadgeConfig = (status: ExtendedAppointmentStatus) => {
  switch (status) {
    case 'CONFIRMED':
      return { variant: 'success' as const, label: 'Confirmed' };
    case 'SCHEDULED':
      return { variant: 'info' as const, label: 'Scheduled' };
    case 'IN_PROGRESS':
      return { variant: 'warning' as const, label: 'In Progress' };
    case 'COMPLETED':
      return { variant: 'info' as const, label: 'Completed' };
    case 'CANCELLED':
      return { variant: 'error' as const, label: 'Cancelled' };
    case 'HELD':
      return { variant: 'warning' as const, label: 'Held Lock' };
    case 'HOLD_EXPIRED':
      return { variant: 'neutral' as const, label: 'Expired Hold' };
    case 'PAYMENT_FAILED':
      return { variant: 'error' as const, label: 'Payment Failed' };
    case 'NO_SHOW':
      return { variant: 'error' as const, label: 'No-Show' };
    default:
      return { variant: 'neutral' as const, label: status };
  }
};
