import React from 'react';
import { Search, Star, SlidersHorizontal, List, LayoutGrid, X } from 'lucide-react';

interface TherapistFilterToolbarProps {
  searchQuery: string;
  onSearchQueryChange: (q: string) => void;
  selectedSpecialty: string;
  onSelectedSpecialtyChange: (s: string) => void;
  showTopRatedOnly: boolean;
  onShowTopRatedOnlyChange: (b: boolean) => void;
  sortBy: 'rating' | 'experience' | 'name';
  onSortByChange: (s: 'rating' | 'experience' | 'name') => void;
  layoutMode: 'list' | 'grid';
  onLayoutModeChange: (m: 'list' | 'grid') => void;
  resultCount: number;
}

const SPECIALTY_FILTERS = [
  'All Specialties',
  'Cognitive Behavioral Therapy (CBT)',
  'Mindfulness & Mood Care',
  'Trauma & Resilience Therapy',
  'Anxiety & Stress Management',
];

export const TherapistFilterToolbar: React.FC<TherapistFilterToolbarProps> = ({
  searchQuery,
  onSearchQueryChange,
  selectedSpecialty,
  onSelectedSpecialtyChange,
  showTopRatedOnly,
  onShowTopRatedOnlyChange,
  sortBy,
  onSortByChange,
  layoutMode,
  onLayoutModeChange,
  resultCount,
}) => {
  return (
    <div className="bg-white rounded-xl border border-outline-variant/40 p-5 space-y-3 text-left">
      <div className="flex flex-col md:flex-row md:items-end gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <label className="text-[11px] font-semibold text-secondary uppercase tracking-wider mb-1 block">
            Search
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchQueryChange(e.target.value)}
              placeholder="Name or specialization…"
              className="w-full pl-9 pr-9 py-2 bg-surface-container-low border border-outline-variant/60 rounded-lg text-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchQueryChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Quick filters + sort + layout */}
        <div className="flex items-end gap-2 flex-wrap sm:flex-nowrap">
          <button
            type="button"
            onClick={() => onShowTopRatedOnlyChange(!showTopRatedOnly)}
            className={`px-3 py-2 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition cursor-pointer ${
              showTopRatedOnly
                ? 'bg-amber-50 border-amber-300 text-amber-800'
                : 'bg-surface-container-low border-outline-variant/60 text-secondary hover:text-on-surface hover:border-outline-variant'
            }`}
          >
            <Star
              className={`w-3 h-3 ${
                showTopRatedOnly ? 'fill-amber-500 text-amber-500' : 'text-outline-variant'
              }`}
            />
            Top Rated
          </button>

          {/* Sort */}
          <div className="flex items-center gap-1.5 bg-surface-container-low border border-outline-variant/60 px-3 py-2 rounded-lg text-xs text-secondary">
            <SlidersHorizontal className="w-3.5 h-3.5 text-outline" />
            <select
              value={sortBy}
              onChange={(e) => onSortByChange(e.target.value as 'rating' | 'experience' | 'name')}
              className="bg-transparent text-on-surface font-medium focus:outline-none cursor-pointer text-xs"
            >
              <option value="rating">Rating</option>
              <option value="experience">Experience</option>
              <option value="name">Name</option>
            </select>
          </div>

          {/* Layout toggle */}
          <div className="hidden sm:flex items-center bg-surface-container-low border border-outline-variant/60 p-0.5 rounded-lg">
            <button
              onClick={() => onLayoutModeChange('list')}
              className={`p-1.5 rounded-md transition ${
                layoutMode === 'list'
                  ? 'bg-primary text-white'
                  : 'text-outline hover:text-on-surface'
              }`}
              title="List View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onLayoutModeChange('grid')}
              className={`p-1.5 rounded-md transition ${
                layoutMode === 'grid'
                  ? 'bg-primary text-white'
                  : 'text-outline hover:text-on-surface'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Specialty filter row */}
      <div className="flex items-center justify-between pt-2 border-t border-outline-variant/20">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
          {SPECIALTY_FILTERS.map((spec) => (
            <button
              key={spec}
              onClick={() => onSelectedSpecialtyChange(spec)}
              className={`px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                selectedSpecialty === spec
                  ? 'bg-primary text-white'
                  : 'text-secondary hover:bg-surface-container-low hover:text-on-surface'
              }`}
            >
              {spec}
            </button>
          ))}
        </div>

        <span className="text-xs text-secondary shrink-0 hidden md:block tabular-nums">
          {resultCount} result{resultCount !== 1 ? 's' : ''}
        </span>
      </div>
    </div>
  );
};

export default TherapistFilterToolbar;
