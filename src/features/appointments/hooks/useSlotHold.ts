import { useState, useEffect, useCallback, useRef } from 'react';
import { appointmentsApi } from '../api/appointmentsApi';
import type { SlotHoldSession } from '../types/hold.types';
import { useUIStore } from '@/stores/uiStore';
import type { UIState } from '@/stores/uiStore';

export const useSlotHold = () => {
  const [holdSession, setHoldSession] = useState<SlotHoldSession | null>(null);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(0);
  const [isHolding, setIsHolding] = useState<boolean>(false);

  const addToast = useUIStore((state: UIState) => state.addToast);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const releaseHold = useCallback(async () => {
    if (holdSession) {
      try {
        await appointmentsApi.releaseSlot(holdSession.holdId);
      } catch {
        // Silent catch on release cleanup
      }
    }
    clearTimer();
    setHoldSession(null);
    setSecondsRemaining(0);
    setIsHolding(false);
  }, [holdSession, clearTimer]);

  const startHold = async (slotId: string, therapistId: string) => {
    try {
      setIsHolding(true);
      const session = await appointmentsApi.holdSlot(slotId, therapistId);
      setHoldSession(session);

      const initialRemaining = Math.max(0, Math.floor((session.expiresAt - Date.now()) / 1000));
      setSecondsRemaining(initialRemaining);

      clearTimer();

      timerRef.current = setInterval(() => {
        const remaining = Math.max(0, Math.floor((session.expiresAt - Date.now()) / 1000));
        setSecondsRemaining(remaining);

        if (remaining <= 0) {
          clearTimer();
          setHoldSession(null);
          setIsHolding(false);
          addToast({
            type: 'warning',
            title: 'Slot Reservation Expired',
            message: 'Your 5-minute slot hold has expired. Please choose a slot again.',
          });
        }
      }, 1000);
    } catch {
      setIsHolding(false);
      addToast({
        type: 'error',
        title: 'Slot Hold Failed',
        message: 'Could not hold this time slot. Someone else may have reserved it.',
      });
    }
  };

  useEffect(() => {
    return () => {
      clearTimer();
    };
  }, [clearTimer]);

  return {
    holdSession,
    secondsRemaining,
    isHolding,
    startHold,
    releaseHold,
  };
};
