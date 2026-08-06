import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 py-6 text-slate-400 text-xs mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-medium text-slate-300">Wysa Care Systems Operational</span>
        </div>

        <p>© {new Date().getFullYear()} Wysa Care Inc. All rights reserved.</p>

        <div className="flex items-center space-x-4 text-slate-500">
          <a href="#privacy" className="hover:text-slate-300 transition">
            Privacy Policy
          </a>
          <span>•</span>
          <a href="#terms" className="hover:text-slate-300 transition">
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  );
};
