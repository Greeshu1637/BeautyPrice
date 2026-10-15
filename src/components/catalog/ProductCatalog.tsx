import React, { useMemo, useState } from 'react';
import { useBeauty } from '../../context/BeautyContext';
import { ProductCard } from './ProductCard';
import { CATEGORIES, ALL_BRANDS, SKIN_TYPES, SKIN_CONCERNS } from '../../data/products';
import { 
  Filter, 
  Search, 
  RotateCcw, 
  SlidersHorizontal, 
  ChevronDown, 
  X
} from 'lucide-react';
import { filterAndSortProducts } from '../../utils/search';
import { activeProductProvider } from '../../services/productDataProvider';

export const ProductCatalog: React.FC = () => {
  const { products, filterState, setFilterState, resetFilters } = useBeauty();
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Robust search & filter computation using normalized multi-token matching
  const filteredProducts = useMemo(() => {
    return filterAndSortProducts(products, filterState);
  }, [products, filterState]);

  const activeFiltersCount = [
    filterState.search ? 1 : 0,
    filterState.category !== 'all' ? 1 : 0,
    filterState.brand !== 'all' ? 1 : 0,
    filterState.skinType !== 'all' ? 1 : 0,
    filterState.concern !== 'all' ? 1 : 0,
    filterState.maxPrice < 6500 ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      
      {/* Catalog Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-ivory-300">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-plum-800">
            Beauty & Skincare Database
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-espresso-950 mt-1">
            Curated Formulations Catalog
          </h2>
          <p className="text-sm text-espresso-600 mt-1.5 max-w-2xl">
            Filter 50 recorded Indian beauty essentials across Nykaa, Tira, Amazon, Purplle, and Blinkit. Compare unit prices and value metrics transparently.
          </p>
          <div className="flex items-center gap-2 mt-2.5">
            <span className="text-[11px] bg-ivory-200 border border-ivory-300 text-espresso-700 px-2.5 py-0.5 rounded-full font-medium inline-flex items-center gap-1.5 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
              <span>{activeProductProvider.getMetadata().statusText}</span>
            </span>
          </div>
        </div>

        {/* Mobile Filter Toggle Button */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="flex-1 py-2.5 px-4 bg-white border border-ivory-300 rounded-xl text-xs font-semibold text-espresso-900 flex items-center justify-center gap-2 shadow-xs cursor-pointer"
          >
            <SlidersHorizontal className="w-4 h-4 text-plum-700" />
            <span>Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Filters Sidebar + Products Grid */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ================= DESKTOP & MOBILE SIDEBAR ================= */}
        <aside 
          className={`lg:col-span-3 bg-white p-5 rounded-2xl border border-ivory-300 shadow-soft space-y-6 ${
            mobileFilterOpen ? 'block' : 'hidden lg:block'
          }`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-ivory-200">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-plum-800" />
              <h3 className="font-serif font-bold text-espresso-950 text-base">Filter Products</h3>
            </div>
            {activeFiltersCount > 0 && (
              <button
                onClick={resetFilters}
                className="text-xs text-plum-700 hover:text-plum-900 flex items-center gap-1 font-semibold cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Search Box */}
          <div>
            <label className="block text-xs font-bold text-espresso-800 uppercase tracking-wider mb-1.5">
              Search Catalogue
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-espresso-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Product, active ingredient..."
                aria-label="Search catalogue"
                value={filterState.search}
                onChange={(e) => setFilterState(prev => ({ ...prev, search: e.target.value }))}
                className="w-full pl-9 pr-3 py-2 bg-ivory-100 border border-ivory-300 rounded-lg text-xs text-espresso-900 focus:outline-none focus:border-plum-500"
              />
              {filterState.search && (
                <button
                  type="button"
                  onClick={() => setFilterState(prev => ({ ...prev, search: '' }))}
                  aria-label="Clear search"
                  className="absolute right-2.5 top-2.5 text-espresso-400 hover:text-espresso-700"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-xs font-bold text-espresso-800 uppercase tracking-wider mb-2">
              Category
            </label>
            <div className="space-y-1">
              <button
                onClick={() => setFilterState(prev => ({ ...prev, category: 'all' }))}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center justify-between ${
                  filterState.category === 'all'
                    ? 'bg-plum-800 text-ivory-100 font-bold'
                    : 'text-espresso-700 hover:bg-ivory-200'
                }`}
              >
                <span>All Categories</span>
                <span>{products.length}</span>
              </button>
              {CATEGORIES.map(cat => {
                const count = products.filter(p => p.category === cat.id).length;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setFilterState(prev => ({ ...prev, category: cat.id }))}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center justify-between ${
                      filterState.category === cat.id
                        ? 'bg-plum-800 text-ivory-100 font-bold'
                        : 'text-espresso-700 hover:bg-ivory-200'
                    }`}
                  >
                    <span>{cat.label}</span>
                    <span className="text-[10px] opacity-75">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Brand Selector */}
          <div>
            <label className="block text-xs font-bold text-espresso-800 uppercase tracking-wider mb-1.5">
              Brand
            </label>
            <div className="relative">
              <select
                value={filterState.brand}
                onChange={(e) => setFilterState(prev => ({ ...prev, brand: e.target.value }))}
                className="w-full px-3 py-2 bg-ivory-100 border border-ivory-300 rounded-lg text-xs text-espresso-900 appearance-none focus:outline-none focus:border-plum-500 cursor-pointer"
              >
                <option value="all">All Brands ({ALL_BRANDS.length})</option>
                {ALL_BRANDS.map(brand => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-espresso-500 absolute right-3 top-3 pointer-events-none" />
            </div>
          </div>

          {/* Skin Type Preference */}
          <div>
            <label className="block text-xs font-bold text-espresso-800 uppercase tracking-wider mb-1.5">
              Skin Type Suitability
            </label>
            <div className="relative">
              <select
                value={filterState.skinType}
                onChange={(e) => setFilterState(prev => ({ ...prev, skinType: e.target.value as any }))}
                className="w-full px-3 py-2 bg-ivory-100 border border-ivory-300 rounded-lg text-xs text-espresso-900 appearance-none focus:outline-none focus:border-plum-500 cursor-pointer"
              >
                <option value="all">Any Skin Type</option>
                {SKIN_TYPES.map(st => (
                  <option key={st} value={st}>{st} Skin</option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-espresso-500 absolute right-3 top-3 pointer-events-none" />
            </div>
          </div>

          {/* Skin Concern Target */}
          <div>
            <label className="block text-xs font-bold text-espresso-800 uppercase tracking-wider mb-1.5">
              Target Skin & Hair Concern
            </label>
            <div className="relative">
              <select
                value={filterState.concern}
                onChange={(e) => setFilterState(prev => ({ ...prev, concern: e.target.value as any }))}
                className="w-full px-3 py-2 bg-ivory-100 border border-ivory-300 rounded-lg text-xs text-espresso-900 appearance-none focus:outline-none focus:border-plum-500 cursor-pointer"
              >
                <option value="all">Any Concern</option>
                {SKIN_CONCERNS.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-espresso-500 absolute right-3 top-3 pointer-events-none" />
            </div>
          </div>

          {/* Max Price Slider */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <label className="font-bold text-espresso-800 uppercase tracking-wider">
                Max Recorded Price
              </label>
              <span className="font-bold text-plum-900">
                ₹{filterState.maxPrice.toLocaleString('en-IN')}
              </span>
            </div>
            <input
              type="range"
              min="200"
              max="6500"
              step="50"
              value={filterState.maxPrice}
              aria-label="Max recorded price"
              onChange={(e) => setFilterState(prev => ({ ...prev, maxPrice: Number(e.target.value) }))}
              className="w-full accent-plum-800 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-espresso-400 mt-1">
              <span>₹200</span>
              <span>₹6,500+</span>
            </div>
          </div>

          {/* Demo Note */}
          <div className="bg-ivory-100 p-3 rounded-lg border border-ivory-200 text-[11px] text-espresso-500 leading-snug">
            All prices are demonstration simulation data. BeautyPrice does not make medical diagnosis claims.
          </div>
        </aside>

        {/* ================= PRODUCTS CONTENT AREA ================= */}
        <main className="lg:col-span-9 space-y-6">
          
          {/* Controls Bar: Results Count & Sort Dropdown */}
          <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-ivory-300 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-espresso-900">
                Showing <strong className="text-plum-900 font-bold">{filteredProducts.length}</strong> recorded formulations
              </span>
              {activeFiltersCount > 0 && (
                <span className="text-xs bg-blush-100 text-plum-900 px-2 py-0.5 rounded-full font-medium">
                  {activeFiltersCount} filters active
                </span>
              )}
            </div>

            {/* Sort Control */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-espresso-500 font-medium whitespace-nowrap">Sort By:</span>
              <div className="relative flex-1 sm:flex-initial">
                <select
                  value={filterState.sortBy}
                  onChange={(e) => setFilterState(prev => ({ ...prev, sortBy: e.target.value as any }))}
                  className="w-full sm:w-auto pl-3 pr-8 py-1.5 bg-ivory-100 border border-ivory-300 rounded-lg text-xs font-semibold text-espresso-900 appearance-none focus:outline-none focus:border-plum-500 cursor-pointer"
                >
                  <option value="recommended">Featured & High Rated</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="unit-price">Best Value (Lowest ₹/ml or ₹/g)</option>
                  <option value="rating">Top Customer Ratings</option>
                  <option value="biggest-discount">Deepest Recorded Discount</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-espresso-500 absolute right-2.5 top-2.5 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Active Filter Chips */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs text-espresso-500">Active:</span>
              {filterState.search && (
                <span className="inline-flex items-center gap-1 bg-ivory-200 border border-ivory-300 text-espresso-800 text-xs px-2.5 py-1 rounded-full">
                  Keyword: "{filterState.search}"
                  <button 
                    type="button"
                    onClick={() => setFilterState(p => ({ ...p, search: '' }))}
                    aria-label="Remove search keyword filter"
                  >
                    <X className="w-3 h-3 text-espresso-500 hover:text-espresso-800" />
                  </button>
                </span>
              )}
              {filterState.category !== 'all' && (
                <span className="inline-flex items-center gap-1 bg-ivory-200 border border-ivory-300 text-espresso-800 text-xs px-2.5 py-1 rounded-full capitalize">
                  Category: {filterState.category}
                  <button 
                    type="button"
                    onClick={() => setFilterState(p => ({ ...p, category: 'all' }))}
                    aria-label="Remove category filter"
                  >
                    <X className="w-3 h-3 text-espresso-500 hover:text-espresso-800" />
                  </button>
                </span>
              )}
              {filterState.brand !== 'all' && (
                <span className="inline-flex items-center gap-1 bg-ivory-200 border border-ivory-300 text-espresso-800 text-xs px-2.5 py-1 rounded-full">
                  Brand: {filterState.brand}
                  <button 
                    type="button"
                    onClick={() => setFilterState(p => ({ ...p, brand: 'all' }))}
                    aria-label="Remove brand filter"
                  >
                    <X className="w-3 h-3 text-espresso-500 hover:text-espresso-800" />
                  </button>
                </span>
              )}
              {filterState.skinType !== 'all' && (
                <span className="inline-flex items-center gap-1 bg-ivory-200 border border-ivory-300 text-espresso-800 text-xs px-2.5 py-1 rounded-full">
                  Skin: {filterState.skinType}
                  <button 
                    type="button"
                    onClick={() => setFilterState(p => ({ ...p, skinType: 'all' }))}
                    aria-label="Remove skin type filter"
                  >
                    <X className="w-3 h-3 text-espresso-500 hover:text-espresso-800" />
                  </button>
                </span>
              )}
              {filterState.concern !== 'all' && (
                <span className="inline-flex items-center gap-1 bg-ivory-200 border border-ivory-300 text-espresso-800 text-xs px-2.5 py-1 rounded-full">
                  Concern: {filterState.concern}
                  <button 
                    type="button"
                    onClick={() => setFilterState(p => ({ ...p, concern: 'all' }))}
                    aria-label="Remove concern filter"
                  >
                    <X className="w-3 h-3 text-espresso-500 hover:text-espresso-800" />
                  </button>
                </span>
              )}
              {filterState.maxPrice < 6500 && (
                <span className="inline-flex items-center gap-1 bg-ivory-200 border border-ivory-300 text-espresso-800 text-xs px-2.5 py-1 rounded-full">
                  ≤ ₹{filterState.maxPrice.toLocaleString('en-IN')}
                  <button 
                    type="button"
                    onClick={() => setFilterState(p => ({ ...p, maxPrice: 6500 }))}
                    aria-label="Remove max price filter"
                  >
                    <X className="w-3 h-3 text-espresso-500 hover:text-espresso-800" />
                  </button>
                </span>
              )}
              <button
                type="button"
                onClick={resetFilters}
                className="text-xs text-plum-800 font-semibold underline ml-1 cursor-pointer"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Product Cards Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="bg-white rounded-2xl border border-ivory-300 p-12 text-center shadow-xs">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blush-100 flex items-center justify-center text-plum-700">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-xl font-bold text-espresso-900">
                {filterState.search.trim()
                  ? `No beauty products match "${filterState.search}"`
                  : 'No beauty products match your filters'}
              </h3>
              <p className="text-sm text-espresso-600 max-w-md mx-auto mt-2">
                {filterState.search.trim()
                  ? 'Try searching by brand (e.g., "Dot & Key", "Minimalist"), key ingredient (e.g., "Niacinamide"), or clearing current filters.'
                  : 'Try widening your price range, searching a different active ingredient, or resetting active filters.'}
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                {filterState.search.trim() && (
                  <button
                    type="button"
                    onClick={() => setFilterState(prev => ({ ...prev, search: '' }))}
                    className="px-5 py-2.5 bg-ivory-200 hover:bg-ivory-300 text-espresso-900 rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                  >
                    Clear Search Query
                  </button>
                )}
                <button
                  type="button"
                  onClick={resetFilters}
                  className="px-5 py-2.5 bg-plum-800 hover:bg-plum-900 text-ivory-100 rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            </div>
          )}

        </main>
      </div>

    </div>
  );
};
