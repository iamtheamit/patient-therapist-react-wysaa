import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { THERAPIST_NAV_ITEMS } from '@/config/therapistNavigation';
import { Logo } from '@/components/common/Logo';
import { cn } from '@/utils/cn';

export const TherapistSidebar: React.FC = () => {
  const location = useLocation();

  return (
    <aside className="hidden md:flex flex-col h-screen w-64 fixed left-0 top-0 bg-white shadow-md border-r border-[#c3c6d6]/50 z-40">
      {/* Brand Header matching Login Form */}
      <div className="p-6 border-b border-[#c3c6d6]/50">
        <Logo to="/therapist/dashboard" subtitle="Therapist Portal" />
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        {THERAPIST_NAV_ITEMS.map((item) => {
          const isActive =
            location.pathname === item.href ||
            (item.href !== '#' &&
              location.pathname.startsWith(item.href) &&
              item.href !== '/therapist/dashboard');

          return (
            <React.Fragment key={item.id}>
              <Link
                to={item.href}
                className={cn(
                  'flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all group',
                  isActive
                    ? 'bg-[#e6f0ff] text-[#0052cc] shadow-2xs'
                    : 'text-[#434654] hover:bg-[#f8f9fb] hover:text-[#191c1e]',
                )}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      'material-symbols-outlined transition-all text-xl',
                      isActive ? 'fill text-[#0052cc]' : 'group-hover:fill text-[#434654]',
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
                        ? 'bg-[#ef4444] text-white'
                        : 'bg-[#e6f0ff] text-[#0052cc]',
                    )}
                  >
                    {item.badgeCount}
                  </span>
                )}
              </Link>

              {item.dividerAfter && <div className="my-3 border-t border-[#c3c6d6]/30"></div>}
            </React.Fragment>
          );
        })}
      </nav>

      {/* Resource Illustration & Support Link */}
      <div className="p-4 mt-auto border-t border-[#c3c6d6]/30">
        <div className="bg-[#e6f0ff] rounded-2xl p-4 text-center">
          <img
            alt="Therapist workspace illustration"
            className="mx-auto mb-3 w-28 h-20 object-contain"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDz0HTd0aPr_vyYJ1nUmDIzgBhe0cgG_ifoUJrZ1hxlbLPZ8hfUPgm27EfX-kM5VeIaahkT13R5RxekZiOpqJr9UTvXd7WklRT9ZAZkGzjSRD8TJDOX6ppxuYrg8ye1pc1_sfwD7aQdna7ys9HsoTsMW9KUkruQeezrE7B4M27__hbnXFkga023x1CAcMaWBXXxsqOVjWYtN-Jwo5_MQtw02RUgGDurK9xFr_igWY25stEQatHjPxq9"
          />
          <h4 className="font-heading font-bold text-xs text-[#191c1e] mb-1">
            Helping people live better lives
          </h4>
          <p className="text-[11px] text-[#434654] mb-3 leading-snug">
            Stay organized, manage your schedule and make an impact.
          </p>
          <a
            href="#resources"
            className="w-full py-2 bg-white text-[#0052cc] border border-[#0052cc]/20 rounded-lg font-semibold text-xs flex items-center justify-center gap-1.5 hover:bg-gray-50 transition-colors shadow-2xs"
          >
            View Resources
            <span className="material-symbols-outlined text-sm">open_in_new</span>
          </a>
        </div>

        <div className="mt-4 flex items-center gap-3 px-2 text-[#434654]">
          <div className="w-8 h-8 rounded-full bg-[#f8f9fb] flex items-center justify-center text-[#434654] border border-[#c3c6d6]/50">
            <span className="material-symbols-outlined text-sm">headset_mic</span>
          </div>
          <div>
            <p className="font-bold text-xs text-[#191c1e]">Need Help?</p>
            <p className="text-[11px] text-[#434654]">Contact Support</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
