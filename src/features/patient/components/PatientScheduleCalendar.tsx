import React, { useState, useEffect, useMemo } from 'react';
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
  const { data: appointmentsData } = usePatientAppointments(patientId, { limit: 100 });
  const appointments = appointmentsData?.items || [];

  const today = useMemo(() => new Date(), []);
  const [viewDate, setViewDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [activeModalDate, setActiveModalDate] = useState<Date | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(() => Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

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

      const statusStr = appt.status as string;
      const isHold = statusStr === 'HELD' || statusStr === 'HOLD';
      const isExpired = appt.holdExpiresAt
        ? new Date(appt.holdExpiresAt).getTime() <= currentTime
        : false;

      if (isHold && !isExpired) {
        map[key].holds.push(appt);
      } else if (
        statusStr !== 'CANCELLED' &&
        statusStr !== 'HOLD_EXPIRED' &&
        statusStr !== 'PAYMENT_FAILED' &&
        !isHold
      ) {
        map[key].appointments.push(appt);
      }
    });

    return map;
  }, [appointments, currentTime]);

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
    <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-5 space-y-4 text-left relative transition-shadow hover:shadow-md">
      {/* Calendar Header */}
      <div className="flex justify-between items-center pb-1">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#003d9b] border border-blue-100 flex items-center justify-center shrink-0">
            <CalendarIcon className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-sm text-slate-900">Schedule & Activity</h3>
            <p className="text-[11px] text-slate-500 font-medium">
              View appointments and held slots
            </p>
          </div>
        </div>

        <Link
          to={`${ROUTES.PATIENT.DASHBOARD}#appointments`}
          className="text-[#003d9b] hover:text-[#002b70] transition-colors text-xs font-semibold flex items-center gap-1 group bg-blue-50/60 hover:bg-blue-100/60 px-2.5 py-1.5 rounded-lg border border-blue-100/80"
        >
          <span>View all</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      {/* Month Selector Bar */}
      <div className="flex justify-between items-center text-slate-800 text-xs font-semibold bg-slate-50/80 p-2 rounded-xl border border-slate-200/70">
        <button
          type="button"
          onClick={handlePrevMonth}
          className="p-1.5 hover:bg-white hover:shadow-xs text-slate-600 hover:text-slate-900 rounded-lg border border-transparent hover:border-slate-200 transition-all cursor-pointer"
          title="Previous month"
          aria-label="Previous month"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2">
          <span className="font-heading text-xs font-bold text-slate-900 tracking-tight">
            {monthNames[currentMonth]} {currentYear}
          </span>
          {(currentMonth !== today.getMonth() || currentYear !== today.getFullYear()) && (
            <button
              type="button"
              onClick={handleResetToToday}
              className="text-[10px] font-bold text-[#003d9b] bg-blue-100/70 hover:bg-blue-200/80 px-2 py-0.5 rounded-full transition-colors cursor-pointer border border-blue-200/60"
            >
              Today
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={handleNextMonth}
          className="p-1.5 hover:bg-white hover:shadow-xs text-slate-600 hover:text-slate-900 rounded-lg border border-transparent hover:border-slate-200 transition-all cursor-pointer"
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
            className="text-slate-400 font-bold py-1 text-[10px] uppercase tracking-wider"
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
                'relative py-2 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer flex flex-col items-center justify-center min-h-[40px] group',
                dayItem.isSelected
                  ? 'bg-[#003d9b] text-white shadow-md font-bold scale-[1.03] z-10'
                  : dayItem.isCurrentMonth
                    ? 'text-slate-800 hover:bg-blue-50/70 hover:text-[#003d9b]'
                    : 'text-slate-300 hover:bg-slate-50',
                dayItem.isToday &&
                  !dayItem.isSelected &&
                  'ring-1.5 ring-[#003d9b] font-bold text-[#003d9b] bg-blue-50/50',
                hasAny && !dayItem.isSelected && 'font-bold text-[#003d9b]',
              )}
            >
              <span>{dayItem.dayNumber}</span>

              {/* Status Dot Indicators */}
              <div className="flex items-center gap-1 mt-0.5">
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
                      dayItem.isSelected ? 'bg-amber-300' : 'bg-amber-500',
                    )}
                  />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Legend Footer */}
      <div className="flex gap-4 text-[11px] text-slate-500 justify-center pt-3 border-t border-slate-100 font-medium">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 bg-[#003d9b] rounded-full" />
          <span>Appointment</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 bg-amber-500 rounded-full" />
          <span>Slot Hold</span>
        </div>
      </div>

      {/* Enterprise Micro Modal Popover */}
      {activeModalDate && (
        <div
          className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setActiveModalDate(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl border border-slate-200/90 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-150 text-left"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-slate-50 via-blue-50/30 to-slate-50 p-4 border-b border-slate-200/80 flex items-start justify-between relative">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100/70 text-[#003d9b] border border-blue-200/60">
                  <CalendarIcon className="w-3.5 h-3.5 text-[#003d9b]" />
                  <span>{formattedModalDate}</span>
                  {isModalDateToday && (
                    <span className="bg-[#003d9b] text-white px-1.5 py-0.2 rounded text-[9px] font-bold tracking-wider uppercase ml-1">
                      Today
                    </span>
                  )}
                </div>
                <h4 className="text-base font-bold font-heading text-slate-900 mt-2">
                  {hasModalEvents ? 'Scheduled Activity' : 'No Events Scheduled'}
                </h4>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  {hasModalEvents
                    ? `${modalDayData.appointments.length + modalDayData.holds.length} activity item(s) on this date`
                    : 'Your calendar is free for this day.'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActiveModalDate(null)}
                className="w-8 h-8 rounded-xl bg-white hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-all cursor-pointer border border-slate-200/80 shadow-2xs shrink-0"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 space-y-3 max-h-[360px] overflow-y-auto">
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
                        className="bg-white border border-slate-200 rounded-xl p-3.5 space-y-3 hover:border-blue-300 hover:shadow-xs transition-all"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#003d9b] border border-blue-100 font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                              <Video className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="font-bold text-sm text-slate-900 leading-snug">
                                {appt.therapist.name}
                              </p>
                              <p className="text-xs text-slate-500 font-medium">
                                {appt.therapist.specialization}
                              </p>
                            </div>
                          </div>

                          <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200/80 px-2.5 py-0.5 rounded-full text-[10px] font-bold shrink-0">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Confirmed
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-xs bg-slate-50/80 p-2.5 rounded-lg border border-slate-100 font-medium text-slate-700">
                          <div className="flex items-center gap-1.5 font-bold text-slate-800">
                            <Clock className="w-3.5 h-3.5 text-[#003d9b]" />
                            <span>{apptTime}</span>
                          </div>

                          {appt.meetingLink ? (
                            <a
                              href={appt.meetingLink}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-[#003d9b] hover:bg-[#002b70] px-3 py-1.5 rounded-lg shadow-2xs transition-all cursor-pointer"
                            >
                              <span>Join Call</span>
                              <Video className="w-3 h-3" />
                            </a>
                          ) : (
                            <Link
                              to={`${ROUTES.PATIENT.DASHBOARD}#appointments`}
                              className="inline-flex items-center gap-1 text-xs font-bold text-[#003d9b] hover:text-[#002b70] transition-colors"
                            >
                              <span>View details</span>
                              <ArrowRight className="w-3 h-3" />
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
                        className="bg-gradient-to-br from-amber-50/90 via-amber-50/40 to-orange-50/30 border border-amber-300/80 rounded-xl p-3.5 space-y-3 shadow-2xs"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-amber-100/80 text-amber-800 border border-amber-200 font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                              <Clock className="w-4 h-4 text-amber-700" />
                            </div>
                            <div>
                              <p className="font-bold text-sm text-slate-900 leading-snug">
                                {hold.therapist.name}
                              </p>
                              <p className="text-xs text-amber-800 font-medium">Slot Held</p>
                            </div>
                          </div>

                          <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 border border-amber-300 px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-2xs shrink-0">
                            <Sparkles className="w-3 h-3 text-amber-600" />
                            Active Hold
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-xs bg-white/90 p-2.5 rounded-lg border border-amber-200/80 font-medium">
                          <div className="flex items-center gap-1.5 font-bold text-amber-900">
                            <Clock className="w-3.5 h-3.5 text-amber-600" />
                            <span>{holdTime}</span>
                          </div>

                          <Link
                            to={`${ROUTES.PATIENT.DASHBOARD}#holds`}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-900 bg-amber-100 hover:bg-amber-200/80 px-3 py-1.5 rounded-lg border border-amber-300 shadow-2xs transition-colors"
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
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#003d9b] border border-blue-100 flex items-center justify-center mx-auto shadow-2xs">
                    <Sparkles className="w-6 h-6 text-[#003d9b]" />
                  </div>
                  <div>
                    <h5 className="font-bold text-sm text-slate-900">No Appointments</h5>
                    <p className="text-xs text-slate-500 mt-1">
                      You have no sessions or slot holds on this date.
                    </p>
                  </div>
                  <Link
                    to={ROUTES.PATIENT.BOOK}
                    onClick={() => setActiveModalDate(null)}
                    className="w-full inline-flex items-center justify-center gap-2 text-xs font-bold text-white bg-[#003d9b] hover:bg-[#002b70] py-2.5 px-4 rounded-xl shadow-xs transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Book Session on this Date</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-3 bg-slate-50/90 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>
                {hasModalEvents
                  ? `${modalDayData.appointments.length + modalDayData.holds.length} total item(s)`
                  : 'Free day'}
              </span>
              <button
                type="button"
                onClick={() => setActiveModalDate(null)}
                className="px-4 py-1.5 rounded-lg text-xs font-bold bg-white text-slate-700 hover:text-slate-900 border border-slate-200 shadow-2xs hover:bg-slate-100 transition-colors cursor-pointer"
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
