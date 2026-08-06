/* eslint-disable react-refresh/only-export-components */
import { Suspense, lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ROUTES } from '@/config/routes';
import { AuthLayout } from '@/layouts/AuthLayout';
import { PatientLayout } from '@/layouts/PatientLayout';
import { TherapistLayout } from '@/layouts/TherapistLayout';
import { PageFallback } from '@/components/feedback/PageFallback';
import { ProtectedRoute } from './ProtectedRoute';
import { PublicOnlyRoute } from './PublicOnlyRoute';

// Lazy-loaded page components for optimal bundle splitting
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'));
const PatientDashboardPage = lazy(() => import('@/pages/patient/PatientDashboardPage'));
const BookAppointmentPage = lazy(() => import('@/pages/patient/BookAppointmentPage'));
const TherapistDashboardPage = lazy(() => import('@/pages/therapist/TherapistDashboardPage'));
const ScheduleManagementPage = lazy(() => import('@/pages/therapist/ScheduleManagementPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

export const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: <Navigate to={ROUTES.AUTH.LOGIN} replace />,
  },
  {
    element: (
      <PublicOnlyRoute>
        <AuthLayout />
      </PublicOnlyRoute>
    ),
    children: [
      {
        path: ROUTES.AUTH.LOGIN,
        element: (
          <Suspense fallback={<PageFallback />}>
            <LoginPage />
          </Suspense>
        ),
      },
      {
        path: ROUTES.AUTH.REGISTER,
        element: (
          <Suspense fallback={<PageFallback />}>
            <RegisterPage />
          </Suspense>
        ),
      },
    ],
  },
  {
    element: (
      <ProtectedRoute allowedRole="PATIENT">
        <PatientLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: ROUTES.PATIENT.DASHBOARD,
        element: (
          <Suspense fallback={<PageFallback />}>
            <PatientDashboardPage />
          </Suspense>
        ),
      },
      {
        path: ROUTES.PATIENT.BOOK,
        element: (
          <Suspense fallback={<PageFallback />}>
            <BookAppointmentPage />
          </Suspense>
        ),
      },
    ],
  },
  {
    element: (
      <ProtectedRoute allowedRole="THERAPIST">
        <TherapistLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: ROUTES.THERAPIST.DASHBOARD,
        element: (
          <Suspense fallback={<PageFallback />}>
            <TherapistDashboardPage />
          </Suspense>
        ),
      },
      {
        path: ROUTES.THERAPIST.SCHEDULE,
        element: (
          <Suspense fallback={<PageFallback />}>
            <ScheduleManagementPage />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: ROUTES.NOT_FOUND,
    element: (
      <Suspense fallback={<PageFallback />}>
        <NotFoundPage />
      </Suspense>
    ),
  },
]);
