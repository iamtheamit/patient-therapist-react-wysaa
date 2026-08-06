import React from 'react';
import { Calendar, Users, AlertCircle } from 'lucide-react';
import type { TherapistStats } from '../types/therapist.types';
import { Card, CardContent } from '@/components/ui/Card';

interface TherapistStatsGridProps {
  stats?: TherapistStats;
  isLoading?: boolean;
}

export const TherapistStatsGrid: React.FC<TherapistStatsGridProps> = ({ stats, isLoading }) => {
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
      title: "Today's Agenda",
      value: stats?.todaySessionsCount ?? 0,
      icon: Calendar,
      color: 'text-teal-400',
      bgColor: 'bg-teal-500/10 border-teal-500/20',
    },
    {
      title: 'Pending Confirmations',
      value: stats?.pendingConfirmationsCount ?? 0,
      icon: AlertCircle,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10 border-amber-500/20',
    },
    {
      title: 'Active Clients',
      value: stats?.activePatientsCount ?? 0,
      icon: Users,
      color: 'text-indigo-400',
      bgColor: 'bg-indigo-500/10 border-indigo-500/20',
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
