import React from 'react';
import { Navigate } from 'react-router-dom';
import type { UserRole } from '@/types/auth';
import { ROUTES } from '@/config/routes';
import { useAuthStore } from '@/stores/authStore';

interface PublicOnlyRouteProps {
  children: React.ReactNode;
}

export const PublicOnlyRoute: React.FC<PublicOnlyRouteProps> = ({ children }) => {
  const { isAuthenticated, user, token } = useAuthStore();

  const hasToken = token || localStorage.getItem('auth_token');
  const userRole = user?.role || (localStorage.getItem('user_role') as UserRole) || 'PATIENT';

  if (isAuthenticated || hasToken) {
    const defaultDashboard =
      userRole === 'PATIENT' ? ROUTES.PATIENT.DASHBOARD : ROUTES.THERAPIST.DASHBOARD;
    return <Navigate to={defaultDashboard} replace />;
  }

  return <>{children}</>;
};
