import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';

console.log('Signup: framer-motion imported successfully');
import { useAuth } from '@/context/AuthContext';
import { PremiumInput } from '@/components/ui/premium-input';
import { PremiumButton } from '@/components/ui/premium-button';
import { PremiumCard, PremiumCardHeader, PremiumCardTitle, PremiumCardDescription, PremiumCardContent, PremiumCardFooter } from '@/components/ui/premium-card';
import { PremiumLoader } from '@/components/ui/premium-loader';
import { User, Mail, Lock } from 'lucide-react';

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignupFormData = z.infer<typeof signupSchema>;

export const Signup: React.FC = () => {
  console.log('Signup: Rendering Signup component...');
  
  const navigate = useNavigate();
  const { signup, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  });

  const password = watch('password');

  const onSubmit = async (data: SignupFormData) => {
    const success = await signup(data.name, data.email, data.password);
    if (success) {
      navigate('/');
    } else {
      // Handle signup error
      console.error('Signup failed');
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
                  src="/HYMNS FASHION LOGO.jpg" 
                  alt="HYMNS Logo" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <PremiumCardTitle className="text-center">Create Account</PremiumCardTitle>
            <PremiumCardDescription className="text-center">
              Join us today and start your premium experience
            </PremiumCardDescription>
          </PremiumCardHeader>

          <PremiumCardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <PremiumInput
                  {...register('name')}
                  type="text"
                  label="Full Name"
                  placeholder="Enter your full name"
                  icon={<User size={20} />}
                  error={errors.name?.message}
                  disabled={isSubmitting || isLoading}
                />
              </div>

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
                  type={showPassword ? 'text' : 'password'}
                  label="Password"
                  placeholder="Create a strong password"
                  icon={<Lock size={20} />}
                  showPasswordToggle
                  error={errors.password?.message}
                  disabled={isSubmitting || isLoading}
                  onChange={(e) => {
                    // Keep the default onChange behavior
                    register('password').onChange?.(e);
                  }}
                />
                <div className="mt-2 text-xs text-gray-400">
                  Password must be at least 8 characters with uppercase, lowercase, and number
                </div>
              </div>

              <div>
                <PremiumInput
                  {...register('confirmPassword')}
                  type={showConfirmPassword ? 'text' : 'password'}
                  label="Confirm Password"
                  placeholder="Confirm your password"
                  icon={<Lock size={20} />}
                  showPasswordToggle
                  error={errors.confirmPassword?.message}
                  disabled={isSubmitting || isLoading}
                />
              </div>

              <PremiumButton
                type="submit"
                className="w-full"
                isLoading={isSubmitting || isLoading}
                disabled={isSubmitting || isLoading}
              >
                Create Account
              </PremiumButton>
            </form>
          </PremiumCardContent>

          <PremiumCardFooter>
            <div className="text-center text-gray-400 text-sm">
              Already have an account?{' '}
              <a
                href="/login"
                className="text-purple-400 hover:text-purple-300 transition-colors duration-200 font-medium"
              >
                Sign in
              </a>
            </div>
          </PremiumCardFooter>
        </PremiumCard>

        {/* Loading overlay */}
        {(isSubmitting || isLoading) && (
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm rounded-2xl flex items-center justify-center">
            <PremiumLoader text="Creating your account..." />
          </div>
        )}
      </motion.div>
    </div>
  );
};
