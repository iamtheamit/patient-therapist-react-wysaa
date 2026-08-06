import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '@/config/routes';
import { cn } from '@/utils/cn';

export const PatientMobileBottomNav: React.FC = () => {
  const location = useLocation();

  const mobileNavItems = [
    {
      id: 'home',
      label: 'Home',
      href: ROUTES.PATIENT.DASHBOARD,
      icon: 'home',
    },
    {
      id: 'book',
      label: 'Book',
      href: ROUTES.PATIENT.BOOK,
      icon: 'calendar_month',
    },
    {
      id: 'therapists',
      label: 'Therapists',
      href: ROUTES.PATIENT.BOOK,
      icon: 'group',
    },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-3 py-2 bg-white shadow-[0px_-4px_20px_rgba(0,0,0,0.05)] border-t border-slate-200 rounded-t-2xl">
      {mobileNavItems.map((item) => {
        const isActive = location.pathname === item.href;

        return (
          <Link
            key={item.id}
            to={item.href}
            className={cn(
              'flex flex-col items-center justify-center px-5 py-1.5 rounded-full transition-all duration-150 active:scale-95',
              isActive ? 'bg-[#d6e3ff] text-[#00478d]' : 'text-[#505f76] hover:text-[#191c1e]',
            )}
          >
            <span className={cn('material-symbols-outlined text-xl', isActive && 'fill')}>
              {item.icon}
            </span>
            <span className="font-semibold text-[10px] mt-0.5">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};
