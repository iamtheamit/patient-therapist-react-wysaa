import React from 'react';
import { Loader2, HeartHandshake } from 'lucide-react';

interface PageSpinnerProps {
  label?: string;
}

export const PageSpinner: React.FC<PageSpinnerProps> = ({ label = 'Loading session...' }) => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
      <div className="relative flex items-center justify-center">
        <div className="w-16 h-16 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
          <HeartHandshake className="w-8 h-8 animate-bounce" />
        </div>
        <Loader2 className="w-20 h-20 text-indigo-500 animate-spin absolute" />
      </div>

      <p className="text-xs font-semibold text-slate-400 tracking-wide uppercase">{label}</p>
    </div>
  );
};
