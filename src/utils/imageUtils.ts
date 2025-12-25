import { updateProduct, getProductById } from '@/data/products';

/**
 * Utility functions for managing product images
 * These can be used from browser console or within the app
 */

export const imageUtils = {
  /**
   * Add images to a product
   * @param productId - The product ID
   * @param imageUrls - Array of image URLs to add
   */
  addImages: (productId: string, imageUrls: string[]) => {
    const product = getProductById(productId);
    if (!product) {
      console.error('Product not found:', productId);
      return false;
    }

    const existingImages = new Set(product.images);
    const newImages = imageUrls.filter(url => !existingImages.has(url));

    if (newImages.length === 0) {
      console.log('All images already exist for this product');
      return true;
    }

    const updatedImages = [...product.images, ...newImages];
    updateProduct(productId, { images: updatedImages });

    console.log(`Added ${newImages.length} new images to product "${product.name}"`);
    return true;
  },

  /**
   * Remove images from a product
   * @param productId - The product ID
   * @param imageUrls - Array of image URLs to remove
   */
  removeImages: (productId: string, imageUrls: string[]) => {
    const product = getProductById(productId);
    if (!product) {
      console.error('Product not found:', productId);
      return false;
    }

    const imagesToRemove = new Set(imageUrls);
    const updatedImages = product.images.filter(img => !imagesToRemove.has(img));

    if (updatedImages.length === product.images.length) {
      console.log('No matching images found to remove');
      return true;
    }

    updateProduct(productId, { images: updatedImages });
    console.log(`Removed ${product.images.length - updatedImages.length} images from product "${product.name}"`);
    return true;
  },

  /**
   * Replace all images for a product
   * @param productId - The product ID
   * @param imageUrls - Array of new image URLs
   */
  setImages: (productId: string, imageUrls: string[]) => {
    const product = getProductById(productId);
    if (!product) {
      console.error('Product not found:', productId);
      return false;
    }

    updateProduct(productId, { images: imageUrls });
    console.log(`Set ${imageUrls.length} images for product "${product.name}"`);
    return true;
  },

  /**
   * Get current images for a product
   * @param productId - The product ID
   */
  getImages: (productId: string) => {
    const product = getProductById(productId);
    if (!product) {
      console.error('Product not found:', productId);
      return [];
    }

    console.log(`Current images for "${product.name}":`, product.images);
    return product.images;
  },

  /**
   * Reorder images for a product
   * @param productId - The product ID
   * @param imageUrls - Array of image URLs in new order
   */
  reorderImages: (productId: string, imageUrls: string[]) => {
    const product = getProductById(productId);
    if (!product) {
      console.error('Product not found:', productId);
      return false;
    }

    // Check if all provided URLs exist in current images
    const currentImages = new Set(product.images);
    const hasAllImages = imageUrls.every(url => currentImages.has(url));

    if (!hasAllImages) {
      console.error('Some provided images are not currently associated with this product');
      return false;
    }

    updateProduct(productId, { images: imageUrls });
    console.log(`Reordered images for product "${product.name}"`);
    return true;
  },

  /**
   * List all products with their image counts
   */
  listProducts: () => {
    const { products } = require('@/data/products');
    console.table(
      products.map(p => ({
        ID: p.id,
        Name: p.name,
        Images: p.images.length,
        'First Image': p.images[0] || 'None'
      }))
    );
  },

  /**
   * Quick setup for common image operations
   */
  quickSetup: {
    // Add HYMNS T-shirt images to any product
    addTshirtImages: (productId: string) => {
      return imageUtils.addImages(productId, [
        '/images/HYMNS T-SHIRT1.png',
        '/images/HYMNS T-SHIRT2.png'
      ]);
    },

    // Add studio images to any product
    addStudioImages: (productId: string) => {
      return imageUtils.addImages(productId, [
        '/images/hymns-studio.jpeg',
        '/images/hymns-studio1.jpeg',
        '/images/hymns-studio2.jpeg',
        '/images/hymns-studio3.jpeg'
      ]);
    },

    // Clear all images from a product
    clearImages: (productId: string) => {
      return imageUtils.setImages(productId, []);
    }
  }
};

// Make it available globally for easy access from browser console
if (typeof window !== 'undefined') {
  (window as any).imageUtils = imageUtils;
  console.log('🖼️ Image utilities loaded! Use window.imageUtils to manage product images.');
  console.log('Example: imageUtils.addImages("product-id", ["/images/image.jpg"])');
}