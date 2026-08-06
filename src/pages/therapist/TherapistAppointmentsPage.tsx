import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Search,
  Video,
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  UserCheck,
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import type { AuthState } from '@/stores/authStore';
import { useTherapistAgenda } from '@/features/therapist/hooks/useTherapistAgenda';
import { ClinicalNotesModal } from '@/features/therapist/components/ClinicalNotesModal';
import { useUIStore } from '@/stores/uiStore';
import type { UIState } from '@/stores/uiStore';

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
}

export const TherapistAppointmentsPage: React.FC = () => {
  const user = useAuthStore((state: AuthState) => state.user);
  const therapistId = user?.id || 'therapist-doc-1';
  const addToast = useUIStore((state: UIState) => state.addToast);

  useTherapistAgenda(therapistId);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
  const [selectedAppointmentForNote, setSelectedAppointmentForNote] = useState<{
    id: string;
    patientName: string;
    existingNotes?: string;
  } | null>(null);

  // Expanded mock data merged with live agenda
  const [appointmentsList, setAppointmentsList] = useState<ExtendedAppointment[]>([
    {
      id: 'app-therapist-1',
      patientName: 'Alex Patient',
      patientEmail: 'alex.patient@therapysync.com',
      patientAvatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      sessionType: 'Cognitive Behavioral Therapy',
      dateStr: 'Today',
      timeStr: '10:00 AM - 11:00 AM',
      duration: '50 min',
      status: 'scheduled',
      meetingLink: 'https://meet.therapysync.example.com/therapist-session-1',
      notes: 'Patient reports improvement in anxiety symptoms. Review homework.',
      riskLevel: 'Moderate',
    },
    {
      id: 'app-therapist-2',
      patientName: 'Jordan Miller',
      patientEmail: 'jordan@example.com',
      patientAvatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      sessionType: 'Initial Intake Assessment',
      dateStr: 'Today',
      timeStr: '02:00 PM - 03:00 PM',
      duration: '60 min',
      status: 'scheduled',
      meetingLink: 'https://meet.therapysync.example.com/therapist-session-2',
      notes: 'Initial evaluation session.',
      riskLevel: 'Low',
    },
    {
      id: 'app-therapist-3',
      patientName: 'Taylor Reed',
      patientEmail: 'taylor@example.com',
      patientAvatar:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      sessionType: 'Depression & Mood Care',
      dateStr: 'Tomorrow',
      timeStr: '11:00 AM - 12:00 PM',
      duration: '50 min',
      status: 'scheduled',
      meetingLink: 'https://meet.therapysync.example.com/therapist-session-3',
      riskLevel: 'High',
    },
    {
      id: 'app-therapist-4',
      patientName: 'Samantha Vance',
      patientEmail: 'samantha.v@example.com',
      patientAvatar:
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      sessionType: 'Stress & Burnout Management',
      dateStr: 'Yesterday',
      timeStr: '04:00 PM - 05:00 PM',
      duration: '50 min',
      status: 'completed',
      notes: 'Worked on sleep hygiene techniques and boundary setting at work.',
      riskLevel: 'Low',
    },
    {
      id: 'app-therapist-5',
      patientName: 'Marcus Brody',
      patientEmail: 'marcus.b@example.com',
      patientAvatar:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      sessionType: 'PTSD & Trauma Recovery',
      dateStr: 'Aug 10, 2026',
      timeStr: '01:00 PM - 02:00 PM',
      duration: '50 min',
      status: 'no_show',
      notes: 'Patient did not attend scheduled video call.',
      riskLevel: 'Moderate',
    },
    {
      id: 'app-therapist-6',
      patientName: 'Elena Rostova',
      patientEmail: 'elena@example.com',
      patientAvatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      sessionType: 'Anxiety Counseling',
      dateStr: 'Aug 12, 2026',
      timeStr: '03:00 PM - 04:00 PM',
      duration: '50 min',
      status: 'cancelled',
      notes: 'Cancelled with 24-hour notice due to travel.',
      riskLevel: 'Low',
    },
  ]);

  const filteredAppointments = useMemo(() => {
    return appointmentsList.filter((app) => {
      const matchesSearch =
        app.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.patientEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.sessionType.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'ALL' || app.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [appointmentsList, searchQuery, statusFilter]);

  const handleStatusChange = (id: string, newStatus: ExtendedAppointment['status']) => {
    setAppointmentsList((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status: newStatus } : app)),
    );
    addToast({
      type: 'success',
      title: 'Appointment Status Updated',
      message: `Session status marked as ${newStatus.replace('_', ' ')}.`,
    });
  };

  const getStatusBadge = (status: ExtendedAppointment['status']) => {
    switch (status) {
      case 'scheduled':
      case 'CONFIRMED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-[#0052cc] border border-blue-200">
            <Clock className="w-3.5 h-3.5" />
            scheduled
          </span>
        );
      case 'completed':
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <UserCheck className="w-3.5 h-3.5" />
            completed
          </span>
        );
      case 'no_show':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <AlertCircle className="w-3.5 h-3.5" />
            no_show
          </span>
        );
      case 'cancelled':
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
            <XCircle className="w-3.5 h-3.5" />
            cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 w-full text-left">
      {/* Header Title */}
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

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              addToast({
                type: 'info',
                title: 'Export Schedule',
                message: 'Downloading appointments CSV report...',
              });
            }}
            className="px-4 py-2 bg-white text-[#0052cc] border border-[#0052cc]/30 rounded-xl text-xs font-semibold hover:bg-blue-50 transition shadow-2xs flex items-center gap-2 cursor-pointer"
          >
            <Calendar className="w-4 h-4 text-[#0052cc]" />
            Export Roster
          </button>
        </div>
      </div>

      {/* KPI Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-[#c3c6d6]/40 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0052cc] flex items-center justify-center font-bold">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-[#505f76] font-medium">Today's Sessions</p>
            <p className="text-xl font-heading font-bold text-[#191c1e]">2</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#c3c6d6]/40 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-[#505f76] font-medium">Pending Confirm</p>
            <p className="text-xl font-heading font-bold text-[#191c1e]">1</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#c3c6d6]/40 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-[#505f76] font-medium">Completed This Week</p>
            <p className="text-xl font-heading font-bold text-[#191c1e]">14</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#c3c6d6]/40 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-[#505f76] font-medium">Active Roster</p>
            <p className="text-xl font-heading font-bold text-[#191c1e]">18 Patients</p>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#c3c6d6]/40 shadow-xs flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search patient name, email or therapy type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#f8f9fb] border border-[#c3c6d6]/50 rounded-xl text-xs text-[#191c1e] placeholder:text-[#505f76] focus:outline-none focus:ring-2 focus:ring-[#0052cc]/30"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 text-xs font-semibold">
          {(['ALL', 'scheduled', 'completed', 'no_show', 'cancelled'] as StatusFilter[]).map(
            (status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  statusFilter === status
                    ? 'bg-[#0052cc] text-white shadow-xs font-bold'
                    : 'bg-[#f8f9fb] text-[#434654] hover:bg-slate-100'
                }`}
              >
                {status === 'ALL' ? 'All Sessions' : status.replace('_', ' ')}
              </button>
            ),
          )}
        </div>
      </div>

      {/* Appointments List */}
      <div className="space-y-4">
        {filteredAppointments.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-[#c3c6d6]/40">
            <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-[#191c1e]">No Appointments Found</h3>
            <p className="text-xs text-[#505f76] mt-1 max-w-md mx-auto">
              There are no appointments matching your search query or selected filter criteria.
            </p>
          </div>
        ) : (
          filteredAppointments.map((app) => (
            <div
              key={app.id}
              className="bg-white rounded-2xl p-5 border border-[#c3c6d6]/40 shadow-2xs hover:shadow-xs transition flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
            >
              {/* Left Info */}
              <div className="flex items-start gap-4">
                <img
                  src={
                    app.patientAvatar ||
                    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
                  }
                  alt={app.patientName}
                  className="w-12 h-12 rounded-full object-cover border border-[#c3c6d6]/60 shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base font-heading font-bold text-[#191c1e]">
                      {app.patientName}
                    </h3>
                    {getStatusBadge(app.status)}
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        app.riskLevel === 'High'
                          ? 'bg-rose-100 text-rose-700'
                          : app.riskLevel === 'Moderate'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {app.riskLevel} Risk
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-[#0052cc] mt-0.5">{app.sessionType}</p>

                  <div className="flex items-center gap-4 text-xs text-[#505f76] mt-2 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#0052cc]" />
                      {app.dateStr}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#0052cc]" />
                      {app.timeStr} ({app.duration})
                    </span>
                  </div>

                  {app.notes && (
                    <div className="mt-2.5 p-2.5 bg-[#f8f9fb] rounded-xl border border-slate-100 text-xs text-[#434654] max-w-xl">
                      <span className="font-semibold text-[#191c1e]">Clinical Note:</span>{' '}
                      {app.notes}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Action Buttons & Status Selector */}
              <div className="flex items-center gap-2 shrink-0 w-full md:w-auto justify-end border-t md:border-t-0 pt-3 md:pt-0 border-slate-100 flex-wrap">
                {app.meetingLink && (
                  <a
                    href={app.meetingLink}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-2 bg-[#0052cc] hover:bg-[#0041a3] text-white rounded-xl text-xs font-semibold transition flex items-center gap-1.5 shadow-2xs"
                  >
                    <Video className="w-4 h-4" />
                    Launch Video
                  </a>
                )}

                <button
                  type="button"
                  onClick={() =>
                    setSelectedAppointmentForNote({
                      id: app.id,
                      patientName: app.patientName,
                      existingNotes: app.notes,
                    })
                  }
                  className="px-3.5 py-2 bg-[#f8f9fb] hover:bg-slate-200 text-[#191c1e] border border-[#c3c6d6]/60 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-[#0052cc]" />
                  Notes
                </button>

                {/* Therapist Status Update Dropdown */}
                <select
                  value={app.status}
                  onChange={(e) =>
                    handleStatusChange(app.id, e.target.value as AppointmentStatusType)
                  }
                  className="px-3 py-2 bg-white border border-[#c3c6d6]/70 text-[#191c1e] rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#0052cc]/30 cursor-pointer"
                >
                  <option value="scheduled">scheduled</option>
                  <option value="completed">completed</option>
                  <option value="no_show">no_show</option>
                  <option value="cancelled">cancelled</option>
                </select>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Clinical Notes Modal */}
      {selectedAppointmentForNote && (
        <ClinicalNotesModal
          isOpen={!!selectedAppointmentForNote}
          item={{
            id: selectedAppointmentForNote.id,
            therapistId: therapistId,
            patient: {
              id: 'pat-selected',
              name: selectedAppointmentForNote.patientName,
              email: 'patient@therapysync.com',
            },
            startTime: new Date().toISOString(),
            endTime: new Date().toISOString(),
            status: 'CONFIRMED',
            notes: selectedAppointmentForNote.existingNotes,
            createdAt: new Date().toISOString(),
          }}
          onClose={() => setSelectedAppointmentForNote(null)}
        />
      )}
    </div>
  );
};

export default TherapistAppointmentsPage;
