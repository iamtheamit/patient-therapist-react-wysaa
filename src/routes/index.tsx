/* eslint-disable react-refresh/only-export-components */
import { Suspense, lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ROUTES } from '@/config/routes';
import { AuthLayout } from '@/layouts/AuthLayout';
import { PatientLayout } from '@/layouts/PatientLayout';
import { TherapistLayout } from '@/layouts/TherapistLayout';
import { PageSpinner } from '@/components/feedback/PageSpinner';
import { ProtectedRoute } from './ProtectedRoute';
import { PublicOnlyRoute } from './PublicOnlyRoute';

// Lazy-loaded page components for optimal bundle splitting
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'));
const PatientDashboardPage = lazy(() => import('@/pages/patient/PatientDashboardPage'));
const BookAppointmentPage = lazy(() => import('@/pages/patient/BookAppointmentPage'));
const PatientMessagesPage = lazy(() => import('@/pages/patient/PatientMessagesPage'));
const PatientPaymentsPage = lazy(() => import('@/pages/patient/PatientPaymentsPage'));
const PatientProfilePage = lazy(() => import('@/pages/patient/PatientProfilePage'));
const PatientSettingsPage = lazy(() => import('@/pages/patient/PatientSettingsPage'));

const TherapistDashboardPage = lazy(() => import('@/pages/therapist/TherapistDashboardPage'));
const TherapistAppointmentsPage = lazy(() => import('@/pages/therapist/TherapistAppointmentsPage'));
const ScheduleManagementPage = lazy(() => import('@/pages/therapist/ScheduleManagementPage'));
const TherapistAvailabilityPage = lazy(() => import('@/pages/therapist/TherapistAvailabilityPage'));
const TherapistPatientsPage = lazy(() => import('@/pages/therapist/TherapistPatientsPage'));
const TherapistMessagesPage = lazy(() => import('@/pages/therapist/TherapistMessagesPage'));
const TherapistReportsPage = lazy(() => import('@/pages/therapist/TherapistReportsPage'));
const TherapistSettingsPage = lazy(() => import('@/pages/therapist/TherapistSettingsPage'));
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
          <Suspense fallback={<PageSpinner label="Loading..." />}>
            <LoginPage />
          </Suspense>
        ),
      },
      {
        path: ROUTES.AUTH.REGISTER,
        element: (
          <Suspense fallback={<PageSpinner label="Loading..." />}>
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
          <Suspense fallback={<PageSpinner label="Loading patient dashboard..." />}>
            <PatientDashboardPage />
          </Suspense>
        ),
      },
      {
        path: ROUTES.PATIENT.BOOK,
        element: (
          <Suspense fallback={<PageSpinner label="Loading booking wizard..." />}>
            <BookAppointmentPage />
          </Suspense>
        ),
      },
      {
        path: ROUTES.PATIENT.MESSAGES,
        element: (
          <Suspense fallback={<PageSpinner label="Loading clinical messages..." />}>
            <PatientMessagesPage />
          </Suspense>
        ),
      },
      {
        path: ROUTES.PATIENT.PAYMENTS,
        element: (
          <Suspense fallback={<PageSpinner label="Loading billing & payments..." />}>
            <PatientPaymentsPage />
          </Suspense>
        ),
      },
      {
        path: ROUTES.PATIENT.PROFILE,
        element: (
          <Suspense fallback={<PageSpinner label="Loading patient profile..." />}>
            <PatientProfilePage />
          </Suspense>
        ),
      },
      {
        path: ROUTES.PATIENT.SETTINGS,
        element: (
          <Suspense fallback={<PageSpinner label="Loading account settings..." />}>
            <PatientSettingsPage />
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
          <Suspense fallback={<PageSpinner label="Loading therapist agenda..." />}>
            <TherapistDashboardPage />
          </Suspense>
        ),
      },
      {
        path: ROUTES.THERAPIST.APPOINTMENTS,
        element: (
          <Suspense fallback={<PageSpinner label="Loading appointments..." />}>
            <TherapistAppointmentsPage />
          </Suspense>
        ),
      },
      {
        path: ROUTES.THERAPIST.SCHEDULE,
        element: (
          <Suspense fallback={<PageSpinner label="Loading schedule management..." />}>
            <ScheduleManagementPage />
          </Suspense>
        ),
      },
      {
        path: ROUTES.THERAPIST.AVAILABILITY,
        element: (
          <Suspense fallback={<PageSpinner label="Loading working availability..." />}>
            <TherapistAvailabilityPage />
          </Suspense>
        ),
      },
      {
        path: ROUTES.THERAPIST.PATIENTS,
        element: (
          <Suspense fallback={<PageSpinner label="Loading patient directory..." />}>
            <TherapistPatientsPage />
          </Suspense>
        ),
      },
      {
        path: ROUTES.THERAPIST.MESSAGES,
        element: (
          <Suspense fallback={<PageSpinner label="Loading patient messages..." />}>
            <TherapistMessagesPage />
          </Suspense>
        ),
      },
      {
        path: ROUTES.THERAPIST.REPORTS,
        element: (
          <Suspense fallback={<PageSpinner label="Loading clinical reports..." />}>
            <TherapistReportsPage />
          </Suspense>
        ),
      },
      {
        path: ROUTES.THERAPIST.SETTINGS,
        element: (
          <Suspense fallback={<PageSpinner label="Loading practice settings..." />}>
            <TherapistSettingsPage />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: ROUTES.NOT_FOUND,
    element: (
      <Suspense fallback={<PageSpinner label="Loading page..." />}>
        <NotFoundPage />
      </Suspense>
    ),
  },
]);
