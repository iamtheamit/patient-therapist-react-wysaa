import { describe, it, expect } from 'vitest';
import { canTransitionStatus, getStatusBadgeConfig } from './appointmentLifecycle';

describe('appointmentLifecycle state machine', () => {
  it('allows valid state transitions from HELD to CONFIRMED or CANCELLED', () => {
    expect(canTransitionStatus('HELD', 'CONFIRMED')).toBe(true);
    expect(canTransitionStatus('HELD', 'CANCELLED')).toBe(true);
    expect(canTransitionStatus('HELD', 'COMPLETED')).toBe(false);
  });

  it('allows valid transitions from CONFIRMED to COMPLETED or CANCELLED', () => {
    expect(canTransitionStatus('CONFIRMED', 'COMPLETED')).toBe(true);
    expect(canTransitionStatus('CONFIRMED', 'CANCELLED')).toBe(true);
    expect(canTransitionStatus('CONFIRMED', 'HELD')).toBe(false);
  });

  it('rejects transitions from terminal state COMPLETED', () => {
    expect(canTransitionStatus('COMPLETED', 'CONFIRMED')).toBe(false);
    expect(canTransitionStatus('COMPLETED', 'CANCELLED')).toBe(false);
  });

  it('returns correct badge configuration for status values', () => {
    expect(getStatusBadgeConfig('CONFIRMED')).toEqual({
      variant: 'success',
      label: 'Confirmed',
    });
    expect(getStatusBadgeConfig('CANCELLED')).toEqual({
      variant: 'error',
      label: 'Cancelled',
    });
  });
});
