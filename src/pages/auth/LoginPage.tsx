import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/config/routes';
import { useAuthStore } from '@/stores/authStore';
import type { AuthState } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';
import type { UIState } from '@/stores/uiStore';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state: AuthState) => state.setAuth);
  const addToast = useUIStore((state: UIState) => state.addToast);

  const handleSimulateLogin = (role: 'PATIENT' | 'THERAPIST') => {
    const mockUser = {
      id: role === 'PATIENT' ? 'patient-101' : 'therapist-202',
      name: role === 'PATIENT' ? 'Alex Patient' : 'Dr. Sarah Connor',
      email: role === 'PATIENT' ? 'alex@example.com' : 'sarah@example.com',
      role,
    };

    setAuth(mockUser, 'mock_jwt_token_xyz');

    addToast({
      type: 'success',
      title: 'Signed In Successfully',
      message: `Welcome back, ${mockUser.name}!`,
    });

    const targetRoute = role === 'PATIENT' ? ROUTES.PATIENT.DASHBOARD : ROUTES.THERAPIST.DASHBOARD;
    navigate(targetRoute, { replace: true });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white text-center">Sign in to your account</h2>
        <p className="mt-1 text-xs text-slate-400 text-center">
          Choose a role to simulate authenticated session routing
        </p>
      </div>

      <div className="space-y-3 pt-2">
        <button
          onClick={() => handleSimulateLogin('PATIENT')}
          className="w-full flex justify-center py-2.5 px-4 border border-indigo-500/30 rounded-xl text-sm font-semibold text-white bg-indigo-600/80 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition shadow-lg shadow-indigo-600/20"
        >
          Sign in as Patient
        </button>

        <button
          onClick={() => handleSimulateLogin('THERAPIST')}
          className="w-full flex justify-center py-2.5 px-4 border border-teal-500/30 rounded-xl text-sm font-semibold text-white bg-teal-600/80 hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition shadow-lg shadow-teal-600/20"
        >
          Sign in as Therapist
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
