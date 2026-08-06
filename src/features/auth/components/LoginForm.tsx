import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { Mail, Lock, LogIn } from 'lucide-react';
import { loginSchema, type LoginFormData } from '../schemas/authSchemas';
import { useLogin } from '../hooks/useLogin';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ROUTES } from '@/config/routes';

export const LoginForm: React.FC = () => {
  const { mutate: login, isPending } = useLogin();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: LoginFormData) => {
    login(data);
  };

  const fillDemoCredentials = (role: 'PATIENT' | 'THERAPIST') => {
    if (role === 'PATIENT') {
      setValue('email', 'alex.patient@wysa.com', { shouldValidate: true });
      setValue('password', 'Password123!', { shouldValidate: true });
    } else {
      setValue('email', 'dr.sarah.therapist@wysa.com', { shouldValidate: true });
      setValue('password', 'Password123!', { shouldValidate: true });
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left">
        <Input
          label="Email Address"
          type="email"
          placeholder="name@example.com"
          leftIcon={<Mail className="w-4 h-4" />}
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          leftIcon={<Lock className="w-4 h-4" />}
          error={errors.password?.message}
          {...register('password')}
        />

        <div className="flex items-center justify-between pt-1">
          <Link
            to={ROUTES.AUTH.REGISTER}
            className="text-xs text-indigo-400 hover:text-indigo-300 transition"
          >
            Need an account? Register
          </Link>
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full mt-2"
          isLoading={isPending}
          rightIcon={<LogIn className="w-4 h-4" />}
        >
          Sign In
        </Button>
      </form>

      {/* Quick Demo Pre-fill Shortcuts */}
      <div className="pt-4 border-t border-slate-800/80 text-left">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
          Demo Quick Fill
        </p>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => fillDemoCredentials('PATIENT')}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800/60 hover:bg-slate-800 text-slate-300 border border-slate-700/60 transition"
          >
            Patient Demo
          </button>
          <button
            type="button"
            onClick={() => fillDemoCredentials('THERAPIST')}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800/60 hover:bg-slate-800 text-slate-300 border border-slate-700/60 transition"
          >
            Therapist Demo
          </button>
        </div>
      </div>
    </div>
  );
};
