import { Product, RetailerOffer, BasketItem, RetailerName, BasketRetailerSummary } from '../types';

export const ALL_RETAILERS: RetailerName[] = ['Nykaa', 'Tira', 'Purplle', 'Amazon', 'Blinkit', 'Myntra'];

/**
 * Formats a number to Indian Rupee currency format (e.g., ₹1,299)
 */
export function formatCurrency(amount: number): string {
  return `₹${Math.round(amount).toLocaleString('en-IN')}`;
}

/**
 * Returns the lowest currently recorded retailer offer for a product
 */
export function getLowestOffer(product: Product): RetailerOffer | null {
  if (!product.retailerOffers || product.retailerOffers.length === 0) return null;
  return product.retailerOffers.reduce((lowest, current) => 
    current.price < lowest.price ? current : lowest
  );
}

/**
 * Returns the highest currently recorded retailer offer for a product
 */
export function getHighestOffer(product: Product): RetailerOffer | null {
  if (!product.retailerOffers || product.retailerOffers.length === 0) return null;
  return product.retailerOffers.reduce((highest, current) => 
    current.price > highest.price ? current : highest
  );
}

/**
 * Calculates the average recorded price among retailers
 */
export function getAverageRecordedPrice(product: Product): number {
  if (!product.retailerOffers || product.retailerOffers.length === 0) return product.mrp;
  const total = product.retailerOffers.reduce((sum, offer) => sum + offer.price, 0);
  return Math.round(total / product.retailerOffers.length);
}

/**
 * Computes price per ml or per gram
 */
export function getUnitPrice(price: number, size: number): number {
  if (!size || size <= 0) return 0;
  return Number((price / size).toFixed(2));
}

/**
 * Formats price per unit (e.g. ₹12.50 / ml)
 */
export function formatUnitPrice(price: number, size: number, unit: 'ml' | 'g'): string {
  const unitPrice = getUnitPrice(price, size);
  return `₹${unitPrice.toFixed(2)}/${unit}`;
}

/**
 * Computes percentage discount compared to MRP
 */
export function getDiscountPercentage(mrp: number, currentPrice: number): number {
  if (!mrp || mrp <= currentPrice) return 0;
  return Math.round(((mrp - currentPrice) / mrp) * 100);
}

/**
 * Calculates price stats for historical data
 */
export function getHistoryStats(product: Product) {
  if (!product.priceHistory || product.priceHistory.length === 0) {
    const lowest = getLowestOffer(product)?.price || product.mrp;
    return {
      allTimeLowest: lowest,
      allTimeHighest: product.mrp,
      average: lowest,
      latestDate: 'Current Sample Data',
      dataPointsCount: 0,
    };
  }

  const prices = product.priceHistory.map(h => h.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const avg = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);
  const latest = product.priceHistory[product.priceHistory.length - 1];

  return {
    allTimeLowest: min,
    allTimeHighest: max,
    average: avg,
    latestDate: latest?.date || 'Recent Sample',
    dataPointsCount: product.priceHistory.length,
  };
}

/**
 * Computes basket totals across sample retailers and best split combination
 */
export function calculateBasketAnalytics(basket: BasketItem[], allProducts: Product[]) {
  if (basket.length === 0) {
    return {
      retailerSummaries: [] as BasketRetailerSummary[],
      optimalSplit: {
        totalPrice: 0,
        mrpTotal: 0,
        savingsVsMRP: 0,
        savingsVsHighestRetailer: 0,
        items: [] as { product: Product; quantity: number; bestOffer: RetailerOffer; lineTotal: number }[],
      },
      totalItemsCount: 0,
    };
  }

  // Map basket items to product models
  const itemDetails = basket.map(item => {
    const product = allProducts.find(p => p.id === item.productId);
    return {
      item,
      product: product!,
      quantity: item.quantity,
    };
  }).filter(entry => entry.product !== undefined);

  const totalItemsCount = itemDetails.reduce((sum, i) => sum + i.quantity, 0);
  const mrpTotal = itemDetails.reduce((sum, i) => sum + (i.product.mrp * i.quantity), 0);

  // 1. Calculate each retailer's basket
  const retailerSummaries: BasketRetailerSummary[] = ALL_RETAILERS.map(retailer => {
    let totalPrice = 0;
    let availableCount = 0;
    const missing: string[] = [];

    itemDetails.forEach(({ product, quantity }) => {
      const offer = product.retailerOffers.find(o => o.retailer === retailer && o.inStock);
      if (offer) {
        totalPrice += offer.price * quantity;
        availableCount += 1;
      } else {
        missing.push(product.name);
      }
    });

    const allAvailable = availableCount === itemDetails.length;
    // Standard sample delivery charge if order is below ₹499 (for demo illustration)
    const sampleDeliveryFee = totalPrice > 0 && totalPrice < 499 ? 49 : 0;

    return {
      retailer,
      totalPrice,
      availableItemsCount: availableCount,
      totalItemsCount: itemDetails.length,
      allAvailable,
      missingProducts: missing,
      sampleDeliveryFee,
      grandTotal: totalPrice + sampleDeliveryFee,
    };
  });

  // Sort summaries so retailers with all available items and lowest price come first
  retailerSummaries.sort((a, b) => {
    if (a.allAvailable && !b.allAvailable) return -1;
    if (!a.allAvailable && b.allAvailable) return 1;
    if (a.allAvailable && b.allAvailable) return a.grandTotal - b.grandTotal;
    return b.availableItemsCount - a.availableItemsCount;
  });

  // 2. Optimal Split (buy each product from whichever retailer recorded the lowest sample price)
  const optimalItems = itemDetails.map(({ product, quantity }) => {
    const bestOffer = getLowestOffer(product) || {
      retailer: 'Nykaa' as RetailerName,
      price: product.mrp,
      inStock: true
    };
    return {
      product,
      quantity,
      bestOffer,
      lineTotal: bestOffer.price * quantity,
    };
  });

  const optimalTotalPrice = optimalItems.reduce((sum, i) => sum + i.lineTotal, 0);
  const highestRetailerTotal = Math.max(
    ...retailerSummaries.filter(r => r.allAvailable).map(r => r.totalPrice),
    optimalTotalPrice
  );

  return {
    retailerSummaries,
    optimalSplit: {
      totalPrice: optimalTotalPrice,
      mrpTotal,
      savingsVsMRP: mrpTotal - optimalTotalPrice,
      savingsVsHighestRetailer: Math.max(0, highestRetailerTotal - optimalTotalPrice),
      items: optimalItems,
    },
    totalItemsCount,
  };
}
