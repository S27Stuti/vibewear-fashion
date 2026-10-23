import React from 'react';
import { Home, Compass, User, Truck, ShieldCheck, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const MobileBottomNav = ({
  activePage,
  onNavigateHome,
  onNavigateProducts,
  onNavigateCustomer,
  onNavigateDelivery,
  onNavigateAdmin
}) => {
  const { totalCount, openCart } = useCart();
  const { user, isAdmin, isDeliveryPartner } = useAuth();

  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-[#0B0B12]/95 border-t border-purple-200/60 dark:border-brand-500/25 backdrop-blur-xl px-2 pt-1.5 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.06)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.6)] transition-colors duration-200">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {/* Home */}
        <button
          onClick={onNavigateHome}
          className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all cursor-pointer min-h-[44px] ${
            activePage === 'home'
              ? 'text-pink-600 dark:text-pink-400 font-black scale-105'
              : 'text-slate-500 dark:text-white/60 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 tracking-tight">Home</span>
        </button>

        {/* Shop */}
        <button
          onClick={onNavigateProducts}
          className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all cursor-pointer min-h-[44px] ${
            activePage === 'products'
              ? 'text-pink-600 dark:text-pink-400 font-black scale-105'
              : 'text-slate-500 dark:text-white/60 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Compass className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 tracking-tight">Shop</span>
        </button>

        {/* Customer Portal */}
        <button
          onClick={onNavigateCustomer}
          className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all cursor-pointer min-h-[44px] ${
            activePage === 'customer'
              ? 'text-pink-600 dark:text-pink-400 font-black scale-105'
              : 'text-slate-500 dark:text-white/60 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 font-bold tracking-tight">Account</span>
        </button>

        {/* Driver Hub - visible only for delivery partner */}
        {isDeliveryPartner && (
          <button
            onClick={onNavigateDelivery}
            className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all cursor-pointer min-h-[44px] ${
              activePage === 'delivery'
                ? 'text-pink-600 dark:text-pink-400 font-black scale-105'
                : 'text-slate-500 dark:text-white/60 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Truck className="w-5 h-5 text-pink-500" />
            <span className="text-[10px] mt-0.5 font-bold tracking-tight">Driver</span>
          </button>
        )}

        {/* Admin Console - visible only for admin */}
        {isAdmin && (
          <button
            onClick={onNavigateAdmin}
            className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all cursor-pointer min-h-[44px] ${
              activePage === 'admin'
                ? 'text-purple-600 dark:text-purple-400 font-black scale-105'
                : 'text-slate-500 dark:text-white/60 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ShieldCheck className="w-5 h-5 text-purple-500" />
            <span className="text-[10px] mt-0.5 font-bold tracking-tight">Admin</span>
          </button>
        )}

        {/* Bag */}
        <button
          onClick={openCart}
          className="flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-xl text-slate-500 dark:text-white/60 hover:text-slate-900 dark:hover:text-white relative transition-all cursor-pointer min-h-[44px]"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            {totalCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-gradient-to-r from-brand-600 to-pink-600 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                {totalCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">Bag</span>
        </button>
      </div>
    </div>
  );
};

export default MobileBottomNav;
