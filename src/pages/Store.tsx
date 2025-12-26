import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';
import { products } from '../data/products';
import { cartApi, getUserId } from '../db/api';
import { useToast } from '../hooks/use-toast';

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
  reviews: number;
}

const Store = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  console.log('Store: Rendering Store component');

  const handleBuyNow = async (product: Product) => {
    try {
      // Add product to cart
      const userId = getUserId();
      await cartApi.addToCart(userId, product.id, 1); // Add 1 quantity

      toast({
        title: "Product added to cart",
        description: "Redirecting to checkout...",
      });

      // Navigate to checkout
      navigate('/checkout');
    } catch (error) {
      console.error('Failed to add product to cart:', error);
      toast({
        title: "Error",
        description: "Failed to add product to cart. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Convert AdminProduct to Product interface for ProductCard
  const displayProducts: Product[] = products.map(adminProduct => ({
    id: adminProduct.id,
    title: adminProduct.name,
    brand: adminProduct.brand,
    price: adminProduct.price,
    originalPrice: adminProduct.mrp,
    discount: adminProduct.discount,
    rating: adminProduct.rating,
    thumbnail: adminProduct.images[0] || '/images/hymns-logo.jpg',
    images: adminProduct.images,
    reviews: adminProduct.reviews
  }));

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F6F7F9' }}>
      {/* Hero Section */}
      <div className="w-full min-h-[70vh] h-auto flex items-center" style={{
        backgroundImage: 'url(/images/hymns-store-hero.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#0d0d0d',
        position: 'relative'
      }}>
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(90deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.05) 100%)'
        }}></div>
        <div className="max-w-[1400px] mx-auto w-full px-6 md:px-20 lg:px-24 py-12 md:py-16 lg:py-20 relative z-10">
          {/* Text Content - Left Aligned */}
          <div className="max-w-[600px] animate-fadeInUp">
            <h1 className="font-bold text-white mb-6" style={{
              fontSize: 'clamp(36px, 5vw, 56px)',
              lineHeight: '1.2'
            }}>
              Elevate Your Style with <span style={{ color: '#d4af37' }}>HYMNS</span> Gear
            </h1>
            <p className="text-lg md:text-xl text-gray-200">
              Discover premium apparel & accessories with the signature HYMNS logo.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 py-16">

        <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
          {displayProducts.map((product) => (
            <ProductCard key={product.id} product={product} onBuyNow={handleBuyNow} />
          ))}
        </div>

        {displayProducts.length === 0 && (
          <div className="text-center py-20">
            <div className="mb-4">
              <div className="h-16 w-16 text-gray-400 mx-auto mb-4">📦</div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No products available
            </h3>
            <p className="text-gray-500">
              Check back later for new products
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Store;
