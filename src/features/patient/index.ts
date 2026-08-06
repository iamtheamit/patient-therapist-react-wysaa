/**
 * Patient Feature Domain Boundary
 * Public entrypoint exporting components, custom hooks, types, and API functions.
 */

export { PatientStatsGrid } from './components/PatientStatsGrid';
export { UpcomingSessionHero } from './components/UpcomingSessionHero';
export { AppointmentCard } from './components/AppointmentCard';
export { usePatientAppointments, usePatientStats } from './hooks/usePatientAppointments';
export { useCancelAppointment } from './hooks/useCancelAppointment';
export { patientApi } from './api/patientApi';
export * from './types/patient.types';
