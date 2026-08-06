import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import type { AuthState } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';
import type { UIState } from '@/stores/uiStore';
import { ROUTES } from '@/config/routes';

export const TherapistDesktopHeader: React.FC = () => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAuthStore((state: AuthState) => state.user);
  const logout = useAuthStore((state: AuthState) => state.logout);
  const addToast = useUIStore((state: UIState) => state.addToast);

  const getBreadcrumbTitle = (pathname: string) => {
    if (pathname.includes('/schedule')) return 'Schedule Management';
    if (pathname.includes('/appointments')) return 'My Appointments';
    if (pathname.includes('/availability')) return 'My Availability';
    if (pathname.includes('/patients')) return 'Patient Directory';
    if (pathname.includes('/messages')) return 'Patient Messages';
    if (pathname.includes('/reports')) return 'Clinical Reports';
    if (pathname.includes('/settings')) return 'Practice Settings';
    return 'Practice Overview';
  };

  const handleSignOut = () => {
    logout();
    addToast({
      type: 'info',
      title: 'Signed Out',
      message: 'Logged out securely.',
    });
    navigate(ROUTES.AUTH.LOGIN, { replace: true });
  };

  return (
    <div className="hidden md:flex justify-between items-center px-4 sm:px-6 lg:px-8 xl:px-10 py-4 bg-white/80 backdrop-blur-sm sticky top-0 z-30 border-b border-[#c3c6d6]/30 w-full">
      {/* Left Side: Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs text-[#51606f] font-semibold">
        <span className="material-symbols-outlined text-base text-[#0052cc]">medical_services</span>
        <span>Therapist Portal</span>
        <span className="text-[#c3c6d6]">/</span>
        <span className="text-[#191c1e]">{getBreadcrumbTitle(location.pathname)}</span>
      </div>

      {/* Right Side: Mode Selector, Notifications, Profile */}
      <div className="flex items-center gap-6">
        {/* Therapist Mode Toggle Badge */}
        <button
          type="button"
          className="flex items-center gap-2 px-4 py-1.5 bg-[#e6f0ff] text-[#0052cc] rounded-full text-xs font-bold hover:bg-[#d4e4ff] transition-colors"
        >
          <span className="material-symbols-outlined text-base">verified_user</span>
          Therapist Mode
          <span className="material-symbols-outlined text-base">keyboard_arrow_down</span>
        </button>

        {/* Notifications Bell */}
        <button
          type="button"
          aria-label="View notifications"
          className="relative text-[#434654] hover:text-[#0052cc] transition-colors p-1.5 rounded-full hover:bg-slate-100"
        >
          <span className="material-symbols-outlined text-xl">notifications</span>
          <span className="absolute top-1 right-1 w-2 h-2 bg-[#ef4444] rounded-full border border-white"></span>
        </button>

        {/* User Profile Dropdown */}
        <div className="relative pl-6 border-l border-[#c3c6d6]/50">
          <button
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="flex items-center gap-3 cursor-pointer text-left focus:outline-none"
          >
            <img
              alt={user?.name || 'Dr. Sarah Connor'}
              className="w-10 h-10 rounded-full border border-[#c3c6d6] object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAxi7fbYBrUC8gYf9yA9zuUplRT-sxz9TfKZWZ4s50vvrOzgtjYdgKhZLhWtQQmaZN03XvV7OwIwCkN8cEK_I3FVA7hT4zqypWBZ3EelKNplUINCfUlFKWN4OEpCJnSH-ZVGEA385I2On-RNj2GvBAOX5z-KOx41cdlG1cC4n1ltQNcrHpasMRDtHNZqB7z8R-xTOZKM1hzbakT8YpkduWVsCrESVaMD2xWD5is7vg3CcrFxrExnlPC"
            />
            <div className="flex flex-col">
              <span className="text-sm font-bold text-[#191c1e]">
                {user?.name || 'Dr. Sarah Connor'}
              </span>
              <span className="text-xs text-[#434654]">
                {user?.email || 'sarah.connor@therapysync.com'}
              </span>
            </div>
            <span className="material-symbols-outlined text-[#434654]">keyboard_arrow_down</span>
          </button>

          {isProfileMenuOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="text-xs font-bold text-[#191c1e]">
                  {user?.name || 'Dr. Sarah Connor'}
                </p>
                <p className="text-[10px] text-[#505f76] truncate">
                  {user?.email || 'sarah.connor@therapysync.com'}
                </p>
              </div>
              <button
                onClick={handleSignOut}
                className="w-full text-left px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors"
              >
                <span className="material-symbols-outlined text-base">logout</span>
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
