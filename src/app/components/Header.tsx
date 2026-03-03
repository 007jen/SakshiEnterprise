import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/clerk-react";
import { Menu, X, Search, ShoppingBag, Briefcase, Heart, Gift, Shirt, Coffee, FolderOpen, Award, Leaf, User as UserIcon } from 'lucide-react';
import { Button } from './ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from './ui/navigation-menu';
import { useQuote } from '../context/QuoteContext';
import Logo from '../../assets/bgLogo.png';

interface Category {
  id: string;
  name: string;
  description?: string;
  icon?: string;
}

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { quoteCount } = useQuote();
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  const { user } = useUser();
  const adminEmailEnv = import.meta.env.VITE_ADMIN_EMAIL || '';
  const adminEmails = adminEmailEnv
    .split(',')
    .map(e => e.trim().toLowerCase())
    .filter(e => e.length > 0);

  const userEmail = user?.primaryEmailAddress?.emailAddress?.toLowerCase();
  const isAdmin = !!userEmail && adminEmails.includes(userEmail);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    const fetchCategories = async () => {
      try {
        const res = await fetch(`${apiBaseUrl}/api/categories`);
        if (res.status === 429) {
          toast.error("Rate limit exceeded. Please wait a moment.");
          return;
        }
        if (res.ok) {
          const data = await res.json();
          setCategories(data);
        }
      } catch (error) {
        console.error('Error fetching categories for header:', error);
      }
    };

    window.addEventListener('scroll', handleScroll);
    fetchCategories();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.length > 1) {
        setIsSearching(true);
        try {
          const res = await fetch(`${apiBaseUrl}/api/search?q=${searchQuery}`);
          if (res.ok) {
            const data = await res.json();
            setSearchResults(data);
          }
        } catch (error) {
          console.error('Search error:', error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const getCategoryIcon = (iconName?: string) => {
    if (!iconName) return <Gift size={20} />;
    switch (iconName) {
      case 'Briefcase': return <Briefcase size={20} />;
      case 'Heart': return <Heart size={20} />;
      case 'Gift': return <Gift size={20} />;
      case 'Shirt': return <Shirt size={20} />;
      case 'Coffee': return <Coffee size={20} />;
      case 'FolderOpen': return <FolderOpen size={20} />;
      case 'Award': return <Award size={20} />;
      case 'Leaf': return <Leaf size={20} />;
      default: return <Gift size={20} />;
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-[#1b4332] shadow-md' : 'bg-[#1b4332]'
        }`}
    >
      <div className="w-full px-4 sm:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16 lg:h-20">
          {/* Logo */}
          <Link to="/home" className="flex items-center space-x-1 sm:space-x-1 flex-shrink min-w-0">
            <img src={Logo} alt="Sakshi Enterprise" className="h-10 sm:h-16 lg:h-20 w-auto object-contain flex-shrink-0" />
            <div className="flex flex-col min-w-0 overflow-visible">
              <span className="text-xs sm:text-2xl lg:text-5xl font-bold text-white font-script whitespace-nowrap leading-tight">Sakshi Enterprise</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            <Link to="/home" className={`${navigationMenuTriggerStyle()} !bg-transparent !text-white hover:!text-white/80 !text-base`}>
              Home
            </Link>

            <Link to="/about" className={`${navigationMenuTriggerStyle()} !bg-transparent !text-white hover:!text-white/80 !text-base`}>
              About
            </Link>

            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="!bg-transparent !text-white hover:!text-white/80 focus:!text-white/80 data-[active]:!text-white/80 data-[state=open]:!text-white/80 !text-base">Products</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      {categories.map((category) => (
                        <li key={category.id}>
                          <NavigationMenuLink asChild>
                            <Link
                              to={`/categories/${category.id}`}
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            >
                              <div className="flex items-center gap-2 text-sm font-medium leading-none mb-2">
                                {getCategoryIcon(category.icon)}
                                {category.name}
                              </div>
                              {category.description && (
                                <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                  {category.description}
                                </p>
                              )}
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            <Link to="/contact" className={`${navigationMenuTriggerStyle()} !bg-transparent !text-white hover:!text-white/80 !text-base`}>
              Contact
            </Link>

            {isAdmin && (
              <Link to="/admin" className={`${navigationMenuTriggerStyle()} !bg-transparent !text-white hover:!text-white/80 !text-base`}>
                Admin
              </Link>
            )}
          </div>

          <div className="hidden lg:flex items-center space-x-6">
            <div className="relative group/search">
              <div className="flex items-center bg-white/10 border border-white/20 rounded-full px-3 py-1.5 focus-within:border-white/50 transition-all">
                <Search size={18} className="text-white mr-2" />
                <input
                  type="text"
                  placeholder="Search products..."
                  className="bg-transparent border-none outline-none text-sm text-white placeholder:text-white/50 w-40 focus:w-64 transition-all duration-300"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Search Results Dropdown */}
              {searchQuery.length > 1 && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-primary/20 rounded-lg shadow-2xl overflow-hidden z-[60]">
                  {(() => {
                    if (isSearching) {
                      return <div className="p-4 text-center text-sm text-accent">Searching...</div>;
                    }
                    if (searchResults.length > 0) {
                      return (
                        <div className="max-h-96 overflow-y-auto">
                          {searchResults.map((item) => (
                            <Link
                              key={item.id}
                              to={`/products/${item.id}`}
                              className="flex items-center gap-3 p-3 hover:bg-accent/10 transition-colors border-b border-accent/5"
                              onClick={() => setSearchQuery('')}
                            >
                              <div className="w-10 h-10 bg-muted rounded overflow-hidden flex-shrink-0">
                                <img
                                  src={item.image?.startsWith('/uploads') ? `${apiBaseUrl}${item.image}` : item.image || 'https://placehold.co/100x100?text=No+Image'}
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                                <p className="text-xs text-primary/70 truncate">{item.category?.name}</p>
                              </div>
                              <p className="text-xs font-bold text-primary">₹{item.price}</p>
                            </Link>
                          ))}
                        </div>
                      );
                    }
                    return <div className="p-4 text-center text-sm text-accent/50">No products found</div>;
                  })()}
                </div>
              )}
            </div>

            <SignedIn>
              <Link to="/quote" className="text-white hover:text-white/80 transition-colors relative">
                <ShoppingBag size={22} />
                {quoteCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                    {quoteCount}
                  </span>
                )}
              </Link>
              <Link to="/quote">
                <Button className="bg-white hover:bg-white/90 text-[#1b4332] font-semibold">
                  Cart
                </Button>
              </Link>
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal" forceRedirectUrl="/quote">
                <button className="text-white hover:text-white/80 transition-colors relative">
                  <ShoppingBag size={22} />
                  {quoteCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                      {quoteCount}
                    </span>
                  )}
                </button>
              </SignInButton>
              <SignInButton mode="modal" forceRedirectUrl="/quote">
                <Button className="bg-white hover:bg-white/90 text-[#1b4332] font-semibold cursor-pointer">
                  Cart
                </Button>
              </SignInButton>
            </SignedOut>

            <SignedOut>
              <SignInButton mode="modal">
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-[#1b4332]">
                  Login
                </Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton appearance={{
                elements: {
                  userButtonAvatarBox: "w-10 h-10"
                }
              }} />
            </SignedIn>
          </div>

          {/* Mobile Actions & Menu (Visible on small screens) */}
          <div className="flex lg:hidden items-center space-x-4">
            <SignedIn>
              <Link to="/quote" className="text-white hover:text-white/80 transition-colors relative">
                <ShoppingBag size={24} />
                {quoteCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-primary text-white text-[10px] w-4.5 h-4.5 flex items-center justify-center rounded-full font-bold">
                    {quoteCount}
                  </span>
                )}
              </Link>
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal" forceRedirectUrl="/quote">
                <button className="text-white hover:text-white/80 transition-colors relative">
                  <ShoppingBag size={24} />
                  {quoteCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-primary text-white text-[10px] w-4.5 h-4.5 flex items-center justify-center rounded-full font-bold">
                      {quoteCount}
                    </span>
                  )}
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton appearance={{
                elements: {
                  userButtonAvatarBox: "w-8 h-8"
                }
              }} />
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <button className="text-white hover:text-white/80 transition-colors flex items-center justify-center">
                  <UserIcon size={24} />
                </button>
              </SignInButton>
            </SignedOut>
            <button
              className="text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-border h-[calc(100vh-56px)] sm:h-[calc(100vh-64px)] overflow-y-auto">
            <nav className="flex flex-col space-y-4 pb-20 px-4">
              {/* Mobile Search Bar */}
              <div className="relative mt-2 mb-4">
                <div className="flex items-center bg-primary/10 border border-primary/20 rounded-lg px-3 py-2 focus-within:border-primary/50 transition-all">
                  <Search size={18} className="text-primary mr-2" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="bg-transparent border-none outline-none text-sm text-foreground placeholder:text-primary/50 w-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                {/* Mobile Search Results */}
                {searchQuery.length > 1 && searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-primary/20 rounded-md shadow-xl z-50 max-h-60 overflow-y-auto">
                    {searchResults.map((item) => (
                      <Link
                        key={item.id}
                        to={`/products/${item.id}`}
                        className="flex items-center gap-3 p-3 hover:bg-accent/10 border-b border-accent/5"
                        onClick={() => {
                          setSearchQuery('');
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        <div className="w-8 h-8 bg-muted rounded overflow-hidden flex-shrink-0">
                          <img
                            src={item.image?.startsWith('/uploads') ? `${apiBaseUrl}${item.image}` : item.image || 'https://placehold.co/100x100?text=No+Image'}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-foreground truncate">{item.name}</p>
                        </div>
                        <p className="text-[10px] font-bold text-primary">₹{item.price}</p>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              <Link
                to="/home"
                className="text-primary hover:text-primary/80 transition-colors py-2 font-medium text-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/about"
                className="text-primary hover:text-primary/80 transition-colors py-2 font-medium text-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Link>

              <div className="py-2">
                <span className="text-primary font-semibold block mb-2 text-lg">Products</span>
                <div className="pl-4 border-l-2 border-muted space-y-3">
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      to={`/categories/${category.id}`}
                      className="block text-primary hover:text-primary/80 transition-colors text-lg"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>

              <Link
                to="/contact"
                className="text-primary hover:text-primary/80 transition-colors py-2 font-medium text-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </Link>

              {isAdmin && (
                <Link
                  to="/admin"
                  className="text-red-500 hover:text-red-400 transition-colors py-2 font-bold text-lg border-t border-red-500/10"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Admin Panel
                </Link>
              )}

              <div className="pt-4 border-t border-muted">
                <Link to="/quote" className="flex items-center space-x-2 text-primary py-2" onClick={() => setIsMobileMenuOpen(false)}>
                  <ShoppingBag size={20} />
                  <span>Cart ({quoteCount})</span>
                </Link>
              </div>

              <Link to="/quote" onClick={() => setIsMobileMenuOpen(false)}>
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
                  Cart
                </Button>
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
