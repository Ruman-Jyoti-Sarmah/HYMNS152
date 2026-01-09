import React, { useEffect } from 'react';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import { Toaster } from '@/components/ui/toaster';
import { Outlet } from 'react-router-dom';
import { useMobileSwipe } from '@/hooks/use-mobile-swipe';

const App: React.FC = () => {
  console.log('App: Rendering App component...');

  // Enable mobile swipe navigation
  useMobileSwipe();

  // Test backend connectivity
  useEffect(() => {
    const testBackendConnection = async () => {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

      try {
        console.log('🔍 Testing backend connectivity...');
        const response = await fetch(`${API_URL}/`);
        const data = await response.json();

        console.log('✅ Backend connection successful!');
        console.log('📡 Response:', data);
        console.log('🌐 API URL:', API_URL);
      } catch (error) {
        console.error('❌ Backend connection failed!');
        console.error('🔗 API URL:', API_URL);
        console.error('💥 Error:', error);
      }
    };

    // Test connection on app startup
    testBackendConnection();
  }, []);

  return (
    <div className="flex flex-col min-h-screen dark">
      <Header />
      <main className="flex-grow main-content">
        <Outlet />
      </main>
      <Toaster />
      <Footer />
    </div>
  );
};

export default App;
