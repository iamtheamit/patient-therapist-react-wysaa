import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import type { AuthState } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';
import type { UIState } from '@/stores/uiStore';
import { ROUTES } from '@/config/routes';
import { Logo } from '@/components/common/Logo';

export const TherapistMobileHeader: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const user = useAuthStore((state: AuthState) => state.user);
  const logout = useAuthStore((state: AuthState) => state.logout);
  const addToast = useUIStore((state: UIState) => state.addToast);
  const navigate = useNavigate();

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
    <header className="md:hidden bg-white text-[#0052cc] shadow-xs w-full top-0 sticky border-b border-[#c3c6d6]/40 z-50">
      <div className="flex justify-between items-center px-4 py-3 max-w-7xl mx-auto">
        <Logo to="/therapist/dashboard" iconSize="text-2xl" textSize="text-lg" />

        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Notifications"
            className="relative p-1.5 text-[#434654] hover:text-[#0052cc] transition-colors"
          >
            <span className="material-symbols-outlined text-xl">notifications</span>
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#ef4444] rounded-full"></span>
          </button>

          <button
            type="button"
            aria-label="User menu"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="w-8 h-8 rounded-full overflow-hidden border border-blue-200"
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
          <div className="flex items-center gap-3 pb-2 border-b border-slate-200">
            <img
              alt="Dr. Sarah Connor"
              className="w-9 h-9 rounded-full object-cover border border-blue-200"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAxi7fbYBrUC8gYf9yA9zuUplRT-sxz9TfKZWZ4s50vvrOzgtjYdgKhZLhWtQQmaZN03XvV7OwIwCkN8cEK_I3FVA7hT4zqypWBZ3EelKNplUINCfUlFKWN4OEpCJnSH-ZVGEA385I2On-RNj2GvBAOX5z-KOx41cdlG1cC4n1ltQNcrHpasMRDtHNZqB7z8R-xTOZKM1hzbakT8YpkduWVsCrESVaMD2xWD5is7vg3CcrFxrExnlPC"
            />
            <div>
              <p className="text-xs font-bold text-[#191c1e]">{user?.name || 'Dr. Sarah Connor'}</p>
              <p className="text-[10px] text-[#434654]">
                {user?.email || 'sarah.connor@therapysync.com'}
              </p>
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
