import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from '@/routes';
import { QueryProvider } from './QueryProvider';
import { ErrorBoundary } from '@/components/feedback/ErrorBoundary';
import { ToastContainer } from '@/components/feedback/ToastContainer';
import { SessionProvider } from './SessionProvider';

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <QueryProvider>
        <SessionProvider>
          <RouterProvider router={router} />
          <ToastContainer />
        </SessionProvider>
      </QueryProvider>
    </ErrorBoundary>
  );
};

export default App;
