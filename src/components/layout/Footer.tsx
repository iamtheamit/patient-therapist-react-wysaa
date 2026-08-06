import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 bg-[#f7f9fb] py-6 text-[#505f76] text-xs mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
          <span className="font-semibold text-[#191c1e]">TherapySync Systems Operational</span>
        </div>

        <p>© {new Date().getFullYear()} TherapySync Inc. All rights reserved.</p>

        <div className="flex items-center space-x-4 text-[#505f76]">
          <a href="#privacy" className="hover:text-[#191c1e] transition">
            Privacy Policy
          </a>
          <span>•</span>
          <a href="#terms" className="hover:text-[#191c1e] transition">
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  );
};
