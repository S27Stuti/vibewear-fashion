import React from 'react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import {
  X,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Truck
} from 'lucide-react';

const CartDrawer = ({ onNavigateToProducts, onOpenCheckout }) => {
  const {
    cartItems,
    isCartOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    subtotal,
    totalPrice,
    tax,
    shipping,
    totalCount
  } = useCart();

  const { isAuthenticated, requireAuth } = useAuth();

  if (!isCartOpen) return null;

  const freeShippingThreshold = 799;
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  const handleCheckout = () => {
    requireAuth(() => {
      closeCart();
      if (onOpenCheckout) {
        onOpenCheckout();
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-3 sm:pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-[#0B0B12] border-l border-purple-200 dark:border-brand-500/30 text-slate-900 dark:text-white shadow-2xl flex flex-col animate-slide-up">
          {/* Drawer Header */}
          <div className="p-6 border-b border-purple-200 dark:border-brand-500/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 dark:bg-brand-600/20 dark:text-pink-400 border border-purple-200 dark:border-brand-500/30 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white">Your Shopping Bag</h3>
                <p className="text-xs text-slate-500 dark:text-white/60">
                  {totalCount} {totalCount === 1 ? 'item' : 'items'} ready for checkout
                </p>
              </div>
            </div>
            <button
              onClick={closeCart}
              className="p-2 text-slate-500 hover:text-slate-900 rounded-full hover:bg-slate-100 dark:text-white/60 dark:hover:text-white dark:hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="px-6 py-3 bg-purple-50/70 dark:bg-black/60 border-b border-purple-200 dark:border-brand-500/15">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="flex items-center gap-1.5 text-slate-700 dark:text-white/80">
                <Truck className="w-3.5 h-3.5 text-pink-600 dark:text-pink-400" />
                {amountToFreeShipping > 0 ? (
                  <>Add <strong className="text-pink-700 dark:text-pink-300 font-semibold">₹{amountToFreeShipping}</strong> for Free Express Delivery</>
                ) : (
                  <span className="text-pink-600 dark:text-pink-400 font-semibold">🎉 You unlocked FREE Express Delivery!</span>
                )}
              </span>
              <span className="text-slate-500 dark:text-white/60 text-[10px]">{Math.round(freeShippingProgress)}%</span>
            </div>
            <div className="w-full h-1.5 bg-purple-100 dark:bg-black rounded-full overflow-hidden border border-purple-200 dark:border-brand-500/20">
              <div
                className="h-full bg-gradient-to-r from-brand-500 to-pink-500 rounded-full transition-all duration-300"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500 dark:text-white/60">
                <div className="w-16 h-16 rounded-full bg-purple-100 dark:bg-brand-600/10 border border-purple-200 dark:border-brand-500/20 flex items-center justify-center mb-4">
                  <ShoppingBag className="w-8 h-8 text-pink-600 dark:text-pink-400" />
                </div>
                <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">Your bag is empty</h4>
                <p className="text-xs text-slate-500 dark:text-white/60 max-w-xs mb-6">
                  Explore our curated Men, Women, and Kids collections to find your perfect vibe.
                </p>
                <button
                  onClick={() => {
                    closeCart();
                    if (onNavigateToProducts) onNavigateToProducts();
                  }}
                  className="px-6 py-2.5 bg-gradient-to-r from-brand-600 to-pink-600 hover:from-brand-500 hover:to-pink-500 text-white text-xs font-semibold rounded-xl transition-all shadow-lg shadow-brand-600/30 cursor-pointer"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-3.5 rounded-2xl bg-slate-50 dark:bg-black/60 border border-purple-200/80 dark:border-brand-500/20 hover:border-pink-500/40 transition-all shadow-sm"
                >
                  <img
                    src={item.product?.images?.[0] || 'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=300'}
                    alt={item.product?.title || 'Product'}
                    className="w-20 h-24 object-cover rounded-xl bg-slate-100 dark:bg-black shrink-0"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="text-sm font-semibold text-slate-900 dark:text-white line-clamp-1">
                          {item.product?.title}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-slate-400 hover:text-pink-600 dark:text-white/40 dark:hover:text-pink-400 transition-colors cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-xs text-slate-500 dark:text-white/60">
                        <span className="px-2 py-0.5 rounded-lg bg-white dark:bg-black border border-purple-200 dark:border-brand-500/20 text-slate-700 dark:text-white/80">
                          Size: {item.size}
                        </span>
                        <span className="px-2 py-0.5 rounded-lg bg-white dark:bg-black border border-purple-200 dark:border-brand-500/20 text-slate-700 dark:text-white/80">
                          {item.color}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2 bg-white dark:bg-black rounded-lg p-1 border border-purple-200 dark:border-brand-500/30">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-6 h-6 rounded flex items-center justify-center text-slate-600 hover:text-slate-950 hover:bg-slate-100 dark:text-white/60 dark:hover:text-white dark:hover:bg-white/10 transition-colors cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-semibold px-1 text-slate-900 dark:text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 rounded flex items-center justify-center text-slate-600 hover:text-slate-950 hover:bg-slate-100 dark:text-white/60 dark:hover:text-white dark:hover:bg-white/10 transition-colors cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className="text-sm font-bold text-pink-600 dark:text-pink-400">
                        ₹{(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Checkout Footer */}
          {cartItems.length > 0 && (
            <div className="p-4 sm:p-6 pb-safe border-t border-purple-200 dark:border-brand-500/20 bg-slate-50/95 dark:bg-black/90">
              <div className="space-y-2 text-xs text-slate-600 dark:text-white/70 mb-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900 dark:text-white">₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated GST (5%)</span>
                  <span className="text-slate-800 dark:text-white">₹{tax}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? <strong className="text-pink-600 dark:text-pink-400 font-semibold">FREE</strong> : `₹${shipping}`}</span>
                </div>
                <div className="pt-2 border-t border-purple-200 dark:border-brand-500/20 flex justify-between text-base font-bold text-slate-900 dark:text-white">
                  <span>Total Amount</span>
                  <span className="text-pink-600 dark:text-pink-400 font-extrabold">₹{totalPrice}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-brand-600 via-pink-600 to-purple-600 hover:from-brand-500 hover:to-pink-500 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-brand-600/30 transition-all hover:shadow-pink-600/40 cursor-pointer"
              >
                <span>{isAuthenticated ? 'Proceed to Checkout' : 'Sign In & Checkout'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="mt-3 flex items-center justify-center gap-2 text-[11px] text-slate-500 dark:text-white/60">
                <ShieldCheck className="w-3.5 h-3.5 text-pink-600 dark:text-pink-400" />
                <span>Encrypted 256-bit SSL Secure Checkout</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
