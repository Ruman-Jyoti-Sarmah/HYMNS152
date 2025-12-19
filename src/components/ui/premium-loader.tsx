import React from 'react';
import { motion } from 'framer-motion';

console.log('PremiumLoader: framer-motion imported successfully');

interface PremiumLoaderProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

export const PremiumLoader: React.FC<PremiumLoaderProps> = ({ 
  size = 'md', 
  text, 
  className 
}) => {
  console.log('PremiumLoader: Rendering PremiumLoader component...');
  
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <div className={className}>
      <div className="flex items-center justify-center space-x-2">
        <motion.div
          className={`rounded-full border-2 border-gray-600 border-t-blue-500 ${sizeClasses[size]}`}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        {text && (
          <motion.span
            className="text-gray-400 text-sm font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {text}
          </motion.span>
        )}
      </div>
    </div>
  );
};

export const PremiumSkeleton: React.FC<{ className?: string; count?: number }> = ({ 
  className, 
  count = 1 
}) => {
  console.log('PremiumSkeleton: Rendering PremiumSkeleton component...');
  
  return (
    <div className={className}>
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          className="h-4 bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded animate-pulse"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        />
      ))}
    </div>
  );
};
