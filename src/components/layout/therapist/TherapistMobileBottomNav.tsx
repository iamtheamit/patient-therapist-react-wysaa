import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { THERAPIST_NAV_ITEMS } from '@/config/therapistNavigation';
import { cn } from '@/utils/cn';

export const TherapistMobileBottomNav: React.FC = () => {
  const location = useLocation();

  const mobileNavItems = THERAPIST_NAV_ITEMS.filter((item) =>
    ['dashboard', 'appointments', 'schedule', 'reports', 'settings'].includes(item.id),
  );

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-[#c3c6d6]/40 z-50 px-1 py-1 shadow-lg">
      <div className="grid grid-cols-5 items-center w-full max-w-lg mx-auto">
        {mobileNavItems.map((item) => {
          const isActive =
            location.pathname === item.href ||
            (item.href !== '#' &&
              location.pathname.startsWith(item.href) &&
              item.href !== '/therapist/dashboard');

          return (
            <Link
              key={item.id}
              to={item.href}
              className={cn(
                'flex flex-col items-center justify-center py-1.5 px-0.5 rounded-xl transition-all relative text-center min-w-0',
                isActive
                  ? 'text-[#0052cc] font-bold bg-[#0052cc]/5'
                  : 'text-[#51606f] font-medium hover:text-[#191c1e] hover:bg-slate-50',
              )}
            >
              <div className="relative flex items-center justify-center">
                <span
                  className={cn(
                    'material-symbols-outlined text-xl transition-transform',
                    isActive && 'fill scale-105',
                  )}
                >
                  {item.icon}
                </span>
                {item.badgeCount !== undefined && (
                  <span className="absolute -top-1 -right-2 bg-[#ef4444] text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full">
                    {item.badgeCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] leading-tight mt-1 truncate w-full px-0.5">
                {item.shortLabel || item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
