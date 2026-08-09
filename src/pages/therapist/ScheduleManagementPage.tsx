import React, { useState } from 'react';
import { Calendar as CalendarIcon, Settings2 } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import type { AuthStoreState } from '@/stores/authStore';
import {
  WeeklyScheduleForm,
  WeeklyAvailabilityCalendar,
  useTherapistScheduleConfig,
} from '@/features/therapist';

export const ScheduleManagementPage: React.FC = () => {
  const user = useAuthStore((state: AuthStoreState) => state.user);
  const therapistId = user?.id || 'therapist-doc-1';

  const [searchParams] = useSearchParams();
  const initialView = (searchParams.get('view') as 'day' | 'week' | 'month') ?? 'week';

  const [activeTab, setActiveTab] = useState<'calendar' | 'rules'>('calendar');
  const { data: config, isLoading } = useTherapistScheduleConfig(therapistId);

  return (
    <div className="space-y-4 text-left w-full">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#c3c6d6]/40">
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-[#191c1e]">
            Schedule & Availability
          </h1>
          <p className="text-xs md:text-sm text-[#434654] mt-1">
            Manage weekly agenda and define appointment shift windows.
          </p>
        </div>

        {/* View Selector Tabs */}
        <div className="flex bg-[#f8f9fb] p-1.5 rounded-2xl border border-[#c3c6d6]/40 text-xs font-semibold overflow-x-auto shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('calendar')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'calendar'
                ? 'bg-[#0052cc] text-white shadow-xs font-bold'
                : 'text-[#434654] hover:text-[#191c1e]'
            }`}
          >
            <CalendarIcon className="w-4 h-4" />
            Weekly Calendar
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('rules')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'rules'
                ? 'bg-[#0052cc] text-white shadow-xs font-bold'
                : 'text-[#434654] hover:text-[#191c1e]'
            }`}
          >
            <Settings2 className="w-4 h-4" />
            Shift Rules
          </button>
        </div>
      </div>

      {/* Tab 1: Weekly Calendar Grid */}
      {activeTab === 'calendar' && <WeeklyAvailabilityCalendar initialView={initialView} />}

      {/* Tab 2: Working Shift Rules */}
      {activeTab === 'rules' && (
        <div className="space-y-4">
          {isLoading ? (
            <div className="h-96 bg-slate-100 animate-pulse rounded-2xl border border-slate-200" />
          ) : (
            <WeeklyScheduleForm
              key={config ? 'loaded' : 'loading'}
              initialConfig={config}
              therapistId={therapistId}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default ScheduleManagementPage;
