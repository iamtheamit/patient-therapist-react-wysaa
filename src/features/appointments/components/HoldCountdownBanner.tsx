import React from 'react';
import { Clock, ShieldAlert } from 'lucide-react';
import { cn } from '@/utils/cn';

interface HoldCountdownBannerProps {
  secondsRemaining: number;
}

export const HoldCountdownBanner: React.FC<HoldCountdownBannerProps> = ({ secondsRemaining }) => {
  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const isUrgent = secondsRemaining < 60;
  const isCritical = secondsRemaining < 15;

  const bannerStyles = isCritical
    ? 'bg-rose-50 border-rose-300 text-rose-900 animate-pulse'
    : isUrgent
      ? 'bg-amber-100 border-amber-300 text-amber-950'
      : 'bg-[#fef3c7] border-amber-200/80 text-amber-900';

  return (
    <div
      className={cn(
        'p-3.5 rounded-lg border flex items-center justify-between transition-colors shadow-sm text-xs font-semibold',
        bannerStyles,
      )}
    >
      <div className="flex items-center space-x-2">
        {isUrgent ? (
          <ShieldAlert className="w-4 h-4 text-amber-600" />
        ) : (
          <Clock className="w-4 h-4 text-amber-700" />
        )}
        <span>
          {isUrgent
            ? 'Hold expiring soon! Complete booking to secure this slot.'
            : 'Temporary Slot Hold Active — Complete details before timer expires.'}
        </span>
      </div>

      <div className="flex items-center space-x-1.5 font-mono text-sm font-bold bg-white text-amber-950 px-3 py-1 rounded-md border border-amber-200 shadow-sm">
        <span>{formattedTime}</span>
      </div>
    </div>
  );
};
