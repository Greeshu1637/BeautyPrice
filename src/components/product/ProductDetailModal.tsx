import React, { useEffect, useState } from 'react';
import { 
  X, 
  ShoppingBag, 
  Check, 
  ShieldCheck, 
  Sparkles, 
  Store, 
  TrendingDown, 
  Scale, 
  Info, 
  Star, 
  Clock, 
  Tag,
  ExternalLink
} from 'lucide-react';
import { useBeauty } from '../../context/BeautyContext';
import { 
  formatCurrency, 
  getLowestOffer, 
  formatUnitPrice, 
  getDiscountPercentage,
  getAverageRecordedPrice 
} from '../../utils/pricing';
import { PriceHistoryChart } from './PriceHistoryChart';
import { AlternativesSection } from '../alternatives/AlternativesSection';

export const ProductDetailModal: React.FC = () => {
  const { selectedProduct, setSelectedProduct, addToBasket, isInBasket, removeFromBasket } = useBeauty();
  const [activeTab, setActiveTab] = useState<'offers' | 'history' | 'alternatives'>('offers');

  // Close on escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedProduct(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setSelectedProduct]);

  // Reset tab to offers when viewing a different product (e.g. from alternatives)
  useEffect(() => {
    if (selectedProduct?.id) {
      setActiveTab('offers');
    }
  }, [selectedProduct?.id]);

  if (!selectedProduct) return null;

  const product = selectedProduct;
  const lowestOffer = getLowestOffer(product);
  const bestPrice = lowestOffer?.price || product.mrp;
  const discountPct = getDiscountPercentage(product.mrp, bestPrice);
  const avgPrice = getAverageRecordedPrice(product);
  const inBasket = isInBasket(product.id);

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-espresso-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 md:p-6 animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={() => setSelectedProduct(null)}
    >
      <div 
        className="bg-ivory-100 rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-modal border border-ivory-300 relative flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Close Button */}
        <button
          onClick={() => setSelectedProduct(null)}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-espresso-700 hover:text-espresso-950 flex items-center justify-center shadow-xs transition-colors cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Product Overview Header Hero */}
        <div className="p-6 md:p-8 bg-white border-b border-ivory-300">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            
            {/* Product Image */}
            <div className="md:col-span-4 relative rounded-xl overflow-hidden bg-ivory-200 border border-ivory-300 aspect-square">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover object-center"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80';
                }}
              />
              {product.editorialBadge && (
                <span className="absolute top-3 left-3 bg-plum-800 text-ivory-100 text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full shadow-sm">
                  {product.editorialBadge}
                </span>
              )}
            </div>

            {/* Product Metadata & Actions */}
            <div className="md:col-span-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span className="text-xs font-bold uppercase tracking-wider text-plum-800 font-sans">
                    {product.brand}
                  </span>
                  <span className="text-espresso-300">•</span>
                  <span className="text-xs text-espresso-600 capitalize">
                    {product.category} · {product.subcategory}
                  </span>
                  <span className="text-espresso-300">•</span>
                  <span className="text-xs text-espresso-600">
                    Net: {product.size} {product.unit}
                  </span>
                </div>

                <h3 id="modal-title" className="font-serif text-2xl sm:text-3xl font-bold text-espresso-950 leading-tight">
                  {product.name}
                </h3>

                {/* Rating & reviews */}
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center gap-1 bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded text-xs font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span>{product.rating}</span>
                  </div>
                  <span className="text-xs text-espresso-500">
                    ({product.reviewCount.toLocaleString('en-IN')} recorded ratings)
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-espresso-700 mt-3 leading-relaxed">
                  {product.description}
                </p>

                {/* Actives & Formulation Tags */}
                <div className="mt-3.5 flex flex-wrap gap-1.5">
                  {product.fragranceFree && (
                    <span className="text-[11px] bg-ivory-200 text-espresso-800 px-2.5 py-0.5 rounded-full font-medium">
                      Fragrance-Free
                    </span>
                  )}
                  {product.crueltyFree && (
                    <span className="text-[11px] bg-ivory-200 text-espresso-800 px-2.5 py-0.5 rounded-full font-medium">
                      Cruelty-Free
                    </span>
                  )}
                  {product.skinTypes.map(st => (
                    <span key={st} className="text-[11px] bg-blush-100 text-plum-900 px-2 py-0.5 rounded-full font-medium">
                      {st} Skin
                    </span>
                  ))}
                </div>
              </div>

              {/* Price Callout Banner */}
              <div className="mt-5 p-4 rounded-xl bg-ivory-100 border border-ivory-300 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] uppercase font-bold text-espresso-500 tracking-wider block">
                    Recorded Best Sample Price
                  </span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-2xl sm:text-3xl font-bold text-plum-900">
                      {formatCurrency(bestPrice)}
                    </span>
                    <span className="text-xs sm:text-sm text-espresso-400 line-through">
                      MRP {formatCurrency(product.mrp)}
                    </span>
                    {discountPct > 0 && (
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                        {discountPct}% Off
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-semibold text-plum-800">
                      True Unit Cost: {formatUnitPrice(bestPrice, product.size, product.unit)}
                    </span>
                    <span className="text-[10px] text-espresso-400">
                      (Avg across sample retailers: {formatCurrency(avgPrice)})
                    </span>
                  </div>
                </div>

                {/* Add to Basket Action */}
                <div className="flex items-center gap-2">
                  {inBasket ? (
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-2 rounded-lg border border-emerald-300">
                        <Check className="w-4 h-4 text-emerald-700" />
                        In Shopping Basket
                      </span>
                      <button
                        onClick={() => removeFromBasket(product.id)}
                        className="text-xs text-rose-700 hover:text-rose-900 underline font-medium p-1 cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => addToBasket(product.id)}
                      className="px-5 py-2.5 rounded-xl bg-plum-800 hover:bg-plum-900 text-ivory-100 font-semibold text-sm shadow-md transition-all flex items-center gap-2 hover:scale-[1.02] cursor-pointer"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Basket Planner</span>
                    </button>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="px-6 border-b border-ivory-300 bg-ivory-200/50 flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('offers')}
            className={`py-3.5 px-4 font-sans text-xs sm:text-sm font-semibold border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'offers'
                ? 'border-plum-800 text-plum-900'
                : 'border-transparent text-espresso-600 hover:text-espresso-950'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>Retailer Price Comparison</span>
            <span className="text-[10px] bg-ivory-300 px-1.5 py-0.2 rounded-full font-bold">
              {product.retailerOffers.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`py-3.5 px-4 font-sans text-xs sm:text-sm font-semibold border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'history'
                ? 'border-plum-800 text-plum-900'
                : 'border-transparent text-espresso-600 hover:text-espresso-950'
            }`}
          >
            <TrendingDown className="w-4 h-4" />
            <span>Price History & Trends</span>
          </button>

          <button
            onClick={() => setActiveTab('alternatives')}
            className={`py-3.5 px-4 font-sans text-xs sm:text-sm font-semibold border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'alternatives'
                ? 'border-plum-800 text-plum-900'
                : 'border-transparent text-espresso-600 hover:text-espresso-950'
            }`}
          >
            <Scale className="w-4 h-4" />
            <span>Similar Alternatives & ₹/{product.unit}</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 md:p-8 space-y-6 flex-1">
          
          {/* TAB 1: RETAILER PRICE COMPARISON */}
          {activeTab === 'offers' && (
            <div className="space-y-4">
              <div className="bg-blush-50 border border-blush-200 p-3.5 rounded-xl flex items-start gap-2.5">
                <Info className="w-4 h-4 text-plum-700 shrink-0 mt-0.5" />
                <div className="text-xs text-espresso-700">
                  <strong className="text-plum-900">Retailer Integration & Data Provenance Notice:</strong> The recorded offers below are illustrative demonstration samples. External platforms (Nykaa, Tira, Amazon, Purplle, Blinkit, Myntra) are not currently connected via live APIs or automated web scraping. Direct product links are only shown when verified and active.
                </div>
              </div>

              {/* Table of recorded retailer offers */}
              <div className="border border-ivory-300 rounded-xl overflow-hidden bg-white shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead className="bg-ivory-200/80 text-espresso-600 text-[11px] font-bold uppercase tracking-wider border-b border-ivory-300">
                      <tr>
                        <th className="py-3 px-4">Sample Retailer</th>
                        <th className="py-3 px-4">Status & Delivery</th>
                        <th className="py-3 px-4">Promotional Tag</th>
                        <th className="py-3 px-4">True Unit Cost</th>
                        <th className="py-3 px-4 text-right">Recorded Price</th>
                        <th className="py-3 px-4 text-center">Retailer Page</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-ivory-200">
                      {product.retailerOffers.map((offer, idx) => {
                        const isLowest = offer.isLowest || offer.price === bestPrice;
                        return (
                          <tr 
                            key={idx}
                            className={`hover:bg-ivory-100 transition-colors ${
                              isLowest ? 'bg-emerald-50/40 font-medium' : ''
                            }`}
                          >
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-espresso-900">{offer.retailer}</span>
                                {isLowest && (
                                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded border border-emerald-300">
                                    Lowest Recorded
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] text-espresso-400 block mt-0.5">
                                {offer.priceStatus === 'verified_live' ? 'Verified Live Price' : 'Sample Benchmark'}
                                {offer.lastChecked ? ` · Checked ${offer.lastChecked}` : ''}
                              </span>
                            </td>

                            <td className="py-3.5 px-4 text-espresso-700">
                              <div className="flex items-center gap-1.5">
                                <span className={`w-2 h-2 rounded-full ${offer.inStock ? 'bg-emerald-500' : 'bg-rose-400'}`} />
                                <span className="text-xs">
                                  {offer.inStock ? 'In Stock (Sample)' : 'Out of Stock'}
                                </span>
                              </div>
                              {offer.deliverySpeed && (
                                <span className="text-[11px] text-espresso-500 flex items-center gap-1 mt-0.5">
                                  <Clock className="w-3 h-3 text-espresso-400" />
                                  Est. {offer.deliverySpeed}
                                </span>
                              )}
                            </td>

                            <td className="py-3.5 px-4">
                              {offer.offerTag ? (
                                <span className="inline-flex items-center gap-1 text-[11px] bg-blush-100 text-plum-900 px-2 py-0.5 rounded font-medium">
                                  <Tag className="w-3 h-3 text-plum-600" />
                                  {offer.offerTag}
                                </span>
                              ) : (
                                <span className="text-xs text-espresso-400">—</span>
                              )}
                            </td>

                            <td className="py-3.5 px-4 text-espresso-700 font-mono text-xs">
                              {formatUnitPrice(offer.price, product.size, product.unit)}
                            </td>

                            <td className="py-3.5 px-4 text-right">
                              <span className="text-base font-bold text-espresso-950 font-sans">
                                {formatCurrency(offer.price)}
                              </span>
                              <span className="block text-[10px] text-espresso-400">
                                vs MRP {formatCurrency(product.mrp)}
                              </span>
                            </td>

                            <td className="py-3.5 px-4 text-center">
                              {offer.productUrl && (offer.productUrl.startsWith('https://') || offer.productUrl.startsWith('http://')) ? (
                                <a
                                  href={offer.productUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-xs font-semibold text-plum-800 hover:text-plum-950 underline"
                                >
                                  <span>Visit Store</span>
                                  <ExternalLink className="w-3 h-3 text-plum-700" />
                                </a>
                              ) : (
                                <span className="text-[11px] text-espresso-400 italic">
                                  Retailer link unavailable
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Key ingredients breakdown */}
              <div className="bg-white p-5 rounded-xl border border-ivory-300">
                <h4 className="font-serif text-base font-bold text-espresso-900 mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-plum-700" />
                  Key Formulation Ingredients
                </h4>
                <div className="flex flex-wrap gap-2">
                  {product.keyIngredients.map((ing, i) => (
                    <span 
                      key={i} 
                      className="bg-ivory-200 border border-ivory-300 text-espresso-800 px-3 py-1 rounded-lg text-xs font-medium"
                    >
                      {ing}
                    </span>
                  ))}
                </div>
                <p className="text-[11px] text-espresso-500 mt-2 italic">
                  Note: Formulations may vary per batch. Always review physical package packaging for current ingredient listings.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: PRICE HISTORY */}
          {activeTab === 'history' && (
            <PriceHistoryChart product={product} />
          )}

          {/* TAB 3: ALTERNATIVES & UNIT-PRICE COMPARISON */}
          {activeTab === 'alternatives' && (
            <AlternativesSection product={product} />
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-ivory-200/60 border-t border-ivory-300 flex items-center justify-between text-xs text-espresso-600">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-plum-700" />
            <span>Independent Indian beauty shopping intelligence. All calculations illustrative.</span>
          </div>
          <button
            onClick={() => setSelectedProduct(null)}
            className="px-4 py-2 bg-white hover:bg-ivory-200 text-espresso-800 rounded-lg border border-ivory-300 font-medium transition-colors cursor-pointer"
          >
            Close Details
          </button>
        </div>

      </div>
    </div>
  );
};
