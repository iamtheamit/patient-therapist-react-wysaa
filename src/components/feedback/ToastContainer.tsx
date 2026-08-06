import React from 'react';
import { useUIStore } from '@/stores/uiStore';
import type { ToastNotification, UIState } from '@/stores/uiStore';
import { cn } from '@/utils/cn';

export const ToastContainer: React.FC = () => {
  const toasts = useUIStore((state: UIState) => state.toasts);
  const removeToast = useUIStore((state: UIState) => state.removeToast);

  if (toasts.length === 0) return null;

  const typeStyles = {
    success: 'bg-slate-900 border-emerald-500/40 text-emerald-300',
    error: 'bg-slate-900 border-rose-500/40 text-rose-300',
    info: 'bg-slate-900 border-indigo-500/40 text-indigo-300',
    warning: 'bg-slate-900 border-amber-500/40 text-amber-300',
  };

  const icons = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
    warning: '⚠',
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-3 max-w-sm w-full pointer-events-none px-4">
      {toasts.map((toast: ToastNotification) => (
        <div
          key={toast.id}
          className={cn(
            'pointer-events-auto flex items-start space-x-3 p-4 rounded-xl border shadow-2xl backdrop-blur-xl transition-all duration-300 animate-in slide-in-from-bottom-5',
            typeStyles[toast.type],
          )}
        >
          <div className="flex-shrink-0 w-5 h-5 rounded-full bg-white/10 flex items-center justify-center font-bold text-xs">
            {icons[toast.type]}
          </div>

          <div className="flex-1 text-left">
            <h4 className="text-sm font-semibold text-white leading-snug">{toast.title}</h4>
            {toast.message && <p className="mt-0.5 text-xs text-slate-400">{toast.message}</p>}
          </div>

          <button
            onClick={() => removeToast(toast.id)}
            className="flex-shrink-0 text-slate-400 hover:text-white p-0.5 rounded-md hover:bg-slate-800 transition"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
};
