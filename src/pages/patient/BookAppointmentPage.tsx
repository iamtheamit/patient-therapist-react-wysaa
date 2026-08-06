import React from 'react';

export const BookAppointmentPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h1 className="text-2xl font-bold text-white">Book Therapy Session</h1>
        <p className="mt-1 text-sm text-slate-400">
          Select an available slot, hold it temporarily, and confirm your appointment.
        </p>
      </div>
    </div>
  );
};

export default BookAppointmentPage;
