import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  Calendar as CalendarIcon,
  Lock,
  Sparkles,
  Trash2,
  RotateCcw,
} from 'lucide-react';

export interface AvailabilityBlock {
  id: string;
  date: string; // "YYYY-MM-DD"
  startTime: string; // "09:00"
  endTime: string; // "12:00"
  startHour: number; // 9
  durationHours: number; // 3
  location: string;
  type: 'available' | 'booked';
  title?: string;
  services?: string[];
  patientName?: string;
  isRecurring?: boolean;
}

// Helper: Format Date object to "YYYY-MM-DD"
const formatDateISO = (d: Date): string => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Helper: Get Monday of the given date's week
const getMondayOfWeek = (d: Date): Date => {
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(date.setDate(diff));
};

// Helper: Add days to a Date
const addDays = (d: Date, days: number): Date => {
  const result = new Date(d);
  result.setDate(result.getDate() + days);
  return result;
};

// Initial dynamic sample blocks anchored around current date
const generateInitialBlocks = (): AvailabilityBlock[] => {
  const today = new Date();
  const monday = getMondayOfWeek(today);

  const monStr = formatDateISO(monday);
  const tueStr = formatDateISO(addDays(monday, 1));
  const wedStr = formatDateISO(addDays(monday, 2));
  const friStr = formatDateISO(addDays(monday, 4));

  return [
    {
      id: '1',
      date: monStr,
      startTime: '09:00',
      endTime: '12:00',
      startHour: 9,
      durationHours: 3,
      location: 'MFP - Thane',
      type: 'available',
      services: ['Follow Up', 'Consultation'],
      isRecurring: true,
    },
    {
      id: '2',
      date: tueStr,
      startTime: '10:00',
      endTime: '12:00',
      startHour: 10,
      durationHours: 2,
      location: 'Telehealth',
      type: 'available',
      services: ['CBT Therapy'],
      isRecurring: true,
    },
    {
      id: '3',
      date: tueStr,
      startTime: '12:30',
      endTime: '13:30',
      startHour: 12.5,
      durationHours: 1,
      location: 'Telehealth',
      type: 'booked',
      patientName: 'Alex Patient - CBT Session',
    },
    {
      id: '4',
      date: wedStr,
      startTime: '09:00',
      endTime: '13:00',
      startHour: 9,
      durationHours: 4,
      location: 'MFP - Thane',
      type: 'available',
      services: ['Consultation', 'Anxiety Care'],
      isRecurring: true,
    },
    {
      id: '5',
      date: friStr,
      startTime: '13:00',
      endTime: '16:00',
      startHour: 13,
      durationHours: 3,
      location: 'Online Clinic',
      type: 'available',
      services: ['Mindfulness'],
      isRecurring: true,
    },
  ];
};

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const HOURS = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];

export const WeeklyAvailabilityCalendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('week');
  const [blocks, setBlocks] = useState<AvailabilityBlock[]>(generateInitialBlocks);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedBlock, setSelectedBlock] = useState<AvailabilityBlock | null>(null);

  // Modal Form State
  const [modalDate, setModalDate] = useState<string>(formatDateISO(new Date()));
  const [modalStartTime, setModalStartTime] = useState<string>('09:00');
  const [modalEndTime, setModalEndTime] = useState<string>('12:00');
  const [modalLocation, setModalLocation] = useState<string>('MFP - Thane (400601)');
  const [modalServiceType, setModalServiceType] = useState<string>('One on One Service');
  const [isRecurring, setIsRecurring] = useState<boolean>(true);
  const [servicesEnabled, setServicesEnabled] = useState<{
    followUp: boolean;
    consultation: boolean;
  }>({
    followUp: true,
    consultation: true,
  });

  // Calculate 7 days of the current week (Mon-Sun)
  const monday = getMondayOfWeek(currentDate);
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = addDays(monday, i);
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    const fullName = d.toLocaleDateString('en-US', { weekday: 'long' });
    const dateNum = d.getDate();
    const iso = formatDateISO(d);
    const isToday = iso === formatDateISO(new Date());
    const isWeekend = d.getDay() === 0 || d.getDay() === 6;
    return { dateObj: d, name: dayName, fullName, dateNum, iso, isToday, isWeekend };
  });

  // Week Date Range Label
  const weekRangeString = `${weekDays[0].dateObj.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })} – ${weekDays[6].dateObj.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })}`;

  // Current Time indicator top offset in hours
  const now = new Date();
  const currentHourDecimal = now.getHours() + now.getMinutes() / 60;
  const showTimeLine = currentHourDecimal >= 8 && currentHourDecimal <= 19;
  const timeLineTopPx = (currentHourDecimal - 8) * 64;

  // Navigation handlers
  const handlePrev = () => {
    if (viewMode === 'week') {
      setCurrentDate((prev: Date) => addDays(prev, -7));
    } else if (viewMode === 'day') {
      setCurrentDate((prev: Date) => addDays(prev, -1));
    } else {
      const d = new Date(currentDate);
      d.setMonth(d.getMonth() - 1);
      setCurrentDate(d);
    }
  };

  const handleNext = () => {
    if (viewMode === 'week') {
      setCurrentDate((prev: Date) => addDays(prev, 7));
    } else if (viewMode === 'day') {
      setCurrentDate((prev: Date) => addDays(prev, 1));
    } else {
      const d = new Date(currentDate);
      d.setMonth(d.getMonth() + 1);
      setCurrentDate(d);
    }
  };

  const handleResetFilters = () => {
    setCurrentDate(new Date());
    setViewMode('week');
  };

  const handleOpenModal = (targetDateIso?: string, defaultHour = 9) => {
    setModalDate(targetDateIso || formatDateISO(currentDate));
    const startStr = `${defaultHour.toString().padStart(2, '0')}:00`;
    const endStr = `${(defaultHour + 3).toString().padStart(2, '0')}:00`;
    setModalStartTime(startStr);
    setModalEndTime(endStr);
    setIsModalOpen(true);
  };

  const handleSaveAvailability = (e: React.FormEvent) => {
    e.preventDefault();
    const startH = parseInt(modalStartTime.split(':')[0], 10) || 9;
    const endH = parseInt(modalEndTime.split(':')[0], 10) || 12;
    const duration = Math.max(1, endH - startH);

    const activeServices: string[] = [];
    if (servicesEnabled.followUp) activeServices.push('Follow Up');
    if (servicesEnabled.consultation) activeServices.push('Consultation');

    const newBlock: AvailabilityBlock = {
      id: Date.now().toString(),
      date: modalDate,
      startTime: modalStartTime,
      endTime: modalEndTime,
      startHour: startH,
      durationHours: duration,
      location: modalLocation.includes('Telehealth') ? 'Telehealth' : 'MFP - Thane',
      type: 'available',
      services: activeServices.length > 0 ? activeServices : ['General Care'],
      isRecurring,
    };

    setBlocks((prev: AvailabilityBlock[]) => [...prev, newBlock]);
    setIsModalOpen(false);
  };

  const handleDeleteBlock = (blockId: string) => {
    setBlocks((prev: AvailabilityBlock[]) =>
      prev.filter((b: AvailabilityBlock) => b.id !== blockId),
    );
    setSelectedBlock(null);
  };

  const formatHourLabel = (hour: number) => {
    if (hour === 12) return '12 PM';
    if (hour > 12) return `${hour - 12} PM`;
    return `${hour} AM`;
  };

  return (
    <div className="bg-white rounded-2xl border border-[#c3c6d6]/40 shadow-xs flex flex-col w-full overflow-hidden">
      {/* Calendar Header Bar */}
      <div className="p-4 md:p-6 border-b border-[#c3c6d6]/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#f8f9fb]">
        {/* Left: All-in-One Unified Date Selector & Navigation Bar */}
        <div className="flex flex-wrap items-center gap-3">
          {/* All-in-One Integrated Date Control Bar */}
          <div className="flex items-center gap-2 bg-white border border-[#c3c6d6]/60 p-1.5 rounded-2xl shadow-2xs">
            {/* Prev Button */}
            <button
              type="button"
              onClick={handlePrev}
              className="p-1.5 text-[#434654] hover:bg-[#f8f9fb] hover:text-[#0052cc] rounded-xl transition-colors cursor-pointer"
              title="Previous"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* All-in-One Date Selector (Month, Year, & Pick Date in One Control) */}
            <div className="flex items-center gap-1.5 bg-[#f8f9fb] px-3 py-1.5 rounded-xl border border-[#c3c6d6]/30">
              {/* Month Dropdown */}
              <select
                value={currentDate.getMonth()}
                onChange={(e) => {
                  const newD = new Date(currentDate);
                  newD.setMonth(parseInt(e.target.value, 10));
                  setCurrentDate(newD);
                }}
                className="bg-transparent font-heading font-extrabold text-sm text-[#191c1e] focus:outline-none cursor-pointer"
              >
                {MONTH_NAMES.map((m, idx) => (
                  <option key={m} value={idx}>
                    {m}
                  </option>
                ))}
              </select>

              {/* Year Dropdown */}
              <select
                value={currentDate.getFullYear()}
                onChange={(e) => {
                  const newD = new Date(currentDate);
                  newD.setFullYear(parseInt(e.target.value, 10));
                  setCurrentDate(newD);
                }}
                className="bg-transparent font-heading font-extrabold text-sm text-[#191c1e] focus:outline-none cursor-pointer"
              >
                {[2024, 2025, 2026, 2027, 2028, 2029, 2030].map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>

              {/* Direct Date Picker Trigger Icon */}
              <div className="relative flex items-center ml-1 pl-2 border-l border-[#c3c6d6]/40">
                <CalendarIcon className="w-4 h-4 text-[#0052cc] cursor-pointer" />
                <input
                  type="date"
                  value={formatDateISO(currentDate)}
                  onChange={(e) => {
                    if (e.target.value) {
                      const [y, m, d] = e.target.value.split('-').map(Number);
                      setCurrentDate(new Date(y, m - 1, d));
                    }
                  }}
                  className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                  title="Click to jump to any date"
                />
              </div>
            </div>

            {/* Next Button */}
            <button
              type="button"
              onClick={handleNext}
              className="p-1.5 text-[#434654] hover:bg-[#f8f9fb] hover:text-[#0052cc] rounded-xl transition-colors cursor-pointer"
              title="Next"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Active Date / Week Range Label */}
          <span className="text-xs font-bold text-[#191c1e] bg-white border border-[#c3c6d6]/50 px-3 py-2 rounded-xl shadow-2xs whitespace-nowrap">
            {viewMode === 'week' ? weekRangeString : currentDate.toDateString()}
          </span>

          {/* Clear / Reset View & Date Filters Button */}
          <button
            type="button"
            onClick={handleResetFilters}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-[#51606f] hover:text-[#0052cc] bg-white hover:bg-[#e6f0ff] border border-[#c3c6d6]/50 rounded-xl transition-colors shadow-2xs cursor-pointer"
            title="Reset date & view filters back to Today"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#0052cc]" />
            <span>Reset View</span>
          </button>
        </div>

        {/* Right: View Mode Toggle & Action */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          {/* View Mode Toggle (Day / Week / Month) */}
          <div className="flex bg-white rounded-xl p-1 border border-[#c3c6d6]/50 shadow-2xs text-xs font-semibold">
            <button
              type="button"
              onClick={() => setViewMode('day')}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'day'
                  ? 'bg-[#0052cc] text-white shadow-xs font-bold'
                  : 'text-[#434654] hover:text-[#191c1e]'
              }`}
            >
              Day
            </button>
            <button
              type="button"
              onClick={() => setViewMode('week')}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'week'
                  ? 'bg-[#0052cc] text-white shadow-xs font-bold'
                  : 'text-[#434654] hover:text-[#191c1e]'
              }`}
            >
              Week
            </button>
            <button
              type="button"
              onClick={() => setViewMode('month')}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'month'
                  ? 'bg-[#0052cc] text-white shadow-xs font-bold'
                  : 'text-[#434654] hover:text-[#191c1e]'
              }`}
            >
              Month
            </button>
          </div>

          {/* Add Availability CTA */}
          <button
            type="button"
            onClick={() => handleOpenModal(formatDateISO(currentDate), 9)}
            className="flex items-center gap-1.5 bg-[#0052cc] text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-[#003d9b] transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Availability
          </button>
        </div>
      </div>

      {/* Main View Area */}
      {viewMode === 'week' && (
        <div className="flex-1 flex flex-col overflow-x-auto">
          {/* Days Header Row (Mon-Sun) */}
          <div className="flex border-b border-[#c3c6d6]/40 bg-[#f8f9fb] min-w-[750px]">
            {/* Time Offset Column Header */}
            <div className="w-16 shrink-0 border-r border-[#c3c6d6]/40 p-2 text-center text-xs font-bold text-[#737685]">
              Time
            </div>

            {weekDays.map((day) => (
              <div
                key={day.iso}
                className={`flex-1 border-r border-[#c3c6d6]/40 p-2.5 text-center ${
                  day.isToday
                    ? 'bg-[#e6f0ff]/60 border-b-2 border-b-[#0052cc]'
                    : day.isWeekend
                      ? 'bg-[#f1f3f6]/60'
                      : ''
                }`}
              >
                <div
                  className={`text-[11px] uppercase font-bold tracking-wider ${
                    day.isToday ? 'text-[#0052cc]' : 'text-[#51606f]'
                  }`}
                >
                  {day.name}
                </div>
                <div
                  className={`text-lg font-heading font-extrabold mt-0.5 ${
                    day.isToday ? 'text-[#0052cc]' : 'text-[#191c1e]'
                  }`}
                >
                  {day.dateNum}
                </div>
              </div>
            ))}
          </div>

          {/* Scrollable Time Grid Body */}
          <div className="relative min-w-[750px] max-h-[620px] overflow-y-auto">
            {/* Current Time Indicator Red Line */}
            {showTimeLine && (
              <div
                className="absolute left-16 right-0 z-20 pointer-events-none flex items-center"
                style={{ top: `${timeLineTopPx}px` }}
              >
                <div className="w-2.5 h-2.5 rounded-full bg-rose-600 -ml-1.25 shadow-xs"></div>
                <div className="h-0.5 flex-1 bg-rose-500/70"></div>
              </div>
            )}

            <div className="flex">
              {/* Y-Axis Time Labels Column */}
              <div className="w-16 shrink-0 border-r border-[#c3c6d6]/40 bg-[#f8f9fb]/50 flex flex-col z-10">
                {HOURS.map((hour) => (
                  <div
                    key={hour}
                    className="h-[64px] border-b border-[#c3c6d6]/30 pr-2 pt-1 text-right relative"
                  >
                    <span className="text-[10px] font-bold text-[#51606f]">
                      {formatHourLabel(hour)}
                    </span>
                  </div>
                ))}
              </div>

              {/* 7 Day Columns Grid */}
              <div className="flex-1 flex relative">
                {/* Background Horizontal Hour Grid Lines */}
                <div className="absolute inset-0 pointer-events-none flex flex-col">
                  {HOURS.map((hour) => (
                    <div key={hour} className="h-[64px] w-full border-b border-[#c3c6d6]/20"></div>
                  ))}
                </div>

                {/* Day Columns */}
                {weekDays.map((day) => {
                  const dayBlocks = blocks.filter(
                    (b: AvailabilityBlock) =>
                      b.date === day.iso ||
                      (b.isRecurring && new Date(b.date).getDay() === day.dateObj.getDay()),
                  );

                  return (
                    <div
                      key={day.iso}
                      className={`flex-1 border-r border-[#c3c6d6]/30 relative group min-h-[704px] transition-colors ${
                        day.isWeekend
                          ? 'bg-slate-100/40 cursor-not-allowed'
                          : 'hover:bg-[#0052cc]/[0.02] cursor-pointer'
                      }`}
                      onClick={() => !day.isWeekend && handleOpenModal(day.iso, 9)}
                    >
                      {/* Hover "+ Add Slot" hint on empty cell */}
                      {!day.isWeekend && (
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 flex items-center justify-center pointer-events-none z-0">
                          <span className="bg-[#0052cc] text-white text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-1">
                            <Plus className="w-3.5 h-3.5" /> Add Slot
                          </span>
                        </div>
                      )}

                      {/* Weekend Icon Indicator */}
                      {day.isWeekend && (
                        <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
                          <Lock className="w-8 h-8 text-slate-400" />
                        </div>
                      )}

                      {/* Render Blocks */}
                      {dayBlocks.map((block: AvailabilityBlock) => {
                        const topOffset = (block.startHour - 8) * 64;
                        const heightPx = block.durationHours * 64;

                        if (block.type === 'booked') {
                          return (
                            <div
                              key={block.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedBlock(block);
                              }}
                              style={{ top: `${topOffset}px`, height: `${heightPx}px` }}
                              className="absolute left-1 right-1 bg-[#e6f0ff] border border-[#0052cc]/40 rounded-xl p-2.5 shadow-2xs flex flex-col justify-between z-10 hover:shadow-md transition-all cursor-pointer"
                            >
                              <div className="flex justify-between items-start gap-1">
                                <span className="px-1.5 py-0.5 bg-[#0052cc] text-white text-[9px] font-bold rounded uppercase tracking-wider">
                                  Booked
                                </span>
                                <span className="text-[10px] font-bold text-[#0052cc]">
                                  {block.startTime} – {block.endTime}
                                </span>
                              </div>
                              <div>
                                <p className="text-xs font-bold text-[#191c1e] truncate">
                                  {block.patientName}
                                </p>
                                <p className="text-[10px] text-[#434654]">{block.location}</p>
                              </div>
                            </div>
                          );
                        }

                        return (
                          <div
                            key={block.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedBlock(block);
                            }}
                            style={{ top: `${topOffset}px`, height: `${heightPx}px` }}
                            className="absolute left-1 right-1 bg-white border border-[#0d9488]/40 rounded-xl p-2.5 shadow-2xs flex flex-col justify-between z-10 hover:border-[#0d9488] hover:shadow-md transition-all cursor-pointer group/block"
                          >
                            <div>
                              <div className="flex justify-between items-start mb-1 gap-1">
                                <span className="text-[11px] font-bold text-[#0d9488] flex items-center gap-1">
                                  <span className="w-2 h-2 rounded-full bg-[#0d9488]"></span>{' '}
                                  Available
                                </span>
                                <span className="text-[10px] font-bold text-[#434654]">
                                  {block.startTime} – {block.endTime}
                                </span>
                              </div>
                              <p className="text-[11px] font-semibold text-[#191c1e] truncate">
                                {block.location}
                              </p>
                            </div>

                            {block.services && block.services.length > 0 && (
                              <div className="flex gap-1 flex-wrap mt-2">
                                {block.services.map((srv: string) => (
                                  <span
                                    key={srv}
                                    className="bg-[#ccfbf1]/60 text-[#0d9488] text-[9px] font-bold px-1.5 py-0.5 rounded border border-[#0d9488]/20"
                                  >
                                    {srv}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Single Day View Mode */}
      {viewMode === 'day' && (
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between bg-[#f8f9fb] p-4 rounded-xl border border-[#c3c6d6]/30">
            <div>
              <h3 className="text-lg font-bold text-[#191c1e]">
                {currentDate.toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </h3>
              <p className="text-xs text-[#434654]">
                Showing scheduled availability and bookings for this date.
              </p>
            </div>
            <button
              onClick={() => handleOpenModal(formatDateISO(currentDate), 9)}
              className="bg-[#0052cc] text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-[#003d9b] transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Slot
            </button>
          </div>

          <div className="border border-[#c3c6d6]/40 rounded-xl divide-y divide-[#c3c6d6]/30 overflow-hidden">
            {HOURS.map((hour) => {
              const dateIso = formatDateISO(currentDate);
              const hourBlocks = blocks.filter(
                (b: AvailabilityBlock) =>
                  (b.date === dateIso ||
                    (b.isRecurring && new Date(b.date).getDay() === currentDate.getDay())) &&
                  b.startHour <= hour &&
                  b.startHour + b.durationHours > hour,
              );

              return (
                <div
                  key={hour}
                  className="flex p-4 min-h-[72px] items-center hover:bg-[#f8f9fb] transition-colors"
                >
                  <div className="w-20 font-bold text-xs text-[#434654]">
                    {formatHourLabel(hour)}
                  </div>
                  <div className="flex-1 flex gap-3 flex-wrap">
                    {hourBlocks.length === 0 ? (
                      <span className="text-xs text-[#c3c6d6] italic">No slots scheduled</span>
                    ) : (
                      hourBlocks.map((b: AvailabilityBlock) => (
                        <div
                          key={b.id}
                          onClick={() => setSelectedBlock(b)}
                          className={`px-3 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-2 cursor-pointer ${
                            b.type === 'booked'
                              ? 'bg-[#e6f0ff] border-[#0052cc]/40 text-[#0052cc]'
                              : 'bg-[#ccfbf1]/50 border-[#0d9488]/40 text-[#0d9488]'
                          }`}
                        >
                          <span className="w-2 h-2 rounded-full bg-current"></span>
                          {b.startTime} - {b.endTime} ({b.location})
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Month Grid View Mode */}
      {viewMode === 'month' && (
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-[#434654] border-b pb-3">
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
            <div>Sun</div>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 35 }, (_, idx) => {
              const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
              const firstDayIndex = (startOfMonth.getDay() + 6) % 7; // Mon = 0
              const cellDate = addDays(startOfMonth, idx - firstDayIndex);
              const iso = formatDateISO(cellDate);
              const isCurrentMonth = cellDate.getMonth() === currentDate.getMonth();
              const dayBlocks = blocks.filter(
                (b: AvailabilityBlock) =>
                  b.date === iso ||
                  (b.isRecurring && new Date(b.date).getDay() === cellDate.getDay()),
              );

              return (
                <div
                  key={iso}
                  onClick={() => {
                    setCurrentDate(cellDate);
                    setViewMode('day');
                  }}
                  className={`min-h-[90px] border rounded-xl p-2 flex flex-col justify-between cursor-pointer transition-all ${
                    isCurrentMonth
                      ? 'bg-white border-[#c3c6d6]/40 hover:border-[#0052cc]'
                      : 'bg-slate-50 border-slate-200 opacity-60'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span
                      className={`text-xs font-bold ${cellDate.toDateString() === new Date().toDateString() ? 'bg-[#0052cc] text-white w-5 h-5 rounded-full flex items-center justify-center' : 'text-[#191c1e]'}`}
                    >
                      {cellDate.getDate()}
                    </span>
                    {dayBlocks.length > 0 && (
                      <span className="w-2 h-2 rounded-full bg-[#0d9488]"></span>
                    )}
                  </div>

                  <div className="space-y-1">
                    {dayBlocks.slice(0, 2).map((b: AvailabilityBlock) => (
                      <div
                        key={b.id}
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded truncate ${
                          b.type === 'booked'
                            ? 'bg-[#e6f0ff] text-[#0052cc]'
                            : 'bg-[#ccfbf1] text-[#0d9488]'
                        }`}
                      >
                        {b.startTime} {b.location}
                      </div>
                    ))}
                    {dayBlocks.length > 2 && (
                      <p className="text-[9px] text-[#434654] font-bold">
                        +{dayBlocks.length - 2} more
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Interactive Block Detail / Delete Modal */}
      {selectedBlock && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[420px] overflow-hidden flex flex-col">
            <div className="p-5 border-b border-[#c3c6d6]/30 flex justify-between items-center bg-[#f8f9fb]">
              <h3 className="font-bold text-base text-[#191c1e]">
                {selectedBlock.type === 'booked' ? 'Booked Session' : 'Availability Block'}
              </h3>
              <button
                type="button"
                onClick={() => setSelectedBlock(null)}
                className="text-[#434654] hover:text-[#191c1e] p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs text-[#434654]">
              <div>
                <p className="font-bold text-[#191c1e] text-sm">
                  {selectedBlock.type === 'booked'
                    ? selectedBlock.patientName
                    : selectedBlock.location}
                </p>
                <p className="mt-1">
                  📅 <strong className="text-[#191c1e]">{selectedBlock.date}</strong> (
                  {selectedBlock.startTime} – {selectedBlock.endTime})
                </p>
              </div>

              {selectedBlock.services && selectedBlock.services.length > 0 && (
                <div>
                  <p className="font-bold text-[#191c1e] mb-1">Services:</p>
                  <div className="flex gap-1.5 flex-wrap">
                    {selectedBlock.services.map((s: string) => (
                      <span
                        key={s}
                        className="bg-[#ccfbf1] text-[#0d9488] px-2 py-0.5 rounded font-bold"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-[#c3c6d6]/30 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => handleDeleteBlock(selectedBlock.id)}
                  className="flex items-center gap-1.5 text-rose-600 hover:text-rose-700 font-bold cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" /> Remove Slot
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedBlock(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-[#191c1e] font-bold rounded-xl cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Modal: Add Availability */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[540px] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-[#c3c6d6]/30 bg-[#f8f9fb]">
              <h3 className="font-heading font-extrabold text-lg text-[#191c1e] flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#0052cc]" />
                Add Availability Block
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-[#434654] hover:text-[#191c1e] p-1.5 rounded-lg hover:bg-slate-200/50 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveAvailability} className="p-6 space-y-5 text-left text-xs">
              {/* Date & Location Selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-[#191c1e] mb-1.5 block">Target Date</label>
                  <input
                    type="date"
                    value={modalDate}
                    onChange={(e) => setModalDate(e.target.value)}
                    className="w-full bg-[#f8f9fb] border border-[#c3c6d6]/60 rounded-xl px-3 py-2.5 font-semibold text-[#191c1e] focus:outline-none focus:border-[#0052cc]"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#191c1e] mb-1.5 block">Clinic Location</label>
                  <select
                    value={modalLocation}
                    onChange={(e) => setModalLocation(e.target.value)}
                    className="w-full bg-[#f8f9fb] border border-[#c3c6d6]/60 rounded-xl px-3 py-2.5 font-semibold text-[#191c1e] focus:outline-none focus:border-[#0052cc]"
                  >
                    <option value="MFP - Thane (400601)">MFP - Thane (400601)</option>
                    <option value="Telehealth">Telehealth / Video Call</option>
                  </select>
                </div>
              </div>

              {/* Service Type */}
              <div>
                <label className="font-bold text-[#191c1e] mb-1.5 block">Service Type</label>
                <select
                  value={modalServiceType}
                  onChange={(e) => setModalServiceType(e.target.value)}
                  className="w-full bg-[#f8f9fb] border border-[#c3c6d6]/60 rounded-xl px-3 py-2.5 font-semibold text-[#191c1e] focus:outline-none focus:border-[#0052cc]"
                >
                  <option value="One on One Service">One on One Service</option>
                  <option value="Group Session">Group Session</option>
                </select>
              </div>

              {/* Start & End Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-[#191c1e] mb-1.5 block">Start Time</label>
                  <input
                    type="time"
                    value={modalStartTime}
                    onChange={(e) => setModalStartTime(e.target.value)}
                    className="w-full bg-[#f8f9fb] border border-[#c3c6d6]/60 rounded-xl px-3 py-2.5 font-semibold text-[#191c1e] focus:outline-none focus:border-[#0052cc]"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#191c1e] mb-1.5 block">End Time</label>
                  <input
                    type="time"
                    value={modalEndTime}
                    onChange={(e) => setModalEndTime(e.target.value)}
                    className="w-full bg-[#f8f9fb] border border-[#c3c6d6]/60 rounded-xl px-3 py-2.5 font-semibold text-[#191c1e] focus:outline-none focus:border-[#0052cc]"
                  />
                </div>
              </div>

              {/* Recurrence Checkbox */}
              <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl border border-[#c3c6d6]/40 hover:bg-[#f8f9fb] transition-colors">
                <input
                  type="checkbox"
                  checked={isRecurring}
                  onChange={(e) => setIsRecurring(e.target.checked)}
                  className="w-4 h-4 rounded text-[#0052cc] focus:ring-[#0052cc]"
                />
                <span className="font-semibold text-[#191c1e]">This Time Slot Recurs Weekly</span>
              </label>

              {/* Service Availability Options */}
              <div className="space-y-3 pt-2">
                <div className="flex justify-between items-center">
                  <span className="font-extrabold text-[#191c1e]">Service Availability</span>
                  <button
                    type="button"
                    onClick={() => setServicesEnabled({ followUp: true, consultation: true })}
                    className="text-[11px] font-bold text-[#0052cc] hover:underline cursor-pointer"
                  >
                    Enable all
                  </button>
                </div>

                <div className="space-y-2">
                  <div className="bg-[#f8f9fb] border border-[#c3c6d6]/50 rounded-xl p-3 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-[#191c1e]">Follow Up Session</p>
                      <p className="text-[10px] text-[#434654]">50 min duration</p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setServicesEnabled(
                          (prev: { followUp: boolean; consultation: boolean }) => ({
                            ...prev,
                            followUp: !prev.followUp,
                          }),
                        )
                      }
                      className={`w-10 h-6 rounded-full transition-colors relative cursor-pointer ${
                        servicesEnabled.followUp ? 'bg-[#0052cc]' : 'bg-slate-300'
                      }`}
                    >
                      <span
                        className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
                          servicesEnabled.followUp ? 'left-5' : 'left-1'
                        }`}
                      ></span>
                    </button>
                  </div>

                  <div className="bg-[#f8f9fb] border border-[#c3c6d6]/50 rounded-xl p-3 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-[#191c1e]">Consultation / CBT</p>
                      <p className="text-[10px] text-[#434654]">50 min duration</p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setServicesEnabled(
                          (prev: { followUp: boolean; consultation: boolean }) => ({
                            ...prev,
                            consultation: !prev.consultation,
                          }),
                        )
                      }
                      className={`w-10 h-6 rounded-full transition-colors relative cursor-pointer ${
                        servicesEnabled.consultation ? 'bg-[#0052cc]' : 'bg-slate-300'
                      }`}
                    >
                      <span
                        className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
                          servicesEnabled.consultation ? 'left-5' : 'left-1'
                        }`}
                      ></span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-[#c3c6d6]/30">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl font-bold text-[#434654] hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl font-bold bg-[#0052cc] text-white hover:bg-[#003d9b] shadow-xs transition-colors cursor-pointer"
                >
                  Save Availability
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeeklyAvailabilityCalendar;
