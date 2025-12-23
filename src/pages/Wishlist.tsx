import React, { useEffect, useState } from 'react';
import { Heart, Trash2, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { wishlistApi, cartApi, getUserId } from '@/db/api';
import type { WishlistItem } from '@/types/types';

const Wishlist: React.FC = () => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    try {
      const data = await wishlistApi.getWishlist(getUserId());
      setWishlistItems(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load wishlist",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromWishlist = async (productId: string) => {
    try {
      await wishlistApi.removeFromWishlist(getUserId(), productId);
      await loadWishlist();
      toast({
        title: "Removed from wishlist",
        description: "Item has been removed from your wishlist"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove item from wishlist",
        variant: "destructive"
      });
    }
  };

  const addToCart = async (product: any) => {
    try {
      await cartApi.addToCart(getUserId(), product.id, 1);
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
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <Skeleton className="h-8 w-48 bg-muted" />
            <Skeleton className="h-4 w-64 mt-2 bg-muted" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="aspect-square w-full bg-muted" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl xl:text-5xl font-bold text-black mb-2">
            My Wishlist
          </h1>
          <p className="text-black">
            {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} in your wishlist
          </p>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="text-center py-20">
            <Heart className="h-24 w-24 text-muted-foreground mx-auto mb-6" />
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Your wishlist is empty
            </h2>
            <p className="text-muted-foreground mb-8">
              Add items you love to your wishlist to keep track of them
            </p>
            <Button asChild>
              <a href="/store">Continue Shopping</a>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {wishlistItems.map((item) => (
              <Card key={item.id} className="overflow-hidden group hover:shadow-2xl transition-all duration-500">
                <div className="relative aspect-square overflow-hidden bg-muted">
                  <img
                    src={item.product?.image_url || ''}
                    alt={item.product?.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <button
                    onClick={() => removeFromWishlist(item.product_id)}
                    className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-colors"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </button>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-foreground mb-2 line-clamp-2">
                    {item.product?.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {item.product?.description}
                  </p>
                  <div className="flex items-baseline gap-2 mb-4">
                    <p className="text-2xl font-bold text-foreground">
                      ₹{item.product?.price.toFixed(2)}
                    </p>
                    {item.product && item.product.price < 100 && (
                      <p className="text-sm font-semibold text-green-600">
                        23% off
                      </p>
                    )}
                  </div>
                  <Button
                    onClick={() => item.product && addToCart(item.product)}
                    className="w-full"
                    size="sm"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;