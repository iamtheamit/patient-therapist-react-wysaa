import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calendar, Clock, Video, Timer, Plus, ArrowRight } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import type { AuthState } from '@/stores/authStore';
import { ROUTES } from '@/config/routes';
import {
  PatientAppointmentsTab,
  QuickTherapistSearch,
  AppointmentBookingDrawer,
  PatientScheduleCalendar,
} from '@/features/patient';
import type { TherapistProfile } from '@/features/appointments';
import { Button } from '@/components/ui/Button';

export const PatientDashboardPage: React.FC = () => {
  const user = useAuthStore((state: AuthState) => state.user);
  const firstName = user?.name ? user.name.split(' ')[0] : 'Alex';
  const location = useLocation();

  const isAppointmentsView = location.hash === '#appointments' || location.hash === '#holds';
  const isBookView = location.hash === '#book';

  const [selectedTherapistForBooking, setSelectedTherapistForBooking] =
    useState<TherapistProfile | null>(null);
  const [isBookingDrawerOpen, setIsBookingDrawerOpen] = useState(false);

  const handleSelectTherapist = (therapist: TherapistProfile) => {
    setSelectedTherapistForBooking(therapist);
    setIsBookingDrawerOpen(true);
  };

  return (
    <div className="space-y-8 text-left w-full">
      {/* Dynamic Page Header Title - Standardized across all patient pages */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#c3c6d6]/30 pb-4">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl font-bold text-[#191c1e] flex items-center gap-2">
            {isAppointmentsView ? (
              'My Appointments'
            ) : isBookView ? (
              'Book Therapy Session'
            ) : (
              <>
                Welcome back, {firstName}! <span className="text-2xl md:text-3xl">👋</span>
              </>
            )}
          </h1>
          <p className="text-[#51606f] mt-1 text-xs">
            {isAppointmentsView
              ? 'View your scheduled therapy sessions, active slot holds, and session history.'
              : isBookView
                ? 'Search licensed practitioners and select your preferred date & time.'
                : "Here's your therapy journey overview. Stay consistent and take care of yourself."}
          </p>
        </div>

        <Link to={ROUTES.PATIENT.BOOK}>
          <Button
            variant="gradient"
            size="md"
            pill
            glow
            leftIcon={
              <span className="w-5 h-5 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center -ml-1 border border-white/20 transition-transform duration-300 group-hover:rotate-90">
                <Plus className="w-3.5 h-3.5 text-white stroke-[2.5]" />
              </span>
            }
          >
            Book New Session
          </Button>
        </Link>
      </div>

      {/* Main View rendering based on Sidemenu hash */}
      {isAppointmentsView ? (
        <PatientAppointmentsTab />
      ) : isBookView ? (
        <div className="space-y-6">
          <QuickTherapistSearch onSelectTherapist={handleSelectTherapist} />
          <AppointmentBookingDrawer
            isOpen={isBookingDrawerOpen}
            onClose={() => setIsBookingDrawerOpen(false)}
            therapist={selectedTherapistForBooking}
          />
        </div>
      ) : (
        /* Dashboard Overview View */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column (Hero Card & Appointments) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Next Session Hero Card */}
            <div className="relative overflow-hidden rounded-2xl bg-[#003d9b] text-white shadow-sm">
              {/* Medical cross illustration layer */}
              <div className="absolute -top-8 -right-8 w-52 h-52 opacity-[0.18] pointer-events-none">
                <div className="absolute top-1/2 left-0 w-full h-[34%] -translate-y-1/2 bg-white rounded-2xl" />
                <div className="absolute left-1/2 top-0 h-full w-[34%] -translate-x-1/2 bg-white rounded-2xl" />
              </div>
              <div className="absolute -bottom-6 -left-6 w-36 h-36 opacity-[0.22] pointer-events-none">
                <div className="absolute top-1/2 left-0 w-full h-[34%] -translate-y-1/2 bg-white rounded-xl" />
                <div className="absolute left-1/2 top-0 h-full w-[34%] -translate-x-1/2 bg-white rounded-xl" />
              </div>

              {/* Content */}
              <div className="relative p-6 md:p-8 flex flex-col h-full z-10">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <span className="bg-emerald-500/20 text-emerald-100 px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1.5 uppercase tracking-wider border border-emerald-400/30">
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                      Next Session
                    </span>
                    <span className="text-[#b2c5ff] text-xs font-medium">ID: APP-101</span>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mt-2">
                  <div>
                    <h2 className="font-heading text-xl md:text-2xl font-bold mb-1.5 text-white">
                      Session with Dr. Sarah Connor
                    </h2>
                    <p className="text-[#b2c5ff] text-xs font-semibold mb-5">
                      Cognitive Behavioral Therapy (CBT)
                    </p>

                    <div className="flex flex-wrap gap-2.5 mb-6">
                      <div className="bg-black/20 backdrop-blur-sm px-3.5 py-1.5 rounded-xl flex items-center gap-2 text-xs font-medium border border-white/10">
                        <Calendar className="w-3.5 h-3.5 text-[#b2c5ff]" />
                        Fri, Aug 7, 2026
                      </div>
                      <div className="bg-black/20 backdrop-blur-sm px-3.5 py-1.5 rounded-xl flex items-center gap-2 text-xs font-medium border border-white/10">
                        <Clock className="w-3.5 h-3.5 text-[#b2c5ff]" />
                        10:00 AM – 10:50 AM
                      </div>
                    </div>

                    <div className="flex items-center gap-5 text-xs text-[#b2c5ff]">
                      <div className="flex items-center gap-1.5">
                        <Timer className="w-3.5 h-3.5 text-[#b2c5ff]" />
                        50 min
                      </div>
                      <div className="w-px h-3.5 bg-white/20" />
                      <div className="flex items-center gap-1.5">
                        <Video className="w-3.5 h-3.5 text-[#b2c5ff]" />
                        Video Session
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-center md:items-end gap-5 w-full md:w-auto">
                    <img
                      alt="Dr. Sarah Connor"
                      className="w-20 h-20 md:w-22 md:h-22 rounded-full border-4 border-[#f8f9fb] object-cover shadow-sm hidden md:block"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDllZUXRO5e7rF6Up-dc4pvNDJ0qWv7OphWn2vlLZcPEn3gJis9Q7DOo0DilkDLApu90FgIYAkRaz6PoaBtXIdwAKFLCg9BuwN4-IrK4xmi4NwRId8AiVCXUdfMbvWkwvXO3_591mt9jq8yU818JRbO8uNorJahJ37S2IGe_wRKmqy4ECkBTkkg0fARTOXTKWrQ8RtKeK8_tdah2K5_EyvC1HYbsRa1hRoGa6vQBOitJ0QrtVfJxECd"
                    />
                    <div className="flex items-center gap-3 w-full md:w-auto mt-2 md:mt-0">
                      <Button
                        variant="white"
                        size="md"
                        pill
                        leftIcon={
                          <span className="relative flex items-center justify-center">
                            <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-emerald-400 opacity-75" />
                            <Video className="w-4 h-4 text-[#003d9b] relative z-10" />
                          </span>
                        }
                        className="font-extrabold text-[#003d9b]"
                      >
                        Join Session
                      </Button>
                      <Link
                        to={`${ROUTES.PATIENT.DASHBOARD}#appointments`}
                        className="group/link px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all duration-200 flex items-center gap-1.5 font-bold text-xs whitespace-nowrap backdrop-blur-xs hover:translate-x-0.5"
                      >
                        <span>View Details</span>
                        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-0.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Upcoming Appointments List */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#c3c6d6]/40 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-[#f8f9fb]">
                <h3 className="font-heading font-bold text-sm text-[#191c1e]">
                  Upcoming Appointments
                </h3>
                <Link
                  to={`${ROUTES.PATIENT.DASHBOARD}#appointments`}
                  className="text-[#003d9b] hover:text-[#0052cc] transition-colors font-bold text-xs flex items-center gap-1"
                >
                  View all
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="p-4 space-y-3">
                <div className="border border-[#c3c6d6]/40 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[#003d9b]/40 hover:shadow-xs transition-all bg-[#f8f9fb]/40">
                  <div className="flex items-center gap-3.5">
                    <img
                      alt="Dr. Sarah Connor"
                      className="w-11 h-11 rounded-full object-cover shadow-xs border border-white"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDTf1ffvDkCcFUrkgufSLU5b5rl5E0xYYSfZ1ssnFH-TctvnOzXWey_6Qe-Jd0Ck0b-TsXxVTNdCdKqehwfBNnpFxLAC2kV-n-dDwfE-qpzhT52oWqYgoHZ3Il6FYHeKtIj4tO2VotciFst6JlxEgBpJW6y8iAjgR88DEy4PsgRctla5fSXqPlmJ6I0vwJyDBAh9b-QxBdI49Y3kt96Tg_DyJ4j_4QZuJ8M0LDAxnKZmF1BbLT63qCe"
                    />
                    <div>
                      <h4 className="font-heading font-bold text-sm text-[#191c1e]">
                        Dr. Sarah Connor
                      </h4>
                      <p className="text-xs text-[#51606f] font-semibold">
                        Cognitive Behavioral Therapy (CBT)
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 sm:gap-5 text-xs text-[#51606f]">
                    <div className="flex items-center gap-1.5 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-[#003d9b]" />
                      Fri, Aug 7, 2026
                    </div>
                    <div className="flex items-center gap-1.5 font-medium">
                      <Clock className="w-3.5 h-3.5 text-[#003d9b]" />
                      10:00 AM
                    </div>
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-200/60 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                      Confirmed
                    </span>
                  </div>
                </div>

                <div className="border border-[#c3c6d6]/40 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[#003d9b]/40 hover:shadow-xs transition-all bg-[#f8f9fb]/40">
                  <div className="flex items-center gap-3.5">
                    <img
                      alt="Dr. Marcus Vance"
                      className="w-11 h-11 rounded-full object-cover shadow-xs border border-white"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCqZmuUQmcTVzJTMOdgIeA6noCDs1eRLKlJaPfthz5mrVwLWqmpQX2h-Doj7HkphDsRhTwWR388HV8Hrrz9suhMoYYMDkWXLiAgbTYOL0hELQT9g5a_EJfzin8N9hNg8CVb1HR30zxjKcwjQAh0h9ts8RZRI0TqzbeAW8kIeGapeVzZt8r9M2NCNPrC_Z0bYcHB7K4DxyFUO9DCA4_lQIjEWxDwQFQHMd00m7bm8aa1f3eNhpVD9AMA"
                    />
                    <div>
                      <h4 className="font-heading font-bold text-sm text-[#191c1e]">
                        Dr. Marcus Vance
                      </h4>
                      <p className="text-xs text-[#51606f] font-semibold">
                        Mindfulness &amp; Depression Care
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 sm:gap-5 text-xs text-[#51606f]">
                    <div className="flex items-center gap-1.5 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-[#003d9b]" />
                      Thu, Aug 13, 2026
                    </div>
                    <div className="flex items-center gap-1.5 font-medium">
                      <Clock className="w-3.5 h-3.5 text-[#003d9b]" />
                      02:30 PM
                    </div>
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-200/60 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                      Confirmed
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-[#f8f9fb] border-t border-slate-100 text-center">
                <Link
                  to={`${ROUTES.PATIENT.DASHBOARD}#appointments`}
                  className="text-[#003d9b] font-bold text-xs hover:underline inline-flex items-center justify-center gap-1 py-1"
                >
                  View All Appointments
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column (Calendar, Active Hold) */}
          <div className="space-y-6">
            {/* Dynamic Interactive Calendar Widget */}
            <PatientScheduleCalendar />

            {/* Active Hold Widget */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#c3c6d6]/40 p-5 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-heading font-bold text-sm text-[#191c1e]">Active Hold</h3>
                <Link
                  to={`${ROUTES.PATIENT.DASHBOARD}#holds`}
                  className="text-[#003d9b] hover:text-[#0052cc] transition-colors text-xs font-bold flex items-center gap-1"
                >
                  View all
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="bg-emerald-50/50 border border-emerald-200/60 rounded-xl p-4 space-y-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-xs">
                    <Clock className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Today, 11:30 AM</span>
                  </div>
                  <span className="text-emerald-700 text-[10px] font-bold bg-white px-2 py-0.5 rounded-full shadow-2xs border border-emerald-200/60 animate-pulse">
                    Expires in 00:45
                  </span>
                </div>
                <h4 className="font-heading font-bold text-sm text-[#191c1e]">Dr. Sarah Connor</h4>
                <p className="text-xs text-[#51606f] font-medium pb-2">
                  Fri, Aug 7, 2026 • 11:00 AM
                </p>
                <Link
                  to={`${ROUTES.PATIENT.DASHBOARD}#appointments`}
                  className="w-full inline-block text-center bg-white border border-emerald-600 text-emerald-700 hover:bg-emerald-50 py-2 rounded-xl text-xs font-bold transition-colors shadow-2xs"
                >
                  Continue Booking
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientDashboardPage;
