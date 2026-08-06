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
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-left">
      <div className="max-w-md w-full bg-slate-900 border border-rose-500/30 rounded-2xl p-8 space-y-6 shadow-2xl relative overflow-hidden">
        <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center">
          <AlertTriangle className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-black text-white">Something Went Wrong</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            An unexpected error occurred while rendering this module. Our telemetry team has been
            notified.
          </p>
        </div>

        {error?.message && (
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 font-mono text-xs text-rose-300 break-words">
            {error.message}
          </div>
        )}

        <div className="flex items-center space-x-3 pt-2">
          <Button
            variant="primary"
            size="md"
            className="flex-1 bg-rose-600 hover:bg-rose-500 border-rose-500/30"
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
