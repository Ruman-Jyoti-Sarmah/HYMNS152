import { supabase } from './supabase';
import type { Product, CartItem, Message, CartItemWithProduct, WishlistItem, Review, Order, OrderItem, OrderWithItems } from '@/types/types';

export const productsApi = {
  async getAll(): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      console.log('productsApi.getAll() returned:', data);
      return Array.isArray(data) ? data : [];
    } catch (supabaseError) {
      console.warn('Supabase products not available, using local fallback:', supabaseError);
      // Return empty array for now - cart will show items without product details
      return [];
    }
  },

  async getById(id: string): Promise<Product | null> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    
    if (error) throw error;
    return data;
  },

  async getByCategory(category: string): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  async getRelatedProducts(productId: string, category: string, price: number, limit = 6): Promise<Product[]> {
    // Get products from same category, similar price range, excluding current product
    const priceRange = 500; // ±₹500 price range
    const minPrice = Math.max(0, price - priceRange);
    const maxPrice = price + priceRange;

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .neq('id', productId) // Exclude current product
      .eq('category', category) // Same category
      .gte('price', minPrice) // Price range
      .lte('price', maxPrice)
      .gt('stock', 0) // In stock only
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  async getSimilarProducts(limit = 8): Promise<Product[]> {
    // Get popular/recent products for general recommendations
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .gt('stock', 0)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return Array.isArray(data) ? data : [];
  }
};

// Local storage cart implementation for development
const CART_STORAGE_KEY = 'hymns_cart_items';

const getStoredCart = (): CartItemWithProduct[] => {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load cart from localStorage:', error);
    return [];
  }
};

const saveCartToStorage = (cart: CartItemWithProduct[]): void => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (error) {
    console.error('Failed to save cart to localStorage:', error);
  }
};

export const cartApi = {
  async getCartItems(userId: string): Promise<CartItemWithProduct[]> {
    console.log('getCartItems called with userId:', userId);

    // Try Supabase first, fallback to localStorage
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          *,
          product:products(*)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      console.log('Supabase returned cart items:', data);

      const supabaseItems = Array.isArray(data) ? data : [];
      if (supabaseItems.length > 0) {
        return supabaseItems;
      }

      // If Supabase is empty, fall back to localStorage
      console.log('Supabase returned empty, using localStorage fallback');
    } catch (supabaseError) {
      console.warn('Supabase cart not available, using localStorage fallback:', supabaseError);
    }

    // Fallback to localStorage - need to populate product data
    const allCartItems = getStoredCart();
    console.log('All stored cart items:', allCartItems);

    const cartItems = allCartItems.filter(item => item.user_id === userId);
    console.log('Filtered cart items for user:', userId, cartItems);

    // Populate product data for each cart item using local products data
    const { products } = await import('../data/products');
    console.log('Using local products data, total products:', products.length);
    console.log('Available local products:', products.map(p => ({ id: p.id, name: p.name })));

    const populatedCartItems = cartItems.map((item) => {
      if (!item.product) {
        const product = products.find(p => p.id === item.product_id);
        console.log('Looking for product:', item.product_id, 'Found:', product?.name || 'NOT FOUND');

        if (product) {
          // Convert AdminProduct to Product format for cart display
          const convertedProduct: Product = {
            id: product.id,
            name: product.name,
            description: product.description,
            price: product.price,
            image_url: product.images[0] || '',
            images: product.images,
            variants: product.variants?.map(v => ({
              color: v.color,
              color_code: v.color_code,
              images: v.images,
              stock: v.stock
            })),
            category: product.category || 'General',
            sizes: product.sizes || null,
            stock: product.variants?.reduce((total, v) => total + v.stock, 0) || (product.inStock ? 10 : 0),
            created_at: new Date().toISOString()
          };
          return { ...item, product: convertedProduct };
        } else {
          console.warn('Product not found in local data:', item.product_id);
        }
      }
      return item;
    });

    console.log('Populated cart items:', populatedCartItems);
    return populatedCartItems;
  },

  async addToCart(userId: string, productId: string, quantity: number, size?: string): Promise<CartItem> {
    console.log('addToCart called with:', { userId, productId, quantity, size });

    try {
      // Try Supabase first
      const { data: existing, error: checkError } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', userId)
        .eq('product_id', productId)
        .eq('size', size || '')
        .maybeSingle();

      if (checkError && checkError.code !== 'PGRST116') throw checkError; // PGRST116 is "not found"

      if (existing) {
        const { data, error } = await supabase
          .from('cart_items')
          .update({ quantity: existing.quantity + quantity })
          .eq('id', existing.id)
          .select()
          .maybeSingle();

        if (error) throw error;
        console.log('Updated existing Supabase cart item:', data);
        return data as CartItem;
      }

      const { data, error } = await supabase
        .from('cart_items')
        .insert({
          user_id: userId,
          product_id: productId,
          quantity,
          size: size || null
        })
        .select()
        .maybeSingle();

      if (error) throw error;
      console.log('Created new Supabase cart item:', data);
      return data as CartItem;
    } catch (supabaseError) {
      console.warn('Supabase cart not available, using localStorage fallback:', supabaseError);

      // Fallback to localStorage
      const cart = getStoredCart();
      console.log('Current cart before adding:', cart);

      const existingIndex = cart.findIndex(
        item => item.user_id === userId &&
                item.product_id === productId &&
                item.size === (size || null)
      );

      if (existingIndex >= 0) {
        cart[existingIndex].quantity += quantity;
        saveCartToStorage(cart);
        console.log('Updated existing localStorage cart item:', cart[existingIndex]);
        return cart[existingIndex];
      } else {
        // For localStorage fallback, create cart item without full product data
        const newItem: CartItemWithProduct = {
          id: Date.now().toString(),
          user_id: userId,
          product_id: productId,
          quantity,
          size: size || null,
          created_at: new Date().toISOString(),
          product: undefined // Will be populated when cart is displayed
        };

        cart.push(newItem);
        saveCartToStorage(cart);
        console.log('Created new localStorage cart item:', newItem);
        console.log('Updated cart after adding:', cart);
        return newItem;
      }
    }
  },

  async updateQuantity(cartItemId: string, quantity: number): Promise<void> {
    try {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', cartItemId);

      if (error) throw error;
    } catch (supabaseError) {
      console.warn('Supabase cart not available, using localStorage fallback:', supabaseError);

      // Fallback to localStorage
      const cart = getStoredCart();
      const itemIndex = cart.findIndex(item => item.id === cartItemId);
      if (itemIndex >= 0) {
        cart[itemIndex].quantity = quantity;
        saveCartToStorage(cart);
      }
    }
  },

  async removeFromCart(cartItemId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', cartItemId);

      if (error) throw error;
    } catch (supabaseError) {
      console.warn('Supabase cart not available, using localStorage fallback:', supabaseError);

      // Fallback to localStorage
      const cart = getStoredCart();
      const filteredCart = cart.filter(item => item.id !== cartItemId);
      saveCartToStorage(filteredCart);
    }
  },

  async clearCart(userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', userId);

      if (error) throw error;
    } catch (supabaseError) {
      console.warn('Supabase cart not available, using localStorage fallback:', supabaseError);

      // Fallback to localStorage
      const cart = getStoredCart();
      const filteredCart = cart.filter(item => item.user_id !== userId);
      saveCartToStorage(filteredCart);
    }
  }
};

