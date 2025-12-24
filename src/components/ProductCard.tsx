import React, { useState } from 'react';
import { ShoppingCart, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import type { Product } from '@/types/types';
import { cartApi, getUserId } from '@/db/api';

interface ProductCardProps {
  product: Product;
  onAddToCart?: () => void;
  isSelected?: boolean;
  onSelect?: (productId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, isSelected = false, onSelect }) => {
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [isAdding, setIsAdding] = useState(false);
  const { toast } = useToast();

  const handleCardClick = (e: React.MouseEvent) => {
    // Only handle selection if onSelect is provided and not clicking on the Add to Cart button
    if (onSelect && !(e.target as HTMLElement).closest('button')) {
      e.preventDefault();
      onSelect(product.id);
    }
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation to product details
    e.stopPropagation();

    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      toast({
        title: "Please select a size",
        variant: "destructive"
      });
      return;
    }

    setIsAdding(true);
    try {
      const userId = getUserId();
      await cartApi.addToCart(userId, product.id, 1, selectedSize);
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart`
      });
      onAddToCart?.();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive"
      });
    } finally {
      setIsAdding(false);
    }
  };

  const rating = 4.5;
  const reviewCount = Math.floor(Math.random() * 500) + 100;

  return (
    <div onClick={handleCardClick} className="block">
      <Card className={`overflow-hidden group hover:shadow-2xl transition-all duration-500 border-border hover:border-primary/50 cursor-pointer ${isSelected ? 'ring-2 ring-primary' : ''}`}>
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={product.image_url || ''}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="text-white font-semibold text-lg">Out of Stock</span>
            </div>
          )}
          {product.stock > 0 && product.stock < 5 && (
            <div className="absolute top-2 left-2 bg-destructive text-destructive-foreground px-2 py-1 rounded text-xs font-semibold">
              Only {product.stock} left
            </div>
          )}

        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors min-h-[3rem] text-orange-600">
            {product.name}
          </h3>
          
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center gap-1 bg-primary/10 px-2 py-1 rounded">
              <span className="text-sm font-semibold text-foreground">{rating}</span>
              <Star className="h-3 w-3 text-primary fill-primary" />
            </div>
            <span className="text-xs text-muted-foreground">
              ({reviewCount.toLocaleString()})
            </span>
          </div>

          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {product.description}
          </p>
          
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold text-orange-600">
              ₹{product.price.toFixed(2)}
            </p>
            {product.price < 100 && (
              <>
                <p className="text-sm text-muted-foreground line-through">
                  ₹{(product.price * 1.3).toFixed(2)}
                </p>
                <p className="text-sm font-semibold text-green-600">
                  23% off
                </p>
              </>
            )}
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex flex-col gap-2">
          {product.sizes && product.sizes.length > 0 && (
            <Select value={selectedSize} onValueChange={setSelectedSize}>
              <SelectTrigger className="h-10">
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
          )}
          <Button
            onClick={handleAddToCart}
            disabled={isAdding || product.stock === 0}
            className="w-full h-11 hover:scale-105 transition-transform duration-300"
            size="lg"
          >
            <ShoppingCart className="h-5 w-5 mr-2" />
            {product.stock === 0 ? 'Out of Stock' : isAdding ? 'Adding...' : 'Add to Cart'}
          </Button>
        </CardFooter>
      </Card>
      {onSelect ? (
        <Link to={`/product/${product.id}`} className="absolute inset-0 z-10" />
      ) : (
        <Link to={`/product/${product.id}`} className="block" />
      )}
    </div>
  );
};
