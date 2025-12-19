import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  console.log('useAuth: useAuth hook called');
  const context = useContext(AuthContext);
  if (!context) {
    console.error('useAuth: AuthContext is undefined - make sure you are using this hook within an AuthProvider');
    throw new Error('useAuth must be used within an AuthProvider');
  }
  console.log('useAuth: AuthContext found, returning context');
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

// Check if user is authenticated on mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    
    console.log('AuthContext: Checking authentication...');
    console.log('Token:', token);
    console.log('UserData:', userData);
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        console.log('AuthContext: User authenticated:', parsedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
      }
    }
    
    console.log('AuthContext: Setting isLoading to false');
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, rememberMe: boolean = false): Promise<boolean> => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock authentication
      if (email === 'user@example.com' && password === 'password123') {
        const mockUser: User = {
          id: '1',
          email: 'user@example.com',
          name: 'John Doe'
        };
        
        setUser(mockUser);
        
        if (rememberMe) {
          localStorage.setItem('authToken', 'mock-jwt-token');
          localStorage.setItem('userData', JSON.stringify(mockUser));
        } else {
          sessionStorage.setItem('authToken', 'mock-jwt-token');
          sessionStorage.setItem('userData', JSON.stringify(mockUser));
        }
        
        navigate('/dashboard');
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock signup
      const mockUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        name
      };
      
      setUser(mockUser);
      localStorage.setItem('authToken', 'mock-jwt-token');
      localStorage.setItem('userData', JSON.stringify(mockUser));
      
      navigate('/dashboard');
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('userData');
    navigate('/login');
  };

  const forgotPassword = async (email: string): Promise<boolean> => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock forgot password
      console.log('Password reset email sent to:', email);
      return true;
    } catch (error) {
      console.error('Forgot password error:', error);
      return false;
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    logout,
    forgotPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
