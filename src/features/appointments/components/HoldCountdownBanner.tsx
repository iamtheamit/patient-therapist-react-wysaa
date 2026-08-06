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
    ? 'bg-rose-500/10 border-rose-500/40 text-rose-300 animate-pulse'
    : isUrgent
      ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
      : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300';

  return (
    <div
      className={cn(
        'p-3.5 rounded-xl border flex items-center justify-between transition-colors shadow-lg text-xs font-semibold',
        bannerStyles,
      )}
    >
      <div className="flex items-center space-x-2">
        {isUrgent ? <ShieldAlert className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
        <span>
          {isUrgent
            ? 'Hold expiring soon! Complete checkout to secure this slot.'
            : 'Temporary Slot Hold Active — Complete details before timer expires.'}
        </span>
      </div>

      <div className="flex items-center space-x-1.5 font-mono text-sm font-bold bg-slate-950/60 px-3 py-1 rounded-lg border border-slate-800">
        <span>{formattedTime}</span>
      </div>
    </div>
  );
};
