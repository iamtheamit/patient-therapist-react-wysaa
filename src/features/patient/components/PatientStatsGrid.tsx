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
          <Card key={i} className="animate-pulse bg-slate-100 border-slate-200">
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
      color: 'text-[#005eb8]',
      bgColor: 'bg-[#d6e3ff]/60 border-[#a9c7ff]',
    },
    {
      title: 'Completed Sessions',
      value: stats?.totalCompletedSessions ?? 0,
      icon: CalendarCheck,
      color: 'text-[#005237]',
      bgColor: 'bg-[#d1fae5] border-[#a7f3d0]',
    },
    {
      title: 'Care Providers',
      value: stats?.assignedTherapistsCount ?? 0,
      icon: UserCheck,
      color: 'text-[#505f76]',
      bgColor: 'bg-slate-100 border-slate-200',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {statItems.map((item) => {
        const Icon = item.icon;
        return (
          <Card key={item.title} className="bg-white border-slate-200 shadow-sm">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-[#505f76]">{item.title}</p>
                <p className="text-2xl font-heading font-extrabold text-[#191c1e] mt-1">
                  {item.value}
                </p>
              </div>

              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center border ${item.bgColor} ${item.color}`}
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
