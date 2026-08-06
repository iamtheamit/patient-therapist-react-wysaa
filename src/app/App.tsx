import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from '@/routes';
import { QueryProvider } from './QueryProvider';
import { ErrorBoundary } from '@/components/feedback/ErrorBoundary';
import { ToastContainer } from '@/components/feedback/ToastContainer';

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <QueryProvider>
        <RouterProvider router={router} />
        <ToastContainer />
      </QueryProvider>
    </ErrorBoundary>
  );
};

export default App;
