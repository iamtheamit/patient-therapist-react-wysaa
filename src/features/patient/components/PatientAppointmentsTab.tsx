import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Calendar as CalendarIcon,
  X,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import type { AuthStoreState } from '@/stores/authStore';
import { usePatientAppointments } from '../hooks/usePatientAppointments';
import { AppointmentCard } from './AppointmentCard';
import { EmptyState } from '@/components/common/EmptyState';
import type { PatientAppointment } from '../types/patient.types';
import type { AppointmentFilters } from '../api/patientApi';

export type FilterTab = 'all' | 'upcoming' | 'past' | 'holds' | 'failed';

export const PatientAppointmentsTab: React.FC = () => {
  const user = useAuthStore((state: AuthStoreState) => state.user);
  const patientId = user?.id || 'patient-user-1';

  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [currentTime, setCurrentTime] = useState<number>(() => Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Reset page to 1 when filters change
  const handleTabChange = (tab: FilterTab) => {
    setActiveTab(tab);
    setPage(1);
  };

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setPage(1);
  };

  const handleStartDateChange = (val: string) => {
    setStartDate(val);
    setPage(1);
  };

  const handleEndDateChange = (val: string) => {
    setEndDate(val);
    setPage(1);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setStartDate('');
    setEndDate('');
    setPage(1);
  };

  const hasActiveFilters = Boolean(searchQuery || startDate || endDate);

  const filters: AppointmentFilters = useMemo(
    () => ({
      search: searchQuery.trim() || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      status: activeTab,
      page,
      limit,
    }),
    [searchQuery, startDate, endDate, activeTab, page, limit],
  );

  const { data: responseData, isLoading, isError } = usePatientAppointments(patientId, filters);

  const appointments = responseData?.items || [];
  const total = responseData?.total || 0;
  const totalPages = responseData?.totalPages || 1;

  const isHoldActive = (appt: PatientAppointment, nowMs: number) => {
    const statusStr = appt.status as string;
    const isHold = statusStr === 'HELD' || statusStr === 'HOLD';
    if (!isHold) return false;
    if (!appt.holdExpiresAt) return true;
    return new Date(appt.holdExpiresAt).getTime() > nowMs;
  };

  const filteredAppointments = useMemo(() => {
    const now = new Date(currentTime);
    return appointments.filter((appt) => {
      const apptDate = new Date(appt.startTime);
      const statusStr = appt.status as string;
      if (activeTab === 'upcoming') {
        return apptDate >= now && (statusStr === 'CONFIRMED' || statusStr === 'SCHEDULED');
      }
      if (activeTab === 'past') {
        return (
          (apptDate < now || statusStr === 'COMPLETED' || statusStr === 'CANCELLED') &&
          statusStr !== 'HOLD_EXPIRED' &&
          statusStr !== 'PAYMENT_FAILED'
        );
      }
      if (activeTab === 'holds') {
        return isHoldActive(appt, currentTime);
      }
      if (activeTab === 'failed') {
        const isExpiredHold =
          (statusStr === 'HELD' || statusStr === 'HOLD') && !isHoldActive(appt, currentTime);
        return statusStr === 'HOLD_EXPIRED' || statusStr === 'PAYMENT_FAILED' || isExpiredHold;
      }
      return true;
    });
  }, [appointments, activeTab, currentTime]);

  const upcomingCount = useMemo(() => {
    const now = new Date(currentTime);
    return appointments.filter((a) => {
      const statusStr = a.status as string;
      return (
        new Date(a.startTime) >= now &&
        statusStr !== 'CANCELLED' &&
        statusStr !== 'HOLD_EXPIRED' &&
        statusStr !== 'PAYMENT_FAILED' &&
        statusStr !== 'HELD' &&
        statusStr !== 'HOLD'
      );
    }).length;
  }, [appointments, currentTime]);

  const pastCount = useMemo(() => {
    const now = new Date(currentTime);
    return appointments.filter((a) => {
      const statusStr = a.status as string;
      return (
        (new Date(a.startTime) < now || statusStr === 'COMPLETED') &&
        statusStr !== 'HOLD_EXPIRED' &&
        statusStr !== 'PAYMENT_FAILED'
      );
    }).length;
  }, [appointments, currentTime]);

  const failedCount = useMemo(() => {
    return appointments.filter((a) => {
      const statusStr = a.status as string;
      const isExpiredHold =
        (statusStr === 'HELD' || statusStr === 'HOLD') && !isHoldActive(a, currentTime);
      return statusStr === 'HOLD_EXPIRED' || statusStr === 'PAYMENT_FAILED' || isExpiredHold;
    }).length;
  }, [appointments, currentTime]);

  const activeHoldsCount = useMemo(() => {
    return appointments.filter((a) => isHoldActive(a, currentTime)).length;
  }, [appointments, currentTime]);

  return (
    <div className="space-y-6 text-left w-full">
      {/* Navigation Filter Tabs & Search Controls Bar */}
      <div className="space-y-4 border-b border-[#c3c6d6]/40 pb-4">
        {/* Status Tabs */}
        <div className="flex flex-wrap items-center gap-2 bg-[#f8f9fb] p-1.5 rounded-xl border border-[#c3c6d6]/40 text-xs font-semibold">
          <button
            type="button"
            onClick={() => handleTabChange('all')}
            className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
              activeTab === 'all'
                ? 'bg-[#003d9b] text-white shadow-xs'
                : 'text-[#51606f] hover:text-[#191c1e] hover:bg-white/60'
            }`}
          >
            All Appointments ({appointments.length})
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('upcoming')}
            className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
              activeTab === 'upcoming'
                ? 'bg-[#003d9b] text-white shadow-xs'
                : 'text-[#51606f] hover:text-[#191c1e] hover:bg-white/60'
            }`}
          >
            Upcoming ({upcomingCount})
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('past')}
            className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
              activeTab === 'past'
                ? 'bg-[#003d9b] text-white shadow-xs'
                : 'text-[#51606f] hover:text-[#191c1e] hover:bg-white/60'
            }`}
          >
            Past ({pastCount})
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('holds')}
            className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
              activeTab === 'holds'
                ? 'bg-[#003d9b] text-white shadow-xs'
                : 'text-[#51606f] hover:text-[#191c1e] hover:bg-white/60'
            }`}
          >
            Active Holds ({activeHoldsCount})
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('failed')}
            className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
              activeTab === 'failed'
                ? 'bg-[#003d9b] text-white shadow-xs'
                : 'text-[#51606f] hover:text-[#191c1e] hover:bg-white/60'
            }`}
          >
            Failed ({failedCount})
          </button>
        </div>

        {/* Backend Search & Date Range Filter Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
          {/* Search Bar */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-[#51606f] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search therapist or session topic..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 bg-[#f8f9fb] border border-[#c3c6d6]/50 rounded-xl text-xs text-[#191c1e] focus:outline-none focus:border-[#003d9b] transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => handleSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Date Range Inputs */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 bg-[#f8f9fb] px-3 py-1.5 border border-[#c3c6d6]/50 rounded-xl">
              <CalendarIcon className="w-3.5 h-3.5 text-[#003d9b]" />
              <span className="text-[11px] font-semibold text-[#51606f]">From:</span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => handleStartDateChange(e.target.value)}
                className="bg-transparent text-xs text-[#191c1e] focus:outline-none font-medium cursor-pointer"
              />
            </div>

            <div className="flex items-center gap-1.5 bg-[#f8f9fb] px-3 py-1.5 border border-[#c3c6d6]/50 rounded-xl">
              <CalendarIcon className="w-3.5 h-3.5 text-[#003d9b]" />
              <span className="text-[11px] font-semibold text-[#51606f]">To:</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => handleEndDateChange(e.target.value)}
                className="bg-transparent text-xs text-[#191c1e] focus:outline-none font-medium cursor-pointer"
              />
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-[#51606f] hover:text-[#191c1e] rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Appointments List */}
      <div className="space-y-4 w-full">
        {isLoading ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-[#c3c6d6]/40 text-xs text-[#51606f] animate-pulse">
            Loading your appointments...
          </div>
        ) : isError ? (
          <EmptyState
            title="Failed to Load Appointments"
            description="We encountered an error loading your appointments from the server. Please check your connection or try again."
            actionLabel="Try Again"
            onAction={handleClearFilters}
          />
        ) : filteredAppointments.length === 0 ? (
          <EmptyState
            title="No Appointments Found"
            description={
              hasActiveFilters
                ? 'No appointments match your search or date range filters.'
                : activeTab === 'all'
                  ? "You don't have any appointments scheduled yet."
                  : `There are currently no ${activeTab} appointments.`
            }
            actionLabel={
              hasActiveFilters
                ? 'Reset Filters'
                : activeTab !== 'all'
                  ? 'View All Appointments'
                  : undefined
            }
            onAction={
              hasActiveFilters
                ? handleClearFilters
                : activeTab !== 'all'
                  ? () => handleTabChange('all')
                  : undefined
            }
          />
        ) : (
          <div className="space-y-4">
            {filteredAppointments.map((appt) => (
              <AppointmentCard key={appt.id} appointment={appt} />
            ))}
          </div>
        )}
      </div>

      {/* Backend Pagination Bar */}
      {total > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#c3c6d6]/40 text-xs text-[#51606f]">
          <div className="flex items-center gap-2">
            <span>
              Showing{' '}
              <strong className="text-[#191c1e]">{Math.min((page - 1) * limit + 1, total)}</strong>{' '}
              - <strong className="text-[#191c1e]">{Math.min(page * limit, total)}</strong> of{' '}
              <strong className="text-[#191c1e]">{total}</strong> appointments
            </span>
            <div className="flex items-center gap-1 ml-3">
              <span>Per page:</span>
              <select
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setPage(1);
                }}
                className="bg-[#f8f9fb] border border-[#c3c6d6]/50 rounded-lg px-2 py-1 text-xs text-[#191c1e] font-semibold focus:outline-none cursor-pointer"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#c3c6d6]/50 bg-white hover:bg-[#f8f9fb] disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold text-[#191c1e] transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <span className="font-semibold px-2 text-[#191c1e]">
              Page {page} of {totalPages}
            </span>

            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#c3c6d6]/50 bg-white hover:bg-[#f8f9fb] disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold text-[#191c1e] transition-colors cursor-pointer"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
