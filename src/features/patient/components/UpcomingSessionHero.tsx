import React from 'react';
import { Calendar, Video, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { PatientAppointment } from '../types/patient.types';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ROUTES } from '@/config/routes';

interface UpcomingSessionHeroProps {
  appointment?: PatientAppointment;
}

export const UpcomingSessionHero: React.FC<UpcomingSessionHeroProps> = ({ appointment }) => {
  if (!appointment) {
    return (
      <div className="bg-gradient-to-br from-indigo-950/60 to-slate-900 border border-indigo-500/20 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 text-left">
        <div className="space-y-2">
          <Badge variant="info" size="sm">
            Ready to Begin
          </Badge>
          <h2 className="text-2xl font-bold text-white">No Upcoming Sessions Scheduled</h2>
          <p className="text-xs text-slate-300 max-w-lg leading-relaxed">
            Take proactive steps for your mental health. Explore licensed therapists and reserve a
            convenient time slot today.
          </p>
        </div>

        <Link to={ROUTES.PATIENT.BOOK}>
          <Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
            Book Appointment
          </Button>
        </Link>
      </div>
    );
  }

  const startDate = new Date(appointment.startTime);

  return (
    <div className="bg-gradient-to-br from-indigo-950/80 via-slate-900 to-slate-900 border border-indigo-500/30 rounded-2xl p-6 md:p-8 shadow-2xl text-left relative overflow-hidden">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <Badge variant="success" size="sm" className="gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Next Scheduled Session</span>
            </Badge>
            <span className="text-xs text-slate-400 font-mono">ID: {appointment.id}</span>
          </div>

          <h2 className="text-2xl font-black text-white leading-tight">
            Session with {appointment.therapist.name}
          </h2>
          <p className="text-xs text-indigo-300 font-medium">
            Specialization: {appointment.therapist.specialization}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-2">
            <div className="flex items-center space-x-1.5 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700/60">
              <Calendar className="w-4 h-4 text-indigo-400" />
              <span>
                {startDate.toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </div>

            <div className="flex items-center space-x-1.5 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700/60">
              <Clock className="w-4 h-4 text-indigo-400" />
              <span>
                {startDate.toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {appointment.meetingLink ? (
            <a href={appointment.meetingLink} target="_blank" rel="noopener noreferrer">
              <Button variant="primary" size="lg" leftIcon={<Video className="w-4 h-4" />}>
                Join Session
              </Button>
            </a>
          ) : (
            <Button variant="primary" size="lg" disabled>
              Link Generating...
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
