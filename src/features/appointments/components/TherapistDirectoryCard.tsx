import React from 'react';
import { Star } from 'lucide-react';
import type { TherapistProfile } from '../types/appointments.types';
import { TherapistAvatar } from './TherapistAvatar';
import { Button } from '@/components/ui/Button';

interface TherapistDirectoryCardProps {
  therapist: TherapistProfile;
  onViewProfile: (therapist: TherapistProfile) => void;
  onBookSession: (therapist: TherapistProfile) => void;
}

export const TherapistDirectoryCard: React.FC<TherapistDirectoryCardProps> = ({
  therapist,
  onViewProfile,
  onBookSession,
}) => {
  const isTopRated = (therapist.rating || 0) >= 4.8;

  return (
    <div className="bg-white rounded-xl border border-outline-variant/50 hover:border-primary/30 transition-colors duration-200 text-left group">
      {/* Main content row */}
      <div className="p-5 flex gap-4">
        {/* Avatar column */}
        <div className="relative shrink-0 pt-0.5">
          <TherapistAvatar url={therapist.avatarUrl} name={therapist.name} size="w-12 h-12" />
        </div>

        {/* Info column */}
        <div className="flex-1 min-w-0 space-y-2">
          {/* Name + credentials row */}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="font-heading font-semibold text-sm text-on-surface leading-tight truncate">
                {therapist.name}
              </h3>
              <p className="text-xs text-primary font-medium mt-0.5 truncate">
                {therapist.specialization}
              </p>
            </div>
            {isTopRated && (
              <span className="shrink-0 text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200/70 px-2 py-0.5 rounded-md flex items-center gap-1">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                Top Rated
              </span>
            )}
          </div>

          {/* Meta row — clean inline text, not pill badges */}
          <div className="flex items-center gap-3 text-xs text-secondary">
            <span className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="font-semibold text-on-surface">{therapist.rating}</span>
            </span>
            <span className="w-px h-3 bg-outline-variant/60" />
            <span>{therapist.experienceYears || 5}+ yrs experience</span>
            <span className="w-px h-3 bg-outline-variant/60" />
            <span>50 min session</span>
          </div>

          {/* Bio — plain text, no fake quote styling */}
          <p className="text-xs text-secondary leading-relaxed line-clamp-2">
            {therapist.bio ||
              'Specialized clinical psychologist focused on evidence-based cognitive and behavioral therapies.'}
          </p>
        </div>
      </div>

      {/* Footer — pricing + actions */}
      <div className="px-5 py-3 border-t border-outline-variant/30 flex items-center justify-between gap-4">
        {/* Left: price */}
        <div className="flex items-center gap-4 text-xs text-secondary font-medium">
          <span>
            Session Fee: <span className="font-semibold text-on-surface">$150</span> / visit
          </span>
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="ghost" size="sm" onClick={() => onViewProfile(therapist)}>
            View Profile
          </Button>

          <Button variant="primary" size="sm" onClick={() => onBookSession(therapist)}>
            Book Session
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TherapistDirectoryCard;
