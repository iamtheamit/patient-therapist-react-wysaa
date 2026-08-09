import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  X,
  Calendar as CalendarIcon,
  RotateCcw,
  CheckCircle2,
  Clock,
  Check,
  XCircle,
  AlertTriangle,
} from 'lucide-react';
import { useNow } from '@/hooks/useNow';
import { useAuthStore } from '@/stores/authStore';
import { useTherapistCalendar } from '../hooks/useTherapistCalendar';

export interface AvailabilityBlock {
  id: string;
  date: string; // "YYYY-MM-DD"
  startTime: string; // "09:00"
  endTime: string; // "10:00"
  startHour: number; // 9
  durationHours: number; // 1
  location: string;
  type: 'available' | 'booked' | 'break' | 'held';
  status?: 'scheduled' | 'completed' | 'no_show' | 'cancelled' | 'held' | 'available' | 'break';
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

const START_HOUR = 7;
const HOURS = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const WeeklyAvailabilityCalendar: React.FC<{
  initialView?: 'day' | 'week' | 'month';
  therapistId?: string;
}> = ({ initialView, therapistId: therapistIdProp }) => {
  const user = useAuthStore((state) => state.user);
  const therapistId = therapistIdProp || user?.id || 'therapist-doc-1';

  const { appointmentBlocks, scheduleConfig, updateStatus } = useTherapistCalendar(therapistId);

  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>(initialView ?? 'week');
  const [selectedBlock, setSelectedBlock] = useState<AvailabilityBlock | null>(null);

  // Real-time Live Clock Hook
  const nowTime = useNow();
  const weekScrollRef = useRef<HTMLDivElement>(null);
  const dayScrollRef = useRef<HTMLDivElement>(null);

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
  const currentHourDecimal = nowTime.getHours() + nowTime.getMinutes() / 60;
  const showTimeLine = currentHourDecimal >= START_HOUR && currentHourDecimal <= 24;
  const timeLineTopPx = (currentHourDecimal - START_HOUR) * 64;

  // Auto-scroll scrollable time grid to current time or 8 AM
  useEffect(() => {
    const isToday = formatDateISO(currentDate) === formatDateISO(nowTime);
    const targetHour = isToday ? nowTime.getHours() : 9;
    const targetScroll = Math.max(0, (targetHour - START_HOUR - 1) * 64);

    if (viewMode === 'week' && weekScrollRef.current) {
      weekScrollRef.current.scrollTop = targetScroll;
    } else if (viewMode === 'day' && dayScrollRef.current) {
      dayScrollRef.current.scrollTop = targetScroll;
    }
  }, [viewMode, currentDate, nowTime]);

  // Derive calendar display blocks dynamically for any date ISO
  const getBlocksForDate = (dateIso: string, dateObj: Date): AvailabilityBlock[] => {
    const dayOfWeekName = DAY_NAMES[dateObj.getDay()];
    const rules = scheduleConfig?.weeklyRules || [];
    const dayRule = rules.find((r) => r.day.toLowerCase() === dayOfWeekName.toLowerCase());

    const result: AvailabilityBlock[] = [];

    // Filter appointments for this date
    const dateAppointments = appointmentBlocks.filter((b) => b.date === dateIso);

    // If day rule is missing or disabled, only show booked/scheduled appointments if any exist
    if (!dayRule || !dayRule.isEnabled) {
      return dateAppointments;
    }

    const slotDurMins = scheduleConfig?.slotDurationMinutes || 50;
    const bufferDurMins = scheduleConfig?.bufferDurationMinutes ?? 10;

    const [startH, startM] = (dayRule.startTime || '09:00').split(':').map(Number);
    const [endH, endM] = (dayRule.endTime || '17:00').split(':').map(Number);

    const shiftStartMins = startH * 60 + startM;
    const shiftEndMins = endH * 60 + endM;

    let breakStartMins: number | null = null;
    let breakEndMins: number | null = null;
    if (dayRule.breakStartTime && dayRule.breakEndTime) {
      const [bStartH, bStartM] = dayRule.breakStartTime.split(':').map(Number);
      const [bEndH, bEndM] = dayRule.breakEndTime.split(':').map(Number);
      breakStartMins = bStartH * 60 + bStartM;
      breakEndMins = bEndH * 60 + bEndM;
    }

    // Add Break Block if configured
    if (breakStartMins !== null && breakEndMins !== null && breakEndMins > breakStartMins) {
      const breakStartHour = breakStartMins / 60;
      const breakDuration = (breakEndMins - breakStartMins) / 60;
      result.push({
        id: `break-${dateIso}`,
        date: dateIso,
        startTime: dayRule.breakStartTime!,
        endTime: dayRule.breakEndTime!,
        startHour: breakStartHour,
        durationHours: breakDuration,
        location: 'Break Window',
        type: 'break',
        status: 'break',
        title: 'Break',
      });
    }

    // Derive available slots
    let currMins = shiftStartMins;
    let slotIndex = 0;
    while (currMins + slotDurMins <= shiftEndMins) {
      const slotStartMins = currMins;
      const slotEndMins = currMins + slotDurMins;

      // Check if slot falls inside break window
      const isBreak =
        breakStartMins !== null &&
        breakEndMins !== null &&
        slotStartMins < breakEndMins &&
        slotEndMins > breakStartMins;

      if (!isBreak) {
        const startHStr = String(Math.floor(slotStartMins / 60)).padStart(2, '0');
        const startMStr = String(slotStartMins % 60).padStart(2, '0');
        const endHStr = String(Math.floor(slotEndMins / 60)).padStart(2, '0');
        const endMStr = String(slotEndMins % 60).padStart(2, '0');

        const startTimeStr = `${startHStr}:${startMStr}`;
        const endTimeStr = `${endHStr}:${endMStr}`;

        // Check if an appointment or hold exists at this time window
        const matchingAppt = dateAppointments.find((appt) => appt.startTime === startTimeStr);

        if (matchingAppt) {
          result.push(matchingAppt);
        } else {
          result.push({
            id: `derived-${dateIso}-${slotIndex}`,
            date: dateIso,
            startTime: startTimeStr,
            endTime: endTimeStr,
            startHour: slotStartMins / 60,
            durationHours: slotDurMins / 60,
            location: 'Telehealth',
            type: 'available',
            status: 'available',
            title: 'Available Slot',
          });
        }
      }

      slotIndex++;
      currMins = slotEndMins + bufferDurMins;
    }

    // Add any appointments that fell outside derived windows
    for (const appt of dateAppointments) {
      if (!result.some((r) => r.id === appt.id)) {
        result.push(appt);
      }
    }

    return result;
  };

  const getStatusStyles = (status?: string) => {
    const rawStatus = (status || 'scheduled').toLowerCase();
    switch (rawStatus) {
      case 'completed':
        return {
          card: 'bg-[#f0fdf4] border-l-4 border-l-emerald-600 border border-emerald-200 text-emerald-900 hover:shadow-md',
          badge: 'bg-emerald-600 text-white',
          text: 'text-emerald-700',
          titleText: 'text-emerald-950',
          label: 'COMPLETED',
        };
      case 'no_show':
        return {
          card: 'bg-[#fffbeb] border-l-4 border-l-amber-500 border border-amber-200 text-amber-900 hover:shadow-md',
          badge: 'bg-amber-500 text-white',
          text: 'text-amber-700',
          titleText: 'text-amber-950',
          label: 'NO-SHOW',
        };
      case 'cancelled':
        return {
          card: 'bg-[#fef2f2] border-l-4 border-l-rose-500 border border-rose-200 text-rose-900 opacity-80 hover:shadow-md',
          badge: 'bg-rose-500 text-white',
          text: 'text-rose-700',
          titleText: 'text-rose-950 line-through',
          label: 'CANCELLED',
        };
      case 'held':
        return {
          card: 'bg-[#f3e8ff] border-l-4 border-l-purple-600 border border-purple-200 text-purple-900 hover:shadow-md',
          badge: 'bg-purple-600 text-white',
          text: 'text-purple-700',
          titleText: 'text-purple-950',
          label: 'HELD',
        };
      case 'break':
        return {
          card: 'bg-[#f1f5f9] border-l-4 border-l-slate-400 border border-slate-300 text-slate-700',
          badge: 'bg-slate-500 text-white',
          text: 'text-slate-600',
          titleText: 'text-slate-800 font-bold',
          label: 'BREAK',
        };
      case 'available':
        return {
          card: 'bg-[#f0fdfa] border-l-4 border-l-[#0d9488] border border-[#ccfbf1] text-[#0f766e] hover:shadow-md',
          badge: 'bg-[#0d9488] text-white',
          text: 'text-[#0d9488]',
          titleText: 'text-[#0f766e]',
          label: 'AVAILABLE',
        };
      case 'scheduled':
      case 'confirmed':
      default:
        return {
          card: 'bg-[#eff6ff] border-l-4 border-l-[#0052cc] border border-[#bfdbfe] text-[#1e40af] hover:shadow-md',
          badge: 'bg-[#0052cc] text-white',
          text: 'text-[#0052cc]',
          titleText: 'text-[#1e40af]',
          label: 'SCHEDULED',
        };
    }
  };

  const handleUpdateBlockStatus = async (
    blockId: string,
    newStatus: 'scheduled' | 'completed' | 'no_show' | 'cancelled',
  ) => {
    if (selectedBlock && selectedBlock.id === blockId) {
      setSelectedBlock((prev) => (prev ? { ...prev, status: newStatus } : null));
    }

    const backendStatusMap: Record<string, string> = {
      scheduled: 'SCHEDULED',
      completed: 'COMPLETED',
      no_show: 'NO_SHOW',
      cancelled: 'CANCELLED',
    };
    const mappedStatus = (backendStatusMap[newStatus] ||
      'SCHEDULED') as import('@/features/patient/types/patient.types').AppointmentStatus;
    try {
      await updateStatus({ appointmentId: blockId, status: mappedStatus });
    } catch {
      // Fallback
    }
  };

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

  const formatHourLabel = (hour: number) => {
    if (hour === 12) return '12 PM';
    if (hour > 12) return `${hour - 12} PM`;
    return `${hour} AM`;
  };

  return (
    <div className="bg-white rounded-2xl border border-[#c3c6d6]/40 shadow-xs flex flex-col w-full overflow-hidden text-left">
      {/* Calendar Header Bar */}
      <div className="p-4 md:p-6 border-b border-[#c3c6d6]/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#f8f9fb]">
        {/* Left: Date Navigation Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-white border border-[#c3c6d6]/60 p-1.5 rounded-2xl shadow-2xs">
            <button
              type="button"
              onClick={handlePrev}
              className="p-1.5 text-[#434654] hover:bg-[#f8f9fb] hover:text-[#0052cc] rounded-xl transition-colors cursor-pointer"
              title="Previous"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1.5 bg-[#f8f9fb] px-3 py-1.5 rounded-xl border border-[#c3c6d6]/30">
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

            <button
              type="button"
              onClick={handleNext}
              className="p-1.5 text-[#434654] hover:bg-[#f8f9fb] hover:text-[#0052cc] rounded-xl transition-colors cursor-pointer"
              title="Next"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <span className="text-xs font-bold text-[#191c1e] bg-white border border-[#c3c6d6]/50 px-3 py-2 rounded-xl shadow-2xs whitespace-nowrap">
            {viewMode === 'week' ? weekRangeString : currentDate.toDateString()}
          </span>

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

        {/* Right: View Mode Toggle */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
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
        </div>
      </div>

      {/* Main View Area: Week View */}
      {viewMode === 'week' && (
        <div className="flex-1 flex flex-col overflow-x-auto">
          <div
            ref={weekScrollRef}
            className="relative min-w-[750px] h-[calc(100vh-160px)] min-h-[660px] overflow-y-auto"
          >
            {/* Days Header Row */}
            <div className="flex border-b border-[#c3c6d6]/40 bg-[#f8f9fb] sticky top-0 z-30 shadow-2xs">
              <div className="w-16 shrink-0 border-r border-[#c3c6d6]/40 p-2.5 text-center text-[10px] font-extrabold text-[#737685] uppercase tracking-wider flex items-center justify-center">
                Time
              </div>

              {weekDays.map((day) => (
                <div
                  key={day.iso}
                  className={`flex-1 border-r border-[#c3c6d6]/40 p-2 text-center transition-colors ${
                    day.isToday ? 'bg-[#e6f0ff]/40' : day.isWeekend ? 'bg-[#f1f3f6]/60' : ''
                  }`}
                >
                  <div
                    className={`text-[10px] uppercase font-extrabold tracking-wider mb-1 ${
                      day.isToday ? 'text-[#0052cc]' : 'text-[#51606f]'
                    }`}
                  >
                    {day.name}
                  </div>
                  {day.isToday ? (
                    <div className="w-8 h-8 rounded-full bg-[#0052cc] text-white text-sm font-heading font-extrabold flex items-center justify-center mx-auto shadow-sm">
                      {day.dateNum}
                    </div>
                  ) : (
                    <div className="text-base font-heading font-extrabold text-[#191c1e]">
                      {day.dateNum}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Time Grid Relative Container */}
            <div className="relative">
              {showTimeLine && (
                <div
                  className="absolute left-16 right-0 z-20 pointer-events-none flex items-center"
                  style={{ top: `${timeLineTopPx}px` }}
                >
                  <div className="w-3.5 h-3.5 rounded-full bg-rose-600 -ml-1.75 shadow-md flex items-center justify-center ring-4 ring-rose-100 shrink-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                  </div>
                  <div className="h-0.5 flex-1 bg-rose-500 shadow-xs"></div>
                  <span className="px-2.5 py-0.5 bg-rose-600 text-white text-[9px] font-extrabold rounded-md shadow-xs mr-2 uppercase tracking-wider shrink-0">
                    NOW{' '}
                    {nowTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                  </span>
                </div>
              )}

              <div className="flex">
                {/* Y-Axis Time Labels Column */}
                <div className="w-16 shrink-0 border-r border-[#c3c6d6]/40 bg-[#f8f9fb]/50 flex flex-col z-10 select-none">
                  {HOURS.map((hour) => (
                    <div
                      key={hour}
                      className="h-[64px] border-b border-[#c3c6d6]/60 pr-2 pt-1 text-right relative"
                    >
                      <span className="text-[10px] font-bold text-[#51606f]">
                        {formatHourLabel(hour)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* 7 Day Columns Grid */}
                <div className="flex-1 flex relative">
                  {weekDays.map((day) => {
                    const dayBlocks = getBlocksForDate(day.iso, day.dateObj);

                    return (
                      <div
                        key={day.iso}
                        className="flex-1 border-r border-[#c3c6d6]/40 relative min-h-[1088px] flex flex-col bg-white"
                      >
                        {/* Background Hour Grid Lines */}
                        {HOURS.map((hour) => (
                          <div
                            key={hour}
                            className="h-[64px] border-b border-[#c3c6d6]/50 relative select-none"
                          >
                            <div className="absolute top-8 left-0 right-0 border-b border-dashed border-[#c3c6d6]/30 pointer-events-none" />
                          </div>
                        ))}

                        {/* Overlay Calendar Blocks */}
                        {dayBlocks.map((block: AvailabilityBlock) => {
                          const topOffset = (block.startHour - START_HOUR) * 64;
                          const heightPx = block.durationHours * 64;
                          const st = getStatusStyles(block.status);

                          return (
                            <div
                              key={block.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedBlock(block);
                              }}
                              style={{ top: `${topOffset}px`, height: `${heightPx}px` }}
                              className={`absolute left-1 right-1 rounded-xl p-2.5 shadow-2xs flex flex-col justify-between z-10 transition-all cursor-pointer ${st.card}`}
                            >
                              <div className="flex justify-between items-start gap-1">
                                <span
                                  className={`px-1.5 py-0.5 text-[9px] font-extrabold rounded uppercase tracking-wider ${st.badge}`}
                                >
                                  {st.label}
                                </span>
                                <span className={`text-[10px] font-bold ${st.text}`}>
                                  {block.startTime} – {block.endTime}
                                </span>
                              </div>
                              <div>
                                <p className={`text-xs font-bold truncate ${st.titleText}`}>
                                  {block.patientName || block.title || 'Derived Slot'}
                                </p>
                              </div>
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
                Detailed daily view of derived availability and scheduled patient appointments.
              </p>
            </div>
          </div>

          <div
            ref={dayScrollRef}
            className="relative border border-[#c3c6d6]/40 rounded-2xl overflow-hidden bg-white h-[calc(100vh-160px)] min-h-[660px] overflow-y-auto shadow-2xs"
          >
            {showTimeLine && formatDateISO(currentDate) === formatDateISO(nowTime) && (
              <div
                className="absolute left-16 right-0 z-20 pointer-events-none flex items-center"
                style={{ top: `${timeLineTopPx}px` }}
              >
                <div className="w-3 h-3 rounded-full bg-rose-600 -ml-1.5 shadow-md flex items-center justify-center ring-4 ring-rose-100 shrink-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                </div>
                <div className="h-0.5 flex-1 bg-rose-500 shadow-xs"></div>
                <span className="px-2 py-0.5 bg-rose-600 text-white text-[9px] font-extrabold rounded-md shadow-xs mr-2 uppercase tracking-wider shrink-0">
                  NOW {nowTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                </span>
              </div>
            )}

            <div className="flex">
              <div className="w-16 shrink-0 border-r border-[#c3c6d6]/40 bg-[#f8f9fb]/50 flex flex-col z-10">
                {HOURS.map((hour) => (
                  <div
                    key={hour}
                    className="h-[64px] border-b border-[#c3c6d6]/60 pr-2 pt-1 text-right relative"
                  >
                    <span className="text-[10px] font-bold text-[#51606f]">
                      {formatHourLabel(hour)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex-1 relative min-h-[1088px] flex flex-col">
                {HOURS.map((hour) => (
                  <div
                    key={hour}
                    className="h-[64px] border-b border-[#c3c6d6]/50 relative select-none"
                  >
                    <div className="absolute top-8 left-0 right-0 border-b border-dashed border-[#c3c6d6]/30 pointer-events-none" />
                  </div>
                ))}

                {getBlocksForDate(formatDateISO(currentDate), currentDate).map(
                  (block: AvailabilityBlock) => {
                    const topOffset = (block.startHour - START_HOUR) * 64;
                    const heightPx = block.durationHours * 64;
                    const st = getStatusStyles(block.status);

                    return (
                      <div
                        key={block.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedBlock(block);
                        }}
                        style={{ top: `${topOffset}px`, height: `${heightPx}px` }}
                        className={`absolute left-2 right-2 rounded-xl p-3 shadow-2xs flex flex-col justify-between z-10 transition-all cursor-pointer ${st.card}`}
                      >
                        <div className="flex justify-between items-start gap-1">
                          <span
                            className={`px-2 py-0.5 text-[10px] font-extrabold rounded uppercase tracking-wider ${st.badge}`}
                          >
                            {st.label}
                          </span>
                          <span className={`text-xs font-bold ${st.text}`}>
                            {block.startTime} – {block.endTime}
                          </span>
                        </div>
                        <div>
                          <p className={`text-sm font-bold truncate ${st.titleText}`}>
                            {block.patientName || block.title || 'Derived Slot'}
                          </p>
                        </div>
                      </div>
                    );
                  },
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Month View Mode */}
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
              const dayBlocks = getBlocksForDate(iso, cellDate);

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
                      className={`text-xs font-bold ${
                        cellDate.toDateString() === new Date().toDateString()
                          ? 'bg-[#0052cc] text-white w-5 h-5 rounded-full flex items-center justify-center'
                          : 'text-[#191c1e]'
                      }`}
                    >
                      {cellDate.getDate()}
                    </span>
                    {dayBlocks.length > 0 && (
                      <span className="w-2 h-2 rounded-full bg-[#0052cc]"></span>
                    )}
                  </div>

                  <div className="space-y-1">
                    {dayBlocks.slice(0, 2).map((b: AvailabilityBlock) => {
                      const st = getStatusStyles(b.status);
                      return (
                        <div
                          key={b.id}
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded truncate ${st.badge}`}
                        >
                          {b.startTime} - {b.endTime}
                        </div>
                      );
                    })}
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

      {/* Appointment / Slot Detail & Status Management Modal */}
      {selectedBlock && (
        <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[420px] max-h-[90vh] overflow-y-auto flex flex-col my-auto">
            <div className="p-5 border-b border-[#c3c6d6]/30 flex justify-between items-center bg-[#f8f9fb]">
              <h3 className="font-bold text-base text-[#191c1e]">
                {selectedBlock.type === 'booked'
                  ? 'Appointment Details'
                  : selectedBlock.type === 'break'
                    ? 'Break Period'
                    : 'Derived Availability Window'}
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
                    ? selectedBlock.patientName || 'Patient Session'
                    : selectedBlock.type === 'break'
                      ? 'Lunch / Break Window'
                      : 'Derived Available Slot'}
                </p>
                <p className="mt-1">
                  📅 <strong className="text-[#191c1e]">{selectedBlock.date}</strong> (
                  {selectedBlock.startTime} – {selectedBlock.endTime})
                </p>
              </div>

              {selectedBlock.type === 'booked' ? (
                <div className="pt-2 border-t border-[#c3c6d6]/30 space-y-2">
                  <p className="font-bold text-[#191c1e]">Update Appointment Status:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      {
                        key: 'scheduled',
                        label: 'Scheduled',
                        activeColor: 'bg-[#0052cc] text-white',
                        icon: <Clock className="w-3.5 h-3.5" />,
                      },
                      {
                        key: 'completed',
                        label: 'Completed',
                        activeColor: 'bg-emerald-600 text-white',
                        icon: <Check className="w-3.5 h-3.5" />,
                      },
                      {
                        key: 'no_show',
                        label: 'No Show',
                        activeColor: 'bg-amber-500 text-white',
                        icon: <AlertTriangle className="w-3.5 h-3.5" />,
                      },
                      {
                        key: 'cancelled',
                        label: 'Cancelled',
                        activeColor: 'bg-rose-500 text-white',
                        icon: <XCircle className="w-3.5 h-3.5" />,
                      },
                    ].map((st) => {
                      const isActive = (selectedBlock.status || 'scheduled') === st.key;
                      return (
                        <button
                          key={st.key}
                          type="button"
                          onClick={() =>
                            handleUpdateBlockStatus(
                              selectedBlock.id,
                              st.key as 'scheduled' | 'completed' | 'no_show' | 'cancelled',
                            )
                          }
                          className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-between border ${
                            isActive
                              ? `${st.activeColor} border-transparent shadow-2xs`
                              : 'bg-white border-[#c3c6d6]/60 text-[#434654] hover:bg-slate-50'
                          }`}
                        >
                          <span className="flex items-center gap-1.5">
                            {st.icon}
                            {st.label}
                          </span>
                          {isActive && <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : selectedBlock.type === 'break' ? (
                <div className="p-3 bg-slate-100 rounded-xl border border-slate-200 text-slate-700">
                  <p className="font-bold mb-1">Break Window Configured in Shift Rules</p>
                  <p>
                    Therapist non-working intermission period. No appointments are derived during
                    this interval.
                  </p>
                </div>
              ) : (
                <div className="p-3 bg-teal-50 rounded-xl border border-teal-200 text-teal-800">
                  <p className="font-bold mb-1">Derived Available Slot</p>
                  <p>
                    This slot is calculated dynamically from Weekly Shift Rules. Patients can view
                    and book this window.
                  </p>
                </div>
              )}

              <div className="pt-4 border-t border-[#c3c6d6]/30 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedBlock(null)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-[#191c1e] font-bold rounded-xl cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeeklyAvailabilityCalendar;
