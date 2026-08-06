import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import type { AuthState } from '@/stores/authStore';
import { ROUTES } from '@/config/routes';

export const TherapistDashboardPage: React.FC = () => {
  const user = useAuthStore((state: AuthState) => state.user);
  const navigate = useNavigate();

  const therapistName = user?.name || 'Dr. Sarah Connor';

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

      {/* 4 Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Today's Appointments */}
        <div className="bg-white p-5 rounded-2xl border border-[#c3c6d6]/40 shadow-xs flex items-center justify-between group cursor-pointer hover:border-[#0052cc] transition-colors">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-[#e6f0ff] text-[#0052cc] flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">calendar_today</span>
            </div>
            <div>
              <p className="text-xs font-semibold text-[#434654] mb-0.5">Today's Appointments</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-[#191c1e]">5</span>
                <span className="text-[11px] text-[#434654]">2 upcoming</span>
              </div>
            </div>
          </div>
          <span className="material-symbols-outlined text-[#c3c6d6] group-hover:text-[#0052cc] transition-colors">
            chevron_right
          </span>
        </div>

        {/* Card 2: Completed Today */}
        <div className="bg-white p-5 rounded-2xl border border-[#c3c6d6]/40 shadow-xs flex items-center justify-between group cursor-pointer hover:border-[#14b8a6] transition-colors">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-[#ccfbf1] text-[#0d9488] flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">check_circle</span>
            </div>
            <div>
              <p className="text-xs font-semibold text-[#434654] mb-0.5">Completed Today</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-[#191c1e]">3</span>
                <span className="text-[11px] text-[#434654]">This will update of day</span>
              </div>
            </div>
          </div>
          <span className="material-symbols-outlined text-[#c3c6d6] group-hover:text-[#0d9488] transition-colors">
            chevron_right
          </span>
        </div>

        {/* Card 3: Total Patients */}
        <div className="bg-white p-5 rounded-2xl border border-[#c3c6d6]/40 shadow-xs flex items-center justify-between group cursor-pointer hover:border-purple-600 transition-colors">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">group</span>
            </div>
            <div>
              <p className="text-xs font-semibold text-[#434654] mb-0.5">Total Patients</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-[#191c1e]">48</span>
                <span className="text-[11px] text-[#434654]">Active patients</span>
              </div>
            </div>
          </div>
          <span className="material-symbols-outlined text-[#c3c6d6] group-hover:text-purple-600 transition-colors">
            chevron_right
          </span>
        </div>

        {/* Card 4: This Week's Sessions */}
        <div className="bg-white p-5 rounded-2xl border border-[#c3c6d6]/40 shadow-xs flex items-center justify-between group cursor-pointer hover:border-amber-500 transition-colors">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-[#fef3c7] text-[#d97706] flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">star</span>
            </div>
            <div>
              <p className="text-xs font-semibold text-[#434654] mb-0.5">This Week's Sessions</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-[#191c1e]">18</span>
                <span className="text-[11px] text-[#434654]">Aug 4 – Aug 10</span>
              </div>
            </div>
          </div>
          <span className="material-symbols-outlined text-[#c3c6d6] group-hover:text-amber-500 transition-colors">
            chevron_right
          </span>
        </div>
      </div>

      {/* Main 2-Column Dashboard Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Column (Next Appt & Recent Appts Table) */}
        <div className="xl:col-span-2 space-y-8">
          {/* Next Appointment Hero Section */}
          <section className="bg-white rounded-2xl border border-[#c3c6d6]/40 shadow-xs overflow-hidden relative p-6 md:p-8">
            <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-[#e6f0ff]/60 to-transparent pointer-events-none rounded-l-[100px] opacity-60"></div>
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-[#e6f0ff] text-[#0052cc] text-[11px] font-bold rounded-md tracking-wider uppercase">
                    IN 20 MINUTES
                  </span>
                </div>

                <div>
                  <p className="text-xs font-semibold text-[#434654] mb-1">10:00 AM – 10:50 AM</p>
                  <h3 className="text-2xl font-heading font-extrabold text-[#191c1e]">
                    Alex Patient
                  </h3>
                  <p className="text-xs font-medium text-[#51606f] mt-0.5">
                    Cognitive Behavioral Therapy (CBT)
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-[#434654]">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-base text-[#0052cc]">
                      calendar_today
                    </span>
                    <span>Fri, Aug 7, 2026</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-base text-[#0052cc]">
                      videocam
                    </span>
                    <span>Video Session</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  <button className="flex items-center gap-2 bg-[#0052cc] text-white px-5 py-2.5 rounded-xl text-xs font-semibold hover:bg-[#003d9b] transition-colors shadow-xs cursor-pointer">
                    <span className="material-symbols-outlined text-base">videocam</span>
                    Start Session
                  </button>
                  <button className="px-5 py-2.5 bg-white text-[#191c1e] border border-[#c3c6d6]/60 rounded-xl text-xs font-semibold hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer">
                    View Details
                  </button>
                </div>
              </div>

              {/* Patient Avatar Thumbnail */}
              <div className="w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-white shadow-md shrink-0">
                <img
                  alt="Alex Patient"
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAxpQzOFYHryO37GalgHxs_ntSQ5fZ97NCkh6gBcniWCQuCxJtP_yGAzLbMDYvr9hRJXDZEjewM-5CxR8m6zrtwbWSM3hDTE1-6YwPP4L797xSF9hvnwoXpfzla760pIcyuuO6ENrztGj0mUWWgdK--Q8is2xyZlKY1zCB2GFvb_8ot7zjAo4OqXzeVaMnyjvQWWdImvEYSpoqUkO2S6ZoI1EvSsfgZN8ZmGmEqMYxMgELR4QjhsE1x"
                />
              </div>
            </div>
          </section>

          {/* Recent Appointments Table */}
          <section className="bg-white rounded-2xl border border-[#c3c6d6]/40 shadow-xs p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-heading font-bold text-[#191c1e]">Recent Appointments</h3>
              <a
                href="#all-appointments"
                className="text-[#0052cc] text-xs font-bold flex items-center gap-1 hover:underline"
              >
                View all <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </a>
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
                  <tr className="hover:bg-[#f8f9fb] transition-colors">
                    <td className="py-3.5 px-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden shrink-0">
                          <img
                            alt="Emily Davis"
                            className="w-full h-full object-cover"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAxpQzOFYHryO37GalgHxs_ntSQ5fZ97NCkh6gBcniWCQuCxJtP_yGAzLbMDYvr9hRJXDZEjewM-5CxR8m6zrtwbWSM3hDTE1-6YwPP4L797xSF9hvnwoXpfzla760pIcyuuO6ENrztGj0mUWWgdK--Q8is2xyZlKY1zCB2GFvb_8ot7zjAo4OqXzeVaMnyjvQWWdImvEYSpoqUkO2S6ZoI1EvSsfgZN8ZmGmEqMYxMgELR4QjhsE1x"
                          />
                        </div>
                        <span className="font-bold text-[#191c1e]">Emily Davis</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-2 text-[#434654]">Thu, Aug 6, 4:00 PM</td>
                    <td className="py-3.5 px-2 text-[#434654]">CBT Session</td>
                    <td className="py-3.5 px-2">
                      <span className="inline-block px-2.5 py-0.5 bg-[#ccfbf1] text-[#0d9488] text-[11px] font-bold rounded-full border border-[#0d9488]/20">
                        Completed
                      </span>
                    </td>
                    <td className="py-3.5 px-2 text-center">
                      <button className="text-[#434654] hover:text-[#0052cc] p-1 border border-[#c3c6d6]/50 rounded-md hover:bg-white transition-colors cursor-pointer">
                        <span className="material-symbols-outlined text-base">description</span>
                      </button>
                    </td>
                  </tr>

                  <tr className="hover:bg-[#f8f9fb] transition-colors">
                    <td className="py-3.5 px-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden shrink-0">
                          <img
                            alt="James Taylor"
                            className="w-full h-full object-cover"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAxpQzOFYHryO37GalgHxs_ntSQ5fZ97NCkh6gBcniWCQuCxJtP_yGAzLbMDYvr9hRJXDZEjewM-5CxR8m6zrtwbWSM3hDTE1-6YwPP4L797xSF9hvnwoXpfzla760pIcyuuO6ENrztGj0mUWWgdK--Q8is2xyZlKY1zCB2GFvb_8ot7zjAo4OqXzeVaMnyjvQWWdImvEYSpoqUkO2S6ZoI1EvSsfgZN8ZmGmEqMYxMgELR4QjhsE1x"
                          />
                        </div>
                        <span className="font-bold text-[#191c1e]">James Taylor</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-2 text-[#434654]">Thu, Aug 6, 2:30 PM</td>
                    <td className="py-3.5 px-2 text-[#434654]">Anxiety Therapy</td>
                    <td className="py-3.5 px-2">
                      <span className="inline-block px-2.5 py-0.5 bg-[#ccfbf1] text-[#0d9488] text-[11px] font-bold rounded-full border border-[#0d9488]/20">
                        Completed
                      </span>
                    </td>
                    <td className="py-3.5 px-2 text-center">
                      <button className="text-[#434654] hover:text-[#0052cc] p-1 border border-[#c3c6d6]/50 rounded-md hover:bg-white transition-colors cursor-pointer">
                        <span className="material-symbols-outlined text-base">description</span>
                      </button>
                    </td>
                  </tr>

                  <tr className="hover:bg-[#f8f9fb] transition-colors">
                    <td className="py-3.5 px-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden shrink-0">
                          <img
                            alt="Olivia Martinez"
                            className="w-full h-full object-cover"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAxpQzOFYHryO37GalgHxs_ntSQ5fZ97NCkh6gBcniWCQuCxJtP_yGAzLbMDYvr9hRJXDZEjewM-5CxR8m6zrtwbWSM3hDTE1-6YwPP4L797xSF9hvnwoXpfzla760pIcyuuO6ENrztGj0mUWWgdK--Q8is2xyZlKY1zCB2GFvb_8ot7zjAo4OqXzeVaMnyjvQWWdImvEYSpoqUkO2S6ZoI1EvSsfgZN8ZmGmEqMYxMgELR4QjhsE1x"
                          />
                        </div>
                        <span className="font-bold text-[#191c1e]">Olivia Martinez</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-2 text-[#434654]">Wed, Aug 5, 11:00 AM</td>
                    <td className="py-3.5 px-2 text-[#434654]">Mindfulness Therapy</td>
                    <td className="py-3.5 px-2">
                      <span className="inline-block px-2.5 py-0.5 bg-[#ccfbf1] text-[#0d9488] text-[11px] font-bold rounded-full border border-[#0d9488]/20">
                        Completed
                      </span>
                    </td>
                    <td className="py-3.5 px-2 text-center">
                      <button className="text-[#434654] hover:text-[#0052cc] p-1 border border-[#c3c6d6]/50 rounded-md hover:bg-white transition-colors cursor-pointer">
                        <span className="material-symbols-outlined text-base">description</span>
                      </button>
                    </td>
                  </tr>

                  <tr className="hover:bg-[#f8f9fb] transition-colors">
                    <td className="py-3.5 px-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden shrink-0">
                          <img
                            alt="Daniel Anderson"
                            className="w-full h-full object-cover"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAxpQzOFYHryO37GalgHxs_ntSQ5fZ97NCkh6gBcniWCQuCxJtP_yGAzLbMDYvr9hRJXDZEjewM-5CxR8m6zrtwbWSM3hDTE1-6YwPP4L797xSF9hvnwoXpfzla760pIcyuuO6ENrztGj0mUWWgdK--Q8is2xyZlKY1zCB2GFvb_8ot7zjAo4OqXzeVaMnyjvQWWdImvEYSpoqUkO2S6ZoI1EvSsfgZN8ZmGmEqMYxMgELR4QjhsE1x"
                          />
                        </div>
                        <span className="font-bold text-[#191c1e]">Daniel Anderson</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-2 text-[#434654]">Wed, Aug 5, 9:00 AM</td>
                    <td className="py-3.5 px-2 text-[#434654]">CBT Session</td>
                    <td className="py-3.5 px-2">
                      <span className="inline-block px-2.5 py-0.5 bg-rose-100 text-rose-700 text-[11px] font-bold rounded-full border border-rose-200">
                        Cancelled
                      </span>
                    </td>
                    <td className="py-3.5 px-2 text-center">
                      <button className="text-[#434654] hover:text-[#0052cc] p-1 border border-[#c3c6d6]/50 rounded-md hover:bg-white transition-colors cursor-pointer">
                        <span className="material-symbols-outlined text-base">description</span>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-4 pt-3 border-t border-[#c3c6d6]/30 text-center">
              <a
                href="#all-appointments"
                className="inline-flex items-center gap-1 text-[#0052cc] text-xs font-bold hover:underline"
              >
                View All Appointments{' '}
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </a>
            </div>
          </section>
        </div>

        {/* Right Column (Today's Schedule & Quick Actions) */}
        <div className="space-y-8">
          {/* Today's Schedule Timeline */}
          <section className="bg-white rounded-2xl border border-[#c3c6d6]/40 shadow-xs p-6 flex flex-col h-[520px]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-heading font-bold text-[#191c1e]">Today's Schedule</h3>
              <a
                href="#schedule"
                className="text-[#0052cc] text-xs font-bold flex items-center gap-1 hover:underline"
              >
                View full calendar{' '}
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </a>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-[#191c1e] pb-3 border-b border-[#c3c6d6]/30 mb-4">
              <span className="material-symbols-outlined text-[#0052cc] text-base">
                calendar_month
              </span>
              <span>Fri, Aug 7, 2026</span>
            </div>

            {/* Timeline Items List */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-4">
              {/* Appt 1 */}
              <div className="relative flex gap-3 items-start group">
                <div className="w-16 text-right text-[11px] font-bold text-[#434654] pt-2 shrink-0">
                  10:00 AM
                </div>
                {/* Vertical Timeline Connector Line & Dot */}
                <div className="flex flex-col items-center self-stretch shrink-0">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#0d9488] ring-4 ring-[#ccfbf1] z-10 mt-2.5"></div>
                  <div className="w-0.5 flex-1 bg-[#0d9488]/30 my-1"></div>
                </div>
                <div className="flex-1 bg-[#ccfbf1]/40 border border-[#0d9488]/30 rounded-xl p-3 shadow-2xs flex justify-between items-center">
                  <div>
                    <h5 className="font-bold text-[#0d9488] text-xs mb-0.5">Alex Patient</h5>
                    <p className="text-[11px] text-[#434654]">CBT Session</p>
                  </div>
                  <button className="p-1 bg-white rounded-md border border-[#c3c6d6]/50 text-[#434654] hover:text-[#0052cc] cursor-pointer">
                    <span className="material-symbols-outlined text-sm">videocam</span>
                  </button>
                </div>
              </div>

              {/* Appt 2 */}
              <div className="relative flex gap-3 items-start group">
                <div className="w-16 text-right text-[11px] font-bold text-[#434654] pt-2 shrink-0">
                  11:00 AM
                </div>
                {/* Vertical Timeline Connector Line & Dot */}
                <div className="flex flex-col items-center self-stretch shrink-0">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#0052cc] ring-4 ring-[#e6f0ff] z-10 mt-2.5"></div>
                  <div className="w-0.5 flex-1 bg-[#0052cc]/30 my-1"></div>
                </div>
                <div className="flex-1 bg-[#e6f0ff]/50 border border-[#0052cc]/30 rounded-xl p-3 shadow-2xs flex justify-between items-center">
                  <div>
                    <h5 className="font-bold text-[#191c1e] text-xs mb-0.5">Jessica Miller</h5>
                    <p className="text-[11px] text-[#434654]">Mindfulness Therapy</p>
                  </div>
                  <button className="p-1 bg-white rounded-md border border-[#c3c6d6]/50 text-[#434654] hover:text-[#0052cc] cursor-pointer">
                    <span className="material-symbols-outlined text-sm">videocam</span>
                  </button>
                </div>
              </div>

              {/* Break */}
              <div className="relative flex gap-3 items-start group">
                <div className="w-16 text-right text-[11px] font-bold text-[#434654] pt-2 shrink-0">
                  01:00 PM
                </div>
                {/* Vertical Timeline Connector Line & Dot */}
                <div className="flex flex-col items-center self-stretch shrink-0">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-400 ring-4 ring-slate-100 z-10 mt-2.5"></div>
                  <div className="w-0.5 flex-1 bg-slate-300 my-1"></div>
                </div>
                <div className="flex-1 bg-slate-50 border border-[#c3c6d6]/40 rounded-xl p-3 shadow-2xs flex justify-between items-center">
                  <div>
                    <h5 className="font-bold text-[#191c1e] text-xs mb-0.5">Break</h5>
                    <p className="text-[11px] text-[#434654]">Lunch Time</p>
                  </div>
                  <span className="material-symbols-outlined text-sm text-[#434654]">
                    local_cafe
                  </span>
                </div>
              </div>

              {/* Appt 3 */}
              <div className="relative flex gap-3 items-start group">
                <div className="w-16 text-right text-[11px] font-bold text-[#434654] pt-2 shrink-0">
                  02:30 PM
                </div>
                {/* Vertical Timeline Connector Line & Dot */}
                <div className="flex flex-col items-center self-stretch shrink-0">
                  <div className="w-2.5 h-2.5 rounded-full bg-purple-600 ring-4 ring-purple-100 z-10 mt-2.5"></div>
                  <div className="w-0.5 flex-1 bg-purple-300 my-1"></div>
                </div>
                <div className="flex-1 bg-purple-50 border border-purple-200 rounded-xl p-3 shadow-2xs flex justify-between items-center">
                  <div>
                    <h5 className="font-bold text-purple-900 text-xs mb-0.5">Michael Brown</h5>
                    <p className="text-[11px] text-[#434654]">Anxiety Management</p>
                  </div>
                  <button className="p-1 bg-white rounded-md border border-[#c3c6d6]/50 text-[#434654] hover:text-purple-600 cursor-pointer">
                    <span className="material-symbols-outlined text-sm">videocam</span>
                  </button>
                </div>
              </div>

              {/* Appt 4 */}
              <div className="relative flex gap-3 items-start group">
                <div className="w-16 text-right text-[11px] font-bold text-[#434654] pt-2 shrink-0">
                  04:00 PM
                </div>
                {/* Vertical Timeline Connector Line & Dot */}
                <div className="flex flex-col items-center self-stretch shrink-0">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500 ring-4 ring-amber-100 z-10 mt-2.5"></div>
                  <div className="w-0.5 flex-1 bg-gradient-to-b from-amber-300 to-transparent my-1"></div>
                </div>
                <div className="flex-1 bg-[#fef3c7]/50 border border-amber-300 rounded-xl p-3 shadow-2xs flex justify-between items-center">
                  <div>
                    <h5 className="font-bold text-amber-900 text-xs mb-0.5">David Wilson</h5>
                    <p className="text-[11px] text-[#434654]">Depression Support</p>
                  </div>
                  <button className="p-1 bg-white rounded-md border border-[#c3c6d6]/50 text-[#434654] hover:text-amber-600 cursor-pointer">
                    <span className="material-symbols-outlined text-sm">videocam</span>
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Quick Actions Grid */}
          <section>
            <h3 className="text-lg font-heading font-bold text-[#191c1e] mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => navigate(ROUTES.THERAPIST.SCHEDULE)}
                className="bg-white border border-[#c3c6d6]/40 p-4 rounded-xl flex items-center gap-3 hover:border-[#0052cc] transition-colors text-left shadow-xs cursor-pointer"
              >
                <div className="w-9 h-9 rounded-lg bg-[#e6f0ff] text-[#0052cc] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-lg">event_available</span>
                </div>
                <span className="font-bold text-xs text-[#191c1e]">
                  Manage
                  <br />
                  Availability
                </span>
              </button>

              <button className="bg-white border border-[#c3c6d6]/40 p-4 rounded-xl flex items-center gap-3 hover:border-rose-500 transition-colors text-left shadow-xs cursor-pointer">
                <div className="w-9 h-9 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-lg">block</span>
                </div>
                <span className="font-bold text-xs text-[#191c1e]">
                  Add
                  <br />
                  Unavailability
                </span>
              </button>

              <button className="bg-white border border-[#c3c6d6]/40 p-4 rounded-xl flex items-center gap-3 hover:border-[#0d9488] transition-colors text-left shadow-xs cursor-pointer">
                <div className="w-9 h-9 rounded-lg bg-[#ccfbf1] text-[#0d9488] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-lg">chat</span>
                </div>
                <span className="font-bold text-xs text-[#191c1e]">
                  Message
                  <br />
                  Patient
                </span>
              </button>

              <button className="bg-white border border-[#c3c6d6]/40 p-4 rounded-xl flex items-center gap-3 hover:border-purple-600 transition-colors text-left shadow-xs cursor-pointer">
                <div className="w-9 h-9 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-lg">bar_chart</span>
                </div>
                <span className="font-bold text-xs text-[#191c1e]">
                  View
                  <br />
                  Reports
                </span>
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TherapistDashboardPage;
