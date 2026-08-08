import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  Calendar as CalendarIcon,
  Sparkles,
  Trash2,
  RotateCcw,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { CustomSelect } from '@/components/ui/CustomSelect';
import {
  AppointmentTypeEnum,
  RepeatTypeEnum,
  RepeatFrequencyEnum,
  APPOINTMENT_TYPE_OPTIONS,
  REPEAT_TYPE_OPTIONS,
  REPEAT_FREQUENCY_OPTIONS,
} from '../types/enums';
import { useNow } from '@/hooks/useNow';
import { useAuthStore } from '@/stores/authStore';
import { useTherapistCalendar } from '../hooks/useTherapistCalendar';
import {
  validatePastTimeSlot,
  validateTimeRange,
  validateSlotOverlap,
  validateShiftWindowBounds,
} from '../utils/calendarValidation';

export interface AvailabilityBlock {
  id: string;
  date: string; // "YYYY-MM-DD"
  startTime: string; // "09:00"
  endTime: string; // "12:00"
  startHour: number; // 9
  durationHours: number; // 3
  location: string;
  type: 'available' | 'booked';
  status?: 'scheduled' | 'completed' | 'no_show' | 'cancelled';
  title?: string;
  services?: string[];
  patientName?: string;
  isRecurring?: boolean;
  appointmentType?: string;
  repeatType?: string;
  repeatFrequency?: string;
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

export const WeeklyAvailabilityCalendar: React.FC<{
  initialView?: 'day' | 'week' | 'month';
  therapistId?: string;
}> = ({ initialView, therapistId: therapistIdProp }) => {
  const user = useAuthStore((state) => state.user);
  const therapistId = therapistIdProp || user?.id || 'therapist-doc-1';

  const {
    appointmentBlocks,
    customSlotBlocks,
    scheduleConfig,
    updateStatus,
    createAvailabilitySlot,
    deleteAvailabilitySlot,
  } = useTherapistCalendar(therapistId);

  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>(initialView ?? 'week');
  const [localBlocks, setLocalBlocks] = useState<AvailabilityBlock[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedBlock, setSelectedBlock] = useState<AvailabilityBlock | null>(null);

  // Combine API appointment blocks, custom availability slots from DB, and local blocks (deduplicating by unique ID)
  const blocks: AvailabilityBlock[] = React.useMemo(() => {
    const combined = [...appointmentBlocks, ...(customSlotBlocks || []), ...localBlocks];
    const seenIds = new Set<string>();
    const result: AvailabilityBlock[] = [];
    for (const block of combined) {
      if (!seenIds.has(block.id)) {
        seenIds.add(block.id);
        result.push(block);
      }
    }
    return result;
  }, [appointmentBlocks, customSlotBlocks, localBlocks]);

  // Real-time Live Clock Hook (precision minute boundary timer)
  const nowTime = useNow();
  const weekScrollRef = useRef<HTMLDivElement>(null);
  const dayScrollRef = useRef<HTMLDivElement>(null);

  // Modal Form State
  const [modalDate, setModalDate] = useState<string>(formatDateISO(new Date()));
  const [modalStartTime, setModalStartTime] = useState<string>('09:00');
  const [modalEndTime, setModalEndTime] = useState<string>('10:00');
  const [appointmentType, setAppointmentType] = useState<string>(AppointmentTypeEnum.FOLLOW_UP);
  const [isRecurring, setIsRecurring] = useState<boolean>(true);
  const [repeatType, setRepeatType] = useState<string>(RepeatTypeEnum.WEEKLY);
  const [repeatFrequency, setRepeatFrequency] = useState<string>(RepeatFrequencyEnum.EVERY_1_WEEK);

  // Interactive Drag Selection State
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragDateIso, setDragDateIso] = useState<string | null>(null);
  const [dragStartHour, setDragStartHour] = useState<number | null>(null);
  const [dragCurrentHour, setDragCurrentHour] = useState<number | null>(null);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewMode, currentDate]);

  // Validation & modal state
  const [modalError, setModalError] = useState<string | null>(null);

  const isPastTimeSlot = (dateIso: string, hour: number): boolean => {
    const [y, m, d] = dateIso.split('-').map(Number);
    const slotEnd = new Date(y, m - 1, d, hour + 1, 0, 0, 0);
    return slotEnd <= nowTime;
  };

  const checkIsBlockPast = (blockDateIso: string, endTimeStr: string): boolean => {
    const [y, m, d] = blockDateIso.split('-').map(Number);
    const [endH, endM] = (endTimeStr || '17:00').split(':').map(Number);
    const targetDate = new Date(y, m - 1, d, endH, endM || 0, 0, 0);
    return targetDate <= nowTime;
  };

  const getStatusStyles = (status?: string, isPast?: boolean) => {
    const rawStatus = (status || (isPast ? 'completed' : 'scheduled')).toLowerCase();
    switch (rawStatus) {
      case 'completed':
        return {
          card: 'bg-[#f0fdf4] border-l-4 border-l-emerald-600 border border-emerald-200 text-emerald-900 hover:shadow-md',
          badge: 'bg-emerald-600 text-white',
          text: 'text-emerald-700',
          titleText: 'text-emerald-950',
          label: 'Completed',
        };
      case 'no_show':
        return {
          card: 'bg-[#fffbeb] border-l-4 border-l-amber-500 border border-amber-200 text-amber-900 hover:shadow-md',
          badge: 'bg-amber-500 text-white',
          text: 'text-amber-700',
          titleText: 'text-amber-950',
          label: 'No Show',
        };
      case 'cancelled':
        return {
          card: 'bg-[#fef2f2] border-l-4 border-l-rose-500 border border-rose-200 text-rose-900 opacity-80 hover:shadow-md',
          badge: 'bg-rose-500 text-white',
          text: 'text-rose-700',
          titleText: 'text-rose-950 line-through',
          label: 'Cancelled',
        };
      case 'scheduled':
      case 'confirmed':
      case 'held':
      default:
        return {
          card: 'bg-[#eff6ff] border-l-4 border-l-[#0052cc] border border-[#bfdbfe] text-[#1e40af] hover:shadow-md',
          badge: 'bg-[#0052cc] text-white',
          text: 'text-[#0052cc]',
          titleText: 'text-[#1e40af]',
          label: rawStatus === 'confirmed' ? 'Confirmed' : 'Scheduled',
        };
    }
  };

  const handleUpdateBlockStatus = async (
    blockId: string,
    newStatus: 'scheduled' | 'completed' | 'no_show' | 'cancelled',
  ) => {
    setLocalBlocks((prev) => prev.map((b) => (b.id === blockId ? { ...b, status: newStatus } : b)));
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

  const handleOpenModal = (
    targetDateIso?: string,
    defaultStartHour = 9,
    defaultEndHour?: number,
  ) => {
    const targetIso = targetDateIso || formatDateISO(currentDate);
    const startH = defaultStartHour;
    const endH = defaultEndHour !== undefined ? defaultEndHour : defaultStartHour + 1;
    const startStr = `${startH.toString().padStart(2, '0')}:00`;
    const endStr = `${endH.toString().padStart(2, '0')}:00`;

    setModalDate(targetIso);
    setModalStartTime(startStr);
    setModalEndTime(endStr);

    if (isPastTimeSlot(targetIso, defaultStartHour)) {
      setModalError('Cannot create availability or book slots in the past.');
    } else {
      setModalError(null);
    }

    setIsModalOpen(true);
  };

  const handleMouseDown = (dateIso: string, hour: number) => {
    setIsDragging(true);
    setDragDateIso(dateIso);
    setDragStartHour(hour);
    setDragCurrentHour(hour);
  };

  const handleMouseEnter = (dateIso: string, hour: number) => {
    if (isDragging && dragDateIso === dateIso) {
      setDragCurrentHour(hour);
    }
  };

  const handleMouseUp = () => {
    if (isDragging && dragDateIso && dragStartHour !== null && dragCurrentHour !== null) {
      const minH = Math.min(dragStartHour, dragCurrentHour);
      const maxH = Math.max(dragStartHour, dragCurrentHour);
      const startH = minH;
      const endH = maxH + 1;
      handleOpenModal(dragDateIso, startH, endH);
    }
    setIsDragging(false);
    setDragDateIso(null);
    setDragStartHour(null);
    setDragCurrentHour(null);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDragging, dragDateIso, dragStartHour, dragCurrentHour]);

  const handleSaveAvailability = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError(null);

    // 1. Past slot check
    const pastCheck = validatePastTimeSlot(modalDate, modalStartTime, nowTime);
    if (!pastCheck.isValid) {
      setModalError(pastCheck.error || 'Cannot create availability or book slots in the past.');
      return;
    }

    // 2. Time range check
    const rangeCheck = validateTimeRange(modalStartTime, modalEndTime, 15);
    if (!rangeCheck.isValid) {
      setModalError(rangeCheck.error || 'End time must be after start time.');
      return;
    }

    // 3. Shift window bounds check
    const shiftCheck = validateShiftWindowBounds(
      modalDate,
      modalStartTime,
      modalEndTime,
      scheduleConfig?.weeklyRules,
    );
    if (!shiftCheck.isValid) {
      setModalError(shiftCheck.error || 'Slot falls outside defined shift hours.');
      return;
    }

    // 4. Overlap check
    const overlapCheck = validateSlotOverlap(
      { date: modalDate, startTime: modalStartTime, endTime: modalEndTime },
      blocks,
    );
    if (!overlapCheck.isValid) {
      setModalError(overlapCheck.error || 'Time slot overlaps with an existing slot.');
      return;
    }

    const [startH] = modalStartTime.split(':').map((n) => parseInt(n, 10) || 0);
    const [endH] = modalEndTime.split(':').map((n) => parseInt(n, 10) || 0);
    const duration = Math.max(0.5, endH - startH);

    const newBlock: AvailabilityBlock = {
      id: Date.now().toString(),
      date: modalDate,
      startTime: modalStartTime,
      endTime: modalEndTime,
      startHour: startH,
      durationHours: duration,
      location: 'Available',
      type: 'available',
      isRecurring,
      appointmentType,
      repeatType: isRecurring ? repeatType : undefined,
      repeatFrequency: isRecurring ? repeatFrequency : undefined,
    };

    setLocalBlocks((prev: AvailabilityBlock[]) => [...prev, newBlock]);

    // Persist custom date availability slot to backend API
    try {
      await createAvailabilitySlot({
        date: modalDate,
        startTime: modalStartTime,
        endTime: modalEndTime,
        appointmentType,
        isRecurring,
        repeatType: isRecurring ? repeatType : undefined,
        repeatFrequency: isRecurring ? repeatFrequency : undefined,
      });
    } catch {
      // Fallback local state update
    }

    setIsModalOpen(false);
  };

  const handleDeleteBlock = async (blockId: string) => {
    setLocalBlocks((prev: AvailabilityBlock[]) =>
      prev.filter((b: AvailabilityBlock) => b.id !== blockId),
    );
    setSelectedBlock(null);
    try {
      await deleteAvailabilitySlot(blockId);
    } catch {
      // Fallback local state deletion
    }
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
          {/* Scrollable Time Grid Body (Contains Sticky Header & Grid for 100% Alignment) */}
          <div
            ref={weekScrollRef}
            className="relative min-w-[750px] h-[calc(100vh-160px)] min-h-[660px] overflow-y-auto"
          >
            {/* Days Header Row (Mon-Sun) - Sticky Inside Scroll Container */}
            <div className="flex border-b border-[#c3c6d6]/40 bg-[#f8f9fb] sticky top-0 z-30 shadow-2xs">
              {/* Time Offset Column Header */}
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
              {/* Current Time Indicator Red Line */}
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
                        className="flex-1 border-r border-[#c3c6d6]/40 relative min-h-[1088px] flex flex-col"
                      >
                        {/* Hourly Interactive Rows with Visible Border Lines */}
                        {HOURS.map((hour) => {
                          const isPast = isPastTimeSlot(day.iso, hour);
                          return (
                            <div
                              key={hour}
                              onMouseDown={() => handleMouseDown(day.iso, hour)}
                              onMouseEnter={() => handleMouseEnter(day.iso, hour)}
                              onMouseUp={handleMouseUp}
                              className={`h-[64px] border-b border-[#c3c6d6]/50 relative group/hour transition-colors select-none cursor-pointer ${
                                isPast
                                  ? 'bg-slate-100/30 opacity-70 hover:bg-rose-50/40'
                                  : 'hover:bg-[#0052cc]/[0.06]'
                              }`}
                            >
                              {/* Half-Hour Dashed Divider Line */}
                              <div className="absolute top-8 left-0 right-0 border-b border-dashed border-[#c3c6d6]/30 pointer-events-none" />

                              {/* Hover "+" icon hint */}
                              {!isDragging && (
                                <div className="absolute inset-0 opacity-0 group-hover/hour:opacity-100 flex items-center justify-center pointer-events-none z-0 transition-all">
                                  <span
                                    className={`w-8 h-8 rounded-full text-white shadow-md flex items-center justify-center transition-transform transform scale-90 group-hover/hour:scale-105 ${
                                      isPast ? 'bg-slate-400' : 'bg-[#0052cc] hover:bg-[#0041a3]'
                                    }`}
                                  >
                                    <Plus className="w-4 h-4" />
                                  </span>
                                </div>
                              )}
                            </div>
                          );
                        })}

                        {/* Active Drag Selection Overlay Box */}
                        {isDragging &&
                          dragDateIso === day.iso &&
                          dragStartHour !== null &&
                          dragCurrentHour !== null && (
                            <div
                              style={{
                                top: `${(Math.min(dragStartHour, dragCurrentHour) - START_HOUR) * 64}px`,
                                height: `${(Math.abs(dragCurrentHour - dragStartHour) + 1) * 64}px`,
                              }}
                              className="absolute left-1 right-1 bg-[#0052cc]/20 border-2 border-[#0052cc] rounded-xl z-20 pointer-events-none flex items-center justify-center shadow-md transition-all"
                            >
                              <span className="w-8 h-8 rounded-full bg-[#0052cc] text-white shadow-md flex items-center justify-center">
                                <Plus className="w-4 h-4" />
                              </span>
                            </div>
                          )}

                        {/* Render Overlay Blocks */}
                        {dayBlocks.map((block: AvailabilityBlock) => {
                          const topOffset = (block.startHour - START_HOUR) * 64;
                          const heightPx = block.durationHours * 64;
                          const isPast = checkIsBlockPast(block.date, block.endTime);

                          if (block.type === 'booked') {
                            const st = getStatusStyles(block.status, isPast);
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
                                    {block.patientName}
                                  </p>
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
                              className={`absolute left-1 right-1 rounded-xl p-2.5 shadow-2xs flex flex-col justify-between z-10 transition-all cursor-pointer ${
                                isPast
                                  ? 'bg-slate-100/80 border-l-4 border-l-slate-400 border border-slate-300 border-dashed text-slate-500 opacity-60'
                                  : 'bg-[#f0fdfa] border-l-4 border-l-[#0d9488] border border-[#ccfbf1] text-[#0f766e] hover:border-[#0d9488] hover:shadow-md'
                              }`}
                            >
                              <div>
                                <div className="flex justify-between items-start mb-1 gap-1">
                                  <span
                                    className={`text-[11px] font-bold flex items-center gap-1 ${
                                      isPast ? 'text-slate-500' : 'text-[#0d9488]'
                                    }`}
                                  >
                                    <span
                                      className={`w-2 h-2 rounded-full ${
                                        isPast ? 'bg-slate-400' : 'bg-[#0d9488]'
                                      }`}
                                    ></span>{' '}
                                    {isPast ? 'Expired' : 'Available'}
                                  </span>
                                  <span
                                    className={`text-[10px] font-bold ${
                                      isPast ? 'text-slate-400 line-through' : 'text-[#505f76]'
                                    }`}
                                  >
                                    {block.startTime} – {block.endTime}
                                  </span>
                                </div>
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
                Drag across time rows or click any slot to add availability.
              </p>
            </div>
            <button
              onClick={() => handleOpenModal(formatDateISO(currentDate), 9)}
              className="bg-[#0052cc] text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-[#003d9b] transition-colors cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" /> Add Slot
            </button>
          </div>

          {/* Scrollable Day Timeline Grid */}
          <div
            ref={dayScrollRef}
            className="relative border border-[#c3c6d6]/40 rounded-2xl overflow-hidden bg-white h-[calc(100vh-160px)] min-h-[660px] overflow-y-auto shadow-2xs"
          >
            {/* Current Time Indicator Red Line for Day View */}
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
              {/* Y-Axis Time Labels Column */}
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

              {/* Single Day Column */}
              <div className="flex-1 relative min-h-[1088px] flex flex-col">
                {/* Hourly Interactive Rows */}
                {HOURS.map((hour) => {
                  const dateIso = formatDateISO(currentDate);
                  const isPast = isPastTimeSlot(dateIso, hour);
                  return (
                    <div
                      key={hour}
                      onMouseDown={() => handleMouseDown(dateIso, hour)}
                      onMouseEnter={() => handleMouseEnter(dateIso, hour)}
                      onMouseUp={handleMouseUp}
                      className={`h-[64px] border-b border-[#c3c6d6]/50 relative group/dayhour transition-colors select-none cursor-pointer ${
                        isPast
                          ? 'bg-slate-100/30 opacity-70 hover:bg-rose-50/40'
                          : 'hover:bg-[#0052cc]/[0.06]'
                      }`}
                    >
                      {/* Half-Hour Dashed Divider Line */}
                      <div className="absolute top-8 left-0 right-0 border-b border-dashed border-[#c3c6d6]/30 pointer-events-none" />

                      {/* Hover "+" icon button */}
                      {!isDragging && (
                        <div className="absolute inset-0 opacity-0 group-hover/dayhour:opacity-100 flex items-center justify-center pointer-events-none z-0 transition-all">
                          <span
                            className={`w-8 h-8 rounded-full text-white shadow-md flex items-center justify-center transition-transform transform scale-90 group-hover/dayhour:scale-105 ${
                              isPast ? 'bg-slate-400' : 'bg-[#0052cc] hover:bg-[#0041a3]'
                            }`}
                          >
                            <Plus className="w-4 h-4" />
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Active Drag Selection Overlay Box */}
                {isDragging &&
                  dragDateIso === formatDateISO(currentDate) &&
                  dragStartHour !== null &&
                  dragCurrentHour !== null && (
                    <div
                      style={{
                        top: `${(Math.min(dragStartHour, dragCurrentHour) - START_HOUR) * 64}px`,
                        height: `${(Math.abs(dragCurrentHour - dragStartHour) + 1) * 64}px`,
                      }}
                      className="absolute left-1 right-1 bg-[#0052cc]/20 border-2 border-[#0052cc] rounded-xl z-20 pointer-events-none flex items-center justify-center shadow-md transition-all"
                    >
                      <span className="w-8 h-8 rounded-full bg-[#0052cc] text-white shadow-md flex items-center justify-center">
                        <Plus className="w-4 h-4" />
                      </span>
                    </div>
                  )}

                {/* Render Day Blocks Overlay */}
                {blocks
                  .filter(
                    (b: AvailabilityBlock) =>
                      b.date === formatDateISO(currentDate) ||
                      (b.isRecurring && new Date(b.date).getDay() === currentDate.getDay()),
                  )
                  .map((block: AvailabilityBlock) => {
                    const topOffset = (block.startHour - START_HOUR) * 64;
                    const heightPx = block.durationHours * 64;
                    const isPast = checkIsBlockPast(block.date, block.endTime);

                    if (block.type === 'booked') {
                      const st = getStatusStyles(block.status, isPast);
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
                              {block.patientName}
                            </p>
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
                        className={`absolute left-2 right-2 rounded-xl p-3 shadow-2xs flex flex-col justify-between z-10 transition-all cursor-pointer ${
                          isPast
                            ? 'bg-slate-100/80 border-l-4 border-l-slate-400 border border-slate-300 border-dashed text-slate-500 opacity-60'
                            : 'bg-[#f0fdfa] border-l-4 border-l-[#0d9488] border border-[#ccfbf1] text-[#0f766e] hover:border-[#0d9488] hover:shadow-md'
                        }`}
                      >
                        <div className="flex justify-between items-start gap-1">
                          <span
                            className={`text-xs font-bold flex items-center gap-1.5 ${
                              isPast ? 'text-slate-500' : 'text-[#0d9488]'
                            }`}
                          >
                            <span
                              className={`w-2.5 h-2.5 rounded-full ${
                                isPast ? 'bg-slate-400' : 'bg-[#0d9488]'
                              }`}
                            ></span>{' '}
                            {isPast ? 'Expired Slot' : 'Available Slot'}
                          </span>
                          <span
                            className={`text-xs font-bold ${
                              isPast ? 'text-slate-400 line-through' : 'text-[#434654]'
                            }`}
                          >
                            {block.startTime} – {block.endTime}
                          </span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
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
                        {b.startTime} - {b.endTime}
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
        <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[420px] max-h-[90vh] overflow-y-auto flex flex-col my-auto">
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
                    : 'Open Availability'}
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

              {selectedBlock.type === 'booked' && (
                <div className="pt-2 border-t border-[#c3c6d6]/30 space-y-2">
                  <p className="font-bold text-[#191c1e]">Update Appointment Status:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      {
                        key: 'scheduled',
                        label: 'Scheduled',
                        activeColor: 'bg-[#0052cc] text-white',
                      },
                      {
                        key: 'completed',
                        label: 'Completed',
                        activeColor: 'bg-emerald-600 text-white',
                      },
                      { key: 'no_show', label: 'No Show', activeColor: 'bg-amber-500 text-white' },
                      {
                        key: 'cancelled',
                        label: 'Cancelled',
                        activeColor: 'bg-rose-500 text-white',
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
                          <span>{st.label}</span>
                          {isActive && <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />}
                        </button>
                      );
                    })}
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
        <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[540px] max-h-[90vh] overflow-y-auto flex flex-col my-auto animate-in fade-in zoom-in-95 duration-150">
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
              {/* Modal Validation Error Banner */}
              {modalError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{modalError}</span>
                </div>
              )}

              {/* Date Selector */}
              <div>
                <label className="font-bold text-[#191c1e] mb-1.5 block">Target Date</label>
                <input
                  type="date"
                  value={modalDate}
                  min={formatDateISO(nowTime)}
                  onChange={(e) => {
                    setModalDate(e.target.value);
                    setModalError(null);
                  }}
                  className="w-full bg-[#f8f9fb] border border-[#c3c6d6]/60 rounded-xl px-3 py-2.5 font-semibold text-[#191c1e] focus:outline-none focus:border-[#0052cc]"
                />
              </div>

              {/* Appointment / Session Type */}
              <CustomSelect
                label="Appointment Type"
                required
                value={appointmentType}
                onChange={setAppointmentType}
                options={APPOINTMENT_TYPE_OPTIONS}
              />

              {/* Start & End Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-[#191c1e] mb-1.5 block">Start Time</label>
                  <input
                    type="time"
                    value={modalStartTime}
                    onChange={(e) => {
                      setModalStartTime(e.target.value);
                      setModalError(null);
                    }}
                    className="w-full bg-[#f8f9fb] border border-[#c3c6d6]/60 rounded-xl px-3 py-2.5 font-semibold text-[#191c1e] focus:outline-none focus:border-[#0052cc]"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#191c1e] mb-1.5 block">End Time</label>
                  <input
                    type="time"
                    value={modalEndTime}
                    onChange={(e) => {
                      setModalEndTime(e.target.value);
                      setModalError(null);
                    }}
                    className="w-full bg-[#f8f9fb] border border-[#c3c6d6]/60 rounded-xl px-3 py-2.5 font-semibold text-[#191c1e] focus:outline-none focus:border-[#0052cc]"
                  />
                </div>
              </div>

              {/* Recurrence Section matching reference design */}
              <div className="space-y-3 p-3.5 rounded-xl border border-[#c3c6d6]/40 bg-[#f8f9fb]/60">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isRecurring}
                    onChange={(e) => setIsRecurring(e.target.checked)}
                    className="w-4 h-4 rounded text-[#00a896] focus:ring-[#00a896] accent-[#00a896]"
                  />
                  <span className="font-semibold text-[#191c1e]">
                    This Time Slot Recurs (daily, Weekly or monthly)
                  </span>
                </label>

                {isRecurring && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#c3c6d6]/30">
                    <CustomSelect
                      label="Repeats"
                      required
                      value={repeatType}
                      onChange={setRepeatType}
                      options={REPEAT_TYPE_OPTIONS}
                    />

                    <CustomSelect
                      label="Repeats (Select Frequency)"
                      required
                      value={repeatFrequency}
                      onChange={setRepeatFrequency}
                      options={REPEAT_FREQUENCY_OPTIONS}
                    />
                  </div>
                )}
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
