import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Calendar, User as UserIcon, LogOut, Menu, X, ShieldCheck } from 'lucide-react';
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
    <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Title */}
        <div className="flex items-center space-x-8">
          <Link
            to={isTherapist ? ROUTES.THERAPIST.DASHBOARD : ROUTES.PATIENT.DASHBOARD}
            className="text-lg font-bold text-white flex items-center gap-2.5 group"
          >
            <div
              className={cn(
                'w-9 h-9 rounded-xl flex items-center justify-center text-white font-extrabold shadow-lg transition-transform group-hover:scale-105',
                isTherapist
                  ? 'bg-teal-600 shadow-teal-600/20'
                  : 'bg-indigo-600 shadow-indigo-600/20',
              )}
            >
              <Calendar className="w-5 h-5" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-sm font-extrabold text-white leading-none">
                Wysa <span className={isTherapist ? 'text-teal-400' : 'text-indigo-400'}>Care</span>
              </span>
              <span className="text-[10px] text-slate-400 font-medium">
                {isTherapist ? 'Therapist Portal' : 'Patient Portal'}
              </span>
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
                    'px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-150',
                    isActive
                      ? isTherapist
                        ? 'bg-teal-500/10 text-teal-300 border border-teal-500/20'
                        : 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900',
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

          <div className="flex items-center space-x-3 pl-2 border-l border-slate-800">
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 text-xs font-bold">
              <UserIcon className="w-4 h-4" />
            </div>
            <div className="text-left hidden lg:block">
              <p className="text-xs font-semibold text-white leading-tight">
                {user?.name || 'User'}
              </p>
              <p className="text-[10px] text-slate-400 truncate max-w-[120px]">{user?.email}</p>
            </div>

            <button
              onClick={handleSignOut}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Hamburger Toggle Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Responsive Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950 p-4 space-y-3 animate-in slide-in-from-top-2">
          <div className="space-y-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    'block px-4 py-2.5 rounded-xl text-xs font-semibold transition',
                    isActive
                      ? isTherapist
                        ? 'bg-teal-600 text-white'
                        : 'bg-indigo-600 text-white'
                      : 'text-slate-300 hover:bg-slate-900',
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-slate-300">
                <UserIcon className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-medium text-slate-200">{user?.name}</span>
            </div>

            <button
              onClick={handleSignOut}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-600/20 text-rose-300 border border-rose-500/30"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
