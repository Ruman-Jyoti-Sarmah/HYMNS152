import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ShoppingCart, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  console.log('Header: Rendering Header component, current path:', location.pathname);

  // Navigation items for the main app (Dashboard)
  const navigation = [
    { path: '/dashboard', name: 'Dashboard' },
    { path: '/store', name: 'Store' },
    { path: '/orders', name: 'Orders' },
    { path: '/music', name: 'Music' },
    { path: '/studio', name: 'Studio' },
    { path: '/pricing', name: 'Pricing' },
    { path: '/about', name: 'About' },
    { path: '/contact', name: 'Contact' }
  ];

  return (
    <header className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 xl:px-8">
        <div className="flex justify-between items-center h-16 xl:h-20">
          <Link to="/" className="flex items-center gap-2 xl:gap-3">
            <div className="w-10 h-10 xl:w-12 xl:h-12 rounded-full overflow-hidden bg-gradient-to-br from-primary to-primary/80 shadow-lg hover:scale-110 transition-transform duration-300">
              <img 
                src="/images/hymns-logo.jpg" 
                alt="HYMNS Logo" 
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-2xl xl:text-3xl font-bold tracking-tight text-foreground">
              HYMNS
            </span>
          </Link>

          <div className="hidden xl:flex items-center gap-1">
            <Link to="/">
              <Button
                variant={location.pathname === '/' ? "secondary" : "ghost"}
                className="text-sm font-medium"
              >
                Home
              </Button>
            </Link>
            {navigation.map((item) => (
              <Link
                key={item.path}
                to={item.path}
              >
                <Button
                  variant={location.pathname === item.path ? "secondary" : "ghost"}
                  className="text-sm font-medium"
                >
                  {item.name}
                </Button>
              </Link>
            ))}
            <Link to="/wishlist">
              <Button variant="ghost" size="icon" className="ml-2">
                <Heart className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="ml-2">
                <ShoppingCart className="h-5 w-5" />
              </Button>
            </Link>
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="xl:hidden p-2 text-foreground"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="xl:hidden py-4 space-y-2 border-t border-border">
            <Link
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className={`block px-4 py-2 rounded-md text-sm font-medium ${
                location.pathname === '/'
                  ? "bg-secondary text-secondary-foreground"
                  : "text-foreground hover:bg-accent"
              }`}
            >
              Home
            </Link>
            {navigation.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-4 py-2 rounded-md text-sm font-medium ${
                  location.pathname === item.path
                    ? "bg-secondary text-secondary-foreground"
                    : "text-foreground hover:bg-accent"
                }`}
              >
                {item.name}
              </Link>
            ))}
            <Link
              to="/wishlist"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-foreground hover:bg-accent"
            >
              <Heart className="h-4 w-4" />
              Wishlist
            </Link>
            <Link
              to="/cart"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-foreground hover:bg-accent"
            >
              <ShoppingCart className="h-4 w-4" />
              Cart
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
