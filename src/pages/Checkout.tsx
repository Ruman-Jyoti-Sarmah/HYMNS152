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
}

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  const [cartItems, setCartItems] = useState<CartItemWithProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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
    paymentMethod: 'cod'
  });

  const [errors, setErrors] = useState<Partial<CheckoutFormData>>({});

  useEffect(() => {
    loadCart();
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

  const total = cartItems.reduce(
    (sum, item) => sum + (item.product?.price || 0) * item.quantity,
    0
  );

  const validateForm = (): boolean => {
    const newErrors: Partial<CheckoutFormData> = {};

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
            fullName: field === 'fullName' ? value : prev.customerDetails.fullName,
            mobile: field === 'mobile' ? value : prev.customerDetails.mobile,
            email: field === 'email' ? value : prev.customerDetails.email
          }
        };
      } else if (section === 'address') {
        return {
          ...prev,
          address: {
            house: field === 'house' ? value : prev.address.house,
            street: field === 'street' ? value : prev.address.street,
            city: field === 'city' ? value : prev.address.city,
            state: field === 'state' ? value : prev.address.state,
            pincode: field === 'pincode' ? value : prev.address.pincode
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
              fullName: field === 'fullName' ? '' : prev.customerDetails?.fullName || '',
              mobile: field === 'mobile' ? '' : prev.customerDetails?.mobile || '',
              email: field === 'email' ? '' : prev.customerDetails?.email || ''
            }
          };
        } else if (section === 'address') {
          return {
            ...prev,
            address: {
              house: field === 'house' ? '' : prev.address?.house || '',
              street: field === 'street' ? '' : prev.address?.street || '',
              city: field === 'city' ? '' : prev.address?.city || '',
              state: field === 'state' ? '' : prev.address?.state || '',
              pincode: field === 'pincode' ? '' : prev.address?.pincode || ''
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
      // Create order object
      const orderData = {
        customerDetails: formData.customerDetails,
        address: {
          house: formData.address.house,
          street: formData.address.street,
          city: formData.address.city,
          state: formData.address.state,
          pincode: formData.address.pincode
        },
        paymentMethod: formData.paymentMethod,
        cartItems: cartItems.map(item => ({
          id: item.id,
          productId: item.product_id,
          quantity: item.quantity,
          size: item.size,
          name: item.product?.name,
          price: item.product?.price
        })),
        totalAmount: total,
        orderStatus: "pending" as const
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Create order in database
      await ordersApi.createOrder(
        getUserId(),
        cartItems,
        orderData.address,
        formData.paymentMethod
      );

      // Clear cart
      await cartApi.clearCart(getUserId());

      setCurrentStep('success');
      
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
      setIsSubmitting(false);
    }
  };

  const handleBackToCart = () => {
    navigate('/cart');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-blue-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (currentStep === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black py-12 px-4">
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
                    {cartItems.map((item, index) => (
                      <div key={index} className="flex justify-between items-center text-gray-300">
                        <span>{item.product?.name} x{item.quantity}</span>
                        <span className="font-medium">₹{(item.product?.price || 0) * item.quantity}</span>
                      </div>
                    ))}
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            onClick={handleBackToCart}
            className="text-gray-300 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Cart
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl xl:text-4xl font-bold text-white">Checkout</h1>
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
                  {cartItems.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-xl">
                      <div className="w-16 h-16 bg-gray-700 rounded-lg overflow-hidden">
                        <img
                          src={item.product?.image_url || ''}
                          alt={item.product?.name}
                          className="w-full h-full object-cover"
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
                  ))}
                  
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
