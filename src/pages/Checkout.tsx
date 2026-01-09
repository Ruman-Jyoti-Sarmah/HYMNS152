import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, User, Phone, Mail, MapPin, CreditCard, IndianRupee, Loader2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PremiumCard, PremiumCardHeader, PremiumCardTitle, PremiumCardContent, PremiumCardFooter, PremiumCardDescription } from '@/components/ui/premium-card';
import { PremiumInput } from '@/components/ui/premium-input';
import { PremiumButton } from '@/components/ui/premium-button';
import { useToast } from '@/hooks/use-toast';
import { cartApi, ordersApi, getUserId } from '@/db/api';
import type { CartItemWithProduct } from '@/types/types';

interface CustomerDetails {
  fullName: string;
  mobile: string;
  email: string;
}

interface Address {
  house: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
}

interface CheckoutFormData {
  customerDetails: CustomerDetails;
  address: Address;
  paymentMethod: 'cod' | 'upi' | 'card' | 'netbanking';
  paymentDetails: {
    upiId: string;
    cardNumber: string;
    cardholderName: string;
    expiryDate: string;
    cvv: string;
    selectedBank: string;
  };
}

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Check if this is a buy now flow
  const buyNowItem = location.state?.buyNowItem;
  const isBuyNowFlow = !!buyNowItem;

  const [cartItems, setCartItems] = useState<CartItemWithProduct[]>([]);
  const [buyNowQuantity, setBuyNowQuantity] = useState(buyNowItem?.quantity || 1);
  const [isLoading, setIsLoading] = useState(!isBuyNowFlow);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState<'form' | 'success'>('form');
  
  const [formData, setFormData] = useState<CheckoutFormData>({
    customerDetails: {
      fullName: '',
      mobile: '',
      email: ''
    },
    address: {
      house: '',
      street: '',
      city: '',
      state: '',
      pincode: ''
    },
    paymentMethod: 'cod',
    paymentDetails: {
      upiId: '',
      cardNumber: '',
      cardholderName: '',
      expiryDate: '',
      cvv: '',
      selectedBank: ''
    }
  });

  const [errors, setErrors] = useState<{
    customerDetails?: { fullName?: string; mobile?: string; email?: string };
    address?: { house?: string; street?: string; city?: string; state?: string; pincode?: string };
    paymentDetails?: { upiId?: string; cardNumber?: string; cardholderName?: string; expiryDate?: string; cvv?: string; selectedBank?: string };
  }>({});

  useEffect(() => {
    if (!isBuyNowFlow) {
      loadCart();
    } else {
      setIsLoading(false);
    }
  }, []);

  const loadCart = async () => {
    try {
      const data = await cartApi.getCartItems(getUserId());
      setCartItems(data);
      if (data.length === 0) {
        navigate('/cart');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load cart",
        variant: "destructive"
      });
      navigate('/cart');
    } finally {
      setIsLoading(false);
    }
  };

  const total = isBuyNowFlow
    ? (buyNowItem.product?.price || 0) * buyNowQuantity
    : cartItems.reduce(
        (sum, item) => sum + (item.product?.price || 0) * item.quantity,
        0
      );

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    // Validate customer details
    if (!formData.customerDetails.fullName.trim()) {
      newErrors.customerDetails = { ...newErrors.customerDetails, fullName: 'Full name is required' };
    } else if (formData.customerDetails.fullName.trim().length < 2) {
      newErrors.customerDetails = { ...newErrors.customerDetails, fullName: 'Name must be at least 2 characters' };
    }

    if (!formData.customerDetails.mobile.trim()) {
      newErrors.customerDetails = { ...newErrors.customerDetails, mobile: 'Mobile number is required' };
    } else if (!/^\d{10}$/.test(formData.customerDetails.mobile.trim())) {
      newErrors.customerDetails = { ...newErrors.customerDetails, mobile: 'Please enter a valid 10-digit mobile number' };
    }

    if (formData.customerDetails.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerDetails.email)) {
      newErrors.customerDetails = { ...newErrors.customerDetails, email: 'Please enter a valid email address' };
    }

    // Validate address
    if (!formData.address.house.trim()) {
      newErrors.address = { ...newErrors.address, house: 'House/Flat is required' };
    }

    if (!formData.address.street.trim()) {
      newErrors.address = { ...newErrors.address, street: 'Street/Area is required' };
    }

    if (!formData.address.city.trim()) {
      newErrors.address = { ...newErrors.address, city: 'City is required' };
    }

    if (!formData.address.state.trim()) {
      newErrors.address = { ...newErrors.address, state: 'State is required' };
    }

    if (!formData.address.pincode.trim()) {
      newErrors.address = { ...newErrors.address, pincode: 'Pincode is required' };
    } else if (!/^\d{6}$/.test(formData.address.pincode.trim())) {
      newErrors.address = { ...newErrors.address, pincode: 'Please enter a valid 6-digit pincode' };
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    section: keyof CheckoutFormData,
    field: string,
    value: string
  ) => {
    setFormData(prev => {
      if (section === 'customerDetails') {
        return {
          ...prev,
          customerDetails: {
            ...prev.customerDetails,
            [field]: value
          }
        };
      } else if (section === 'address') {
        return {
          ...prev,
          address: {
            ...prev.address,
            [field]: value
          }
        };
      } else if (section === 'paymentDetails') {
        return {
          ...prev,
          paymentDetails: {
            ...prev.paymentDetails,
            [field]: value
          }
        };
      }
      return prev;
    });

    // Clear error when user starts typing
    if (errors[section]) {
      setErrors(prev => {
        if (section === 'customerDetails') {
          return {
            ...prev,
            customerDetails: {
              ...prev.customerDetails,
              [field]: ''
            }
          };
        } else if (section === 'address') {
          return {
            ...prev,
            address: {
              ...prev.address,
              [field]: ''
            }
          };
        } else if (section === 'paymentDetails') {
          return {
            ...prev,
            paymentDetails: {
              ...prev.paymentDetails,
              [field]: ''
            }
          };
        }
        return prev;
      });
    }
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields correctly",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const shippingAddress = {
        house: formData.address.house,
        street: formData.address.street,
        city: formData.address.city,
        state: formData.address.state,
        pincode: formData.address.pincode
      };

      if (isBuyNowFlow) {
        // Handle buy now order - create single item order
        const buyNowOrderItems = [{
          id: `temp-${Date.now()}`,
          user_id: getUserId(),
          product_id: buyNowItem.product.id,
          quantity: buyNowQuantity,
          size: buyNowItem.size,
          created_at: new Date().toISOString(),
          product: buyNowItem.product
        }];

        await ordersApi.createOrder(
          getUserId(),
          buyNowOrderItems,
          shippingAddress,
          formData.paymentMethod
        );

        toast({
          title: "Order placed successfully!",
          description: "Your order has been placed and will be processed soon."
        });
      } else {
        // Handle regular cart checkout
        await ordersApi.createOrder(
          getUserId(),
          cartItems,
          shippingAddress,
          formData.paymentMethod
        );

        // Clear cart only for regular checkout
        await cartApi.clearCart(getUserId());

        toast({
          title: "Order placed successfully!",
          description: "Your order has been placed and will be processed soon."
        });
      }

      // Send email notification via backend API
      try {
        const fullAddress = `${formData.address.house}, ${formData.address.street}, ${formData.address.city}, ${formData.address.state} - ${formData.address.pincode}`;
        const productsString = isBuyNowFlow
          ? `${buyNowItem.product?.name} (x${buyNowQuantity}) - ₹${(buyNowItem.product?.price || 0) * buyNowQuantity}`
          : cartItems.map(item =>
              `${item.product?.name} (x${item.quantity}) - ₹${(item.product?.price || 0) * item.quantity}`
            ).join(', ');

        const paymentMethodLabel = {
          cod: 'Cash on Delivery',
          upi: 'UPI',
          card: 'Debit/Credit Card',
          netbanking: 'Net Banking'
        }[formData.paymentMethod] || formData.paymentMethod;

        await fetch('http://localhost:5000/api/order', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            customer_name: formData.customerDetails.fullName,
            phone: formData.customerDetails.mobile,
            email: formData.customerDetails.email || '',
            address: fullAddress,
            products: productsString,
            total_amount: total,
            payment_method: paymentMethodLabel
          })
        });
      } catch (emailError) {
        console.error('Failed to send email notification:', emailError);
        // Don't show error to user as order is already placed
      }

      setCurrentStep('success');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to place order. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToCart = () => {
    if (isBuyNowFlow) {
      navigate('/store');
    } else {
      navigate('/cart');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-blue-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (currentStep === 'success') {
  return (
    <div className="min-h-screen bg-white py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <PremiumCard className="bg-gradient-to-br from-gray-900/80 to-black/80 border-gray-700/50">
            <PremiumCardHeader>
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-green-400" />
                </div>
              </div>
              <PremiumCardTitle className="text-center text-3xl">
                Order Placed Successfully! 🎉
              </PremiumCardTitle>
            </PremiumCardHeader>
            
            <PremiumCardContent>
              <div className="space-y-6">
                <div className="bg-gray-800/50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Order Summary</h3>
                  <div className="space-y-3">
                    {isBuyNowFlow ? (
                      <div className="flex justify-between items-center text-gray-300">
                        <span>{buyNowItem.product?.name} x{buyNowQuantity}</span>
                        <span className="font-medium">₹{(buyNowItem.product?.price || 0) * buyNowQuantity}</span>
                      </div>
                    ) : (
                      cartItems.map((item, index) => (
                        <div key={index} className="flex justify-between items-center text-gray-300">
                          <span>{item.product?.name} x{item.quantity}</span>
                          <span className="font-medium">₹{(item.product?.price || 0) * item.quantity}</span>
                        </div>
                      ))
                    )}
                    <div className="border-t border-gray-600/50 pt-3 mt-3">
                      <div className="flex justify-between items-center font-bold text-white">
                        <span>Total Amount</span>
                        <span className="text-2xl">₹{total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800/50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Customer Details</h3>
                  <div className="space-y-2 text-gray-300">
                    <p><strong>Name:</strong> {formData.customerDetails.fullName}</p>
                    <p><strong>Mobile:</strong> {formData.customerDetails.mobile}</p>
                    {formData.customerDetails.email && (
                      <p><strong>Email:</strong> {formData.customerDetails.email}</p>
                    )}
                  </div>
                </div>

                <div className="bg-gray-800/50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Delivery Address</h3>
                  <div className="space-y-2 text-gray-300">
                    <p>{formData.address.house}</p>
                    <p>{formData.address.street}</p>
                    <p>{formData.address.city}, {formData.address.state}</p>
                    <p>PIN: {formData.address.pincode}</p>
                  </div>
                </div>

                <div className="bg-gray-800/50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Payment Method</h3>
                  <div className="text-gray-300">
                    {formData.paymentMethod === 'cod' && 'Cash on Delivery'}
                    {formData.paymentMethod === 'upi' && 'UPI'}
                    {formData.paymentMethod === 'card' && 'Debit/Credit Card'}
                    {formData.paymentMethod === 'netbanking' && 'Net Banking'}
                  </div>
                </div>
              </div>
            </PremiumCardContent>

            <PremiumCardFooter>
              <div className="flex gap-4">
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/')}
                  className="flex-1"
                >
                  Continue Shopping
                </Button>
                <Button 
                  onClick={() => navigate('/orders')}
                  className="flex-1"
                >
                  View Orders
                </Button>
              </div>
            </PremiumCardFooter>
          </PremiumCard>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            onClick={handleBackToCart}
            className="text-gray-300 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {isBuyNowFlow ? 'Back to Store' : 'Back to Cart'}
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl xl:text-4xl font-bold text-black">
              {isBuyNowFlow ? 'Buy Now Checkout' : 'Checkout'}
            </h1>
            <p className="text-gray-400 mt-1">Complete your order</p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="xl:col-span-1">
            <PremiumCard className="bg-gradient-to-br from-gray-900/80 to-black/80 border-gray-700/50">
              <PremiumCardHeader>
                <PremiumCardTitle>Order Summary</PremiumCardTitle>
                <PremiumCardDescription>Review your items before placing order</PremiumCardDescription>
              </PremiumCardHeader>
              
              <PremiumCardContent>
                <div className="space-y-4">
                  {isBuyNowFlow ? (
                    <div className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-xl">
                      <div className="w-16 h-16 bg-gray-700 rounded-lg overflow-hidden">
                        <img
                          src={buyNowItem.product?.image_url || ''}
                          alt={buyNowItem.product?.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-white">{buyNowItem.product?.name}</h4>
                        {buyNowItem.size && (
                          <p className="text-sm text-gray-400">Size: {buyNowItem.size}</p>
                        )}
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-300">Qty:</span>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setBuyNowQuantity(Math.max(1, buyNowQuantity - 1))}
                                className="h-8 w-8 p-0"
                              >
                                -
                              </Button>
                              <span className="w-8 text-center text-white">{buyNowQuantity}</span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setBuyNowQuantity(buyNowQuantity + 1)}
                                className="h-8 w-8 p-0"
                              >
                                +
                              </Button>
                            </div>
                          </div>
                          <span className="font-bold text-white">
                            ₹{(buyNowItem.product?.price || 0) * buyNowQuantity}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    cartItems.map((item, index) => (
                      <div key={index} className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-xl">
                        <div className="w-16 h-16 bg-gray-700 rounded-lg overflow-hidden">
                          <img
                            src={item.product?.image_url || ''}
                            alt={item.product?.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-white">{item.product?.name}</h4>
                          {item.size && (
                            <p className="text-sm text-gray-400">Size: {item.size}</p>
                          )}
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-gray-300">Qty: {item.quantity}</span>
                            <span className="font-bold text-white">
                              ₹{(item.product?.price || 0) * item.quantity}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}

                  <div className="border-t border-gray-600/50 pt-4">
                    <div className="flex justify-between items-center text-xl font-bold text-white">
                      <span>Total Amount</span>
                      <span className="flex items-center gap-1">
                        <IndianRupee className="h-5 w-5" />
                        {total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </PremiumCardContent>
            </PremiumCard>
          </div>

          {/* Checkout Form */}
          <div className="xl:col-span-2">
            <PremiumCard className="bg-gradient-to-br from-gray-900/80 to-black/80 border-gray-700/50">
              <PremiumCardHeader>
                <PremiumCardTitle>Delivery Details</PremiumCardTitle>
                <PremiumCardDescription>Fill in your information to complete the order</PremiumCardDescription>
              </PremiumCardHeader>
              
              <PremiumCardContent>
                <form onSubmit={(e) => { e.preventDefault(); handlePlaceOrder(); }}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Customer Details */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Customer Information
                      </h3>
                      
                      <PremiumInput
                        label="Full Name"
                        value={formData.customerDetails.fullName}
                        onChange={(e) => handleInputChange('customerDetails', 'fullName', e.target.value)}
                        error={errors.customerDetails?.fullName}
                        icon={<User className="h-4 w-4" />}
                        required
                      />
                      
                      <PremiumInput
                        label="Mobile Number"
                        value={formData.customerDetails.mobile}
                        onChange={(e) => handleInputChange('customerDetails', 'mobile', e.target.value)}
                        error={errors.customerDetails?.mobile}
                        icon={<Phone className="h-4 w-4" />}
                        type="tel"
                        placeholder="10-digit mobile number"
                        required
                      />
                      
                      <PremiumInput
                        label="Email Address"
                        value={formData.customerDetails.email}
                        onChange={(e) => handleInputChange('customerDetails', 'email', e.target.value)}
                        error={errors.customerDetails?.email}
                        icon={<Mail className="h-4 w-4" />}
                        type="email"
                        placeholder="your@email.com"
                      />
                    </div>

                    {/* Address Details */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        Delivery Address
                      </h3>
                      
                      <PremiumInput
                        label="House / Flat"
                        value={formData.address.house}
                        onChange={(e) => handleInputChange('address', 'house', e.target.value)}
                        error={errors.address?.house}
                        required
                      />
                      
                      <PremiumInput
                        label="Street / Area"
                        value={formData.address.street}
                        onChange={(e) => handleInputChange('address', 'street', e.target.value)}
                        error={errors.address?.street}
                        required
                      />
                      
                      <PremiumInput
                        label="City"
                        value={formData.address.city}
                        onChange={(e) => handleInputChange('address', 'city', e.target.value)}
                        error={errors.address?.city}
                        required
                      />
                      
                      <PremiumInput
                        label="State"
                        value={formData.address.state}
                        onChange={(e) => handleInputChange('address', 'state', e.target.value)}
                        error={errors.address?.state}
                        required
                      />
                      
                      <PremiumInput
                        label="Pincode"
                        value={formData.address.pincode}
                        onChange={(e) => handleInputChange('address', 'pincode', e.target.value)}
                        error={errors.address?.pincode}
                        placeholder="6-digit pincode"
                        required
                      />
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="space-y-4 mb-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Payment Method
                    </h3>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { value: 'cod', label: 'Cash on Delivery', icon: '💵' },
                        { value: 'upi', label: 'UPI', icon: '📱' },
                        { value: 'card', label: 'Card', icon: '💳' },
                        { value: 'netbanking', label: 'Net Banking', icon: '🏦' }
                      ].map((method) => (
                        <label key={method.value} className="cursor-pointer">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value={method.value}
                            checked={formData.paymentMethod === method.value}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              paymentMethod: e.target.value as CheckoutFormData['paymentMethod']
                            }))}
                            className="sr-only"
                          />
                          <div className={`p-4 rounded-xl border-2 transition-all duration-200 text-center ${
                            formData.paymentMethod === method.value
                              ? 'border-blue-500/50 bg-blue-500/10'
                              : 'border-gray-600/50 hover:border-gray-500/50'
                          }`}>
                            <div className="text-2xl mb-2">{method.icon}</div>
                            <div className="text-sm font-medium text-gray-300">{method.label}</div>
                          </div>
                        </label>
                      ))}
                    </div>

                    {/* Payment Details */}
                    {formData.paymentMethod === 'upi' && (
                      <div className="mt-4 p-4 bg-gray-800/30 rounded-xl border border-gray-600/30 animate-in slide-in-from-top-2 duration-300">
                        <h4 className="text-white font-medium mb-3">UPI Details</h4>
                        <div className="space-y-3">
                          <PremiumInput
                            label="UPI ID"
                            value={formData.paymentDetails.upiId}
                            onChange={(e) => handleInputChange('paymentDetails', 'upiId', e.target.value)}
                            placeholder="yourname@upi"
                            required
                          />
                          <Button
                            type="button"
                            variant="outline"
                            className="w-full"
                          >
                            Verify UPI
                          </Button>
                        </div>
                      </div>
                    )}

                    {formData.paymentMethod === 'card' && (
                      <div className="mt-4 p-4 bg-gray-800/30 rounded-xl border border-gray-600/30 animate-in slide-in-from-top-2 duration-300">
                        <h4 className="text-white font-medium mb-3">Card Details</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="md:col-span-2">
                            <PremiumInput
                              label="Card Number"
                              value={formData.paymentDetails.cardNumber}
                              onChange={(e) => handleInputChange('paymentDetails', 'cardNumber', e.target.value)}
                              placeholder="1234 5678 9012 3456"
                              required
                            />
                          </div>
                          <PremiumInput
                            label="Cardholder Name"
                            value={formData.paymentDetails.cardholderName}
                            onChange={(e) => handleInputChange('paymentDetails', 'cardholderName', e.target.value)}
                            placeholder="John Doe"
                            required
                          />
                          <PremiumInput
                            label="Expiry Date"
                            value={formData.paymentDetails.expiryDate}
                            onChange={(e) => handleInputChange('paymentDetails', 'expiryDate', e.target.value)}
                            placeholder="MM/YY"
                            required
                          />
                          <PremiumInput
                            label="CVV"
                            value={formData.paymentDetails.cvv}
                            onChange={(e) => handleInputChange('paymentDetails', 'cvv', e.target.value)}
                            placeholder="123"
                            type="password"
                            required
                          />
                        </div>
                      </div>
                    )}

                    {formData.paymentMethod === 'netbanking' && (
                      <div className="mt-4 p-4 bg-gray-800/30 rounded-xl border border-gray-600/30 animate-in slide-in-from-top-2 duration-300">
                        <h4 className="text-white font-medium mb-3">Net Banking</h4>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Select Bank
                            </label>
                            <select
                              value={formData.paymentDetails.selectedBank}
                              onChange={(e) => handleInputChange('paymentDetails', 'selectedBank', e.target.value)}
                              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                              required
                            >
                              <option value="">Choose your bank</option>
                              <option value="sbi">State Bank of India</option>
                              <option value="hdfc">HDFC Bank</option>
                              <option value="icici">ICICI Bank</option>
                              <option value="axis">Axis Bank</option>
                              <option value="pnb">Punjab National Bank</option>
                              <option value="kotak">Kotak Mahindra Bank</option>
                              <option value="other">Other Bank</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Place Order Button */}
                  <div className="flex gap-4">
                    <Button
                      variant="outline"
                      onClick={handleBackToCart}
                      className="flex-1 text-gray-300 hover:text-white"
                    >
                      Back to Cart
                    </Button>
                    <PremiumButton
                      onClick={handlePlaceOrder}
                      disabled={isSubmitting}
                      className="flex-1"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <IndianRupee className="h-4 w-4 mr-2" />
                          Place Order - ₹{total.toFixed(2)}
                        </>
                      )}
                    </PremiumButton>
                  </div>
                </form>
              </PremiumCardContent>
            </PremiumCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
