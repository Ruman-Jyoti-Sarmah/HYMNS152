/*
# Add Wishlist and Reviews Tables

## 1. New Tables

### wishlists
- `id` (uuid, primary key, default: gen_random_uuid())
- `user_id` (uuid, not null)
- `product_id` (uuid, references products)
- `created_at` (timestamptz, default: now())

### reviews
- `id` (uuid, primary key, default: gen_random_uuid())
- `user_id` (uuid, not null)
- `product_id` (uuid, references products)
- `rating` (integer, not null, check: rating >= 1 AND rating <= 5)
- `comment` (text)
- `created_at` (timestamptz, default: now())

### orders
- `id` (uuid, primary key, default: gen_random_uuid())
- `user_id` (uuid, not null)
- `total_amount` (numeric, not null)
- `status` (text, default: 'pending')
- `shipping_address` (jsonb)
- `payment_method` (text)
- `created_at` (timestamptz, default: now())

### order_items
- `id` (uuid, primary key, default: gen_random_uuid())
- `order_id` (uuid, references orders)
- `product_id` (uuid, references products)
- `quantity` (integer, not null)
- `price` (numeric, not null)
- `size` (text)
- `created_at` (timestamptz, default: now())

## 2. Security
- Enable RLS on all new tables
- Users can only access their own wishlists, reviews, and orders

## 3. Indexes
- Add indexes for performance on frequently queried columns
*/

-- Create wishlists table
CREATE TABLE IF NOT EXISTS wishlists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamptz DEFAULT now()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  total_amount numeric NOT NULL,
  status text DEFAULT 'pending',
  shipping_address jsonb,
  payment_method text,
  created_at timestamptz DEFAULT now()
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  quantity integer NOT NULL,
  price numeric NOT NULL,
  size text,
  created_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX idx_wishlists_user_id ON wishlists(user_id);
CREATE INDEX idx_reviews_product_id ON reviews(product_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);

-- Enable RLS
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own wishlists" ON wishlists
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert their own wishlists" ON wishlists
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete their own wishlists" ON wishlists
  FOR DELETE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can view reviews for products" ON reviews
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own reviews" ON reviews
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their own reviews" ON reviews
  FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can view their own orders" ON orders
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert their own orders" ON orders
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can view their own order items" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id::text = auth.uid()::text
    )
  );

CREATE POLICY "Users can insert their own order items" ON order_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id::text = auth.uid()::text
    )
  );