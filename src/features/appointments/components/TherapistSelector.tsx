import React from 'react';
import { Star, Award, Check } from 'lucide-react';
import type { TherapistProfile } from '../types/appointments.types';
import { Card, CardContent } from '@/components/ui/Card';
import { cn } from '@/utils/cn';
import { useTherapistStatusStore } from '@/stores/therapistStatusStore';

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
  const isSarahOnline = useTherapistStatusStore((state) => state.isOnline);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse bg-slate-100 border-slate-200">
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
        // Check if therapist is online (Dr. Sarah Connor / therapist-1 tracks the main toggle)
        const isOnline = therapist.id === 'therapist-1' ? isSarahOnline : true;

        return (
          <Card
            key={therapist.id}
            onClick={() => onSelectTherapist(therapist)}
            className={cn(
              'cursor-pointer transition-all duration-200 bg-white relative overflow-hidden',
              isSelected
                ? 'border-[#005eb8] ring-2 ring-[#005eb8]/20 shadow-md'
                : 'border-slate-200 hover:border-slate-300',
              !isOnline && 'bg-slate-50/80 border-slate-300',
            )}
          >
            {isSelected && (
              <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-[#005eb8] flex items-center justify-center text-white text-xs font-bold shadow-sm z-10">
                <Check className="w-3.5 h-3.5" />
              </div>
            )}

            <CardContent className="p-5 space-y-3">
              <div>
                <div className="flex items-center justify-between gap-2 pr-6">
                  <h4 className="text-base font-heading font-bold text-[#191c1e]">
                    {therapist.name}
                  </h4>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0 ${
                      isOnline
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200/80'
                        : 'bg-amber-100 text-amber-800 border border-amber-200/80'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                      }`}
                    />
                    {isOnline ? 'Online' : 'Offline'}
                  </span>
                </div>
                <p className="text-xs font-semibold text-[#005eb8] mt-0.5">
                  {therapist.specialization}
                </p>
              </div>

              <p className="text-xs text-[#505f76] line-clamp-2 leading-relaxed">{therapist.bio}</p>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-[#505f76]">
                <span className="flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-amber-500" />
                  {therapist.experienceYears} Years Exp.
                </span>

                <span className="flex items-center gap-1 font-semibold text-amber-600">
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
