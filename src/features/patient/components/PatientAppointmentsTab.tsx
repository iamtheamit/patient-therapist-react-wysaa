import React, { useState, useMemo } from 'react';
import { useAuthStore } from '@/stores/authStore';
import type { AuthState } from '@/stores/authStore';
import { usePatientAppointments } from '../hooks/usePatientAppointments';
import { AppointmentCard } from './AppointmentCard';
import { EmptyState } from '@/components/common/EmptyState';

export type FilterTab = 'all' | 'upcoming' | 'past' | 'holds' | 'failed';

export const PatientAppointmentsTab: React.FC = () => {
  const user = useAuthStore((state: AuthState) => state.user);
  const patientId = user?.id || 'patient-user-1';

  const { data: appointments = [], isLoading } = usePatientAppointments(patientId);

  const [activeTab, setActiveTab] = useState<FilterTab>('all');

  const filteredAppointments = useMemo(() => {
    const now = new Date();
    return appointments.filter((appt) => {
      const apptDate = new Date(appt.startTime);
      if (activeTab === 'upcoming') {
        return (
          apptDate >= now &&
          (appt.status === 'CONFIRMED' || appt.status === 'SCHEDULED' || appt.status === 'HELD')
        );
      }
      if (activeTab === 'past') {
        return (
          (apptDate < now || appt.status === 'COMPLETED' || appt.status === 'CANCELLED') &&
          appt.status !== 'HOLD_EXPIRED' &&
          appt.status !== 'PAYMENT_FAILED'
        );
      }
      if (activeTab === 'holds') {
        return appt.status === 'HELD';
      }
      if (activeTab === 'failed') {
        return appt.status === 'HOLD_EXPIRED' || appt.status === 'PAYMENT_FAILED';
      }
      return true;
    });
  }, [appointments, activeTab]);

  const upcomingCount = useMemo(() => {
    const now = new Date();
    return appointments.filter(
      (a) =>
        new Date(a.startTime) >= now &&
        a.status !== 'CANCELLED' &&
        a.status !== 'HOLD_EXPIRED' &&
        a.status !== 'PAYMENT_FAILED',
    ).length;
  }, [appointments]);

  const pastCount = useMemo(() => {
    const now = new Date();
    return appointments.filter(
      (a) =>
        (new Date(a.startTime) < now || a.status === 'COMPLETED') &&
        a.status !== 'HOLD_EXPIRED' &&
        a.status !== 'PAYMENT_FAILED',
    ).length;
  }, [appointments]);

  const failedCount = useMemo(() => {
    return appointments.filter((a) => a.status === 'HOLD_EXPIRED' || a.status === 'PAYMENT_FAILED')
      .length;
  }, [appointments]);

  const activeHoldsCount = useMemo(() => {
    return appointments.filter((a) => a.status === 'HELD').length;
  }, [appointments]);

  return (
    <div className="space-y-6 text-left w-full">
      {/* Navigation Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#c3c6d6]/40 pb-4">
        <div className="flex flex-wrap items-center gap-2 bg-[#f8f9fb] p-1.5 rounded-xl border border-[#c3c6d6]/40 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-lg transition-all ${
              activeTab === 'all'
                ? 'bg-[#003d9b] text-white shadow-xs'
                : 'text-[#51606f] hover:text-[#191c1e] hover:bg-white/60'
            }`}
          >
            All Appointments ({appointments.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('upcoming')}
            className={`px-4 py-2 rounded-lg transition-all ${
              activeTab === 'upcoming'
                ? 'bg-[#003d9b] text-white shadow-xs'
                : 'text-[#51606f] hover:text-[#191c1e] hover:bg-white/60'
            }`}
          >
            Upcoming ({upcomingCount})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('past')}
            className={`px-4 py-2 rounded-lg transition-all ${
              activeTab === 'past'
                ? 'bg-[#003d9b] text-white shadow-xs'
                : 'text-[#51606f] hover:text-[#191c1e] hover:bg-white/60'
            }`}
          >
            Past ({pastCount})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('holds')}
            className={`px-4 py-2 rounded-lg transition-all ${
              activeTab === 'holds'
                ? 'bg-[#003d9b] text-white shadow-xs'
                : 'text-[#51606f] hover:text-[#191c1e] hover:bg-white/60'
            }`}
          >
            Active Holds ({activeHoldsCount})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('failed')}
            className={`px-4 py-2 rounded-lg transition-all ${
              activeTab === 'failed'
                ? 'bg-[#003d9b] text-white shadow-xs'
                : 'text-[#51606f] hover:text-[#191c1e] hover:bg-white/60'
            }`}
          >
            Failed ({failedCount})
          </button>
        </div>
      </div>

      {/* Appointments List */}
      <div className="space-y-4 w-full">
        {isLoading ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-[#c3c6d6]/40 text-xs text-[#51606f] animate-pulse">
            Loading your appointments...
          </div>
        ) : filteredAppointments.length === 0 ? (
          <EmptyState
            title="No Appointments Found"
            description={
              activeTab === 'all'
                ? "You don't have any appointments scheduled yet."
                : `There are currently no ${activeTab} appointments.`
            }
            actionLabel={activeTab !== 'all' ? 'View All Appointments' : undefined}
            onAction={activeTab !== 'all' ? () => setActiveTab('all') : undefined}
          />
        ) : (
          <div className="space-y-4">
            {filteredAppointments.map((appt) => (
              <AppointmentCard key={appt.id} appointment={appt} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
