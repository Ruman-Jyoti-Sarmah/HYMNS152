/*
# Create Products, Cart, and Messages Tables

## 1. New Tables

### products
- `id` (uuid, primary key, default: gen_random_uuid())
- `name` (text, not null)
- `description` (text)
- `price` (numeric, not null)
- `image_url` (text)
- `category` (text, default: 'merchandise')
- `sizes` (text[], available sizes)
- `stock` (integer, default: 0)
- `created_at` (timestamptz, default: now())

### cart_items
- `id` (uuid, primary key, default: gen_random_uuid())
- `user_id` (uuid, not null) - stores UUID for anonymous users
- `product_id` (uuid, references products)
- `quantity` (integer, default: 1)
- `size` (text)
- `created_at` (timestamptz, default: now())

### messages
- `id` (uuid, primary key, default: gen_random_uuid())
- `user_id` (uuid, not null) - stores UUID for anonymous users
- `user_name` (text, default: 'Guest')
- `message` (text, not null)
- `is_admin_reply` (boolean, default: false)
- `created_at` (timestamptz, default: now())

## 2. Security
- No RLS enabled - public access for all tables
- Products are publicly readable
- Cart items are managed by UUID
- Messages are publicly accessible for chat functionality

## 3. Notes
- UUID-based system for anonymous users
- Products table for store merchandise
- Cart items linked to user UUID stored in localStorage
- Messages table for real-time chat system
*/

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price numeric NOT NULL,
  image_url text,
  category text DEFAULT 'merchandise',
  sizes text[],
  stock integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  quantity integer DEFAULT 1 CHECK (quantity > 0),
  size text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  user_name text DEFAULT 'Guest',
  message text NOT NULL,
  is_admin_reply boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_cart_user_id ON cart_items(user_id);
CREATE INDEX idx_messages_user_id ON messages(user_id);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);

INSERT INTO products (name, description, price, category, sizes, stock, image_url) VALUES
('HYMNS Classic T-Shirt', 'Premium cotton t-shirt with HYMNS logo', 29.99, 'apparel', ARRAY['S', 'M', 'L', 'XL'], 100, 'placeholder-tshirt.jpg'),
('HYMNS Hoodie', 'Comfortable hoodie with embroidered logo', 59.99, 'apparel', ARRAY['S', 'M', 'L', 'XL'], 50, 'placeholder-hoodie.jpg'),
('HYMNS Cap', 'Adjustable snapback cap', 24.99, 'accessories', ARRAY['One Size'], 75, 'placeholder-cap.jpg'),
('HYMNS Vinyl Record', 'Limited edition vinyl of our latest album', 34.99, 'music', ARRAY['Standard'], 30, 'placeholder-vinyl.jpg'),
('HYMNS Poster Set', 'Set of 3 premium posters', 19.99, 'accessories', ARRAY['Standard'], 100, 'placeholder-poster.jpg'),
('HYMNS Tote Bag', 'Eco-friendly canvas tote bag', 14.99, 'accessories', ARRAY['One Size'], 80, 'placeholder-tote.jpg');