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

          <div className="flex items-center gap-3">
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
              onClick={() => setShowSignOutModal(true)}
              className="w-full text-left py-2 px-3 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg text-xs font-semibold flex items-center justify-between cursor-pointer"
            >
              <span>Sign Out</span>
              <span className="material-symbols-outlined text-base">logout</span>
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
