import React from 'react';
import { Loader2, HeartHandshake } from 'lucide-react';
import { cn } from '@/utils/cn';

interface PageSpinnerProps {
  label?: string;
  className?: string;
}

export const PageSpinner: React.FC<PageSpinnerProps> = ({ label = 'Loading...', className }) => {
  return (
    <div
      className={cn(
        'min-h-screen w-full flex flex-col items-center justify-center p-6 text-center space-y-4 bg-[#f8f9fb]',
        className,
      )}
    >
      <div className="relative flex items-center justify-center w-16 h-16">
        <div className="w-11 h-11 rounded-full bg-[#d6e3ff]/60 flex items-center justify-center text-[#005eb8]">
          <HeartHandshake className="w-5 h-5 animate-pulse" />
        </div>
        <Loader2 className="w-16 h-16 text-[#005eb8] animate-spin absolute inset-0 m-auto pointer-events-none" />
      </div>

      <p className="text-xs font-semibold text-[#505f76] tracking-wide uppercase">{label}</p>
    </div>
  );
};
