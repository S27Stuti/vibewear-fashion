import React from 'react';
import HeroBanner from '../components/home/HeroBanner';
import CategoryHighlights from '../components/home/CategoryHighlights';
import ProductCard from '../components/common/ProductCard';
import { ArrowRight, Sparkles, Flame, ShieldCheck, Zap, Package, Truck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const HomePage = ({
  products,
  onSelectProduct,
  onQuickView,
  onSelectCategory,
  onNavigateProducts,
  onNavigateCustomer,
  onOpenAI,
  onTrackOrder
}) => {
  const { userOrders, openProfile } = useAuth();
  const featuredProducts = products.filter((p) => p.isFeatured).slice(0, 8);
  const displayProducts = featuredProducts.length > 0 ? featuredProducts : products.slice(0, 8);

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <HeroBanner
        onSelectCategory={onSelectCategory}
        onNavigateProducts={onNavigateProducts}
        onNavigateCustomer={onNavigateCustomer}
      />

      {/* Prominent My Orders Access Card on Home Page */}
      {userOrders && userOrders.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 sm:-mt-10 relative z-20 animate-slide-up">
          <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#0D0B18] border-2 border-purple-200 dark:border-pink-500/40 shadow-2xl backdrop-blur-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-5 text-slate-900 dark:text-white">
            <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-pink-500/10 to-brand-600/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-start sm:items-center gap-4 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 via-pink-600 to-purple-600 flex items-center justify-center text-white shadow-xl shadow-pink-500/30 shrink-0">
                <Package className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-pink-100 dark:bg-pink-500/20 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-500/30">
                    📦 {userOrders.length} Order{userOrders.length > 1 ? 's' : ''} Placed
                  </span>
                  <span className="text-xs font-bold text-slate-500 dark:text-white/60">
                    Latest: <strong className="font-mono text-slate-900 dark:text-white">#{userOrders[0]?.id || userOrders[0]?._id}</strong>
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-black font-display text-slate-950 dark:text-white">
                  Manage Your Orders, Track Delivery & Request Returns
                </h3>
                <p className="text-xs text-slate-600 dark:text-white/70">
                  Current Status: <strong className="text-pink-600 dark:text-pink-400 font-bold">{userOrders[0]?.orderStatus || 'Confirmed'}</strong> • Full support for Cancel Order, 7-Day Doorstep Return & Size/Color Exchange.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto relative z-10 shrink-0">
              <button
                type="button"
                onClick={() => {
                  if (onNavigateCustomer) {
                    onNavigateCustomer();
                  } else {
                    openProfile('orders');
                  }
                }}
                className="flex-1 sm:flex-none py-3 px-5 rounded-xl bg-gradient-to-r from-brand-600 via-pink-600 to-purple-600 hover:from-brand-500 hover:to-pink-500 text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-pink-500/30 hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <Package className="w-4 h-4 text-white" />
                <span>View All My Orders</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (onTrackOrder) onTrackOrder(userOrders[0]?.id || userOrders[0]?._id);
                }}
                className="py-3 px-4 rounded-xl bg-purple-50 hover:bg-purple-100 dark:bg-white/10 dark:hover:bg-white/20 border border-purple-200 dark:border-white/10 text-slate-900 dark:text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Truck className="w-4 h-4 text-pink-500" />
                <span>Live Tracking</span>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Category Department Highlights */}
      <CategoryHighlights
        onSelectCategory={onSelectCategory}
        onNavigateProducts={onNavigateProducts}
      />

      {/* Trending / Featured Drops Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-pink-500 mb-1">
              <Flame className="w-4 h-4 text-pink-500" />
              <span>Weekly Trending Drops</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white">
              Most Wanted Styles
            </h2>
          </div>
          <button
            onClick={() => {
              onSelectCategory('All');
              if (onNavigateProducts) onNavigateProducts();
            }}
            className="inline-flex items-center gap-2 text-xs font-bold text-pink-600 dark:text-pink-400 hover:text-pink-700 dark:hover:text-pink-300 transition-colors uppercase tracking-wider group cursor-pointer"
          >
            <span>View All Styles</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {displayProducts.map((product) => (
            <ProductCard
              key={product._id || product.id}
              product={product}
              onSelect={onSelectProduct}
              onSelectProduct={onSelectProduct}
              onQuickView={onQuickView || onSelectProduct}
            />
          ))}
        </div>
      </section>

      {/* VibeAI Fashion Stylist Spotlight Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-purple-50 via-pink-50/60 to-purple-100/70 dark:from-[#0E0616] dark:via-[#12081E] dark:to-[#1A0A2A] border border-purple-200 dark:border-pink-500/40 p-8 sm:p-10 lg:p-12 shadow-xl dark:shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 hover-glow">
          <div className="absolute top-0 right-0 w-96 h-96 bg-pink-600/10 dark:bg-pink-600/20 rounded-full blur-[110px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-brand-600/10 dark:bg-brand-600/25 rounded-full blur-[90px] pointer-events-none" />

          <div className="relative z-10 max-w-xl space-y-3 text-center md:text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 dark:bg-pink-500/20 text-purple-800 dark:text-pink-300 border border-purple-200 dark:border-pink-500/40 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-pink-500 animate-pulse" />
              Powered by VibeWear AI Engine
            </span>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-display text-slate-950 dark:text-white">
              Can't Decide What to Wear? <span className="text-pink-600 dark:text-pink-400">Let VibeAI Style You.</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-white/70 leading-relaxed font-normal">
              Generate 3-piece complete outfits tailored to your party, college, or streetwear vibe. Predict your guaranteed size with zero returns, or chat with our live AI stylist!
            </p>
            <div className="pt-2 flex flex-wrap gap-3 justify-center md:justify-start">
              <button
                type="button"
                onClick={onOpenAI}
                className="py-3 px-6 rounded-xl bg-gradient-to-r from-brand-600 via-pink-600 to-purple-600 hover:from-brand-500 hover:to-pink-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-xl shadow-pink-500/30 transition-all cursor-pointer hover:scale-105 active:scale-95 btn-solid-cta"
              >
                <Sparkles className="w-4 h-4 text-white" />
                <span className="text-white">Launch VibeAI Stylist</span>
                <ArrowRight className="w-4 h-4 ml-1 text-white" />
              </button>
            </div>
          </div>

          <div className="relative z-10 flex flex-col gap-2.5 w-full md:w-auto shrink-0 max-w-xs text-xs">
            <div className="p-3.5 rounded-2xl bg-white dark:bg-black/60 border border-purple-200 dark:border-brand-500/30 backdrop-blur-md flex items-center gap-3 shadow-sm dark:shadow-none">
              <div className="w-8 h-8 rounded-xl bg-pink-100 dark:bg-pink-500/20 text-pink-600 dark:text-pink-300 flex items-center justify-center font-bold">
                ✨
              </div>
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">AI Outfit Matcher</span>
                <span className="text-slate-500 dark:text-white/60 text-[10px]">Complete 3-piece looks with 98% match</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white dark:bg-black/60 border border-purple-200 dark:border-brand-500/30 backdrop-blur-md flex items-center gap-3 shadow-sm dark:shadow-none">
              <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-brand-500/20 text-purple-700 dark:text-brand-300 flex items-center justify-center font-bold">
                📏
              </div>
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">AI Fit & Size Finder</span>
                <span className="text-slate-500 dark:text-white/60 text-[10px]">Biometric height & weight prediction</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white dark:bg-black/60 border border-purple-200 dark:border-brand-500/30 backdrop-blur-md flex items-center gap-3 shadow-sm dark:shadow-none">
              <div className="w-8 h-8 rounded-xl bg-pink-100 dark:bg-pink-500/20 text-pink-600 dark:text-pink-300 flex items-center justify-center font-bold">
                🤖
              </div>
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">Stylist Chatbot</span>
                <span className="text-slate-500 dark:text-white/60 text-[10px]">Instant advice for purple & pink aesthetics</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Editorial Streetwear Promo Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-purple-50 via-pink-50/40 to-white dark:from-[#0B0B14] dark:via-[#110B1E] dark:to-[#170B28] border border-purple-200 dark:border-brand-500/25 p-8 sm:p-12 lg:p-16 hover-glow shadow-md dark:shadow-2xl">
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-brand-600/10 dark:bg-brand-600/25 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute -left-20 -top-20 w-80 h-80 bg-pink-600/10 dark:bg-pink-600/20 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10 max-w-xl space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 dark:bg-pink-500/15 text-purple-800 dark:text-pink-300 border border-purple-200 dark:border-pink-500/30 text-xs font-semibold">
              <Zap className="w-3.5 h-3.5 text-pink-500" />
              Limited Archive Release
            </span>
            <h3 className="text-3xl sm:text-4xl font-extrabold font-display text-slate-950 dark:text-white">
              Heavyweight Fabrics. Minimalist Aesthetics.
            </h3>
            <p className="text-sm text-slate-700 dark:text-white/70 leading-relaxed font-normal">
              Every VibeWear garment undergoes double-pre-shrinking, reinforced neckline stitching, and reactive dyeing for rich, lasting hues. Built to withstand hundreds of wears.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <button
                onClick={() => {
                  onSelectCategory('Men');
                  if (onNavigateProducts) onNavigateProducts();
                }}
                className="px-6 py-3 bg-gradient-to-r from-brand-600 to-pink-600 hover:from-brand-500 hover:to-pink-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-brand-600/30 transition-all cursor-pointer hover-glow btn-solid-cta"
              >
                <span className="text-white">Explore The Edit</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
