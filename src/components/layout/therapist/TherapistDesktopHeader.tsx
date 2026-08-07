import React from 'react';
import { useLocation } from 'react-router-dom';
import { useUIStore } from '@/stores/uiStore';
import { useTherapistStatusStore } from '@/stores/therapistStatusStore';
import { UserProfileBadge } from '@/components/common/UserProfileBadge';

export const TherapistDesktopHeader: React.FC = () => {
  const location = useLocation();
  const addToast = useUIStore((state) => state.addToast);
  const isOnline = useTherapistStatusStore((state) => state.isOnline);
  const toggleOnlineStatus = useTherapistStatusStore((state) => state.toggleOnlineStatus);

  const handleToggleOnline = () => {
    toggleOnlineStatus();
    const nextState = !isOnline;
    addToast({
      type: nextState ? 'success' : 'warning',
      title: nextState ? 'Status: Online' : 'Status: Offline',
      message: nextState
        ? 'You are now Online. New slots are available for patient bookings.'
        : 'You are now Offline. No new slots can be booked for your profile.',
    });
  };

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

  return (
    <div className="hidden md:flex justify-between items-center px-4 sm:px-6 lg:px-8 xl:px-10 py-4 bg-white/80 backdrop-blur-sm sticky top-0 z-30 border-b border-[#c3c6d6]/30 w-full font-sans">
      {/* Left Side: Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs text-[#51606f] font-semibold">
        <span className="material-symbols-outlined text-base text-[#0052cc]">medical_services</span>
        <span>Therapist Portal</span>
        <span className="text-[#c3c6d6]">/</span>
        <span className="text-[#191c1e]">{getBreadcrumbTitle(location.pathname)}</span>
      </div>

      {/* Right Side: Online/Offline Switch, Profile Info */}
      <div className="flex items-center gap-5">
        {/* Online / Offline Status Toggle Switch */}
        <div className="flex items-center gap-2.5 px-3 py-1.5 bg-slate-50 border border-[#c3c6d6]/40 rounded-full shadow-2xs">
          <span className="text-xs font-bold text-[#191c1e] shrink-0 select-none">Status:</span>
          <button
            type="button"
            role="switch"
            aria-checked={isOnline}
            onClick={handleToggleOnline}
            title={
              isOnline
                ? 'Switch to Offline (block new bookings)'
                : 'Switch to Online (allow new bookings)'
            }
            className={`relative inline-flex h-6 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#0052cc] focus:ring-offset-1 ${
              isOnline ? 'bg-emerald-600' : 'bg-slate-300'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                isOnline ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
          <span
            className={`text-xs font-bold px-2.5 py-0.5 rounded-full transition-colors flex items-center gap-1.5 select-none ${
              isOnline
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200/60'
                : 'bg-amber-100 text-amber-800 border border-amber-200/60'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
              }`}
            />
            {isOnline ? 'Online' : 'Offline'}
          </span>
        </div>

        {/* User Profile Badge */}
        <UserProfileBadge
          defaultName="Dr. Sarah Connor"
          defaultEmail="sarah.connor@therapysync.com"
          defaultAvatar="https://lh3.googleusercontent.com/aida-public/AB6AXuAxi7fbYBrUC8gYf9yA9zuUplRT-sxz9TfKZWZ4s50vvrOzgtjYdgKhZLhWtQQmaZN03XvV7OwIwCkN8cEK_I3FVA7hT4zqypWBZ3EelKNplUINCfUlFKWN4OEpCJnSH-ZVGEA385I2On-RNj2GvBAOX5z-KOx41cdlG1cC4n1ltQNcrHpasMRDtHNZqB7z8R-xTOZKM1hzbakT8YpkduWVsCrESVaMD2xWD5is7vg3CcrFxrExnlPC"
          showDivider={true}
          status={isOnline ? 'online' : 'offline'}
        />
      </div>
    </div>
  );
};
