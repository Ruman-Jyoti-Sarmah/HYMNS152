import type { Product } from '@/types/types';

export interface AdminProduct {
  id: string;
  name: string;
  brand: string;
  price: number;
  mrp: number;
  discount: number;
  rating: number;
  reviews: number;
  images: string[];
  description: string;
  inStock: boolean;
  category?: string;
  sizes?: string[];
  variants?: {
    color: string;
    color_code: string;
    images: string[];
    stock: number;
  }[];
}

// Load products from localStorage or use default data
const loadProductsFromStorage = (): AdminProduct[] => {
  try {
    const stored = localStorage.getItem('admin-products');
    return stored ? JSON.parse(stored) : getDefaultProducts();
  } catch (error) {
    console.error('Failed to load products from localStorage:', error);
    return getDefaultProducts();
  }
};

// Save products to localStorage
export const saveProductsToStorage = (products: AdminProduct[]): void => {
  try {
    localStorage.setItem('admin-products', JSON.stringify(products));
  } catch (error) {
    console.error('Failed to save products to localStorage:', error);
  }
};

// Get default/sample products
const getDefaultProducts = (): AdminProduct[] => [
  {
    id: '1',
    name: 'Premium Cotton T-Shirt',
    brand: 'HYMNS',
    price: 1499,
    mrp: 1999,
    discount: 25,
    rating: 4.5,
    reviews: 127,
    images: [
      '/images/products/hymns-t-shirt1.png',
      '/images/products/hymns-t-shirt2.png'
    ],
    description: 'Comfortable and stylish HYMNS branded T-shirt made from premium cotton. Perfect for casual wear and shows your support for HYMNS music.',
    inStock: true,
    category: 'Clothing',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    variants: [
      {
        color: 'black',
        color_code: '#000000',
        images: [
          '/images/products/hymns-t-shirt1.png',
          '/images/products/hymns-t-shirt2.png'
        ],
        stock: 15
      },
      {
        color: 'white',
        color_code: '#FFFFFF',
        images: [
          '/images/hymns-studio1.jpeg',
          '/images/hymns-studio2.jpeg',
          '/images/hymns-studio3.jpeg'
        ],
        stock: 12
      },
      {
        color: 'navy',
        color_code: '#000080',
        images: [
          '/images/hymns-studio2.jpeg',
          '/images/hymns-studio3.jpeg',
          '/images/hymns-studio1.jpeg'
        ],
        stock: 8
      }
    ]
  },
  {
    id: '2',
    name: 'Classic Hoodie',
    brand: 'HYMNS',
    price: 2499,
    mrp: 3499,
    discount: 29,
    rating: 4.8,
    reviews: 89,
    images: [
      '/images/products/hymns-hoodie1.png',
      '/images/products/hymns-hoodie2.png',
      '/images/products/hymns-hoodie3.png',
      '/images/products/hymns-hoodie4.png'
    ],
    description: 'Warm and comfortable HYMNS hoodie perfect for chilly days. Features the iconic HYMNS logo and premium quality fabric.',
    inStock: true,
    category: 'Clothing',
    sizes: ['S', 'M', 'L', 'XL'],
    variants: [
      {
        color: 'black',
        color_code: '#000000',
        images: [
          '/images/products/hymns-hoodie1.png',
      '/images/products/hymns-hoodie2.png',
      '/images/products/hymns-hoodie3.png',
      '/images/products/hymns-hoodie4.png'
        ],
        stock: 20
      },
      {
        color: 'gray',
        color_code: '#808080',
        images: [
          '/images/products/hymns-hoodie1.png',
      '/images/products/hymns-hoodie2.png',
      '/images/products/hymns-hoodie3.png',
      '/images/products/hymns-hoodie4.png'
        ],
        stock: 15
      },
      {
        color: 'white',
        color_code: '#FFFFFF',
        images: [
          '/images/products/hymns-hoodie1.png',
      '/images/products/hymns-hoodie2.png',
      '/images/products/hymns-hoodie3.png',
      '/images/products/hymns-hoodie4.png'
        ],
        stock: 10
      }
    ]
  },
  {
    id: '3',
    name: 'Designer Cap',
    brand: 'HYMNS',
    price: 899,
    mrp: 1299,
    discount: 31,
    rating: 4.2,
    reviews: 45,
    images: [
      '/images/products/hymns-cap1.png',
      '/images/products/hymns-cap2.png',
      '/images/products/hymns-cap3.png',
      '/images/products/hymns-cap4.png',
      '/images/products/hymns-cap5.png'
    ],
    description: 'Stylish HYMNS branded cap perfect for outdoor activities. Made from premium materials with adjustable fit.',
    inStock: true,
    category: 'Accessories',
    sizes: ['One Size'],
    variants: [
      {
        color: 'black',
        color_code: '#000000',
        images: [
          '/images/products/hymns-cap1.png',
      '/images/products/hymns-cap2.png',
      '/images/products/hymns-cap3.png',
      '/images/products/hymns-cap4.png',
      '/images/products/hymns-cap5.png'
        ],
        stock: 25
      }
    ]
  },
  {
    id: '4',
    name: 'Limited Edition Shoes',
    brand: 'HYMNS',
    price: 599,
    mrp: 799,
    discount: 25,
    rating: 4.6,
    reviews: 78,
    images: [
      '/images/products/hymns-shoes1.png',
      '/images/products/hymns-shoes2.png',
      '/images/products/hymns-shoes3.png',
      '/images/products/hymns-shoes4.png',
      '/images/products/hymns-shoes5.png'
    ],
    description: 'Limited edition HYMNS ceramic mug. Perfect for your morning coffee while supporting your favorite music brand.',
    inStock: true,
    category: 'Accessories',
    sizes: ['One Size'],
    variants: [
      {
        color: 'white',
        color_code: '#FFFFFF',
        images: [
          '/images/products/hymns-shoes1.png',
          '/images/products/hymns-shoes2.png',
          '/images/products/hymns-shoes3.png',
          '/images/products/hymns-shoes4.png',
          '/images/products/hymns-shoes5.png'
        ],
        stock: 50
      }
    ]
  }
];

