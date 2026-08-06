import React, { useState } from 'react';
import { ArrowLeft, Calendar as CalendarIcon, Settings2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import type { AuthState } from '@/stores/authStore';
import {
  WeeklyScheduleForm,
  WeeklyAvailabilityCalendar,
  useTherapistScheduleConfig,
} from '@/features/therapist';
import { ROUTES } from '@/config/routes';

export const ScheduleManagementPage: React.FC = () => {
  const user = useAuthStore((state: AuthState) => state.user);
  const therapistId = user?.id || 'therapist-doc-1';

  const [activeTab, setActiveTab] = useState<'calendar' | 'rules'>('calendar');
  const { data: config, isLoading } = useTherapistScheduleConfig(therapistId);

  return (
    <div className="space-y-6 text-left w-full">
      {/* Navigation Header & Tab Switcher */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-2 border-b border-[#c3c6d6]/30">
        <div className="space-y-2">
          <Link
            to={ROUTES.THERAPIST.DASHBOARD}
            className="inline-flex items-center space-x-2 text-xs font-semibold text-[#505f76] hover:text-[#191c1e] transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Agenda</span>
          </Link>

          <div>
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-[#191c1e]">
              Weekly Availability & Schedule
            </h1>
            <p className="mt-1 text-xs md:text-sm text-[#434654]">
              Manage your weekly calendar availability, view booked sessions, and define working
              shift rules.
            </p>
          </div>
        </div>

        {/* View Selector Tabs */}
        <div className="flex bg-[#f8f9fb] p-1.5 rounded-xl border border-[#c3c6d6]/40 text-xs font-semibold shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('calendar')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all cursor-pointer ${
              activeTab === 'calendar'
                ? 'bg-white text-[#0052cc] shadow-xs font-bold'
                : 'text-[#434654] hover:text-[#191c1e]'
            }`}
          >
            <CalendarIcon className="w-4 h-4" />
            Weekly Calendar View
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('rules')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all cursor-pointer ${
              activeTab === 'rules'
                ? 'bg-white text-[#0052cc] shadow-xs font-bold'
                : 'text-[#434654] hover:text-[#191c1e]'
            }`}
          >
            <Settings2 className="w-4 h-4" />
            Shift & Buffer Rules
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      {activeTab === 'calendar' ? (
        <WeeklyAvailabilityCalendar />
      ) : isLoading ? (
        <div className="h-96 bg-slate-100 animate-pulse rounded-2xl border border-slate-200" />
      ) : (
        <WeeklyScheduleForm initialConfig={config} therapistId={therapistId} />
      )}
    </div>
  );
};

export default ScheduleManagementPage;
