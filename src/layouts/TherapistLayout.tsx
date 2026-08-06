import React from 'react';
import { Outlet } from 'react-router-dom';
import {
  TherapistSidebar,
  TherapistDesktopHeader,
  TherapistMobileHeader,
  TherapistMobileBottomNav,
} from '@/components/layout/therapist';

export const TherapistLayout: React.FC = () => {
  return (
    <div className="bg-[#f8f9fb] text-[#191c1e] font-sans antialiased overflow-x-hidden flex min-h-screen w-full">
      {/* Mobile Top Navigation */}
      <TherapistMobileHeader />

      {/* Desktop Fixed Side Navigation */}
      <TherapistSidebar />

      {/* Main Content Area (Fluid full width next to fixed sidebar) */}
      <main className="flex-1 w-full md:ml-64 pb-20 md:pb-8 pt-4 md:pt-0 min-h-screen flex flex-col min-w-0">
        {/* Desktop Sticky Top Header */}
        <TherapistDesktopHeader />

        {/* Content Container (Fluid responsive layout across viewport width) */}
        <div className="flex-1 w-full px-4 sm:px-6 lg:px-8 xl:px-10 py-6">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <TherapistMobileBottomNav />
    </div>
  );
};

export default TherapistLayout;
