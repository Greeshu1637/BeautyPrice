import { Product, FilterState } from '../types';
import { getLowestOffer, getDiscountPercentage, getUnitPrice } from './pricing';

/**
 * Common brand synonyms and alternative spellings in Indian beauty e-commerce.
 */
export const BRAND_SYNONYMS: Record<string, string[]> = {
  'dot & key': ['dot & key', 'dot and key', 'dotkey', 'dot & key skincare', 'dot and key skincare'],
  'the derma co': ['the derma co', 'derma co', 'thedermaco', 'derma company', 'the derma company'],
  'chemist at play': ['chemist at play', 'chemistatplay'],
  'mcaffeine': ['mcaffeine', 'm caffeine', 'mcaffein'],
  'wishcare': ['wishcare', 'wish care'],
  'maybelline new york': ['maybelline new york', 'maybelline', 'maybelline ny'],
  'sugar cosmetics': ['sugar cosmetics', 'sugar'],
  'kama ayurveda': ['kama ayurveda', 'kama'],
  'kay beauty': ['kay beauty', 'kay', 'katrina kaif beauty'],
  'forest essentials': ['forest essentials', 'forestessentials'],
  'minimalist': ['minimalist', 'be minimalist', 'beminimalist'],
  'cosrx': ['cosrx', 'cos rx'],
  'dr. sheth\'s': ['dr sheths', 'dr. sheth\'s', 'dr sheth', 'dr. sheths', 'drsheths'],
  'l\'oreal': ['loreal', 'l\'oreal', 'l oreal'],
  'plum': ['plum', 'plum goodness'],
};

/**
 * Stop words to omit from strict multi-token requirement if query has multiple tokens
 */
const STOP_WORDS = new Set(['and', 'the', 'for', 'with', 'in', 'of', 'a', 'an', '&']);

/**
 * Normalizes text: lowercases, converts '&' to 'and', strips punctuation, condenses whitespace.
 */
