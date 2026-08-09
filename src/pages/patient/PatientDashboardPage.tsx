import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calendar, Clock, Video, Timer, Plus, ArrowRight, CalendarX } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import type { AuthState } from '@/stores/authStore';
import { ROUTES } from '@/config/routes';
import {
  PatientAppointmentsTab,
  QuickTherapistSearch,
  AppointmentBookingDrawer,
  PatientScheduleCalendar,
} from '@/features/patient';
import { useDashboard } from '@/features/dashboard';
import type { PatientDashboardData, DashboardAppointment } from '@/features/dashboard';
import { useBookAppointment } from '@/features/appointments/hooks/useBookAppointment';
import type { TherapistProfile } from '@/features/appointments';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';

// Encapsulated ActiveHoldCard with ticking timer to optimize rendering lifecycle
const ActiveHoldCard: React.FC<{
  hold: DashboardAppointment;
  onCheckout: (hold: DashboardAppointment) => void;
}> = ({ hold, onCheckout }) => {
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    const expires = hold.holdExpiresAt ? new Date(hold.holdExpiresAt).getTime() : Date.now();
    const update = () => {
      setTimeLeft(Math.max(0, Math.floor((expires - Date.now()) / 1000)));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [hold.holdExpiresAt]);

  if (timeLeft <= 0) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <div className="bg-emerald-50/50 border border-emerald-200/60 rounded-xl p-4 space-y-2 text-left">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-xs">
          <Clock className="w-3.5 h-3.5 text-emerald-600" />
          <span>
            Today,{' '}
            {new Date(hold.startTime).toLocaleTimeString(undefined, {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>
        <span className="text-emerald-700 text-[10px] font-bold bg-white px-2 py-0.5 rounded-full shadow-2xs border border-emerald-200/60 animate-pulse">
          Expires in {formattedTime}
        </span>
      </div>
      <h4 className="font-heading font-bold text-sm text-[#191c1e]">
        {hold.therapist?.name || 'Therapist Session'}
      </h4>
      <p className="text-xs text-[#51606f] font-medium pb-2">
        {new Date(hold.startTime).toLocaleDateString(undefined, {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
        })}{' '}
        •{' '}
        {new Date(hold.startTime).toLocaleTimeString(undefined, {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </p>
      <button
        onClick={() => onCheckout(hold)}
        className="w-full text-center bg-white border border-emerald-600 text-emerald-700 hover:bg-emerald-50 py-2 rounded-xl text-xs font-bold transition-colors shadow-2xs cursor-pointer"
      >
        Continue Booking
      </button>
    </div>
  );
};

export const PatientDashboardPage: React.FC = () => {
  const user = useAuthStore((state: AuthState) => state.user);
  const firstName = user?.name ? user.name.split(' ')[0] : 'Alex';
  const location = useLocation();

  const isAppointmentsView = location.hash === '#appointments' || location.hash === '#holds';
  const isBookView = location.hash === '#book';

  const [selectedTherapistForBooking, setSelectedTherapistForBooking] =
    useState<TherapistProfile | null>(null);
  const [isBookingDrawerOpen, setIsBookingDrawerOpen] = useState(false);
  const [selectedHoldForCheckout, setSelectedHoldForCheckout] =
    useState<DashboardAppointment | null>(null);

  const { data: dashboardData, isLoading } = useDashboard();
  const { mutate: bookSingle, isPending: isBooking } = useBookAppointment();

  // Extract patient-specific data from unified dashboard response
  const patientData =
    dashboardData?.role === 'PATIENT' ? (dashboardData as PatientDashboardData) : null;
  const nextSession = patientData?.nextSession ?? null;
  const upcomingList = patientData?.upcomingAppointments?.slice(0, 3) ?? [];
  const activeHold = patientData?.activeHolds?.[0] ?? null;

  const handleSelectTherapist = (therapist: TherapistProfile) => {
    setSelectedTherapistForBooking(therapist);
    setIsBookingDrawerOpen(true);
  };

  return (
    <div className="space-y-8 text-left w-full">
      {/* Page Header */}
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

      {/* Main View */}
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
          <div className="lg:col-span-2 space-y-6 flex flex-col justify-between">
            {nextSession ? (
              /* Next Session Hero Card */
              <div className="relative overflow-hidden rounded-2xl bg-[#003d9b] text-white shadow-sm">
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
                      <span className="text-[#b2c5ff] text-xs font-medium">
                        ID: {nextSession.id.toUpperCase().substring(0, 8)}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mt-2">
                    <div>
                      <h2 className="font-heading text-xl md:text-2xl font-bold mb-1.5 text-white">
                        Session with {nextSession.therapist?.name || 'your Therapist'}
                      </h2>
                      <p className="text-[#b2c5ff] text-xs font-semibold mb-5">
                        {nextSession.therapist?.specialization ||
                          'Cognitive Behavioral Therapy (CBT)'}
                      </p>

                      <div className="flex flex-wrap gap-2.5 mb-6">
                        <div className="bg-black/20 backdrop-blur-sm px-3.5 py-1.5 rounded-xl flex items-center gap-2 text-xs font-medium border border-white/10">
                          <Calendar className="w-3.5 h-3.5 text-[#b2c5ff]" />
                          {new Date(nextSession.startTime).toLocaleDateString(undefined, {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </div>
                        <div className="bg-black/20 backdrop-blur-sm px-3.5 py-1.5 rounded-xl flex items-center gap-2 text-xs font-medium border border-white/10">
                          <Clock className="w-3.5 h-3.5 text-[#b2c5ff]" />
                          {new Date(nextSession.startTime).toLocaleTimeString(undefined, {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
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
                      <div className="flex items-center gap-3 w-full md:w-auto mt-2 md:mt-0">
                        {nextSession.meetingLink && (
                          <a
                            href={nextSession.meetingLink}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
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
                          </a>
                        )}
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
            ) : (
              /* No Upcoming Sessions Placeholder Hero */
              <div className="relative overflow-hidden rounded-2xl bg-[#003d9b] text-white shadow-sm">
                <div className="absolute -top-8 -right-8 w-52 h-52 opacity-[0.18] pointer-events-none">
                  <div className="absolute top-1/2 left-0 w-full h-[34%] -translate-y-1/2 bg-white rounded-2xl" />
                  <div className="absolute left-1/2 top-0 h-full w-[34%] -translate-x-1/2 bg-white rounded-2xl" />
                </div>
                <div className="relative p-6 md:p-8 flex flex-col h-full z-10 text-left">
                  <h2 className="font-heading text-xl md:text-2xl font-bold mb-2 text-white">
                    No upcoming sessions
                  </h2>
                  <p className="text-[#b2c5ff] text-xs font-semibold mb-6 leading-relaxed max-w-md">
                    Consistently taking time for therapy builds resilience and support. Start
                    scheduling your sessions with our verified practitioners.
                  </p>
                  <Link to={`${ROUTES.PATIENT.BOOK}`}>
                    <Button
                      variant="white"
                      size="md"
                      pill
                      className="font-extrabold text-[#003d9b] w-fit"
                    >
                      Book a Session
                    </Button>
                  </Link>
                </div>
              </div>
            )}

            {/* Upcoming Appointments List */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#c3c6d6]/40 overflow-hidden flex flex-col flex-1">
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

              <div className="p-6 flex-1 flex flex-col justify-center">
                {isLoading ? (
                  <div className="py-8 text-center text-xs text-[#51606f] animate-pulse flex flex-col items-center justify-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                      <Clock className="w-5 h-5 animate-spin" />
                    </div>
                    <span>Checking schedules...</span>
                  </div>
                ) : upcomingList.length === 0 ? (
                  <div className="py-6 px-4 text-center bg-[#f8f9fb]/60 border border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center gap-2.5 my-auto min-h-[140px]">
                    <div className="w-10 h-10 rounded-full bg-blue-50 text-[#003d9b] flex items-center justify-center border border-blue-100 shadow-2xs">
                      <CalendarX className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#191c1e]">No upcoming sessions found</p>
                      <p className="text-[11px] text-[#51606f] font-medium mt-0.5">
                        No upcoming booked &amp; paid sessions found.
                      </p>
                    </div>
                    <Link to={ROUTES.PATIENT.BOOK}>
                      <button className="mt-0.5 px-3.5 py-1.5 bg-[#003d9b] hover:bg-[#0052cc] text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer">
                        Book a Session
                      </button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {upcomingList.map((appt) => {
                      const startDate = new Date(appt.startTime);
                      const initials = (appt.therapist?.name || 'T')
                        .replace('Dr. ', '')
                        .split(' ')
                        .map((n: string) => n[0])
                        .join('')
                        .toUpperCase()
                        .substring(0, 2);
                      return (
                        <div
                          key={appt.id}
                          className="border border-[#c3c6d6]/40 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[#003d9b]/40 hover:shadow-xs transition-all bg-[#f8f9fb]/40"
                        >
                          <div className="flex items-center gap-3.5">
                            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#003d9b] to-[#0052cc] text-white font-bold text-xs flex items-center justify-center border border-white shadow-xs shrink-0 select-none">
                              {initials}
                            </div>
                            <div>
                              <h4 className="font-heading font-bold text-sm text-[#191c1e]">
                                {appt.therapist?.name || 'Therapist'}
                              </h4>
                              <p className="text-xs text-[#51606f] font-semibold">
                                {appt.therapist?.specialization ||
                                  'Cognitive Behavioral Therapy (CBT)'}
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 sm:gap-5 text-xs text-[#51606f]">
                            <div className="flex items-center gap-1.5 font-medium">
                              <Calendar className="w-3.5 h-3.5 text-[#003d9b]" />
                              {startDate.toLocaleDateString('en-US', {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric',
                              })}
                            </div>
                            <div className="flex items-center gap-1.5 font-medium">
                              <Clock className="w-3.5 h-3.5 text-[#003d9b]" />
                              {startDate.toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </div>
                            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200/60 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                              Confirmed
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="p-3 bg-[#f8f9fb] border-t border-slate-100 text-center mt-auto">
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
          <div className="space-y-6 flex flex-col justify-between">
            {/* Dynamic Interactive Calendar Widget */}
            <PatientScheduleCalendar />

            {/* Active Hold Widget */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#c3c6d6]/40 p-5 space-y-4 flex-1 flex flex-col justify-between">
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

              {activeHold ? (
                <ActiveHoldCard
                  hold={activeHold}
                  onCheckout={(hold) => setSelectedHoldForCheckout(hold)}
                />
              ) : (
                <div className="p-4 bg-slate-50/50 border border-slate-200/60 rounded-xl text-center text-xs text-[#51606f] font-medium">
                  No active slot holds.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Checkout Confirmation Modal */}
      {selectedHoldForCheckout && (
        <Modal
          isOpen={Boolean(selectedHoldForCheckout)}
          onClose={() => setSelectedHoldForCheckout(null)}
          title="Complete Session Payment"
          description="Review your held appointment details and confirm payment to secure your booking."
        >
          <div className="space-y-4 pt-2 text-[#191c1e] text-xs">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <h4 className="font-heading font-bold text-sm text-[#191c1e]">
                {selectedHoldForCheckout.therapist?.name || 'Therapist Session'}
              </h4>
              <p className="text-secondary font-medium">
                {selectedHoldForCheckout.therapist?.specialization ||
                  'Cognitive Behavioral Therapy (CBT)'}
              </p>
              <div className="pt-2 border-t border-slate-200/60 flex justify-between font-bold text-[#191c1e]">
                <span>Date:</span>
                <span>
                  {new Date(selectedHoldForCheckout.startTime).toLocaleDateString(undefined, {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>
              <div className="flex justify-between font-bold text-[#191c1e]">
                <span>Time:</span>
                <span>
                  {new Date(selectedHoldForCheckout.startTime).toLocaleTimeString(undefined, {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-b border-slate-100 py-3.5 font-bold">
              <span className="text-[#51606f]">Session Fee:</span>
              <span className="text-lg text-[#191c1e]">$150.00</span>
            </div>

            <div className="p-3 bg-[#e5eeff] text-[#003d9b] rounded-xl border border-[#0052cc]/20 flex items-center gap-2 font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#0052cc] animate-ping shrink-0" />
              <span>Secure payment via HSA/FSA Card (•••• 4242)</span>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
              <Button variant="ghost" size="sm" onClick={() => setSelectedHoldForCheckout(null)}>
                Back
              </Button>
              <Button
                variant="primary"
                size="sm"
                isLoading={isBooking}
                onClick={() => {
                  bookSingle(
                    {
                      patientId: selectedHoldForCheckout.patientId,
                      therapistId:
                        selectedHoldForCheckout.therapistId ||
                        selectedHoldForCheckout.therapist?.id ||
                        '',
                      slotId: `slot-${selectedHoldForCheckout.id}`,
                      holdId: selectedHoldForCheckout.id,
                      therapistName: selectedHoldForCheckout.therapist?.name || 'Therapist',
                    },
                    {
                      onSuccess: () => {
                        setSelectedHoldForCheckout(null);
                      },
                    },
                  );
                }}
              >
                Confirm &amp; Pay $150
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default PatientDashboardPage;
