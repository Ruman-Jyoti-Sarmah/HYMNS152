import React, { useEffect, useState } from 'react';
import { CheckCircle } from 'lucide-react';

interface SuccessAnimationProps {
  isVisible: boolean;
  onClose: () => void;
}

export const SuccessAnimation: React.FC<SuccessAnimationProps> = ({ isVisible, onClose }) => {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShowConfetti(true);
      const timer = setTimeout(() => {
        setShowConfetti(false);
        onClose();
      }, 3000); // Hide after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
      {/* Confetti */}
      {showConfetti && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b', '#eb4d4b', '#6c5ce7', '#a29bfe'][Math.floor(Math.random() * 8)],
                }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Success Content */}
      <div className="bg-white rounded-2xl p-8 max-w-sm mx-4 text-center shadow-2xl animate-bounce-in">
        <div className="mb-6">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto animate-pulse" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Order Placed Successfully!
        </h2>
        <p className="text-gray-600 mb-6">
          Thank you for your purchase. We'll send you a confirmation soon.
        </p>
        <button
          onClick={onClose}
          className="bg-black text-white px-6 py-3 rounded-full font-semibold hover:bg-gray-800 transition-colors"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
};