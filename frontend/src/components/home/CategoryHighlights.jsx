import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { FALLBACK_CATEGORIES } from '../../data/fallbackProducts';

const CategoryHighlights = ({ onSelectCategory, onNavigateProducts }) => {
  const handleCategoryClick = (targetAudience) => {
    onSelectCategory(targetAudience);
    if (onNavigateProducts) onNavigateProducts();
  };

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
        <div>
          <span className="text-xs uppercase font-extrabold tracking-widest text-pink-500">
            Curated Lines
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white mt-1">
            Shop By Department
          </h2>
        </div>
        <p className="text-xs text-slate-600 dark:text-white/60 max-w-md mt-2 md:mt-0 font-normal">
          Tailored silhouettes and premium textiles designed specifically for every lifestyle.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {FALLBACK_CATEGORIES.map((cat) => (
          <div
            key={cat._id}
            onClick={() => handleCategoryClick(cat.targetAudience)}
            className="group relative h-96 rounded-3xl overflow-hidden cursor-pointer border border-purple-200 dark:border-brand-500/20 shadow-xl transition-all duration-500 hover:border-pink-500/60 hover:shadow-glow-combo hover:-translate-y-1.5"
          >
            {/* Background Image */}
            <img
              src={cat.image}
              alt={cat.name}
              className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out"
            />

            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/10 group-hover:via-black/50 transition-colors" />

            {/* Category badge */}
            <div className="absolute top-5 left-5 keep-white">
              <span className="px-3 py-1 bg-black/70 backdrop-blur-md rounded-full text-[11px] font-semibold text-white border border-brand-500/30">
                {cat.itemCount}
              </span>
            </div>

            {/* Bottom Content - Keep White on dark photo */}
            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between keep-white">
              <div>
                <span className="text-xs font-semibold text-pink-400 uppercase tracking-wider">
                  Collection
                </span>
                <h3 className="text-2xl font-bold font-display text-white mt-0.5 group-hover:text-pink-300 transition-colors">
                  {cat.targetAudience}
                </h3>
                <p className="text-xs text-white/80 line-clamp-1 mt-1 font-normal">
                  {cat.description}
                </p>
              </div>

              <div className="w-10 h-10 rounded-full bg-white/10 group-hover:bg-gradient-to-tr group-hover:from-brand-600 group-hover:to-pink-600 border border-white/20 group-hover:border-pink-400 flex items-center justify-center text-white transition-all transform group-hover:rotate-45 shrink-0 shadow-lg">
                <ArrowUpRight className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CategoryHighlights;
