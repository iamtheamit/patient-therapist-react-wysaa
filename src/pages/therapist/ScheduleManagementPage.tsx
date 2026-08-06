import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import type { AuthState } from '@/stores/authStore';
import { WeeklyScheduleForm, useTherapistScheduleConfig } from '@/features/therapist';
import { ROUTES } from '@/config/routes';

export const ScheduleManagementPage: React.FC = () => {
  const user = useAuthStore((state: AuthState) => state.user);
  const therapistId = user?.id || 'therapist-doc-1';

  const { data: config, isLoading } = useTherapistScheduleConfig(therapistId);

  return (
    <div className="space-y-8 text-left max-w-4xl mx-auto">
      {/* Navigation Header */}
      <div className="space-y-4">
        <Link
          to={ROUTES.THERAPIST.DASHBOARD}
          className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Agenda</span>
        </Link>

        <div>
          <h1 className="text-2xl font-black text-white">Working Hours & Availability Rules</h1>
          <p className="mt-1 text-xs text-slate-400">
            Define daily shifts, session lengths, and lunch break periods. Patients can only book
            slots within active shifts.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="h-96 bg-slate-900/60 animate-pulse rounded-2xl border border-slate-800" />
      ) : (
        <WeeklyScheduleForm initialConfig={config} therapistId={therapistId} />
      )}
    </div>
  );
};

export default ScheduleManagementPage;
