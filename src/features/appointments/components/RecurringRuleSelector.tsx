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
    <div className="space-y-4 text-left p-5 bg-slate-900 border border-slate-800 rounded-2xl">
      <div className="flex items-center space-x-2 text-indigo-400 text-xs font-semibold">
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
                'p-3 rounded-xl border text-left transition-all space-y-1',
                isSelected
                  ? 'bg-indigo-600/20 border-indigo-500 ring-1 ring-indigo-500/50'
                  : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700/80',
              )}
            >
              <p className={cn('text-xs font-bold', isSelected ? 'text-white' : 'text-slate-300')}>
                {freq.label}
              </p>
              <p className="text-[11px] text-slate-400">{freq.description}</p>
            </button>
          );
        })}
      </div>

      {/* Occurrences Selector (Only if recurring) */}
      {value.frequency !== 'SINGLE' && (
        <div className="pt-3 border-t border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <label
              htmlFor="recurrenceCountSelect"
              className="block text-xs font-semibold text-slate-300"
            >
              Total Number of Sessions
            </label>
            <span className="text-xs text-indigo-300 font-medium">
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
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white',
                )}
              >
                {count} Sessions
              </button>
            ))}
          </div>

          {/* Recurrence Summary Callout */}
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 flex items-center space-x-2.5 text-xs text-slate-300">
            <Calendar className="w-4 h-4 text-indigo-400 flex-shrink-0" />
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
