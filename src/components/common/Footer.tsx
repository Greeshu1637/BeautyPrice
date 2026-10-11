import React from 'react';
import { useBeauty } from '../../context/BeautyContext';
import { ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveTab, setFilterState, setIsProfileOpen } = useBeauty();

  return (
    <footer className="bg-espresso-950 text-ivory-200 border-t border-espresso-900 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-plum-800 flex items-center justify-center text-champagne-300 font-serif font-bold text-base shadow-sm">
                BP
              </div>
              <span className="font-serif font-bold text-2xl text-ivory-100 tracking-tight">BeautyPrice</span>
            </div>
            <p className="text-xs sm:text-sm text-espresso-300 leading-relaxed max-w-sm">
              Empowering Indian beauty consumers with true price-per-ml metrics, recorded price history, transparent non-medical recommendations, and multi-retailer basket planning.
            </p>
            <div className="flex items-center gap-2 text-xs text-espresso-400">
              <ShieldCheck className="w-4 h-4 text-champagne-400" />
              <span>Independent Shopping Intelligence Platform</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-champagne-400">
              Platform Features
            </h4>
            <ul className="space-y-2 text-xs text-espresso-300">
              <li>
                <button 
                  onClick={() => setActiveTab('catalog')} 
                  className="hover:text-ivory-100 transition-colors cursor-pointer"
                >
                  30+ Formulations Catalog
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setIsProfileOpen(true)} 
                  className="hover:text-ivory-100 transition-colors cursor-pointer"
                >
                  Configure Beauty Profile
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('recommendations')} 
                  className="hover:text-ivory-100 transition-colors cursor-pointer"
                >
                  My Scored Recommendations
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('basket')} 
                  className="hover:text-ivory-100 transition-colors cursor-pointer"
                >
                  Multi-Retailer Basket Planner
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('transparency')} 
                  className="hover:text-ivory-100 transition-colors cursor-pointer"
                >
                  Transparency & Methodology
                </button>
              </li>
            </ul>
          </div>

          {/* Categories Quick Filter */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-champagne-400">
              Categories
            </h4>
            <div className="flex flex-wrap gap-2">
              {['skincare', 'haircare', 'makeup', 'bodycare'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setFilterState(prev => ({ ...prev, category: cat as any }));
                    setActiveTab('catalog');
                  }}
                  className="capitalize text-xs bg-espresso-900 hover:bg-plum-950 border border-espresso-800 text-espresso-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  {cat}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-espresso-400 mt-3 leading-relaxed">
              Tracking sample Indian online stores: Nykaa, Tira, Amazon India, Purplle, Blinkit, and Myntra.
            </p>
          </div>

        </div>

        {/* Legal & Demonstration Disclosures Banner */}
        <div className="border-t border-espresso-900 pt-8 space-y-4">
          <div className="bg-espresso-900/60 p-4 rounded-xl border border-espresso-800 text-[11px] text-espresso-300 leading-relaxed">
            <strong className="text-champagne-300 font-semibold block mb-1">
              Demonstration Data Notice & Non-Medical Disclaimer:
            </strong>
            BeautyPrice is a frontend prototype with sample demonstration data. All retailer pricing, inventory levels, flash deals, and price histories are illustrative simulations. BeautyPrice does not scrape external platforms, guarantee pricing, or provide medical dermatological advice. All product trademarks, logos, and brands belong to their respective owners.
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-espresso-400 gap-2">
            <p>© {new Date().getFullYear()} BeautyPrice India. Built for Indian beauty enthusiasts.</p>
            <p className="flex items-center gap-1">
              Designed with care in warm ivory & plum palette
            </p>
          </div>
        </div>

      </div>
    </footer>
  );
};
