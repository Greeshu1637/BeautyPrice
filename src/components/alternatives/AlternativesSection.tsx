import React from 'react';
import { Product } from '../../types';
import { useBeauty } from '../../context/BeautyContext';
import { findSimilarAlternatives } from '../../utils/similarity';
import { formatCurrency, getLowestOffer } from '../../utils/pricing';
import { Scale, CheckCircle2, ArrowRight } from 'lucide-react';

interface AlternativesSectionProps {
  product: Product;
}

export const AlternativesSection: React.FC<AlternativesSectionProps> = ({ product }) => {
  const { products, setSelectedProduct, addToBasket, isInBasket } = useBeauty();

  const alternatives = findSimilarAlternatives(product, products, 4);

  if (alternatives.length === 0) {
    return (
      <div className="bg-ivory-100 rounded-xl p-6 text-center border border-ivory-300">
        <p className="text-sm text-espresso-600">
          No direct formulation alternatives identified in this category yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-plum-700" />
            <h4 className="font-serif text-lg font-bold text-espresso-950">
              Formulation Alternatives & Unit-Price Value
            </h4>
          </div>
          <p className="text-xs text-espresso-500 mt-0.5">
            Compare active ingredients and true cost per {product.unit} side-by-side
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {alternatives.map((alt) => {
          const item = alt.product;
          const inBasket = isInBasket(item.id);

          return (
            <div
              key={item.id}
              className={`rounded-xl border p-4 transition-all flex flex-col justify-between ${
                alt.isCheaperPerUnit
                  ? 'bg-emerald-50/40 border-emerald-200 hover:border-emerald-300'
                  : 'bg-white border-ivory-300 hover:border-ivory-400'
              }`}
            >
              <div>
                {/* Header tag */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold tracking-wider uppercase text-plum-800">
                    {item.brand}
                  </span>
                  {alt.isCheaperPerUnit ? (
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full flex items-center gap-1 border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Save ₹{Math.abs(alt.unitPriceDifference)}/{product.unit}
                    </span>
                  ) : (
                    <span className="text-[10px] bg-ivory-200 text-espresso-600 px-2 py-0.5 rounded-full">
                      Alternative Choice
                    </span>
                  )}
                </div>

                {/* Product Name & Image */}
                <div className="flex gap-3 items-start">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-14 h-14 object-cover rounded-lg bg-ivory-200 shrink-0 border border-ivory-200"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=300&q=80';
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <h5 className="font-semibold text-xs sm:text-sm text-espresso-900 leading-snug line-clamp-2">
                      {item.name}
                    </h5>
                    <p className="text-[11px] text-espresso-500 mt-0.5">
                      {item.size} {item.unit} · {item.subcategory}
                    </p>
                  </div>
                </div>

                {/* Rationale & Shared Actives */}
                <div className="mt-3 bg-white/80 p-2.5 rounded-lg border border-ivory-200 text-xs">
                  <p className="text-espresso-700 font-medium text-[11px]">
                    {alt.rationale}
                  </p>
                  {alt.sharedIngredients.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {alt.sharedIngredients.map((ing, i) => (
                        <span key={i} className="text-[10px] bg-blush-100 text-plum-900 px-1.5 py-0.2 rounded font-medium">
                          {ing}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Price & Unit Comparison footer */}
              <div className="mt-4 pt-3 border-t border-ivory-200 flex items-center justify-between gap-2">
                <div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-sm font-bold text-espresso-950">
                      {formatCurrency(getLowestOffer(item)?.price || item.mrp)}
                    </span>
                    <span className="text-[10px] text-espresso-400 line-through">
                      MRP {formatCurrency(item.mrp)}
                    </span>
                  </div>
                  <div className="text-[11px] font-semibold text-plum-800">
                    Unit: {alt.unitPriceFormatted}
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setSelectedProduct(item)}
                    className="p-1.5 text-xs text-plum-800 hover:text-plum-950 rounded hover:bg-blush-100 transition-colors flex items-center gap-1 cursor-pointer"
                    title="View details"
                  >
                    <span>View</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => addToBasket(item.id)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      inBasket
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-plum-800 hover:bg-plum-900 text-ivory-100 shadow-xs'
                    }`}
                  >
                    {inBasket ? 'In Basket' : '+ Basket'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
