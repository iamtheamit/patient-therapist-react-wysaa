export type RecurrenceFrequency = 'SINGLE' | 'DAILY' | 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY';

export interface RecurringRule {
  frequency: RecurrenceFrequency;
  occurrencesCount: number;
}

export interface RecurringBookingPayload {
  patientId: string;
  therapistId: string;
  baseSlotId: string;
  startTime: string;
  endTime: string;
  recurrenceEndDate: string;
  recurringRule: RecurringRule;
  notes?: string;
}

export interface RecurringBookingResponse {
  seriesId: string;
  createdCount: number;
  appointments: Array<{
    id: string;
    startTime: string;
    endTime: string;
  }>;
}
