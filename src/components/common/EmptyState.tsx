import React from 'react';
import { Button } from '@/components/ui/Button';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  imageSize?: string;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No Records Found',
  description = 'There are no items matching your search or filter criteria at this moment.',
  actionLabel,
  onAction,
  imageSize = 'max-w-[200px]',
  className = '',
}) => {
  return (
    <div
      className={`p-8 sm:p-12 text-center bg-white rounded-2xl border border-[#c3c6d6]/40 shadow-xs flex flex-col items-center justify-center space-y-4 ${className}`}
    >
      <div className="relative">
        <img
          src="/assets/no-records-found.png"
          alt="No Records Found"
          className={`${imageSize} h-auto object-contain mx-auto transition-transform hover:scale-105 duration-300 drop-shadow-sm select-none`}
        />
      </div>

      <div className="space-y-1.5 max-w-md">
        <h3 className="font-heading font-bold text-base sm:text-lg text-[#191c1e]">{title}</h3>
        <p className="text-xs text-[#51606f] leading-relaxed">{description}</p>
      </div>

      {actionLabel && onAction && (
        <div className="pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onAction}
            className="text-xs font-semibold text-[#0052cc] border-[#0052cc]/30 hover:bg-[#e5eeff]"
          >
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
};

export default EmptyState;
