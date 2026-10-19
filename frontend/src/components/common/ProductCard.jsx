import React, { useState } from 'react';
import { Heart, Star, Eye, Check } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { getColorMatchedImage, getCleanProductImages } from '../../utils/productImageUtils';

const ProductCard = ({ product, onSelect, onSelectProduct, onQuickView }) => {
  const { addToCart, showToast } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [selectedSize, setSelectedSize] = useState(
    product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'M'
  );
  const [isHovered, setIsHovered] = useState(false);
  const [activeColor, setActiveColor] = useState(null);

  const isWishlisted = isInWishlist(product.id || product._id);

  // Dynamic image switching by color variant focusing purely on clothing
  const getProductImage = () => {
    if (activeColor) {
      return getColorMatchedImage(product, activeColor);
    }
    const cleanList = getCleanProductImages(product, product.colors?.[0] || 'Standard');
    return cleanList[0] || 'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=800&q=80';
  };

  const getSecondaryImage = () => {
    const cleanList = getCleanProductImages(product, activeColor || product.colors?.[0] || 'Standard');
    if (cleanList.length > 1) {
      return cleanList[1];
    }
    return getProductImage();
  };

  const activeImage = getProductImage();
  const secondaryImage = getSecondaryImage();

  const handleHeartClick = (e) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleCardClick = () => {
    if (onSelectProduct) {
      onSelectProduct(product);
    } else if (onSelect) {
      onSelect(product);
    }
  };

  const handleQuickAddClick = (e) => {
    e.stopPropagation();
    if (onQuickView) {
      onQuickView(product);
    } else {
      handleCardClick();
    }
  };

  const handleColorSelect = (e, colorName) => {
    e.stopPropagation();
    setActiveColor(colorName);
  };

  return (
    <div
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex flex-col rounded-3xl bg-white dark:bg-[#0B0B12] border border-purple-200/80 dark:border-brand-500/20 hover:border-pink-500 dark:hover:border-pink-500/60 p-3 transition-all duration-300 hover:-translate-y-1.5 shadow-sm hover:shadow-xl dark:shadow-lg dark:hover:shadow-glow-combo cursor-pointer"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter') handleCardClick();
      }}
      aria-label={`View details for ${product.title}`}
    >
      {/* Image Showcase Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-slate-100 dark:bg-black/40">
        <img
          src={isHovered && !activeColor ? secondaryImage : activeImage}
          alt={product.title}
          className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src =
              product.category === 'Women'
                ? 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80'
                : product.category === 'Kids'
                ? 'https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?auto=format&fit=crop&w=800&q=80'
                : 'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=800&q=80';
          }}
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 items-start">
          <span className="px-2.5 py-0.5 rounded-md bg-white/90 dark:bg-black/80 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider text-purple-900 dark:text-white border border-purple-200 dark:border-brand-500/30 shadow-sm">
            {product.category}
          </span>
          {product.isFeatured && (
            <span className="px-2 py-0.5 rounded-md bg-gradient-to-r from-brand-600 to-pink-600 text-[10px] font-bold text-white shadow-md">
              Featured
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={handleHeartClick}
          className="absolute top-2.5 right-2.5 p-2 rounded-xl bg-white/90 dark:bg-black/70 backdrop-blur-md border border-purple-200 dark:border-brand-500/30 text-slate-700 dark:text-white hover:text-pink-500 transition-colors shadow-sm cursor-pointer hover:border-pink-500/50"
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart
            className={`w-4 h-4 transition-transform active:scale-125 ${
              isWishlisted ? 'fill-pink-500 text-pink-500' : 'text-slate-400 dark:text-white/70'
            }`}
          />
        </button>

        {/* Quick View & Add Overlay on Hover (Desktop) */}
        <div className="absolute bottom-2.5 inset-x-2.5 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 hidden sm:block">
          <button
            type="button"
            onClick={handleQuickAddClick}
            className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-brand-600 to-pink-600 hover:from-brand-500 hover:to-pink-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-brand-600/40 transition-all cursor-pointer btn-solid-cta"
          >
            <Eye className="w-3.5 h-3.5 text-white" />
            <span className="text-white">Quick View & Details</span>
          </button>
        </div>
      </div>

      {/* Info Container */}
      <div className="pt-3 pb-1 flex-1 flex flex-col justify-between">
        <div>
          {/* Color Variants Dots */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex items-center gap-1.5 mb-2">
              {product.colors.slice(0, 4).map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={(e) => handleColorSelect(e, c)}
                  title={c}
                  className={`w-3.5 h-3.5 rounded-full border transition-transform cursor-pointer ${
                    activeColor === c
                      ? 'scale-125 ring-2 ring-pink-500 border-white dark:border-white'
                      : 'border-slate-300 dark:border-white/30 hover:scale-110'
                  }`}
                  style={{
                    backgroundColor:
                      c.toLowerCase().includes('black')
                        ? '#111827'
                        : c.toLowerCase().includes('white')
                        ? '#F3F4F6'
                        : c.toLowerCase().includes('pink')
                        ? '#EC4899'
                        : c.toLowerCase().includes('purple') || c.toLowerCase().includes('violet') || c.toLowerCase().includes('plum')
                        ? '#A855F7'
                        : '#3B0764'
                  }}
                />
              ))}
              {product.colors.length > 4 && (
                <span className="text-[10px] text-slate-500 dark:text-white/50">+{product.colors.length - 4}</span>
              )}
            </div>
          )}

          {/* Rating */}
          <div className="flex items-center gap-1.5 text-xs mb-1">
            <div className="flex items-center text-pink-500">
              <Star className="w-3.5 h-3.5 fill-pink-500 text-pink-500" />
              <span className="ml-1 text-slate-900 dark:text-white font-bold text-xs">{product.rating || 4.8}</span>
            </div>
            <span className="text-slate-500 dark:text-white/50 text-[11px] font-normal">({product.numReviews || 12})</span>
            {product.stock <= 5 && product.stock > 0 && (
              <span className="ml-auto text-[10px] font-bold text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-pink-500/10 px-1.5 py-0.5 rounded border border-pink-200 dark:border-pink-500/20">
                Only {product.stock} left!
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">
            {product.title}
          </h3>

          <p className="text-[11px] text-slate-500 dark:text-white/60 mt-0.5 line-clamp-1 font-normal">
            {product.subCategory || 'Urban Streetwear'}
          </p>
        </div>

        {/* Sizes list preview & Price */}
        <div className="pt-2 mt-2 border-t border-purple-100 dark:border-brand-500/20 flex items-center justify-between">
          <span className="text-base font-black text-slate-950 dark:text-white">
            ₹{product.price}
          </span>

          <div className="flex items-center gap-1">
            {product.sizes?.slice(0, 3).map((s) => (
              <span
                key={s}
                className="text-[10px] text-slate-700 dark:text-white/60 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-1.5 py-0.5 rounded font-medium"
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Mobile View Details Button */}
        <div className="sm:hidden mt-2 pt-2 border-t border-purple-100 dark:border-brand-500/15">
          <button
            type="button"
            onClick={handleCardClick}
            className="w-full py-1.5 px-2 rounded-lg bg-purple-50 dark:bg-white/5 hover:bg-purple-100 dark:hover:bg-white/10 text-purple-900 dark:text-white/90 text-[11px] font-bold flex items-center justify-center gap-1.5 border border-purple-200 dark:border-white/10"
          >
            <Eye className="w-3 h-3 text-pink-500" />
            <span>View Details</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
