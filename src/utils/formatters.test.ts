import { describe, it, expect } from 'vitest';
import {
  getInitials,
  classifyBookingError,
  formatTimeRange,
  getRelativeTimeBadge,
  formatDateStr,
} from './formatters';

describe('formatters', () => {
  describe('getInitials', () => {
    it('returns first letters of first and last names', () => {
      expect(getInitials('John Doe')).toBe('JD');
    });

    it('removes Dr. prefix', () => {
      expect(getInitials('Dr. John Doe')).toBe('JD');
      expect(getInitials('Dr. Jane Smith')).toBe('JS');
    });

    it('works with single names', () => {
      expect(getInitials('Alex')).toBe('A');
    });
  });

  describe('classifyBookingError', () => {
    it('detects conflicts', () => {
      expect(classifyBookingError({ status: 409 })).toBe('conflict');
      expect(classifyBookingError({ errorCode: 'CONFLICT' })).toBe('conflict');
      expect(classifyBookingError({ message: 'slot conflict' })).toBe('conflict');
    });

    it('detects expiration', () => {
      expect(classifyBookingError({ message: 'hold expired' })).toBe('expired');
      expect(classifyBookingError({ message: 'Your hold has expired.' })).toBe('expired');
    });

    it('defaults to unknown', () => {
      expect(classifyBookingError(new Error('some random error'))).toBe('unknown');
    });
  });

  describe('formatTimeRange', () => {
    it('formats valid Date strings to time ranges', () => {
      const start = '2026-08-09T09:00:00.000Z';
      const end = '2026-08-09T10:00:00.000Z';
      // Checking formatting - note local timezone differences in toLocaleTimeString are bypassed in standard tests
      const result = formatTimeRange(start, end);
      expect(result).toContain(' – ');
    });

    it('handles bad dates gracefully', () => {
      expect(formatTimeRange('invalid', 'invalid')).toBe('');
    });
  });

  describe('getRelativeTimeBadge', () => {
    it('returns STARTED if starting in the past or now', () => {
      const start = new Date(Date.now() - 5000).toISOString();
      expect(getRelativeTimeBadge(start, Date.now())).toBe('STARTED');
    });

    it('returns MINUTES relative time if starting soon', () => {
      const start = new Date(Date.now() + 15 * 60000).toISOString();
      expect(getRelativeTimeBadge(start, Date.now())).toBe('IN 15 MINUTES');
    });

    it('returns HOURS relative time if starting in few hours', () => {
      const start = new Date(Date.now() + 3 * 3600000).toISOString();
      expect(getRelativeTimeBadge(start, Date.now())).toBe('IN 3 HOURS');
    });

    it('returns UPCOMING for far future dates', () => {
      const start = new Date(Date.now() + 48 * 3600000).toISOString();
      expect(getRelativeTimeBadge(start, Date.now())).toBe('UPCOMING');
    });
  });

  describe('formatDateStr', () => {
    it('formats a date string', () => {
      const start = '2026-08-09T09:00:00.000Z';
      expect(formatDateStr(start)).toContain('2026');
    });

    it('handles bad dates gracefully', () => {
      expect(formatDateStr('invalid')).toBe('');
    });
  });
});
