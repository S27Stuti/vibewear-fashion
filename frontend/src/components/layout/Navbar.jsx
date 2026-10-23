import React, { useState, useEffect, useRef } from 'react';
import {
  ShoppingBag,
  Heart,
  User,
  Search,
  Menu,
  X,
  Sparkles,
  Sun,
  Moon,
  ChevronDown,
  LogOut,
  Package,
  ShieldCheck,
  Truck,
  Bike,
  ArrowRight,
  Flame,
  Headphones,
  Check
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const Navbar = ({
  products = [],
  onSelectProduct,
  currentCategory,
  onSelectCategory,
  searchTerm,
  onSearchChange,
  onSearchSubmit,
  onOpenAI,
  onNavigateHome,
  onNavigateProducts,
  onNavigateCustomer,
  onNavigateTrack,
  onNavigateDelivery,
  onNavigateAdmin,
  onOpenSupport,
  activePage = 'home'
}) => {
  const { totalCount, openCart } = useCart();
  const { wishlistCount, openWishlist } = useWishlist();
  const { user, isAuthenticated, isAdmin, isDeliveryPartner, logout, openAuthModal, openProfile, userOrders } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [promoCopied, setPromoCopied] = useState(false);

  const hasOutForDelivery = userOrders?.some((o) => o.orderStatus === 'Out for Delivery');

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchDropdownOpen, setSearchDropdownOpen] = useState(false);

  const searchInputRef = useRef(null);
  const searchContainerRef = useRef(null);

  const TRENDING_TAGS = [
    'Cyberpunk Hoodie',
    'Oversized Tees',
    'Cargo Pants',
    'Varsity Jacket',
    'Denim'
  ];

  // Filter live matching products for the dropdown
  const filteredSuggestions = searchTerm.trim()
    ? (products || [])
        .filter((p) =>
          p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.category?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .slice(0, 4)
    : [];

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setSearchDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Global keyboard shortcut: Ctrl+K or Cmd+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
        setSearchDropdownOpen(true);
      }
      if (e.key === 'Escape') {
        setSearchDropdownOpen(false);
        searchInputRef.current?.blur();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleTrendingClick = (tag) => {
    onSearchChange(tag);
    setSearchDropdownOpen(false);
    if (onNavigateProducts) onNavigateProducts();
  };

  const handleProductSuggestionClick = (prod) => {
    setSearchDropdownOpen(false);
    if (onSelectProduct) {
      onSelectProduct(prod);
    } else {
      onSearchChange(prod.title);
      if (onSearchSubmit) onSearchSubmit();
    }
  };

  const navLinks = [
    { label: 'All', value: 'All' },
    { label: 'Men', value: 'Men' },
    { label: 'Women', value: 'Women' },
    { label: 'Kids', value: 'Kids' }
  ];

  const handleNavClick = (cat) => {
    onSelectCategory(cat);
    setMobileMenuOpen(false);
    if (onNavigateProducts) onNavigateProducts();
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-purple-200 dark:border-purple-900/40 bg-white/95 dark:bg-[#06060B]/95 text-slate-900 dark:text-white backdrop-blur-2xl shadow-xs dark:shadow-xl dark:shadow-purple-950/20 transition-colors duration-200">
      {/* Top Utility Announcement Bar */}
      <div className="keep-white bg-gradient-to-r from-[#2E1065] via-[#831843] to-[#2E1065] dark:from-black dark:via-[#160B24] dark:to-black text-white text-[11px] py-1 sm:py-1.5 px-3 sm:px-6 lg:px-8 border-b border-purple-300/30 dark:border-purple-500/20 shadow-xs">
        <div className="max-w-[1440px] mx-auto flex items-center justify-center sm:justify-between gap-3">
          {/* Left Promo Offer */}
          <button
            type="button"
            onClick={() => {
              navigator.clipboard?.writeText('VIBE2026');
              setPromoCopied(true);
              setTimeout(() => setPromoCopied(false), 2000);
            }}
            className="flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2 group text-center sm:text-left cursor-pointer focus:outline-none py-0.5 transition-colors max-w-full"
            title="Click to copy coupon code VIBE2026"
          >
            <Sparkles className="w-3.5 h-3.5 text-pink-300 animate-spin-slow shrink-0" />
            <span className="font-medium tracking-wide text-white !text-white text-[10px] sm:text-[11px] truncate">
              <span className="hidden sm:inline">FREE EXPRESS DELIVERY OVER ₹799 • </span>
              <span>CODE: </span>
              <strong className="text-pink-300 group-hover:text-white font-black tracking-wider underline underline-offset-2">
                VIBE2026
              </strong>
            </span>
            {promoCopied ? (
              <span className="px-1.5 py-0.2 rounded-md bg-emerald-500 text-white text-[9px] font-black uppercase tracking-wider animate-scale-up shrink-0">
                COPIED! ✓
              </span>
            ) : (
              <span className="hidden xl:inline-block text-[9px] text-pink-200 group-hover:text-white transition-colors shrink-0">
                (Click to copy)
              </span>
            )}
          </button>

          {/* Right Utility Links (Customer Portal, Driver Hub, Admin Console, Track Orders & 24/7 Support) */}
          <div className="hidden sm:flex items-center gap-2 lg:gap-3 text-xs font-semibold text-white/95">
            {/* Customer Portal */}
            <button
              type="button"
              onClick={onNavigateCustomer}
              className={`transition-all flex items-center gap-1.5 cursor-pointer font-bold px-2.5 py-1 rounded-full text-xs ${
                activePage === 'customer'
                  ? 'bg-pink-500 text-white shadow-xs'
                  : 'text-white hover:text-pink-300 hover:bg-white/10'
              }`}
              title="Customer Account & Order Management"
            >
              <User className="w-3.5 h-3.5 text-pink-300" />
              <span>Customer</span>
            </button>

            {/* Rider / Driver Hub (Only visible if Driver logged in) */}
            {isDeliveryPartner && (
              <button
                type="button"
                onClick={onNavigateDelivery}
                className={`transition-all flex items-center gap-1.5 cursor-pointer font-bold px-2.5 py-1 rounded-full text-xs ${
                  activePage === 'delivery'
                    ? 'bg-pink-500 text-white shadow-xs'
                    : 'text-white hover:text-pink-300 hover:bg-white/10'
                }`}
                title="Delivery Driver / Rider Dashboard"
              >
                <Bike className="w-3.5 h-3.5 text-pink-300" />
                <span>Driver</span>
              </button>
            )}

            {/* Admin Console (Only visible if Admin logged in) */}
            {isAdmin && (
              <button
                type="button"
                onClick={onNavigateAdmin}
                className={`transition-all flex items-center gap-1.5 cursor-pointer font-bold px-2.5 py-1 rounded-full text-xs ${
                  activePage === 'admin'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'text-white hover:text-amber-300 hover:bg-white/10'
                }`}
                title="Operations Admin Console"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
                <span>Admin</span>
              </button>
            )}

            {/* Track Orders */}
            <button
              type="button"
              onClick={onNavigateTrack}
              className={`transition-all flex items-center gap-1.5 cursor-pointer font-bold px-2.5 py-1 rounded-full text-xs ${
                activePage === 'track'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-white hover:text-pink-300 hover:bg-white/10'
              }`}
              title="Track live order status"
            >
              <Truck className="w-3.5 h-3.5 text-pink-300" />
              <span>Track</span>
              {hasOutForDelivery && (
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500" />
                </span>
              )}
            </button>

            <span className="text-purple-300/40">|</span>

            {/* 24/7 SUPPORT INTERACTIVE BUTTON */}
            <button
              type="button"
              onClick={onOpenSupport}
              className="text-pink-300 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer font-bold group"
              title="Open 24/7 Support, Toll-Free Helpline & Live Chat"
            >
              <Headphones className="w-3.5 h-3.5 text-pink-300 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] tracking-wider font-mono text-white !text-white">24/7 SUPPORT</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Header Row */}
      <div className="max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4 lg:gap-6">
          {/* Logo */}
          <div
            onClick={onNavigateHome}
            className="flex items-center gap-2 sm:gap-2.5 cursor-pointer select-none group shrink-0"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-purple-700 via-pink-600 to-purple-600 flex items-center justify-center shadow-lg shadow-pink-500/25 group-hover:scale-105 group-hover:shadow-pink-500/40 transition-all">
              <span className="font-display font-black text-base sm:text-xl text-white">V</span>
            </div>
            <div className="flex flex-col">
              <span className="font-display font-black text-xl sm:text-2xl tracking-tight text-slate-950 dark:text-white group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors leading-none">
                VIBE<span className="text-pink-600 dark:text-pink-500">WEAR</span>
              </span>
              <span className="text-[8px] sm:text-[9px] tracking-widest uppercase text-pink-600/90 dark:text-pink-400/80 font-bold mt-0.5 sm:mt-1">
                Aesthetic Apparel
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links - Modern Fashion Minimalist Typography */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 shrink-0">
            {navLinks.map((link) => {
              const isActive = currentCategory === link.value;
              return (
                <button
                  key={link.value}
                  onClick={() => handleNavClick(link.value)}
                  className={`text-xs font-bold uppercase tracking-widest transition-all relative py-1 cursor-pointer ${
                    isActive
                      ? 'text-pink-600 dark:text-pink-400 font-black'
                      : 'text-slate-700 hover:text-pink-600 dark:text-slate-300 dark:hover:text-pink-400'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 shadow-sm shadow-pink-500/50 animate-fade-in" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Refined Capsule Search Bar */}
          <div
            ref={searchContainerRef}
            className="hidden md:flex items-center relative flex-1 max-w-xs lg:max-w-sm xl:max-w-md transition-all duration-200"
          >
            <form
              onSubmit={(e) => {
                if (onSearchSubmit) onSearchSubmit(e);
                setSearchDropdownOpen(false);
              }}
              className="flex items-center w-full h-10 px-4 rounded-full bg-slate-100 hover:bg-slate-200/80 dark:bg-[#100A1C]/90 dark:hover:bg-[#150E26] border border-purple-200 hover:border-pink-400 dark:border-purple-500/35 dark:hover:border-pink-500/60 focus-within:border-pink-500 focus-within:bg-white dark:focus-within:bg-[#100A1C] focus-within:ring-2 focus-within:ring-pink-500/25 transition-all group"
            >
              <Search className="w-4 h-4 text-pink-600 dark:text-pink-400 group-focus-within:scale-110 transition-transform shrink-0 mr-2.5" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  onSearchChange(e.target.value);
                  setSearchDropdownOpen(true);
                }}
                onFocus={() => setSearchDropdownOpen(true)}
                placeholder="Search styles, hoodies, streetwear..."
                className="w-full bg-transparent text-xs font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-purple-300/40 focus:outline-none"
              />

              {/* Right Accessory in Search Bar */}
              <div className="flex items-center gap-1 shrink-0 ml-1">
                {searchTerm ? (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        onSearchChange('');
                        searchInputRef.current?.focus();
                      }}
                      className="p-1 rounded-md text-slate-400 hover:text-white transition-colors cursor-pointer"
                      title="Clear Search"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="submit"
                      className="p-1 rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white shadow-xs hover:scale-105 active:scale-95 transition-all cursor-pointer"
                      title="Search"
                    >
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </>
                ) : (
                  <kbd className="hidden xl:inline-flex items-center text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-purple-100 dark:bg-black/60 text-purple-900 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30 shadow-xs pointer-events-none">
                    ⌘K
                  </kbd>
                )}
              </div>
            </form>

            {/* Instant Search / Trending Dropdown */}
            {searchDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 z-50 rounded-2xl bg-white/95 dark:bg-[#0E0E1A]/95 border border-purple-200 dark:border-white/10 shadow-2xl backdrop-blur-2xl p-3 animate-slide-up text-slate-900 dark:text-white min-w-[300px]">
                {filteredSuggestions.length > 0 ? (
                  <div>
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-purple-100 dark:border-white/10 text-[11px] font-bold text-slate-500 dark:text-white/50">
                      <span>Matching Styles ({filteredSuggestions.length})</span>
                      <span className="text-[10px] text-pink-500 font-semibold">Instant Results</span>
                    </div>
                    <div className="space-y-1.5">
                      {filteredSuggestions.map((prod) => (
                        <div
                          key={prod.id || prod._id}
                          onClick={() => handleProductSuggestionClick(prod)}
                          className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-purple-50 dark:hover:bg-white/10 cursor-pointer transition-colors group"
                        >
                          <img
                            src={prod.image || prod.colorImages?.black || 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=100'}
                            alt={prod.title}
                            className="w-10 h-12 object-cover rounded-lg bg-slate-100 dark:bg-slate-800 shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">
                              {prod.title}
                            </p>
                            <div className="flex items-center gap-2 text-[10px]">
                              <span className="text-pink-600 dark:text-pink-400 font-extrabold">₹{prod.price}</span>
                              <span className="text-slate-400 dark:text-white/40">• {prod.category || 'Apparel'}</span>
                            </div>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-pink-500 group-hover:translate-x-0.5 transition-all shrink-0" />
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        if (onSearchSubmit) onSearchSubmit(e);
                        setSearchDropdownOpen(false);
                      }}
                      className="w-full mt-2.5 pt-2 border-t border-purple-100 dark:border-white/10 text-center text-xs font-bold text-pink-600 dark:text-pink-400 hover:underline flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span>View all results for "{searchTerm}" &rarr;</span>
                    </button>
                  </div>
                ) : searchTerm.trim() ? (
                  <div className="p-3 text-center">
                    <p className="text-xs font-semibold text-slate-500 dark:text-white/60">
                      No direct match found for "{searchTerm}"
                    </p>
                    <button
                      type="button"
                      onClick={(e) => {
                        if (onSearchSubmit) onSearchSubmit(e);
                        setSearchDropdownOpen(false);
                      }}
                      className="mt-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-brand-600 to-pink-600 text-white font-bold text-xs cursor-pointer shadow-xs"
                    >
                      Search Full Catalog
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center gap-1.5 pb-2 mb-2 border-b border-purple-100 dark:border-white/10 text-[11px] font-bold text-slate-500 dark:text-white/50">
                      <Flame className="w-3.5 h-3.5 text-pink-500" />
                      <span>Trending Searches</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {TRENDING_TAGS.map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => handleTrendingClick(tag)}
                          className="px-2.5 py-1 rounded-full text-xs font-medium bg-purple-50 hover:bg-pink-100 dark:bg-white/5 dark:hover:bg-pink-950/40 border border-purple-200 dark:border-white/10 text-slate-700 dark:text-white/80 hover:text-pink-600 dark:hover:text-pink-300 transition-colors cursor-pointer"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Action Icons: VibeAI, Theme, Wishlist, Cart & Profile */}
          <div className="flex items-center gap-1 sm:gap-2 lg:gap-2.5 shrink-0">
            {/* Mobile Search Button (< md) */}
            <button
              type="button"
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className="md:hidden w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-purple-50 hover:bg-purple-100 dark:bg-[#120B20] dark:hover:bg-[#1A102E] border border-purple-200 dark:border-purple-500/30 hover:border-pink-500 text-pink-600 dark:text-pink-400 flex items-center justify-center transition-all cursor-pointer shadow-xs"
              title="Search Styles"
              aria-label="Open Mobile Search"
            >
              <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-pink-600 dark:text-pink-400" />
            </button>

            {/* VibeAI Stylist Pill (Hidden on mobile, mobile uses floating button) */}
            <button
              type="button"
              onClick={onOpenAI}
              className="hidden sm:flex relative h-10 px-3.5 rounded-full bg-gradient-to-r from-purple-700 via-pink-600 to-purple-700 hover:from-purple-600 hover:to-pink-500 border border-pink-400/50 transition-all duration-200 items-center gap-1.5 cursor-pointer group active:scale-95 shadow-md shadow-pink-500/25 btn-solid-cta"
              title="VibeAI Fashion Assistant"
            >
              <Sparkles className="w-3.5 h-3.5 text-white group-hover:rotate-12 transition-transform" />
              <span className="hidden sm:inline-block text-xs font-black tracking-wide text-white">
                Vibe<span className="text-pink-200 font-black">AI</span>
              </span>
              <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black uppercase tracking-wider bg-white/20 text-white shadow-xs">
                AI
              </span>
            </button>

            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center bg-purple-50 hover:bg-purple-100 dark:bg-[#120B20] dark:hover:bg-[#1A102E] border border-purple-200 dark:border-purple-500/30 hover:border-pink-500 text-purple-700 dark:text-pink-400 transition-all cursor-pointer group shadow-xs"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle Dark and Light Mode"
            >
              {theme === 'dark' ? (
                <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300 group-hover:rotate-45 transition-transform" />
              ) : (
                <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-700 group-hover:-rotate-12 transition-transform" />
              )}
            </button>

            {/* Wishlist Button (Tablet & Desktop) */}
            <button
              type="button"
              onClick={openWishlist}
              className="hidden sm:flex relative w-10 h-10 rounded-full items-center justify-center bg-purple-50 hover:bg-purple-100 dark:bg-[#120B20] dark:hover:bg-[#1A102E] border border-purple-200 dark:border-purple-500/30 hover:border-pink-500 text-slate-700 dark:text-slate-200 hover:text-pink-600 dark:hover:text-pink-400 transition-all cursor-pointer shadow-xs"
              aria-label="Wishlist"
              title="Saved Styles"
            >
              <Heart className={`w-4 h-4 ${wishlistCount > 0 ? 'fill-pink-500 text-pink-500' : ''}`} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Direct My Orders Button (Desktop only, mobile has bottom bar) */}
            <button
              type="button"
              onClick={() => {
                if (onNavigateCustomer) {
                  onNavigateCustomer();
                } else {
                  openProfile('orders');
                }
              }}
              className="hidden lg:flex relative h-10 px-3.5 rounded-full items-center gap-1.5 sm:gap-2 bg-purple-50 hover:bg-purple-100 dark:bg-[#120B20] dark:hover:bg-[#1A102E] border border-purple-200 dark:border-purple-500/30 hover:border-pink-500 text-slate-800 dark:text-white transition-all cursor-pointer shadow-xs text-xs font-bold shrink-0"
              aria-label="View My Orders"
              title="View all your placed orders"
            >
              <Package className="w-4 h-4 text-pink-600 dark:text-pink-400" />
              <span className="hidden lg:inline-block">My Orders</span>
              {userOrders && userOrders.length > 0 && (
                <span className="bg-gradient-to-r from-pink-500 to-purple-600 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full shadow-xs">
                  {userOrders.length}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              type="button"
              onClick={openCart}
              className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center bg-purple-50 hover:bg-purple-100 dark:bg-[#120B20] dark:hover:bg-[#1A102E] border border-purple-200 dark:border-purple-500/30 hover:border-pink-500 text-slate-700 dark:text-slate-200 hover:text-pink-600 dark:hover:text-pink-400 transition-all cursor-pointer shadow-xs"
              aria-label="Open cart"
              title="Shopping Bag"
            >
              <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              {totalCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-brand-600 to-pink-600 text-white text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  {totalCount}
                </span>
              )}
            </button>

            {/* User Account / Profile */}
            {isAuthenticated ? (
              <div className="relative shrink-0">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="h-8 sm:h-10 flex items-center gap-1 sm:gap-2 px-1.5 sm:px-2.5 rounded-full bg-purple-50 hover:bg-purple-100 dark:bg-[#120B20] dark:hover:bg-[#1A102E] border border-purple-200 dark:border-purple-500/30 hover:border-pink-500 transition-all text-xs font-bold text-slate-900 dark:text-white cursor-pointer shadow-xs"
                >
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-tr from-brand-600 to-pink-600 flex items-center justify-center text-white text-[11px] sm:text-xs font-black uppercase shadow-xs">
                    {user.name ? user.name[0] : 'U'}
                  </div>
                  <span className="hidden sm:inline-block max-w-[80px] truncate text-slate-900 dark:text-white font-bold">
                    {user.name?.split(' ')[0] || user.name}
                  </span>
                  <ChevronDown className="w-3 h-3 text-pink-500" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div
                    onMouseLeave={() => setUserDropdownOpen(false)}
                    className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-[#0B0716] border border-purple-200 dark:border-purple-500/40 shadow-2xl p-2 z-50 text-xs text-slate-900 dark:text-white animate-slide-up"
                  >
                    <div className="px-3 py-2.5 border-b border-purple-100 dark:border-purple-500/20 mb-1">
                      <p className="font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
                      <p className="text-[11px] text-slate-500 dark:text-purple-300/60 truncate">{user.email}</p>
                      <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-pink-300 border border-purple-200 dark:border-purple-500/30">
                        <ShieldCheck className="w-3 h-3 text-pink-500" />
                        {user.role || 'Customer'}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        openProfile();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-950/50 text-slate-700 hover:text-slate-950 dark:text-white/80 dark:hover:text-white transition-colors text-left cursor-pointer font-medium"
                    >
                      <User className="w-4 h-4 text-pink-500" />
                      <span>My Profile</span>
                    </button>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        if (onNavigateCustomer) onNavigateCustomer();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-950/50 text-slate-700 hover:text-slate-950 dark:text-white/80 dark:hover:text-white transition-colors text-left cursor-pointer font-medium"
                    >
                      <User className="w-4 h-4 text-pink-500" />
                      <span>Customer Portal</span>
                    </button>

                    {isDeliveryPartner && (
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          if (onNavigateDelivery) onNavigateDelivery();
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-pink-50 dark:bg-pink-500/10 hover:bg-pink-100 dark:hover:bg-pink-500/20 text-pink-700 dark:text-pink-300 font-bold transition-colors text-left cursor-pointer border border-pink-200 dark:border-pink-500/30"
                      >
                        <Truck className="w-4 h-4 text-pink-600 dark:text-pink-400" />
                        <span>Driver / Rider Hub</span>
                      </button>
                    )}

                    {isAdmin && (
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          if (onNavigateAdmin) onNavigateAdmin();
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-purple-50 dark:bg-purple-500/10 hover:bg-purple-100 dark:hover:bg-purple-500/20 text-purple-800 dark:text-purple-300 font-bold transition-colors text-left cursor-pointer border border-purple-200 dark:border-purple-500/30"
                      >
                        <ShieldCheck className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        <span>Admin Console</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        if (onNavigateTrack) onNavigateTrack();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-950/50 text-slate-700 hover:text-slate-950 dark:text-white/80 dark:hover:text-white transition-colors text-left cursor-pointer font-medium"
                    >
                      <Truck className="w-4 h-4 text-pink-500" />
                      <span>Track Orders Live</span>
                    </button>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        openWishlist();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-950/50 text-slate-700 hover:text-slate-950 dark:text-white/80 dark:hover:text-white transition-colors text-left cursor-pointer font-medium"
                    >
                      <Heart className="w-4 h-4 text-pink-500" />
                      <span>Wishlist ({wishlistCount})</span>
                    </button>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        if (onOpenSupport) onOpenSupport();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-950/50 text-slate-700 hover:text-slate-950 dark:text-white/80 dark:hover:text-white transition-colors text-left cursor-pointer font-medium"
                    >
                      <Headphones className="w-4 h-4 text-pink-500" />
                      <span>24/7 Customer Support</span>
                    </button>

                    <div className="my-1 border-t border-purple-100 dark:border-purple-500/20" />

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-pink-50 dark:hover:bg-pink-950/40 text-pink-600 dark:text-pink-400 hover:text-pink-700 dark:hover:text-pink-300 transition-colors text-left font-bold cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => openAuthModal('login')}
                className="h-8 sm:h-10 flex items-center gap-1.5 sm:gap-2.5 px-3 sm:px-5 rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 hover:from-purple-500 hover:to-pink-500 text-white text-xs sm:text-sm font-bold shadow-md shadow-pink-500/25 hover:shadow-pink-500/40 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer btn-solid-cta whitespace-nowrap shrink-0"
              >
                <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                  <User className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
                </div>
                <span className="text-white font-bold tracking-wide">Sign In</span>
              </button>
            )}

            {/* Mobile menu toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-purple-50 dark:bg-[#120B20] border border-purple-200 dark:border-purple-500/30 text-slate-900 dark:text-white hover:text-pink-600 dark:hover:text-pink-400 flex items-center justify-center transition-all cursor-pointer shadow-xs"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4 sm:w-5 sm:h-5 text-slate-900 dark:text-white" /> : <Menu className="w-4 h-4 sm:w-5 sm:h-5 text-slate-900 dark:text-white" />}
            </button>
          </div>
        </div>

        {/* Dedicated Expanding Mobile Search Drawer */}
        {mobileSearchOpen && (
          <div className="md:hidden py-3 px-2 border-t border-purple-200/80 dark:border-white/10 bg-white/95 dark:bg-[#0C0C16] animate-slide-up">
            <form
              onSubmit={(e) => {
                if (onSearchSubmit) onSearchSubmit(e);
                setMobileSearchOpen(false);
              }}
              className="flex items-center w-full px-3.5 py-2 rounded-full bg-slate-100 dark:bg-white/[0.08] border border-pink-500 focus-within:ring-2 focus-within:ring-pink-500/20"
            >
              <Search className="w-4 h-4 text-pink-500 mr-2 shrink-0" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search styles, hoodies, streetwear..."
                autoFocus
                className="w-full bg-transparent text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  className="p-1 text-slate-400 hover:text-white mr-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                type="submit"
                className="p-1.5 rounded-full bg-gradient-to-r from-brand-600 to-pink-600 text-white font-bold text-xs"
              >
                <ArrowRight className="w-3 h-3" />
              </button>
            </form>
          </div>
        )}

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-purple-200 dark:border-white/10 space-y-3 animate-slide-up bg-white/95 dark:bg-[#0A0E18] rounded-b-2xl p-3 shadow-lg">
            <form onSubmit={onSearchSubmit} className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search styles..."
                className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-white/10 border border-purple-200 dark:border-white/10 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400"
              />
            </form>

            <div className="grid grid-cols-2 gap-2 pt-2">
              {navLinks.map((link) => (
                <button
                  key={link.value}
                  onClick={() => handleNavClick(link.value)}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold text-center cursor-pointer ${
                    currentCategory === link.value
                      ? 'bg-brand-600 text-white font-bold'
                      : 'bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-white/10'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </div>

            {/* Quick Action Navigation Buttons in Mobile Menu */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onNavigateCustomer) onNavigateCustomer();
                }}
                className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-brand-600 to-pink-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-pink-500/20"
              >
                <Package className="w-4 h-4 text-white" />
                <span>Customer Portal & Orders ({userOrders?.length || 0})</span>
              </button>

              {isDeliveryPartner && (
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (onNavigateDelivery) onNavigateDelivery();
                  }}
                  className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-pink-600 to-brand-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-pink-500/20"
                >
                  <Bike className="w-4 h-4 text-white" />
                  <span>Driver / Rider Hub</span>
                </button>
              )}

              {isAdmin && (
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (onNavigateAdmin) onNavigateAdmin();
                  }}
                  className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20"
                >
                  <ShieldCheck className="w-4 h-4 text-white" />
                  <span>Admin Console</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onNavigateTrack) onNavigateTrack();
                }}
                className="py-2.5 px-3 rounded-xl bg-purple-100 dark:bg-white/10 text-slate-900 dark:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
              >
                <Truck className="w-4 h-4 text-pink-500" />
                <span>Track Live Orders</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onOpenSupport) onOpenSupport();
                }}
                className="py-2.5 px-3 rounded-xl bg-purple-100 dark:bg-white/10 text-slate-900 dark:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all col-span-1 sm:col-span-2"
              >
                <Headphones className="w-4 h-4 text-emerald-500" />
                <span>24/7 Support Desk</span>
              </button>
            </div>

            {/* Mobile Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-purple-50 dark:bg-white/5 border border-purple-200 dark:border-brand-500/30 text-xs font-semibold cursor-pointer"
            >
              <span className="flex items-center gap-2 text-slate-900 dark:text-white">
                {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-purple-600" />}
                <span>Appearance: {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
              </span>
              <span className="text-[10px] uppercase font-bold text-pink-600 dark:text-pink-400 bg-pink-100 dark:bg-pink-500/10 px-2 py-0.5 rounded-md border border-pink-200 dark:border-pink-500/20">
                Switch to {theme === 'dark' ? 'Light' : 'Dark'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenAI) onOpenAI();
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-brand-600 to-pink-600 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md shadow-pink-500/20"
            >
              <Sparkles className="w-4 h-4 text-white" />
              <span>Launch VibeAI Fashion Stylist</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
