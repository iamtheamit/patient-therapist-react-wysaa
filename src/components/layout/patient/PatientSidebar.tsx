import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PATIENT_NAV_ITEMS } from '@/config/patientNavigation';
import { Logo } from '@/components/common/Logo';
import { cn } from '@/utils/cn';
import { ConfirmModal } from '@/components/ui/ConfirmModal';

import { useLogout } from '@/features/auth/hooks/useLogout';

export const PatientSidebar: React.FC = () => {
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
          <Logo to="/patient/dashboard" subtitle="Patient Portal" />
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {PATIENT_NAV_ITEMS.map((item) => {
            const isHashLink = item.href.includes('#');
            const itemHash = isHashLink ? item.href.substring(item.href.indexOf('#')) : '';
            const itemPath = isHashLink
              ? item.href.substring(0, item.href.indexOf('#'))
              : item.href;

            const isActive = isHashLink
              ? location.pathname === itemPath && location.hash === itemHash
              : location.pathname === item.href &&
                (!location.hash || location.hash === '#overview');

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
            className="relative group w-full flex items-center justify-between px-4 py-3 bg-gradient-to-r from-rose-50/80 via-rose-50/50 to-rose-100/60 hover:from-rose-600 hover:via-rose-600 hover:to-rose-700 text-rose-700 hover:text-white border border-rose-200/80 hover:border-transparent rounded-xl text-xs font-bold transition-all duration-300 shadow-2xs hover:shadow-[0_6px_20px_rgba(225,29,72,0.35)] hover:-translate-y-0.5 cursor-pointer overflow-hidden"
          >
            {/* Diagonal shine effect on hover */}
            <span className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-white/25 to-transparent" />

            <div className="flex items-center gap-2.5 relative z-10">
              <span className="material-symbols-outlined text-lg transition-transform duration-300 group-hover:-translate-x-1 group-hover:scale-110">
                logout
              </span>
              <span className="tracking-wide">Sign Out</span>
            </div>

            <span className="material-symbols-outlined text-base opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-300 relative z-10">
              chevron_right
            </span>
          </button>
        </div>
      </aside>

      {/* Sign Out Confirmation Modal */}
      <ConfirmModal
        isOpen={showSignOutModal}
        onClose={() => setShowSignOutModal(false)}
        onConfirm={handleSignOut}
        title="Sign out of your account?"
        description="Are you sure you want to sign out? You will need to log back in to access your patient portal."
        variant="danger"
        confirmLabel="Sign out"
        cancelLabel="Cancel"
      />
    </>
  );
};
