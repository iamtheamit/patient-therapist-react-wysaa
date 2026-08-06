import React from 'react';
import { Outlet } from 'react-router-dom';

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 selection:bg-indigo-500 selection:text-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-white">
          Wysa <span className="text-indigo-400">Care</span>
        </h1>
        <p className="mt-2 text-sm text-slate-400">Production-grade Appointment Booking Platform</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-slate-900/80 backdrop-blur-xl py-8 px-4 shadow-2xl border border-slate-800 rounded-2xl sm:px-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
