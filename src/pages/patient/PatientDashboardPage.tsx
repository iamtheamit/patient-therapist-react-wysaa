import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import type { AuthState } from '@/stores/authStore';
import { ROUTES } from '@/config/routes';

export const PatientDashboardPage: React.FC = () => {
  const user = useAuthStore((state: AuthState) => state.user);
  const firstName = user?.name ? user.name.split(' ')[0] : 'Alex';

  return (
    <div className="space-y-8 text-left">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl font-bold text-[#191c1e] flex items-center gap-2">
            Welcome back, {firstName}! <span className="text-3xl"></span>
          </h1>
          <p className="text-[#434654] mt-1 text-sm">
            Here's your therapy journey overview. Stay consistent and take care of yourself.
          </p>
        </div>
        <Link
          to={ROUTES.PATIENT.BOOK}
          className="bg-[#003d9b] hover:bg-[#003d9b]/90 text-white font-semibold py-3 px-6 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 w-full md:w-auto"
        >
          <span className="material-symbols-outlined">add</span>
          Book New Session
        </Link>
      </div>

      {/* Main Dashboard Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (Hero Card & Appointments) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Next Session Hero Card */}
          <div className="relative overflow-hidden rounded-xl bg-[#003d9b] text-white shadow-md">
            {/* ── Medical cross illustration layer ──────────────────── */}
            {/* Large cross – top right, overflows corner */}
            <div className="absolute -top-8 -right-8 w-52 h-52 opacity-[0.18] pointer-events-none">
              {/* horizontal bar */}
              <div className="absolute top-1/2 left-0 w-full h-[34%] -translate-y-1/2 bg-white rounded-2xl" />
              {/* vertical bar */}
              <div className="absolute left-1/2 top-0 h-full w-[34%] -translate-x-1/2 bg-white rounded-2xl" />
            </div>
            {/* Medium cross – bottom left */}
            <div className="absolute -bottom-6 -left-6 w-36 h-36 opacity-[0.22] pointer-events-none">
              <div className="absolute top-1/2 left-0 w-full h-[34%] -translate-y-1/2 bg-white rounded-xl" />
              <div className="absolute left-1/2 top-0 h-full w-[34%] -translate-x-1/2 bg-white rounded-xl" />
            </div>
            {/* Small cross – top left, subtle */}
            <div className="absolute top-8 left-10 w-10 h-10 opacity-[0.25] pointer-events-none">
              <div className="absolute top-1/2 left-0 w-full h-[34%] -translate-y-1/2 bg-white rounded-md" />
              <div className="absolute left-1/2 top-0 h-full w-[34%] -translate-x-1/2 bg-white rounded-md" />
            </div>
            {/* Soft glow blob behind the large cross */}
            <div className="absolute -top-10 -right-10 w-64 h-64 rounded-full bg-[#0041a3]/70 blur-3xl pointer-events-none" />
            {/* Content */}
            <div className="relative p-6 md:p-8 flex flex-col h-full z-10">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <span className="bg-emerald-500/20 text-emerald-100 px-2 py-1 rounded text-xs font-semibold flex items-center gap-1 uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                    Next Session
                  </span>
                  <span className="text-[#b2c5ff] text-sm">ID: APP-101</span>
                </div>
              </div>

              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mt-2">
                <div>
                  <h2 className="font-heading text-xl md:text-2xl font-semibold mb-2 text-white">
                    Session with Dr. Sarah Connor
                  </h2>
                  <p className="text-[#b2c5ff] text-sm mb-6">Cognitive Behavioral Therapy (CBT)</p>

                  <div className="flex flex-wrap gap-3 mb-8">
                    <div className="bg-black/20 backdrop-blur-sm px-4 py-2 rounded-lg flex items-center gap-2 text-sm border border-white/10">
                      <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                      Fri, Aug 7, 2026
                    </div>
                    <div className="bg-black/20 backdrop-blur-sm px-4 py-2 rounded-lg flex items-center gap-2 text-sm border border-white/10">
                      <span className="material-symbols-outlined text-[18px]">schedule</span>
                      10:00 AM – 10:50 AM
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-sm text-[#b2c5ff]">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px]">timer</span>
                      50 min
                    </div>
                    <div className="w-px h-4 bg-white/20"></div>
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px]">videocam</span>
                      Video Session
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center md:items-end gap-6 w-full md:w-auto">
                  <img
                    alt="Dr. Sarah Connor"
                    className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-[#f8f9fb] object-cover shadow-sm hidden md:block"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDllZUXRO5e7rF6Up-dc4pvNDJ0qWv7OphWn2vlLZcPEn3gJis9Q7DOo0DilkDLApu90FgIYAkRaz6PoaBtXIdwAKFLCg9BuwN4-IrK4xmi4NwRId8AiVCXUdfMbvWkwvXO3_591mt9jq8yU818JRbO8uNorJahJ37S2IGe_wRKmqy4ECkBTkkg0fARTOXTKWrQ8RtKeK8_tdah2K5_EyvC1HYbsRa1hRoGa6vQBOitJ0QrtVfJxECd"
                  />
                  <div className="flex items-center gap-4 w-full md:w-auto mt-4 md:mt-0">
                    <button className="bg-white text-[#003d9b] hover:bg-[#f8f9fb] font-semibold py-3 px-6 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 w-full md:w-auto flex-1 text-sm">
                      <span className="material-symbols-outlined">videocam</span>
                      Join Session
                    </button>
                    <Link
                      to={ROUTES.PATIENT.BOOK}
                      className="text-white hover:text-[#b2c5ff] transition-colors flex items-center gap-1 font-semibold text-xs whitespace-nowrap"
                    >
                      View Details
                      <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming Appointments List */}
          <div className="bg-white rounded-xl shadow-sm border border-[#c3c6d6]/30 overflow-hidden">
            <div className="px-6 py-4 border-b border-[#c3c6d6]/30 flex justify-between items-center bg-[#f8f9fb]">
              <h3 className="font-heading font-semibold text-lg text-[#191c1e]">
                Upcoming Appointments
              </h3>
              <Link
                to={ROUTES.PATIENT.BOOK}
                className="text-[#003d9b] hover:text-[#0052cc] transition-colors font-semibold text-xs flex items-center gap-1"
              >
                View all
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
            </div>

            <div className="p-4 space-y-3">
              {/* List Item 1 */}
              <div className="border border-[#c3c6d6]/50 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[#003d9b]/30 hover:shadow-sm transition-all bg-[#f8f9fb]/50">
                <div className="flex items-center gap-4">
                  <img
                    alt="Dr. Sarah Connor"
                    className="w-12 h-12 rounded-full object-cover shadow-sm"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDTf1ffvDkCcFUrkgufSLU5b5rl5E0xYYSfZ1ssnFH-TctvnOzXWey_6Qe-Jd0Ck0b-TsXxVTNdCdKqehwfBNnpFxLAC2kV-n-dDwfE-qpzhT52oWqYgoHZ3Il6FYHeKtIj4tO2VotciFst6JlxEgBpJW6y8iAjgR88DEy4PsgRctla5fSXqPlmJ6I0vwJyDBAh9b-QxBdI49Y3kt96Tg_DyJ4j_4QZuJ8M0LDAxnKZmF1BbLT63qCe"
                  />
                  <div>
                    <h4 className="font-heading font-semibold text-[#191c1e]">Dr. Sarah Connor</h4>
                    <p className="text-xs text-[#434654]">Cognitive Behavioral Therapy (CBT)</p>
                  </div>
                </div>

                <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 sm:gap-6 text-sm text-[#434654]">
                  <div className="flex items-center gap-1.5 min-w-[120px]">
                    <span className="material-symbols-outlined text-[16px] text-[#003d9b]">
                      calendar_today
                    </span>
                    Fri, Aug 7, 2026
                  </div>
                  <div className="flex items-center gap-1.5 min-w-[90px]">
                    <span className="material-symbols-outlined text-[16px] text-[#003d9b]">
                      schedule
                    </span>
                    10:00 AM
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded text-xs font-medium">
                      Confirmed
                    </span>
                    <button className="text-[#737685] hover:text-[#191c1e] transition-colors">
                      <span className="material-symbols-outlined">more_vert</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* List Item 2 */}
              <div className="border border-[#c3c6d6]/50 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[#003d9b]/30 hover:shadow-sm transition-all bg-[#f8f9fb]/50">
                <div className="flex items-center gap-4">
                  <img
                    alt="Dr. Marcus Vance"
                    className="w-12 h-12 rounded-full object-cover shadow-sm"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCqZmuUQmcTVzJTMOdgIeA6noCDs1eRLKlJaPfthz5mrVwLWqmpQX2h-Doj7HkphDsRhTwWR388HV8Hrrz9suhMoYYMDkWXLiAgbTYOL0hELQT9g5a_EJfzin8N9hNg8CVb1HR30zxjKcwjQAh0h9ts8RZRI0TqzbeAW8kIeGapeVzZt8r9M2NCNPrC_Z0bYcHB7K4DxyFUO9DCA4_lQIjEWxDwQFQHMd00m7bm8aa1f3eNhpVD9AMA"
                  />
                  <div>
                    <h4 className="font-heading font-semibold text-[#191c1e]">Dr. Marcus Vance</h4>
                    <p className="text-xs text-[#434654]">Mindfulness &amp; Depression Care</p>
                  </div>
                </div>

                <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 sm:gap-6 text-sm text-[#434654]">
                  <div className="flex items-center gap-1.5 min-w-[120px]">
                    <span className="material-symbols-outlined text-[16px] text-[#003d9b]">
                      calendar_today
                    </span>
                    Thu, Aug 13, 2026
                  </div>
                  <div className="flex items-center gap-1.5 min-w-[90px]">
                    <span className="material-symbols-outlined text-[16px] text-[#003d9b]">
                      schedule
                    </span>
                    02:30 PM
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded text-xs font-medium">
                      Confirmed
                    </span>
                    <button className="text-[#737685] hover:text-[#191c1e] transition-colors">
                      <span className="material-symbols-outlined">more_vert</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3 bg-[#f8f9fb]/30 border-t border-[#c3c6d6]/30 text-center">
              <Link
                to={ROUTES.PATIENT.BOOK}
                className="text-[#003d9b] font-semibold text-xs hover:underline inline-flex items-center justify-center gap-1 py-1"
              >
                View All Appointments
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column (Calendar, Holds, Quick Actions) */}
        <div className="space-y-6">
          {/* Calendar Widget */}
          <div className="bg-white rounded-xl shadow-sm border border-[#c3c6d6]/30 p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-heading font-semibold text-[#191c1e] text-sm">Your Schedule</h3>
              <Link
                to={ROUTES.PATIENT.BOOK}
                className="text-[#003d9b] hover:text-[#0052cc] transition-colors text-xs font-semibold flex items-center gap-1"
              >
                View full calendar
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </Link>
            </div>

            {/* Mini Calendar Header */}
            <div className="flex justify-between items-center mb-4 text-[#191c1e] text-sm font-semibold">
              <button
                type="button"
                className="p-1 hover:bg-[#f3f4f6] rounded-full transition-colors"
              >
                <span className="material-symbols-outlined text-lg">chevron_left</span>
              </button>
              <span>August 2026</span>
              <button
                type="button"
                className="p-1 hover:bg-[#f3f4f6] rounded-full transition-colors"
              >
                <span className="material-symbols-outlined text-lg">chevron_right</span>
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 text-center text-xs mb-4">
              <div className="text-[#434654] font-medium py-1">Sun</div>
              <div className="text-[#434654] font-medium py-1">Mon</div>
              <div className="text-[#434654] font-medium py-1">Tue</div>
              <div className="text-[#434654] font-medium py-1">Wed</div>
              <div className="text-[#434654] font-medium py-1">Thu</div>
              <div className="text-[#434654] font-medium py-1">Fri</div>
              <div className="text-[#434654] font-medium py-1">Sat</div>

              {/* Prev Month */}
              <div className="py-1.5 text-[#c3c6d6]">26</div>
              <div className="py-1.5 text-[#c3c6d6]">27</div>
              <div className="py-1.5 text-[#c3c6d6]">28</div>
              <div className="py-1.5 text-[#c3c6d6]">29</div>
              <div className="py-1.5 text-[#c3c6d6]">30</div>
              <div className="py-1.5 text-[#c3c6d6]">31</div>

              {/* Current Month */}
              <div className="py-1.5 hover:bg-[#f3f4f6] rounded cursor-pointer">1</div>
              <div className="py-1.5 hover:bg-[#f3f4f6] rounded cursor-pointer">2</div>
              <div className="py-1.5 hover:bg-[#f3f4f6] rounded cursor-pointer">3</div>
              <div className="py-1.5 hover:bg-[#f3f4f6] rounded cursor-pointer">4</div>
              <div className="py-1.5 hover:bg-[#f3f4f6] rounded cursor-pointer">5</div>
              <div className="py-1.5 hover:bg-[#f3f4f6] rounded cursor-pointer">6</div>
              <div className="py-1.5 bg-[#003d9b] text-white rounded font-semibold cursor-pointer shadow-sm relative">
                7
                <span className="absolute bottom-0.5 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full"></span>
              </div>
              <div className="py-1.5 hover:bg-[#f3f4f6] rounded cursor-pointer">8</div>
              <div className="py-1.5 hover:bg-[#f3f4f6] rounded cursor-pointer">9</div>
              <div className="py-1.5 hover:bg-[#f3f4f6] rounded cursor-pointer">10</div>
              <div className="py-1.5 hover:bg-[#f3f4f6] rounded cursor-pointer">11</div>
              <div className="py-1.5 hover:bg-[#f3f4f6] rounded cursor-pointer">12</div>
              <div className="py-1.5 hover:bg-[#f3f4f6] rounded cursor-pointer relative">
                13
                <span className="absolute bottom-0.5 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-[#003d9b] rounded-full"></span>
              </div>
              <div className="py-1.5 hover:bg-[#f3f4f6] rounded cursor-pointer">14</div>
              <div className="py-1.5 hover:bg-[#f3f4f6] rounded cursor-pointer relative">
                15
                <span className="absolute bottom-0.5 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-emerald-500 rounded-full"></span>
              </div>
              <div className="py-1.5 hover:bg-[#f3f4f6] rounded cursor-pointer">16</div>
              <div className="py-1.5 hover:bg-[#f3f4f6] rounded cursor-pointer">17</div>
              <div className="py-1.5 hover:bg-[#f3f4f6] rounded cursor-pointer">18</div>
              <div className="py-1.5 hover:bg-[#f3f4f6] rounded cursor-pointer">19</div>
              <div className="py-1.5 hover:bg-[#f3f4f6] rounded cursor-pointer">20</div>
              <div className="py-1.5 hover:bg-[#f3f4f6] rounded cursor-pointer">21</div>
              <div className="py-1.5 hover:bg-[#f3f4f6] rounded cursor-pointer">22</div>
              <div className="py-1.5 hover:bg-[#f3f4f6] rounded cursor-pointer">23</div>
              <div className="py-1.5 hover:bg-[#f3f4f6] rounded cursor-pointer">24</div>
              <div className="py-1.5 hover:bg-[#f3f4f6] rounded cursor-pointer">25</div>
              <div className="py-1.5 hover:bg-[#f3f4f6] rounded cursor-pointer">26</div>
              <div className="py-1.5 hover:bg-[#f3f4f6] rounded cursor-pointer">27</div>
              <div className="py-1.5 hover:bg-[#f3f4f6] rounded cursor-pointer">28</div>
              <div className="py-1.5 hover:bg-[#f3f4f6] rounded cursor-pointer">29</div>
              <div className="py-1.5 hover:bg-[#f3f4f6] rounded cursor-pointer">30</div>
              <div className="py-1.5 hover:bg-[#f3f4f6] rounded cursor-pointer">31</div>
              <div className="py-1.5 text-[#c3c6d6]">1</div>
              <div className="py-1.5 text-[#c3c6d6]">2</div>
              <div className="py-1.5 text-[#c3c6d6]">3</div>
              <div className="py-1.5 text-[#c3c6d6]">4</div>
              <div className="py-1.5 text-[#c3c6d6]">5</div>
            </div>

            {/* Legend */}
            <div className="flex gap-4 text-[10px] text-[#434654] justify-center pt-2 border-t border-[#c3c6d6]/30">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-[#003d9b] rounded-full"></span> Has appointment
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> Has hold
              </div>
            </div>
          </div>

          {/* Active Hold Widget */}
          <div className="bg-white rounded-xl shadow-sm border border-[#c3c6d6]/30 p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-heading font-semibold text-[#191c1e] text-sm">Active Hold</h3>
              <Link
                to={ROUTES.PATIENT.BOOK}
                className="text-[#003d9b] hover:text-[#0052cc] transition-colors text-xs font-semibold flex items-center gap-1"
              >
                View all
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </Link>
            </div>

            <div className="bg-emerald-50/50 border border-emerald-100 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-600 bg-emerald-100 p-1 rounded-md text-[16px]">
                    schedule
                  </span>
                  <span className="text-emerald-700 font-semibold text-xs">Today, 11:30 AM</span>
                </div>
                <span className="text-emerald-700 text-xs font-medium bg-white px-2 py-0.5 rounded shadow-sm border border-emerald-100 animate-pulse">
                  Expires in 00:45
                </span>
              </div>
              <h4 className="font-heading font-semibold text-[#191c1e] text-sm">
                Dr. Sarah Connor
              </h4>
              <p className="text-xs text-[#434654] mb-4">Fri, Aug 7, 2026 • 11:00 AM</p>
              <Link
                to={ROUTES.PATIENT.BOOK}
                className="w-full inline-block text-center bg-white border border-emerald-600 text-emerald-700 hover:bg-emerald-50 py-2 rounded-lg text-sm font-semibold transition-colors shadow-xs"
              >
                Continue Booking
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboardPage;
