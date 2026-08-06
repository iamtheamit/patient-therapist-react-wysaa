import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import type { UserRole } from '@/types/auth';
import { ROUTES } from '@/config/routes';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRole?: UserRole;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRole }) => {
  const location = useLocation();

  // Mock Authentication state - will be integrated with Zustand store in Phase 6/8
  // For initial router setup, read mock session from localStorage if present
  const mockToken = localStorage.getItem('auth_token');
  const mockRole = (localStorage.getItem('user_role') as UserRole) || 'PATIENT';

  if (!mockToken) {
    return <Navigate to={ROUTES.AUTH.LOGIN} state={{ from: location }} replace />;
  }

  if (allowedRole && mockRole !== allowedRole) {
    // Redirect to default dashboard for user's actual role
    const fallbackPath =
      mockRole === 'PATIENT' ? ROUTES.PATIENT.DASHBOARD : ROUTES.THERAPIST.DASHBOARD;
    return <Navigate to={fallbackPath} replace />;
  }

  return <>{children}</>;
};
