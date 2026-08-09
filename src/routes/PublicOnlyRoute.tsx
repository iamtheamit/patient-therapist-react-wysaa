import React from 'react';
import { Navigate } from 'react-router-dom';
import { ROUTES } from '@/config/routes';
import { useAuthStore } from '@/stores/authStore';
import { PageSpinner } from '@/components/feedback/PageSpinner';
import { useIsBootstrapping } from '@/app/SessionProvider';

interface PublicOnlyRouteProps {
  children: React.ReactNode;
}

export const PublicOnlyRoute: React.FC<PublicOnlyRouteProps> = ({ children }) => {
  const isBootstrapping = useIsBootstrapping();
  const { isAuthenticated, user, token } = useAuthStore();

  const hasToken = token;

  // If we have a token but user data hasn't loaded yet, treat it as bootstrapping
  const isUserLoading = hasToken && !user;

  if (isBootstrapping || isUserLoading) {
    return <PageSpinner label="Checking session..." />;
  }

  if (isAuthenticated || hasToken) {
    const userRole = user?.role || 'PATIENT';
    const defaultDashboard =
      userRole === 'PATIENT' ? ROUTES.PATIENT.DASHBOARD : ROUTES.THERAPIST.DASHBOARD;
    return <Navigate to={defaultDashboard} replace />;
  }

  return <>{children}</>;
};
