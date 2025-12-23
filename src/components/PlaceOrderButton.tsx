import React, { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { OrderBottomSheet } from './OrderBottomSheet';
import { SuccessAnimation } from './SuccessAnimation';
import { ordersApi, cartApi, getUserId } from '@/db/api';
import { useToast } from '@/hooks/use-toast';

interface PlaceOrderButtonProps {
  total: number;
  cartItems: any[];
}

export const PlaceOrderButton: React.FC<PlaceOrderButtonProps> = ({ total, cartItems }) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const { toast } = useToast();

  const handlePlaceOrder = async () => {
    if (isPlacingOrder) return;

    setIsPlacingOrder(true);
    try {
      // Create the order
      await ordersApi.createOrder(getUserId(), cartItems, {
        name: 'Test User',
        address: 'Test Address',
        phone: '1234567890'
      });

      // Clear the cart
      await cartApi.clearCart(getUserId());

      // Show success animation
      setShowSuccess(true);

      toast({
        title: "Order placed successfully!",
        description: "Your order has been placed and will be processed soon."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to place order. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const handleCloseSheet = () => {
    setIsSheetOpen(false);
  };

  const handleConfirmOrder = (orderDetails: {
    name: string;
    phone: string;
    address: string;
  }) => {
    // Handle order confirmation
    console.log('Order confirmed:', orderDetails);
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
  };

  return (
    <>
      {/* Main Place Order Button */}
      <button
        onClick={handlePlaceOrder}
        disabled={isPlacingOrder}
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
                   group
                   disabled:opacity-50 disabled:cursor-not-allowed"
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
          {isPlacingOrder ? 'Placing Order...' : 'Continue'}
        </span>
      </button>

      {/* Success Animation */}
      <SuccessAnimation 
        isVisible={showSuccess} 
        onClose={handleCloseSuccess} 
      />

      {/* Bottom Sheet */}
      <OrderBottomSheet 
        isOpen={isSheetOpen}
        onClose={handleCloseSheet}
        onConfirm={handleConfirmOrder}
        total={total}
        itemCount={cartItems.length}
        productName={cartItems[0]?.product?.name || 'Product'}
      />
    </>
  );
};
