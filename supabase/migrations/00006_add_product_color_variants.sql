/*
# Add Color Variants Support for Products

Add support for product color variants with different images for each color.
This allows products to have multiple color options like on e-commerce platforms.
*/

-- Add variants column to products table as JSONB
ALTER TABLE products ADD COLUMN IF NOT EXISTS variants jsonb;

-- Update existing T-shirt product to have color variants
UPDATE products
SET variants = jsonb_build_array(
  jsonb_build_object(
    'color', 'black',
    'color_code', '#000000',
    'images', jsonb_build_array(
      '/images/HYMNS T-SHIRT1.png',
      '/images/HYMNS T-SHIRT2.png'
    ),
    'stock', 15
  ),
  jsonb_build_object(
    'color', 'white',
    'color_code', '#FFFFFF',
    'images', jsonb_build_array(
      '/images/hymns-studio.jpeg',
      '/images/hymns-studio1.jpeg'
    ),
    'stock', 12
  ),
  jsonb_build_object(
    'color', 'navy',
    'color_code', '#000080',
    'images', jsonb_build_array(
      '/images/hymns-studio2.jpeg',
      '/images/hymns-studio3.jpeg'
    ),
    'stock', 8
  )
)
WHERE name LIKE '%T-SHIRT%' AND variants IS NULL;

-- Create a sample hoodie with color variants
INSERT INTO products (name, description, price, image_url, image_urls, variants, category, sizes, stock) VALUES
('Premium HYMNS Hoodie', 'Comfortable hoodie with HYMNS branding in multiple colors', 2499.00, '/images/HYMNS T-SHIRT1.png',
 jsonb_build_array(
   '/images/HYMNS T-SHIRT1.png',
   '/images/HYMNS T-SHIRT2.png',
   '/images/hymns-studio.jpeg',
   '/images/hymns-studio1.jpeg'
 ),
 jsonb_build_array(
   jsonb_build_object(
     'color', 'black',
     'color_code', '#000000',
     'images', jsonb_build_array(
       '/images/HYMNS T-SHIRT1.png',
       '/images/HYMNS T-SHIRT2.png'
     ),
     'stock', 20
   ),
   jsonb_build_object(
     'color', 'gray',
     'color_code', '#808080',
     'images', jsonb_build_array(
       '/images/hymns-studio.jpeg',
       '/images/hymns-studio1.jpeg'
     ),
     'stock', 15
   ),
   jsonb_build_object(
     'color', 'white',
     'color_code', '#FFFFFF',
     'images', jsonb_build_array(
       '/images/hymns-studio2.jpeg',
       '/images/hymns-studio3.jpeg'
     ),
     'stock', 10
   )
 ), 'Clothing', ARRAY['S', 'M', 'L', 'XL'], 45)
ON CONFLICT (name) DO UPDATE SET
  variants = EXCLUDED.variants,
  stock = EXCLUDED.stock;
