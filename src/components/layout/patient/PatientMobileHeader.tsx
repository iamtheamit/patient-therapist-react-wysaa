import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import type { AuthState } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';
import type { UIState } from '@/stores/uiStore';
import { ROUTES } from '@/config/routes';
import { Logo } from '@/components/common/Logo';

export const PatientMobileHeader: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const user = useAuthStore((state: AuthState) => state.user);
  const logout = useAuthStore((state: AuthState) => state.logout);
  const addToast = useUIStore((state: UIState) => state.addToast);
  const navigate = useNavigate();

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'A';

  const handleSignOut = () => {
    logout();
    addToast({
      type: 'info',
      title: 'Signed Out',
      message: 'Logged out successfully.',
    });
    navigate(ROUTES.AUTH.LOGIN, { replace: true });
  };

  return (
    <header className="md:hidden bg-white text-[#003d9b] shadow-xs w-full top-0 sticky border-b border-[#c3c6d6]/40 z-50">
      <div className="flex justify-between items-center px-4 py-3 max-w-7xl mx-auto">
        <Logo to="/patient/dashboard" iconSize="text-2xl" textSize="text-lg" />

        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="User menu"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="w-8 h-8 rounded-full bg-[#0052cc] text-white text-xs font-bold flex items-center justify-center border border-[#c3c6d6] shadow-sm"
          >
            {userInitial}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="bg-slate-50 border-t border-slate-200 p-4 space-y-3 animate-in slide-in-from-top-2 duration-150">
          <div className="flex items-center gap-3 pb-2 border-b border-slate-200">
            <div className="w-9 h-9 rounded-full bg-[#003d9b] text-white font-bold text-sm flex items-center justify-center">
              {userInitial}
            </div>
            <div>
              <p className="text-xs font-bold text-[#191c1e]">{user?.name || 'Patient'}</p>
              <p className="text-[10px] text-[#434654]">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full text-left py-2 px-3 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg text-xs font-semibold flex items-center justify-between"
          >
            <span>Sign Out</span>
            <span className="material-symbols-outlined text-base">logout</span>
          </button>
        </div>
      )}
    </header>
  );
};
