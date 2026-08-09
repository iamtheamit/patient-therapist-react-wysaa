import React from 'react';
import { Navigate } from 'react-router-dom';
import { ROUTES } from '@/config/routes';
import { useAuthStore } from '@/stores/authStore';
import { PageSpinner } from '@/components/feedback/PageSpinner';
import { useSessionBootstrap } from '@/features/auth/hooks/useSessionBootstrap';

interface PublicOnlyRouteProps {
  children: React.ReactNode;
}

export const PublicOnlyRoute: React.FC<PublicOnlyRouteProps> = ({ children }) => {
  const isBootstrapping = useSessionBootstrap();
  const { isAuthenticated, user, token } = useAuthStore();

  const hasToken = token;
  const userRole = user?.role || 'PATIENT';

  if (isBootstrapping) {
    return <PageSpinner label="Checking session..." />;
  }

  if (isAuthenticated || hasToken) {
    const defaultDashboard =
      userRole === 'PATIENT' ? ROUTES.PATIENT.DASHBOARD : ROUTES.THERAPIST.DASHBOARD;
    return <Navigate to={defaultDashboard} replace />;
  }

  return <>{children}</>;
};
