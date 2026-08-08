import type { DayScheduleRule } from '../types/therapist.types';

export interface CalendarBlockItem {
  id: string;
  date: string; // "YYYY-MM-DD"
  startTime: string; // "HH:mm"
  endTime: string; // "HH:mm"
  type: 'available' | 'booked';
  status?: string;
  isRecurring?: boolean;
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

const DAY_INDEX_MAP: Record<number, string> = {
  0: 'Sunday',
  1: 'Monday',
  2: 'Tuesday',
  3: 'Wednesday',
  4: 'Thursday',
  5: 'Friday',
  6: 'Saturday',
};

/**
 * Parses a date ISO string ("YYYY-MM-DD") and time string ("HH:mm") into a JS Date object.
 */
export const parseDateTime = (dateIso: string, timeStr: string): Date => {
  const [year, month, day] = dateIso.split('-').map(Number);
  const [hours, minutes] = timeStr.split(':').map(Number);
  return new Date(year, month - 1, day, hours || 0, minutes || 0, 0, 0);
};

/**
 * Converts a time string "HH:mm" to minutes from midnight.
 */
export const timeToMinutes = (timeStr: string): number => {
  const [h, m] = timeStr.split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
};

/**
 * Validates whether a requested start time or block is in the past.
 */
export const validatePastTimeSlot = (
  dateIso: string,
  startTimeStr: string,
  now: Date = new Date(),
): ValidationResult => {
  const slotStart = parseDateTime(dateIso, startTimeStr);
  if (slotStart < now) {
    return {
      isValid: false,
      error: 'Cannot schedule or modify availability in the past.',
    };
  }
  return { isValid: true };
};

/**
 * Validates time range: start must be before end, and minimum duration must be met.
 */
export const validateTimeRange = (
  startTimeStr: string,
  endTimeStr: string,
  minDurationMinutes = 15,
): ValidationResult => {
  const startMin = timeToMinutes(startTimeStr);
  const endMin = timeToMinutes(endTimeStr);

  if (endMin <= startMin) {
    return {
      isValid: false,
      error: 'End time must be after start time.',
    };
  }

  if (endMin - startMin < minDurationMinutes) {
    return {
      isValid: false,
      error: `Slot duration must be at least ${minDurationMinutes} minutes.`,
    };
  }

  return { isValid: true };
};

/**
 * Checks if a proposed block overlaps with any existing blocks on the same day.
 */
export const validateSlotOverlap = (
  proposed: { date: string; startTime: string; endTime: string; id?: string },
  existingBlocks: CalendarBlockItem[],
): ValidationResult => {
  const proposedStart = timeToMinutes(proposed.startTime);
  const proposedEnd = timeToMinutes(proposed.endTime);

  const proposedDateObj = new Date(proposed.date);
  const proposedDayOfWeek = proposedDateObj.getDay();

  for (const block of existingBlocks) {
    // Skip checking self when editing an existing block
    if (proposed.id && block.id === proposed.id) continue;

    // Check date match OR recurring day-of-week match
    const blockDateObj = new Date(block.date);
    const isSameDate = block.date === proposed.date;
    const isRecurringMatch = block.isRecurring && blockDateObj.getDay() === proposedDayOfWeek;

    if (isSameDate || isRecurringMatch) {
      const blockStart = timeToMinutes(block.startTime);
      const blockEnd = timeToMinutes(block.endTime);

      // Overlap formula: startA < endB && endA > startB
      if (proposedStart < blockEnd && proposedEnd > blockStart) {
        const typeLabel =
          block.type === 'booked' ? 'booked appointment' : 'existing availability slot';
        return {
          isValid: false,
          error: `Time slot overlaps with an ${typeLabel} (${block.startTime} - ${block.endTime}).`,
        };
      }
    }
  }

  return { isValid: true };
};

/**
 * Validates that an availability slot falls within the therapist's configured working shift window for that day.
 */
export const validateShiftWindowBounds = (
  dateIso: string,
  startTimeStr: string,
  endTimeStr: string,
  weeklyRules?: DayScheduleRule[],
): ValidationResult => {
  if (!weeklyRules || weeklyRules.length === 0) {
    return { isValid: true }; // Skip if rules are not loaded
  }

  const dateObj = new Date(dateIso);
  const dayName = DAY_INDEX_MAP[dateObj.getDay()];
  const rule = weeklyRules.find((r) => r.day === dayName);

  if (!rule || !rule.isEnabled) {
    return {
      isValid: false,
      error: `Shifts are not enabled for ${dayName}s. Please update your Shift Rules to add availability on this day.`,
    };
  }

  const slotStart = timeToMinutes(startTimeStr);
  const slotEnd = timeToMinutes(endTimeStr);
  const ruleStart = timeToMinutes(rule.startTime);
  const ruleEnd = timeToMinutes(rule.endTime);

  if (slotStart < ruleStart || slotEnd > ruleEnd) {
    return {
      isValid: false,
      error: `Slot (${startTimeStr} - ${endTimeStr}) falls outside your defined shift window for ${dayName} (${rule.startTime} - ${rule.endTime}).`,
    };
  }

  // Check break time if configured
  if (rule.breakStartTime && rule.breakEndTime) {
    const breakStart = timeToMinutes(rule.breakStartTime);
    const breakEnd = timeToMinutes(rule.breakEndTime);

    if (slotStart < breakEnd && slotEnd > breakStart) {
      return {
        isValid: false,
        error: `Slot conflicts with your scheduled break time (${rule.breakStartTime} - ${rule.breakEndTime}).`,
      };
    }
  }

  return { isValid: true };
};
