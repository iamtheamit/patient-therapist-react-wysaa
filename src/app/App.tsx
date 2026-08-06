import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from '@/routes';
import { QueryProvider } from './QueryProvider';
import { ToastContainer } from '@/components/feedback/ToastContainer';

export const App: React.FC = () => {
  return (
    <QueryProvider>
      <RouterProvider router={router} />
      <ToastContainer />
    </QueryProvider>
  );
};

export default App;
