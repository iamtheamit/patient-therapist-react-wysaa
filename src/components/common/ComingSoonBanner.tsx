import React from 'react';
import { Sparkles } from 'lucide-react';

interface ComingSoonBannerProps {
  featureTitle: string;
  description: string;
  onViewSpecs?: () => void;
}

export const ComingSoonBanner: React.FC<ComingSoonBannerProps> = ({
  featureTitle,
  description,
  onViewSpecs,
}) => {
  return (
    <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border border-amber-200/80 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs text-left">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold shrink-0">
          <Sparkles className="w-5 h-5 text-amber-600" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-amber-900 flex items-center gap-2">
            {featureTitle} Feature Coming Soon
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-200/60 text-amber-800 font-bold uppercase tracking-wider">
              Preview Mode
            </span>
          </h3>
          <p className="text-xs text-amber-700/90 mt-0.5">{description}</p>
        </div>
      </div>
      {onViewSpecs && (
        <button
          type="button"
          onClick={onViewSpecs}
          className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold transition shadow-2xs shrink-0 cursor-pointer flex items-center gap-1.5"
        >
          <Sparkles className="w-4 h-4" />
          View Details
        </button>
      )}
    </div>
  );
};

export default ComingSoonBanner;
