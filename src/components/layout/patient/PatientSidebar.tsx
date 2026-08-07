import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { PATIENT_NAV_ITEMS } from '@/config/patientNavigation';
import { Logo } from '@/components/common/Logo';
import { cn } from '@/utils/cn';
import { useAuthStore } from '@/stores/authStore';
import type { AuthState } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';
import type { UIState } from '@/stores/uiStore';
import { ROUTES } from '@/config/routes';
import { ConfirmModal } from '@/components/ui/ConfirmModal';

export const PatientSidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const logout = useAuthStore((state: AuthState) => state.logout);
  const addToast = useUIStore((state: UIState) => state.addToast);
  const [showSignOutModal, setShowSignOutModal] = useState(false);

  const handleSignOut = () => {
    logout();
    setShowSignOutModal(false);
    addToast({
      type: 'info',
      title: 'Signed Out',
      message: 'You have been logged out securely.',
    });
    navigate(ROUTES.AUTH.LOGIN, { replace: true });
  };

  return (
    <>
      <aside className="hidden md:flex flex-col h-screen w-64 fixed left-0 top-0 bg-[#f8f9fb] shadow-md border-r border-[#c3c6d6]/50 z-40">
        {/* Brand Header matching Login Form */}
        <div className="p-6 border-b border-[#c3c6d6]/50">
          <Logo to="/patient/dashboard" subtitle="Patient Portal" />
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {PATIENT_NAV_ITEMS.map((item) => {
            const isActive =
              location.pathname === item.href ||
              (item.href !== '#' &&
                location.pathname.startsWith(item.href) &&
                item.href !== '/patient/dashboard');

            return (
              <React.Fragment key={item.id}>
                <Link
                  to={item.href}
                  className={cn(
                    'flex items-center justify-between px-4 py-3 rounded-lg text-sm font-semibold transition-all group',
                    isActive
                      ? 'bg-[#0052cc] text-white shadow-xs'
                      : 'text-[#51606f] hover:bg-[#d5e4f6]/50 hover:text-[#576675]',
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        'material-symbols-outlined transition-all text-xl',
                        isActive ? 'fill text-white' : 'group-hover:fill text-[#576675]',
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
                          ? 'bg-[#ba1a1a] text-white'
                          : 'bg-[#d5e4f6] text-[#001848]',
                      )}
                    >
                      {item.badgeCount}
                    </span>
                  )}
                </Link>

                {item.dividerAfter && <div className="my-4 border-t border-[#c3c6d6]/30"></div>}
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
        description="Are you sure you want to sign out? You will need to log back in to access your patient portal."
        variant="danger"
        confirmLabel="Sign out"
        cancelLabel="Cancel"
      />
    </>
  );
};
