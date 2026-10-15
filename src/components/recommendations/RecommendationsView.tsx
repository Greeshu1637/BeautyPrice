import React from 'react';
import { useBeauty } from '../../context/BeautyContext';
import { scoreRecommendations } from '../../utils/recommendations';
import { 
  Sparkles, 
  Settings2, 
  CheckCircle, 
  AlertCircle, 
  ShieldCheck, 
  ShoppingBag, 
  Scale, 
  Star,
  Check
} from 'lucide-react';
import { formatCurrency, getLowestOffer } from '../../utils/pricing';

export const RecommendationsView: React.FC = () => {
  const { products, profile, setIsProfileOpen, setSelectedProduct, addToBasket, isInBasket, removeFromBasket } = useBeauty();

  const scoredRecommendations = scoreRecommendations(products, profile, 12);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-plum-900 to-espresso-900 text-ivory-100 rounded-2xl p-6 sm:p-8 md:p-10 shadow-elevated relative overflow-hidden">
        {/* Subtle decorative background circle */}
        <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-plum-800/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-plum-800/80 border border-plum-700/60 text-champagne-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Rule-Based Formulation Engine</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-ivory-100">
            Formulations Matched to Your Profile
          </h2>

          <p className="text-sm sm:text-base text-blush-200 mt-2 leading-relaxed">
            Every match is transparently scored based on your skin type, active ingredient needs, and selected budget tier. No black-box algorithms or sponsored placements.
          </p>

          {/* Current Active Profile Pills */}
          <div className="mt-6 pt-5 border-t border-plum-800/80 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-blush-300 font-medium">Scored against:</span>
              <span className="bg-plum-800/90 text-ivory-100 px-2.5 py-1 rounded-lg border border-plum-700 font-semibold">
                {profile.skinType} Skin
              </span>
              <span className="bg-plum-800/90 text-ivory-100 px-2.5 py-1 rounded-lg border border-plum-700 font-semibold capitalize">
                Budget: {profile.budgetTier}
              </span>
              {profile.fragranceFreeOnly && (
                <span className="bg-plum-800/90 text-champagne-300 px-2.5 py-1 rounded-lg border border-plum-700 font-semibold">
                  Fragrance-Free Only
                </span>
              )}
              {profile.concerns.length > 0 && (
                <span className="bg-plum-800/90 text-blush-200 px-2.5 py-1 rounded-lg border border-plum-700">
                  {profile.concerns.length} Concerns Targeted
                </span>
              )}
            </div>

            <button
              onClick={() => setIsProfileOpen(true)}
              className="px-4 py-2 bg-ivory-100 hover:bg-white text-plum-950 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Settings2 className="w-3.5 h-3.5 text-plum-800" />
              <span>Modify Skin Profile</span>
            </button>
          </div>
        </div>
      </div>

      {/* Non-Medical Transparency Alert */}
      <div className="mt-6 bg-white border border-ivory-300 rounded-xl p-4 flex items-start gap-3 shadow-xs">
        <ShieldCheck className="w-5 h-5 text-plum-700 shrink-0 mt-0.5" />
        <div className="text-xs text-espresso-700 leading-relaxed">
          <strong className="text-espresso-950 font-bold">Transparent Scoring Framework:</strong> Match scores (0–100%) reflect rule-based formulation overlap (skin type compatibility + active ingredient matches + budget tier fit). They are not medical diagnostic evaluations or dermatological prescriptions.
        </div>
      </div>

      {/* Scored Recommendations Grid */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-espresso-950">
            Top Recommendations ({scoredRecommendations.length})
          </h3>
          <span className="text-xs text-espresso-500">
            Ranked by formulation alignment & value
          </span>
        </div>

        {scoredRecommendations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {scoredRecommendations.map(({ product, score, matchReasons, unitCostFormatted }) => {
              const lowestOffer = getLowestOffer(product);
              const bestPrice = lowestOffer?.price || product.mrp;
              const inBasket = isInBasket(product.id);

              return (
                <div 
                  key={product.id}
                  className="bg-white rounded-2xl border border-ivory-300 hover:border-plum-300 shadow-soft hover:shadow-elevated transition-all p-5 flex flex-col justify-between"
                >
                  <div>
                    {/* Top match score row */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-plum-800">
                        {product.brand}
                      </span>
                      <div className="flex items-center gap-1 bg-plum-100 text-plum-900 border border-plum-200 px-2.5 py-0.5 rounded-full text-xs font-bold">
                        <Sparkles className="w-3 h-3 text-plum-700" />
                        <span>{score}% Formulation Match</span>
                      </div>
                    </div>

                    {/* Image & Title */}
                    <div className="flex gap-3.5 items-start">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-16 h-16 rounded-xl object-cover bg-ivory-200 border border-ivory-300 shrink-0"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=300&q=80';
                        }}
                      />
                      <div>
                        <h4 
                          onClick={() => setSelectedProduct(product)}
                          className="font-serif font-bold text-espresso-950 text-base leading-snug hover:text-plum-800 cursor-pointer line-clamp-2"
                        >
                          {product.name}
                        </h4>
                        <div className="flex items-center gap-1.5 mt-1 text-xs text-espresso-500">
                          <span>{product.size} {product.unit}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1 text-amber-600 font-semibold">
                            <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                            {product.rating}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* "Why this matches you" Transparent Explanation Box */}
                    <div className="mt-4 bg-ivory-100 rounded-xl p-3 border border-ivory-200">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-plum-900 block mb-1.5">
                        Why this appeared for you:
                      </span>
                      <ul className="space-y-1">
                        {matchReasons.map((reason, i) => (
                          <li key={i} className="text-xs text-espresso-800 flex items-start gap-1.5">
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{reason}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Pricing and Action Footer */}
                  <div className="mt-5 pt-4 border-t border-ivory-200">
                    <div className="flex items-baseline justify-between mb-3">
                      <div>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-lg font-bold text-plum-950">
                            {formatCurrency(bestPrice)}
                          </span>
                          <span className="text-xs text-espresso-400 line-through">
                            MRP ₹{product.mrp}
                          </span>
                        </div>
                        <span className="text-[11px] text-espresso-500 block">
                          Recorded on {lowestOffer?.retailer || 'Nykaa'} (Sample)
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-semibold text-plum-800 bg-blush-100 px-2 py-0.5 rounded">
                          {unitCostFormatted}
                        </span>
                        <span className="text-[10px] text-espresso-400 block mt-0.5">
                          Unit Metric
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setSelectedProduct(product)}
                        className="py-2 px-3 rounded-xl border border-ivory-300 hover:border-plum-300 bg-white text-xs font-semibold text-espresso-800 flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Scale className="w-3.5 h-3.5 text-plum-700" />
                        <span>Compare</span>
                      </button>

                      {inBasket ? (
                        <button
                          onClick={() => removeFromBasket(product.id)}
                          className="py-2 px-3 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5 text-emerald-700" />
                          <span>In Basket</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => addToBasket(product.id)}
                          className="py-2 px-3 rounded-xl bg-plum-800 hover:bg-plum-900 text-ivory-100 text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>+ Basket</span>
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-ivory-300 p-12 text-center">
            <AlertCircle className="w-12 h-12 text-plum-700 mx-auto mb-3" />
            <h4 className="font-serif text-lg font-bold text-espresso-950">
              No matching products found for current profile constraints
            </h4>
            <p className="text-xs text-espresso-600 max-w-md mx-auto mt-1.5">
              If you have set very strict constraints (e.g. Budget tier under ₹550 with Fragrance-Free only), try selecting "All Tiers" in your profile.
            </p>
            <button
              onClick={() => setIsProfileOpen(true)}
              className="mt-5 px-5 py-2.5 bg-plum-800 text-ivory-100 text-xs font-bold rounded-xl"
            >
              Adjust Preferences
            </button>
          </div>
        )}
      </div>

    </div>
  );
};
