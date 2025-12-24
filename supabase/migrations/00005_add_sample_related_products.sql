/*
# Add Sample Products for Related Products Testing

Add various products across different categories and price ranges
to test the related products functionality.
*/

-- Add sample products for different categories
INSERT INTO products (name, description, price, image_url, image_urls, category, sizes, stock) VALUES
-- Clothing category (similar to T-shirts)
('HYMNS Hoodie', 'Comfortable cotton hoodie with HYMNS branding', 2999.00, '/images/HYMNS T-SHIRT1.png',
 jsonb_build_array('/images/HYMNS T-SHIRT1.png', '/images/HYMNS T-SHIRT2.png'), 'Clothing', ARRAY['S', 'M', 'L', 'XL'], 15),

('HYMNS Sweatshirt', 'Cozy sweatshirt perfect for casual wear', 1999.00, '/images/HYMNS T-SHIRT1.png',
 jsonb_build_array('/images/HYMNS T-SHIRT1.png', '/images/HYMNS T-SHIRT2.png'), 'Clothing', ARRAY['S', 'M', 'L', 'XL'], 20),

('HYMNS Polo Shirt', 'Classic polo shirt for smart casual look', 1499.00, '/images/HYMNS T-SHIRT1.png',
 jsonb_build_array('/images/HYMNS T-SHIRT1.png'), 'Clothing', ARRAY['S', 'M', 'L', 'XL'], 12),

-- Accessories category (different from clothing)
('HYMNS Cap', 'Adjustable cap with embroidered HYMNS logo', 899.00, '/images/hymns-studio.jpeg',
 jsonb_build_array('/images/hymns-studio.jpeg', '/images/hymns-studio1.jpeg'), 'Accessories', NULL, 25),

('HYMNS Socks Pack', 'Comfortable cotton socks with HYMNS design', 599.00, '/images/hymns-studio.jpeg',
 jsonb_build_array('/images/hymns-studio.jpeg'), 'Accessories', ARRAY['One Size'], 30),

('HYMNS Keychain', 'Metal keychain with HYMNS logo', 299.00, '/images/hymns-studio.jpeg',
 jsonb_build_array('/images/hymns-studio.jpeg'), 'Accessories', NULL, 50),

-- Music category (different from clothing)
('HYMNS Vinyl Record', 'Limited edition vinyl with exclusive tracks', 2499.00, '/images/hymns-studio.jpeg',
 jsonb_build_array('/images/hymns-studio.jpeg', '/images/hymns-studio1.jpeg'), 'Music', NULL, 8),

('HYMNS CD Album', 'Digital album with bonus tracks', 799.00, '/images/hymns-studio.jpeg',
 jsonb_build_array('/images/hymns-studio.jpeg'), 'Music', NULL, 20),

-- Similar price range products
('Premium HYMNS Mug', 'Ceramic mug with HYMNS design', 699.00, '/images/hymns-studio.jpeg',
 jsonb_build_array('/images/hymns-studio.jpeg'), 'Accessories', NULL, 18),

('HYMNS Sticker Pack', 'Set of 5 vinyl stickers', 399.00, '/images/hymns-studio.jpeg',
 jsonb_build_array('/images/hymns-studio.jpeg'), 'Accessories', NULL, 40)

ON CONFLICT (name) DO NOTHING;
