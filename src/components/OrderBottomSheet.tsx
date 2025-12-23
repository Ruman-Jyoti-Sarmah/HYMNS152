import React, { useState, useEffect } from 'react';
import { X, User, Phone, MapPin, CheckCircle, Loader2, Plus, Minus, ShoppingBag } from 'lucide-react';

interface OrderBottomSheetProps {
  /** Whether modal is open */
  isOpen: boolean;
  /** Callback when modal is closed */
  onClose: () => void;
  /** Callback when order is confirmed */
  onConfirm: (orderDetails: {
    name: string;
    phone: string;
    address: string;
  }) => void;
  /** Total amount to be paid */
  total: number;
  /** Number of items in cart */
  itemCount: number;
  /** Product name for display */
  productName: string;
}

/** Step types for the bottom sheet flow */
type Step = 1 | 2 | 3;

/**
 * Modern bottom sheet component with step-by-step order flow
 * Similar to food delivery apps with smooth animations
 */
const OrderBottomSheet: React.FC<OrderBottomSheetProps> = ({
  isOpen,
  onClose,
  onConfirm,
  total,
  itemCount,
  productName
}) => {
  // State management
  const [step, setStep] = useState<Step>(1);
  const [quantity, setQuantity] = useState(itemCount);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: ''
  });
  const [errors, setErrors] = useState({
    name: '',
    phone: '',
    address: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderStatus, setOrderStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setQuantity(itemCount);
      setFormData({
        name: '',
        phone: '',
        address: ''
      });
      setErrors({
        name: '',
        phone: '',
        address: ''
      });
      setIsSubmitting(false);
      setIsSuccess(false);
    }
  }, [isOpen, itemCount]);

  /**
   * Handle quantity changes
   */
  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= 99) {
      setQuantity(newQuantity);
    }
  };

  /**
   * Handle input changes and clear validation errors
   */
  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  /**
   * Validate form fields
   */
  const validateForm = (): boolean => {
    const newErrors = {
      name: '',
      phone: '',
      address: ''
    };

    let isValid = true;

    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
      isValid = false;
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
      isValid = false;
    }

    // Validate phone
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
      isValid = false;
    } else if (!/^\d{10}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
      isValid = false;
    }

    // Validate address
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
      isValid = false;
    } else if (formData.address.trim().length < 10) {
      newErrors.address = 'Please enter a complete address';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  /**
   * Handle continue to next step
   */
  const handleContinue = () => {
    setStep(2);
  };

  /**
   * Handle order confirmation
   */
  const handleConfirm = async () => {
    if (!validateForm()) {
      return;
    }

    setOrderStatus('submitting');
    setIsSubmitting(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Call parent confirmation callback
      onConfirm(formData);
      setOrderStatus('success');
      setIsSuccess(true);

      // Auto close modal after success
      setTimeout(() => {
        handleClose();
      }, 2000);

    } catch (error) {
      console.error('Order submission failed:', error);
      setOrderStatus('idle');
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handle modal close
   */
  const handleClose = () => {
    setIsSuccess(false);
    setIsSubmitting(false);
    setStep(1);
    onClose();
  };

  // Don't render if modal is not open
  if (!isOpen) {
    return null;
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-gradient-to-b from-black/60 via-black/40 to-transparent backdrop-blur-xl z-50 transition-all duration-500 ease-out cursor-pointer"
        onClick={handleClose}
        style={{
          animation: isOpen ? 'fadeInBackdrop 500ms ease-out' : 'fadeOutBackdrop 500ms ease-in'
        }}
      />

      {/* Bottom Sheet */}
      <div 
        className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[24px] shadow-[0_-20px_40px_-10px_rgba(0,0,0,0.3)] transform transition-all duration-500 ease-out z-50 max-h-[85vh]"
        style={{
          transform: isOpen ? 'translateY(0)' : 'translateY(100%)',
          animation: isOpen ? 'slideUpSheet 500ms ease-out' : 'slideDownSheet 400ms ease-in'
        }}
      >
        {/* Modal Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 p-6 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {step === 1 && 'Select Quantity'}
                {step === 2 && 'Delivery Details'}
                {step === 3 && 'Order Confirmed!'}
              </h2>
              {step < 3 && (
                <p className="text-sm text-gray-500 mt-1">
                  {step === 1 ? 'Choose how many items you want' : 'Please provide your delivery details'}
                </p>
              )}
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors group"
              title="Close"
            >
              <X className="h-6 w-6 text-gray-500 group-hover:text-gray-700 transition-colors" />
            </button>
          </div>

          {/* Order Summary */}
          {step > 1 && (
            <div className="mt-4 p-4 bg-gray-50 rounded-xl">
              <div className="flex justify-between items-center text-sm text-gray-600">
                <span>Items ({quantity})</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-200">
                <span className="font-semibold text-gray-900">Total Amount</span>
                <span className="text-xl font-bold text-primary">
                  ₹{total.toFixed(2)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Content */}
        <div className="flex flex-col h-[calc(85vh-120px)]">
          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto">
            {step === 1 && (
              /* Step 1: Quantity Selection */
              <div className="space-y-6">
                {/* Product Card */}
                <div className="bg-gray-50 rounded-2xl p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-xl flex items-center justify-center">
                      <span className="text-2xl">📦</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{productName}</h3>
                      <p className="text-2xl font-bold text-primary mt-1">₹{total.toFixed(2)}</p>
                    </div>
                  </div>
                </div>

                {/* Quantity Selector */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-4">Select Quantity</p>
                    <div className="flex items-center justify-center gap-6">
                      <button
                        onClick={() => handleQuantityChange(quantity - 1)}
                        disabled={quantity <= 1}
                        className="w-12 h-12 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-full flex items-center justify-center transition-colors"
                      >
                        <Minus className="h-6 w-6 text-gray-600" />
                      </button>
                      
                      <div className="text-5xl font-bold text-gray-900 w-16 text-center">
                        {quantity}
                      </div>
                      
                      <button
                        onClick={() => handleQuantityChange(quantity + 1)}
                        disabled={quantity >= 99}
                        className="w-12 h-12 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-full flex items-center justify-center transition-colors"
                      >
                        <Plus className="h-6 w-6 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              /* Step 2: Delivery Details */
              <div className="space-y-6 p-6">
                <form onSubmit={(e) => { e.preventDefault(); handleConfirm(); }}>
                  <div className="space-y-4">
                    {/* Full Name Field */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <User className="h-4 w-4" />
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 ${
                          errors.name ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                        }`}
                        placeholder="Enter your full name"
                      />
                      {errors.name && (
                        <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                      )}
                    </div>

                    {/* Phone Number Field */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <Phone className="h-4 w-4" />
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 ${
                          errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                        }`}
                        placeholder="Enter your 10-digit phone number"
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                      )}
                    </div>

                    {/* Address Field */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <MapPin className="h-4 w-4" />
                        Delivery Address
                      </label>
                      <textarea
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        rows={3}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 resize-none ${
                          errors.address ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                        }`}
                        placeholder="Enter your complete delivery address"
                      />
                      {errors.address && (
                        <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                      )}
                    </div>
                  </div>
                </form>
              </div>
            )}

            {orderStatus === 'success' && (
              /* Success State */
              <div className="text-center py-8 px-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Order Placed Successfully!
                </h3>
                <p className="text-gray-600 mb-6">
                  Your order has been confirmed and will be processed shortly.
                </p>
                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                  <p className="text-sm text-gray-600 mb-2">Order Summary:</p>
                  <div className="flex justify-between text-sm">
                    <span>Items:</span>
                    <span className="font-medium">{quantity}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span>Total:</span>
                    <span className="font-medium text-primary">₹{total.toFixed(2)}</span>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="w-full bg-primary text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-200 ease-out focus:outline-none focus:ring-4 focus:ring-primary/30"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </div>

          {/* Sticky Footer with CTA */}
          {step === 1 && (
            <div className="sticky bottom-0 bg-white border-t border-gray-100 p-6">
              <button
                onClick={handleContinue}
                className="w-full bg-black text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-200 ease-out focus:outline-none focus:ring-4 focus:ring-black/30"
              >
                Continue
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="sticky bottom-0 bg-white border-t border-gray-100 p-6">
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 px-6 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200 font-medium"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  onClick={handleConfirm}
                  className="flex-1 py-3 px-6 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Place Order'
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export { OrderBottomSheet };
