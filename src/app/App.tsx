import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from '@/routes';
import { QueryProvider } from './QueryProvider';

export const App: React.FC = () => {
  return (
    <QueryProvider>
      <RouterProvider router={router} />
    </QueryProvider>
  );
};

export default App;
