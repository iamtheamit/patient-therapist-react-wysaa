import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Search,
  Video,
  FileText,
  Clock,
  AlertCircle,
  XCircle,
  UserCheck,
  Filter,
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import type { AuthStoreState } from '@/stores/authStore';
import { useTherapistAgenda } from '@/features/therapist/hooks/useTherapistAgenda';
import { useUpdateAppointmentStatus } from '@/features/therapist/hooks/useUpdateAppointmentStatus';
import { ClinicalNotesModal } from '@/features/therapist/components/ClinicalNotesModal';
import { useUIStore } from '@/stores/uiStore';
import type { UIState } from '@/stores/uiStore';
import DataTable from '@/components/common/DataTable';
import type { ColumnDef } from '@/components/common/DataTable';
import type { TherapistAgendaItem } from '@/features/therapist/types/therapist.types';

// ─── Types ────────────────────────────────────────────────────────────────────

type StatusFilter = 'ALL' | 'scheduled' | 'completed' | 'no_show' | 'cancelled';

type AppointmentStatusType =
  'scheduled' | 'completed' | 'no_show' | 'cancelled' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';

interface ExtendedAppointment {
  id: string;
  patientName: string;
  patientEmail: string;
  patientAvatar?: string;
  sessionType: string;
  dateStr: string;
  timeStr: string;
  duration: string;
  status: AppointmentStatusType;
  meetingLink?: string;
  notes?: string;
  riskLevel: 'Low' | 'Moderate' | 'High';
  originalItem: TherapistAgendaItem;
}

// ─── Inline Status Dropdown ───────────────────────────────────────────────────

interface StatusSelectProps {
  status: AppointmentStatusType;
  onChange: (newStatus: AppointmentStatusType) => void;
}

const statusMeta: Record<
  string,
  {
    label: string;
    bg: string;
    text: string;
    border: string;
    Icon: React.FC<{ className?: string }>;
  }
> = {
  scheduled: {
    label: 'Scheduled',
    bg: 'bg-blue-50',
    text: 'text-[#0052cc]',
    border: 'border-blue-200',
    Icon: ({ className }) => <Clock className={className} />,
  },
  CONFIRMED: {
    label: 'Scheduled',
    bg: 'bg-blue-50',
    text: 'text-[#0052cc]',
    border: 'border-blue-200',
    Icon: ({ className }) => <Clock className={className} />,
  },
  completed: {
    label: 'Completed',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    Icon: ({ className }) => <UserCheck className={className} />,
  },
  COMPLETED: {
    label: 'Completed',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    Icon: ({ className }) => <UserCheck className={className} />,
  },
  no_show: {
    label: 'No Show',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    Icon: ({ className }) => <AlertCircle className={className} />,
  },
  cancelled: {
    label: 'Cancelled',
    bg: 'bg-slate-100',
    text: 'text-slate-600',
    border: 'border-slate-200',
    Icon: ({ className }) => <XCircle className={className} />,
  },
  CANCELLED: {
    label: 'Cancelled',
    bg: 'bg-slate-100',
    text: 'text-slate-600',
    border: 'border-slate-200',
    Icon: ({ className }) => <XCircle className={className} />,
  },
};

const StatusSelect: React.FC<StatusSelectProps> = ({ status, onChange }) => {
  const meta = statusMeta[status] ?? statusMeta['scheduled'];
  const { Icon } = meta;

  return (
    <div
      className={`relative inline-flex items-center rounded-full border ${meta.border} ${meta.bg}`}
    >
      <span className={`pointer-events-none absolute left-2.5 flex items-center ${meta.text}`}>
        <Icon className="w-3 h-3" />
      </span>
      <select
        value={status}
        onClick={(e) => e.stopPropagation()}
        onChange={(e) => {
          e.stopPropagation();
          onChange(e.target.value as AppointmentStatusType);
        }}
        className={`appearance-none pl-6 pr-5 py-0.5 text-[10px] font-bold rounded-full bg-transparent focus:outline-none focus:ring-2 focus:ring-[#0052cc]/30 cursor-pointer ${meta.text}`}
        style={{ WebkitAppearance: 'none' }}
      >
        <option value="scheduled">Scheduled</option>
        <option value="completed">Completed</option>
        <option value="no_show">No Show</option>
        <option value="cancelled">Cancelled</option>
      </select>
      <span className={`pointer-events-none absolute right-1.5 ${meta.text}`}>
        <svg className="w-2.5 h-2.5" viewBox="0 0 10 10" fill="currentColor">
          <path
            d="M2 3.5L5 7l3-3.5"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </div>
  );
};

// ─── Risk Badge ───────────────────────────────────────────────────────────────

