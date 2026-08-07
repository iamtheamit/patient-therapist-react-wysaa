import React from 'react';
import { Repeat, Calendar, CalendarDays, Sparkles } from 'lucide-react';
import type { RecurringRule, RecurrenceFrequency } from '../types/recurring.types';
import { cn } from '@/utils/cn';

interface RecurringRuleSelectorProps {
  value: RecurringRule;
  onChange: (rule: RecurringRule) => void;
  baseStartTime: string;
}

export const RecurringRuleSelector: React.FC<RecurringRuleSelectorProps> = ({
  value,
  onChange,
  baseStartTime,
}) => {
  const startDate = new Date(baseStartTime);
  const dayName = startDate.toLocaleDateString('en-US', { weekday: 'long' });

  const frequencies: Array<{
    id: RecurrenceFrequency;
    label: string;
    description: string;
    badge?: string;
    icon: React.ComponentType<{ className?: string }>;
  }> = [
    {
      id: 'SINGLE',
      label: 'One-Time Session',
      description: 'Single appointment only',
      badge: 'Standard',
      icon: Calendar,
    },
    {
      id: 'WEEKLY',
      label: 'Weekly Care Series',
      description: `Every ${dayName}`,
      badge: 'Recommended',
      icon: CalendarDays,
    },
    {
      id: 'BIWEEKLY',
      label: 'Bi-Weekly Series',
      description: `Every 2nd ${dayName}`,
      icon: Repeat,
    },
    {
      id: 'MONTHLY',
      label: 'Monthly Check-In',
      description: 'Once per month',
      icon: Repeat,
    },
  ];

  const handleFrequencyChange = (frequency: RecurrenceFrequency) => {
    onChange({
      frequency,
      occurrencesCount: frequency === 'SINGLE' ? 1 : Math.max(4, value.occurrencesCount),
    });
  };

  const handleOccurrencesChange = (count: number) => {
    onChange({
      ...value,
      occurrencesCount: count,
    });
  };

  return (
    <div className="bg-white border border-[#c3c6d6]/40 rounded-2xl p-6 shadow-sm space-y-4 text-left">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2 text-[#003d9b]">
          <Repeat className="w-4 h-4" />
          <h3 className="font-heading font-bold text-sm text-[#191c1e]">
            Select Session Schedule Frequency
          </h3>
        </div>
        <span className="text-xs font-semibold text-[#51606f]">
          Flexibility: Cancel or reschedule 24h prior
        </span>
      </div>

      {/* Frequency Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {frequencies.map((freq) => {
          const isSelected = value.frequency === freq.id;
          const IconComp = freq.icon;

          return (
            <button
              key={freq.id}
              type="button"
              onClick={() => handleFrequencyChange(freq.id)}
              className={cn(
                'p-4 rounded-xl border text-left transition-all space-y-2 relative cursor-pointer group',
                isSelected
                  ? 'bg-gradient-to-b from-[#f0f4ff] to-[#e5eeff] border-[#003d9b] ring-2 ring-[#003d9b]/20 shadow-xs'
                  : 'bg-[#f8f9ff] border-[#c3c6d6]/50 hover:bg-white hover:border-[#003d9b]/40',
              )}
            >
              {freq.badge && (
                <span
                  className={cn(
                    'absolute top-2 right-2 text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider',
                    freq.badge === 'Recommended'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-slate-200 text-slate-700',
                  )}
                >
                  {freq.badge}
                </span>
              )}

              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    'p-1.5 rounded-lg text-xs',
                    isSelected
                      ? 'bg-[#003d9b] text-white'
                      : 'bg-slate-200 text-[#51606f] group-hover:bg-[#003d9b] group-hover:text-white transition',
                  )}
                >
                  <IconComp className="w-3.5 h-3.5" />
                </div>
                <p
                  className={cn(
                    'text-xs font-bold truncate',
                    isSelected ? 'text-[#003d9b]' : 'text-[#191c1e]',
                  )}
                >
                  {freq.label}
                </p>
              </div>

              <p className="text-[11px] text-[#51606f] leading-snug">{freq.description}</p>
            </button>
          );
        })}
      </div>

      {/* Occurrences Selector (Only if recurring) */}
      {value.frequency !== 'SINGLE' && (
        <div className="pt-4 border-t border-slate-100 space-y-4">
          <div className="flex items-center justify-between">
            <label
              htmlFor="recurrenceCountSelect"
              className="block text-xs font-bold text-[#191c1e]"
            >
              Number of Recurring Sessions to Reserve
            </label>
            <span className="text-xs text-[#003d9b] font-bold">
              {value.occurrencesCount} total visits reserved
            </span>
          </div>

          <div className="flex items-center gap-3">
            {[4, 8, 12].map((count) => (
              <button
                key={count}
                type="button"
                onClick={() => handleOccurrencesChange(count)}
                className={cn(
                  'flex-1 py-2.5 rounded-xl text-xs font-bold border transition cursor-pointer',
                  value.occurrencesCount === count
                    ? 'bg-[#003d9b] text-white border-[#003d9b] shadow-xs'
                    : 'bg-[#f8f9ff] text-[#51606f] border-[#c3c6d6]/60 hover:bg-white hover:text-[#191c1e]',
                )}
              >
                {count} Sessions Package
              </button>
            ))}
          </div>

          {/* Recurrence Summary Callout */}
          <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl flex items-center gap-3 text-xs text-blue-950">
            <Sparkles className="w-4 h-4 text-[#003d9b] shrink-0" />
            <span>
              This recurring care plan will automatically reserve{' '}
              <strong>{value.occurrencesCount} sessions</strong> starting on{' '}
              <strong>
                {startDate.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </strong>
              .
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
