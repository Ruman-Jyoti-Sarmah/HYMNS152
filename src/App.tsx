import React from 'react';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import { Toaster } from '@/components/ui/toaster';
import { Outlet } from 'react-router-dom';


const App: React.FC = () => {
  console.log('App: Rendering App component...');
  
  return (
    <div className="flex flex-col min-h-screen dark">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Toaster />
      <Footer />
    </div>
  );
};

export default App;
