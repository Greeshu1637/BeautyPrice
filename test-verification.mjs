import { SAMPLE_PRODUCTS } from './src/data/products';
import { 
  getLowestOffer, 
  getHighestOffer, 
  getAverageRecordedPrice, 
  getUnitPrice, 
  getHistoryStats, 
  calculateBasketAnalytics 
} from './src/utils/pricing';
import { findSimilarAlternatives } from './src/utils/similarity';
import { scoreRecommendations } from './src/utils/recommendations';

console.log('--- BeautyPrice Verification Suite ---');

// 1. Catalog count verification
console.log(`Product Catalog Count: ${SAMPLE_PRODUCTS.length} (Requirement: at least 30)`);
if (SAMPLE_PRODUCTS.length >= 30) {
  console.log('✓ Product count check PASSED');
} else {
  console.error('✗ Product count check FAILED');
  process.exit(1);
}

// 2. Unit price & offer calculations
const firstProduct = SAMPLE_PRODUCTS[0];
const lowest = getLowestOffer(firstProduct);
const highest = getHighestOffer(firstProduct);
const avg = getAverageRecordedPrice(firstProduct);
const unitPrice = getUnitPrice(lowest.price, firstProduct.size);

console.log(`\nTesting Product: "${firstProduct.name}" (${firstProduct.brand})`);
console.log(`- MRP: ₹${firstProduct.mrp}`);
console.log(`- Lowest Recorded Offer: ₹${lowest.price} (${lowest.retailer})`);
console.log(`- Highest Recorded Offer: ₹${highest.price} (${highest.retailer})`);
console.log(`- Average Recorded Price: ₹${avg}`);
console.log(`- True Unit Price: ₹${unitPrice}/${firstProduct.unit}`);

if (lowest.price <= highest.price && unitPrice > 0) {
  console.log('✓ Pricing calculations PASSED');
} else {
  console.error('✗ Pricing calculations FAILED');
  process.exit(1);
}

// 3. Price History Stats
const historyStats = getHistoryStats(firstProduct);
console.log(`\nPrice History Stats: Lowest ₹${historyStats.allTimeLowest}, Highest ₹${historyStats.allTimeHighest}, Avg ₹${historyStats.average}`);
if (historyStats.dataPointsCount > 0) {
  console.log('✓ Price history tracking PASSED');
} else {
  console.error('✗ Price history tracking FAILED');
  process.exit(1);
}

// 4. Similarity & Alternatives Engine
const alternatives = findSimilarAlternatives(firstProduct, SAMPLE_PRODUCTS, 3);
console.log(`\nFound ${alternatives.length} similar alternatives for ${firstProduct.name}:`);
alternatives.forEach(alt => {
  console.log(`- [${alt.product.brand}] ${alt.product.name}: ${alt.rationale}`);
});
if (alternatives.length > 0) {
  console.log('✓ Alternatives engine PASSED');
} else {
  console.error('✗ Alternatives engine FAILED');
  process.exit(1);
}

// 5. Transparent Rule-Based Recommendation Engine
const mockProfile = {
  skinType: 'Oily',
  concerns: ['Acne & Blemishes', 'Sun Protection'],
  budgetTier: 'all',
  preferredCategories: ['skincare', 'haircare', 'makeup', 'bodycare'],
  fragranceFreeOnly: true,
};
const recs = scoreRecommendations(SAMPLE_PRODUCTS, mockProfile, 5);
console.log(`\nScored Recommendations for Oily Skin + Acne Focus (${recs.length} matches):`);
recs.forEach(r => {
  console.log(`- Score: ${r.score}% | [${r.product.brand}] ${r.product.name} | Reasons: ${r.matchReasons.join('; ')}`);
});
if (recs.length > 0 && recs.every(r => r.score >= 40)) {
  console.log('✓ Recommendation scoring engine PASSED');
} else {
  console.error('✗ Recommendation scoring engine FAILED');
  process.exit(1);
}

// 6. Basket Planner Multi-Retailer Analytics
const mockBasket = [
  { productId: SAMPLE_PRODUCTS[0].id, quantity: 1 },
  { productId: SAMPLE_PRODUCTS[1].id, quantity: 2 },
  { productId: SAMPLE_PRODUCTS[6].id, quantity: 1 },
];
const basketAnalytics = calculateBasketAnalytics(mockBasket, SAMPLE_PRODUCTS);
console.log(`\nBasket Planner Analysis for ${basketAnalytics.totalItemsCount} units:`);
console.log(`- MRP Total: ₹${basketAnalytics.optimalSplit.mrpTotal}`);
console.log(`- Smart Split Total: ₹${basketAnalytics.optimalSplit.totalPrice} (Save ₹${basketAnalytics.optimalSplit.savingsVsMRP})`);
basketAnalytics.retailerSummaries.forEach(s => {
  console.log(`- Retailer ${s.retailer}: ₹${s.grandTotal} (${s.availableItemsCount}/${s.totalItemsCount} available)`);
});
if (basketAnalytics.optimalSplit.totalPrice > 0 && basketAnalytics.retailerSummaries.length === 6) {
  console.log('✓ Basket planner multi-retailer engine PASSED');
} else {
  console.error('✗ Basket planner multi-retailer engine FAILED');
  process.exit(1);
}

console.log('\n========================================');
console.log('ALL BEAUTYPRICE ENGINES VERIFIED SUCCESSFULLY!');
console.log('========================================');
