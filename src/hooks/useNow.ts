import { useState, useEffect } from 'react';

/**
 * Custom hook providing a real-time Date object aligned to minute boundaries.
 * Ensures the calendar time indicator updates precisely on minute turns
 * without unnecessary re-renders.
 */
export const useNow = (updateIntervalMs = 60000): Date => {
  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const current = new Date();
    const delayToNextMinute = 60000 - (current.getSeconds() * 1000 + current.getMilliseconds());

    const update = () => {
      setNow(new Date());
    };

    // Align timer to exact top-of-minute boundary
    const timeoutId = setTimeout(() => {
      update();
      intervalId = setInterval(update, updateIntervalMs);
    }, delayToNextMinute);

    return () => {
      clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, [updateIntervalMs]);

  return now;
};
