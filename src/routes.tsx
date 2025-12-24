import React from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/context/AuthContext';
import App from '@/App';
import ErrorPage from '@/pages/NotFound';
import { Login } from '@/pages/Login';
import { Signup } from '@/pages/Signup';
import { ForgotPassword } from '@/pages/ForgotPassword';
import { Dashboard } from '@/pages/Dashboard';
import Home from '@/pages/Home';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import Music from '@/pages/Music';
import Pricing from '@/pages/Pricing';
import Store from '@/pages/Store';
import ProductDetails from '@/pages/ProductDetails';
import Orders from '@/pages/Orders';
import Studio from '@/pages/Studio';
import Cart from '@/pages/Cart';
import Checkout from '@/pages/Checkout';
import { ProtectedRoute } from '@/components/ProtectedRoute';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AuthProvider><App /></AuthProvider>,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <ProtectedRoute requireAuth={false} redirectIfAuth={false}><Home /></ProtectedRoute>,
      },
      {
        path: '/about',
        element: <ProtectedRoute requireAuth={true}><About /></ProtectedRoute>,
      },
      {
        path: '/contact',
        element: <ProtectedRoute requireAuth={true}><Contact /></ProtectedRoute>,
      },
      {
        path: '/music',
        element: <ProtectedRoute requireAuth={true}><Music /></ProtectedRoute>,
      },
      {
        path: '/pricing',
        element: <ProtectedRoute requireAuth={true}><Pricing /></ProtectedRoute>,
      },
      {
        path: '/store',
        element: <ProtectedRoute requireAuth={true}><Store /></ProtectedRoute>,
      },
      {
        path: '/product/:id',
        element: <ProtectedRoute requireAuth={true}><ProductDetails /></ProtectedRoute>,
      },

      {
        path: '/orders',
        element: <ProtectedRoute requireAuth={true}><Orders /></ProtectedRoute>,
      },
      {
        path: '/studio',
        element: <ProtectedRoute requireAuth={true}><Studio /></ProtectedRoute>,
      },
      {
        path: '/login',
        element: <ProtectedRoute requireAuth={false}><Login /></ProtectedRoute>,
      },
      {
        path: '/signup',
        element: <ProtectedRoute requireAuth={false}><Signup /></ProtectedRoute>,
      },
      {
        path: '/forgot-password',
        element: <ProtectedRoute requireAuth={false}><ForgotPassword /></ProtectedRoute>,
      },
      {
        path: '/dashboard',
        element: <ProtectedRoute requireAuth={true}><Dashboard /></ProtectedRoute>,
      },
      {
        path: '/cart',
        element: <ProtectedRoute requireAuth={false} redirectIfAuth={false}><Cart /></ProtectedRoute>,
      },
      {
        path: '/checkout',
        element: <ProtectedRoute requireAuth={false} redirectIfAuth={false}><Checkout /></ProtectedRoute>,
      },
    ],
  },
]);

export function Router() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
}