// Export products (loads from storage or defaults)
export let products: AdminProduct[] = loadProductsFromStorage();

// Utility functions for admin operations
export const addProduct = (product: Omit<AdminProduct, 'id'>): AdminProduct => {
  const newProduct: AdminProduct = {
    ...product,
    id: Date.now().toString()
  };

  products = [...products, newProduct];
  saveProductsToStorage(products);

  return newProduct;
};

export const updateProduct = (id: string, updates: Partial<AdminProduct>): AdminProduct | null => {
  const index = products.findIndex(p => p.id === id);
  if (index === -1) return null;

  const updatedProduct = { ...products[index], ...updates };
  products = products.map(p => p.id === id ? updatedProduct : p);
  saveProductsToStorage(products);

  return updatedProduct;
};

export const deleteProduct = (id: string): boolean => {
  products = products.filter(p => p.id !== id);
  saveProductsToStorage(products);

  return true;
};

export const getProductById = (id: string): AdminProduct | undefined => {
  return products.find(p => p.id === id);
};

// Update specific product with additional images
export const updateProductImages = (id: string, newImages: string[]): boolean => {
  const product = getProductById(id);
  if (!product) return false;

  const updatedImages = [...new Set([...product.images, ...newImages])];
  updateProduct(id, { images: updatedImages });

  return true;
};

// Auto-update specific product with additional images on module load
const targetProductId = '816c884f-d25b-403b-91a6-4c4a23127c35';
const additionalImages = ['/images/hymns-t-shirt1.png', '/images/hymns-t-shirt2.png'];

if (products.some(p => p.id === targetProductId)) {
  updateProductImages(targetProductId, additionalImages);
}

// Convert AdminProduct to existing Product interface for compatibility
export const convertToApiProduct = (adminProduct: AdminProduct): Product => ({
  id: adminProduct.id,
  name: adminProduct.name,
  description: adminProduct.description,
  price: adminProduct.price,
  image_url: adminProduct.images[0] || '',
  images: adminProduct.images,
  variants: adminProduct.variants || null,
  category: adminProduct.category || 'General',
  sizes: adminProduct.sizes || null,
  stock: adminProduct.variants?.reduce((total, variant) => total + variant.stock, 0) || (adminProduct.inStock ? 10 : 0),
  created_at: new Date().toISOString()
});
