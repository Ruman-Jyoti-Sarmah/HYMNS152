import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, ShoppingCart, Truck, Shield, RotateCcw, Plus, Minus } from 'lucide-react';
import { ProductImageGallery } from '../components/ProductImageGallery';
import { RatingSummary } from '../components/RatingSummary';
import { ReviewList } from '../components/ReviewList';
import { AddReviewForm } from '../components/AddReviewForm';
import { products } from '../data/products';
import { getReviewsByProductId, getAverageRating, getRatingDistribution, hasUserReviewed } from '../data/reviews';
import { useAuth } from '../context/AuthContext';
import { cartApi, getUserId } from '../db/api';
import { useToast } from '../hooks/use-toast';
import type { Review } from '../types/types';
import type { AdminProduct } from '../data/products';

interface Product {
  id: string;
  title: string;
  brand: string;
  price: number;
  originalPrice: number;
  discount: number;
  rating: number;
  thumbnail: string;
  images: string[];
}

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();

  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [ratingDistribution, setRatingDistribution] = useState({ 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 });
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const product = products.find(p => p.id === id) as AdminProduct | undefined;

  // Load reviews when component mounts or product changes
  useEffect(() => {
    if (product) {
      const productReviews = getReviewsByProductId(product.id);
      setReviews(productReviews);
      setAverageRating(getAverageRating(product.id));
      setRatingDistribution(getRatingDistribution(product.id));
    }
  }, [product]);

  const handleReviewAdded = (newReview: Review) => {
    // Add the review to the local state
    const updatedReviews = [...reviews, newReview];
    setReviews(updatedReviews);

    // Update average rating and distribution
    setAverageRating(getAverageRating(product!.id));
    setRatingDistribution(getRatingDistribution(product!.id));
  };

  const handleAddToCart = async () => {
    // Validate size selection for products with multiple sizes
    if (product!.sizes && product!.sizes.length > 1 && !selectedSize) {
      toast({
        title: "Size required",
        description: "Please select a size before adding to cart",
        variant: "destructive"
      });
      return;
    }

    setIsAddingToCart(true);

    try {
      const userId = getUserId();
      const size = selectedSize || (product!.sizes && product!.sizes.length === 1 ? product!.sizes[0] : undefined);

      await cartApi.addToCart(userId, product!.id, quantity, size);

      toast({
        title: "Added to cart",
        description: `${product!.name} has been added to your cart`,
      });

      // Reset quantity to 1 after successful addition
      setQuantity(1);
    } catch (error) {
      console.error('Failed to add to cart:', error);
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h1>
          <button
            onClick={() => navigate('/store')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Store
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-600 mb-6">
          <span>Home</span>
          <span className="mx-2">›</span>
          <span>Store</span>
          <span className="mx-2">›</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* LEFT SIDE - Image Gallery */}
          <div>
            <ProductImageGallery images={product.images} title={product.name} />
          </div>

          {/* RIGHT SIDE - Product Details */}
          <div className="space-y-6">
            {/* Title and Brand */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <p className="text-lg text-gray-600">{product.brand}</p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                <span className="font-medium">{product.rating}</span>
              </div>
              <span className="text-gray-500">({Math.floor(Math.random() * 500) + 100} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold text-green-600">₹{product.price}</span>
              <span className="text-xl text-gray-500 line-through">₹{product.mrp}</span>
              <span className="text-lg font-semibold text-red-500">{product.discount}% off</span>
            </div>

            {/* Offers Section */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Offers</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Bank Offer: 10% instant discount on ICICI Bank Credit Cards</li>
                <li>• No Cost EMI starting from ₹450/month</li>
                <li>• Cashback worth ₹100 on first purchase</li>
              </ul>
            </div>

            {/* Delivery Info */}
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Delivery</h3>
              <div className="text-sm text-gray-700">
                <p>🚚 Free delivery by tomorrow</p>
                <p>📍 Deliver to your location</p>
              </div>
            </div>

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Size</h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${
                        selectedSize === size
                          ? 'border-orange-500 bg-orange-50 text-orange-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                {product.sizes.length > 1 && !selectedSize && (
                  <p className="text-sm text-red-600 mt-2">Please select a size</p>
                )}
              </div>
            )}

            {/* Quantity Selection */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Quantity</h3>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-12 text-center font-medium" aria-label={`Quantity: ${quantity}`}>{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleAddToCart}
                disabled={isAddingToCart || (product.sizes && product.sizes.length > 1 && !selectedSize)}
                className="w-full bg-orange-500 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-orange-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {isAddingToCart ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    Adding...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-5 w-5" />
                    Add to Cart
                  </>
                )}
              </button>

              <button className="w-full bg-orange-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-orange-700 transition-colors">
                Buy Now
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              <div className="flex items-center gap-3 text-sm">
                <Truck className="h-5 w-5 text-green-600" />
                <span>Free Delivery</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Shield className="h-5 w-5 text-blue-600" />
                <span>1 Year Warranty</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <RotateCcw className="h-5 w-5 text-orange-600" />
                <span>7 Days Return</span>
              </div>
            </div>
          </div>
        </div>

        {/* Ratings & Reviews Section */}
        <div className="mt-16 space-y-8">
          <RatingSummary
            productId={product.id}
            averageRating={averageRating}
            totalReviews={reviews.length}
            ratingDistribution={ratingDistribution}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Reviews List */}
            <div className="lg:col-span-2">
              <ReviewList reviews={reviews} />
            </div>

            {/* Add Review Form */}
            <div>
              <AddReviewForm
                productId={product.id}
                userId={user?.id || 'guest'}
                userName={user?.name || 'Guest User'}
                onReviewAdded={handleReviewAdded}
                hasReviewed={isAuthenticated ? hasUserReviewed(user!.id, product.id) : false}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
