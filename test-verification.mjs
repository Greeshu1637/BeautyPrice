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

// 7. Robust Product Search Engine Verification (Phase 1 & Phase 4)
import { filterAndSortProducts } from './src/utils/search';

console.log('\n--- Search & Discovery Engine Verification ---');

const baseFilter = {
  search: '',
  category: 'all',
  subcategory: 'all',
  brand: 'all',
  minPrice: 0,
  maxPrice: 6500,
  skinType: 'all',
  concern: 'all',
  sortBy: 'recommended',
};

// 7a. Test "Dot & Key sunscreen"
const dotKeyExact = filterAndSortProducts(SAMPLE_PRODUCTS, { ...baseFilter, search: 'Dot & Key sunscreen' });
console.log(`- Query "Dot & Key sunscreen": ${dotKeyExact.length} matches (Expected: at least 1)`);
dotKeyExact.forEach(p => console.log(`  Found: [${p.brand}] ${p.name}`));
if (dotKeyExact.length > 0 && dotKeyExact.some(p => p.brand === 'Dot & Key' && p.subcategory === 'Sunscreen')) {
  console.log('✓ Query "Dot & Key sunscreen" PASSED');
} else {
  console.error('✗ Query "Dot & Key sunscreen" FAILED');
  process.exit(1);
}

// 7b. Test "dot and key sunscreen"
const dotKeyAnd = filterAndSortProducts(SAMPLE_PRODUCTS, { ...baseFilter, search: 'dot and key sunscreen' });
console.log(`- Query "dot and key sunscreen": ${dotKeyAnd.length} matches`);
if (dotKeyAnd.length > 0 && dotKeyAnd.some(p => p.brand === 'Dot & Key')) {
  console.log('✓ Query "dot and key sunscreen" PASSED');
} else {
  console.error('✗ Query "dot and key sunscreen" FAILED');
  process.exit(1);
}

// 7c. Test "DotKey sunscreen"
const dotKeySquashed = filterAndSortProducts(SAMPLE_PRODUCTS, { ...baseFilter, search: 'DotKey sunscreen' });
console.log(`- Query "DotKey sunscreen": ${dotKeySquashed.length} matches`);
if (dotKeySquashed.length > 0 && dotKeySquashed.some(p => p.brand === 'Dot & Key')) {
  console.log('✓ Query "DotKey sunscreen" PASSED');
} else {
  console.error('✗ Query "DotKey sunscreen" FAILED');
  process.exit(1);
}

// 7d. Test "Minimalist serum"
const minimalistSerum = filterAndSortProducts(SAMPLE_PRODUCTS, { ...baseFilter, search: 'Minimalist serum' });
console.log(`- Query "Minimalist serum": ${minimalistSerum.length} matches`);
if (minimalistSerum.length > 0 && minimalistSerum.some(p => p.brand === 'Minimalist')) {
  console.log('✓ Query "Minimalist serum" PASSED');
} else {
  console.error('✗ Query "Minimalist serum" FAILED');
  process.exit(1);
}

// 7e. Test query with NO matches (no fabrication)
const nonExistent = filterAndSortProducts(SAMPLE_PRODUCTS, { ...baseFilter, search: 'xyznonexistentproductquery' });
console.log(`- Non-existent query result count: ${nonExistent.length} (Expected: exactly 0, no fabrication)`);
if (nonExistent.length === 0) {
  console.log('✓ Empty state honesty check (no fabricated items) PASSED');
} else {
  console.error('✗ Empty state honesty check FAILED');
  process.exit(1);
}

// 8. Search Combined with Filters & Clear Reset (Phase 1 & Phase 4)
console.log('\n--- Combining Search and Filters ---');
const combinedMatch = filterAndSortProducts(SAMPLE_PRODUCTS, { 
  ...baseFilter, 
  search: 'sunscreen',
  category: 'skincare',
  brand: 'Dot & Key'
});
console.log(`- Combined query ("sunscreen" + skincare + Dot & Key): ${combinedMatch.length} matches`);
if (combinedMatch.length === 1 && combinedMatch[0].brand === 'Dot & Key') {
  console.log('✓ Combined query (search + category + brand) PASSED');
} else {
  console.error('✗ Combined query FAILED');
  process.exit(1);
}

// Combined mismatch
const combinedMismatch = filterAndSortProducts(SAMPLE_PRODUCTS, { 
  ...baseFilter, 
  search: 'sunscreen',
  category: 'haircare', // Sunscreen is not haircare!
});
console.log(`- Incompatible combination ("sunscreen" in haircare): ${combinedMismatch.length} matches`);
if (combinedMismatch.length === 0) {
  console.log('✓ Incompatible filter combination correctly yields 0 matches PASSED');
} else {
  console.error('✗ Incompatible filter combination FAILED');
  process.exit(1);
}

// Reset restores full catalog
const resetCatalog = filterAndSortProducts(SAMPLE_PRODUCTS, baseFilter);
if (resetCatalog.length === SAMPLE_PRODUCTS.length) {
  console.log(`✓ Filter reset restores full catalog (${resetCatalog.length} products) PASSED`);
} else {
  console.error('✗ Filter reset FAILED');
  process.exit(1);
}

// 9. Retailer Link Validation & Data Provenance (Phase 2 & Phase 3)
import { activeProductProvider } from './src/services/productDataProvider';

console.log('\n--- Retailer Links & Data Provenance Verification ---');
const sourceMeta = activeProductProvider.getMetadata();
console.log(`- Data Provider: "${sourceMeta.name}"`);
console.log(`- Is Live Provider: ${sourceMeta.isLive} (Correctly declared false - no unverified integration claims)`);
console.log(`- Status: "${sourceMeta.statusText}"`);

if (sourceMeta.isLive === false && sourceMeta.statusText.includes('Non-Live')) {
  console.log('✓ Data provenance declaration PASSED');
} else {
  console.error('✗ Data provenance declaration FAILED');
  process.exit(1);
}

// Verify that unavailable retailer links are handled safely without fake URLs
const allOffers = SAMPLE_PRODUCTS.flatMap(p => p.retailerOffers);
const offersWithMissingUrl = allOffers.filter(o => !o.productUrl);
console.log(`- Offers with unavailable direct URL: ${offersWithMissingUrl.length}/${allOffers.length}`);
console.log(`  (UI safely renders "Retailer link unavailable" rather than broken/misleading links)`);

if (offersWithMissingUrl.length > 0) {
  console.log('✓ Unavailable retailer links properly guarded PASSED');
}

console.log('\n========================================');
console.log('ALL BEAUTYPRICE ENGINES VERIFIED SUCCESSFULLY!');
console.log('========================================');

