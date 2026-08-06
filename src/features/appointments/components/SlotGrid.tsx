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
            className="h-16 bg-slate-100 animate-pulse rounded-lg border border-slate-200"
          />
        ))}
      </div>
    );
  }

  if (!slots || slots.length === 0) {
    return (
      <div className="p-6 text-center bg-slate-50 border border-slate-200 rounded-lg">
        <p className="text-xs text-[#505f76]">No time slots available for this selected date.</p>
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
              'p-3.5 rounded-lg border font-semibold text-xs transition-all flex flex-col items-center justify-center space-y-1 relative select-none',
              isDisabled
                ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed line-through opacity-60'
                : isSelected
                  ? 'bg-[#005eb8] text-white border-[#005eb8] shadow-md shadow-[#005eb8]/20 ring-2 ring-[#005eb8]/30'
                  : 'bg-white text-[#005237] border-[#10b981] hover:bg-[#ecfdf5] hover:border-[#005237]',
            )}
          >
            <Clock className="w-3.5 h-3.5 opacity-80" />
            <span>{formattedTime}</span>

            {isSelected && (
              <span className="absolute top-1 right-1 text-white">
                <Check className="w-3.5 h-3.5" />
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
