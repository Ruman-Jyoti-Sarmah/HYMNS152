import React, { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface PlaceOrderButtonProps {
  total: number;
  cartItems: any[];
}

export const PlaceOrderButton: React.FC<PlaceOrderButtonProps> = ({ total, cartItems }) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleContinueToCheckout = () => {
    // Validate cart is not empty
    if (cartItems.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to your cart before proceeding to checkout",
        variant: "destructive"
      });
      return;
    }

    // Navigate to checkout page
    navigate('/checkout');
  };

  return (
    <button
      onClick={handleContinueToCheckout}
      className="bg-white text-black font-semibold py-3 px-6 rounded-full
                 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.4),0_5px_10px_-5px_rgba(0,0,0,0.3)]
                 hover:shadow-[0_15px_35px_-5px_rgba(0,0,0,0.5),0_10px_20px_-5px_rgba(0,0,0,0.4)]
                 hover:bg-gray-100
                 transition-all duration-200 ease-out
                 active:scale-95
                 focus:outline-none focus:ring-4 focus:ring-white/50
                 z-50
                 h-[52px] min-w-[160px] flex items-center justify-center gap-2
                 cursor-pointer
                 group"
      style={{
        animation: 'ease-in-out'
      }}
    >
      <div className="relative">
        <ShoppingCart 
          className="w-4 h-4 transition-all duration-200 group-hover:scale-110"
          strokeWidth={2.5}
        />
      </div>
      <span className="text-sm font-semibold tracking-wide">
        Continue
      </span>
    </button>
  );
};
