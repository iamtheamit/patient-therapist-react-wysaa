import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/config/routes';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSimulateLogin = (role: 'PATIENT' | 'THERAPIST') => {
    localStorage.setItem('auth_token', 'mock_jwt_token_xyz');
    localStorage.setItem('user_role', role);

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
          className="w-full flex justify-center py-2.5 px-4 border border-indigo-500/30 rounded-xl text-sm font-semibold text-white bg-indigo-600/80 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
        >
          Sign in as Patient
        </button>

        <button
          onClick={() => handleSimulateLogin('THERAPIST')}
          className="w-full flex justify-center py-2.5 px-4 border border-teal-500/30 rounded-xl text-sm font-semibold text-white bg-teal-600/80 hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition"
        >
          Sign in as Therapist
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
