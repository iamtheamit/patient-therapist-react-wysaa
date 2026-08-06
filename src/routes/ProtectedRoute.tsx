import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import type { UserRole } from '@/types/auth';
import { ROUTES } from '@/config/routes';
import { useAuthStore } from '@/stores/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRole?: UserRole;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRole }) => {
  const location = useLocation();
  const { isAuthenticated, user, token } = useAuthStore();

  // Fallback check to legacy token in localStorage if store hydration is in progress
  const hasToken = token || localStorage.getItem('auth_token');
  const userRole = user?.role || (localStorage.getItem('user_role') as UserRole) || 'PATIENT';

  if (!isAuthenticated && !hasToken) {
    return <Navigate to={ROUTES.AUTH.LOGIN} state={{ from: location }} replace />;
  }

  if (allowedRole && userRole !== allowedRole) {
    const fallbackPath =
      userRole === 'PATIENT' ? ROUTES.PATIENT.DASHBOARD : ROUTES.THERAPIST.DASHBOARD;
    return <Navigate to={fallbackPath} replace />;
  }

  return <>{children}</>;
};
