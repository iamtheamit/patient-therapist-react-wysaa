import React from 'react';

export const PatientDashboardPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h1 className="text-2xl font-bold text-white">Patient Dashboard</h1>
        <p className="mt-1 text-sm text-slate-400">
          Manage your upcoming therapy sessions and track active bookings.
        </p>
      </div>
    </div>
  );
};

export default PatientDashboardPage;
