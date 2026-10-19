import React from 'react';
import { ArrowRight, Sparkles, Star, Flame } from 'lucide-react';

const HeroBanner = ({ onSelectCategory, onNavigateProducts }) => {
  const handleCta = (category) => {
    onSelectCategory(category);
    if (onNavigateProducts) onNavigateProducts();
  };

  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:py-24">
      {/* Background Decorative Gradients - Strict Purple & Pink */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-brand-600/10 dark:bg-brand-600/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 right-10 w-96 h-96 bg-pink-600/10 dark:bg-pink-600/15 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-100/90 dark:bg-brand-500/15 border border-purple-200 dark:border-brand-500/30 text-purple-700 dark:text-brand-300 text-xs font-semibold shadow-sm">
              <Flame className="w-4 h-4 text-pink-500" />
              <span className="font-bold tracking-wide">Autumn / Winter 2026 Collection Dropped</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-950 dark:text-white leading-[1.1]">
              WEAR YOUR VIBE. <br />
              <span className="bg-gradient-to-r from-purple-700 via-pink-600 to-purple-800 dark:from-brand-400 dark:via-pink-400 dark:to-purple-300 bg-clip-text text-transparent drop-shadow-sm font-black">
                UNAPOLOGETICALLY.
              </span>
            </h1>

            {/* Description */}
            <p className="text-sm sm:text-base text-slate-700 dark:text-white/80 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              High-tier urban apparel designed for everyday statement makers. From heavy 240 GSM oversized tees to effortless resort silhouettes and vibrant kids wear.
            </p>

            {/* Call to Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
              <button
                type="button"
                onClick={() => handleCta('Men')}
                className="px-6 py-3.5 bg-gradient-to-r from-brand-600 via-purple-600 to-pink-600 hover:from-brand-500 hover:to-pink-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-brand-600/30 hover:shadow-pink-600/40 flex items-center gap-2 transition-all cursor-pointer hover-glow active:scale-95 btn-solid-cta"
              >
                <span className="text-white">Shop Men</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>

              <button
                type="button"
                onClick={() => handleCta('Women')}
                className="px-6 py-3.5 bg-white hover:bg-purple-50 dark:bg-black/70 dark:hover:bg-pink-600/20 border-2 border-purple-200 hover:border-pink-500 dark:border-brand-500/40 text-slate-950 dark:text-white font-extrabold text-xs uppercase tracking-wider rounded-xl backdrop-blur-md flex items-center gap-2 transition-all cursor-pointer shadow-sm hover:shadow-md active:scale-95 group"
              >
                <span className="text-slate-950 dark:text-white group-hover:text-pink-600 dark:group-hover:text-pink-300 transition-colors">Shop Women</span>
                <ArrowRight className="w-4 h-4 text-pink-600 dark:text-pink-400 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                type="button"
                onClick={() => handleCta('Kids')}
                className="px-6 py-3.5 bg-white hover:bg-purple-50 dark:bg-black/70 dark:hover:bg-brand-600/20 border-2 border-purple-200 hover:border-brand-500 dark:border-brand-500/40 text-slate-950 dark:text-white font-extrabold text-xs uppercase tracking-wider rounded-xl backdrop-blur-md flex items-center gap-2 transition-all cursor-pointer shadow-sm hover:shadow-md active:scale-95 group"
              >
                <span className="text-slate-950 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-300 transition-colors">Shop Kids</span>
                <ArrowRight className="w-4 h-4 text-brand-600 dark:text-brand-400 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Trust and Social Proof Badges */}
            <div className="pt-6 border-t border-purple-200 dark:border-brand-500/20 flex flex-wrap items-center justify-center lg:justify-start gap-8 text-xs text-slate-700 dark:text-white/70">
              <div className="flex items-center gap-2">
                <div className="flex text-pink-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-pink-500 text-pink-500" />
                  ))}
                </div>
                <span className="font-bold text-slate-900 dark:text-white">4.9/5 Rating</span>
                <span className="text-slate-500 dark:text-white/50 font-normal">(18k+ reviews)</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                <span className="font-bold text-slate-900 dark:text-white">100% Combed Cotton</span>
              </div>
            </div>
          </div>

          {/* Right Hero Image Collage */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-sm sm:max-w-md lg:max-w-none">
              {/* Main Fashion Feature Card */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-purple-200 dark:border-brand-500/30 group hover-glow">
                <img
                  src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80"
                  alt="VibeWear Featured Fashion"
                  className="w-full h-[460px] object-cover object-top group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent" />

                <div className="absolute bottom-6 left-6 right-6 keep-white">
                  <span className="inline-block px-3 py-1 bg-gradient-to-r from-brand-600 to-pink-600 backdrop-blur-md text-white text-[11px] font-bold rounded-full uppercase tracking-wider mb-2 shadow-md">
                    Trending Right Now
                  </span>
                  <h3 className="text-xl font-bold font-display text-white">
                    Contemporary Street Silhouettes
                  </h3>
                  <p className="text-xs text-white/80 mt-1 line-clamp-1 font-normal">
                    Curated collection engineered for effortless daily swagger.
                  </p>
                </div>
              </div>

              {/* Floating Mini Card: Men Highlight */}
              <div className="absolute -top-6 -left-6 hidden sm:flex items-center gap-3 p-3 rounded-2xl bg-white dark:bg-[#0B0B12]/95 border border-purple-200 dark:border-brand-500/30 shadow-xl animate-float hover:border-pink-500/50 transition-all">
                <img
                  src="https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=150&q=80"
                  alt="Men Drop"
                  className="w-12 h-12 rounded-xl object-cover"
                />
                <div>
                  <div className="text-[11px] font-bold text-slate-900 dark:text-white">240 GSM Oversized</div>
                  <div className="text-[10px] text-pink-600 dark:text-pink-500 font-bold">₹499 • Fast Selling</div>
                </div>
              </div>

              {/* Floating Mini Card: Kids Highlight */}
              <div className="absolute -bottom-6 -right-6 hidden sm:flex items-center gap-3 p-3 rounded-2xl bg-white dark:bg-[#0B0B12]/95 border border-purple-200 dark:border-brand-500/30 shadow-xl hover:border-pink-500/50 transition-all">
                <img
                  src="https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&w=150&q=80"
                  alt="Kids Drop"
                  className="w-12 h-12 rounded-xl object-cover"
                />
                <div>
                  <div className="text-[11px] font-bold text-slate-900 dark:text-white">Kids Adventure Hoodies</div>
                  <div className="text-[10px] text-pink-600 dark:text-pink-500 font-bold">100% Organic Fleece</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
