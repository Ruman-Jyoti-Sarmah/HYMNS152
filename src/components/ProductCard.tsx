import React from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';

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

interface ProductCardProps {
  product: Product;
  onBuyNow?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onBuyNow }) => {
  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onBuyNow) {
      onBuyNow(product);
    }
  };

  return (
    <Link to={`/product/${product.id}`} className="block">
      <div
        className="bg-white overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-4"
        style={{
          borderRadius: '14px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
        }}
      >
        <div className="aspect-square overflow-hidden" style={{ borderRadius: '14px 14px 0 0' }}>
          <img
            src={product.thumbnail}
            alt={product.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/images/hymns-logo.jpg';
            }}
          />
        </div>

        <div className="p-4">
          <h3 className="font-bold text-lg mb-2 line-clamp-2" style={{ color: '#212121' }}>
            {product.title}
          </h3>

          <p className="text-sm mb-3" style={{ color: '#757575' }}>{product.brand}</p>

          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-current" style={{ color: '#388E3C' }} />
              <span className="text-sm font-medium" style={{ color: '#212121' }}>{product.rating}</span>
            </div>
            <span className="text-sm" style={{ color: '#757575' }}>
              ({product.reviews})
            </span>
          </div>

          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-xl font-bold" style={{ color: '#212121' }}>₹{product.price}</span>
            <span className="text-sm line-through" style={{ color: '#878787' }}>₹{product.originalPrice}</span>
            <span className="text-sm font-semibold" style={{ color: '#E53935' }}>{product.discount}% off</span>
          </div>

          <div className="space-y-2">
            <button
              className="w-full py-2 px-4 rounded text-sm font-medium transition-colors hover:opacity-90"
              style={{ backgroundColor: '#FFD814', color: '#111' }}
            >
              Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              className="w-full py-2 px-4 rounded text-sm font-medium text-white transition-colors hover:opacity-90"
              style={{ backgroundColor: '#FB641B' }}
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};
