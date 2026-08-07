import React, { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/utils/cn';

// --- Size map -----------------------------------------------------------------

const sizeClasses: Record<ModalSize, string> = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
};

// --- Types --------------------------------------------------------------------

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl';
export type ModalVariant = 'default' | 'danger' | 'warning' | 'success';

export interface ModalAction {
  label: string;
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
}

export interface ModalProps {
  /** Controls visibility */
  isOpen: boolean;
  /** Called when the modal should close (backdrop click, Esc, x button) */
  onClose: () => void;
  /** Optional heading */
  title?: string;
  /** Optional subtitle below the heading */
  description?: string;
  /** Optional small category tag */
  badge?: string;
  /** Icon shown in the header area (e.g. a Lucide icon element) */
  icon?: React.ReactNode;
  /** Colour theme */
  variant?: ModalVariant;
  /** Width preset */
  size?: ModalSize;
  /** When provided the modal renders a built-in footer with primary + cancel buttons */
  primaryAction?: ModalAction;
  /** Override the cancel button label */
  cancelLabel?: string;
  /** Hide the top-right close button */
  hideCloseButton?: boolean;
  /** Extra classes for the modal panel */
  className?: string;
  children?: React.ReactNode;
}

// --- Variant styles -----------------------------------------------------------

const variantIconRing: Record<ModalVariant, string> = {
  default:
    'bg-blue-50 text-[#0052cc] border border-blue-100/80 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900/40',
  danger:
    'bg-rose-50 text-rose-600 border border-rose-100/80 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-900/40',
  warning:
    'bg-amber-50 text-amber-600 border border-amber-100/80 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/40',
  success:
    'bg-emerald-50 text-emerald-600 border border-emerald-100/80 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/40',
};

const variantPrimaryBtn: Record<ModalVariant, string> = {
  default:
    'bg-[#0052cc] hover:bg-[#0041a8] text-white shadow-2xs font-medium focus-visible:ring-2 focus-visible:ring-[#0052cc]/40',
  danger:
    'bg-rose-600 hover:bg-rose-700 text-white shadow-2xs font-medium focus-visible:ring-2 focus-visible:ring-rose-600/40',
  warning:
    'bg-amber-600 hover:bg-amber-700 text-white shadow-2xs font-medium focus-visible:ring-2 focus-visible:ring-amber-600/40',
  success:
    'bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs font-medium focus-visible:ring-2 focus-visible:ring-emerald-600/40',
};

// --- Component ----------------------------------------------------------------

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  badge,
  icon,
  variant = 'default',
  size = 'md',
  primaryAction,
  cancelLabel = 'Cancel',
  hideCloseButton = false,
  className,
  children,
}) => {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  const showHeader = !!(icon || title || description);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? 'modal-title' : undefined}
          aria-describedby={description ? 'modal-desc' : undefined}
        >
          {/* Subtle Enterprise Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-2xs"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Clean Enterprise Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 8 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              'relative w-full bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl',
              'shadow-xl border border-slate-200/90 dark:border-slate-800 text-left z-10 overflow-hidden',
              sizeClasses[size],
              className,
            )}
          >
            {/* Close button */}
            {!hideCloseButton && (
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:text-slate-300 dark:hover:bg-slate-800 transition cursor-pointer z-20"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* Header */}
            {showHeader && (
              <div className="px-6 pt-6 pb-4 flex items-start gap-3.5">
                {icon && (
                  <div
                    className={cn(
                      'w-10 h-10 rounded-lg flex items-center justify-center shrink-0 mt-0.5',
                      variantIconRing[variant],
                    )}
                  >
                    {icon}
                  </div>
                )}
                <div className="flex-1 min-w-0 pr-6">
                  {badge && (
                    <span className="inline-block text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                      {badge}
                    </span>
                  )}
                  {title && (
                    <h2
                      id="modal-title"
                      className="text-base font-semibold text-slate-900 dark:text-slate-100 tracking-tight leading-6"
                    >
                      {title}
                    </h2>
                  )}
                  {description && (
                    <p
                      id="modal-desc"
                      className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-normal font-normal"
                    >
                      {description}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Body */}
            {children && (
              <div className={cn('px-6', showHeader ? 'pb-5' : 'pt-6 pb-5')}>{children}</div>
            )}

            {/* Built-in footer */}
            {primaryAction && (
              <div className="flex items-center justify-end gap-2.5 px-6 py-3.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/80">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3.5 py-2 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors shadow-2xs cursor-pointer"
                >
                  {cancelLabel}
                </button>
                <button
                  type="button"
                  onClick={primaryAction.onClick}
                  disabled={primaryAction.disabled || primaryAction.loading}
                  className={cn(
                    'px-3.5 py-2 text-xs sm:text-sm rounded-lg transition-colors cursor-pointer',
                    'disabled:opacity-60 disabled:cursor-not-allowed',
                    variantPrimaryBtn[variant],
                  )}
                >
                  {primaryAction.loading ? (
                    <span className="flex items-center gap-2">
                      <svg
                        className="w-3.5 h-3.5 animate-spin text-current"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      {primaryAction.label}
                    </span>
                  ) : (
                    primaryAction.label
                  )}
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
