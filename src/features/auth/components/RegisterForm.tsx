import React from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { Mail, Lock, User as UserIcon, UserCheck } from 'lucide-react';
import { registerSchema, type RegisterFormData } from '../schemas/authSchemas';
import { useRegister } from '../hooks/useRegister';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ROUTES } from '@/config/routes';
import { cn } from '@/utils/cn';

export const RegisterForm: React.FC = () => {
  const { mutate: registerUser, isPending } = useRegister();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'PATIENT',
    },
  });

  const selectedRole = useWatch({ control, name: 'role' });

  const onSubmit = (data: RegisterFormData) => {
    registerUser(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left">
      {/* Role Selection Tabs */}
      <div className="space-y-1.5">
        <label className="block text-xs font-semibold text-slate-300">Account Role</label>
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-900 border border-slate-800 rounded-xl">
          <button
            type="button"
            onClick={() => setValue('role', 'PATIENT', { shouldValidate: true })}
            className={cn(
              'py-2 px-3 rounded-lg text-xs font-semibold transition',
              selectedRole === 'PATIENT'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white',
            )}
          >
            Patient
          </button>
          <button
            type="button"
            onClick={() => setValue('role', 'THERAPIST', { shouldValidate: true })}
            className={cn(
              'py-2 px-3 rounded-lg text-xs font-semibold transition',
              selectedRole === 'THERAPIST'
                ? 'bg-teal-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white',
            )}
          >
            Therapist
          </button>
        </div>
      </div>

      <Input
        label="Full Name"
        type="text"
        placeholder="Jane Doe"
        leftIcon={<UserIcon className="w-4 h-4" />}
        error={errors.name?.message}
        {...register('name')}
      />

      <Input
        label="Email Address"
        type="email"
        placeholder="jane@example.com"
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

      <Button
        type="submit"
        variant="primary"
        className="w-full mt-4"
        isLoading={isPending}
        rightIcon={<UserCheck className="w-4 h-4" />}
      >
        Create Account
      </Button>

      <div className="text-center pt-2">
        <Link
          to={ROUTES.AUTH.LOGIN}
          className="text-xs text-indigo-400 hover:text-indigo-300 transition"
        >
          Already have an account? Sign in
        </Link>
      </div>
    </form>
  );
};
