import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import type { AuthState } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';
import type { UIState } from '@/stores/uiStore';
import { ROUTES } from '@/config/routes';

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
    <header className="md:hidden bg-white text-[#005eb8] shadow-xs w-full top-0 sticky border-b border-slate-200 z-50">
      <div className="flex justify-between items-center px-4 py-3 max-w-7xl mx-auto">
        <Link
          to="/patient/dashboard"
          className="font-heading font-extrabold text-lg text-[#191c1e] flex items-center gap-2"
        >
          <span className="material-symbols-outlined fill text-2xl text-[#005eb8]">
            diversity_1
          </span>
          <span>
            Care<span className="text-[#005eb8]">Connect</span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Notifications"
            className="relative p-1.5 text-[#505f76] hover:text-[#005eb8] transition-colors"
          >
            <span className="material-symbols-outlined text-xl">notifications</span>
            <span className="absolute top-1 right-1 w-2 h-2 bg-rose-600 rounded-full"></span>
          </button>

          <button
            type="button"
            aria-label="User menu"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="w-8 h-8 rounded-full bg-[#005eb8] text-white text-xs font-bold flex items-center justify-center border border-blue-200"
          >
            {userInitial}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="bg-slate-50 border-t border-slate-200 p-4 space-y-3 animate-in slide-in-from-top-2 duration-150">
          <div className="flex items-center gap-3 pb-2 border-b border-slate-200">
            <div className="w-9 h-9 rounded-full bg-[#005eb8] text-white font-bold text-sm flex items-center justify-center">
              {userInitial}
            </div>
            <div>
              <p className="text-xs font-bold text-[#191c1e]">{user?.name || 'Patient'}</p>
              <p className="text-[10px] text-[#505f76]">{user?.email}</p>
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
