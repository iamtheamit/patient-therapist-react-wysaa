import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';
import type { ToastNotification, UIState } from '@/stores/uiStore';
import { cn } from '@/utils/cn';

export const ToastContainer: React.FC = () => {
  const toasts = useUIStore((state: UIState) => state.toasts);
  const removeToast = useUIStore((state: UIState) => state.removeToast);

  const typeStyles = {
    success: {
      card: 'bg-white/95 border-emerald-200/80 text-[#191c1e] shadow-lg shadow-emerald-950/5 ring-1 ring-emerald-500/10',
      accentBar: 'bg-emerald-500',
      iconBg: 'bg-emerald-500 text-white shadow-xs shadow-emerald-500/30',
      icon: CheckCircle2,
    },
    error: {
      card: 'bg-white/95 border-rose-200/80 text-[#191c1e] shadow-lg shadow-rose-950/5 ring-1 ring-rose-500/10',
      accentBar: 'bg-rose-500',
      iconBg: 'bg-rose-500 text-white shadow-xs shadow-rose-500/30',
      icon: AlertCircle,
    },
    info: {
      card: 'bg-white/95 border-blue-200/80 text-[#191c1e] shadow-lg shadow-blue-950/5 ring-1 ring-blue-500/10',
      accentBar: 'bg-[#005eb8]',
      iconBg: 'bg-[#005eb8] text-white shadow-xs shadow-blue-500/30',
      icon: Info,
    },
    warning: {
      card: 'bg-white/95 border-amber-200/80 text-[#191c1e] shadow-lg shadow-amber-950/5 ring-1 ring-amber-500/10',
      accentBar: 'bg-amber-500',
      iconBg: 'bg-amber-500 text-white shadow-xs shadow-amber-500/30',
      icon: AlertTriangle,
    },
  };

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 md:top-auto md:bottom-6 md:left-auto md:right-6 md:translate-x-0 z-[100] flex flex-col items-center md:items-end space-y-2.5 max-w-sm w-[calc(100%-2rem)] md:w-full pointer-events-none">
      <AnimatePresence mode="sync">
        {toasts.map((toast: ToastNotification) => {
          const config = typeStyles[toast.type] || typeStyles.info;
          const IconComponent = config.icon;

          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: -16, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{
                opacity: 0,
                y: -16,
                scale: 0.95,
                transition: { duration: 0.1, ease: 'easeOut' },
              }}
              transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className={cn(
                'pointer-events-auto relative flex items-start space-x-3.5 p-4 rounded-2xl border backdrop-blur-xl transition-all overflow-hidden shadow-xl w-full',
                config.card,
              )}
            >
              {/* Left Color Accent Bar */}
              <div className={cn('absolute left-0 top-0 bottom-0 w-1.5', config.accentBar)} />

              {/* Icon Badge */}
              <div
                className={cn(
                  'flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center mt-0.5 transition-transform duration-200 hover:scale-105',
                  config.iconBg,
                )}
              >
                <IconComponent className="w-4 h-4 stroke-[2.2]" />
              </div>

              {/* Message Content */}
              <div className="flex-1 text-left pt-0.5 pr-2 min-w-0">
                <h4 className="text-xs font-heading font-extrabold text-[#191c1e] leading-snug tracking-tight">
                  {toast.title}
                </h4>
                {toast.message && (
                  <p className="mt-0.5 text-xs text-[#505f76] leading-relaxed font-medium">
                    {toast.message}
                  </p>
                )}
              </div>

              {/* Dismiss Button */}
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="flex-shrink-0 text-slate-400 hover:text-[#191c1e] p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                title="Dismiss notification"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
