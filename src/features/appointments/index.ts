/**
 * Appointments Feature Domain Boundary
 * Public entrypoint exporting components, custom hooks, types, and API functions.
 */

export { TherapistSelector } from './components/TherapistSelector';
export { SlotGrid } from './components/SlotGrid';
export { BookingConfirmationForm } from './components/BookingConfirmationForm';
export { HoldCountdownBanner } from './components/HoldCountdownBanner';
export { RecurringRuleSelector } from './components/RecurringRuleSelector';
export { TherapistAvatar } from './components/TherapistAvatar';
export { TherapistDirectoryCard } from './components/TherapistDirectoryCard';
export { DatePickerBar } from './components/DatePickerBar';
export { TherapistFilterToolbar } from './components/TherapistFilterToolbar';
export { useTherapists, useAvailableSlots, useDateAvailability } from './hooks/useTherapists';
export { useBookAppointment, useBookRecurringAppointment } from './hooks/useBookAppointment';
export { useSlotHold } from './hooks/useSlotHold';
export { appointmentsApi } from './api/appointmentsApi';
export { canTransitionStatus, getStatusBadgeConfig } from './utils/appointmentLifecycle';
export type { ExtendedAppointmentStatus } from './utils/appointmentLifecycle';
export * from './types/appointments.types';
export * from './types/hold.types';
export * from './types/recurring.types';
