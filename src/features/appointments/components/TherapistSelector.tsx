import React from 'react';
import { Star, Award, Check } from 'lucide-react';
import type { TherapistProfile } from '../types/appointments.types';
import { Card, CardContent } from '@/components/ui/Card';
import { cn } from '@/utils/cn';

interface TherapistSelectorProps {
  therapists?: TherapistProfile[];
  selectedTherapistId: string | null;
  onSelectTherapist: (therapist: TherapistProfile) => void;
  isLoading?: boolean;
}

export const TherapistSelector: React.FC<TherapistSelectorProps> = ({
  therapists,
  selectedTherapistId,
  onSelectTherapist,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse bg-slate-900/60 border-slate-800">
            <CardContent className="h-44" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
      {therapists?.map((therapist) => {
        const isSelected = selectedTherapistId === therapist.id;

        return (
          <Card
            key={therapist.id}
            onClick={() => onSelectTherapist(therapist)}
            className={cn(
              'cursor-pointer transition-all duration-200 bg-slate-900/90 relative overflow-hidden',
              isSelected
                ? 'border-indigo-500 ring-2 ring-indigo-500/30 shadow-indigo-500/10'
                : 'border-slate-800 hover:border-slate-700/80',
            )}
          >
            {isSelected && (
              <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-md">
                <Check className="w-3.5 h-3.5" />
              </div>
            )}

            <CardContent className="p-5 space-y-3">
              <div>
                <h4 className="text-base font-bold text-white pr-6">{therapist.name}</h4>
                <p className="text-xs font-medium text-indigo-400 mt-0.5">
                  {therapist.specialization}
                </p>
              </div>

              <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{therapist.bio}</p>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-xs text-slate-300">
                <span className="flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  {therapist.experienceYears} Years Exp.
                </span>

                <span className="flex items-center gap-1 font-semibold text-amber-300">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  {therapist.rating.toFixed(1)}
                </span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
