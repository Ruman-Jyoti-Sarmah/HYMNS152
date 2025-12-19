import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

console.log('PremiumCard: framer-motion imported successfully');

interface PremiumCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'gradient';
  padding?: 'sm' | 'md' | 'lg';
  border?: boolean;
  shadow?: boolean;
}

export const PremiumCard: React.FC<PremiumCardProps & HTMLMotionProps<"div">> = ({
  className,
  children,
  variant = 'default',
  padding = 'md',
  border = true,
  shadow = true,
  ...props
}) => {
  console.log('PremiumCard: Rendering PremiumCard component...');
  
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  const variants = {
    default: 'bg-gray-900/80',
    glass: 'bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl',
    gradient: 'bg-gradient-to-br from-gray-900 via-gray-800 to-black'
  };

  const borderClasses = border ? 'border border-gray-700/50' : '';
  const shadowClasses = shadow ? 'shadow-xl shadow-black/20' : '';

  return (
    <motion.div
      className={cn(
        'rounded-2xl',
        variants[variant],
        borderClasses,
        shadowClasses,
        paddingClasses[padding],
        'transition-all duration-300 ease-in-out',
        'hover:border-gray-600/50 hover:shadow-blue-500/10',
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const PremiumCardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => {
  console.log('PremiumCardHeader: Rendering PremiumCardHeader component...');
  
  return (
    <div className={cn('border-b border-gray-700/50 pb-4 mb-4', className)} {...props}>
      {children}
    </div>
  );
};

export const PremiumCardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  className,
  children,
  ...props
}) => {
  console.log('PremiumCardTitle: Rendering PremiumCardTitle component...');
  
  return (
    <h2 className={cn('text-2xl font-bold text-white', className)} {...props}>
      {children}
    </h2>
  );
};

export const PremiumCardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  className,
  children,
  ...props
}) => {
  console.log('PremiumCardDescription: Rendering PremiumCardDescription component...');
  
  return (
    <p className={cn('text-gray-400 text-sm', className)} {...props}>
      {children}
    </p>
  );
};

export const PremiumCardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => {
  console.log('PremiumCardContent: Rendering PremiumCardContent component...');
  
  return <div className={cn('space-y-4', className)} {...props}>{children}</div>;
};

export const PremiumCardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => {
  console.log('PremiumCardFooter: Rendering PremiumCardFooter component...');
  
  return (
    <div className={cn('border-t border-gray-700/50 pt-4 mt-4', className)} {...props}>
      {children}
    </div>
  );
};
