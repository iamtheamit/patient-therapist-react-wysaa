import React from 'react';
import { Navigate } from 'react-router-dom';
import type { UserRole } from '@/types/auth';
import { ROUTES } from '@/config/routes';

interface PublicOnlyRouteProps {
  children: React.ReactNode;
}

export const PublicOnlyRoute: React.FC<PublicOnlyRouteProps> = ({ children }) => {
  const mockToken = localStorage.getItem('auth_token');
  const mockRole = (localStorage.getItem('user_role') as UserRole) || 'PATIENT';

  if (mockToken) {
    const defaultDashboard =
      mockRole === 'PATIENT' ? ROUTES.PATIENT.DASHBOARD : ROUTES.THERAPIST.DASHBOARD;
    return <Navigate to={defaultDashboard} replace />;
  }

  return <>{children}</>;
};
