import React, { useState, useMemo } from 'react';
import ProductCard from '../components/common/ProductCard';
import FilterDrawer from '../components/common/FilterDrawer';
import {
  SlidersHorizontal,
  X,
  RotateCcw,
  Star,
  Search,
  Sparkles,
  ArrowUpDown
} from 'lucide-react';

const ProductListingPage = ({
  products,
  currentCategory,
  onSelectCategory,
  onSelectProduct,
  searchTerm,
  onClearSearch
}) => {
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  // Active applied filters
  const [appliedFilters, setAppliedFilters] = useState({
    category: currentCategory || 'All',
    maxPrice: 1500,
    selectedSizes: [],
    selectedColors: [],
    minRating: 0,
    inStockOnly: false
  });

  const [sortBy, setSortBy] = useState('featured');

  // Synchronize category if prop changes from navbar
  React.useEffect(() => {
    if (currentCategory && currentCategory !== appliedFilters.category) {
      setAppliedFilters((prev) => ({ ...prev, category: currentCategory }));
    }
  }, [currentCategory]);

  const handleApplyFilters = (newFilters) => {
    setAppliedFilters(newFilters);
    if (newFilters.category !== currentCategory) {
      onSelectCategory(newFilters.category);
    }
  };

  const handleResetAll = () => {
    setAppliedFilters({
      category: 'All',
      maxPrice: 1500,
      selectedSizes: [],
      selectedColors: [],
      minRating: 0,
      inStockOnly: false
    });
    onSelectCategory('All');
    if (onClearSearch) onClearSearch();
  };

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category Filter
    if (appliedFilters.category && appliedFilters.category !== 'All') {
      result = result.filter(
        (p) => p.category?.toLowerCase() === appliedFilters.category.toLowerCase()
      );
    }

    // Keyword Search
    if (searchTerm?.trim()) {
      const query = searchTerm.toLowerCase();
      result = result.filter(
        (p) =>
          p.title?.toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query) ||
          p.subCategory?.toLowerCase().includes(query)
      );
    }

    // Price Filter
    result = result.filter((p) => p.price <= appliedFilters.maxPrice);

    // Sizes Filter
    if (appliedFilters.selectedSizes?.length > 0) {
      result = result.filter((p) =>
        p.sizes?.some((s) => appliedFilters.selectedSizes.includes(s))
      );
    }

    // Colors Filter
    if (appliedFilters.selectedColors?.length > 0) {
      result = result.filter((p) =>
        p.colors?.some((c) =>
          appliedFilters.selectedColors.some((sc) => c.toLowerCase().includes(sc.toLowerCase()))
        )
      );
    }

    // Rating Filter
    if (appliedFilters.minRating > 0) {
      result = result.filter((p) => (p.rating || 0) >= appliedFilters.minRating);
    }

    // In Stock Only
    if (appliedFilters.inStockOnly) {
      result = result.filter((p) => p.stock > 0);
    }

    // Sorting
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating-desc':
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        break;
      default:
        // featured default
        break;
    }

    return result;
  }, [products, appliedFilters, searchTerm, sortBy]);

  const activeFiltersCount =
    (appliedFilters.category !== 'All' ? 1 : 0) +
    (appliedFilters.selectedSizes?.length > 0 ? 1 : 0) +
    (appliedFilters.selectedColors?.length > 0 ? 1 : 0) +
    (appliedFilters.maxPrice < 1500 ? 1 : 0) +
    (appliedFilters.minRating > 0 ? 1 : 0) +
    (appliedFilters.inStockOnly ? 1 : 0) +
    (searchTerm ? 1 : 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header & Breadcrumbs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-purple-200 dark:border-white/10">
        <div>
          <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 mb-1">
            <span>Home</span>
            <span>/</span>
            <span className="text-brand-600 dark:text-brand-400 font-semibold">{appliedFilters.category} Collection</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-slate-950 dark:text-white">
            {appliedFilters.category === 'All' ? 'All Collections' : `${appliedFilters.category}'s Apparel`}
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 font-normal">
            Discover curated streetwear & modern silhouettes. Showing {filteredProducts.length} styles.
          </p>
        </div>

        {/* Quick Department Pill Switches */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-white/[0.04] border border-purple-200 dark:border-white/10 overflow-x-auto shrink-0 shadow-inner dark:shadow-none">
          {['All', 'Men', 'Women', 'Kids'].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => {
                setAppliedFilters((prev) => ({ ...prev, category: cat }));
                onSelectCategory(cat);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                appliedFilters.category === cat
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                  : 'text-slate-700 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white hover:bg-white dark:hover:bg-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Modern Filter Toolbar with dedicated "Filters" button */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-white dark:bg-white/[0.03] border border-purple-200 dark:border-white/10 shadow-sm">
        {/* Prominent Filters Trigger Button */}
        <button
          type="button"
          onClick={() => setFilterDrawerOpen(true)}
          className="flex items-center gap-2.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-pink-600 hover:from-brand-500 hover:to-pink-500 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-brand-600/25 transition-all cursor-pointer active:scale-95 btn-solid-cta"
        >
          <SlidersHorizontal className="w-4 h-4 text-white" />
          <span className="text-white">Filters</span>
          {activeFiltersCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-white text-brand-700 text-[11px] font-black flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </button>

        {/* Sorting Dropdown */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-600 dark:text-slate-400 hidden sm:inline font-medium">Sort:</span>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3.5 py-2 bg-slate-50 dark:bg-white/5 border border-purple-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:border-brand-500 cursor-pointer shadow-sm"
            >
              <option value="featured" className="bg-white dark:bg-[#0B0B12] text-slate-900 dark:text-white">Featured</option>
              <option value="price-asc" className="bg-white dark:bg-[#0B0B12] text-slate-900 dark:text-white">Price: Low to High</option>
              <option value="price-desc" className="bg-white dark:bg-[#0B0B12] text-slate-900 dark:text-white">Price: High to Low</option>
              <option value="rating-desc" className="bg-white dark:bg-[#0B0B12] text-slate-900 dark:text-white">Top Rated</option>
              <option value="newest" className="bg-white dark:bg-[#0B0B12] text-slate-900 dark:text-white">Newest Drops</option>
            </select>
          </div>
        </div>
      </div>

      {/* Active Filter Chips */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-1 pb-2">
          <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">Applied:</span>
          {searchTerm && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 dark:bg-brand-500/20 text-purple-800 dark:text-brand-300 text-xs font-semibold border border-purple-300 dark:border-brand-500/30">
              Keyword: "{searchTerm}"
              <button onClick={onClearSearch} className="cursor-pointer"><X className="w-3 h-3 hover:text-pink-600 dark:hover:text-white" /></button>
            </span>
          )}
          {appliedFilters.category !== 'All' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 dark:bg-brand-500/20 text-purple-800 dark:text-brand-300 text-xs font-semibold border border-purple-300 dark:border-brand-500/30">
              Department: {appliedFilters.category}
              <button onClick={() => setAppliedFilters((p) => ({ ...p, category: 'All' }))} className="cursor-pointer">
                <X className="w-3 h-3 hover:text-pink-600 dark:hover:text-white" />
              </button>
            </span>
          )}
          {appliedFilters.maxPrice < 1500 && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 dark:bg-white/10 text-purple-900 dark:text-slate-200 text-xs font-semibold border border-purple-200 dark:border-white/10">
              Under ₹{appliedFilters.maxPrice}
              <button onClick={() => setAppliedFilters((p) => ({ ...p, maxPrice: 1500 }))} className="cursor-pointer">
                <X className="w-3 h-3 hover:text-pink-600 dark:hover:text-white" />
              </button>
            </span>
          )}
          {appliedFilters.selectedSizes?.map((size) => (
            <span key={size} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 dark:bg-white/10 text-purple-900 dark:text-slate-200 text-xs font-semibold border border-purple-200 dark:border-white/10">
              Size: {size}
              <button onClick={() => setAppliedFilters((p) => ({ ...p, selectedSizes: p.selectedSizes.filter((s) => s !== size) }))} className="cursor-pointer">
                <X className="w-3 h-3 hover:text-pink-600 dark:hover:text-white" />
              </button>
            </span>
          ))}
          {appliedFilters.selectedColors?.map((color) => (
            <span key={color} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 dark:bg-white/10 text-purple-900 dark:text-slate-200 text-xs font-semibold border border-purple-200 dark:border-white/10">
              Color: {color}
              <button onClick={() => setAppliedFilters((p) => ({ ...p, selectedColors: p.selectedColors.filter((c) => c !== color) }))} className="cursor-pointer">
                <X className="w-3 h-3 hover:text-pink-600 dark:hover:text-white" />
              </button>
            </span>
          ))}
          <button
            onClick={handleResetAll}
            className="text-xs text-pink-600 hover:text-pink-700 dark:text-pink-400 dark:hover:text-pink-300 flex items-center gap-1 ml-2 font-semibold cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset All</span>
          </button>
        </div>
      )}

      {/* Main Expansive Product Grid (Clean, wide, modern layout) */}
      <div>
        {filteredProducts.length === 0 ? (
          <div className="p-16 text-center rounded-3xl bg-white dark:bg-[#0B0B12] border border-purple-200 dark:border-white/10 my-8 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-purple-50 dark:bg-white/5 border border-purple-200 dark:border-white/10 flex items-center justify-center mx-auto mb-4 text-purple-600 dark:text-slate-400">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">No matching styles found</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm mx-auto mb-6">
              Try adjusting your filter options or exploring other departments.
            </p>
            <button
              onClick={handleResetAll}
              className="px-6 py-2.5 bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-brand-600/30 cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product._id || product.id}
                product={product}
                onSelect={onSelectProduct}
                onSelectProduct={onSelectProduct}
                onQuickView={onSelectProduct}
              />
            ))}
          </div>
        )}
      </div>

      {/* Responsive Filter Drawer with "Apply Filters" button */}
      <FilterDrawer
        isOpen={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        initialFilters={appliedFilters}
        onApplyFilters={handleApplyFilters}
        totalMatchingCount={filteredProducts.length}
      />
    </div>
  );
};

export default ProductListingPage;