export const messagesApi = {
  async getMessages(userId: string, limit = 50): Promise<Message[]> {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true })
      .limit(limit);
    
    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  async sendMessage(userId: string, userName: string, message: string): Promise<Message> {
    const { data, error } = await supabase
      .from('messages')
      .insert({
        user_id: userId,
        user_name: userName,
        message,
        is_admin_reply: false
      })
      .select()
      .maybeSingle();
    
    if (error) throw error;
    return data as Message;
  },

  subscribeToMessages(userId: string, callback: (message: Message) => void) {
    return supabase
      .channel(`messages:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          callback(payload.new as Message);
        }
      )
      .subscribe();
  }
};

export const wishlistApi = {
  async getWishlist(userId: string): Promise<WishlistItem[]> {
    const { data, error } = await supabase
      .from('wishlists')
      .select(`
        *,
        product:products(*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  async addToWishlist(userId: string, productId: string): Promise<void> {
    const { error } = await supabase
      .from('wishlists')
      .insert({ user_id: userId, product_id: productId });

    if (error) throw error;
  },

  async removeFromWishlist(userId: string, productId: string): Promise<void> {
    const { error } = await supabase
      .from('wishlists')
      .delete()
      .eq('user_id', userId)
      .eq('product_id', productId);

    if (error) throw error;
  },

  async isInWishlist(userId: string, productId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('wishlists')
      .select('id')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .maybeSingle();

    if (error) throw error;
    return !!data;
  }
};

export const reviewsApi = {
  async getProductReviews(productId: string): Promise<Review[]> {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('product_id', productId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  async addReview(userId: string, productId: string, rating: number, comment?: string): Promise<void> {
    const { error } = await supabase
      .from('reviews')
      .insert({
        user_id: userId,
        product_id: productId,
        rating,
        comment
      });

    if (error) throw error;
  },

  async getUserReview(userId: string, productId: string): Promise<Review | null> {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .maybeSingle();

    if (error) throw error;
    return data;
  }
};

export const ordersApi = {
  async createOrder(userId: string, items: CartItemWithProduct[], shippingAddress: any, paymentMethod?: string): Promise<Order> {
    const totalAmount = items.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);

    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: userId,
        total_amount: totalAmount,
        shipping_address: shippingAddress,
        payment_method: paymentMethod
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // Add order items
    const orderItems = items.map(item => ({
      order_id: orderData.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.product?.price || 0,
      size: item.size
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) throw itemsError;

    return orderData;
  },

  async getUserOrders(userId: string): Promise<OrderWithItems[]> {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        items:order_items(
          *,
          product:products(*)
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  async getOrderById(orderId: string): Promise<OrderWithItems | null> {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        items:order_items(
          *,
          product:products(*)
        )
      `)
      .eq('id', orderId)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async updateOrderStatus(orderId: string, status: string): Promise<void> {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId);

    if (error) throw error;
  }
};

export function getUserId(): string {
  let userId = localStorage.getItem('hymns_user_id');
  if (!userId) {
    userId = crypto.randomUUID();
    localStorage.setItem('hymns_user_id', userId);
  }
  return userId;
}

export function getUserName(): string {
  return localStorage.getItem('hymns_user_name') || 'Guest';
}

export function setUserName(name: string): void {
  localStorage.setItem('hymns_user_name', name);
}
