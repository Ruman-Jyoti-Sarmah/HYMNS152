import React, { useEffect, useState } from 'react';
import { ProductCard } from '@/components/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { productsApi, cartApi, getUserId } from '@/db/api';
import { Search, SlidersHorizontal, X, ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react';
import type { Product, CartItemWithProduct } from '@/types/types';

const Store: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [sortBy, setSortBy] = useState('featured');
  const [showFilters, setShowFilters] = useState(true);
  const [cartItems, setCartItems] = useState<CartItemWithProduct[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadProducts();
    loadCart();
  }, []);

  useEffect(() => {
    filterAndSortProducts();
  }, [products, searchQuery, selectedCategory, priceRange, sortBy]);

  const loadCart = async () => {
    try {
      const data = await cartApi.getCartItems(getUserId());
      setCartItems(data);
    } catch (error) {
      console.error('Failed to load cart:', error);
    }
  };

  const updateCartQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    try {
      await cartApi.updateQuantity(itemId, newQuantity);
      await loadCart();
      toast({
        title: "Cart updated",
        description: "Quantity has been updated"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update quantity",
        variant: "destructive"
      });
    }
  };

  const removeFromCart = async (itemId: string) => {
    try {
      await cartApi.removeFromCart(itemId);
      await loadCart();
      toast({
        title: "Item removed",
        description: "Item has been removed from your cart"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove item",
        variant: "destructive"
      });
    }
  };

  const clearCart = async () => {
    try {
      await cartApi.clearCart(getUserId());
      await loadCart();
      toast({
        title: "Cart cleared",
        description: "All items have been removed from your cart"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to clear cart",
        variant: "destructive"
      });
    }
  };

  const handleAddToCart = async (productId: string, quantity: number = 1, size?: string) => {
    try {
      await cartApi.addToCart(getUserId(), productId, quantity, size);
      await loadCart();
      toast({
        title: "Added to cart",
        description: "Item has been added to your cart"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive"
      });
    }
  };

  const placeOrder = () => {
    toast({
      title: "Order placed successfully",
      description: `Your order of ${cartItems.length} items has been placed. Total: ₹${cartItems.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0).toFixed(2)}`
    });
    clearCart();
  };

  const loadProducts = async () => {
    try {
      const data = await productsApi.getAll();
      setProducts(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load products",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterAndSortProducts = () => {
    let filtered = [...products];

    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    filtered = filtered.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    setFilteredProducts(filtered);
  };

  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setPriceRange([0, 200]);
    setSortBy('featured');
  };

  return (
    <div className="min-h-screen py-6 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 animate-fadeInDown">
          <h1 className="text-3xl xl:text-5xl font-bold text-black mb-2">
            HYMNS Store
          </h1>
          <p className="text-black">
            Shop exclusive HYMNS merchandise
          </p>
        </div>

        <div className="mb-6 flex flex-col xl:flex-row gap-4 animate-fadeInUp">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search for products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12"
            />
          </div>
          <div className="flex gap-2">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px] h-12">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="name">Name: A to Z</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="lg"
              className="xl:hidden"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="flex flex-col xl:flex-row gap-6">
          {(showFilters || window.innerWidth >= 1280) && (
            <aside className="w-full xl:w-64 flex-shrink-0 animate-fadeInLeft">
              <Card className="sticky top-4">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-foreground">Filters</h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="text-xs"
                    >
                      Clear All
                    </Button>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-semibold text-foreground mb-3">Category</h3>
                      <div className="space-y-2">
                        {categories.map((category) => (
                          <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                              selectedCategory === category
                                ? 'bg-primary text-primary-foreground'
                                : 'hover:bg-muted text-foreground'
                            }`}
                          >
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-foreground mb-3">Price Range</h3>
                      <div className="space-y-4">
                        <Slider
                          value={priceRange}
                          onValueChange={setPriceRange}
                          max={200}
                          min={0}
                          step={10}
                          className="w-full"
                        />
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>₹{priceRange[0]}</span>
                          <span>₹{priceRange[1]}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border">
                      <div className="text-sm text-muted-foreground">
                        Showing {filteredProducts.length} of {products.length} products
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </aside>
          )}

          <main className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="aspect-square w-full bg-muted" />
                    <Skeleton className="h-4 w-3/4 bg-muted" />
                    <Skeleton className="h-4 w-1/2 bg-muted" />
                  </div>
                ))}
              </div>
            ) : (
              <>
                {filteredProducts.length === 0 ? (
                  <div className="text-center py-20 animate-fadeInUp">
                    <div className="mb-4">
                      <X className="h-16 w-16 text-muted-foreground mx-auto" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      No products found
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Try adjusting your filters or search query
                    </p>
                    <Button onClick={clearFilters}>Clear Filters</Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredProducts.map((product, index) => (
                      <div
                        key={product.id}
                        className={`animate-fadeInUp animation-delay-${(index % 6) * 100}`}
                      >
                        <ProductCard
                          product={product}
                          onAddToCart={loadProducts}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </main>
        </div>


        {!isLoading && filteredProducts.length > 0 && (
          <div className="mt-16 p-8 xl:p-12 bg-card rounded-lg border border-border animate-fadeInUp animation-delay-600">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl xl:text-4xl font-bold text-foreground mb-4">
                Quality Guaranteed
              </h2>
              <p className="text-muted-foreground mb-6">
                All HYMNS merchandise is made with premium materials and designed for comfort and style. We stand behind every product we sell.
              </p>
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">100%</div>
                  <div className="text-sm text-muted-foreground">Premium Quality</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">Fast</div>
                  <div className="text-sm text-muted-foreground">Shipping</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">30 Days</div>
                  <div className="text-sm text-muted-foreground">Return Policy</div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Store;
