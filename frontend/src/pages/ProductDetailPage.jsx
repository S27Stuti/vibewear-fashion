import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import ShareModal from '../components/common/ShareModal';
import { getColorMatchedImage, getCleanProductImages } from '../utils/productImageUtils';
import {
  Star,
  ShoppingBag,
  Zap,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
  Plus,
  Minus,
  MessageSquare,
  ArrowLeft,
  Heart,
  Share2
} from 'lucide-react';

const ProductDetailPage = ({ product, onBack, onOpenCheckout }) => {
  const { addToCart, showToast } = useCart();
  const { user, isAuthenticated, requireAuth } = useAuth();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const productId = product._id || product.id;
  const isWishlisted = isInWishlist(productId);

  const initialColor = product?.colors?.[0] || 'Standard';
  const [selectedColor, setSelectedColor] = useState(initialColor);
  const [selectedImage, setSelectedImage] = useState(() => getColorMatchedImage(product, initialColor));
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || 'M');
  const [quantity, setQuantity] = useState(1);
  const [reviewsList, setReviewsList] = useState(product?.reviews || []);
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);

  useEffect(() => {
    if (product) {
      const c = product.colors?.[0] || 'Standard';
      setSelectedColor(c);
      setSelectedImage(getColorMatchedImage(product, c));
      setSelectedSize(product.sizes?.[0] || 'M');
    }
  }, [product]);

  // Handle color change and dynamically update product image to exact garment color
  const handleColorChange = (color) => {
    setSelectedColor(color);
    const matched = getColorMatchedImage(product, color);
    setSelectedImage(matched);
  };

  // Handle Wishlist Heart Button
  const handleHeartClick = () => {
    const added = toggleWishlist(product);
    showToast(added ? `Added "${product.title}" to Wishlist ❤️` : `Removed from Wishlist`);
  };

  // Handle Share Button - opens interactive share popover
  const handleShareClick = () => {
    setShareModalOpen(true);
  };

  // Handle Add to Cart with Auth Guard
  const handleAddToCart = () => {
    requireAuth(() => {
      addToCart(product, selectedSize, selectedColor, quantity);
    });
  };

  // Handle Buy Now with Auth Guard & Direct Checkout Modal
  const handleBuyNow = () => {
    requireAuth(() => {
      addToCart(product, selectedSize, selectedColor, quantity);
      if (onOpenCheckout) {
        onOpenCheckout();
      }
    });
  };

  // Handle Review Submission with Auth Guard
  const handleAddReview = (e) => {
    e.preventDefault();
    requireAuth((currentUser) => {
      if (!newReviewComment.trim()) return;

      const newReview = {
        _id: 'rev_' + Date.now(),
        user: { name: currentUser.name || 'Verified Customer' },
        rating: newReviewRating,
        comment: newReviewComment,
        createdAt: new Date().toISOString()
      };

      setReviewsList([newReview, ...reviewsList]);
      setNewReviewComment('');
      setReviewSubmitted(true);
      setTimeout(() => setReviewSubmitted(false), 3000);
      showToast('Thank you! Your verified review has been published.');
    });
  };

  const images = getCleanProductImages(product, selectedColor);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white transition-colors group cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span>Back to Collection</span>
      </button>

      {/* Main Product Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
          {/* Thumbnails */}
          <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-visible shrink-0 pb-2 sm:pb-0">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(img)}
                className={`w-16 h-20 sm:w-20 sm:h-24 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                  selectedImage === img
                    ? 'border-brand-500 shadow-md shadow-brand-500/30 ring-2 ring-brand-500/30'
                    : 'border-slate-200 dark:border-white/10 opacity-80 hover:opacity-100 hover:border-purple-300'
                }`}
              >
                <img
                  src={img}
                  alt="Thumbnail"
                  className="w-full h-full object-cover object-center"
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
              </button>
            ))}
          </div>

          {/* Main Hero Image - Emphasizing full clothing */}
          <div className="flex-1 aspect-[4/5] rounded-3xl overflow-hidden bg-slate-100 dark:bg-black/60 border border-purple-200 dark:border-white/10 relative group shadow-xl flex items-center justify-center">
            <img
              src={selectedImage}
              alt={product.title}
              className="w-full h-full object-contain md:object-cover object-center transition-transform duration-700 ease-out group-hover:scale-102"
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
            {product.isFeatured && (
              <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-gradient-to-r from-brand-600 to-pink-600 text-white text-xs font-bold uppercase tracking-wider shadow-lg">
                Featured Drop
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Product Purchase Info */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            {/* Category / Department Tag & Working Share/Heart */}
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-extrabold tracking-widest text-brand-600 dark:text-brand-400">
                {product.category} • {product.subCategory || 'Urban Streetwear'}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleShareClick}
                  className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white transition-all cursor-pointer active:scale-95 shadow-xs"
                  title="Share this style"
                  aria-label="Share"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <button
                  onClick={handleHeartClick}
                  className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:text-pink-600 dark:hover:text-pink-400 transition-all cursor-pointer active:scale-95 shadow-xs"
                  title={isWishlisted ? 'Saved in Wishlist' : 'Add to Wishlist'}
                  aria-label="Wishlist"
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-pink-500 text-pink-500' : ''}`} />
                </button>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-950 dark:text-white mt-1.5 leading-snug">
              {product.title}
            </h1>

            {/* Rating & Reviews */}
            <div className="flex items-center gap-2 mt-2 text-xs">
              <div className="flex items-center text-pink-500 dark:text-pink-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating || 5)
                        ? 'fill-pink-500 text-pink-500 dark:fill-pink-400 dark:text-pink-400'
                        : 'text-slate-300 dark:text-white/20'
                    }`}
                  />
                ))}
              </div>
              <span className="font-bold text-slate-900 dark:text-white text-sm">{product.rating || 4.8}</span>
              <span className="text-slate-500 dark:text-white/60">({reviewsList.length} customer reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mt-4">
              <span className="text-3xl font-black text-slate-950 dark:text-white">
                ₹{product.price}
              </span>
              <span className="text-xs text-pink-700 dark:text-pink-300 font-semibold bg-pink-100 dark:bg-pink-500/15 px-2.5 py-1 rounded-full border border-pink-300 dark:border-pink-500/30">
                In Stock ({product.stock} units available)
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            {product.description}
          </p>

          {/* Color Selector with Dynamic Image Update */}
          {product.colors && product.colors.length > 0 && (
            <div className="pt-2">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Color Variant: <span className="text-brand-600 dark:text-brand-300 normal-case font-semibold">{selectedColor}</span>
                </label>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Click to view variant
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => handleColorChange(color)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer flex items-center gap-2 ${
                      selectedColor === color
                        ? 'bg-brand-600 text-white border-brand-500 shadow-md ring-2 ring-brand-400/30'
                        : 'bg-slate-100 dark:bg-white/5 text-slate-800 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:border-purple-300 dark:hover:border-white/30 hover:bg-slate-200/70 dark:hover:bg-white/10'
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
                            : color.toLowerCase().includes('green')
                            ? '#556B2F'
                            : color.toLowerCase().includes('blue')
                            ? '#38BDF8'
                            : color.toLowerCase().includes('yellow')
                            ? '#EAB308'
                            : color.toLowerCase().includes('beige') || color.toLowerCase().includes('sand')
                            ? '#D2B48C'
                            : '#8B5CF6'
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
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Select Size
                </label>
                <span className="text-xs text-brand-600 dark:text-brand-400 hover:underline cursor-pointer">
                  Size Guide & Fit
                </span>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-2.5 text-xs font-bold rounded-xl border transition-all text-center cursor-pointer ${
                      selectedSize === size
                        ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900 dark:border-white shadow-md'
                        : 'bg-slate-100 dark:bg-white/5 text-slate-800 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:border-purple-300 dark:hover:border-white/20 hover:bg-slate-200/70 dark:hover:bg-white/10'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity & CTA Buttons */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              {/* Quantity Selector */}
              <div className="flex items-center gap-3 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-1.5 text-xs">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="font-bold text-slate-900 dark:text-white px-2">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Add to Cart Button (With Auth Guard) */}
              <button
                onClick={handleAddToCart}
                className="flex-1 py-3.5 px-4 rounded-xl bg-gradient-to-r from-brand-600 to-pink-600 hover:from-brand-500 hover:to-pink-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-brand-600/30 hover:shadow-pink-600/40 transition-all cursor-pointer active:scale-98"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>
            </div>

            {/* Buy Now Button (Instant Secure Checkout) */}
            <button
              onClick={handleBuyNow}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-pink-600 via-purple-600 to-brand-600 hover:from-pink-500 hover:to-brand-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-pink-600/30 transition-all cursor-pointer active:scale-98"
            >
              <Zap className="w-4 h-4 text-pink-200" />
              <span>Buy It Now • Express Checkout</span>
            </button>
          </div>

          {/* Trust Guarantees */}
          <div className="p-4 rounded-2xl bg-white dark:bg-black/60 border border-purple-200 dark:border-brand-500/20 space-y-2.5 text-xs text-slate-700 dark:text-white/70 shadow-sm">
            <div className="flex items-center gap-2.5">
              <Truck className="w-4 h-4 text-pink-600 dark:text-pink-400 shrink-0" />
              <span>Complimentary express delivery on orders over ₹799</span>
            </div>
            <div className="flex items-center gap-2.5">
              <RotateCcw className="w-4 h-4 text-pink-600 dark:text-pink-400 shrink-0" />
              <span>Free 30-day effortless returns and instant exchanges</span>
            </div>
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-pink-600 dark:text-pink-400 shrink-0" />
              <span>Guaranteed authentic premium apparel</span>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <section className="pt-8 border-t border-purple-200 dark:border-brand-500/20 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-2xl font-bold font-display text-slate-900 dark:text-white">
              Customer Reviews & Feedback
            </h3>
            <p className="text-xs text-slate-500 dark:text-white/60 mt-1">
              Verified experiences from shoppers who wear this silhouette daily.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex text-pink-500 dark:text-pink-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-pink-500 text-pink-500 dark:fill-pink-400 dark:text-pink-400" />
              ))}
            </div>
            <span className="font-bold text-slate-900 dark:text-white text-base">{product.rating || 4.8} / 5</span>
          </div>
        </div>

        {/* Write a Review Box */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#0B0B12] border border-purple-200 dark:border-brand-500/25 shadow-sm">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-pink-600 dark:text-pink-400" />
            <span>Write a Customer Review</span>
          </h4>
          <p className="text-xs text-slate-500 dark:text-white/60 mb-4">
            {isAuthenticated
              ? `Reviewing as ${user.name}`
              : 'Sign in to share your thoughts on fit, fabric, and quality.'}
          </p>

          <form onSubmit={handleAddReview} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-white/80 mb-1.5">
                Rating
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setNewReviewRating(star)}
                    className="p-1 text-slate-300 hover:text-pink-500 dark:text-white/30 dark:hover:text-pink-400 transition-colors cursor-pointer"
                  >
                    <Star
                      className={`w-5 h-5 ${
                        star <= newReviewRating ? 'fill-pink-500 text-pink-500 dark:fill-pink-400 dark:text-pink-400' : ''
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs text-slate-700 dark:text-white/80 font-semibold ml-2">
                  {newReviewRating} Star{newReviewRating > 1 ? 's' : ''}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-white/80 mb-1.5">
                Your Review
              </label>
              <textarea
                rows={3}
                required
                value={newReviewComment}
                onChange={(e) => setNewReviewComment(e.target.value)}
                placeholder="Share your thoughts on the sizing, material feel, and overall drape..."
                className="w-full p-3 bg-slate-50 dark:bg-black/60 border border-purple-200 dark:border-brand-500/30 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/30 focus:outline-none focus:border-pink-500 transition-all"
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-pink-600 hover:from-brand-500 hover:to-pink-500 text-white text-xs font-bold transition-all shadow-md shadow-brand-500/30 cursor-pointer"
            >
              Submit Review
            </button>

            {reviewSubmitted && (
              <span className="text-xs text-pink-600 dark:text-pink-400 ml-3 font-semibold">
                ✔ Review submitted successfully!
              </span>
            )}
          </form>
        </div>

        {/* Existing Reviews List */}
        <div className="space-y-4">
          {reviewsList.length === 0 ? (
            <p className="text-xs text-slate-400 dark:text-white/50 italic">No reviews yet. Be the first to review this style!</p>
          ) : (
            reviewsList.map((rev) => (
              <div
                key={rev._id}
                className="p-4 rounded-xl bg-white dark:bg-black/50 border border-purple-200/80 dark:border-brand-500/20 space-y-2 shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-600 to-pink-600 text-white font-bold text-xs flex items-center justify-center uppercase">
                      {rev.user?.name ? rev.user.name[0] : 'U'}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">
                        {rev.user?.name || 'Customer'}
                      </span>
                      <span className="text-[10px] text-emerald-600 dark:text-pink-400 font-semibold">Verified Buyer</span>
                    </div>
                  </div>
                  <div className="flex text-pink-500 dark:text-pink-400">
                    {[...Array(rev.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-pink-500 text-pink-500 dark:fill-pink-400 dark:text-pink-400" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-slate-700 dark:text-white/80 leading-relaxed pl-9">
                  "{rev.comment}"
                </p>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Share Modal Dialog */}
      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        product={product}
      />
    </div>
  );
};

export default ProductDetailPage;
