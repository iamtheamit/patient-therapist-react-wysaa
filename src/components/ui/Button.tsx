import React, { forwardRef } from 'react';
import { cn } from '@/utils/cn';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success' | 'gradient' | 'white';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  pill?: boolean;
  glow?: boolean;
  shine?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      pill = false,
      glow = false,
      shine = true,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    const baseStyles = cn(
      'group relative inline-flex items-center justify-center font-bold tracking-tight transition-all duration-250 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.97] overflow-hidden cursor-pointer',
      pill ? 'rounded-full' : 'rounded-xl',
    );

    const variants = {
      primary: cn(
        'bg-gradient-to-r from-[#0052cc] via-[#0066ff] to-[#003d9b]',
        'hover:from-[#0047b3] hover:via-[#0052cc] hover:to-[#002b70]',
        'text-white focus:ring-[#0052cc] border border-white/20',
        'shadow-[0_4px_14px_0_rgba(0,82,204,0.3)] hover:shadow-[0_6px_20px_rgba(0,82,204,0.45)] hover:-translate-y-0.5',
      ),
      gradient: cn(
        'bg-gradient-to-r from-[#0052cc] via-[#1d6bf3] to-[#003882]',
        'hover:from-[#0042a8] hover:via-[#0052cc] hover:to-[#002866]',
        'text-white focus:ring-blue-500 border border-white/25',
        'shadow-[0_6px_20px_rgba(0,82,204,0.35)] hover:shadow-[0_10px_28px_rgba(0,82,204,0.5)] hover:-translate-y-0.5',
      ),
      white: cn(
        'bg-white hover:bg-slate-50 text-[#003d9b] focus:ring-white border border-white/60',
        'shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.18)] hover:-translate-y-0.5',
      ),
      secondary: cn(
        'bg-slate-100/90 hover:bg-slate-200/90 text-[#191c1e] focus:ring-slate-400 border border-slate-200/80',
        'shadow-xs hover:shadow-md hover:-translate-y-0.5 backdrop-blur-xs',
      ),
      outline: cn(
        'bg-white hover:bg-[#f0f5ff] text-[#0052cc] border border-[#0052cc]/40 hover:border-[#0052cc] focus:ring-[#0052cc]',
        'shadow-xs hover:shadow-md hover:-translate-y-0.5',
      ),
      ghost: cn(
        'bg-transparent hover:bg-slate-100/80 text-[#505f76] hover:text-[#191c1e] focus:ring-slate-300 border border-transparent',
      ),
      danger: cn(
        'bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white focus:ring-rose-500 border border-white/15',
        'shadow-[0_4px_14px_rgba(225,29,72,0.35)] hover:shadow-[0_6px_20px_rgba(225,29,72,0.45)] hover:-translate-y-0.5',
      ),
      success: cn(
        'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white focus:ring-emerald-500 border border-white/15',
        'shadow-[0_4px_14px_rgba(16,185,129,0.35)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.45)] hover:-translate-y-0.5',
      ),
    };

    const sizes = {
      sm: 'px-3.5 py-2 text-xs gap-2',
      md: 'px-5 py-2.5 text-sm gap-2.5',
      lg: 'px-7 py-3.5 text-base gap-3',
    };

    const extraGlow = glow
      ? 'shadow-[0_8px_25px_rgba(0,82,204,0.4)] hover:shadow-[0_12px_32px_rgba(0,82,204,0.55)]'
      : '';

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], extraGlow, className)}
        {...props}
      >
        {/* Subtle diagonal shine overlay on hover */}
        {shine && (
          <span className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        )}

        {isLoading ? (
          <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
        ) : (
          leftIcon && (
            <span className="inline-flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-110">
              {leftIcon}
            </span>
          )
        )}
        <span className="relative z-10 font-bold">{children}</span>
        {!isLoading && rightIcon && (
          <span className="inline-flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:translate-x-0.5">
            {rightIcon}
          </span>
        )}
      </button>
    );
  },
);

Button.displayName = 'Button';
