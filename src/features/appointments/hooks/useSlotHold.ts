import { useState, useEffect, useCallback, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { appointmentsApi } from '../api/appointmentsApi';
import type { SlotHoldSession } from '../types/hold.types';
import type { AvailableSlot } from '../types/appointments.types';
import { useUIStore } from '@/stores/uiStore';
import type { UIState } from '@/stores/uiStore';
import { env } from '@/config/env';

export const useSlotHold = () => {
  const queryClient = useQueryClient();
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
    queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    queryClient.invalidateQueries({ queryKey: ['appointments'] });
  }, [holdSession, clearTimer, queryClient]);

  const startHold = async (slot: AvailableSlot, therapistId: string) => {
    try {
      setIsHolding(true);
      const session = await appointmentsApi.holdSlot(
        slot.id,
        therapistId,
        slot.startTime,
        slot.endTime,
      );
      setHoldSession(session);

      const initialRemaining = Math.max(0, Math.floor((session.expiresAt - Date.now()) / 1000));
      setSecondsRemaining(initialRemaining);

      clearTimer();
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['appointments'] });

      timerRef.current = setInterval(() => {
        const remaining = Math.max(0, Math.floor((session.expiresAt - Date.now()) / 1000));
        setSecondsRemaining(remaining);

        if (remaining <= 0) {
          clearTimer();
          setHoldSession(null);
          setIsHolding(false);
          queryClient.invalidateQueries({ queryKey: ['dashboard'] });
          queryClient.invalidateQueries({ queryKey: ['appointments'] });
          const holdMinutes = Math.floor(env.VITE_SLOT_HOLD_DURATION_SECONDS / 60);
          addToast({
            type: 'warning',
            title: 'Slot Reservation Expired',
            message: `Your ${holdMinutes}-minute slot hold has expired. Please choose a slot again.`,
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
