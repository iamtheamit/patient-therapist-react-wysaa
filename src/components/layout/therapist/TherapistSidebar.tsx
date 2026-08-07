import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { THERAPIST_NAV_ITEMS } from '@/config/therapistNavigation';
import { Logo } from '@/components/common/Logo';
import { cn } from '@/utils/cn';
import { ConfirmModal } from '@/components/ui/ConfirmModal';

import { useLogout } from '@/features/auth/hooks/useLogout';

export const TherapistSidebar: React.FC = () => {
  const location = useLocation();
  const { mutate: logoutMutate } = useLogout();
  const [showSignOutModal, setShowSignOutModal] = useState(false);

  const handleSignOut = () => {
    setShowSignOutModal(false);
    logoutMutate();
  };

  return (
    <>
      <aside className="hidden md:flex flex-col h-screen w-64 fixed left-0 top-0 bg-white shadow-md border-r border-[#c3c6d6]/50 z-40">
        {/* Brand Header matching Login Form */}
        <div className="p-6 border-b border-[#c3c6d6]/50">
          <Logo to="/therapist/dashboard" subtitle="Therapist Portal" />
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {THERAPIST_NAV_ITEMS.map((item) => {
            const isActive =
              location.pathname === item.href ||
              (item.href !== '#' &&
                location.pathname.startsWith(item.href) &&
                item.href !== '/therapist/dashboard');

            return (
              <React.Fragment key={item.id}>
                <Link
                  to={item.href}
                  className={cn(
                    'flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all group',
                    isActive
                      ? 'bg-[#e6f0ff] text-[#0052cc] shadow-2xs'
                      : 'text-[#434654] hover:bg-[#f8f9fb] hover:text-[#191c1e]',
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        'material-symbols-outlined transition-all text-xl',
                        isActive ? 'fill text-[#0052cc]' : 'group-hover:fill text-[#434654]',
                      )}
                    >
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>

                  {item.badgeCount !== undefined && (
                    <span
                      className={cn(
                        'text-xs font-semibold px-2 py-0.5 rounded-full',
                        item.badgeVariant === 'error'
                          ? 'bg-[#ef4444] text-white'
                          : 'bg-[#e6f0ff] text-[#0052cc]',
                      )}
                    >
                      {item.badgeCount}
                    </span>
                  )}
                </Link>

                {item.dividerAfter && <div className="my-3 border-t border-[#c3c6d6]/30"></div>}
              </React.Fragment>
            );
          })}
        </nav>

        {/* Footer Sign Out Button */}
        <div className="p-4 mt-auto border-t border-[#c3c6d6]/30">
          <button
            type="button"
            onClick={() => setShowSignOutModal(true)}
            className="w-full flex items-center justify-between px-4 py-3 bg-rose-50 text-rose-700 hover:bg-rose-100/80 border border-rose-200/80 rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer group"
          >
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-lg transition-transform group-hover:-translate-x-0.5">
                logout
              </span>
              <span>Sign Out</span>
            </div>
          </button>
        </div>
      </aside>

      {/* Sign Out Confirmation Modal */}
      <ConfirmModal
        isOpen={showSignOutModal}
        onClose={() => setShowSignOutModal(false)}
        onConfirm={handleSignOut}
        title="Sign out of your account?"
        description="Are you sure you want to sign out? You will need to log back in to access your clinical dashboard."
        variant="danger"
        confirmLabel="Sign out"
        cancelLabel="Cancel"
      />
    </>
  );
};
