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
}

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <Link to={`/product/${product.id}`} className="block">
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div className="aspect-square overflow-hidden">
          <img
            src={product.thumbnail}
            alt={product.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/images/hymns-logo.jpg';
            }}
          />
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 text-gray-800">
            {product.title}
          </h3>

          <p className="text-sm text-gray-500 mb-2">{product.brand}</p>

          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
              <span className="text-sm font-medium">{product.rating}</span>
            </div>
            <span className="text-sm text-gray-500">({Math.floor(Math.random() * 500) + 100})</span>
          </div>

          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-xl font-bold text-green-600">₹{product.price}</span>
            <span className="text-sm text-gray-500 line-through">₹{product.originalPrice}</span>
            <span className="text-sm font-semibold text-red-500">{product.discount}% off</span>
          </div>
        </div>
      </div>
    </Link>
  );
};
