/*
# Add Multiple Images Support for Products

Add support for up to 4 images per product by adding an image_urls JSON array column.
This allows products to have multiple images for better presentation.
*/

-- Add image_urls column to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS image_urls jsonb;

-- Update existing products with image_urls based on their current image_url
UPDATE products
SET image_urls = jsonb_build_array(image_url)
WHERE image_url IS NOT NULL AND (image_urls IS NULL OR jsonb_array_length(image_urls) = 0);

-- Add some sample products with multiple images for demonstration
-- You can update these URLs to your actual product images
INSERT INTO products (name, description, price, image_url, image_urls, category, sizes, stock) VALUES
('Premium HYMNS Hoodie', 'Comfortable hoodie with HYMNS branding', 2499.00, '/images/HYMNS T-SHIRT1.png',
 jsonb_build_array(
   '/images/HYMNS T-SHIRT1.png',
   '/images/HYMNS T-SHIRT2.png',
 ), 'Clothing', ARRAY['S', 'M', 'L', 'XL'], 25)
ON CONFLICT (name) DO NOTHING;

-- Update existing T-shirt products to have multiple images
UPDATE products
SET image_urls = jsonb_build_array(
  '/images/HYMNS T-SHIRT1.png',
  '/images/HYMNS T-SHIRT2.png',
  '/images/hymns-studio.jpeg',
  '/images/hymns-studio1.jpeg'
)
WHERE name LIKE '%T-SHIRT%' AND image_urls IS NULL;
