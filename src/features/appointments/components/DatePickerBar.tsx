import React, { useMemo } from 'react';
import { Calendar } from 'lucide-react';

interface DatePickerBarProps {
  selectedDate: string;
  onSelectDate: (date: string) => void;
}

export const DatePickerBar: React.FC<DatePickerBarProps> = ({ selectedDate, onSelectDate }) => {
  const next7Days = useMemo(() => {
    const days = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const isoDate = d.toISOString().split('T')[0];
      const dayName =
        i === 0
          ? 'Today'
          : i === 1
            ? 'Tomorrow'
            : d.toLocaleDateString('en-US', { weekday: 'short' });
      const monthDay = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      days.push({ isoDate, dayName, monthDay });
    }
    return days;
  }, []);

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <label className="text-xs font-bold text-[#191c1e] flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#003d9b]" /> Select Session Date
        </label>
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <span className="text-[11px] font-semibold text-[#51606f]">Custom Date:</span>
          <input
            type="date"
            min={new Date().toISOString().split('T')[0]}
            value={selectedDate}
            onChange={(e) => onSelectDate(e.target.value)}
            className="px-2.5 py-1 bg-[#f8f9ff] border border-[#c3c6d6]/60 rounded-lg text-xs font-medium text-[#191c1e] focus:outline-none focus:border-[#003d9b]"
          />
        </div>
      </div>

      {/* Date Pill Cards Carousel */}
      <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 overflow-x-auto pb-1">
        {next7Days.map((day) => {
          const isSelected = selectedDate === day.isoDate;
          return (
            <button
              key={day.isoDate}
              type="button"
              onClick={() => onSelectDate(day.isoDate)}
              className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center cursor-pointer ${
                isSelected
                  ? 'bg-[#003d9b] text-white border-[#003d9b] shadow-md shadow-[#003d9b]/20 ring-2 ring-[#003d9b]/30'
                  : 'bg-[#f8f9ff] text-[#191c1e] border-[#c3c6d6]/50 hover:bg-slate-100 hover:border-[#003d9b]/40'
              }`}
            >
              <span
                className={`text-[10px] uppercase tracking-wider font-bold ${
                  isSelected ? 'text-blue-100' : 'text-[#51606f]'
                }`}
              >
                {day.dayName}
              </span>
              <span className="text-xs font-extrabold mt-0.5">{day.monthDay}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DatePickerBar;
