import React from 'react';
import { useLocation } from 'react-router-dom';
import { UserProfileBadge } from '@/components/common/UserProfileBadge';

export const TherapistDesktopHeader: React.FC = () => {
  const location = useLocation();

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

      {/* Right Side: Profile Info */}
      <div className="flex items-center gap-5">
        {/* User Profile Badge */}
        <UserProfileBadge
          defaultName="Dr. Sarah Connor"
          defaultEmail="sarah.connor@therapysync.com"
          defaultAvatar="https://lh3.googleusercontent.com/aida-public/AB6AXuAxi7fbYBrUC8gYf9yA9zuUplRT-sxz9TfKZWZ4s50vvrOzgtjYdgKhZLhWtQQmaZN03XvV7OwIwCkN8cEK_I3FVA7hT4zqypWBZ3EelKNplUINCfUlFKWN4OEpCJnSH-ZVGEA385I2On-RNj2GvBAOX5z-KOx41cdlG1cC4n1ltQNcrHpasMRDtHNZqB7z8R-xTOZKM1hzbakT8YpkduWVsCrESVaMD2xWD5is7vg3CcrFxrExnlPC"
          showDivider={true}
        />
      </div>
    </div>
  );
};
