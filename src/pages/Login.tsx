import React, { useState } from 'react';

console.log('Login: React imported successfully');
import { useNavigate, Link } from 'react-router-dom';

console.log('Login: react-router-dom imported successfully');
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

console.log('Login: react-hook-form and zod imported successfully');
import { motion } from 'framer-motion';

console.log('Login: framer-motion imported successfully');
import { useAuth } from '@/context/AuthContext';
import { PremiumInput } from '@/components/ui/premium-input';
import { PremiumButton } from '@/components/ui/premium-button';
import { PremiumCard, PremiumCardHeader, PremiumCardTitle, PremiumCardDescription, PremiumCardContent, PremiumCardFooter } from '@/components/ui/premium-card';
import { PremiumLoader } from '@/components/ui/premium-loader';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

console.log('Login: lucide-react icons imported successfully');

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional()
});

type LoginFormData = z.infer<typeof loginSchema>;

export const Login: React.FC = () => {
  console.log('Login: Rendering Login component...');
  
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false
    }
  });

  const onSubmit = async (data: LoginFormData) => {
    const success = await login(data.email, data.password, data.rememberMe);
    if (success) {
      navigate('/');
    } else {
      // Handle login error
      console.error('Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary to-primary/80 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-primary to-primary/80 rounded-full blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.6, 0.3, 0.6]
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        <PremiumCard variant="glass" shadow>
          <PremiumCardHeader>
              <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-primary to-primary/80 shadow-lg hover:scale-110 transition-transform duration-300">
                <img 
                  src="/images/hymns-logo.jpg" 
                  alt="HYMNS Logo" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <PremiumCardTitle className="text-center">Welcome Back</PremiumCardTitle>
            <PremiumCardDescription className="text-center">
              Sign in to access your premium dashboard
            </PremiumCardDescription>
          </PremiumCardHeader>

          <PremiumCardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <PremiumInput
                  {...register('email')}
                  type="email"
                  label="Email Address"
                  placeholder="Enter your email"
                  icon={<Mail size={20} />}
                  error={errors.email?.message}
                  disabled={isSubmitting || isLoading}
                />
              </div>

              <div>
                <PremiumInput
                  {...register('password')}
                  type="password"
                  label="Password"
                  placeholder="Enter your password"
                  icon={<Lock size={20} />}
                  showPasswordToggle
                  error={errors.password?.message}
                  disabled={isSubmitting || isLoading}
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 text-gray-300 cursor-pointer">
                  <input
                    {...register('rememberMe')}
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <span className="text-sm">Remember me</span>
                </label>

                <Link
                  to="/forgot-password"
                  className="text-sm text-blue-400 hover:text-blue-300 transition-colors duration-200"
                >
                  Forgot password?
                </Link>
              </div>

              <PremiumButton
                type="submit"
                className="w-full"
                isLoading={isSubmitting || isLoading}
                disabled={isSubmitting || isLoading}
              >
                Sign In
              </PremiumButton>
            </form>
          </PremiumCardContent>

          <PremiumCardFooter>
            <div className="text-center text-gray-400 text-sm">
              Don't have an account?{' '}
              <Link
                to="/signup"
                className="text-blue-400 hover:text-blue-300 transition-colors duration-200 font-medium"
              >
                Sign up
              </Link>
            </div>
          </PremiumCardFooter>
        </PremiumCard>

        {/* Loading overlay */}
        {(isSubmitting || isLoading) && (
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm rounded-2xl flex items-center justify-center">
            <PremiumLoader text="Signing you in..." />
          </div>
        )}
      </motion.div>
    </div>
  );
};
