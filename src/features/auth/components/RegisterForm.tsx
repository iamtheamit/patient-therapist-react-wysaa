import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { Mail, Lock, User as UserIcon, UserCheck } from 'lucide-react';
import { registerSchema, type RegisterFormData } from '../schemas/authSchemas';
import { useRegister } from '../hooks/useRegister';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ROUTES } from '@/config/routes';

export const RegisterForm: React.FC = () => {
  const { mutate: registerUser, isPending } = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    registerUser(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left">
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
          className="text-xs font-semibold text-[#005eb8] hover:text-[#00478d] transition"
        >
          Already have an account? Sign in
        </Link>
      </div>
    </form>
  );
};
