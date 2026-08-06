import React from 'react';
import { RegisterForm } from '@/features/auth';

export const RegisterPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white text-center">Create your account</h2>
        <p className="mt-1 text-xs text-slate-400 text-center">
          Join Wysa Care as a Patient or Therapist
        </p>
      </div>

      <RegisterForm />
    </div>
  );
};

export default RegisterPage;
