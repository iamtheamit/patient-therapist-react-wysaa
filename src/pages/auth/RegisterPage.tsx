import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/config/routes';

export const RegisterPage: React.FC = () => {
  return (
    <div className="space-y-6 text-center">
      <h2 className="text-xl font-bold text-white">Create Patient Account</h2>
      <p className="text-sm text-slate-400">Registration form will be implemented in Phase 8.</p>
      <Link
        to={ROUTES.AUTH.LOGIN}
        className="inline-block text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition"
      >
        Already have an account? Sign in
      </Link>
    </div>
  );
};

export default RegisterPage;
