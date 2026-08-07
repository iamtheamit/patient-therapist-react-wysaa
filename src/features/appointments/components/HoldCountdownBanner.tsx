import React from 'react';
import { Clock, ShieldAlert, Lock, Sparkles } from 'lucide-react';
import { cn } from '@/utils/cn';

interface HoldCountdownBannerProps {
  secondsRemaining: number;
}

export const HoldCountdownBanner: React.FC<HoldCountdownBannerProps> = ({ secondsRemaining }) => {
  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const isUrgent = secondsRemaining < 90;
  const isCritical = secondsRemaining < 30;

  return (
    <div
      className={cn(
        'rounded-2xl p-4 sm:p-5 border transition-all shadow-sm relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-4 text-left',
        isCritical
          ? 'bg-rose-600 border-rose-700 text-white animate-pulse'
          : isUrgent
            ? 'bg-amber-600 border-amber-700 text-white'
            : 'bg-gradient-to-r from-[#003d9b] via-[#0052cc] to-[#0066ff] border-[#0052cc]/30 text-white',
      )}
    >
      {/* Ambient background glow */}
      <div className="absolute -top-10 -right-10 w-36 h-36 bg-white/10 rounded-full blur-xl pointer-events-none" />

      <div className="flex items-center gap-3.5 relative z-10">
        <div className="p-2.5 rounded-xl bg-white/15 text-white backdrop-blur-md flex items-center justify-center shrink-0 border border-white/20">
          {isCritical ? (
            <ShieldAlert className="w-5 h-5" />
          ) : isUrgent ? (
            <Clock className="w-5 h-5" />
          ) : (
            <Lock className="w-5 h-5 text-emerald-300" />
          )}
        </div>

        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <h4 className="font-heading font-bold text-xs sm:text-sm tracking-tight text-white flex items-center gap-1.5">
              <span>{isCritical ? 'Slot Hold Expiring Soon' : 'Guaranteed Slot Hold Active'}</span>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-white border border-white/30">
                <Sparkles className="w-2.5 h-2.5 text-emerald-300" /> Guaranteed
              </span>
            </h4>
          </div>
          <p className="text-xs text-blue-100/90">
            {isUrgent
              ? 'Your reserved slot will release shortly. Complete booking to confirm your therapist appointment.'
              : 'Your chosen time slot is temporarily locked exclusively for your account.'}
          </p>
        </div>
      </div>

      {/* Countdown Timer Digital Badge */}
      <div className="flex items-center gap-2 shrink-0 relative z-10 self-end sm:self-center">
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-bold text-blue-100/80 uppercase tracking-wider">
            Hold Expires In
          </span>
          <div className="flex items-center gap-1.5 font-mono text-base sm:text-lg font-bold bg-white/20 backdrop-blur-md text-white px-3.5 py-1.5 rounded-xl border border-white/30 shadow-inner">
            <Clock className="w-4 h-4 text-emerald-300" />
            <span>{formattedTime}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
