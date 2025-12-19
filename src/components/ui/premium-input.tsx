import React, { useState } from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

console.log('PremiumInput: lucide-react imported successfully');

interface PremiumInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  showPasswordToggle?: boolean;
  floatingLabel?: boolean;
}

export const PremiumInput = React.forwardRef<HTMLInputElement, PremiumInputProps>(
  ({ className, type, label, error, icon, showPasswordToggle = false, floatingLabel = true, ...props }, ref) => {
    console.log('PremiumInput: Rendering PremiumInput component...');
    
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(false);

    const inputType = showPasswordToggle && showPassword ? 'text' : type;

    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(e.target.value.length > 0);
      props.onChange?.(e);
    };

    return (
      <div className="relative">
        {floatingLabel && label && (
          <label
            className={cn(
              "absolute left-3 top-2 text-sm text-gray-400 transition-all duration-200 pointer-events-none",
              (isFocused || hasValue) && "top-[-8px] text-xs text-gray-300 bg-black px-1 -translate-y-1",
              error && "text-red-400"
            )}
          >
            {label}
          </label>
        )}
        
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {icon}
            </div>
          )}
          
          <input
            type={inputType}
            className={cn(
              "w-full px-4 py-3 bg-gradient-to-r from-gray-900/50 to-gray-800/50",
              "border border-gray-700/50 rounded-xl",
              "text-white placeholder-gray-400",
              "focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50",
              "transition-all duration-300 ease-in-out",
              "backdrop-blur-sm",
              "hover:border-gray-600/50",
              "shadow-lg hover:shadow-blue-500/10",
              "peer",
              icon && "pl-10",
              showPasswordToggle && "pr-10",
              error && "border-red-500/50 focus:ring-red-500/50",
              floatingLabel && "pt-6",
              className
            )}
            ref={ref}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
            {...props}
          />
          
          {showPasswordToggle && (
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          )}
        </div>
        
        {error && (
          <div className="flex items-center gap-2 mt-2 text-red-400 text-sm">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}
        
        {/* Focus glow effect */}
        <div className={cn(
          "absolute inset-0 rounded-xl pointer-events-none",
          "bg-gradient-to-r from-blue-500/0 via-purple-500/0 to-pink-500/0",
          "focus-within:from-blue-500/20 focus-within:via-purple-500/20 focus-within:to-pink-500/20",
          "transition-all duration-300"
        )} />
      </div>
    );
  }
);

PremiumInput.displayName = "PremiumInput";
