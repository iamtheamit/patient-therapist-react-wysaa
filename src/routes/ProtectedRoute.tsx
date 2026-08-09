import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import type { UserRole } from '@/types/auth';
import { ROUTES } from '@/config/routes';
import { useAuthStore } from '@/stores/authStore';
import { PageSpinner } from '@/components/feedback/PageSpinner';
import { useIsBootstrapping } from '@/app/SessionProvider';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRole?: UserRole;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRole }) => {
  const location = useLocation();
  const isBootstrapping = useIsBootstrapping();
  const { isAuthenticated, user, token } = useAuthStore();

  const hasToken = token;

  // If we have a token but user data hasn't loaded yet, treat it as bootstrapping
  const isUserLoading = hasToken && !user;

  if (isBootstrapping || isUserLoading) {
    return <PageSpinner label="Getting things ready..." />;
  }

  if (!isAuthenticated && !hasToken) {
    return <Navigate to={ROUTES.AUTH.LOGIN} state={{ from: location }} replace />;
  }

  const userRole = user?.role || 'PATIENT';

  if (allowedRole && userRole !== allowedRole) {
    const fallbackPath =
      userRole === 'PATIENT' ? ROUTES.PATIENT.DASHBOARD : ROUTES.THERAPIST.DASHBOARD;
    return <Navigate to={fallbackPath} replace />;
  }

  return <>{children}</>;
};
