import React from 'react';
import { CalendarCheck, Clock, UserCheck } from 'lucide-react';
import type { PatientDashboardStats } from '../types/patient.types';
import { Card, CardContent } from '@/components/ui/Card';

interface PatientStatsGridProps {
  stats?: PatientDashboardStats;
  isLoading?: boolean;
}

export const PatientStatsGrid: React.FC<PatientStatsGridProps> = ({ stats, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse bg-slate-900/60 border-slate-800">
            <CardContent className="h-24" />
          </Card>
        ))}
      </div>
    );
  }

  const statItems = [
    {
      title: 'Upcoming Sessions',
      value: stats?.upcomingSessionsCount ?? 0,
      icon: Clock,
      color: 'text-indigo-400',
      bgColor: 'bg-indigo-500/10 border-indigo-500/20',
    },
    {
      title: 'Completed Sessions',
      value: stats?.totalCompletedSessions ?? 0,
      icon: CalendarCheck,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10 border-emerald-500/20',
    },
    {
      title: 'Care Providers',
      value: stats?.assignedTherapistsCount ?? 0,
      icon: UserCheck,
      color: 'text-teal-400',
      bgColor: 'bg-teal-500/10 border-teal-500/20',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {statItems.map((item) => {
        const Icon = item.icon;
        return (
          <Card key={item.title} className="bg-slate-900/80 border-slate-800">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-400">{item.title}</p>
                <p className="text-2xl font-black text-white mt-1">{item.value}</p>
              </div>

              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${item.bgColor} ${item.color}`}
              >
                <Icon className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
