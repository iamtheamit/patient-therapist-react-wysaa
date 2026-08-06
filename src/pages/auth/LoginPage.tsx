import React from 'react';
import { LoginForm } from '@/features/auth';

export const LoginPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white text-center">Sign in to your account</h2>
        <p className="mt-1 text-xs text-slate-400 text-center">
          Enter your credentials or use demo quick fill to continue
        </p>
      </div>

      <LoginForm />
    </div>
  );
};

export default LoginPage;
