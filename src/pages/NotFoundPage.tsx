import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/config/routes';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4 text-center">
      <h1 className="text-6xl font-black text-indigo-500">404</h1>
      <h2 className="mt-4 text-2xl font-bold text-white">Page Not Found</h2>
      <p className="mt-2 text-sm text-slate-400 max-w-md">
        The route you are looking for does not exist or has been relocated.
      </p>
      <div className="mt-6">
        <Link
          to={ROUTES.AUTH.LOGIN}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition"
        >
          Return to Sign In
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
