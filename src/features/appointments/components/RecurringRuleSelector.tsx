import React from 'react';
import { Repeat, Calendar } from 'lucide-react';
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

  const frequencies: Array<{ id: RecurrenceFrequency; label: string; description: string }> = [
    { id: 'SINGLE', label: 'One-Time Session', description: 'Single appointment only' },
    { id: 'WEEKLY', label: 'Weekly Series', description: `Every ${dayName}` },
    { id: 'BIWEEKLY', label: 'Bi-Weekly Series', description: `Every 2nd ${dayName}` },
    { id: 'MONTHLY', label: 'Monthly Series', description: 'Once per month' },
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
    <div className="space-y-4 text-left p-5 bg-white border border-slate-200 rounded-2xl shadow-sm">
      <div className="flex items-center space-x-2 text-[#005eb8] text-xs font-semibold">
        <Repeat className="w-4 h-4" />
        <span>Booking Schedule Type</span>
      </div>

      {/* Frequency Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {frequencies.map((freq) => {
          const isSelected = value.frequency === freq.id;

          return (
            <button
              key={freq.id}
              type="button"
              onClick={() => handleFrequencyChange(freq.id)}
              className={cn(
                'p-3 rounded-lg border text-left transition-all space-y-1',
                isSelected
                  ? 'bg-[#d6e3ff] border-[#005eb8] ring-1 ring-[#005eb8]'
                  : 'bg-slate-50 border-slate-200 hover:border-slate-300',
              )}
            >
              <p
                className={cn(
                  'text-xs font-bold',
                  isSelected ? 'text-[#00478d]' : 'text-[#191c1e]',
                )}
              >
                {freq.label}
              </p>
              <p className="text-[11px] text-[#505f76]">{freq.description}</p>
            </button>
          );
        })}
      </div>

      {/* Occurrences Selector (Only if recurring) */}
      {value.frequency !== 'SINGLE' && (
        <div className="pt-3 border-t border-slate-100 space-y-3">
          <div className="flex items-center justify-between">
            <label
              htmlFor="recurrenceCountSelect"
              className="block text-xs font-semibold text-[#505f76]"
            >
              Total Number of Sessions
            </label>
            <span className="text-xs text-[#005eb8] font-semibold">
              {value.occurrencesCount} total sessions
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {[4, 8, 12].map((count) => (
              <button
                key={count}
                type="button"
                onClick={() => handleOccurrencesChange(count)}
                className={cn(
                  'flex-1 py-2 rounded-lg text-xs font-semibold border transition',
                  value.occurrencesCount === count
                    ? 'bg-[#005eb8] text-white border-[#005eb8] shadow-sm'
                    : 'bg-slate-50 text-[#505f76] border-slate-200 hover:bg-slate-100',
                )}
              >
                {count} Sessions
              </button>
            ))}
          </div>

          {/* Recurrence Summary Callout */}
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center space-x-2.5 text-xs text-[#191c1e]">
            <Calendar className="w-4 h-4 text-[#005eb8] flex-shrink-0" />
            <span>
              This will automatically reserve <strong>{value.occurrencesCount} sessions</strong>{' '}
              starting {startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
