import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';

console.log('ForgotPassword: framer-motion imported successfully');
import { useAuth } from '@/context/AuthContext';
import { PremiumInput } from '@/components/ui/premium-input';
import { PremiumButton } from '@/components/ui/premium-button';
import { PremiumCard, PremiumCardHeader, PremiumCardTitle, PremiumCardDescription, PremiumCardContent, PremiumCardFooter } from '@/components/ui/premium-card';
import { PremiumLoader } from '@/components/ui/premium-loader';
import { Mail, Shield } from 'lucide-react';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export const ForgotPassword: React.FC = () => {
  console.log('ForgotPassword: Rendering ForgotPassword component...');
  
  const navigate = useNavigate();
  const { forgotPassword, isLoading } = useAuth();
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: ''
    }
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    const success = await forgotPassword(data.email);
    if (success) {
      setIsSuccess(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-green-500/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
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
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Shield size={32} className="text-white" />
              </div>
            </div>
            <PremiumCardTitle className="text-center">
              {isSuccess ? 'Check Your Email' : 'Forgot Password?'}
            </PremiumCardTitle>
            <PremiumCardDescription className="text-center">
              {isSuccess 
                ? 'A password reset link has been sent to your email'
                : 'Enter your email to receive a password reset link'
              }
            </PremiumCardDescription>
          </PremiumCardHeader>

          <PremiumCardContent>
            {!isSuccess ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <PremiumInput
                    {...register('email')}
                    type="email"
                    label="Email Address"
                    placeholder="Enter your registered email"
                    icon={<Mail size={20} />}
                    error={errors.email?.message}
                    disabled={isSubmitting || isLoading}
                  />
                </div>

                <PremiumButton
                  type="submit"
                  className="w-full"
                  isLoading={isSubmitting || isLoading}
                  disabled={isSubmitting || isLoading}
                >
                  Send Reset Link
                </PremiumButton>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="text-center space-y-4"
              >
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                  <Shield size={32} className="text-green-400" />
                </div>
                <p className="text-gray-300">
                  If an account with that email exists, we've sent a password reset link.
                </p>
                <p className="text-gray-400 text-sm">
                  Didn't receive the email? Check your spam folder or try again.
                </p>
                <div className="space-y-2">
                  <PremiumButton
                    onClick={() => setIsSuccess(false)}
                    variant="secondary"
                    className="w-full"
                  >
                    Try Another Email
                  </PremiumButton>
                  <PremiumButton
                    onClick={() => navigate('/login')}
                    variant="ghost"
                    className="w-full"
                  >
                    Back to Login
                  </PremiumButton>
                </div>
              </motion.div>
            )}
          </PremiumCardContent>

          {!isSuccess && (
            <PremiumCardFooter>
              <div className="text-center text-gray-400 text-sm">
                Remember your password?{' '}
                <a
                  href="/login"
                  className="text-green-400 hover:text-green-300 transition-colors duration-200 font-medium"
                >
                  Sign in
                </a>
              </div>
            </PremiumCardFooter>
          )}
        </PremiumCard>

        {/* Loading overlay */}
        {(isSubmitting || isLoading) && (
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm rounded-2xl flex items-center justify-center">
            <PremiumLoader text="Sending reset link..." />
          </div>
        )}
      </motion.div>
    </div>
  );
};
