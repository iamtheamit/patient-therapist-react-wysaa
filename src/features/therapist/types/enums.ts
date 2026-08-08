/**
 * Senior Developer Domain Enums & Const Mappings
 * Uses `as const` object pattern compatible with TypeScript `erasableSyntaxOnly`.
 * Ensures 100% compile-time type safety across UI dropdowns, backend validation, and DB persistence.
 */

export const AppointmentTypeEnum = {
  FOLLOW_UP: 'Follow Up Session',
  CONSULTATION_CBT: 'Consultation / CBT',
  INITIAL_INTAKE: 'Initial Intake Assessment',
  GENERAL_COUNSELING: 'General Counseling',
} as const;

export type AppointmentTypeEnum = (typeof AppointmentTypeEnum)[keyof typeof AppointmentTypeEnum];

export const RepeatTypeEnum = {
  NONE: 'None',
  DAILY: 'Daily',
  WEEKLY: 'Weekly',
  BI_WEEKLY: 'Bi-Weekly',
  MONTHLY: 'Monthly',
} as const;

export type RepeatTypeEnum = (typeof RepeatTypeEnum)[keyof typeof RepeatTypeEnum];

export const RepeatFrequencyEnum = {
  EVERY_1_WEEK: 'Every 1 week',
  EVERY_2_WEEKS: 'Every 2 weeks',
  EVERY_3_WEEKS: 'Every 3 weeks',
  EVERY_4_WEEKS: 'Every 4 weeks',
} as const;

export type RepeatFrequencyEnum = (typeof RepeatFrequencyEnum)[keyof typeof RepeatFrequencyEnum];

export const APPOINTMENT_TYPE_OPTIONS = [
  { value: AppointmentTypeEnum.FOLLOW_UP, label: 'Follow Up Session (50 min)' },
  { value: AppointmentTypeEnum.CONSULTATION_CBT, label: 'Consultation / CBT (50 min)' },
  { value: AppointmentTypeEnum.INITIAL_INTAKE, label: 'Initial Intake Assessment (60 min)' },
  { value: AppointmentTypeEnum.GENERAL_COUNSELING, label: 'General Counseling (50 min)' },
];

export const REPEAT_TYPE_OPTIONS = [
  { value: RepeatTypeEnum.DAILY, label: 'Daily' },
  { value: RepeatTypeEnum.WEEKLY, label: 'Weekly' },
  { value: RepeatTypeEnum.BI_WEEKLY, label: 'Bi-Weekly' },
  { value: RepeatTypeEnum.MONTHLY, label: 'Monthly' },
];

export const REPEAT_FREQUENCY_OPTIONS = [
  { value: RepeatFrequencyEnum.EVERY_1_WEEK, label: 'Every 1 week' },
  { value: RepeatFrequencyEnum.EVERY_2_WEEKS, label: 'Every 2 weeks' },
  { value: RepeatFrequencyEnum.EVERY_3_WEEKS, label: 'Every 3 weeks' },
  { value: RepeatFrequencyEnum.EVERY_4_WEEKS, label: 'Every 4 weeks' },
];
