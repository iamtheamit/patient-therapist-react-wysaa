import React from 'react';
import { Clock, Check } from 'lucide-react';
import type { AvailableSlot } from '../types/appointments.types';
import { cn } from '@/utils/cn';

interface SlotGridProps {
  slots?: AvailableSlot[];
  selectedSlotId: string | null;
  onSelectSlot: (slot: AvailableSlot) => void;
  isLoading?: boolean;
}

export const SlotGrid: React.FC<SlotGridProps> = ({
  slots,
  selectedSlotId,
  onSelectSlot,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="h-16 bg-slate-900/60 animate-pulse rounded-xl border border-slate-800"
          />
        ))}
      </div>
    );
  }

  if (!slots || slots.length === 0) {
    return (
      <div className="p-6 text-center bg-slate-900/50 border border-slate-800 rounded-xl">
        <p className="text-xs text-slate-400">No time slots available for this selected date.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
      {slots.map((slot) => {
        const isSelected = selectedSlotId === slot.id;
        const isDisabled = !slot.isAvailable;

        const startDate = new Date(slot.startTime);
        const formattedTime = startDate.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        });

        return (
          <button
            key={slot.id}
            type="button"
            disabled={isDisabled}
            onClick={() => onSelectSlot(slot)}
            className={cn(
              'p-3.5 rounded-xl border font-semibold text-xs transition-all flex flex-col items-center justify-center space-y-1 relative select-none',
              isDisabled
                ? 'bg-slate-950/40 text-slate-600 border-slate-900 cursor-not-allowed line-through'
                : isSelected
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-600/25 ring-2 ring-indigo-500/30'
                  : 'bg-slate-900 text-slate-200 border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800/80',
            )}
          >
            <Clock className="w-3.5 h-3.5 opacity-70" />
            <span>{formattedTime}</span>

            {isSelected && (
              <span className="absolute top-1 right-1 text-white">
                <Check className="w-3 h-3" />
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
