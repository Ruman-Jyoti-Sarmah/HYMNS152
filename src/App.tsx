import React from 'react';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import { Toaster } from '@/components/ui/toaster';
import { Outlet } from 'react-router-dom';
import { useMobileSwipe } from '@/hooks/use-mobile-swipe';

const App: React.FC = () => {
  console.log('App: Rendering App component...');

  // Enable mobile swipe navigation
  useMobileSwipe();

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
