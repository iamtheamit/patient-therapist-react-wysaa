import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { loginSchema, type LoginFormData } from '../schemas/authSchemas';
import { useLogin } from '../hooks/useLogin';
import { ROUTES } from '@/config/routes';
import { Logo } from '@/components/common/Logo';

export const LoginForm: React.FC = () => {
  const { mutate: login, isPending } = useLogin();
  const [showPassword, setShowPassword] = useState(false);
  const [activeRole, setActiveRole] = useState<'patient' | 'therapist'>('patient');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'patient@wysa.com',
      password: 'Password123!',
    },
  });

  const onSubmit = (data: LoginFormData) => {
    login(data);
  };

  const handleRoleSelect = (role: 'patient' | 'therapist') => {
    setActiveRole(role);
    if (role === 'patient') {
      setValue('email', 'patient@wysa.com', { shouldValidate: true });
      setValue('password', 'Password123!', { shouldValidate: true });
    } else {
      setValue('email', 'therapist@wysa.com', { shouldValidate: true });
      setValue('password', 'Password123!', { shouldValidate: true });
    }
  };

  return (
    <div className="min-h-screen w-full bg-white flex flex-col justify-between font-body-md text-[#191c1e] selection:bg-[#005eb8] selection:text-white">
      {/* Top Header Logo */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <Logo />
      </header>

      {/* Main Content: Centered Grid */}
      <main className="w-full max-w-5xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center my-auto py-4">
        {/* Left Side: Illustration */}
        <div className="hidden lg:flex lg:col-span-6 items-center justify-center relative">
          <div className="relative w-full max-w-[420px] aspect-4/3 flex items-center justify-center">
            <img
              id="illustration-patient"
              alt="Patient Telehealth"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDZyrRvwXY5RvExmj7FRLRGQRmCK6L8wf7AN6FRnwITrRzoG3Zobtw7FHHNGAvb3PTmCZKlo26tPOncXiG6CjJe5xhRUk_UvNVftrTM7ajU3aO_y2g5n2Bj5Uj6wpPYQr2KsZr_OFk7VbHpQqCB-PX47xmneLP4UcF-Y_4a8zY9gg2Dq0QKtn_Lvrp0dT9WfbWmxfUktXbQm2ery4iR1vEIGxlcD8LzNnJ9gsdhkDjwIHVa4nqpFJPS"
              className={`w-full h-auto max-h-[380px] object-contain transition-all duration-500 ${
                activeRole === 'patient'
                  ? 'opacity-100 scale-100'
                  : 'opacity-0 scale-95 pointer-events-none absolute'
              }`}
            />
            <img
              id="illustration-therapist"
              alt="Therapist Workspace"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDRcqZ_cWcJP0_QPztZej0X2YO3FiryQP9-flJurY6OGmooSV1ihprykFJtNQgpMufZq6v-ImUHxqT1R-vtJPjVuKbEp5BFnufVV0kNfWT99TJ3XIVhna4e7t-PpZcCS9WPnqmgF8QwwTPS09uxF__cUge3coo3RwY9lj5JlwRPNTck49GlmJJK4-XHY-RDi_lvSp6a4iOD7uMmKz5W4WGe_Ue_AffQlVM-WfTHK6IC5UyRWmddMhU6"
              className={`w-full h-auto max-h-[380px] object-contain transition-all duration-500 ${
                activeRole === 'therapist'
                  ? 'opacity-100 scale-100'
                  : 'opacity-0 scale-95 pointer-events-none absolute'
              }`}
            />
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="col-span-1 lg:col-span-6 flex flex-col items-center justify-center">
          <div className="w-full max-w-[400px] flex flex-col gap-6">
            {/* Form Header */}
            <div className="flex flex-col items-center text-center gap-1.5">
              <h1 className="font-heading text-2xl md:text-3xl font-bold text-[#191c1e]">
                Sign in to your account
              </h1>
              <p className="text-sm text-[#505f76]">Select your portal below to sign in</p>
            </div>

            {/* Role Segmented Tabs */}
            <div className="grid grid-cols-2 p-1 rounded-xl bg-slate-100 border border-slate-200/80">
              <button
                type="button"
                onClick={() => handleRoleSelect('patient')}
                className={`py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  activeRole === 'patient'
                    ? 'bg-white text-[#005eb8] shadow-sm font-bold'
                    : 'text-[#505f76] hover:text-[#191c1e]'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">person</span>
                Patient
              </button>

              <button
                type="button"
                onClick={() => handleRoleSelect('therapist')}
                className={`py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  activeRole === 'therapist'
                    ? 'bg-white text-[#005eb8] shadow-sm font-bold'
                    : 'text-[#505f76] hover:text-[#191c1e]'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">medical_services</span>
                Therapist
              </button>
            </div>

            {/* Form */}
            <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-[#191c1e]" htmlFor="email">
                  Email Address
                </label>
                <div className="relative">
                  <span
                    className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#737685] text-[20px]"
                    style={{ fontVariationSettings: "'FILL' 0" }}
                  >
                    mail
                  </span>
                  <input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    className="w-full pl-11 pr-4 py-3 rounded-lg border border-[#c3c6d6] bg-white text-[#191c1e] text-sm focus:border-[#005eb8] focus:ring-2 focus:ring-[#005eb8]/15 transition-all outline-none font-medium"
                    {...register('email')}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-600 font-medium mt-0.5">{errors.email.message}</p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-[#191c1e]" htmlFor="password">
                    Password
                  </label>
                  <a
                    href="#forgot-password"
                    onClick={(e) => {
                      e.preventDefault();
                      alert('Password reset link has been sent to your email.');
                    }}
                    className="text-xs font-semibold text-[#005eb8] hover:underline"
                  >
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <span
                    className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#737685] text-[20px]"
                    style={{ fontVariationSettings: "'FILL' 0" }}
                  >
                    lock
                  </span>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-10 py-3 rounded-lg border border-[#c3c6d6] bg-white text-[#191c1e] text-sm focus:border-[#005eb8] focus:ring-2 focus:ring-[#005eb8]/15 transition-all outline-none font-medium"
                    {...register('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#737685] hover:text-[#191c1e] transition-colors cursor-pointer"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    <span
                      className="material-symbols-outlined text-[20px]"
                      style={{ fontVariationSettings: "'FILL' 0" }}
                    >
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-600 font-medium mt-0.5">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-4 pt-2">
                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full py-3 rounded-lg bg-[#005eb8] text-white font-semibold text-sm hover:bg-[#00478d] transition-colors flex justify-center items-center gap-2 shadow-sm disabled:opacity-75 cursor-pointer"
                >
                  {isPending ? (
                    <span>Signing in...</span>
                  ) : (
                    <>
                      Sign In
                      <span
                        className="material-symbols-outlined text-[20px]"
                        style={{ fontVariationSettings: "'FILL' 0" }}
                      >
                        arrow_forward
                      </span>
                    </>
                  )}
                </button>

                <div className="text-center">
                  <Link
                    to={ROUTES.AUTH.REGISTER}
                    className="text-sm font-semibold text-[#005eb8] hover:underline"
                  >
                    Need an account? Register
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#505f76] gap-4">
        <p className="opacity-70">© 2026 TherapySync. HIPAA Compliant.</p>

        <div className="flex gap-6 text-[#505f76]">
          <a
            href="#privacy"
            onClick={(e) => e.preventDefault()}
            className="hover:text-[#005eb8] transition-colors"
          >
            Privacy Policy
          </a>
          <a
            href="#terms"
            onClick={(e) => e.preventDefault()}
            className="hover:text-[#005eb8] transition-colors"
          >
            Terms of Service
          </a>
          <a
            href="#help"
            onClick={(e) => e.preventDefault()}
            className="hover:text-[#005eb8] transition-colors"
          >
            Help & Support
          </a>
        </div>
      </footer>
    </div>
  );
};
