import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  Plus,
  ArrowRight,
  Video,
  X,
  Sparkles,
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import type { AuthState } from '@/stores/authStore';
import { usePatientAppointments } from '../hooks/usePatientAppointments';
import type { PatientAppointment } from '../types/patient.types';
import { ROUTES } from '@/config/routes';
import { cn } from '@/utils/cn';

interface CalendarDay {
  date: Date;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  dateKey: string;
  appointments: PatientAppointment[];
  holds: PatientAppointment[];
}

const formatDateKey = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

export const PatientScheduleCalendar: React.FC = () => {
  const user = useAuthStore((state: AuthState) => state.user);
  const patientId = user?.id || 'patient-user-1';
  const { data: appointments = [] } = usePatientAppointments(patientId);

  const today = useMemo(() => new Date(), []);
  const [viewDate, setViewDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [activeModalDate, setActiveModalDate] = useState<Date | null>(null);

  const currentYear = viewDate.getFullYear();
  const currentMonth = viewDate.getMonth(); // 0-indexed

  const monthNames = [
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

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Handle Month Navigation
  const handlePrevMonth = () => {
    setViewDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const handleResetToToday = () => {
    const now = new Date();
    setViewDate(now);
    setSelectedDate(now);
    setActiveModalDate(now);
  };

  // Group appointments by dateKey
  const appointmentsByDate = useMemo(() => {
    const map: Record<string, { appointments: PatientAppointment[]; holds: PatientAppointment[] }> =
      {};

    appointments.forEach((appt) => {
      const apptDate = new Date(appt.startTime);
      const key = formatDateKey(apptDate);
      if (!map[key]) {
        map[key] = { appointments: [], holds: [] };
      }
      if (appt.status === 'HELD') {
        map[key].holds.push(appt);
      } else if (appt.status !== 'CANCELLED') {
        map[key].appointments.push(appt);
      }
    });

    return map;
  }, [appointments]);

  // Generate calendar days grid
  const calendarDays = useMemo<CalendarDay[]>(() => {
    const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

    const todayKey = formatDateKey(today);
    const selectedKey = selectedDate ? formatDateKey(selectedDate) : '';

    const days: CalendarDay[] = [];

    // Previous month padding days
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const prevDayNum = daysInPrevMonth - i;
      const date = new Date(currentYear, currentMonth - 1, prevDayNum);
      const key = formatDateKey(date);
      const dayData = appointmentsByDate[key] || { appointments: [], holds: [] };

      days.push({
        date,
        dayNumber: prevDayNum,
        isCurrentMonth: false,
        isToday: key === todayKey,
        isSelected: key === selectedKey,
        dateKey: key,
        appointments: dayData.appointments,
        holds: dayData.holds,
      });
    }

    // Current month days
    for (let dayNum = 1; dayNum <= daysInMonth; dayNum++) {
      const date = new Date(currentYear, currentMonth, dayNum);
      const key = formatDateKey(date);
      const dayData = appointmentsByDate[key] || { appointments: [], holds: [] };

      days.push({
        date,
        dayNumber: dayNum,
        isCurrentMonth: true,
        isToday: key === todayKey,
        isSelected: key === selectedKey,
        dateKey: key,
        appointments: dayData.appointments,
        holds: dayData.holds,
      });
    }

    // Next month padding days to complete grid (35 or 42 cells)
    const totalCells = days.length > 35 ? 42 : 35;
    const remainingCells = totalCells - days.length;

    for (let nextDayNum = 1; nextDayNum <= remainingCells; nextDayNum++) {
      const date = new Date(currentYear, currentMonth + 1, nextDayNum);
      const key = formatDateKey(date);
      const dayData = appointmentsByDate[key] || { appointments: [], holds: [] };

      days.push({
        date,
        dayNumber: nextDayNum,
        isCurrentMonth: false,
        isToday: key === todayKey,
        isSelected: key === selectedKey,
        dateKey: key,
        appointments: dayData.appointments,
        holds: dayData.holds,
      });
    }

    return days;
  }, [currentYear, currentMonth, today, selectedDate, appointmentsByDate]);

  // Modal Date Info
  const modalDateKey = activeModalDate ? formatDateKey(activeModalDate) : '';
  const modalDayData = modalDateKey
    ? appointmentsByDate[modalDateKey] || { appointments: [], holds: [] }
    : { appointments: [], holds: [] };
  const hasModalEvents = modalDayData.appointments.length > 0 || modalDayData.holds.length > 0;

  const formattedModalDate = activeModalDate
    ? activeModalDate.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '';

  const isModalDateToday = activeModalDate
    ? formatDateKey(activeModalDate) === formatDateKey(today)
    : false;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#c3c6d6]/40 p-5 space-y-4 text-left relative">
      {/* Calendar Header */}
      <div className="flex justify-between items-center">
        <h3 className="font-heading font-bold text-sm text-[#191c1e] flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-[#003d9b]" />
          <span>Your Schedule</span>
        </h3>
        <Link
          to={`${ROUTES.PATIENT.DASHBOARD}#appointments`}
          className="text-[#003d9b] hover:text-[#0052cc] transition-colors text-xs font-bold flex items-center gap-1 group"
        >
          <span>View full list</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      {/* Month Selector Bar */}
      <div className="flex justify-between items-center text-[#191c1e] text-xs font-bold bg-[#f8f9fb] p-2 rounded-xl border border-[#c3c6d6]/30">
        <button
          type="button"
          onClick={handlePrevMonth}
          className="p-1.5 hover:bg-white hover:shadow-2xs text-[#51606f] hover:text-[#191c1e] rounded-lg transition-all cursor-pointer"
          title="Previous month"
          aria-label="Previous month"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2">
          <span className="font-heading text-sm font-bold">
            {monthNames[currentMonth]} {currentYear}
          </span>
          {(currentMonth !== today.getMonth() || currentYear !== today.getFullYear()) && (
            <button
              type="button"
              onClick={handleResetToToday}
              className="text-[10px] font-bold text-[#003d9b] bg-[#e6f0ff] hover:bg-[#d0e2ff] px-2 py-0.5 rounded-full transition-colors cursor-pointer"
            >
              Today
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={handleNextMonth}
          className="p-1.5 hover:bg-white hover:shadow-2xs text-[#51606f] hover:text-[#191c1e] rounded-lg transition-all cursor-pointer"
          title="Next month"
          aria-label="Next month"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 text-center text-xs">
        {/* Days of week header */}
        {daysOfWeek.map((day) => (
          <div
            key={day}
            className="text-[#51606f] font-bold py-1 text-[11px] uppercase tracking-wider"
          >
            {day}
          </div>
        ))}

        {/* Date cells */}
        {calendarDays.map((dayItem) => {
          const hasAppt = dayItem.appointments.length > 0;
          const hasHold = dayItem.holds.length > 0;
          const hasAny = hasAppt || hasHold;

          return (
            <button
              key={dayItem.dateKey}
              type="button"
              onClick={() => {
                setSelectedDate(dayItem.date);
                setActiveModalDate(dayItem.date);
                if (!dayItem.isCurrentMonth) {
                  setViewDate(new Date(dayItem.date.getFullYear(), dayItem.date.getMonth(), 1));
                }
              }}
              className={cn(
                'relative py-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer flex flex-col items-center justify-center min-h-[38px] group',
                dayItem.isSelected
                  ? 'bg-[#003d9b] text-white shadow-md font-bold scale-[1.05] z-10'
                  : dayItem.isCurrentMonth
                    ? 'text-[#191c1e] hover:bg-[#f0f5ff] hover:text-[#003d9b]'
                    : 'text-[#c3c6d6] hover:bg-slate-50',
                dayItem.isToday &&
                  !dayItem.isSelected &&
                  'ring-2 ring-[#003d9b] font-bold text-[#003d9b] bg-[#e6f0ff]/40',
                hasAny && !dayItem.isSelected && 'font-bold text-[#003d9b]',
              )}
            >
              <span>{dayItem.dayNumber}</span>

              {/* Status Dot Indicators */}
              <div className="flex items-center gap-0.5 mt-0.5">
                {hasAppt && (
                  <span
                    className={cn(
                      'w-1.5 h-1.5 rounded-full transition-transform group-hover:scale-125',
                      dayItem.isSelected ? 'bg-white' : 'bg-[#003d9b]',
                    )}
                  />
                )}
                {hasHold && (
                  <span
                    className={cn(
                      'w-1.5 h-1.5 rounded-full transition-transform group-hover:scale-125',
                      dayItem.isSelected ? 'bg-emerald-300' : 'bg-emerald-500',
                    )}
                  />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Legend Footer */}
      <div className="flex gap-4 text-[11px] text-[#51606f] justify-center pt-3 border-t border-slate-100 font-medium">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 bg-[#003d9b] rounded-full" />
          <span>Appointment</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 bg-emerald-500 rounded-full" />
          <span>Slot Hold</span>
        </div>
      </div>

      {/* Interactive Micro Modal Popover */}
      {activeModalDate && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setActiveModalDate(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl border border-slate-200/80 w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200 text-left"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-[#003d9b] text-white p-4 flex items-center justify-between relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center gap-1.5 text-xs text-[#b2c5ff] font-semibold">
                  <CalendarIcon className="w-3.5 h-3.5" />
                  <span>{formattedModalDate}</span>
                  {isModalDateToday && (
                    <span className="bg-white/20 text-white px-1.5 py-0.2 rounded text-[10px] font-bold">
                      Today
                    </span>
                  )}
                </div>
                <h4 className="text-base font-bold font-heading text-white mt-0.5">
                  {hasModalEvents ? 'Scheduled Activity' : 'No Events Scheduled'}
                </h4>
              </div>

              <button
                type="button"
                onClick={() => setActiveModalDate(null)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer relative z-10"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 space-y-3 max-h-[320px] overflow-y-auto">
              {hasModalEvents ? (
                <>
                  {modalDayData.appointments.map((appt) => {
                    const apptTime = new Date(appt.startTime).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                    });

                    return (
                      <div
                        key={appt.id}
                        className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 space-y-2.5 hover:border-[#003d9b]/40 transition-all shadow-2xs"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-full bg-[#003d9b]/10 text-[#003d9b] font-bold text-xs flex items-center justify-center shrink-0">
                              <Video className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="font-bold text-sm text-[#191c1e]">
                                {appt.therapist.name}
                              </p>
                              <p className="text-xs text-[#51606f] font-medium">
                                {appt.therapist.specialization}
                              </p>
                            </div>
                          </div>

                          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full text-[10px] font-bold">
                            Confirmed
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200/60">
                          <div className="flex items-center gap-1.5 text-[#003d9b] font-bold">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{apptTime}</span>
                          </div>

                          {appt.meetingLink ? (
                            <a
                              href={appt.meetingLink}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-xs font-bold text-white bg-[#003d9b] hover:bg-[#0052cc] px-3 py-1 rounded-lg shadow-2xs transition-colors"
                            >
                              <span>Join Call</span>
                              <Video className="w-3 h-3" />
                            </a>
                          ) : (
                            <Link
                              to={`${ROUTES.PATIENT.DASHBOARD}#appointments`}
                              className="text-xs font-bold text-[#003d9b] hover:underline"
                            >
                              View details
                            </Link>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {modalDayData.holds.map((hold) => {
                    const holdTime = new Date(hold.startTime).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                    });

                    return (
                      <div
                        key={hold.id}
                        className="bg-emerald-50/60 border border-emerald-200/80 rounded-xl p-3 space-y-2.5 shadow-2xs"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0">
                              <Clock className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="font-bold text-sm text-[#191c1e]">
                                {hold.therapist.name}
                              </p>
                              <p className="text-xs text-emerald-700 font-medium">Slot Held</p>
                            </div>
                          </div>

                          <span className="bg-white text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-full text-[10px] font-bold shadow-2xs">
                            Active Hold
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-xs pt-1 border-t border-emerald-200/60">
                          <span className="font-bold text-emerald-800">{holdTime}</span>
                          <Link
                            to={`${ROUTES.PATIENT.DASHBOARD}#holds`}
                            className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-white hover:bg-emerald-100 px-3 py-1 rounded-lg border border-emerald-300 shadow-2xs transition-colors"
                          >
                            <span>Complete Booking</span>
                            <ArrowRight className="w-3 h-3" />
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </>
              ) : (
                <div className="text-center py-6 px-4 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-[#f0f5ff] text-[#003d9b] flex items-center justify-center mx-auto">
                    <Sparkles className="w-6 h-6 text-[#003d9b]" />
                  </div>
                  <div>
                    <h5 className="font-bold text-sm text-[#191c1e]">No Appointments</h5>
                    <p className="text-xs text-[#51606f] mt-1">
                      You have no sessions or slot holds on this date.
                    </p>
                  </div>
                  <Link
                    to={ROUTES.PATIENT.BOOK}
                    onClick={() => setActiveModalDate(null)}
                    className="w-full inline-flex items-center justify-center gap-2 text-xs font-bold text-white bg-gradient-to-r from-[#003d9b] to-[#0052cc] hover:from-[#002d73] hover:to-[#003d9b] py-2.5 px-4 rounded-xl shadow-xs transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Book Session on this Date</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-3 bg-slate-50 border-t border-slate-200/80 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveModalDate(null)}
                className="px-4 py-1.5 rounded-lg text-xs font-bold bg-white text-[#51606f] hover:text-[#191c1e] border border-slate-200 shadow-2xs hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
