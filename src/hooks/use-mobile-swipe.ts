import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface SwipeConfig {
  [key: string]: {
    left?: string;
    right?: string;
  };
}

const SWIPE_CONFIG: SwipeConfig = {
  '/': { right: '/dashboard' }, // Home → Dashboard
  '/dashboard': { left: '/', right: '/store' }, // Dashboard ↔ Home/Store
  '/store': { left: '/dashboard', right: '/orders' }, // Store ↔ Dashboard/Orders
  '/orders': { left: '/store', right: '/music' }, // Orders ↔ Store/Music
  '/music': { left: '/orders', right: '/studio' }, // Music ↔ Orders/Studio
  '/studio': { left: '/music', right: '/pricing' }, // Studio ↔ Music/Pricing
  '/pricing': { left: '/studio', right: '/about' }, // Pricing ↔ Studio/About
  '/about': { left: '/pricing', right: '/contact' }, // About ↔ Pricing/Contact
  '/contact': { left: '/about' }, // Contact → About
};

const MIN_SWIPE_DISTANCE = 50;
const MAX_VERTICAL_MOVEMENT = 100;

export const useMobileSwipe = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const touchEndRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const isMobile = window.innerWidth <= 768;
    if (!isMobile) return;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    };

    const handleTouchEnd = (e: TouchEvent) => {
      touchEndRef.current = {
        x: e.changedTouches[0].clientX,
        y: e.changedTouches[0].clientY,
      };

      if (!touchStartRef.current || !touchEndRef.current) return;

      const deltaX = touchEndRef.current.x - touchStartRef.current.x;
      const deltaY = touchEndRef.current.y - touchStartRef.current.y;

      // Check if swipe is mostly horizontal and exceeds minimum distance
      const isHorizontalSwipe = Math.abs(deltaX) > Math.abs(deltaY);
      const exceedsMinDistance = Math.abs(deltaX) > MIN_SWIPE_DISTANCE;
      const withinVerticalLimit = Math.abs(deltaY) < MAX_VERTICAL_MOVEMENT;

      if (isHorizontalSwipe && exceedsMinDistance && withinVerticalLimit) {
        const currentPath = location.pathname;
        const config = SWIPE_CONFIG[currentPath];

        if (!config) return;

        // Swipe left (negative deltaX) → go to right page
        if (deltaX < 0 && config.right) {
          navigate(config.right);
        }
        // Swipe right (positive deltaX) → go to left page
        else if (deltaX > 0 && config.left) {
          navigate(config.left);
        }
      }

      // Reset touch refs
      touchStartRef.current = null;
      touchEndRef.current = null;
    };

    // Add event listeners
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });

    // Cleanup
    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [navigate, location.pathname]);
};
