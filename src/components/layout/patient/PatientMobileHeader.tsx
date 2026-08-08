import React, { useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import type { AuthState } from '@/stores/authStore';
import { Logo } from '@/components/common/Logo';
import { ConfirmModal } from '@/components/ui/ConfirmModal';

import { useLogout } from '@/features/auth/hooks/useLogout';

export const PatientMobileHeader: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const user = useAuthStore((state: AuthState) => state.user);
  const { mutate: logoutMutate } = useLogout();

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'A';

  const handleSignOut = () => {
    setShowSignOutModal(false);
    logoutMutate();
  };

  return (
    <>
      <header className="md:hidden bg-white text-[#0052cc] shadow-xs w-full top-0 sticky border-b border-[#c3c6d6]/40 z-50">
        <div className="flex justify-between items-center px-4 py-3 max-w-7xl mx-auto">
          <Logo to="/patient/dashboard" iconSize="text-2xl" textSize="text-lg" />

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowSignOutModal(true)}
              className="p-2 rounded-xl text-rose-600 hover:text-white bg-rose-50/80 hover:bg-rose-600 border border-rose-200/70 hover:border-transparent transition-all duration-250 cursor-pointer flex items-center justify-center shadow-2xs hover:shadow-[0_4px_12px_rgba(225,29,72,0.3)] active:scale-95 group"
              title="Sign out"
              aria-label="Sign out"
            >
              <span className="material-symbols-outlined text-lg transition-transform duration-200 group-hover:-translate-x-0.5">
                logout
              </span>
            </button>

            <button
              type="button"
              aria-label="User menu"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="w-8 h-8 rounded-full bg-[#0052cc] text-white text-xs font-bold flex items-center justify-center border border-[#c3c6d6] shadow-sm cursor-pointer"
            >
              {userInitial}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="bg-slate-50 border-t border-slate-200 p-4 space-y-3 animate-in slide-in-from-top-2 duration-150">
            <div className="flex items-center gap-3 pb-2 border-b border-slate-200">
              <div className="w-9 h-9 rounded-full bg-[#0052cc] text-white font-bold text-sm flex items-center justify-center">
                {userInitial}
              </div>
              <div>
                <p className="text-xs font-bold text-[#191c1e]">{user?.name || 'Patient'}</p>
                <p className="text-[10px] text-[#434654]">{user?.email}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowSignOutModal(true)}
              className="relative group w-full flex items-center justify-between py-2.5 px-3.5 bg-gradient-to-r from-rose-50/90 to-rose-100/60 hover:from-rose-600 hover:to-rose-700 text-rose-700 hover:text-white border border-rose-200/80 hover:border-transparent rounded-xl text-xs font-bold transition-all duration-300 shadow-2xs hover:shadow-[0_6px_18px_rgba(225,29,72,0.3)] cursor-pointer overflow-hidden"
            >
              <span className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-white/25 to-transparent" />
              <div className="flex items-center gap-2 relative z-10">
                <span className="material-symbols-outlined text-base transition-transform duration-300 group-hover:-translate-x-0.5">
                  logout
                </span>
                <span>Sign Out</span>
              </div>
              <span className="material-symbols-outlined text-sm opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-300 relative z-10">
                chevron_right
              </span>
            </button>
          </div>
        )}
      </header>

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
