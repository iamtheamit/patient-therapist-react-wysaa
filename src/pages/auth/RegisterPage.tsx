import React from 'react';
import { motion } from 'framer-motion';
import { RegisterForm } from '@/features/auth';

export const RegisterPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#f7f9fb] text-[#191c1e] flex flex-col items-center justify-center py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decorative Radial Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#005eb8]/5 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[300px] bg-[#10b981]/5 blur-[100px] pointer-events-none rounded-full" />

      <motion.div
        initial={{ opacity: 0, y: 15, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="w-full max-w-md mx-auto my-auto space-y-5 z-10"
      >
        {/* Header Branding */}
        <div className="text-center space-y-1">
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="material-symbols-outlined text-[#005eb8] text-3xl">psychology</span>
            <h1 className="text-3xl font-heading font-extrabold tracking-tight text-[#191c1e]">
              Therapy<span className="text-[#005eb8]">Sync</span>
            </h1>
          </div>
          <p className="text-xs text-[#505f76] font-medium">
            Connecting patients and therapists with simple, compassionate care
          </p>
        </div>

        {/* Card Container */}
        <div className="bg-white shadow-[0_10px_40px_rgba(0,0,0,0.05)] border border-slate-200 rounded-2xl overflow-hidden">
          <div className="py-7 px-6 sm:px-8 space-y-4">
            <div>
              <h2 className="text-xl font-heading font-extrabold text-[#191c1e] text-center">
                Create your account
              </h2>
              <p className="mt-1 text-xs text-[#505f76] text-center">
                Join TherapySync as a Patient or Therapist
              </p>
            </div>
            <RegisterForm />
          </div>
          <div className="h-1.5 w-full bg-[#005eb8]" />
        </div>

        {/* Footer */}
        <footer className="text-center text-xs text-[#505f76] pt-1">
          <p>© {new Date().getFullYear()} TherapySync. All rights reserved.</p>
        </footer>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
