import React, { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Clock } from 'lucide-react';
import type { DashboardAppointment } from '@/features/dashboard';
import { QUERY_KEYS } from '@/config/queryKeys';

interface ActiveHoldCardProps {
  hold: DashboardAppointment;
  onCheckout: (hold: DashboardAppointment) => void;
}

export const ActiveHoldCard: React.FC<ActiveHoldCardProps> = ({ hold, onCheckout }) => {
  const queryClient = useQueryClient();
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    const expires = hold.holdExpiresAt ? new Date(hold.holdExpiresAt).getTime() : Date.now();
    const update = () => {
      const remaining = Math.max(0, Math.floor((expires - Date.now()) / 1000));
      setTimeLeft(remaining);
      if (remaining <= 0) {
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD.ROOT });
        queryClient.invalidateQueries({ queryKey: ['appointments'] });
      }
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [hold.holdExpiresAt, queryClient]);

  if (timeLeft <= 0) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <div className="bg-amber-50/80 border border-amber-300/70 rounded-xl p-4 space-y-2 text-left shadow-2xs">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-1.5 text-amber-900 font-bold text-xs">
          <Clock className="w-3.5 h-3.5 text-amber-600" />
          <span>
            Today,{' '}
            {new Date(hold.startTime).toLocaleTimeString(undefined, {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>
        <span className="text-amber-800 text-[10px] font-bold bg-white px-2 py-0.5 rounded-full shadow-2xs border border-amber-300 animate-pulse">
          Expires in {formattedTime}
        </span>
      </div>
      <h4 className="font-heading font-bold text-sm text-[#191c1e]">
        {hold.therapist?.name || 'Therapist Session'}
      </h4>
      <p className="text-xs text-[#51606f] font-medium pb-2">
        {new Date(hold.startTime).toLocaleDateString(undefined, {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
        })}{' '}
        •{' '}
        {new Date(hold.startTime).toLocaleTimeString(undefined, {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </p>
      <button
        onClick={() => onCheckout(hold)}
        className="w-full text-center bg-white border border-amber-500 text-amber-900 hover:bg-amber-100/70 py-2 rounded-xl text-xs font-bold transition-colors shadow-2xs cursor-pointer"
      >
        Continue Booking
      </button>
    </div>
  );
};

export default ActiveHoldCard;
