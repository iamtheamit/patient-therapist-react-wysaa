import React, { useState, useMemo } from 'react';
import { Search, Filter, Calendar, Clock, ChevronRight, UserCheck } from 'lucide-react';
import { useTherapists, type TherapistProfile } from '@/features/appointments';
import { Button } from '@/components/ui/Button';
import { useTherapistStatusStore } from '@/stores/therapistStatusStore';
import { EmptyState } from '@/components/common/EmptyState';

interface QuickTherapistSearchProps {
  onSelectTherapist: (therapist: TherapistProfile) => void;
}

const SPECIALTY_OPTIONS = [
  'All Specialties',
  'Cognitive Behavioral Therapy (CBT)',
  'Mindfulness & Depression Care',
  'Trauma & PTSD Recovery',
  'Anxiety & Stress Management',
];

const QuickTherapistAvatar: React.FC<{ url?: string; name: string }> = ({ url, name }) => {
  const [hasError, setHasError] = useState(false);
  const initials = name
    .replace('Dr. ', '')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  if (!url || hasError) {
    return (
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#003d9b] to-[#0052cc] text-white font-bold text-xs flex items-center justify-center border-2 border-white shadow-xs shrink-0 select-none">
        {initials}
      </div>
    );
  }

  return (
    <img
      src={url}
      alt=""
      onError={() => setHasError(true)}
      className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-xs shrink-0"
    />
  );
};

export const QuickTherapistSearch: React.FC<QuickTherapistSearchProps> = ({
  onSelectTherapist,
}) => {
  const { data: therapists = [], isLoading } = useTherapists();
  const isSarahOnline = useTherapistStatusStore((state) => state.isOnline);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All Specialties');

  const filteredTherapists = useMemo(() => {
    return therapists.filter((t) => {
      const matchesSearch =
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.specialization.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSpecialty =
        selectedSpecialty === 'All Specialties' ||
        t.specialization.toLowerCase().includes(selectedSpecialty.toLowerCase());
      return matchesSearch && matchesSpecialty;
    });
  }, [therapists, searchQuery, selectedSpecialty]);

  return (
    <div className="bg-white rounded-2xl border border-[#c3c6d6]/40 p-6 shadow-sm space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-heading text-lg font-bold text-[#191c1e] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#003d9b]">person_search</span>
            Find &amp; Book a Therapist
          </h3>
          <p className="text-xs text-[#51606f] mt-0.5">
            Search licensed practitioners and select your preferred date &amp; time.
          </p>
        </div>

        <span className="text-xs font-semibold px-3 py-1 bg-[#d5e4f6]/60 text-[#003d9b] rounded-full self-start sm:self-auto">
          {filteredTherapists.length} Available Practitioners
        </span>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#737685]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search therapist name or condition..."
            className="w-full pl-9 pr-4 py-2.5 bg-[#f8f9fb] border border-[#c3c6d6]/60 rounded-xl text-xs font-medium text-[#191c1e] focus:outline-none focus:border-[#003d9b] focus:ring-1 focus:ring-[#003d9b] transition"
          />
        </div>

        {/* Specialty dropdown */}
        <div className="relative sm:w-64">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#737685]" />
          <select
            value={selectedSpecialty}
            onChange={(e) => setSelectedSpecialty(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-[#f8f9fb] border border-[#c3c6d6]/60 rounded-xl text-xs font-medium text-[#191c1e] focus:outline-none focus:border-[#003d9b] appearance-none cursor-pointer"
          >
            {SPECIALTY_OPTIONS.map((spec) => (
              <option key={spec} value={spec}>
                {spec}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Practitioner Cards Grid */}
      {isLoading ? (
        <div className="py-8 text-center text-xs text-[#51606f] animate-pulse">
          Loading therapists...
        </div>
      ) : filteredTherapists.length === 0 ? (
        <EmptyState
          title="No Therapists Found"
          description="No therapists match your search criteria. Try resetting the search filters."
          actionLabel="Reset Search"
          onAction={() => {
            setSearchQuery('');
            setSelectedSpecialty('All Specialties');
          }}
          imageSize="max-w-[140px]"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTherapists.map((therapist) => {
            const isOnline = therapist.id === 'therapist-1' ? isSarahOnline : true;
            return (
              <div
                key={therapist.id}
                className="p-4 rounded-xl border border-[#c3c6d6]/50 bg-[#f8f9fb]/40 hover:bg-white hover:border-[#003d9b]/40 hover:shadow-md transition-all flex flex-col justify-between gap-4 group"
              >
                <div className="flex items-start gap-3.5">
                  <div className="relative">
                    <QuickTherapistAvatar url={therapist.avatarUrl} name={therapist.name} />
                    <span
                      className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${
                        isOnline ? 'bg-emerald-500' : 'bg-slate-300'
                      }`}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-heading font-bold text-sm text-[#191c1e] truncate group-hover:text-[#003d9b] transition">
                        {therapist.name}
                      </h4>
                      <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60 flex items-center gap-1">
                        ★ {therapist.rating}
                      </span>
                    </div>

                    <p className="text-xs text-[#51606f] font-medium mt-0.5 truncate">
                      {therapist.specialization}
                    </p>

                    <div className="flex items-center gap-3 mt-2 text-[11px] text-[#737685]">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#003d9b]" /> 50 min
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[#003d9b]" /> Available Next Day
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onSelectTherapist(therapist)}
                  className="w-full justify-between bg-white text-[#003d9b] hover:bg-[#003d9b] hover:text-white border-[#003d9b]/30 font-semibold text-xs transition"
                >
                  <span className="flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5" /> Book Session
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
