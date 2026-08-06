import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ErrorFallbackProps {
  error?: Error | null;
  resetErrorBoundary?: () => void;
}

export const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetErrorBoundary }) => {
  const handleReload = () => {
    if (resetErrorBoundary) {
      resetErrorBoundary();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f9fb] flex items-center justify-center p-6 text-left">
      <div className="max-w-md w-full bg-white border border-rose-200 rounded-2xl p-8 space-y-6 shadow-[0_10px_40px_rgba(0,0,0,0.06)] relative overflow-hidden text-[#191c1e]">
        <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center">
          <AlertTriangle className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-heading font-bold text-[#191c1e]">Something Went Wrong</h2>
          <p className="text-xs text-[#505f76] leading-relaxed">
            An unexpected error occurred while rendering this module. Our telemetry team has been
            notified.
          </p>
        </div>

        {error?.message && (
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 font-mono text-xs text-rose-700 break-words">
            {error.message}
          </div>
        )}

        <div className="flex items-center space-x-3 pt-2">
          <Button
            variant="danger"
            size="md"
            className="flex-1"
            leftIcon={<RefreshCw className="w-4 h-4" />}
            onClick={handleReload}
          >
            Try Again
          </Button>

          <a href="/" className="flex-1">
            <Button
              variant="outline"
              size="md"
              className="w-full"
              leftIcon={<Home className="w-4 h-4" />}
            >
              Back to Home
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
};
