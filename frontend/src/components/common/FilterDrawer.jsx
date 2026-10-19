import React, { useState, useEffect } from 'react';
import { X, SlidersHorizontal, Star, Check, RotateCcw } from 'lucide-react';

const FilterDrawer = ({
  isOpen,
  onClose,
  initialFilters,
  onApplyFilters,
  totalMatchingCount
}) => {
  const [draftCategory, setDraftCategory] = useState(initialFilters.category || 'All');
  const [draftMaxPrice, setDraftMaxPrice] = useState(initialFilters.maxPrice || 1500);
  const [draftSizes, setDraftSizes] = useState(initialFilters.selectedSizes || []);
  const [draftColors, setDraftColors] = useState(initialFilters.selectedColors || []);
  const [draftRating, setDraftRating] = useState(initialFilters.minRating || 0);
  const [draftInStock, setDraftInStock] = useState(initialFilters.inStockOnly || false);

  useEffect(() => {
    if (isOpen) {
      setDraftCategory(initialFilters.category || 'All');
      setDraftMaxPrice(initialFilters.maxPrice || 1500);
      setDraftSizes(initialFilters.selectedSizes || []);
      setDraftColors(initialFilters.selectedColors || []);
      setDraftRating(initialFilters.minRating || 0);
      setDraftInStock(initialFilters.inStockOnly || false);
    }
  }, [isOpen, initialFilters]);

  if (!isOpen) return null;

  const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3Y', '4Y', '6Y', '8Y', '10Y', '12Y'];
  const availableColors = [
    { name: 'Jet Black', hex: '#111827' },
    { name: 'Crisp White', hex: '#F3F4F6' },
    { name: 'Sage Green', hex: '#6B8E23' },
    { name: 'Sky Blue', hex: '#38BDF8' },
    { name: 'Sand Beige', hex: '#D2B48C' },
    { name: 'Mustard Yellow', hex: '#EAB308' },
    { name: 'Olive Drab', hex: '#556B2F' },
    { name: 'Classic Indigo', hex: '#3B82F6' },
  ];

  const handleSizeToggle = (size) => {
    setDraftSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const handleColorToggle = (colorName) => {
    setDraftColors((prev) =>
      prev.includes(colorName) ? prev.filter((c) => c !== colorName) : [...prev, colorName]
    );
  };

  const handleReset = () => {
    setDraftCategory('All');
    setDraftMaxPrice(1500);
    setDraftSizes([]);
    setDraftColors([]);
    setDraftRating(0);
    setDraftInStock(false);
  };

  const handleApply = () => {
    onApplyFilters({
      category: draftCategory,
      maxPrice: draftMaxPrice,
      selectedSizes: draftSizes,
      selectedColors: draftColors,
      minRating: draftRating,
      inStockOnly: draftInStock
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      {/* Backdrop */}
      <div onClick={onClose} className="absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity" />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-[#0F1420] border-l border-purple-200 dark:border-white/10 shadow-2xl flex flex-col text-slate-900 dark:text-white">
          {/* Header */}
          <div className="p-6 border-b border-purple-200 dark:border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 dark:bg-brand-600/20 dark:text-brand-400 flex items-center justify-center border border-purple-200 dark:border-brand-500/30">
                <SlidersHorizontal className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">Filter Catalog</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Refine by department, price, sizes & colors</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Department */}
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-300 uppercase tracking-wider mb-3">
                Department
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {['All', 'Men', 'Women', 'Kids'].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setDraftCategory(cat)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border text-center ${
                      draftCategory === cat
                        ? 'bg-brand-600 text-white border-brand-500 shadow-md shadow-brand-500/30'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-950 border-purple-200 dark:bg-white/5 dark:border-white/10 dark:text-slate-400 dark:hover:text-white dark:hover:border-white/20'
                    }`}
                  >
                    {cat === 'All' ? 'All Collections' : `${cat}'s Apparel`}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="pt-4 border-t border-purple-200 dark:border-white/10">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-300 uppercase tracking-wider">
                  Maximum Price
                </h4>
                <span className="text-sm font-extrabold text-purple-700 dark:text-brand-300">₹{draftMaxPrice}</span>
              </div>
              <input
                type="range"
                min="299"
                max="1500"
                step="50"
                value={draftMaxPrice}
                onChange={(e) => setDraftMaxPrice(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-500"
              />
              <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">
                <span>₹299</span>
                <span>₹1500+</span>
              </div>
            </div>

            {/* Sizes */}
            <div className="pt-4 border-t border-purple-200 dark:border-white/10">
              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-300 uppercase tracking-wider mb-3">
                Available Sizes
              </h4>
              <div className="grid grid-cols-4 gap-2">
                {availableSizes.map((size) => {
                  const isSelected = draftSizes.includes(size);
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => handleSizeToggle(size)}
                      className={`py-2 text-xs font-bold rounded-xl border transition-all text-center ${
                        isSelected
                          ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-900 border-slate-950 dark:border-white shadow-md'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-950 border-purple-200 dark:bg-white/5 dark:text-slate-300 dark:border-white/10 dark:hover:border-white/20'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Colors */}
            <div className="pt-4 border-t border-purple-200 dark:border-white/10">
              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-300 uppercase tracking-wider mb-3">
                Colors
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {availableColors.map((color) => {
                  const isSelected = draftColors.includes(color.name);
                  return (
                    <button
                      key={color.name}
                      type="button"
                      onClick={() => handleColorToggle(color.name)}
                      className={`flex items-center gap-2.5 p-2 rounded-xl border text-left text-xs transition-all ${
                        isSelected
                          ? 'bg-brand-600/30 border-brand-500 text-brand-900 dark:text-white shadow-sm font-semibold'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-purple-200 dark:bg-white/5 dark:border-white/10 dark:text-slate-300 dark:hover:border-white/20'
                      }`}
                    >
                      <span
                        className="w-4 h-4 rounded-full border border-black/20 dark:border-white/30 shrink-0"
                        style={{ backgroundColor: color.hex }}
                      />
                      <span className="truncate text-xs font-medium">{color.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Minimum Rating */}
            <div className="pt-4 border-t border-purple-200 dark:border-white/10">
              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-300 uppercase tracking-wider mb-2">
                Minimum Rating
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {[4, 3].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => setDraftRating(draftRating === rating ? 0 : rating)}
                    className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      draftRating === rating
                        ? 'bg-gradient-to-r from-brand-600 to-pink-600 text-white border-pink-500 shadow-sm'
                        : 'bg-slate-100 hover:bg-slate-200 border-purple-200 text-slate-700 dark:bg-black/60 dark:border-brand-500/20 dark:text-white/70 hover:border-pink-500/40'
                    }`}
                  >
                    <Star className="w-3.5 h-3.5 fill-pink-500 text-pink-500 dark:fill-pink-400 dark:text-pink-400" />
                    <span>{rating}★ & above</span>
                  </button>
                ))}
              </div>
            </div>

            {/* In-Stock Toggle */}
            <div className="pt-4 border-t border-purple-200 dark:border-brand-500/20 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block">In-Stock Only</span>
                <span className="text-[11px] text-slate-500 dark:text-white/60">Hide sold-out styles</span>
              </div>
              <input
                type="checkbox"
                checked={draftInStock}
                onChange={(e) => setDraftInStock(e.target.checked)}
                className="w-4 h-4 rounded bg-white dark:bg-black border-purple-300 dark:border-brand-500/30 accent-pink-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Footer with Apply and Reset Buttons */}
          <div className="p-6 border-t border-purple-200 dark:border-brand-500/20 bg-slate-50/95 dark:bg-black flex items-center gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="flex-1 py-3 px-4 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 border border-purple-200 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer dark:bg-black dark:hover:bg-white/10 dark:text-white/70 dark:hover:text-white dark:border-brand-500/30"
            >
              <RotateCcw className="w-3.5 h-3.5 text-pink-500 dark:text-pink-400" />
              <span>Reset</span>
            </button>

            <button
              type="button"
              onClick={handleApply}
              className="flex-[2] py-3 px-4 rounded-xl bg-gradient-to-r from-brand-600 to-pink-600 hover:from-brand-500 hover:to-pink-500 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-brand-600/30 transition-all cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Apply Filters</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterDrawer;
