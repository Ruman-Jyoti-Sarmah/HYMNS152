/*
# Update Product Images

Update product image URLs with real images from image search.
*/

UPDATE products SET image_url = '/images/HYMNS T-SHIRT1.png' WHERE name = 'HYMNS T-SHIRT';
UPDATE products SET image_url = '/images/HYMNS T-SHIRT2.png';
UPDATE products SET image_url = 'https://miaoda-site-img.s3cdn.medo.dev/images/8c91214d-9486-4b4e-b782-4d428abd6419.jpg' WHERE name = 'HYMNS Cap';
UPDATE products SET image_url = 'https://miaoda-site-img.s3cdn.medo.dev/images/ee933ec7-e900-4401-a230-8bc569e21a5d.jpg' WHERE name = 'HYMNS Vinyl Record';
UPDATE products SET image_url = 'https://miaoda-site-img.s3cdn.medo.dev/images/ae0440b6-fb6b-417c-b95b-777338e9d7fd.jpg' WHERE name = 'HYMNS Poster Set';
UPDATE products SET image_url = 'https://miaoda-site-img.s3cdn.medo.dev/images/908a0aa0-86b7-4d07-b1f4-d843549457cd.jpg' WHERE name = 'HYMNS Tote Bag';