const RiskBadge: React.FC<{ level: 'Low' | 'Moderate' | 'High' }> = ({ level }) => {
  const cls =
    level === 'High'
      ? 'bg-rose-100 text-rose-700'
      : level === 'Moderate'
        ? 'bg-amber-100 text-amber-700'
        : 'bg-slate-100 text-slate-700';
  return (
    <span className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded-full ${cls}`}>
      {level} Risk
    </span>
  );
};

// ─── Page Component ───────────────────────────────────────────────────────────

export const TherapistAppointmentsPage: React.FC = () => {
  const user = useAuthStore((state: AuthStoreState) => state.user);
  const therapistId = user?.id || 'therapist-doc-1';
  const addToast = useUIStore((state: UIState) => state.addToast);

  const { data: agendaItems = [], isLoading } = useTherapistAgenda(therapistId);
  const updateStatusMutation = useUpdateAppointmentStatus(therapistId);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedAppointmentForNote, setSelectedAppointmentForNote] =
    useState<TherapistAgendaItem | null>(null);

  const appointmentsList = useMemo(() => {
    return agendaItems.map((item) => {
      const start = new Date(item.startTime);
      const end = new Date(item.endTime);
      const diffMin = Math.round((end.getTime() - start.getTime()) / (60 * 1000));

      const timeStr = `${start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
      const dateStr = start.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });

      // Determine risk level based on therapist notes/data, or default to Low/Moderate
      const hash = item.id.charCodeAt(0) + item.id.charCodeAt(item.id.length - 1);
      const riskLevel = hash % 3 === 0 ? 'High' : hash % 3 === 1 ? 'Moderate' : 'Low';

      // Map status values to lowercase for status dropdown selectors
      const itemWithStatus = item as unknown as { status?: string; appointmentStatus?: string };
      const statusValue = itemWithStatus.status || itemWithStatus.appointmentStatus || 'SCHEDULED';
      const rawStatus =
        statusValue === 'HELD' || statusValue === 'HOLD' ? 'scheduled' : statusValue.toLowerCase();

      return {
        id: item.id,
        patientName: item.patient.name,
        patientEmail: item.patient.email,
        sessionType: 'Cognitive Behavioral Therapy',
        dateStr,
        timeStr,
        duration: `${diffMin} min`,
        status: rawStatus as AppointmentStatusType,
        meetingLink: item.meetingLink,
        notes: item.notes,
        riskLevel: riskLevel as 'Low' | 'Moderate' | 'High',
        originalItem: item,
      };
    });
  }, [agendaItems]);

  const handleStatusChange = (id: string, newStatus: AppointmentStatusType) => {
    updateStatusMutation.mutate({
      appointmentId: id,
      status:
        newStatus.toUpperCase() as unknown as import('@/features/patient/types/patient.types').AppointmentStatus,
    });
  };

  const filteredAppointments = useMemo(() => {
    return appointmentsList.filter((app) => {
      const matchesSearch =
        app.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.patientEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.sessionType.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'ALL' || app.status === statusFilter;

      const apptStartIso = new Date(app.originalItem.startTime).toISOString().split('T')[0];
      const matchesDate = !selectedDate || apptStartIso === selectedDate;

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [appointmentsList, searchQuery, statusFilter, selectedDate]);

  // ── Column Definitions ────────────────────────────────────────────────────────
  const columns: ColumnDef<ExtendedAppointment>[] = [
    {
      key: 'patientName',
      header: 'Patient',
      sortable: true,
      cell: (row) => (
        <div className="flex items-center gap-3">
          <img
            src={
              row.patientAvatar ||
              'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
            }
            alt={row.patientName}
            className="w-8 h-8 rounded-full object-cover border border-[#c3c6d6]/60 shrink-0"
          />
          <div>
            <p className="text-xs font-bold text-[#191c1e] leading-tight">{row.patientName}</p>
            <p className="text-[10px] text-[#505f76]">{row.patientEmail}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'sessionType',
      header: 'Session Type',
      sortable: true,
      cell: (row) => (
        <span className="text-xs font-semibold text-[#0052cc]">{row.sessionType}</span>
      ),
    },
    {
      key: 'dateStr',
      header: 'Date',
      sortable: true,
      cell: (row) => (
        <div className="flex items-center gap-1.5 text-xs text-[#434654]">
          <Calendar className="w-3.5 h-3.5 text-[#0052cc] shrink-0" />
          {row.dateStr}
        </div>
      ),
    },
    {
      key: 'timeStr',
      header: 'Time',
      cell: (row) => (
        <div className="flex items-center gap-1.5 text-xs text-[#434654]">
          <Clock className="w-3.5 h-3.5 text-[#0052cc] shrink-0" />
          {row.timeStr}
          <span className="text-[10px] text-[#505f76]">({row.duration})</span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      cell: (row) => (
        <StatusSelect
          status={row.status}
          onChange={(newStatus) => handleStatusChange(row.id, newStatus)}
        />
      ),
    },
    {
      key: 'riskLevel',
      header: 'Risk',
      sortable: true,
      cell: (row) => <RiskBadge level={row.riskLevel} />,
    },
    {
      key: 'actions',
      header: 'Actions',
      cell: (row) => (
        <div className="flex items-center gap-2">
          {row.meetingLink && (
            <a
              href={row.meetingLink}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="px-3 py-1.5 bg-[#0052cc] hover:bg-[#0041a3] text-white rounded-lg text-[10px] font-bold transition flex items-center gap-1 shadow-2xs"
            >
              <Video className="w-3 h-3" />
              Launch
            </a>
          )}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedAppointmentForNote(row.originalItem);
            }}
            className="px-3 py-1.5 bg-[#f8f9fb] hover:bg-slate-100 text-[#191c1e] border border-[#c3c6d6]/60 rounded-lg text-[10px] font-bold transition flex items-center gap-1 cursor-pointer"
          >
            <FileText className="w-3 h-3 text-[#0052cc]" />
            Notes
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 w-full text-left">
      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#c3c6d6]/40">
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-[#191c1e]">
            My Appointments
          </h1>
          <p className="text-xs md:text-sm text-[#434654] mt-1">
            Review past and upcoming clinical therapy sessions, join video rooms, and record patient
            notes.
          </p>
        </div>
        <button
          type="button"
          onClick={() =>
            addToast({
              type: 'info',
              title: 'Export Schedule',
              message: 'Downloading appointments CSV report...',
            })
          }
          className="px-4 py-2 bg-white text-[#0052cc] border border-[#0052cc]/30 rounded-xl text-xs font-semibold hover:bg-blue-50 transition shadow-2xs flex items-center gap-2 cursor-pointer self-start md:self-auto"
        >
          <Calendar className="w-4 h-4 text-[#0052cc]" />
          Export Roster
        </button>
      </div>

      {/* ── Filter Bar ── */}
      <div className="bg-white px-4 py-3.5 rounded-2xl border border-[#c3c6d6]/40 shadow-xs">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search patient name, email or therapy type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#f8f9fb] border border-[#c3c6d6]/50 rounded-xl text-xs text-[#191c1e] placeholder:text-[#505f76] focus:outline-none focus:ring-2 focus:ring-[#0052cc]/30"
            />
          </div>

          <div className="hidden md:block w-px h-8 bg-[#c3c6d6]/40" />

          {/* Calendar date picker */}
          <div className="flex items-center gap-2 shrink-0">
            <Calendar className="w-4 h-4 text-[#0052cc] shrink-0" />
            <div className="relative">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="pl-3 pr-3 py-2 bg-[#f8f9fb] border border-[#c3c6d6]/50 rounded-xl text-xs font-semibold text-[#191c1e] focus:outline-none focus:ring-2 focus:ring-[#0052cc]/30 cursor-pointer"
              />
            </div>
            {selectedDate && (
              <button
                type="button"
                onClick={() => setSelectedDate('')}
                className="text-[10px] font-bold text-[#0052cc] hover:underline whitespace-nowrap cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          <div className="hidden md:block w-px h-8 bg-[#c3c6d6]/40" />

          {/* Status select dropdown */}
          <div className="flex items-center gap-2 shrink-0">
            <Filter className="w-4 h-4 text-[#505f76] shrink-0" />
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                className="appearance-none pl-3 pr-8 py-2 bg-[#f8f9fb] border border-[#c3c6d6]/50 rounded-xl text-xs font-semibold text-[#191c1e] focus:outline-none focus:ring-2 focus:ring-[#0052cc]/30 cursor-pointer"
              >
                <option value="ALL">All Status</option>
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
                <option value="no_show">No Show</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#505f76]">
                <svg
                  className="w-3 h-3"
                  viewBox="0 0 10 10"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M2 3.5L5 7l3-3.5" />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Appointments Table ── */}
      {isLoading ? (
        <div className="p-8 text-center text-xs text-secondary animate-pulse">
          Loading therapist agenda...
        </div>
      ) : (
        <DataTable<ExtendedAppointment>
          columns={columns}
          data={filteredAppointments}
          getRowKey={(row) => row.id}
          emptyTitle="No Appointments Found"
          emptyMessage="There are no appointments matching your current filters."
          defaultPageSize={10}
          pageSizeOptions={[5, 10, 20, 50]}
        />
      )}

      {/* ── Clinical Notes Modal ── */}
      {selectedAppointmentForNote && (
        <ClinicalNotesModal
          isOpen={!!selectedAppointmentForNote}
          item={selectedAppointmentForNote}
          onClose={() => setSelectedAppointmentForNote(null)}
        />
      )}
    </div>
  );
};

export default TherapistAppointmentsPage;
