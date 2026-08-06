/**
 * Therapist Feature Domain Boundary
 * Public entrypoint exporting components, custom hooks, types, and API functions.
 */

export { TherapistStatsGrid } from './components/TherapistStatsGrid';
export { AgendaList } from './components/AgendaList';
export { ClinicalNotesModal } from './components/ClinicalNotesModal';
export { WeeklyScheduleForm } from './components/WeeklyScheduleForm';
export { WeeklyAvailabilityCalendar } from './components/WeeklyAvailabilityCalendar';
export { useTherapistAgenda, useTherapistStats } from './hooks/useTherapistAgenda';
export {
  useUpdateAppointmentStatus,
  useUpdateClinicalNotes,
} from './hooks/useUpdateAppointmentStatus';
export { useTherapistScheduleConfig, useUpdateScheduleConfig } from './hooks/useTherapistSchedule';
export { therapistApi } from './api/therapistApi';
export * from './types/therapist.types';
