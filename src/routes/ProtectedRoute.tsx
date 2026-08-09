import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import type { UserRole } from '@/types/auth';
import { ROUTES } from '@/config/routes';
import { useAuthStore } from '@/stores/authStore';
import { PageSpinner } from '@/components/feedback/PageSpinner';
import { useSessionBootstrap } from '@/features/auth/hooks/useSessionBootstrap';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRole?: UserRole;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRole }) => {
  const location = useLocation();
  const isBootstrapping = useSessionBootstrap();
  const { isAuthenticated, user, token } = useAuthStore();

  const hasToken = token;
  const userRole = user?.role || 'PATIENT';

  if (isBootstrapping) {
    return <PageSpinner label="Restoring session..." />;
  }

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
