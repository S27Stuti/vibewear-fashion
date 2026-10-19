import React from 'react';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';

const WishlistDrawer = ({ onSelectProduct }) => {
  const { wishlistItems, isWishlistOpen, closeWishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { requireAuth } = useAuth();

  if (!isWishlistOpen) return null;

  const handleMoveToBag = (product) => {
    requireAuth(() => {
      const defaultSize = product.sizes?.[0] || 'M';
      const defaultColor = product.colors?.[0] || 'Standard';
      addToCart(product, defaultSize, defaultColor, 1);
      removeFromWishlist(product.id || product._id);
    });
  };

  const productList = Object.values(wishlistItems);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      {/* Backdrop */}
      <div
        onClick={closeWishlist}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-[#0B0B12] border-l border-purple-200 dark:border-brand-500/30 text-slate-900 dark:text-white shadow-2xl flex flex-col animate-slide-up">
          {/* Header */}
          <div className="p-6 border-b border-purple-200 dark:border-brand-500/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-pink-500/10 text-pink-600 dark:bg-pink-600/20 dark:text-pink-400 border border-pink-200 dark:border-pink-500/30 flex items-center justify-center">
                <Heart className="w-5 h-5 fill-pink-500" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white">Saved Styles</h3>
                <p className="text-xs text-slate-500 dark:text-white/60">
                  {productList.length} {productList.length === 1 ? 'silhouette' : 'silhouettes'} saved in wishlist
                </p>
              </div>
            </div>
            <button
              onClick={closeWishlist}
              className="p-2 text-slate-500 hover:text-slate-900 rounded-full hover:bg-slate-100 dark:text-white/60 dark:hover:text-white dark:hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close wishlist"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {productList.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500 dark:text-white/60">
                <div className="w-16 h-16 rounded-full bg-pink-500/10 border border-pink-200 dark:border-pink-500/20 flex items-center justify-center mb-4">
                  <Heart className="w-8 h-8 text-pink-500 dark:text-pink-400" />
                </div>
                <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">Your wishlist is empty</h4>
                <p className="text-xs text-slate-500 dark:text-white/60 max-w-xs">
                  Tap the heart on any apparel to save it for later.
                </p>
              </div>
            ) : (
              productList.map((product) => {
                const pId = product.id || product._id;
                return (
                  <div
                    key={pId}
                    className="flex gap-4 p-3.5 rounded-2xl bg-slate-50 dark:bg-black/60 border border-purple-200/80 dark:border-brand-500/20 hover:border-pink-500/40 transition-all shadow-sm"
                  >
                    <img
                      src={product.images?.[0] || 'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=300'}
                      alt={product.title}
                      onClick={() => {
                        closeWishlist();
                        if (onSelectProduct) onSelectProduct(product);
                      }}
                      className="w-20 h-24 object-cover rounded-xl bg-slate-100 dark:bg-black shrink-0 cursor-pointer"
                    />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <h4
                            onClick={() => {
                              closeWishlist();
                              if (onSelectProduct) onSelectProduct(product);
                            }}
                            className="text-sm font-semibold text-slate-900 dark:text-white line-clamp-1 cursor-pointer hover:text-pink-600 dark:hover:text-pink-300 transition-colors"
                          >
                            {product.title}
                          </h4>
                          <button
                            onClick={() => removeFromWishlist(pId)}
                            className="text-slate-400 hover:text-pink-600 dark:text-white/40 dark:hover:text-pink-400 transition-colors p-1 cursor-pointer"
                            title="Remove"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-white/60 mt-0.5">{product.category} • {product.subCategory || 'Apparel'}</p>
                        <p className="text-sm font-bold text-pink-600 dark:text-pink-400 mt-1.5">₹{product.price}</p>
                      </div>

                      <button
                        onClick={() => handleMoveToBag(product)}
                        className="mt-2 w-full py-2 px-3 rounded-xl bg-gradient-to-r from-brand-600 to-pink-600 hover:from-brand-500 hover:to-pink-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md shadow-brand-600/30 cursor-pointer"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Move to Bag</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WishlistDrawer;
