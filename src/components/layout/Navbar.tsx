import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { User as UserIcon, LogOut, Menu, X, ShieldCheck } from 'lucide-react';
import { ROUTES } from '@/config/routes';
import { useAuthStore } from '@/stores/authStore';
import type { AuthState } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';
import type { UIState } from '@/stores/uiStore';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/utils/cn';

interface NavLinkItem {
  label: string;
  href: string;
}

export const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const user = useAuthStore((state: AuthState) => state.user);
  const logout = useAuthStore((state: AuthState) => state.logout);
  const addToast = useUIStore((state: UIState) => state.addToast);

  const isTherapist = user?.role === 'THERAPIST';

  const patientLinks: NavLinkItem[] = [
    { label: 'Dashboard', href: ROUTES.PATIENT.DASHBOARD },
    { label: 'Book Session', href: ROUTES.PATIENT.BOOK },
  ];

  const therapistLinks: NavLinkItem[] = [
    { label: 'Daily Agenda', href: ROUTES.THERAPIST.DASHBOARD },
    { label: 'Schedule Builder', href: ROUTES.THERAPIST.SCHEDULE },
  ];

  const navLinks = isTherapist ? therapistLinks : patientLinks;

  const handleSignOut = () => {
    logout();
    addToast({
      type: 'info',
      title: 'Signed Out',
      message: 'You have been logged out securely.',
    });
    navigate(ROUTES.AUTH.LOGIN, { replace: true });
  };

  return (
    <header className="border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Title */}
        <div className="flex items-center space-x-8">
          <Link
            to={isTherapist ? ROUTES.THERAPIST.DASHBOARD : ROUTES.PATIENT.DASHBOARD}
            className="text-lg font-bold text-[#191c1e] flex items-center gap-2.5 group"
          >
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  'material-symbols-outlined text-3xl',
                  isTherapist ? 'text-[#005237]' : 'text-[#005eb8]',
                )}
              >
                psychology
              </span>
              <div className="flex flex-col text-left">
                <span className="text-base font-heading font-extrabold text-[#191c1e] leading-none">
                  Therapy
                  <span className={isTherapist ? 'text-[#005237]' : 'text-[#005eb8]'}>Sync</span>
                </span>
                <span className="text-[10px] text-[#505f76] font-medium">
                  {isTherapist ? 'Therapist Portal' : 'Patient Portal'}
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    'px-3.5 py-2 rounded-lg text-xs font-semibold transition-all duration-150',
                    isActive
                      ? isTherapist
                        ? 'bg-[#d1fae5] text-[#005237] border border-[#a7f3d0]'
                        : 'bg-[#d6e3ff] text-[#00478d] border border-[#a9c7ff]'
                      : 'text-[#505f76] hover:text-[#191c1e] hover:bg-slate-100',
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Action Items */}
        <div className="hidden md:flex items-center space-x-4">
          <Badge variant={isTherapist ? 'info' : 'success'} size="sm" className="gap-1">
            <ShieldCheck className="w-3 h-3" />
            <span>{isTherapist ? 'Therapist Mode' : 'Patient Mode'}</span>
          </Badge>

          <div className="flex items-center space-x-3 pl-2 border-l border-slate-200">
            <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[#505f76] text-xs font-bold">
              <UserIcon className="w-4 h-4" />
            </div>
            <div className="text-left hidden lg:block">
              <p className="text-xs font-semibold text-[#191c1e] leading-tight">
                {user?.name || 'User'}
              </p>
              <p className="text-[10px] text-[#505f76] truncate max-w-[120px]">{user?.email}</p>
            </div>

            <button
              onClick={handleSignOut}
              className="p-2 text-[#505f76] hover:text-[#191c1e] hover:bg-slate-100 rounded-lg transition"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Hamburger Toggle Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 text-[#505f76] hover:text-[#191c1e] hover:bg-slate-100 rounded-lg transition"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Responsive Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white p-4 space-y-3 animate-in slide-in-from-top-2">
          <div className="space-y-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    'block px-4 py-2.5 rounded-lg text-xs font-semibold transition',
                    isActive
                      ? isTherapist
                        ? 'bg-[#005237] text-white'
                        : 'bg-[#005eb8] text-white'
                      : 'text-[#505f76] hover:bg-slate-100',
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-[#505f76]">
                <UserIcon className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-medium text-[#191c1e]">{user?.name}</span>
            </div>

            <button
              onClick={handleSignOut}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
