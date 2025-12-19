import { supabase } from './supabase';
import type { Product, CartItem, Message, CartItemWithProduct } from '@/types/types';

export const productsApi = {
  async getAll(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return Array.isArray(data) ? data : [];
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
  }
};

export const cartApi = {
  async getCartItems(userId: string): Promise<CartItemWithProduct[]> {
    const { data, error } = await supabase
      .from('cart_items')
      .select(`
        *,
        product:products(*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  async addToCart(userId: string, productId: string, quantity: number, size?: string): Promise<CartItem> {
    const { data: existing, error: checkError } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .eq('size', size || '')
      .maybeSingle();

    if (checkError) throw checkError;

    if (existing) {
      const { data, error } = await supabase
        .from('cart_items')
        .update({ quantity: existing.quantity + quantity })
        .eq('id', existing.id)
        .select()
        .maybeSingle();
      
      if (error) throw error;
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
    return data as CartItem;
  },

  async updateQuantity(cartItemId: string, quantity: number): Promise<void> {
    const { error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('id', cartItemId);
    
    if (error) throw error;
  },

  async removeFromCart(cartItemId: string): Promise<void> {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', cartItemId);
    
    if (error) throw error;
  },

  async clearCart(userId: string): Promise<void> {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', userId);
    
    if (error) throw error;
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
