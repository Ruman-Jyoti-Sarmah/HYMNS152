export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category: string;
  sizes: string[] | null;
  stock: number;
  created_at: string;
}

export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  size: string | null;
  created_at: string;
}

export interface Message {
  id: string;
  user_id: string;
  user_name: string;
  message: string;
  is_admin_reply: boolean;
  created_at: string;
}

export interface CartItemWithProduct extends CartItem {
  product: Product;
}

export interface WishlistItem {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
  product?: Product;
}

export interface Review {
  id: string;
  user_id: string;
  product_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  total_amount: number;
  status: string;
  shipping_address: any;
  payment_method: string | null;
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  size: string | null;
  created_at: string;
  product?: Product;
}

export interface OrderWithItems extends Order {
  items: OrderItem[];
}
