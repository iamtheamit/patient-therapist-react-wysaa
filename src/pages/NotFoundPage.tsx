import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/config/routes';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#f7f9fb] flex flex-col justify-center items-center px-4 text-center">
      <h1 className="text-6xl font-heading font-extrabold text-[#005eb8]">404</h1>
      <h2 className="mt-4 text-2xl font-heading font-bold text-[#191c1e]">Page Not Found</h2>
      <p className="mt-2 text-sm text-[#505f76] max-w-md">
        The route you are looking for does not exist or has been relocated.
      </p>
      <div className="mt-6">
        <Link
          to={ROUTES.AUTH.LOGIN}
          className="px-5 py-2.5 rounded-lg bg-[#005eb8] hover:bg-[#00478d] text-white font-semibold text-sm transition shadow-sm"
        >
          Return to Sign In
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
