import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import type { AuthStoreState } from '@/stores/authStore';
import { ROUTES } from '@/config/routes';
import {
  getInitials,
  formatTimeRange,
  getRelativeTimeBadge,
  formatDateStr,
} from '@/utils/formatters';
import { useDashboard } from '@/features/dashboard';
import type { TherapistDashboardData } from '@/features/dashboard';
import { useNow } from '@/hooks/useNow';

export const TherapistDashboardPage: React.FC = () => {
  const user = useAuthStore((state: AuthStoreState) => state.user);
  const navigate = useNavigate();

  const therapistName = user?.name || 'Dr. Sarah Connor';

  const { data: dashboardData, isLoading } = useDashboard();

  // Extract therapist-specific data from unified dashboard response
  const therapistData =
    dashboardData?.role === 'THERAPIST' ? (dashboardData as TherapistDashboardData) : null;

  const stats = therapistData?.stats || {
    todaySessionsCount: 0,
    upcomingSessionsCount: 0,
    pendingHoldsCount: 0,
    totalPatientsCount: 0,
    completedSessionsCount: 0,
  };

  const nextSession = therapistData?.nextSession ?? null;
  const recentAppointments = therapistData?.recentAppointments ?? [];
  const todaySchedule = therapistData?.todaySchedule ?? [];

  const nowTime = useNow();

  if (isLoading) {
    return (
      <div className="py-20 text-center text-xs text-[#51606f] animate-pulse">
        Loading dashboard data...
      </div>
    );
  }

  return (
    <div className="space-y-8 text-left w-full">
      {/* Welcome & CTA Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-extrabold text-[#191c1e] mb-1">
            Welcome back, {therapistName}
          </h1>
          <p className="text-xs md:text-sm text-[#434654]">
            Here's an overview of your practice today.
          </p>
        </div>
        <button
          onClick={() => navigate(ROUTES.THERAPIST.SCHEDULE)}
          className="flex items-center gap-2 bg-[#0052cc] text-white px-5 py-2.5 rounded-xl text-xs font-semibold hover:bg-[#003d9b] transition-colors shadow-xs cursor-pointer"
        >
          <span className="material-symbols-outlined text-lg">event_available</span>
          Update Availability
        </button>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#c3c6d6]/40 shadow-xs flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0052cc] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-xl">today</span>
          </div>
          <div>
            <p className="text-[10px] font-bold text-[#51606f] uppercase tracking-wider">
              Today's Sessions
            </p>
            <h4 className="text-xl font-heading font-extrabold text-[#191c1e]">
              {stats.todaySessionsCount}
            </h4>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-[#c3c6d6]/40 shadow-xs flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-xl">check_circle</span>
          </div>
          <div>
            <p className="text-[10px] font-bold text-[#51606f] uppercase tracking-wider">
              Completed
            </p>
            <h4 className="text-xl font-heading font-extrabold text-[#191c1e]">
              {stats.completedSessionsCount}
            </h4>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-[#c3c6d6]/40 shadow-xs flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-xl">pending_actions</span>
          </div>
          <div>
            <p className="text-[10px] font-bold text-[#51606f] uppercase tracking-wider">
              Pending Holds
            </p>
            <h4 className="text-xl font-heading font-extrabold text-[#191c1e]">
              {stats.pendingHoldsCount}
            </h4>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-[#c3c6d6]/40 shadow-xs flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-xl">groups</span>
          </div>
          <div>
            <p className="text-[10px] font-bold text-[#51606f] uppercase tracking-wider">
              Active Patients
            </p>
            <h4 className="text-xl font-heading font-extrabold text-[#191c1e]">
              {stats.totalPatientsCount}
            </h4>
          </div>
        </div>
      </div>

      {/* Main 2-Column Dashboard Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Column (Next Appt & Recent Appts Table) */}
        <div className="xl:col-span-2 space-y-8">
          {/* Next Appointment Hero Section */}
          {nextSession ? (
            <section className="bg-white rounded-2xl border border-[#c3c6d6]/40 shadow-xs overflow-hidden relative p-6 md:p-8">
              <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-[#e6f0ff]/60 to-transparent pointer-events-none rounded-l-[100px] opacity-60"></div>
              <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-[#e6f0ff] text-[#0052cc] text-[11px] font-bold rounded-md tracking-wider uppercase">
                      {getRelativeTimeBadge(nextSession.startTime, nowTime.getTime())}
                    </span>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-[#434654] mb-1">
                      {formatTimeRange(nextSession.startTime, nextSession.endTime)}
                    </p>
                    <h3 className="text-2xl font-heading font-extrabold text-[#191c1e]">
                      {nextSession.patient?.name || 'Unknown Patient'}
                    </h3>
                    <p className="text-xs font-medium text-[#51606f] mt-0.5">
                      {nextSession.bookingType === 'RECURRING'
                        ? 'Recurring Session'
                        : 'One-time Session'}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-[#434654]">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-base text-[#0052cc]">
                        calendar_today
                      </span>
                      <span>{formatDateStr(nextSession.startTime)}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-base text-[#0052cc]">
                        videocam
                      </span>
                      <span>Video Session</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 pt-2">
                    {nextSession.meetingLink && (
                      <a
                        href={nextSession.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-[#0052cc] text-white px-5 py-2.5 rounded-xl text-xs font-semibold hover:bg-[#003d9b] transition-colors shadow-xs cursor-pointer text-center"
                      >
                        <span className="material-symbols-outlined text-base">videocam</span>
                        Start Session
                      </a>
                    )}
                    <Link
                      to={ROUTES.THERAPIST.APPOINTMENTS}
                      className="px-5 py-2.5 bg-white text-[#191c1e] border border-[#c3c6d6]/60 rounded-xl text-xs font-semibold hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer flex items-center justify-center"
                    >
                      View Details
                    </Link>
                  </div>
                </div>

                {/* Patient Avatar Thumbnail */}
                <div className="w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-white shadow-md shrink-0 bg-gradient-to-br from-[#0052cc] to-[#003d9b] text-white flex items-center justify-center font-heading font-extrabold text-2xl">
                  {getInitials(nextSession.patient?.name || 'P')}
                </div>
              </div>
            </section>
          ) : (
            <section className="bg-white rounded-2xl border border-[#c3c6d6]/40 shadow-xs p-6 md:p-8 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center mx-auto">
                <span className="material-symbols-outlined text-2xl">event_busy</span>
              </div>
              <div>
                <h4 className="font-heading font-extrabold text-[#191c1e] text-base">
                  No upcoming sessions
                </h4>
                <p className="text-xs text-[#51606f] mt-1 max-w-sm mx-auto">
                  You don't have any upcoming therapy sessions scheduled at the moment.
                </p>
              </div>
              <button
                onClick={() => navigate(ROUTES.THERAPIST.SCHEDULE)}
                className="px-4 py-2 bg-[#0052cc] hover:bg-[#003d9b] text-white rounded-xl text-xs font-semibold transition"
              >
                Set Working Hours
              </button>
            </section>
          )}

          {/* Recent Appointments Table */}
          <section className="bg-white rounded-2xl border border-[#c3c6d6]/40 shadow-xs p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-heading font-bold text-[#191c1e]">Recent Appointments</h3>
              <Link
                to={ROUTES.THERAPIST.APPOINTMENTS}
                className="text-[#0052cc] text-xs font-bold flex items-center gap-1 hover:underline"
              >
                View all <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-xs font-semibold text-[#434654] border-b border-[#c3c6d6]/40">
                    <th className="pb-3 px-2">Patient</th>
                    <th className="pb-3 px-2">Date &amp; Time</th>
                    <th className="pb-3 px-2">Type</th>
                    <th className="pb-3 px-2">Status</th>
                    <th className="pb-3 px-2 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="text-xs font-medium divide-y divide-[#c3c6d6]/30">
                  {recentAppointments.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-8 text-center text-xs text-[#51606f] font-semibold bg-[#f8f9fb]/40 border border-dashed border-slate-200 rounded-xl"
                      >
                        No recent past sessions found.
                      </td>
                    </tr>
                  ) : (
                    recentAppointments.slice(0, 4).map((appt) => {
                      const initials = getInitials(appt.patient?.name || 'P');
                      const start = new Date(appt.startTime);
                      const formattedTime =
                        start.toLocaleDateString(undefined, {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                        }) +
                        `, ${start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

                      const statusClasses =
                        appt.status === 'COMPLETED'
                          ? 'bg-[#ccfbf1] text-[#0d9488] border-[#0d9488]/20'
                          : appt.status === 'CANCELLED'
                            ? 'bg-rose-100 text-rose-700 border-rose-200'
                            : 'bg-amber-100 text-amber-700 border-amber-200';

                      return (
                        <tr key={appt.id} className="hover:bg-[#f8f9fb] transition-colors">
                          <td className="py-3.5 px-2">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0052cc] to-[#003d9b] text-white font-bold text-xs flex items-center justify-center shrink-0">
                                {initials}
                              </div>
                              <span className="font-bold text-[#191c1e]">
                                {appt.patient?.name || 'Unknown Patient'}
                              </span>
                            </div>
                          </td>
                          <td className="py-3.5 px-2 text-[#434654]">{formattedTime}</td>
                          <td className="py-3.5 px-2 text-[#434654]">
                            {appt.bookingType === 'RECURRING'
                              ? 'Recurring Session'
                              : 'One-time Session'}
                          </td>
                          <td className="py-3.5 px-2">
                            <span
                              className={`inline-block px-2.5 py-0.5 text-[11px] font-bold rounded-full border ${statusClasses}`}
                            >
                              {appt.status.charAt(0) + appt.status.slice(1).toLowerCase()}
                            </span>
                          </td>
                          <td className="py-3.5 px-2 text-center">
                            <Link
                              to={ROUTES.THERAPIST.APPOINTMENTS}
                              className="text-[#434654] hover:text-[#0052cc] p-1 border border-[#c3c6d6]/50 rounded-md hover:bg-white inline-flex items-center justify-center transition-colors cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-base">
                                description
                              </span>
                            </Link>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-4 pt-3 border-t border-[#c3c6d6]/30 text-center">
              <Link
                to={ROUTES.THERAPIST.APPOINTMENTS}
                className="inline-flex items-center gap-1 text-[#0052cc] text-xs font-bold hover:underline"
              >
                View All Appointments{' '}
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>
          </section>
        </div>

        {/* Right Column (Today's Schedule) */}
        <div className="space-y-8">
          {/* Today's Schedule Timeline */}
          <section className="bg-white rounded-2xl border border-[#c3c6d6]/40 shadow-xs p-6 flex flex-col h-full min-h-[400px]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-heading font-bold text-[#191c1e]">Today's Schedule</h3>
              <Link
                to={`${ROUTES.THERAPIST.SCHEDULE}?view=day`}
                className="text-[#0052cc] text-xs font-bold flex items-center gap-1 hover:underline"
              >
                View full calendar{' '}
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-[#191c1e] pb-3 border-b border-[#c3c6d6]/30 mb-4">
              <span className="material-symbols-outlined text-[#0052cc] text-base">
                calendar_month
              </span>
              <span>
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </div>

            {/* Timeline Items List */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-4">
              {todaySchedule.length === 0 ? (
                <div className="py-20 text-center text-xs text-[#51606f] font-semibold bg-[#f8f9fb]/40 border border-dashed border-slate-200 rounded-xl">
                  No appointments scheduled for today.
                </div>
              ) : (
                todaySchedule.map((appt, idx: number) => {
                  const start = new Date(appt.startTime);
                  const formattedTime = start.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  });
                  const isLast = idx === todaySchedule.length - 1;

                  return (
                    <div key={appt.id} className="relative flex gap-3 items-start group">
                      <div className="w-16 text-right text-[11px] font-bold text-[#434654] pt-2 shrink-0">
                        {formattedTime}
                      </div>
                      {/* Vertical Timeline Connector Line & Dot */}
                      <div className="flex flex-col items-center self-stretch shrink-0">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#0d9488] ring-4 ring-[#ccfbf1] z-10 mt-2.5"></div>
                        {!isLast && <div className="w-0.5 flex-1 bg-[#0d9488]/30 my-1"></div>}
                      </div>
                      <div className="flex-1 bg-[#ccfbf1]/40 border border-[#0d9488]/30 rounded-xl p-3 shadow-2xs flex justify-between items-center">
                        <div>
                          <h5 className="font-bold text-[#0d9488] text-xs mb-0.5">
                            {appt.patient?.name || 'Unknown Patient'}
                          </h5>
                          <p className="text-[11px] text-[#434654]">
                            {appt.bookingType === 'RECURRING'
                              ? 'Recurring Session'
                              : 'One-time Session'}
                          </p>
                        </div>
                        {appt.meetingLink && (
                          <a
                            href={appt.meetingLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 bg-white rounded-md border border-[#c3c6d6]/50 text-[#434654] hover:text-[#0052cc] cursor-pointer inline-flex items-center justify-center"
                          >
                            <span className="material-symbols-outlined text-sm">videocam</span>
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TherapistDashboardPage;
