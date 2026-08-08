import React, { useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import type { AuthState } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';
import type { UIState } from '@/stores/uiStore';
import { useTherapistStatusStore } from '@/stores/therapistStatusStore';
import { Logo } from '@/components/common/Logo';
import { ConfirmModal } from '@/components/ui/ConfirmModal';

import { useLogout } from '@/features/auth/hooks/useLogout';

export const TherapistMobileHeader: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const user = useAuthStore((state: AuthState) => state.user);
  const { mutate: logoutMutate } = useLogout();
  const addToast = useUIStore((state: UIState) => state.addToast);
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

  const handleSignOut = () => {
    setShowSignOutModal(false);
    logoutMutate();
  };

  return (
    <>
      <header className="md:hidden bg-white text-[#0052cc] shadow-xs w-full top-0 sticky border-b border-[#c3c6d6]/40 z-50">
        <div className="flex justify-between items-center px-4 py-3 max-w-7xl mx-auto">
          <Logo to="/therapist/dashboard" iconSize="text-2xl" textSize="text-lg" />

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleToggleOnline}
              className={`text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 border ${
                isOnline
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                }`}
              />
              {isOnline ? 'Online' : 'Offline'}
            </button>

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
              className={`w-8 h-8 rounded-full overflow-hidden ring-offset-1 shadow-sm transition-all duration-300 ease-in-out cursor-pointer ${
                isOnline ? 'ring-2 ring-emerald-500' : 'ring-2 ring-amber-400'
              }`}
            >
              <img
                alt="Dr. Sarah Connor"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAxi7fbYBrUC8gYf9yA9zuUplRT-sxz9TfKZWZ4s50vvrOzgtjYdgKhZLhWtQQmaZN03XvV7OwIwCkN8cEK_I3FVA7hT4zqypWBZ3EelKNplUINCfUlFKWN4OEpCJnSH-ZVGEA385I2On-RNj2GvBAOX5z-KOx41cdlG1cC4n1ltQNcrHpasMRDtHNZqB7z8R-xTOZKM1hzbakT8YpkduWVsCrESVaMD2xWD5is7vg3CcrFxrExnlPC"
              />
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="bg-slate-50 border-t border-slate-200 p-4 space-y-3 animate-in slide-in-from-top-2 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <img
                  alt="Dr. Sarah Connor"
                  className={`w-9 h-9 rounded-full object-cover ring-offset-1 transition-all duration-300 ease-in-out ${
                    isOnline ? 'ring-2 ring-emerald-500' : 'ring-2 ring-amber-400'
                  }`}
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAxi7fbYBrUC8gYf9yA9zuUplRT-sxz9TfKZWZ4s50vvrOzgtjYdgKhZLhWtQQmaZN03XvV7OwIwCkN8cEK_I3FVA7hT4zqypWBZ3EelKNplUINCfUlFKWN4OEpCJnSH-ZVGEA385I2On-RNj2GvBAOX5z-KOx41cdlG1cC4n1ltQNcrHpasMRDtHNZqB7z8R-xTOZKM1hzbakT8YpkduWVsCrESVaMD2xWD5is7vg3CcrFxrExnlPC"
                />
                <div>
                  <p className="text-xs font-bold text-[#191c1e]">
                    {user?.name || 'Dr. Sarah Connor'}
                  </p>
                  <p className="text-[10px] text-[#434654]">
                    {user?.email || 'sarah.connor@therapysync.com'}
                  </p>
                </div>
              </div>
            </div>

            {/* Full Switch inside menu */}
            <div className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl">
              <span className="text-xs font-bold text-[#191c1e]">Practice Booking Status</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  role="switch"
                  aria-checked={isOnline}
                  onClick={handleToggleOnline}
                  className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                    isOnline ? 'bg-emerald-600' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                      isOnline ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
                <span className="text-xs font-bold text-[#191c1e]">
                  {isOnline ? 'Online' : 'Offline'}
                </span>
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
        description="Are you sure you want to sign out? You will need to log back in to access your clinical dashboard."
        variant="danger"
        confirmLabel="Sign out"
        cancelLabel="Cancel"
      />
    </>
  );
};
