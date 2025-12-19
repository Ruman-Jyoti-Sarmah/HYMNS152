import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { PremiumLoader } from '@/components/ui/premium-loader';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectIfAuth?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAuth = true,
  redirectIfAuth = true
}) => {
  console.log('ProtectedRoute: ProtectedRoute component called');
  
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  console.log('ProtectedRoute:', {
    requireAuth,
    isAuthenticated,
    isLoading,
    pathname: location.pathname
  });

  // Show loading spinner while checking authentication
  if (isLoading) {
    console.log('ProtectedRoute: Showing loading spinner');
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <PremiumLoader text="Authenticating..." />
      </div>
    );
  }

  // If authentication is required and user is not authenticated, redirect to login
  if (requireAuth && !isAuthenticated) {
    console.log('ProtectedRoute: Redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If user is authenticated and trying to access auth pages, redirect to dashboard
  if (!requireAuth && isAuthenticated && redirectIfAuth) {
    console.log('ProtectedRoute: Redirecting to dashboard');
    return <Navigate to="/dashboard" replace />;
  }

  console.log('ProtectedRoute: Rendering children');
  return <>{children}</>;
};
