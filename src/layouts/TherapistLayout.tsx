import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '@/config/routes';
import { useAuthStore } from '@/stores/authStore';
import type { AuthState } from '@/stores/authStore';

export const TherapistLayout: React.FC = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((state: AuthState) => state.logout);
  const user = useAuthStore((state: AuthState) => state.user);

  const handleSignOut = () => {
    logout();
    navigate(ROUTES.AUTH.LOGIN, { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Header */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link
              to={ROUTES.THERAPIST.DASHBOARD}
              className="text-xl font-bold text-white flex items-center gap-2"
            >
              <span className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white font-extrabold text-sm">
                T
              </span>
              <span>Therapist Portal</span>
            </Link>

            <nav className="hidden md:flex space-x-4">
              <Link
                to={ROUTES.THERAPIST.DASHBOARD}
                className="px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition"
              >
                Agenda
              </Link>
              <Link
                to={ROUTES.THERAPIST.SCHEDULE}
                className="px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition"
              >
                Schedule Builder
              </Link>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-xs text-slate-400 font-medium">{user?.name || 'Therapist'}</span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-500/10 text-teal-400 border border-teal-500/20">
              Therapist Mode
            </span>
            <button
              onClick={handleSignOut}
              className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-md hover:bg-slate-800 transition"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
};
