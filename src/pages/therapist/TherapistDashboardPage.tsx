import React, { useState } from 'react';
import { Calendar, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import type { AuthState } from '@/stores/authStore';
import {
  TherapistStatsGrid,
  AgendaList,
  useTherapistAgenda,
  useTherapistStats,
} from '@/features/therapist';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/config/routes';
import { cn } from '@/utils/cn';

export const TherapistDashboardPage: React.FC = () => {
  const user = useAuthStore((state: AuthState) => state.user);
  const therapistId = user?.id || 'therapist-doc-1';

  const [activeFilter, setActiveFilter] = useState<'ALL' | 'CONFIRMED' | 'COMPLETED'>('ALL');

  const { data: agenda, isLoading: isAgendaLoading } = useTherapistAgenda(therapistId);
  const { data: stats, isLoading: isStatsLoading } = useTherapistStats(therapistId);

  const filteredAgenda = agenda?.filter((item) => {
    if (activeFilter === 'CONFIRMED') return item.status === 'CONFIRMED';
    if (activeFilter === 'COMPLETED') return item.status === 'COMPLETED';
    return true;
  });

  return (
    <div className="space-y-8 text-left">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-extrabold text-[#191c1e]">
            Therapist Portal — Agenda
          </h1>
          <p className="mt-1 text-xs text-[#505f76]">
            Welcome back, {user?.name || 'Doctor'}. Manage today's sessions and record clinical
            progress notes.
          </p>
        </div>

        <Link to={ROUTES.THERAPIST.SCHEDULE}>
          <Button variant="secondary" size="md" leftIcon={<Settings className="w-4 h-4" />}>
            Configure Working Hours
          </Button>
        </Link>
      </div>

      {/* Quick Statistics Grid */}
      <TherapistStatsGrid stats={stats} isLoading={isStatsLoading} />

      {/* Agenda Filter Tabs */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-lg font-heading font-bold text-[#191c1e] flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#005237]" />
            <span>Scheduled Appointments</span>
          </h3>

          {/* Filter Pills */}
          <div className="flex items-center space-x-1 p-1 bg-white border border-slate-200 rounded-xl shadow-sm">
            {(['ALL', 'CONFIRMED', 'COMPLETED'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-semibold transition',
                  activeFilter === filter
                    ? 'bg-[#005237] text-white shadow-sm'
                    : 'text-[#505f76] hover:text-[#191c1e]',
                )}
              >
                {filter === 'ALL' ? 'All Sessions' : filter}
              </button>
            ))}
          </div>
        </div>

        {/* Agenda List Component */}
        <AgendaList items={filteredAgenda} isLoading={isAgendaLoading} therapistId={therapistId} />
      </div>
    </div>
  );
};

export default TherapistDashboardPage;
