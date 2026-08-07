import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import type { AuthState } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';
import type { UIState } from '@/stores/uiStore';
import { useTherapistStatusStore } from '@/stores/therapistStatusStore';
import { ROUTES } from '@/config/routes';
import { Logo } from '@/components/common/Logo';
import { ConfirmModal } from '@/components/ui/ConfirmModal';

export const TherapistMobileHeader: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const user = useAuthStore((state: AuthState) => state.user);
  const logout = useAuthStore((state: AuthState) => state.logout);
  const addToast = useUIStore((state: UIState) => state.addToast);
  const isOnline = useTherapistStatusStore((state) => state.isOnline);
  const toggleOnlineStatus = useTherapistStatusStore((state) => state.toggleOnlineStatus);
  const navigate = useNavigate();

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
    logout();
    addToast({
      type: 'info',
      title: 'Signed Out',
      message: 'Logged out successfully.',
    });
    navigate(ROUTES.AUTH.LOGIN, { replace: true });
  };

  return (
    <>
      <header className="md:hidden bg-white text-[#0052cc] shadow-xs w-full top-0 sticky border-b border-[#c3c6d6]/40 z-50">
        <div className="flex justify-between items-center px-4 py-3 max-w-7xl mx-auto">
          <Logo to="/therapist/dashboard" iconSize="text-2xl" textSize="text-lg" />

          <div className="flex items-center gap-3">
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
        description="Are you sure you want to sign out? You will need to log back in to access your clinical dashboard."
        variant="danger"
        confirmLabel="Sign out"
        cancelLabel="Cancel"
      />
    </>
  );
};
