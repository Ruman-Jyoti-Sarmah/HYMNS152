import { useState, useEffect } from 'react';
import { useToast } from './use-toast';
import type { Product } from '@/types/types';

interface WishlistItem {
  id: string;
  product_id: string;
  created_at: string;
}

export const useWishlist = () => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const getWishlistFromStorage = (): WishlistItem[] => {
    try {
      const stored = localStorage.getItem('hymns_wishlist');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error reading wishlist from localStorage:', error);
      return [];
    }
  };

  const saveWishlistToStorage = (items: WishlistItem[]) => {
    try {
      localStorage.setItem('hymns_wishlist', JSON.stringify(items));
    } catch (error) {
      console.error('Error saving wishlist to localStorage:', error);
    }
  };

  const loadWishlist = () => {
    const items = getWishlistFromStorage();
    setWishlist(items);
  };

  const isInWishlist = (productId: string): boolean => {
    return wishlist.some(item => item.product_id === productId);
  };

  const addToWishlist = async (product: Product) => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const userId = localStorage.getItem('hymns_user_id') || crypto.randomUUID();
      
      // Try API first
      try {
        const response = await fetch('/api/wishlist', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: userId,
            product_id: product.id
          })
        });

        if (response.ok) {
          const newItem: WishlistItem = {
            id: crypto.randomUUID(),
            product_id: product.id,
            created_at: new Date().toISOString()
          };
          
          const updatedWishlist = [...wishlist, newItem];
          setWishlist(updatedWishlist);
          saveWishlistToStorage(updatedWishlist);
          
          toast({
            title: "Added to wishlist",
            description: `${product.name} has been added to your wishlist`
          });
          return;
        }
      } catch (apiError) {
        console.log('API wishlist failed, falling back to localStorage:', apiError);
      }

      // Fallback to localStorage
      const existingItems = getWishlistFromStorage();
      const alreadyExists = existingItems.some(item => item.product_id === product.id);
      
      if (!alreadyExists) {
        const newItem: WishlistItem = {
          id: crypto.randomUUID(),
          product_id: product.id,
          created_at: new Date().toISOString()
        };
        
        const updatedWishlist = [...existingItems, newItem];
        setWishlist(updatedWishlist);
        saveWishlistToStorage(updatedWishlist);
        
        toast({
          title: "Added to wishlist",
          description: `${product.name} has been added to your wishlist`
        });
      } else {
        toast({
          title: "Already in wishlist",
          description: `${product.name} is already in your wishlist`
        });
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      toast({
        title: "Error",
        description: "Failed to add item to wishlist",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromWishlist = async (productId: string, productName: string) => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const userId = localStorage.getItem('hymns_user_id') || crypto.randomUUID();
      
      // Try API first
      try {
        const response = await fetch(`/api/wishlist/${productId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ user_id: userId })
        });

        if (response.ok) {
          const updatedWishlist = wishlist.filter(item => item.product_id !== productId);
          setWishlist(updatedWishlist);
          saveWishlistToStorage(updatedWishlist);
          
          toast({
            title: "Removed from wishlist",
            description: `${productName} has been removed from your wishlist`
          });
          return;
        }
      } catch (apiError) {
        console.log('API wishlist remove failed, falling back to localStorage:', apiError);
      }

      // Fallback to localStorage
      const existingItems = getWishlistFromStorage();
      const updatedWishlist = existingItems.filter(item => item.product_id !== productId);
      
      setWishlist(updatedWishlist);
      saveWishlistToStorage(updatedWishlist);
      
      toast({
        title: "Removed from wishlist",
        description: `${productName} has been removed from your wishlist`
      });
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast({
        title: "Error",
        description: "Failed to remove item from wishlist",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleWishlist = async (product: Product) => {
    if (isInWishlist(product.id)) {
      await removeFromWishlist(product.id, product.name);
    } else {
      await addToWishlist(product);
    }
  };

  useEffect(() => {
    loadWishlist();
  }, []);

  return {
    wishlist,
    isLoading,
    isInWishlist,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    loadWishlist
  };
};
