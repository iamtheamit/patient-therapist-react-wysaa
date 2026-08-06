import React from 'react';
import { Outlet } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-between py-12 px-4 sm:px-6 lg:px-8 selection:bg-indigo-500 selection:text-white relative overflow-hidden">
      {/* Background Decorative Radial Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-600/10 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[300px] bg-teal-600/10 blur-[100px] pointer-events-none rounded-full" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-xs font-semibold mb-4">
          <ShieldCheck className="w-4 h-4 text-indigo-400" />
          <span>Production Appointment Platform</span>
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight text-white">
          Wysa <span className="text-indigo-400">Care</span>
        </h1>
        <p className="mt-1.5 text-xs text-slate-400">
          Seamless patient scheduling and therapist agenda management
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="bg-slate-900/80 backdrop-blur-2xl py-8 px-6 shadow-2xl border border-slate-800/80 rounded-2xl sm:px-10">
          <Outlet />
        </div>
      </div>

      <footer className="mt-8 text-center text-xs text-slate-500 z-10">
        <p>© {new Date().getFullYear()} Wysa Care. Secure 256-bit encrypted authentication.</p>
      </footer>
    </div>
  );
};
