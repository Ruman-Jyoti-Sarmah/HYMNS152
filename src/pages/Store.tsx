import React from 'react';
import { ProductCard } from '../components/ProductCard';
import { products } from '../data/products';

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

const Store = () => {
  console.log('Store: Rendering Store component');

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
    images: adminProduct.images
  }));

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 overflow-x-hidden">
      <div className="max-w-full mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            HYMNS Store
          </h1>
          <p className="text-gray-600 text-lg">
            Shop exclusive HYMNS merchandise
          </p>
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-6">
          {displayProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
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
