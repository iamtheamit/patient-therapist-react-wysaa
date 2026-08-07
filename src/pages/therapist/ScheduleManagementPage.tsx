import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Settings2,
  Sliders,
  CalendarX,
  CheckCircle2,
  Plus,
  Trash2,
  AlertTriangle,
  Save,
} from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import type { AuthState } from '@/stores/authStore';
import {
  WeeklyScheduleForm,
  WeeklyAvailabilityCalendar,
  useTherapistScheduleConfig,
} from '@/features/therapist';

import { useUIStore } from '@/stores/uiStore';
import type { UIState } from '@/stores/uiStore';
import { CustomSelect } from '@/components/ui/CustomSelect';

interface DateOverride {
  id: string;
  date: string;
  reason: string;
  isBlocked: boolean;
}

export const ScheduleManagementPage: React.FC = () => {
  const user = useAuthStore((state: AuthState) => state.user);
  const therapistId = user?.id || 'therapist-doc-1';
  const addToast = useUIStore((state: UIState) => state.addToast);

  const [searchParams] = useSearchParams();
  const initialView = (searchParams.get('view') as 'day' | 'week' | 'month') ?? 'week';

  const [activeTab, setActiveTab] = useState<'calendar' | 'rules' | 'availability' | 'exceptions'>(
    'calendar',
  );
  const { data: config, isLoading } = useTherapistScheduleConfig(therapistId);

  // Intake & Capacity Settings
  const [maxPatientsPerDay, setMaxPatientsPerDay] = useState(6);
  const [sessionDuration, setSessionDuration] = useState(50);
  const [bufferDuration, setBufferDuration] = useState(10);
  const [advanceNoticeHours, setAdvanceNoticeHours] = useState(24);

  // Vacation / Out-of-Office Blockouts
  const [overrides, setOverrides] = useState<DateOverride[]>([
    {
      id: 'ov-1',
      date: '2026-08-15',
      reason: 'Annual Clinical Symposium (Conference)',
      isBlocked: true,
    },
    {
      id: 'ov-2',
      date: '2026-09-01',
      reason: 'Labor Day Holiday',
      isBlocked: true,
    },
  ]);

  const [newDate, setNewDate] = useState('');
  const [newReason, setNewReason] = useState('');

  const handleAddOverride = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDate || !newReason.trim()) return;

    setOverrides((prev) => [
      ...prev,
      {
        id: `ov-${Date.now()}`,
        date: newDate,
        reason: newReason.trim(),
        isBlocked: true,
      },
    ]);

    setNewDate('');
    setNewReason('');
    addToast({
      type: 'success',
      title: 'Vacation Blocked',
      message: 'New out-of-office date saved to calendar rules.',
    });
  };

  const handleRemoveOverride = (id: string) => {
    setOverrides((prev) => prev.filter((o) => o.id !== id));
    addToast({
      type: 'info',
      title: 'Blockout Removed',
      message: 'Date unblocked for bookings.',
    });
  };

  const handleSaveAvailabilitySettings = () => {
    addToast({
      type: 'success',
      title: 'Settings Saved',
      message: 'Your booking limits and buffer preferences have been updated.',
    });
  };

  return (
    <div className="space-y-4 text-left w-full">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#c3c6d6]/40">
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-[#191c1e]">
            Schedule & Availability
          </h1>
          <p className="text-xs md:text-sm text-[#434654] mt-1">
            Manage weekly agenda, define shift rules, intake capacity, and vacation blockouts.
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

          <button
            type="button"
            onClick={() => setActiveTab('availability')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'availability'
                ? 'bg-[#0052cc] text-white shadow-xs font-bold'
                : 'text-[#434654] hover:text-[#191c1e]'
            }`}
          >
            <Sliders className="w-4 h-4" />
            Intake & Capacity
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('exceptions')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'exceptions'
                ? 'bg-[#0052cc] text-white shadow-xs font-bold'
                : 'text-[#434654] hover:text-[#191c1e]'
            }`}
          >
            <CalendarX className="w-4 h-4" />
            Vacation Blockouts
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
            <WeeklyScheduleForm initialConfig={config} therapistId={therapistId} />
          )}
        </div>
      )}

      {/* Tab 3: Capacity Settings */}
      {activeTab === 'availability' && (
        <div className="space-y-6 max-w-5xl">
          {/* Capacity Limits & Buffer Rules */}
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-[#c3c6d6]/40 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-base font-heading font-bold text-[#191c1e]">
                <Sliders className="w-5 h-5 text-[#0052cc]" />
                Daily Capacity & Buffer Rules
              </div>

              <button
                type="button"
                onClick={handleSaveAvailabilitySettings}
                className="px-4 py-2 bg-[#0052cc] hover:bg-[#0041a3] text-white rounded-xl text-xs font-semibold transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <Save className="w-4 h-4" />
                Save Capacity Settings
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="p-4 bg-[#f8f9fb] rounded-2xl border border-[#c3c6d6]/40 space-y-2">
                <CustomSelect
                  label="Max Patients Per Day"
                  value={maxPatientsPerDay.toString()}
                  onChange={(val) => setMaxPatientsPerDay(Number(val))}
                  options={[
                    { value: '4', label: '4 Patients / Day' },
                    { value: '6', label: '6 Patients / Day' },
                    { value: '8', label: '8 Patients / Day' },
                    { value: '10', label: '10 Patients / Day' },
                  ]}
                />
                <p className="text-[11px] text-[#505f76] mt-1">Prevents overbooking.</p>
              </div>

              <div className="p-4 bg-[#f8f9fb] rounded-2xl border border-[#c3c6d6]/40 space-y-2">
                <CustomSelect
                  label="Session Duration"
                  value={sessionDuration.toString()}
                  onChange={(val) => setSessionDuration(Number(val))}
                  options={[
                    { value: '30', label: '30 Minutes' },
                    { value: '45', label: '45 Minutes' },
                    { value: '50', label: '50 Minutes (Standard)' },
                    { value: '60', label: '60 Minutes' },
                  ]}
                />
                <p className="text-[11px] text-[#505f76] mt-1">Standard slot duration.</p>
              </div>

              <div className="p-4 bg-[#f8f9fb] rounded-2xl border border-[#c3c6d6]/40 space-y-2">
                <CustomSelect
                  label="Rest Buffer"
                  value={bufferDuration.toString()}
                  onChange={(val) => setBufferDuration(Number(val))}
                  options={[
                    { value: '0', label: '0 Minutes' },
                    { value: '10', label: '10 Minutes (Recommended)' },
                    { value: '15', label: '15 Minutes' },
                    { value: '30', label: '30 Minutes' },
                  ]}
                />
                <p className="text-[11px] text-[#505f76] mt-1">Buffer between sessions.</p>
              </div>

              <div className="p-4 bg-[#f8f9fb] rounded-2xl border border-[#c3c6d6]/40 space-y-2">
                <CustomSelect
                  label="Advance Notice"
                  value={advanceNoticeHours.toString()}
                  onChange={(val) => setAdvanceNoticeHours(Number(val))}
                  options={[
                    { value: '4', label: '4 Hours Notice' },
                    { value: '12', label: '12 Hours Notice' },
                    { value: '24', label: '24 Hours Notice (Default)' },
                    { value: '48', label: '48 Hours Notice' },
                  ]}
                />
                <p className="text-[11px] text-[#505f76] mt-1">Notice required before booking.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Out of Office & Vacation Blockout Dates */}
      {activeTab === 'exceptions' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-5xl">
          <div className="bg-white p-6 rounded-3xl border border-[#c3c6d6]/40 shadow-xs space-y-4 lg:col-span-1">
            <div className="flex items-center gap-2 text-base font-heading font-bold text-[#191c1e]">
              <CalendarX className="w-5 h-5 text-[#0052cc]" />
              Block Out Dates & Vacation
            </div>
            <p className="text-xs text-[#505f76]">
              Prevent clients from booking appointments on specific holidays, conferences, or
              personal leave.
            </p>

            <form onSubmit={handleAddOverride} className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-[#191c1e] mb-1.5">
                  Select Date
                </label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#f8f9fb] border border-[#c3c6d6]/50 rounded-xl text-xs text-[#191c1e] focus:outline-none focus:ring-2 focus:ring-[#0052cc]/30"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#191c1e] mb-1.5">
                  Reason / Description
                </label>
                <input
                  type="text"
                  placeholder="e.g. Medical Conference, Personal Vacation"
                  value={newReason}
                  onChange={(e) => setNewReason(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#f8f9fb] border border-[#c3c6d6]/50 rounded-xl text-xs text-[#191c1e] focus:outline-none focus:ring-2 focus:ring-[#0052cc]/30"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#0052cc] hover:bg-[#0041a3] text-white rounded-xl text-xs font-semibold transition flex items-center justify-center gap-2 shadow-2xs cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Add Date Blockout
              </button>
            </form>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#c3c6d6]/40 shadow-xs lg:col-span-2 space-y-4">
            <h3 className="text-base font-heading font-bold text-[#191c1e]">
              Active Out-of-Office Dates ({overrides.length})
            </h3>

            {overrides.length === 0 ? (
              <div className="p-8 text-center bg-[#f8f9fb] rounded-2xl border border-dashed border-[#c3c6d6]">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <p className="text-xs font-semibold text-[#191c1e]">No Vacation Blocks Active</p>
                <p className="text-[11px] text-[#505f76] mt-0.5">
                  Your standard practice schedule applies for all upcoming dates.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {overrides.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 bg-[#f8f9fb] rounded-2xl border border-[#c3c6d6]/40 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-xs shrink-0">
                        <AlertTriangle className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[#191c1e]">{item.reason}</h4>
                        <p className="text-[11px] text-[#0052cc] font-semibold mt-0.5">
                          {new Date(item.date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveOverride(item.id)}
                      className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                      title="Unblock date"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleManagementPage;
