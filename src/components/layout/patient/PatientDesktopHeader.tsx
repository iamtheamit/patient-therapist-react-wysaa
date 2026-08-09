import React from 'react';
import { useLocation } from 'react-router-dom';
import { UserProfileBadge } from '@/components/common/UserProfileBadge';

export const PatientDesktopHeader: React.FC = () => {
  const location = useLocation();

  const getBreadcrumbTitle = (pathname: string, search: string) => {
    const searchParams = new URLSearchParams(search);
    const view = searchParams.get('view');
    if (view === 'appointments') return 'My Appointments';
    if (view === 'holds') return 'My Holds';
    if (view === 'book' || pathname.includes('/book')) return 'Book Therapy Session';
    if (pathname.includes('/therapists')) return 'Therapists';
    if (pathname.includes('/messages')) return 'Messages';
    if (pathname.includes('/payments')) return 'Payments';
    if (pathname.includes('/profile')) return 'Profile';
    if (pathname.includes('/settings')) return 'Settings';
    return 'Dashboard Overview';
  };

  return (
    <div className="hidden md:flex justify-between items-center px-4 sm:px-6 lg:px-8 xl:px-10 py-4 bg-white/80 backdrop-blur-sm sticky top-0 z-30 border-b border-[#c3c6d6]/30 w-full font-sans">
      {/* Left Side: Dynamic Portal Context / Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-[#51606f] font-semibold">
        <span className="material-symbols-outlined text-base text-[#0052cc]">dashboard</span>
        <span>Patient Portal</span>
        <span className="text-[#c3c6d6]">/</span>
        <span className="text-[#191c1e]">
          {getBreadcrumbTitle(location.pathname, location.search)}
        </span>
      </div>

      {/* Right Side: Profile Info */}
      <div className="flex items-center gap-4">
        <UserProfileBadge
          defaultName="Alex Patient"
          defaultEmail="alex.patient@example.com"
          defaultAvatar="https://lh3.googleusercontent.com/aida-public/AB6AXuAxpQzOFYHryO37GalgHxs_ntSQ5fZ97NCkh6gBcniWCQuCxJtP_yGAzLbMDYvr9hRJXDZEjewM-5CxR8m6zrtwbWSM3hDTE1-6YwPP4L797xSF9hvnwoXpfzla760pIcyuuO6ENrztGj0mUWWgdK--Q8is2xyZlKY1zCB2GFvb_8ot7zjAo4OqXzeVaMnyjvQWWdImvEYSpoqUkO2S6ZoI1EvSsfgZN8ZmGmEqMYxMgELR4QjhsE1x"
          showDivider={true}
        />
      </div>
    </div>
  );
};
