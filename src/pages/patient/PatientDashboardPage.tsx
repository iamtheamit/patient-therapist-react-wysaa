import React from 'react';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import type { AuthState } from '@/stores/authStore';
import {
  PatientStatsGrid,
  UpcomingSessionHero,
  AppointmentCard,
  usePatientAppointments,
  usePatientStats,
} from '@/features/patient';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/config/routes';

export const PatientDashboardPage: React.FC = () => {
  const user = useAuthStore((state: AuthState) => state.user);
  const patientId = user?.id || 'patient-user-1';

  const { data: appointments, isLoading: isAppointmentsLoading } =
    usePatientAppointments(patientId);
  const { data: stats, isLoading: isStatsLoading } = usePatientStats(patientId);

  const upcomingAppointment = appointments?.find((a) => a.status === 'CONFIRMED');

  return (
    <div className="space-y-8 text-left">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-extrabold text-[#191c1e]">
            Welcome back, {user?.name || 'Patient'} 👋
          </h1>
          <p className="mt-1 text-xs text-[#505f76]">
            Track your mental wellness schedule and manage upcoming therapy appointments.
          </p>
        </div>

        <Link to={ROUTES.PATIENT.BOOK}>
          <Button variant="primary" size="md" leftIcon={<Plus className="w-4 h-4" />}>
            Book New Session
          </Button>
        </Link>
      </div>

      {/* Quick Statistics Grid */}
      <PatientStatsGrid stats={stats} isLoading={isStatsLoading} />

      {/* Upcoming Session Hero */}
      <UpcomingSessionHero appointment={upcomingAppointment} />

      {/* All Scheduled Sessions List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-heading font-bold text-[#191c1e]">
            Appointment History & Agenda
          </h3>
          <span className="text-xs text-[#505f76]">
            Showing {appointments?.length || 0} sessions
          </span>
        </div>

        {isAppointmentsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="h-40 bg-slate-100 animate-pulse rounded-2xl border border-slate-200"
              />
            ))}
          </div>
        ) : appointments && appointments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {appointments.map((appointment) => (
              <AppointmentCard key={appointment.id} appointment={appointment} />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-white border border-slate-200 rounded-2xl shadow-sm">
            <p className="text-sm text-[#505f76]">No appointments found in your history.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientDashboardPage;
