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
