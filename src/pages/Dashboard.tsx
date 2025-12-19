import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';

console.log('Dashboard: framer-motion imported successfully');
import { User, Shield, Settings, LogOut, BarChart3, FileText, MessageSquare, Calendar, ShoppingCart, Music } from 'lucide-react';
import { PremiumButton } from '@/components/ui/premium-button';
import { PremiumCard, PremiumCardHeader, PremiumCardTitle, PremiumCardDescription, PremiumCardContent, PremiumCardFooter } from '@/components/ui/premium-card';

export const Dashboard: React.FC = () => {
  console.log('Dashboard: Rendering Dashboard component...');
  
  const { user, logout } = useAuth();

  const features = [
    {
      title: 'Advanced Analytics',
      description: 'Get deep insights into your performance metrics',
      icon: <BarChart3 size={24} />
    },
    {
      title: 'Security Center',
      description: 'Monitor and manage your account security',
      icon: <Shield size={24} />
    },
    {
      title: 'User Management',
      description: 'Manage your team and permissions',
      icon: <User size={24} />
    },
    {
      title: 'Reports & Documents',
      description: 'Generate and manage detailed reports',
      icon: <FileText size={24} />
    },
    {
      title: 'Communication Hub',
      description: 'Stay connected with your team and clients',
      icon: <MessageSquare size={24} />
    },
    {
      title: 'Schedule Management',
      description: 'Organize your appointments and events',
      icon: <Calendar size={24} />
    },
    {
      title: 'Premium Store',
      description: 'Access exclusive merchandise and digital products',
      icon: <ShoppingCart size={24} />
    },
    {
      title: 'Music Studio',
      description: 'Book professional recording sessions and production',
      icon: <Music size={24} />
    },
    {
      title: 'Settings & Preferences',
      description: 'Customize your dashboard and account settings',
      icon: <Settings size={24} />
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-[32rem] h-[32rem] bg-accent/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.6, 0.3, 0.6]
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      <div className="relative">
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-primary to-primary/80 shadow-lg hover:scale-110 transition-transform duration-300">
                  <img 
                    src="/HYMNS FASHION LOGO.jpg" 
                    alt="HYMNS Logo" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h1 className="text-xl font-bold text-foreground">Dashboard</h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-muted-foreground text-sm">
                  Welcome, {user?.name}
                </span>
                <PremiumButton
                  onClick={logout}
                  variant="ghost"
                  leftIcon={<LogOut size={20} />}
                >
                  Sign Out
                </PremiumButton>
              </div>
            </div>
          </div>
        </nav>

        {/* Main content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
          >
            <Link to="/store">
              <PremiumCard variant="glass" className="cursor-pointer hover:scale-105 transition-transform">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                      <ShoppingCart size={24} className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Premium Store</h3>
                      <p className="text-sm text-muted-foreground">Shop exclusive items</p>
                    </div>
                  </div>
                  <span className="text-primary font-bold">→</span>
                </div>
              </PremiumCard>
            </Link>

            <Link to="/music">
              <PremiumCard variant="glass" className="cursor-pointer hover:scale-105 transition-transform">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <Music size={24} className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Music Studio</h3>
                      <p className="text-sm text-muted-foreground">Book sessions now</p>
                    </div>
                  </div>
                  <span className="text-primary font-bold">→</span>
                </div>
              </PremiumCard>
            </Link>

            <Link to="/studio">
              <PremiumCard variant="glass" className="cursor-pointer hover:scale-105 transition-transform">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl flex items-center justify-center">
                      <Calendar size={24} className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Book Studio</h3>
                      <p className="text-sm text-muted-foreground">Schedule appointments</p>
                    </div>
                  </div>
                  <span className="text-primary font-bold">→</span>
                </div>
              </PremiumCard>
            </Link>

            <Link to="/pricing">
              <PremiumCard variant="glass" className="cursor-pointer hover:scale-105 transition-transform">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                      <BarChart3 size={24} className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Premium Plans</h3>
                      <p className="text-sm text-muted-foreground">Upgrade your experience</p>
                    </div>
                  </div>
                  <span className="text-primary font-bold">→</span>
                </div>
              </PremiumCard>
            </Link>
          </motion.div>

          {/* Hero section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-5xl font-bold text-foreground mb-4">
              Welcome to Your Dashboard
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              You have successfully authenticated. Explore our premium features.
            </p>
            <div className="flex justify-center mb-12">
              <Link to="/">
                <PremiumButton
                  size="lg"
                  className="px-8 py-3 text-lg"
                >
                  Go to Home
                </PremiumButton>
              </Link>
            </div>
          </motion.div>

          {/* Features grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <PremiumCard variant="glass" className="h-full">
                  <PremiumCardHeader>
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white">
                        {feature.icon}
                      </div>
                      <span className="text-gray-400 text-sm">Premium</span>
                    </div>
                    <PremiumCardTitle className="mt-4">{feature.title}</PremiumCardTitle>
                    <PremiumCardDescription>{feature.description}</PremiumCardDescription>
                  </PremiumCardHeader>
                  <PremiumCardFooter>
                    <PremiumButton className="w-full">
                      Explore {feature.title}
                    </PremiumButton>
                  </PremiumCardFooter>
                </PremiumCard>
              </motion.div>
            ))}
          </div>

          {/* User info card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <PremiumCard variant="gradient" className="border-gray-600/50">
              <PremiumCardHeader>
                <PremiumCardTitle>Your Account</PremiumCardTitle>
                <PremiumCardDescription>
                  Manage your profile and security settings
                </PremiumCardDescription>
              </PremiumCardHeader>
              <PremiumCardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-gray-400 text-sm">Full Name</label>
                    <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-3 text-white">
                      {user?.name}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-gray-400 text-sm">Email Address</label>
                    <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-3 text-white">
                      {user?.email}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-gray-400 text-sm">Account Status</label>
                    <div className="bg-green-500/20 border border-green-500/30 rounded-lg px-4 py-3 text-green-300">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span>Authenticated</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-gray-400 text-sm">Member Since</label>
                    <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-3 text-white">
                      {new Date().toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </PremiumCardContent>
              <PremiumCardFooter>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">
                    Your session is secure and encrypted
                  </span>
                  <PremiumButton variant="secondary">
                    Update Profile
                  </PremiumButton>
                </div>
              </PremiumCardFooter>
            </PremiumCard>
          </motion.div>
        </main>
      </div>
    </div>
  );
};
