import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import type { AuthState } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';
import type { UIState } from '@/stores/uiStore';
import { ROUTES } from '@/config/routes';

export const PatientDesktopHeader: React.FC = () => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAuthStore((state: AuthState) => state.user);
  const logout = useAuthStore((state: AuthState) => state.logout);
  const addToast = useUIStore((state: UIState) => state.addToast);

  const getBreadcrumbTitle = (pathname: string) => {
    if (pathname.includes('/book')) return 'Book Therapy Session';
    if (pathname.includes('/appointments')) return 'My Appointments';
    if (pathname.includes('/holds')) return 'My Holds';
    if (pathname.includes('/therapists')) return 'Therapists';
    if (pathname.includes('/messages')) return 'Messages';
    if (pathname.includes('/payments')) return 'Payments';
    if (pathname.includes('/profile')) return 'Profile';
    if (pathname.includes('/settings')) return 'Settings';
    return 'Dashboard Overview';
  };

  const handleSignOut = () => {
    logout();
    addToast({
      type: 'info',
      title: 'Signed Out',
      message: 'You have been logged out securely.',
    });
    navigate(ROUTES.AUTH.LOGIN, { replace: true });
  };

  return (
    <div className="hidden md:flex justify-between items-center px-4 sm:px-6 lg:px-8 xl:px-10 py-4 bg-[#f8f9fb]/80 backdrop-blur-sm sticky top-0 z-30 border-b border-[#c3c6d6]/30 w-full">
      {/* Left Side: Dynamic Portal Context / Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-[#51606f] font-semibold">
        <span className="material-symbols-outlined text-base text-[#003d9b]">dashboard</span>
        <span>Patient Portal</span>
        <span className="text-[#c3c6d6]">/</span>
        <span className="text-[#191c1e]">{getBreadcrumbTitle(location.pathname)}</span>
      </div>

      {/* Right Side: Mode Badge, Notifications, Profile */}
      <div className="flex items-center gap-6">
        {/* Patient Mode Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#e7e8ea] rounded-full text-xs font-semibold text-[#434654] border border-[#c3c6d6]/50 cursor-pointer hover:bg-[#e1e2e4] transition-colors">
          <span className="material-symbols-outlined text-[18px] text-[#7b2600]">
            health_and_safety
          </span>
          Patient Mode
          <span className="material-symbols-outlined text-[18px]">expand_more</span>
        </div>

        {/* Notification Bell */}
        <button
          type="button"
          aria-label="View notifications"
          className="relative text-[#434654] hover:text-[#003d9b] transition-colors"
        >
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-0 right-0 w-2 h-2 bg-[#ba1a1a] rounded-full border border-[#f8f9fb]"></span>
        </button>

        {/* User Profile */}
        <div className="relative pl-4 border-l border-[#c3c6d6]/50">
          <button
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="flex items-center gap-3 cursor-pointer text-left focus:outline-none"
          >
            <img
              alt={user?.name || 'Alex Patient'}
              className="w-10 h-10 rounded-full object-cover border border-[#c3c6d6]"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAxpQzOFYHryO37GalgHxs_ntSQ5fZ97NCkh6gBcniWCQuCxJtP_yGAzLbMDYvr9hRJXDZEjewM-5CxR8m6zrtwbWSM3hDTE1-6YwPP4L797xSF9hvnwoXpfzla760pIcyuuO6ENrztGj0mUWWgdK--Q8is2xyZlKY1zCB2GFvb_8ot7zjAo4OqXzeVaMnyjvQWWdImvEYSpoqUkO2S6ZoI1EvSsfgZN8ZmGmEqMYxMgELR4QjhsE1x"
            />
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-[#191c1e]">
                {user?.name || 'Alex Patient'}
              </span>
              <span className="text-xs text-[#434654]">
                {user?.email || 'alex.patient@example.com'}
              </span>
            </div>
            <span className="material-symbols-outlined text-[#434654]">expand_more</span>
          </button>

          {isProfileMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="text-xs font-semibold text-[#191c1e]">{user?.name || 'Patient'}</p>
                <p className="text-[10px] text-[#505f76] truncate">{user?.email}</p>
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
