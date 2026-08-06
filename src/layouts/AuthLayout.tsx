import React from 'react';
import { Outlet } from 'react-router-dom';

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen w-full bg-[#f8f9fb] text-[#191c1e] selection:bg-[#005eb8] selection:text-white">
      <Outlet />
    </div>
  );
};