export function normalizeSearchText(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Removes all non-alphanumeric characters for squashed matching (e.g. "Dot & Key" -> "dotkey").
 */
export function squashSearchText(text: string): string {
  if (!text) return '';
  return text.toLowerCase().replace(/[^a-z0-9]/g, '');
}

/**
 * Retrieves all search aliases for a brand.
 */
export function getBrandAliases(brandName: string): string[] {
  const norm = normalizeSearchText(brandName);
  const squashed = squashSearchText(brandName);
  const aliases = new Set<string>([norm, squashed, brandName.toLowerCase()]);

  for (const [canonical, synList] of Object.entries(BRAND_SYNONYMS)) {
    if (norm === canonical || synList.some(s => normalizeSearchText(s) === norm || squashSearchText(s) === squashed)) {
      synList.forEach(s => {
        aliases.add(normalizeSearchText(s));
        aliases.add(squashSearchText(s));
      });
    }
  }

  return Array.from(aliases);
}

/**
 * Pre-computes normalized searchable representations of a product.
 */
export interface SearchableProductCorpus {
  product: Product;
  normalizedName: string;
  squashedName: string;
  normalizedBrand: string;
  squashedBrand: string;
  brandAliases: string[];
  normalizedCategory: string;
  normalizedSubcategory: string;
  normalizedIngredients: string[];
  normalizedConcerns: string[];
  normalizedSkinTypes: string[];
  normalizedDescription: string;
  combinedText: string;
  combinedSquashed: string;
}

export function buildProductSearchCorpus(product: Product): SearchableProductCorpus {
  const normName = normalizeSearchText(product.name);
  const squashedName = squashSearchText(product.name);
  const normBrand = normalizeSearchText(product.brand);
  const squashedBrand = squashSearchText(product.brand);
  const brandAliases = getBrandAliases(product.brand);
  const normCat = normalizeSearchText(product.category);
  const normSubcat = normalizeSearchText(product.subcategory);
  const normIngs = product.keyIngredients.map(normalizeSearchText);
  const normConcerns = product.concerns.map(normalizeSearchText);
  const normSkinTypes = product.skinTypes.map(normalizeSearchText);
  const normDesc = normalizeSearchText(product.description);

  const combinedText = [
    normName,
    normBrand,
    ...brandAliases,
    normCat,
    normSubcat,
    ...normIngs,
    ...normConcerns,
    ...normSkinTypes,
    normDesc,
    product.editorialBadge ? normalizeSearchText(product.editorialBadge) : '',
  ].join(' ');

  const combinedSquashed = squashSearchText(combinedText);

  return {
    product,
    normalizedName: normName,
    squashedName,
    normalizedBrand: normBrand,
    squashedBrand,
    brandAliases,
    normalizedCategory: normCat,
    normalizedSubcategory: normSubcat,
    normalizedIngredients: normIngs,
    normalizedConcerns: normConcerns,
    normalizedSkinTypes: normSkinTypes,
    normalizedDescription: normDesc,
    combinedText,
    combinedSquashed,
  };
}

/**
 * Determines whether a product matches a user search query.
 * Case-insensitive, punctuation-tolerant, brand-alias aware, and multi-token matching.
 */
export function matchesSearchQuery(corpus: SearchableProductCorpus, rawQuery: string): boolean {
  const query = rawQuery.trim();
  if (!query) return true;

  const normalizedQuery = normalizeSearchText(query);
  const squashedQuery = squashSearchText(query);

  // 1. Direct whole-query substring check (fast path)
  if (corpus.combinedText.includes(normalizedQuery)) return true;
  if (squashedQuery.length >= 3 && corpus.combinedSquashed.includes(squashedQuery)) return true;

  // 2. Check if query matches any brand alias directly
  for (const alias of corpus.brandAliases) {
    if (normalizedQuery === alias || squashedQuery === squashSearchText(alias)) {
      return true;
    }
  }

  // 3. Tokenize query into distinct search terms
  const allTokens = normalizedQuery.split(' ').filter(Boolean);
  if (allTokens.length === 0) return true;

  // Filter out stop words if there are multiple tokens
  let tokens = allTokens;
  if (allTokens.length > 1) {
    const filtered = allTokens.filter(t => !STOP_WORDS.has(t));
    if (filtered.length > 0) tokens = filtered;
  }

  // Check if every token matches somewhere in the product corpus
  const allTokensMatch = tokens.every(token => {
    // Check if token matches brand or brand aliases
    if (corpus.brandAliases.some(alias => alias.includes(token))) return true;

    // Check token in combined text
    if (corpus.combinedText.includes(token)) return true;

    // Check squashed token in squashed representations
    const squashedToken = squashSearchText(token);
    if (squashedToken.length >= 3 && corpus.combinedSquashed.includes(squashedToken)) return true;

    return false;
  });

  if (allTokensMatch) return true;

  // 4. Check if the query is a compound brand + category / subcategory query
  // Example: "DotKey sunscreen" or "Dot and Key sunscreen"
  const isBrandMatch = corpus.brandAliases.some(alias => {
    const squashedAlias = squashSearchText(alias);
    return squashedQuery.startsWith(squashedAlias) || normalizedQuery.includes(alias);
  });

  if (isBrandMatch) {
    // See if the remainder of the query matches category, subcategory, or product name
    const remainingTokens = tokens.filter(t => !corpus.brandAliases.some(a => a.includes(t)));
    if (remainingTokens.length === 0) return true;
    const remainingMatches = remainingTokens.every(t => corpus.combinedText.includes(t));
    if (remainingMatches) return true;
  }

  return false;
}

/**
 * Computes a search relevance score for ranking results when query is present.
 */
export function computeSearchRelevance(corpus: SearchableProductCorpus, query: string): number {
  if (!query.trim()) return 0;

  let score = 0;
  const normalizedQuery = normalizeSearchText(query);
  const squashedQuery = squashSearchText(query);

  // Exact product name match
  if (corpus.normalizedName === normalizedQuery) score += 100;
  else if (corpus.normalizedName.startsWith(normalizedQuery)) score += 60;
  else if (corpus.normalizedName.includes(normalizedQuery)) score += 40;

  // Exact brand match
  if (corpus.normalizedBrand === normalizedQuery || corpus.brandAliases.includes(normalizedQuery) || corpus.squashedBrand === squashedQuery) {
    score += 50;
  } else if (corpus.squashedName.includes(squashedQuery)) {
    score += 30;
  }

  // Subcategory match (e.g. "sunscreen", "serum")
  if (corpus.normalizedSubcategory === normalizedQuery) score += 35;
  else if (corpus.normalizedSubcategory.includes(normalizedQuery)) score += 20;

  // Ingredient match
  if (corpus.normalizedIngredients.some(ing => ing.includes(normalizedQuery))) score += 25;

  return score;
}

/**
 * Executes full search, filtering, and sorting over a product list.
 */
export function filterAndSortProducts(
  products: Product[],
  filterState: FilterState
): Product[] {
  const corpora = products.map(buildProductSearchCorpus);

  return corpora.filter(corpus => {
    const { product } = corpus;

    // 1. Search Query
    if (filterState.search.trim()) {
      if (!matchesSearchQuery(corpus, filterState.search)) {
        return false;
      }
    }

    // 2. Category
    if (filterState.category !== 'all' && product.category !== filterState.category) {
      return false;
    }

    // 3. Brand
    if (filterState.brand !== 'all' && product.brand !== filterState.brand) {
      return false;
    }

    // 4. Skin Type
    if (filterState.skinType !== 'all') {
      const matchesSkin = product.skinTypes.includes(filterState.skinType) || product.skinTypes.includes('All');
      if (!matchesSkin) return false;
    }

    // 5. Concern
    if (filterState.concern !== 'all') {
      if (!product.concerns.includes(filterState.concern)) return false;
    }

    // 6. Price Range
    const bestPrice = getLowestOffer(product)?.price || product.mrp;
    if (bestPrice < filterState.minPrice || bestPrice > filterState.maxPrice) {
      return false;
    }

    return true;
  }).sort((a, b) => {
    const priceA = getLowestOffer(a.product)?.price || a.product.mrp;
    const priceB = getLowestOffer(b.product)?.price || b.product.mrp;

    switch (filterState.sortBy) {
      case 'price-low':
        return priceA - priceB;
      case 'price-high':
        return priceB - priceA;
      case 'unit-price':
        return getUnitPrice(priceA, a.product.size) - getUnitPrice(priceB, b.product.size);
      case 'rating':
        return b.product.rating - a.product.rating;
      case 'biggest-discount': {
        const discA = getDiscountPercentage(a.product.mrp, priceA);
        const discB = getDiscountPercentage(b.product.mrp, priceB);
        return discB - discA;
      }
      case 'recommended':
      default: {
        // If search query is present, rank by relevance score first
        if (filterState.search.trim()) {
          const relA = computeSearchRelevance(a, filterState.search);
          const relB = computeSearchRelevance(b, filterState.search);
          if (relA !== relB) return relB - relA;
        }
        return (b.product.isTrending ? 1 : 0) - (a.product.isTrending ? 1 : 0) || b.product.rating - a.product.rating;
      }
    }
  }).map(c => c.product);
}
