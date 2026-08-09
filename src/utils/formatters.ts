/**
 * Shared formatting and classification utilities
 */

export const getInitials = (name: string): string => {
  return name
    .replace('Dr. ', '')
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();
};

export const classifyBookingError = (error: unknown): 'conflict' | 'expired' | 'unknown' => {
  const err = error as Record<string, unknown>;
  const msg = typeof err?.message === 'string' ? err.message : '';
  const isConflict =
    err?.status === 409 || err?.errorCode === 'CONFLICT' || msg.toLowerCase().includes('conflict');
  const isExpired =
    msg.toLowerCase().includes('hold expired') || msg.toLowerCase().includes('expired');

  if (isConflict) return 'conflict';
  if (isExpired) return 'expired';
  return 'unknown';
};

export const formatTimeRange = (startStr: string, endStr: string): string => {
  try {
    const start = new Date(startStr);
    const end = new Date(endStr);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return '';
    }
    return `${start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} – ${end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  } catch {
    return '';
  }
};

export const getRelativeTimeBadge = (startStr: string, currentMs: number): string => {
  try {
    const start = new Date(startStr);
    if (isNaN(start.getTime())) {
      return 'UPCOMING';
    }
    const diffMs = start.getTime() - currentMs;
    const diffMin = Math.round(diffMs / 60000);
    if (diffMin <= 0) return 'STARTED';
    if (diffMin < 60) return `IN ${diffMin} MINUTES`;
    const diffHrs = Math.round(diffMin / 60);
    if (diffHrs < 24) return `IN ${diffHrs} HOURS`;
    return 'UPCOMING';
  } catch {
    return 'UPCOMING';
  }
};

export const formatDateStr = (startStr: string): string => {
  try {
    const start = new Date(startStr);
    if (isNaN(start.getTime())) {
      return '';
    }
    return start.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return '';
  }
};
