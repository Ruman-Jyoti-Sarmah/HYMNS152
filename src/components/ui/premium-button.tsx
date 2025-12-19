import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

console.log('PremiumButton: framer-motion imported successfully');

interface PremiumButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  glow?: boolean;
  fullWidth?: boolean;
}

export const PremiumButton = React.forwardRef<HTMLButtonElement, PremiumButtonProps & HTMLMotionProps<"button">>(
  ({ 
    className, 
    children, 
    variant = 'primary', 
    size = 'md', 
    isLoading = false,
    leftIcon,
    rightIcon,
    glow = true,
    fullWidth = false,
    disabled,
    ...props 
  }, ref) => {
    console.log('PremiumButton: Rendering PremiumButton component...');
    
    const baseClasses = "relative inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 ease-in-out overflow-hidden";
    
    const variants = {
      primary: "bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white border border-blue-500/30 shadow-lg hover:shadow-blue-500/25",
      secondary: "bg-gradient-to-r from-gray-800 via-gray-900 to-black text-white border border-gray-700/50 shadow-lg hover:shadow-gray-500/20",
      ghost: "bg-transparent text-gray-300 border border-gray-700/50 hover:bg-gray-800/50",
      danger: "bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white border border-red-500/30 shadow-lg hover:shadow-red-500/25"
    };
    
    const sizes = {
      sm: "px-4 py-2 text-sm",
      md: "px-6 py-3 text-base",
      lg: "px-8 py-4 text-lg"
    };
    
    const disabledClasses = disabled ? "opacity-50 cursor-not-allowed grayscale" : "cursor-pointer";
    const loadingClasses = isLoading ? "opacity-80 cursor-wait" : "";
    const widthClasses = fullWidth ? "w-full" : "";
    
    return (
      <motion.button
        ref={ref}
        className={cn(
          baseClasses,
          variants[variant],
          sizes[size],
          disabledClasses,
          loadingClasses,
          widthClasses,
          className
        )}
        disabled={disabled || isLoading}
        whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
        whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        {...props}
      >
        {/* Glow effect */}
        {glow && (
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-purple-500/0 to-pink-400/0 
                          hover:from-blue-400/20 hover:via-purple-500/20 hover:to-pink-400/20 
                          transition-all duration-300 pointer-events-none" />
        )}
        
        {/* Loading spinner */}
        {isLoading && (
          <motion.div
            className="mr-2 h-4 w-4 border-2 border-white/30 border-t-white rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        )}
        
        {/* Left icon */}
        {leftIcon && !isLoading && (
          <span className="mr-2">{leftIcon}</span>
        )}
        
        <span className="relative z-10">{children}</span>
        
        {/* Right icon */}
        {rightIcon && (
          <span className="ml-2">{rightIcon}</span>
        )}
        
        {/* Shine effect on hover */}
        <div className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent 
                        transition-transform duration-500 ease-in-out transform-gpu hover:left-[100%]" />
      </motion.button>
    );
  }
);

PremiumButton.displayName = "PremiumButton";
