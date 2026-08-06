import React from 'react';

export const ScheduleManagementPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h1 className="text-2xl font-bold text-white">Schedule Builder</h1>
        <p className="mt-1 text-sm text-slate-400">
          Configure weekly recurring working hours, slot durations, and break blocks.
        </p>
      </div>
    </div>
  );
};

export default ScheduleManagementPage;
