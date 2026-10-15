import React from 'react';
import { useBeauty } from '../../context/BeautyContext';
import { calculateBasketAnalytics, formatCurrency, formatUnitPrice } from '../../utils/pricing';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  Sparkles, 
  Store, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2 
} from 'lucide-react';

export const BasketPlanner: React.FC = () => {
  const { basket, products, updateBasketQuantity, removeFromBasket, clearBasket, setActiveTab, setSelectedProduct } = useBeauty();

  const analytics = calculateBasketAnalytics(basket, products);

  if (basket.length === 0 || analytics.totalItemsCount === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 mx-auto rounded-full bg-blush-100 flex items-center justify-center text-plum-800 mb-5">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="font-serif text-3xl font-bold text-espresso-950">
          Your Basket Planner is Empty
        </h2>
        <p className="text-sm text-espresso-600 max-w-md mx-auto mt-2">
          Add beauty products from our catalog to compare total haul prices across Nykaa, Tira, Amazon, Purplle, and Blinkit in one place.
        </p>
        <button
          onClick={() => setActiveTab('catalog')}
          className="mt-6 px-6 py-3 bg-plum-800 hover:bg-plum-900 text-ivory-100 font-bold text-sm rounded-xl shadow-md transition-all cursor-pointer"
        >
          Explore 30+ Formulations
        </button>
      </div>
    );
  }

  const { retailerSummaries, optimalSplit, totalItemsCount } = analytics;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 border-b border-ivory-300 gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-plum-800">
            Multi-Retailer Optimizer
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-espresso-950 mt-1">
            Shopping Basket Planner
          </h2>
          <p className="text-sm text-espresso-600 mt-1">
            Simulate and compare total haul costs across 6 Indian retailers. Discover single-store vs split savings.
          </p>
        </div>

        <button
          onClick={clearBasket}
          className="text-xs text-rose-700 hover:text-rose-900 font-semibold underline flex items-center gap-1 self-start sm:self-auto cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear All ({totalItemsCount} items)</span>
        </button>
      </div>

      {/* Demo Data Disclaimer Banner */}
      <div className="mt-6 bg-blush-50 border border-blush-200 rounded-xl p-4 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-plum-700 shrink-0 mt-0.5" />
        <div className="text-xs text-espresso-700 leading-relaxed">
          <strong className="text-plum-900 font-bold">Illustrative Simulation Only:</strong> Basket totals, delivery thresholds, and inventory statuses are demonstration benchmarks. BeautyPrice does not execute live checkouts or take payment.
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ================= LEFT: BASKET ITEMS LIST ================= */}
        <section className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl font-bold text-espresso-950">
              Planned Items ({basket.length} Products, {totalItemsCount} Units)
            </h3>
            <button
              onClick={() => setActiveTab('catalog')}
              className="text-xs text-plum-800 hover:text-plum-950 font-bold flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add More Products</span>
            </button>
          </div>

          <div className="space-y-3">
            {optimalSplit.items.map(({ product, quantity, bestOffer, lineTotal }) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-ivory-300 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                {/* Product Media & Info */}
                <div className="flex items-center gap-3.5 flex-1 min-w-0">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-16 rounded-xl object-cover bg-ivory-200 border border-ivory-200 shrink-0 cursor-pointer"
                    onClick={() => setSelectedProduct(product)}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=300&q=80';
                    }}
                  />
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-plum-800">
                      {product.brand}
                    </span>
                    <h4 
                      onClick={() => setSelectedProduct(product)}
                      className="font-serif font-bold text-sm text-espresso-950 leading-snug line-clamp-1 hover:text-plum-800 cursor-pointer"
                    >
                      {product.name}
                    </h4>
                    <p className="text-xs text-espresso-500 mt-0.5">
                      {product.size} {product.unit} · {formatUnitPrice(bestOffer.price, product.size, product.unit)}
                    </p>
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold inline-block mt-1">
                      Best recorded on {bestOffer.retailer}: {formatCurrency(bestOffer.price)}
                    </span>
                  </div>
                </div>

                {/* Quantity Controls & Line Total */}
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-ivory-200">
                  {/* Quantity Stepper */}
                  <div className="flex items-center border border-ivory-300 rounded-lg bg-ivory-100 overflow-hidden">
                    <button
                      onClick={() => updateBasketQuantity(product.id, quantity - 1)}
                      className="p-1.5 text-espresso-600 hover:bg-ivory-200 transition-colors cursor-pointer"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-bold text-espresso-900 font-mono">
                      {quantity}
                    </span>
                    <button
                      onClick={() => updateBasketQuantity(product.id, quantity + 1)}
                      className="p-1.5 text-espresso-600 hover:bg-ivory-200 transition-colors cursor-pointer"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Line Total */}
                  <div className="text-right">
                    <span className="font-bold text-base text-espresso-950 block font-sans">
                      {formatCurrency(lineTotal)}
                    </span>
                    <span className="text-[10px] text-espresso-400 line-through">
                      MRP {formatCurrency(product.mrp * quantity)}
                    </span>
                  </div>

                  {/* Delete Item */}
                  <button
                    onClick={() => removeFromBasket(product.id)}
                    className="p-1.5 text-espresso-400 hover:text-rose-700 transition-colors cursor-pointer"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ================= RIGHT: RETAILER COMPARISON INTELLIGENCE ================= */}
        <section className="lg:col-span-5 space-y-6">
          
          {/* OPTIMAL SPLIT CARD (SMART BASKET) */}
          <div className="bg-gradient-to-br from-plum-900 to-plum-950 text-ivory-100 rounded-2xl p-6 shadow-elevated relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-champagne-300" />
                <span className="text-xs font-bold uppercase tracking-wider text-champagne-300">
                  Smart Split Strategy
                </span>
              </div>
              <span className="text-[10px] bg-plum-800 text-ivory-100 px-2 py-0.5 rounded-full font-semibold border border-plum-700">
                Optimal Mix
              </span>
            </div>

            <p className="text-xs text-blush-200 leading-snug">
              If you purchase each product from whichever retailer recorded the lowest sample price:
            </p>

            <div className="mt-4 pt-3 border-t border-plum-800/80 flex items-baseline justify-between">
              <div>
                <span className="text-xs text-blush-300 block">Simulated Optimal Total</span>
                <span className="font-serif text-3xl font-bold text-ivory-100">
                  {formatCurrency(optimalSplit.totalPrice)}
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs text-champagne-300 font-bold block">
                  Save {formatCurrency(optimalSplit.savingsVsMRP)}
                </span>
                <span className="text-[11px] text-blush-300">
                  vs ₹{optimalSplit.mrpTotal.toLocaleString('en-IN')} MRP
                </span>
              </div>
            </div>

            {optimalSplit.savingsVsHighestRetailer > 0 && (
              <div className="mt-3 bg-plum-800/70 p-2.5 rounded-lg border border-plum-700 text-[11px] text-blush-100 flex items-center justify-between">
                <span>Savings vs most expensive single retailer:</span>
                <strong className="text-champagne-300 font-bold">
                  +{formatCurrency(optimalSplit.savingsVsHighestRetailer)}
                </strong>
              </div>
            )}
          </div>

          {/* SINGLE RETAILER BASKET COMPARISON */}
          <div className="bg-white rounded-2xl border border-ivory-300 p-5 shadow-soft">
            <div className="flex items-center justify-between mb-3 pb-3 border-b border-ivory-200">
              <div className="flex items-center gap-2">
                <Store className="w-4 h-4 text-plum-800" />
                <h4 className="font-serif font-bold text-espresso-950 text-base">
                  Single-Retailer Haul Comparison
                </h4>
              </div>
              <span className="text-[10px] text-espresso-400">
                Sample simulation
              </span>
            </div>

            <div className="space-y-3">
              {retailerSummaries.map((summary) => (
                <div
                  key={summary.retailer}
                  className={`p-3.5 rounded-xl border transition-all ${
                    summary.allAvailable
                      ? 'bg-ivory-50 border-ivory-300'
                      : 'bg-ivory-100/50 border-dashed border-ivory-300 opacity-80'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-espresso-950">
                        {summary.retailer}
                      </span>
                      {summary.allAvailable ? (
                        <span className="text-[10px] text-emerald-800 bg-emerald-100 px-2 py-0.2 rounded-full font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          All {summary.totalItemsCount} items
                        </span>
                      ) : (
                        <span className="text-[10px] text-amber-800 bg-amber-100 px-2 py-0.2 rounded-full font-bold flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 text-amber-600" />
                          {summary.availableItemsCount}/{summary.totalItemsCount} available
                        </span>
                      )}
                    </div>

                    <div className="text-right">
                      <span className="font-bold text-sm text-espresso-950">
                        {summary.totalPrice > 0 ? formatCurrency(summary.grandTotal) : 'N/A'}
                      </span>
                      {summary.sampleDeliveryFee > 0 && (
                        <span className="text-[10px] text-espresso-400 block">
                          incl. ₹{summary.sampleDeliveryFee} delivery
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Missing items indicator if any */}
                  {summary.missingProducts.length > 0 && (
                    <div className="mt-2 text-[11px] text-rose-800 bg-rose-50 p-2 rounded border border-rose-200">
                      Sample out of stock: {summary.missingProducts.join(', ')}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <p className="text-[11px] text-espresso-500 italic text-center mt-4">
              Tip: Buying everything on one platform often saves separate courier deliveries, while splitting orders saves on individual item price drops!
            </p>
          </div>

        </section>

      </div>

    </div>
  );
};
