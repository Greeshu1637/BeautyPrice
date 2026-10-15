import React from 'react';
import { Hero } from './Hero';
import { useBeauty } from '../../context/BeautyContext';
import { CATEGORIES } from '../../data/products';
import { ProductCard } from '../catalog/ProductCard';
import { 
  Sparkles, 
  Flame, 
  PiggyBank, 
  ArrowRight, 
  ExternalLink 
} from 'lucide-react';
import { getLowestOffer } from '../../utils/pricing';

export const HomeView: React.FC = () => {
  const { products, setFilterState, setActiveTab, setIsProfileOpen } = useBeauty();

  // Trending picks
  const trendingProducts = products.filter(p => p.isTrending).slice(0, 4);

  // Budget-friendly finds (≤ ₹500 lowest recorded price)
  const budgetFinds = products.filter(p => {
    const bestPrice = getLowestOffer(p)?.price || p.mrp;
    return bestPrice <= 500 && p.rating >= 4.4;
  }).slice(0, 4);

  return (
    <div className="space-y-16 pb-16">
      
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Popular Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-plum-800">
              Explore Collections
            </span>
            <h2 className="font-serif text-3xl font-bold text-espresso-950 mt-1">
              Curated Beauty Categories
            </h2>
          </div>
          <button
            onClick={() => {
              setFilterState(prev => ({ ...prev, category: 'all' }));
              setActiveTab('catalog');
            }}
            className="text-xs font-bold text-plum-800 hover:text-plum-950 flex items-center gap-1 cursor-pointer self-start sm:self-auto"
          >
            <span>View All 30+ Products</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {CATEGORIES.map((cat) => {
            const count = products.filter(p => p.category === cat.id).length;
            return (
              <div
                key={cat.id}
                onClick={() => {
                  setFilterState(prev => ({ ...prev, category: cat.id }));
                  setActiveTab('catalog');
                }}
                className="group bg-white rounded-2xl border border-ivory-300 hover:border-plum-400 p-6 shadow-soft hover:shadow-elevated transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-serif text-2xl font-bold text-plum-900 group-hover:text-plum-700 transition-colors">
                      {cat.label}
                    </span>
                    <span className="text-xs font-bold text-espresso-600 bg-ivory-200 px-2.5 py-1 rounded-full">
                      {count} items
                    </span>
                  </div>
                  <p className="text-xs text-espresso-600 leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-ivory-200 flex items-center justify-between text-xs font-bold text-plum-800 group-hover:text-plum-950">
                  <span>Browse Category</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Trending Beauty & Skincare Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-rose-600" />
              <span className="text-xs font-bold uppercase tracking-widest text-plum-800">
                Indian Market Highlights
              </span>
            </div>
            <h2 className="font-serif text-3xl font-bold text-espresso-950 mt-1">
              Trending Formulations This Season
            </h2>
            <p className="text-xs sm:text-sm text-espresso-600 mt-1">
              Top recorded cult favorites from Minimalist, Dot & Key, COSRX, and Kay Beauty
            </p>
          </div>

          <button
            onClick={() => setActiveTab('catalog')}
            className="text-xs font-bold text-plum-800 hover:text-plum-950 flex items-center gap-1 cursor-pointer self-start sm:self-auto"
          >
            <span>Explore All Trending</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. Editorial Callout: Personalized Scoring Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-plum-900 via-plum-800 to-espresso-900 rounded-3xl p-8 sm:p-12 text-ivory-100 shadow-elevated relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          
          <div className="max-w-2xl relative z-10">
            <span className="text-xs uppercase font-bold tracking-widest text-champagne-300">
              Personalized Intelligence
            </span>
            <h3 className="font-serif text-3xl sm:text-4xl font-bold mt-2 text-ivory-100">
              Stop Guessing If a Serum Matches Your Skin
            </h3>
            <p className="text-sm sm:text-base text-blush-200 mt-3 leading-relaxed">
              Tell BeautyPrice whether you have oily, combination, or sensitive skin and your budget preferences. Our transparent rule-based algorithm ranks formulations with clear explanations.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                onClick={() => setIsProfileOpen(true)}
                className="px-6 py-3 bg-ivory-100 hover:bg-white text-plum-950 rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-plum-700" />
                <span>Configure My Skin Profile</span>
              </button>
              <button
                onClick={() => setActiveTab('recommendations')}
                className="px-5 py-3 bg-plum-800/80 hover:bg-plum-800 text-ivory-100 border border-plum-700 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer"
              >
                View Scored Matches
              </button>
            </div>
          </div>

          <div className="w-full md:w-auto relative z-10 bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl max-w-sm text-xs space-y-2">
            <span className="text-champagne-300 font-bold block text-[11px] uppercase tracking-wider">
              Transparent Scoring Pledge
            </span>
            <p className="text-blush-100 leading-snug">
              ✓ 100% Non-Medical formulation matching
            </p>
            <p className="text-blush-100 leading-snug">
              ✓ Calculated price per ml unit breakdown
            </p>
            <p className="text-blush-100 leading-snug">
              ✓ Zero paid brand sponsorships or paywalled rankings
            </p>
          </div>

        </div>
      </section>

      {/* 5. Budget-Friendly Finds (Under ₹500) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
          <div>
            <div className="flex items-center gap-2">
              <PiggyBank className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-bold uppercase tracking-widest text-plum-800">
                High Value Under ₹500
              </span>
            </div>
            <h2 className="font-serif text-3xl font-bold text-espresso-950 mt-1">
              Budget-Friendly Formulations
            </h2>
            <p className="text-xs sm:text-sm text-espresso-600 mt-1">
              Top-rated cleansers, sunscreens, and body care that deliver maximum efficacy per rupee
            </p>
          </div>

          <button
            onClick={() => {
              setFilterState(prev => ({ ...prev, maxPrice: 500, sortBy: 'unit-price' }));
              setActiveTab('catalog');
            }}
            className="text-xs font-bold text-plum-800 hover:text-plum-950 flex items-center gap-1 cursor-pointer self-start sm:self-auto"
          >
            <span>Filter All Under ₹500</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {budgetFinds.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 6. Why Unit Price Matters (Editorial Educational Story) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-ivory-200/80 rounded-3xl border border-ivory-300 p-8 sm:p-10 md:p-12">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-widest text-plum-800">
              The Math Behind Your Skincare
            </span>
            <h3 className="font-serif text-3xl sm:text-4xl font-bold text-espresso-950 mt-2">
              Why We Standardize Every Price to ₹ per ml or g
            </h3>
            <p className="text-sm sm:text-base text-espresso-700 mt-3 leading-relaxed">
              In beauty e-commerce, bottle sizes vary wildly: 12ml eye serums, 30ml face serums, 50g sunscreen tubes, and 200ml body washes. When a brand advertises a ₹399 product next to a ₹599 competitor, the cheaper bottle is often 50% smaller—costing you significantly more per drop.
            </p>
            <div className="mt-6 flex flex-wrap gap-4 text-xs font-semibold text-espresso-800">
              <div className="bg-white px-4 py-2.5 rounded-xl border border-ivory-300">
                Formula: <span className="font-mono text-plum-900">Recorded Price ÷ Net Quantity</span>
              </div>
              <button
                onClick={() => setActiveTab('transparency')}
                className="text-plum-800 underline hover:text-plum-950 self-center flex items-center gap-1 cursor-pointer"
              >
                <span>Read our complete transparency methodology</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
