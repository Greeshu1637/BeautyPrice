import React from 'react';
import { Product } from '../../types';
import { useBeauty } from '../../context/BeautyContext';
import { 
  formatCurrency, 
  getLowestOffer, 
  formatUnitPrice, 
  getDiscountPercentage 
} from '../../utils/pricing';
import { ShoppingBag, Check, Scale, Eye, Star } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { setSelectedProduct, addToBasket, isInBasket, removeFromBasket } = useBeauty();

  const lowestOffer = getLowestOffer(product);
  const bestPrice = lowestOffer?.price || product.mrp;
  const discount = getDiscountPercentage(product.mrp, bestPrice);
  const unitPriceFormatted = formatUnitPrice(bestPrice, product.size, product.unit);
  const inBasket = isInBasket(product.id);

  return (
    <article className="group bg-white rounded-2xl border border-ivory-300 hover:border-plum-300 shadow-soft hover:shadow-elevated transition-all duration-300 flex flex-col justify-between overflow-hidden relative">
      
      {/* Top Media Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-ivory-200">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80';
          }}
        />

        {/* Editorial badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start z-10">
          {product.editorialBadge && (
            <span className="bg-plum-900/90 backdrop-blur-xs text-champagne-300 text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full shadow-xs">
              {product.editorialBadge}
            </span>
          )}
          {discount >= 15 && (
            <span className="bg-emerald-700/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
              {discount}% Off Sample
            </span>
          )}
        </div>

        {/* Hover Quick View Trigger */}
        <button
          onClick={() => setSelectedProduct(product)}
          className="absolute inset-0 bg-espresso-950/20 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-semibold text-xs tracking-wide cursor-pointer"
        >
          <span className="bg-white/95 text-espresso-950 px-3.5 py-1.5 rounded-full shadow-md flex items-center gap-1.5 hover:bg-white">
            <Eye className="w-3.5 h-3.5 text-plum-700" />
            <span>Compare Prices</span>
          </span>
        </button>
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Category line */}
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-sans font-bold uppercase tracking-wider text-plum-800 text-[11px]">
              {product.brand}
            </span>
            <span className="text-[11px] text-espresso-500 capitalize">
              {product.size} {product.unit}
            </span>
          </div>

          {/* Product Title */}
          <h3 
            onClick={() => setSelectedProduct(product)}
            className="font-serif font-bold text-espresso-950 text-base leading-snug line-clamp-2 hover:text-plum-800 transition-colors cursor-pointer"
          >
            {product.name}
          </h3>

          {/* Key Actives snippet */}
          <p className="text-[11px] text-espresso-600 mt-1 line-clamp-1">
            Actives: {product.keyIngredients.slice(0, 2).join(', ')}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-1 mt-2 text-xs">
            <div className="flex items-center text-amber-500">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-bold text-espresso-800 ml-1">{product.rating}</span>
            </div>
            <span className="text-espresso-400 text-[11px]">
              ({product.reviewCount > 1000 ? `${(product.reviewCount / 1000).toFixed(1)}k` : product.reviewCount})
            </span>
          </div>
        </div>

        {/* Pricing Block */}
        <div className="mt-4 pt-3 border-t border-ivory-200">
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="font-bold text-lg text-plum-950">
                {formatCurrency(bestPrice)}
              </span>
              <span className="text-xs text-espresso-400 line-through">
                ₹{product.mrp}
              </span>
            </div>

            {/* True Unit Price Highlight */}
            <span 
              className="text-[11px] font-semibold text-plum-800 bg-blush-100 px-2 py-0.5 rounded-md"
              title="Calculated cost per ml or gram based on recorded lowest offer"
            >
              {unitPriceFormatted}
            </span>
          </div>

          {/* Retailer badge */}
          <div className="flex items-center justify-between text-[11px] text-espresso-500 mt-1">
            <span>
              Best at <strong className="text-espresso-800 font-semibold">{lowestOffer?.retailer || 'Nykaa'}</strong> (Demo)
            </span>
            <span className="text-espresso-400 text-[10px]">
              {product.retailerOffers.length} offers
            </span>
          </div>

          {/* Action Row */}
          <div className="grid grid-cols-2 gap-2 mt-3.5">
            <button
              onClick={() => setSelectedProduct(product)}
              className="w-full py-2 px-2.5 rounded-xl border border-ivory-300 hover:border-plum-300 bg-ivory-100 hover:bg-white text-espresso-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Scale className="w-3.5 h-3.5 text-plum-700" />
              <span>Details</span>
            </button>

            {inBasket ? (
              <button
                onClick={() => removeFromBasket(product.id)}
                className="w-full py-2 px-2.5 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                title="Click to remove from shopping basket"
              >
                <Check className="w-3.5 h-3.5 text-emerald-700" />
                <span>In Basket</span>
              </button>
            ) : (
              <button
                onClick={() => addToBasket(product.id)}
                className="w-full py-2 px-2.5 rounded-xl bg-plum-800 hover:bg-plum-900 text-ivory-100 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-xs hover:shadow cursor-pointer"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-champagne-300" />
                <span>+ Basket</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </article>
  );
};
