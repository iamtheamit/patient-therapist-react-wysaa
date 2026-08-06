export type RecurrenceFrequency = 'SINGLE' | 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY';

export interface RecurringRule {
  frequency: RecurrenceFrequency;
  occurrencesCount: number;
}

export interface RecurringBookingPayload {
  patientId: string;
  therapistId: string;
  baseSlotId: string;
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
