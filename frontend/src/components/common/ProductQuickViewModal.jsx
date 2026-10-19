import React, { useState, useEffect } from 'react';
import {
  X,
  Star,
  ShoppingBag,
  Zap,
  Heart,
  Share2,
  Check,
  Plus,
  Minus,
  Truck,
  RotateCcw,
  ShieldCheck,
  MessageSquare,
  ExternalLink,
  ChevronRight,
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import ShareModal from './ShareModal';
import { getColorMatchedImage, getCleanProductImages } from '../../utils/productImageUtils';

const DEFAULT_REVIEWS = [
  {
    _id: 'rev_1',
    user: { name: 'Aiden Vance' },
    rating: 5,
    comment: 'The drape and heavyweight cotton on this piece are insane. Exceeded all my expectations!',
    createdAt: '2 days ago',
    verified: true,
    fit: 'True to Size'
  },
  {
    _id: 'rev_2',
    user: { name: 'Elena Rostova' },
    rating: 5,
    comment: 'Color matches the photo 100%. Soft interior and premium ribbed collar. Definitely ordering more colors.',
    createdAt: '1 week ago',
    verified: true,
    fit: 'Slightly Relaxed'
  },
  {
    _id: 'rev_3',
    user: { name: 'Marcus Chen' },
    rating: 4,
    comment: 'Great quality streetwear garment. Fast express shipping as well!',
    createdAt: '2 weeks ago',
    verified: true,
    fit: 'True to Size'
  }
];

const ProductQuickViewModal = ({
  product,
  isOpen,
  onClose,
  onOpenCheckout,
  onNavigateFullPage
}) => {
  const { addToCart, showToast } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { user, isAuthenticated, requireAuth } = useAuth();

  const [selectedImage, setSelectedImage] = useState('');
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('Standard');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('details'); // 'details' | 'reviews' | 'specs'
  const [reviewsList, setReviewsList] = useState([]);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [shareModalOpen, setShareModalOpen] = useState(false);

  // Synchronize state when a new product is opened
  useEffect(() => {
    if (product) {
      const initialColor = product.colors?.[0] || 'Standard';
      const primaryImg = getColorMatchedImage(product, initialColor);
      setSelectedImage(primaryImg);
      setSelectedSize(product.sizes?.[0] || 'M');
      setSelectedColor(initialColor);
      setQuantity(1);
      setActiveTab('details');
      setReviewsList(product.reviews && product.reviews.length > 0 ? product.reviews : DEFAULT_REVIEWS);
    }
  }, [product]);

  // Keyboard Escape listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !product) return null;

  const productId = product._id || product.id;
  const isWishlisted = isInWishlist(productId);

  // Variant matching on color selection: dynamically update picture to exact garment color
  const handleColorChange = (color) => {
    setSelectedColor(color);
    const matched = getColorMatchedImage(product, color);
    setSelectedImage(matched);
  };

  const handleHeartClick = (e) => {
    e.stopPropagation();
    requireAuth(() => {
      const added = toggleWishlist(product);
      showToast(added ? `Saved "${product.title}" to Wishlist` : 'Removed from Wishlist');
    });
  };

  const handleShareClick = () => {
    setShareModalOpen(true);
  };

  const handleAddToCart = () => {
    requireAuth(() => {
      addToCart(product, selectedSize, selectedColor, quantity);
      showToast(`Added ${quantity}x ${product.title} (${selectedSize}) to bag!`);
      onClose();
    });
  };

  const handleBuyNow = () => {
    requireAuth(() => {
      addToCart(product, selectedSize, selectedColor, quantity);
      onClose();
      if (onOpenCheckout) {
        onOpenCheckout();
      }
    });
  };

  const handleAddReview = (e) => {
    e.preventDefault();
    requireAuth((currentUser) => {
      if (!newComment.trim()) return;

      const newReview = {
        _id: 'rev_' + Date.now(),
        user: { name: currentUser.name || 'Verified Shopper' },
        rating: newRating,
        comment: newComment.trim(),
        createdAt: 'Just now',
        verified: true,
        fit: 'True to Size'
      };

      setReviewsList([newReview, ...reviewsList]);
      setNewComment('');
      showToast('Thank you! Your verified review has been published.');
      setActiveTab('reviews');
    });
  };

  const images = getCleanProductImages(product, selectedColor);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col w-screen h-screen bg-[#F8FAFC] dark:bg-[#06060A] text-slate-900 dark:text-white overflow-hidden animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full h-full flex flex-col overflow-hidden">
        {/* Header Bar with Product Category & Close Button */}
        <div className="flex items-center justify-between px-4 sm:px-8 py-3.5 border-b border-purple-200 dark:border-brand-500/20 bg-white/95 dark:bg-[#0B0B12]/95 backdrop-blur-xl shrink-0 z-20">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-xs font-bold text-slate-800 dark:text-white border border-purple-200 dark:border-white/10 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-pink-500" />
              <span>Back to Store</span>
            </button>
            <span className="text-slate-300 dark:text-white/30 hidden sm:inline">|</span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-purple-100 text-purple-700 dark:bg-brand-500/20 dark:text-brand-300 border border-purple-200 dark:border-brand-500/30">
              {product.category} Collection
            </span>
            <span className="text-xs text-slate-400 dark:text-white/50 hidden sm:inline">•</span>
            <span className="text-xs font-semibold text-slate-600 dark:text-white/70 hidden sm:inline">
              {product.subCategory || 'Urban Streetwear'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShareClick}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-pink-600 border border-purple-200 dark:bg-white/10 dark:hover:bg-pink-600 dark:border-white/10 text-slate-800 hover:text-white dark:text-white text-xs font-semibold transition-all cursor-pointer"
              title="Share Style"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Share</span>
            </button>

            {onNavigateFullPage && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onNavigateFullPage(product);
                }}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-xs font-semibold text-slate-700 dark:text-white/80 hover:text-slate-950 dark:hover:text-white border border-purple-200 dark:border-white/10 transition-colors cursor-pointer"
              >
                <span>Full Page View</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            )}

            {/* High-Visibility Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100 hover:bg-pink-600 border border-purple-200 dark:bg-white/10 dark:hover:bg-pink-600 dark:border-white/20 text-slate-700 hover:text-white dark:text-white transition-all shadow-sm cursor-pointer hover:scale-105 active:scale-95 group"
              title="Close (Esc)"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5 text-slate-700 group-hover:text-white dark:text-white group-hover:rotate-90 transition-transform duration-200" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10 space-y-8 max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
            {/* Left Column: Image Showcase with Thumbnails */}
            <div className="lg:col-span-6 flex flex-col-reverse sm:flex-row gap-4">
              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex sm:flex-col gap-2.5 overflow-x-auto sm:overflow-visible shrink-0 pb-2 sm:pb-0">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(img)}
                      className={`w-16 h-20 sm:w-20 sm:h-24 rounded-2xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                        selectedImage === img
                          ? 'border-pink-500 shadow-md shadow-pink-500/40 ring-2 ring-pink-500/30'
                          : 'border-slate-200 dark:border-white/10 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={img}
                        alt="Thumbnail"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src =
                            'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=800&q=80';
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Main Featured Photo - Focused cleanly on the full garment */}
              <div className="flex-1 aspect-[4/5] max-h-[72vh] rounded-3xl overflow-hidden bg-slate-100 dark:bg-black/60 border border-purple-200 dark:border-brand-500/20 relative group shadow-xl flex items-center justify-center">
                <img
                  src={selectedImage}
                  alt={product.title}
                  className="w-full h-full object-contain md:object-cover object-center transition-transform duration-500 group-hover:scale-102"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src =
                      'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=800&q=80';
                  }}
                />

                {/* Badges on Image */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  <span className="px-3 py-1 rounded-lg bg-black/80 backdrop-blur-md text-[11px] font-black uppercase tracking-wider text-white border border-brand-500/40">
                    {product.category}
                  </span>
                  {product.isFeatured && (
                    <span className="px-3 py-1 rounded-lg bg-gradient-to-r from-brand-600 to-pink-600 text-[11px] font-black uppercase text-white shadow-md">
                      Featured
                    </span>
                  )}
                </div>

                {/* Quick Action Overlay (Heart & Share) */}
                <div className="absolute top-4 right-4 flex flex-col gap-2.5">
                  <button
                    onClick={handleHeartClick}
                    className="p-3 rounded-2xl bg-white/90 dark:bg-black/75 backdrop-blur-md border border-purple-200 dark:border-white/20 text-slate-700 dark:text-white hover:text-pink-500 transition-all shadow-md cursor-pointer hover:border-pink-500/60"
                    title={isWishlisted ? 'Saved in Wishlist' : 'Add to Wishlist'}
                  >
                    <Heart
                      className={`w-4 h-4 transition-transform active:scale-125 ${
                        isWishlisted ? 'fill-pink-500 text-pink-500' : 'text-slate-600 dark:text-white/80'
                      }`}
                    />
                  </button>
                  <button
                    onClick={handleShareClick}
                    className="p-3 rounded-2xl bg-white/90 dark:bg-black/75 backdrop-blur-md border border-purple-200 dark:border-white/20 text-slate-700 dark:text-white hover:text-pink-500 transition-all shadow-md cursor-pointer hover:border-pink-500/60"
                    title="Share Style"
                  >
                    <Share2 className="w-4 h-4 text-slate-600 dark:text-white/80" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Pricing, Color Swatches, Sizes & Purchase CTAs */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-5">
              <div>
                {/* Title */}
                <h2 className="text-xl sm:text-2xl font-extrabold font-display text-slate-950 dark:text-white leading-tight">
                  {product.title}
                </h2>

                {/* Rating & Review Counter */}
                <div className="flex items-center gap-3 mt-2 text-xs">
                  <div className="flex items-center text-pink-500 dark:text-pink-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < Math.floor(product.rating || 5)
                            ? 'fill-pink-500 text-pink-500 dark:fill-pink-400 dark:text-pink-400'
                            : 'text-slate-300 dark:text-white/20'
                        }`}
                      />
                    ))}
                    <span className="ml-1.5 font-bold text-slate-900 dark:text-white text-xs">
                      {product.rating || 4.8}
                    </span>
                  </div>
                  <span className="text-slate-300 dark:text-white/50">•</span>
                  <button
                    onClick={() => setActiveTab('reviews')}
                    className="text-slate-600 hover:text-pink-600 dark:text-white/70 dark:hover:text-pink-300 underline font-medium cursor-pointer"
                  >
                    {reviewsList.length} Customer Reviews
                  </button>
                </div>

                {/* Price & Stock Status */}
                <div className="flex items-baseline gap-3 mt-3.5">
                  <span className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white">
                    ₹{product.price}
                  </span>
                  <span className="text-xs text-slate-400 dark:text-white/40 line-through">
                    ₹{Math.round(Number(product.price) * 1.25)}
                  </span>
                  <span className="text-[11px] font-bold text-pink-700 dark:text-pink-300 bg-pink-100 dark:bg-pink-500/15 px-2.5 py-0.5 rounded-full border border-pink-300 dark:border-pink-500/30">
                    20% OFF
                  </span>
                  {product.stock <= 5 ? (
                    <span className="text-[11px] font-extrabold text-pink-700 dark:text-pink-400 bg-pink-100 dark:bg-pink-500/20 px-2 py-0.5 rounded border border-pink-300 dark:border-pink-500/40 ml-auto">
                      Only {product.stock} left!
                    </span>
                  ) : (
                    <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 ml-auto flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      In Stock
                    </span>
                  )}
                </div>

                {/* Description Excerpt */}
                <p className="text-xs text-slate-600 dark:text-white/70 mt-3 leading-relaxed">
                  {product.description}
                </p>

                {/* Color Variants Switcher */}
                {product.colors && product.colors.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-purple-200 dark:border-brand-500/20">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                        Color: <span className="text-pink-600 dark:text-pink-300 font-semibold">{selectedColor}</span>
                      </label>
                      <span className="text-[10px] text-slate-500 dark:text-white/50">Click to switch photo</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {product.colors.map((color) => (
                        <button
                          key={color}
                          onClick={() => handleColorChange(color)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
                            selectedColor === color
                              ? 'bg-gradient-to-r from-brand-600 to-pink-600 text-white border-pink-400 shadow-md ring-2 ring-pink-500/30'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-950 border-purple-200 dark:bg-white/5 dark:text-white/80 dark:border-white/15 dark:hover:border-pink-500/40 dark:hover:bg-white/10'
                          }`}
                        >
                          <span
                            className="w-2.5 h-2.5 rounded-full border border-black/20 dark:border-white/30"
                            style={{
                              backgroundColor:
                                color.toLowerCase().includes('black')
                                  ? '#111827'
                                  : color.toLowerCase().includes('white')
                                  ? '#F3F4F6'
                                  : color.toLowerCase().includes('pink')
                                  ? '#EC4899'
                                  : color.toLowerCase().includes('purple') || color.toLowerCase().includes('violet')
                                  ? '#A855F7'
                                  : color.toLowerCase().includes('blue')
                                  ? '#38BDF8'
                                  : color.toLowerCase().includes('green')
                                  ? '#10B981'
                                  : '#6B7280'
                            }}
                          />
                          <span>{color}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Size Selector */}
                {product.sizes && product.sizes.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-purple-200 dark:border-brand-500/20">
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                        Select Size
                      </label>
                      <span className="text-[11px] text-pink-600 dark:text-pink-400 hover:underline cursor-pointer">
                        Size Guide
                      </span>
                    </div>
                    <div className="grid grid-cols-5 gap-2">
                      {product.sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`py-2 text-xs font-extrabold rounded-xl border transition-all text-center cursor-pointer ${
                            selectedSize === size
                              ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-900 border-slate-950 dark:border-white shadow-lg ring-2 ring-brand-500'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-950 border-purple-200 dark:bg-white/5 dark:text-white/80 dark:border-white/10 dark:hover:border-white/30 dark:hover:bg-white/10'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity Counter & CTA Buttons */}
                <div className="mt-5 space-y-3 pt-3 border-t border-purple-200 dark:border-brand-500/20">
                  <div className="flex items-center gap-3">
                    {/* Quantity Selector */}
                    <div className="flex items-center gap-2.5 bg-slate-100 dark:bg-white/5 border border-purple-200 dark:border-white/15 rounded-xl p-1.5 text-xs">
                      <button
                        type="button"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-600 hover:text-slate-950 hover:bg-slate-200 dark:text-white/70 dark:hover:text-white dark:hover:bg-white/10 transition-colors cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="font-extrabold text-slate-950 dark:text-white px-2">{quantity}</span>
                      <button
                        type="button"
                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-600 hover:text-slate-950 hover:bg-slate-200 dark:text-white/70 dark:hover:text-white dark:hover:bg-white/10 transition-colors cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Add to Cart Button */}
                    <button
                      type="button"
                      onClick={handleAddToCart}
                      className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-brand-600 to-pink-600 hover:from-brand-500 hover:to-pink-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-brand-600/30 hover:shadow-pink-600/40 transition-all cursor-pointer active:scale-98"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Bag</span>
                    </button>
                  </div>

                  {/* Buy Now Button */}
                  <button
                    type="button"
                    onClick={handleBuyNow}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-pink-600 via-purple-600 to-brand-600 hover:from-pink-500 hover:to-brand-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-pink-600/30 transition-all cursor-pointer active:scale-98"
                  >
                    <Zap className="w-4 h-4 text-pink-200" />
                    <span>Buy It Now • Express Checkout</span>
                  </button>
                </div>

                {/* Trust Highlights */}
                <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-purple-200 dark:border-brand-500/20 text-center">
                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-purple-200/60 dark:border-white/5">
                    <Truck className="w-4 h-4 text-pink-600 dark:text-pink-400 mx-auto mb-1" />
                    <p className="text-[10px] text-slate-600 dark:text-white/70 font-semibold leading-tight">Free Express Shipping</p>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-purple-200/60 dark:border-white/5">
                    <RotateCcw className="w-4 h-4 text-pink-600 dark:text-pink-400 mx-auto mb-1" />
                    <p className="text-[10px] text-slate-600 dark:text-white/70 font-semibold leading-tight">30-Day Easy Returns</p>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-purple-200/60 dark:border-white/5">
                    <ShieldCheck className="w-4 h-4 text-pink-600 dark:text-pink-400 mx-auto mb-1" />
                    <p className="text-[10px] text-slate-600 dark:text-white/70 font-semibold leading-tight">100% Authentic Apparel</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Navigation: About The Cloth, Reviews & Specs */}
          <div className="pt-6 border-t border-purple-200 dark:border-brand-500/20">
            <div className="flex items-center gap-2 border-b border-purple-200 dark:border-brand-500/20 pb-2 overflow-x-auto">
              <button
                type="button"
                onClick={() => setActiveTab('details')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'details'
                    ? 'bg-gradient-to-r from-brand-600 to-pink-600 text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100 dark:text-white/60 dark:hover:text-white dark:hover:bg-white/5'
                }`}
              >
                About The Clothe
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('reviews')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'reviews'
                    ? 'bg-gradient-to-r from-brand-600 to-pink-600 text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100 dark:text-white/60 dark:hover:text-white dark:hover:bg-white/5'
                }`}
              >
                <span>Customer Reviews</span>
                <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-white/20 dark:bg-white/20 text-white">
                  {reviewsList.length}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('specs')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'specs'
                    ? 'bg-gradient-to-r from-brand-600 to-pink-600 text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100 dark:text-white/60 dark:hover:text-white dark:hover:bg-white/5'
                }`}
              >
                Fabric & Care Specs
              </button>
            </div>

            {/* Tab 1: About The Clothe */}
            {activeTab === 'details' && (
              <div className="py-4 space-y-4 animate-fade-in">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-purple-200 dark:border-white/10 space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-pink-500 dark:text-pink-400" />
                    <span>Garment Silhouette & Design Notes</span>
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-white/80 leading-relaxed">
                    {product.description}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="p-3 rounded-xl bg-white dark:bg-black/40 border border-purple-200 dark:border-brand-500/20 shadow-sm">
                      <span className="text-[10px] font-bold text-pink-600 dark:text-pink-300 uppercase">Fit Profile</span>
                      <p className="text-xs text-slate-900 dark:text-white font-medium mt-0.5">Relaxed drop-shoulder boxy aesthetic</p>
                    </div>
                    <div className="p-3 rounded-xl bg-white dark:bg-black/40 border border-purple-200 dark:border-brand-500/20 shadow-sm">
                      <span className="text-[10px] font-bold text-pink-600 dark:text-pink-300 uppercase">Weight & Feel</span>
                      <p className="text-xs text-slate-900 dark:text-white font-medium mt-0.5">Heavyweight 260-320 GSM soft-touch cotton</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Customer Reviews & Comments */}
            {activeTab === 'reviews' && (
              <div className="py-4 space-y-6 animate-fade-in">
                {/* Rating Breakdown Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-purple-200 dark:border-brand-500/20">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">Shopper Ratings & Feedback</h4>
                    <p className="text-xs text-slate-500 dark:text-white/60 mt-0.5">
                      Verified customer feedback on sizing, texture, and everyday durability.
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-2xl font-black text-slate-950 dark:text-white">{product.rating || 4.8}</div>
                    <div className="flex flex-col">
                      <div className="flex text-pink-500 dark:text-pink-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-pink-500 text-pink-500 dark:fill-pink-400 dark:text-pink-400" />
                        ))}
                      </div>
                      <span className="text-[10px] text-slate-500 dark:text-white/60">Based on {reviewsList.length} verified orders</span>
                    </div>
                  </div>
                </div>

                {/* Write a Review Form */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#06060A] border border-purple-200 dark:border-brand-500/30">
                  <h5 className="text-xs font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-pink-500 dark:text-pink-400" />
                    <span>Leave a Customer Review</span>
                  </h5>
                  <form onSubmit={handleAddReview} className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 dark:text-white/70 mb-1">
                        Select Rating
                      </label>
                      <div className="flex items-center gap-1.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            onClick={() => setNewRating(star)}
                            className="p-1 text-slate-300 hover:text-pink-500 dark:text-white/30 dark:hover:text-pink-400 transition-colors cursor-pointer"
                          >
                            <Star
                              className={`w-5 h-5 ${
                                star <= newRating ? 'fill-pink-500 text-pink-500 dark:fill-pink-400 dark:text-pink-400' : ''
                              }`}
                            />
                          </button>
                        ))}
                        <span className="text-xs text-pink-600 dark:text-pink-300 font-semibold ml-2">
                          {newRating} / 5 Stars
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 dark:text-white/70 mb-1">
                        Your Feedback & Comments
                      </label>
                      <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Describe the fabric quality, comfort, fit, and overall look..."
                        rows={2}
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-white/5 border border-purple-200 dark:border-white/10 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/40 focus:outline-none focus:border-pink-500 transition-all"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-pink-600 hover:from-brand-500 hover:to-pink-500 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer"
                    >
                      Submit Verified Review
                    </button>
                  </form>
                </div>

                {/* Reviews List */}
                <div className="space-y-3">
                  {reviewsList.map((rev) => (
                    <div
                      key={rev._id}
                      className="p-4 rounded-2xl bg-white dark:bg-white/[0.02] border border-purple-200/80 dark:border-white/10 space-y-2 hover:border-pink-500/30 transition-colors shadow-sm"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-600 to-pink-600 text-white text-xs font-bold flex items-center justify-center uppercase">
                            {rev.user?.name ? rev.user.name[0] : 'S'}
                          </div>
                          <div>
                            <span className="text-xs font-bold text-slate-900 dark:text-white block">
                              {rev.user?.name || 'Verified Buyer'}
                            </span>
                            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-semibold">
                              <Check className="w-3 h-3" /> Verified Purchase
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col items-end">
                          <div className="flex text-pink-500 dark:text-pink-400">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${
                                  i < rev.rating ? 'fill-pink-500 text-pink-500 dark:fill-pink-400 dark:text-pink-400' : 'text-slate-300 dark:text-white/20'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-[10px] text-slate-400 dark:text-white/40 mt-0.5">{rev.createdAt}</span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-700 dark:text-white/80 leading-relaxed">{rev.comment}</p>

                      {rev.fit && (
                        <div className="inline-block px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/5 text-[10px] text-slate-600 dark:text-white/60 font-medium">
                          Fit: {rev.fit}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 3: Fabric & Care Specs */}
            {activeTab === 'specs' && (
              <div className="py-4 space-y-3 animate-fade-in text-xs text-slate-700 dark:text-white/80">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-purple-200 dark:border-white/10 space-y-1">
                    <span className="text-[10px] font-bold text-pink-600 dark:text-pink-400 uppercase tracking-wider">
                      Material Composition
                    </span>
                    <p className="text-xs font-semibold text-slate-900 dark:text-white">
                      100% Combed Turkish Ring-Spun Cotton
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-white/60">
                      Pre-shrunk fabric to prevent post-wash shrinkage and pilling.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-purple-200 dark:border-white/10 space-y-1">
                    <span className="text-[10px] font-bold text-pink-600 dark:text-pink-400 uppercase tracking-wider">
                      Care Instructions
                    </span>
                    <p className="text-xs font-semibold text-slate-900 dark:text-white">
                      Machine wash cold (30°C) with similar colors
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-white/60">
                      Do not bleach. Hang dry recommended. Cool iron on reverse side.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Bottom Sticky Bar */}
        <div className="px-5 py-3 border-t border-purple-200 dark:border-brand-500/20 bg-slate-50/95 dark:bg-[#06060A]/95 backdrop-blur-xl flex items-center justify-between gap-3 shrink-0">
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-600 dark:text-white/60">
            <span>Selected: <strong className="text-slate-900 dark:text-white">{selectedColor}</strong> / <strong className="text-slate-900 dark:text-white">{selectedSize}</strong></span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-white/10 dark:hover:bg-white/15 text-slate-800 dark:text-white text-xs font-semibold border border-purple-200 dark:border-white/10 transition-colors cursor-pointer"
            >
              Close Window
            </button>

            <button
              type="button"
              onClick={handleAddToCart}
              className="flex-1 sm:flex-initial py-2.5 px-5 rounded-xl bg-gradient-to-r from-brand-600 to-pink-600 hover:from-brand-500 hover:to-pink-500 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Add to Bag • ₹{product.price * quantity}</span>
            </button>
          </div>
        </div>

        {/* Share Modal Dialog */}
        <ShareModal
          isOpen={shareModalOpen}
          onClose={() => setShareModalOpen(false)}
          product={product}
        />
      </div>
    </div>
  );
};

export default ProductQuickViewModal;
