import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PATIENT_NAV_ITEMS } from '@/config/patientNavigation';
import { cn } from '@/utils/cn';

export const PatientSidebar: React.FC = () => {
  const location = useLocation();

  return (
    <aside className="hidden md:flex flex-col h-screen w-64 fixed left-0 top-0 bg-[#f8f9fb] shadow-md border-r border-[#c3c6d6]/50 z-40">
      {/* Brand Header */}
      <div className="p-6 border-b border-[#c3c6d6]/50">
        <Link to="/patient/dashboard" className="flex items-center gap-2 mb-1 group">
          <span className="material-symbols-outlined fill text-[#003d9b] text-3xl">
            diversity_1
          </span>
          <span className="font-heading text-xl font-bold text-[#003d9b]">CareConnect</span>
        </Link>
        <div className="text-xs font-semibold text-[#434654] uppercase tracking-wider">
          Patient Portal
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {PATIENT_NAV_ITEMS.map((item) => {
          const isActive =
            location.pathname === item.href ||
            (item.href !== '#' &&
              location.pathname.startsWith(item.href) &&
              item.href !== '/patient/dashboard');

          return (
            <React.Fragment key={item.id}>
              <Link
                to={item.href}
                className={cn(
                  'flex items-center justify-between px-4 py-3 rounded-lg text-sm font-semibold transition-all group',
                  isActive
                    ? 'bg-[#0052cc] text-white shadow-xs'
                    : 'text-[#51606f] hover:bg-[#d5e4f6]/50 hover:text-[#576675]',
                )}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      'material-symbols-outlined transition-all text-xl',
                      isActive ? 'fill text-white' : 'group-hover:fill text-[#576675]',
                    )}
                  >
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>

                {item.badgeCount !== undefined && (
                  <span
                    className={cn(
                      'text-xs font-semibold px-2 py-0.5 rounded-full',
                      item.badgeVariant === 'error'
                        ? 'bg-[#ba1a1a] text-white'
                        : 'bg-[#d5e4f6] text-[#001848]',
                    )}
                  >
                    {item.badgeCount}
                  </span>
                )}
              </Link>

              {item.dividerAfter && <div className="my-4 border-t border-[#c3c6d6]/30"></div>}
            </React.Fragment>
          );
        })}
      </nav>

      {/* Footer Support Link */}
      <div className="p-4 mt-auto border-t border-[#c3c6d6]/30">
        <div className="flex items-center gap-3 px-2 py-1 text-[#434654]">
          <span className="material-symbols-outlined text-[#003d9b]">headset_mic</span>
          <div className="flex flex-col text-left">
            <span className="text-xs font-semibold text-[#191c1e]">Need Help?</span>
            <a
              href="#support"
              className="text-xs text-[#51606f] hover:text-[#003d9b] transition-colors"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </aside>
  );
};
