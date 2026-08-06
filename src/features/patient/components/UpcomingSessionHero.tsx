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
      <div className="bg-gradient-to-r from-[#005eb8] to-[#00478d] rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 text-left shadow-md text-white">
        <div className="space-y-2">
          <Badge variant="info" size="sm" className="bg-white/20 text-white border-white/30">
            Ready to Begin
          </Badge>
          <h2 className="text-2xl font-heading font-extrabold text-white">
            No Upcoming Sessions Scheduled
          </h2>
          <p className="text-xs text-sky-100 max-w-lg leading-relaxed">
            Take proactive steps for your mental health. Explore licensed therapists and reserve a
            convenient time slot today.
          </p>
        </div>

        <Link to={ROUTES.PATIENT.BOOK}>
          <Button
            variant="secondary"
            size="lg"
            className="bg-white text-[#005eb8] hover:bg-sky-50 border-white font-bold shadow-sm"
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Book Appointment
          </Button>
        </Link>
      </div>
    );
  }

  const startDate = new Date(appointment.startTime);

  return (
    <div className="bg-gradient-to-r from-[#005eb8] to-[#00478d] rounded-2xl p-6 md:p-8 shadow-md text-left text-white relative overflow-hidden">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <Badge
              variant="success"
              size="sm"
              className="gap-1 bg-emerald-500/20 text-emerald-200 border-emerald-400/30"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Next Scheduled Session</span>
            </Badge>
            <span className="text-xs text-sky-200 font-mono">ID: {appointment.id}</span>
          </div>

          <h2 className="text-2xl font-heading font-extrabold text-white leading-tight">
            Session with {appointment.therapist.name}
          </h2>
          <p className="text-xs text-sky-100 font-semibold">
            Specialization: {appointment.therapist.specialization}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs text-white pt-2">
            <div className="flex items-center space-x-1.5 bg-white/10 px-3.5 py-1.5 rounded-lg border border-white/20">
              <Calendar className="w-4 h-4 text-sky-200" />
              <span className="font-semibold">
                {startDate.toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </div>

            <div className="flex items-center space-x-1.5 bg-white/10 px-3.5 py-1.5 rounded-lg border border-white/20">
              <Clock className="w-4 h-4 text-sky-200" />
              <span className="font-semibold">
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
              <Button
                variant="secondary"
                size="lg"
                className="bg-white text-[#005eb8] hover:bg-sky-50 font-bold border-white shadow-sm"
                leftIcon={<Video className="w-4 h-4" />}
              >
                Join Session
              </Button>
            </a>
          ) : (
            <Button
              variant="secondary"
              size="lg"
              disabled
              className="bg-white/40 text-white border-transparent"
            >
              Link Generating...
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
