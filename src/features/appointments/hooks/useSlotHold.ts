import { useState, useEffect, useCallback, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { appointmentsApi } from '../api/appointmentsApi';
import type { SlotHoldSession } from '../types/hold.types';
import type { AvailableSlot } from '../types/appointments.types';
import { useUIStore } from '@/stores/uiStore';
import type { UIState } from '@/stores/uiStore';
import { env } from '@/config/env';
import { QUERY_KEYS } from '@/config/queryKeys';

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
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD.ROOT });
    queryClient.invalidateQueries({ queryKey: ['appointments'] });
  }, [holdSession, clearTimer, queryClient]);

  const startHold = useCallback(
    async (slot: AvailableSlot, therapistId: string): Promise<boolean> => {
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
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD.ROOT });
        queryClient.invalidateQueries({ queryKey: ['appointments'] });

        timerRef.current = setInterval(() => {
          const remaining = Math.max(0, Math.floor((session.expiresAt - Date.now()) / 1000));
          setSecondsRemaining(remaining);

          if (remaining <= 0) {
            clearTimer();
            setHoldSession(null);
            setIsHolding(false);
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD.ROOT });
            queryClient.invalidateQueries({ queryKey: ['appointments'] });
            const holdMinutes = Math.floor(env.VITE_SLOT_HOLD_DURATION_SECONDS / 60);
            addToast({
              type: 'warning',
              title: 'Slot Reservation Expired',
              message: `Your ${holdMinutes}-minute hold on this slot has expired. Please select a time slot again to continue.`,
            });
          }
        }, 1000);

        return true;
      } catch (err: unknown) {
        setIsHolding(false);
        // Determine if this is a known conflict (slot taken) or an unknown error
        const e = err as Record<string, unknown>;
        const msg = typeof e?.message === 'string' ? e.message : '';
        const isConflict =
          e?.status === 409 ||
          e?.errorCode === 'CONFLICT' ||
          msg.toLowerCase().includes('conflict');

        addToast({
          type: 'error',
          title: isConflict ? 'Slot No Longer Available' : 'Unable to Reserve Slot',
          message: isConflict
            ? 'This time slot was just booked by another patient. Please choose a different time.'
            : 'We could not reserve this slot right now. Please try again or choose a different time.',
        });
        return false;
      }
    },
    [clearTimer, queryClient, addToast],
  );

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
