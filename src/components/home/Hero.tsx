import React, { useState } from 'react';
import { 
  Search, 
  Sparkles, 
  TrendingDown, 
  Scale, 
  ArrowRight, 
  Layers
} from 'lucide-react';
import { useBeauty } from '../../context/BeautyContext';

export const Hero: React.FC = () => {
  const { setFilterState, setActiveTab } = useBeauty();
  const [query, setQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setFilterState(prev => ({ ...prev, search: query.trim() }));
      setActiveTab('catalog');
    }
  };

  const popularTags = [
    'Niacinamide',
    'SPF 50 Sunscreen',
    'Ceramides',
    'Salicylic Acid',
    'Lip Mask',
    'Bond Repair',
  ];

  return (
    <section className="relative overflow-hidden pt-10 pb-16 md:pt-16 md:pb-24 border-b border-ivory-300">
      
      {/* Decorative Editorial Background Glows */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blush-200/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-20 w-96 h-96 bg-plum-100/60 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Hero Header */}
        <div className="text-center max-w-4xl mx-auto">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blush-100 border border-blush-300 text-plum-900 text-xs font-semibold tracking-wide mb-6 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-plum-700" />
            <span>Independent Indian Beauty Shopping Intelligence</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-espresso-950 tracking-tight leading-[1.12]">
            Know What You Pay for Every Millilitre of Beauty
          </h1>

          <p className="mt-5 text-base sm:text-lg md:text-xl text-espresso-700 font-sans max-w-2xl mx-auto leading-relaxed">
            Compare recorded prices across <strong>Nykaa, Tira, Amazon, and Purplle</strong>. Uncover true cost per ml, inspect historical price drops, and match formulations suited to your skin.
          </p>

          {/* Interactive Search Bar */}
          <form 
            onSubmit={handleSearchSubmit}
            className="mt-8 sm:mt-10 max-w-2xl mx-auto relative flex items-center shadow-elevated rounded-2xl bg-white border border-ivory-300 p-2 transition-all focus-within:border-plum-500 focus-within:ring-2 focus-within:ring-plum-200"
          >
            <Search className="w-5 h-5 text-espresso-400 ml-3 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products (e.g., Minimalist Niacinamide, Sunscreen SPF 50)..."
              className="w-full px-3 py-2.5 text-sm sm:text-base text-espresso-900 placeholder:text-espresso-400 bg-transparent focus:outline-none"
            />
            <button
              type="submit"
              className="px-5 sm:px-7 py-3 bg-plum-800 hover:bg-plum-900 text-ivory-100 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-xs flex items-center gap-2 shrink-0 cursor-pointer"
            >
              <span>Explore</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Popular Tag Pills */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-espresso-600">
            <span className="font-medium text-espresso-500">Popular Searches:</span>
            {popularTags.map((tag) => (
              <button
                key={tag}
                onClick={() => {
                  setFilterState(prev => ({ ...prev, search: tag }));
                  setActiveTab('catalog');
                }}
                className="bg-ivory-200 hover:bg-blush-100 text-espresso-800 hover:text-plum-900 px-2.5 py-1 rounded-full border border-ivory-300 transition-colors cursor-pointer"
              >
                {tag}
              </button>
            ))}
          </div>

        </div>

        {/* 4 Feature Value Pillars */}
        <div className="mt-14 sm:mt-18 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-white/80 backdrop-blur-xs p-5 rounded-2xl border border-ivory-300 shadow-soft">
            <div className="w-9 h-9 rounded-xl bg-blush-100 flex items-center justify-center text-plum-800 mb-3">
              <Scale className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-espresso-950 text-base">
              Price-Per-ml True Value
            </h3>
            <p className="text-xs text-espresso-600 mt-1 leading-relaxed">
              Standardized unit cost analysis reveals whether a 30ml serum at ₹599 beats a 50ml alternative.
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-xs p-5 rounded-2xl border border-ivory-300 shadow-soft">
            <div className="w-9 h-9 rounded-xl bg-blush-100 flex items-center justify-center text-plum-800 mb-3">
              <TrendingDown className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-espresso-950 text-base">
              Recorded Price History
            </h3>
            <p className="text-xs text-espresso-600 mt-1 leading-relaxed">
              Track lowest recorded prices, average trends, and promotional sale drops with interactive charts.
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-xs p-5 rounded-2xl border border-ivory-300 shadow-soft">
            <div className="w-9 h-9 rounded-xl bg-blush-100 flex items-center justify-center text-plum-800 mb-3">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-espresso-950 text-base">
              Transparent Rule Scoring
            </h3>
            <p className="text-xs text-espresso-600 mt-1 leading-relaxed">
              Personalized recommendations based strictly on your skin type, concerns, and chosen budget.
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-xs p-5 rounded-2xl border border-ivory-300 shadow-soft">
            <div className="w-9 h-9 rounded-xl bg-blush-100 flex items-center justify-center text-plum-800 mb-3">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-espresso-950 text-base">
              Multi-Retailer Basket Planner
            </h3>
            <p className="text-xs text-espresso-600 mt-1 leading-relaxed">
              Plan your monthly routine haul and compare simulated totals across Nykaa, Tira, and Amazon.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};
