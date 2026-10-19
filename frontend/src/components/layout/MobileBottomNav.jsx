import React from 'react';
import { Home, Compass, Heart, ShoppingBag, User } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';

const MobileBottomNav = ({ activePage, onNavigateHome, onNavigateProducts }) => {
  const { totalCount, openCart } = useCart();
  const { wishlistCount, openWishlist } = useWishlist();
  const { isAuthenticated, openProfile, openAuthModal } = useAuth();

  const handleProfileClick = () => {
    if (isAuthenticated) {
      openProfile();
    } else {
      openAuthModal('login');
    }
  };

  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-[#0B0B12]/95 border-t border-purple-200 dark:border-brand-500/25 backdrop-blur-xl px-2 py-1.5 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.6)] transition-colors duration-200">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {/* Home */}
        <button
          onClick={onNavigateHome}
          className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all cursor-pointer ${
            activePage === 'home'
              ? 'text-pink-600 dark:text-pink-400 font-bold'
              : 'text-slate-500 dark:text-white/60 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] mt-1">Home</span>
        </button>

        {/* Shop */}
        <button
          onClick={onNavigateProducts}
          className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all cursor-pointer ${
            activePage === 'products'
              ? 'text-pink-600 dark:text-pink-400 font-bold'
              : 'text-slate-500 dark:text-white/60 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Compass className="w-5 h-5" />
          <span className="text-[10px] mt-1">Shop</span>
        </button>

        {/* Wishlist */}
        <button
          onClick={openWishlist}
          className="flex flex-col items-center justify-center p-2 rounded-xl text-slate-500 dark:text-white/60 hover:text-slate-900 dark:hover:text-white relative transition-all cursor-pointer"
        >
          <div className="relative">
            <Heart className={`w-5 h-5 ${wishlistCount > 0 ? 'fill-pink-500 text-pink-500' : ''}`} />
            {wishlistCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-gradient-to-r from-pink-600 to-brand-600 text-white text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow-md shadow-pink-500/50">
                {wishlistCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-1">Saved</span>
        </button>

        {/* Bag */}
        <button
          onClick={openCart}
          className="flex flex-col items-center justify-center p-2 rounded-xl text-slate-500 dark:text-white/60 hover:text-slate-900 dark:hover:text-white relative transition-all cursor-pointer"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            {totalCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-gradient-to-r from-brand-600 to-pink-600 text-white text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow-md shadow-pink-500/50">
                {totalCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-1">Bag</span>
        </button>

        {/* Profile */}
        <button
          onClick={handleProfileClick}
          className="flex flex-col items-center justify-center p-2 rounded-xl text-slate-500 dark:text-white/60 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer"
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] mt-1">{isAuthenticated ? 'Profile' : 'Sign In'}</span>
        </button>
      </div>
    </div>
  );
};

export default MobileBottomNav;
