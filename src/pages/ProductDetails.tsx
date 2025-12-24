import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, ShoppingCart, Heart, Share2, Truck, Shield, RotateCcw, ChevronLeft, ChevronRight, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { productsApi, cartApi, getUserId } from '@/db/api';
import type { Product } from '@/types/types';

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const { toast } = useToast();

  // Use product images from database, fallback to single image if no array
  const productImages = product ? (
    product.image_urls && product.image_urls.length > 0
      ? product.image_urls.slice(0, 4) // Limit to 4 images max
      : [product.image_url || ''].filter(Boolean)
  ) : [];

  useEffect(() => {
    if (id) {
      loadProduct();
    }
  }, [id]);

  const loadProduct = async () => {
    try {
      const data = await productsApi.getById(id!);
      setProduct(data);

      // Load related products after getting the main product
      if (data) {
        await loadRelatedProducts(data);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load product details",
        variant: "destructive"
      });
      navigate('/store');
    } finally {
      setIsLoading(false);
    }
  };

  const loadRelatedProducts = async (currentProduct: Product) => {
    try {
      const related = await productsApi.getRelatedProducts(
        currentProduct.id,
        currentProduct.category,
        currentProduct.price
      );
      setRelatedProducts(related);
    } catch (error) {
      console.error('Failed to load related products:', error);
      // If no related products found, try to get general similar products
      try {
        const similar = await productsApi.getSimilarProducts(6);
        // Filter out the current product
        const filtered = similar.filter(p => p.id !== currentProduct.id);
        setRelatedProducts(filtered.slice(0, 6));
      } catch (fallbackError) {
        console.error('Failed to load fallback products:', fallbackError);
      }
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;

    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      toast({
        title: "Please select a size",
        variant: "destructive"
      });
      return;
    }

    setIsAddingToCart(true);
    try {
      await cartApi.addToCart(getUserId(), product.id, quantity, selectedSize);
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive"
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast({
      title: isWishlisted ? "Removed from wishlist" : "Added to wishlist",
      description: isWishlisted ? "Item removed from your wishlist" : "Item added to your wishlist"
    });
  };

  const shareProduct = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.name,
          text: product?.description || '',
          url: window.location.href
        });
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied",
        description: "Product link copied to clipboard"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Skeleton className="aspect-square w-full bg-muted" />
            <div className="space-y-6">
              <Skeleton className="h-8 w-3/4 bg-muted" />
              <Skeleton className="h-6 w-1/2 bg-muted" />
              <Skeleton className="h-4 w-full bg-muted" />
              <Skeleton className="h-4 w-full bg-muted" />
              <Skeleton className="h-4 w-1/2 bg-muted" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Product not found</h1>
          <Button onClick={() => navigate('/store')}>Back to Store</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <button
            onClick={() => navigate('/store')}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Store
          </button>
          <span className="mx-2 text-muted-foreground">/</span>
          <span className="text-foreground">{product.category}</span>
          <span className="mx-2 text-muted-foreground">/</span>
          <span className="text-foreground font-medium">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
              <img
                src={productImages[currentImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.stock === 0 && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <span className="text-white font-semibold text-lg">Out of Stock</span>
                </div>
              )}

              {/* Navigation arrows */}
              {productImages.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : productImages.length - 1))}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-colors"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setCurrentImageIndex((prev) => (prev < productImages.length - 1 ? prev + 1 : 0))}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-colors"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail images */}
            {productImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      currentImageIndex === index ? 'border-primary' : 'border-transparent'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-black mb-2">{product.name}</h1>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground ml-1">4.2 (127 reviews)</span>
                    </div>
                    <Badge variant="secondary" className="capitalize">
                      {product.category}
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" onClick={toggleWishlist}>
                    <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
                  </Button>
                  <Button variant="outline" size="icon" onClick={shareProduct}>
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-4xl font-bold text-orange-600">₹{product.price.toFixed(2)}</span>
                <span className="text-lg text-muted-foreground line-through">₹{(product.price * 1.3).toFixed(2)}</span>
                <Badge variant="destructive" className="text-sm">23% off</Badge>
              </div>

              <p className="text-muted-foreground mb-6">{product.description}</p>
            </div>

            <Separator />

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <h3 className="font-semibold text-foreground mb-3">Size</h3>
                <Select value={selectedSize} onValueChange={setSelectedSize}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    {product.sizes.map((size) => (
                      <SelectItem key={size} value={size}>
                        Size {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Quantity */}
            <div>
              <h3 className="font-semibold text-foreground mb-3">Quantity</h3>
              <div className="flex items-center gap-3">
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="px-4 py-2 font-medium">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.stock} available
                </span>
              </div>
            </div>

            {/* Add to Cart */}
            <Button
              onClick={handleAddToCart}
              disabled={isAddingToCart || product.stock === 0}
              className="w-full h-12 text-lg"
              size="lg"
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              {product.stock === 0 ? 'Out of Stock' : isAddingToCart ? 'Adding...' : 'Add to Cart'}
            </Button>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
              <div className="flex items-center gap-3 text-sm">
                <Truck className="h-5 w-5 text-green-600" />
                <span>Free shipping</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Shield className="h-5 w-5 text-blue-600" />
                <span>2 year warranty</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <RotateCcw className="h-5 w-5 text-orange-600" />
                <span>30-day returns</span>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-foreground mb-6">Customer Reviews</h2>
          <div className="space-y-6">
            {[
              { name: 'John D.', rating: 5, comment: 'Great quality product! Exactly as described.', date: '2 days ago' },
              { name: 'Sarah M.', rating: 4, comment: 'Good fit and comfortable. Fast shipping.', date: '1 week ago' },
              { name: 'Mike R.', rating: 5, comment: 'Love the design. Will buy again!', date: '2 weeks ago' }
            ].map((review, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="font-semibold text-foreground">{review.name}</div>
                      <div className="flex items-center gap-1 mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground">{review.date}</span>
                  </div>
                  <p className="text-muted-foreground">{review.comment}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-foreground mb-6">You Might Also Like</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Card key={relatedProduct.id} className="overflow-hidden group hover:shadow-2xl transition-all duration-500 border-border hover:border-primary/50 cursor-pointer">
                  <div className="relative aspect-square overflow-hidden bg-muted">
                    <img
                      src={relatedProduct.image_url || '/images/placeholder.jpg'}
                      alt={relatedProduct.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {relatedProduct.stock === 0 && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">Out of Stock</span>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors text-orange-600 text-sm">
                      {relatedProduct.name}
                    </h3>
                    <div className="flex items-baseline gap-2 mb-3">
                      <p className="text-lg font-bold text-orange-600">
                        ₹{relatedProduct.price.toFixed(2)}
                      </p>
                      {relatedProduct.price < 100 && (
                        <p className="text-xs font-semibold text-green-600">
                          23% off
                        </p>
                      )}
                    </div>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/product/${relatedProduct.id}`);
                      }}
                      className="w-full text-sm"
                      size="sm"
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
