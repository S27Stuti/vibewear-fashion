import React, { useState } from 'react';
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
  Database
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const Navbar = ({
  currentCategory,
  onSelectCategory,
  searchTerm,
  onSearchChange,
  onSearchSubmit,
  onOpenAI,
  onNavigateHome,
  onNavigateProducts
}) => {
  const { totalCount, openCart } = useCart();
  const { wishlistCount, openWishlist } = useWishlist();
  const { user, isAuthenticated, logout, openAuthModal, openProfile } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

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
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-purple-200/80 dark:border-white/10 bg-white/95 dark:bg-[#0A0E18]/90 backdrop-blur-xl transition-colors duration-200">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-brand-900 via-pink-700 to-brand-950 text-white text-xs py-1.5 px-4 text-center font-medium tracking-wide flex items-center justify-center gap-2 border-b border-pink-500/20">
        <Sparkles className="w-3.5 h-3.5 text-pink-300 animate-spin-slow" />
        <span>PREMIUM DROP 2026: Enjoy Free Express Delivery on orders over ₹799 with code <strong className="text-pink-300">VIBE2026</strong></span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Logo */}
          <div
            onClick={onNavigateHome}
            className="flex items-center gap-2.5 cursor-pointer select-none group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 via-purple-600 to-pink-600 flex items-center justify-center shadow-lg shadow-brand-500/40 group-hover:scale-105 group-hover:shadow-pink-500/50 transition-all">
              <span className="font-display font-black text-xl text-white">V</span>
            </div>
            <div className="flex flex-col">
              <span className="font-display font-extrabold text-2xl tracking-tight text-slate-950 dark:text-white group-hover:text-pink-600 dark:group-hover:text-pink-300 transition-colors">
                VIBE<span className="text-pink-500">WEAR</span>
              </span>
              <span className="text-[10px] tracking-widest uppercase text-slate-500 dark:text-white/60 font-semibold -mt-1">
                Aesthetic Apparel
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5">
            {navLinks.map((link) => {
              const isActive = currentCategory === link.value;
              return (
                <button
                  key={link.value}
                  onClick={() => handleNavClick(link.value)}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all relative cursor-pointer ${
                    isActive
                      ? 'text-white bg-gradient-to-r from-brand-600 via-purple-600 to-pink-600 shadow-md shadow-brand-500/25 btn-solid-cta'
                      : 'text-slate-800 dark:text-slate-300 hover:text-purple-950 dark:hover:text-white hover:bg-purple-100/70 dark:hover:bg-white/5 font-bold'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Search Bar */}
          <div className="hidden lg:flex items-center flex-1 max-w-xs relative">
            <form onSubmit={onSearchSubmit} className="w-full relative">
              <Search className="w-4 h-4 text-purple-600 dark:text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search styles, oversized tees..."
                className="w-full pl-10 pr-4 py-2 bg-white dark:bg-white/[0.06] border-2 border-purple-200 hover:border-purple-300 focus:border-pink-500 dark:border-white/10 dark:focus:border-brand-500 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none transition-all shadow-xs"
              />
            </form>
          </div>

          {/* Right Action Icons: Wishlist, Cart & Auth */}
          <div className="flex items-center gap-2.5">
            {/* VibeAI Stylist Button */}
            <button
              type="button"
              onClick={onOpenAI}
              className="relative px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-50 via-pink-50/50 to-white hover:from-purple-100 hover:to-pink-100 dark:from-purple-950/40 dark:via-black/70 dark:to-pink-950/40 dark:hover:from-purple-900/50 dark:hover:to-pink-900/50 border-2 border-purple-200 hover:border-pink-500 dark:border-purple-500/40 dark:hover:border-pink-500/70 transition-all duration-200 shadow-xs hover:shadow-md dark:shadow-[0_0_20px_rgba(168,85,247,0.18)] dark:hover:shadow-[0_0_25px_rgba(236,72,153,0.35)] flex items-center gap-2 cursor-pointer group active:scale-95"
              title="VibeAI Fashion Assistant"
            >
              <Sparkles className="w-4 h-4 text-pink-600 dark:text-pink-400 group-hover:rotate-12 group-hover:scale-110 transition-transform animate-pulse" />
              <span className="hidden sm:inline-block text-xs font-black tracking-wide text-slate-900 dark:text-white">
                Vibe<span className="text-pink-600 dark:text-pink-400 font-black">AI</span>
              </span>
              <span className="px-1.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-gradient-to-r from-brand-600 to-pink-600 text-white shadow-xs ring-1 ring-white/20 btn-solid-cta">
                AI
              </span>
            </button>

            {/* Live Database & Backend Inspector Link */}
            <a
              href="http://localhost:5000/database"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden xl:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 dark:bg-white/5 dark:hover:bg-white/10 border-2 border-purple-200 dark:border-white/10 text-xs font-bold text-slate-800 dark:text-slate-200 hover:text-pink-600 dark:hover:text-pink-400 transition-all shadow-xs cursor-pointer"
              title="Open Live MySQL Database & Backend Status Inspector"
            >
              <Database className="w-3.5 h-3.5 text-pink-500" />
              <span>DB Inspector</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            </a>

            {/* Theme Toggle (Dark & Light Mode) */}
            <button
              type="button"
              onClick={toggleTheme}
              className="relative p-2.5 rounded-xl bg-white hover:bg-purple-50 dark:bg-white/[0.05] dark:hover:bg-white/10 border-2 border-purple-200 hover:border-pink-500 dark:border-brand-500/30 text-purple-900 dark:text-slate-300 hover:text-pink-600 dark:hover:text-white transition-all shadow-xs cursor-pointer flex items-center justify-center group"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle Dark and Light Mode"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-amber-400 group-hover:rotate-45 transition-transform" />
              ) : (
                <Moon className="w-5 h-5 text-purple-700 group-hover:-rotate-12 transition-transform" />
              )}
            </button>

            {/* Wishlist Button */}
            <button
              onClick={openWishlist}
              className="relative p-2.5 rounded-xl bg-white hover:bg-purple-50 dark:bg-white/[0.05] dark:hover:bg-white/10 border-2 border-purple-200 hover:border-pink-500 dark:border-white/10 text-slate-800 dark:text-slate-300 hover:text-pink-600 transition-all shadow-xs cursor-pointer"
              aria-label="Wishlist"
              title="Saved Styles"
            >
              <Heart className={`w-5 h-5 ${wishlistCount > 0 ? 'fill-pink-500 text-pink-500' : ''}`} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-pink-500 text-white text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center shadow-md shadow-pink-500/50 btn-solid-cta">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              onClick={openCart}
              className="relative p-2.5 rounded-xl bg-white hover:bg-purple-50 dark:bg-brand-600/20 dark:hover:bg-brand-600/30 border-2 border-purple-200 hover:border-pink-500 dark:border-brand-500/40 text-purple-900 dark:text-brand-300 hover:text-pink-600 transition-all shadow-xs cursor-pointer"
              aria-label="Open cart"
              title="Shopping Bag"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-brand-600 to-pink-600 text-white text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center shadow-md shadow-pink-500/50 animate-pulse-subtle btn-solid-cta">
                  {totalCount}
                </span>
              )}
            </button>

            {/* User Account / Profile */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 pr-3 rounded-xl bg-white hover:bg-purple-50 dark:bg-white/[0.06] dark:hover:bg-white/10 border-2 border-purple-200 hover:border-pink-500 dark:border-brand-500/30 transition-all text-xs font-bold text-slate-900 dark:text-white cursor-pointer shadow-xs"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-pink-600 flex items-center justify-center text-white text-xs font-bold uppercase shadow-sm btn-solid-cta">
                    {user.name ? user.name[0] : 'U'}
                  </div>
                  <span className="hidden sm:inline-block max-w-[90px] truncate text-slate-900 dark:text-white">{user.name}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-700 dark:text-white/60" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div
                    onMouseLeave={() => setUserDropdownOpen(false)}
                    className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-[#0B0B12] border border-purple-200 dark:border-brand-500/30 shadow-2xl p-2 z-50 text-xs text-slate-900 dark:text-white animate-slide-up"
                  >
                    <div className="px-3 py-2.5 border-b border-purple-100 dark:border-brand-500/20 mb-1">
                      <p className="font-semibold text-slate-900 dark:text-white truncate">{user.name}</p>
                      <p className="text-[11px] text-slate-500 dark:text-white/60 truncate">{user.email}</p>
                      <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-brand-500/10 dark:bg-brand-500/20 text-purple-700 dark:text-pink-300 border border-brand-500/30">
                        <ShieldCheck className="w-3 h-3 text-pink-500" />
                        {user.role || 'Customer'}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        openProfile();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-purple-50 dark:hover:bg-brand-600/20 text-slate-700 dark:text-white/80 hover:text-slate-950 dark:hover:text-white transition-colors text-left cursor-pointer"
                    >
                      <User className="w-4 h-4 text-pink-500" />
                      <span>My Profile</span>
                    </button>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        openProfile();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-purple-50 dark:hover:bg-brand-600/20 text-slate-700 dark:text-white/80 hover:text-slate-950 dark:hover:text-white transition-colors text-left cursor-pointer"
                    >
                      <Package className="w-4 h-4 text-brand-500" />
                      <span>Order History</span>
                    </button>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        openWishlist();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-purple-50 dark:hover:bg-brand-600/20 text-slate-700 dark:text-white/80 hover:text-slate-950 dark:hover:text-white transition-colors text-left cursor-pointer"
                    >
                      <Heart className="w-4 h-4 text-pink-500" />
                      <span>Wishlist ({wishlistCount})</span>
                    </button>

                    <div className="my-1 border-t border-purple-100 dark:border-brand-500/20" />

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-pink-50 dark:hover:bg-pink-950/40 text-pink-600 dark:text-pink-400 hover:text-pink-700 dark:hover:text-pink-300 transition-colors text-left font-medium cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => openAuthModal('login')}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-pink-600 hover:from-brand-500 hover:to-pink-500 text-white text-xs font-semibold shadow-md shadow-brand-600/30 transition-all cursor-pointer btn-solid-cta"
              >
                <User className="w-4 h-4 text-white" />
                <span className="text-white">Sign In</span>
              </button>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white rounded-lg hover:bg-purple-100 dark:hover:bg-white/10"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

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
                      ? 'bg-brand-600 text-white'
                      : 'bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-white/10'
                  }`}
                >
                  {link.label}
                </button>
              ))}
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
              className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-brand-600 to-pink-600 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md shadow-pink-500/20 btn-solid-cta"
            >
              <Sparkles className="w-4 h-4 text-white" />
              <span className="text-white">Launch VibeAI Fashion Stylist</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
