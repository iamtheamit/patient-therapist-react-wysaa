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
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#c3c6d6]/40 z-50 px-2 py-1 shadow-lg">
      <div className="flex justify-around items-center">
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
                'flex flex-col items-center py-1.5 px-3 rounded-lg text-xs font-semibold transition-colors relative',
                isActive ? 'text-[#0052cc]' : 'text-[#51606f] hover:text-[#191c1e]',
              )}
            >
              <div className="relative">
                <span className={cn('material-symbols-outlined text-xl', isActive && 'fill')}>
                  {item.icon}
                </span>
                {item.badgeCount !== undefined && (
                  <span className="absolute -top-1 -right-2 bg-[#ef4444] text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full">
                    {item.badgeCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
