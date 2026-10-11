import { Product, UserProfile, RecommendationResult } from '../types';
import { getLowestOffer, formatUnitPrice } from './pricing';

/**
 * Transparent rule-based recommendation scoring engine
 * Evaluates match percentage based strictly on user preferences, skin profile, concerns, and budget.
 * Explicitly non-medical and based on cosmetic formulation preferences.
 */
export function scoreRecommendations(
  products: Product[],
  profile: UserProfile,
  limit: number = 12
): RecommendationResult[] {
  const scoredList: RecommendationResult[] = [];

  for (const product of products) {
    let score = 0;
    const matchReasons: string[] = [];

    // 1. Skin Type Match (up to 30 pts)
    const matchesSkin = product.skinTypes.includes(profile.skinType) || product.skinTypes.includes('All');
    if (matchesSkin) {
      score += 30;
      matchReasons.push(`Formulated for ${profile.skinType} skin`);
    } else {
      // Small penalty if it doesn't match the specific skin type
      score += 5;
    }

    // 2. Concerns Match (up to 35 pts)
    const matchingConcerns = product.concerns.filter(c => profile.concerns.includes(c));
    if (matchingConcerns.length > 0) {
      const concernScore = Math.min(35, matchingConcerns.length * 18);
      score += concernScore;
      matchReasons.push(`Targets ${matchingConcerns.join(', ')}`);
    }

    // 3. Category Preference Match (up to 15 pts)
    if (profile.preferredCategories.includes(product.category)) {
      score += 15;
      matchReasons.push(`Matches your interest in ${product.category}`);
    }

    // 4. Budget Tier Compatibility (up to 15 pts)
    const lowestOffer = getLowestOffer(product);
    const price = lowestOffer?.price || product.mrp;

    let budgetMatches = true;
    if (profile.budgetTier === 'budget') {
      if (price <= 550) {
        score += 15;
        matchReasons.push('Well within budget-friendly tier (≤ ₹550)');
      } else if (price <= 800) {
        score += 8;
      } else {
        budgetMatches = false;
        score -= 10;
      }
    } else if (profile.budgetTier === 'mid-range') {
      if (price >= 400 && price <= 1400) {
        score += 15;
        matchReasons.push('Fits standard mid-range pricing tier (₹400 - ₹1,400)');
      } else {
        score += 5;
      }
    } else if (profile.budgetTier === 'luxury') {
      if (price >= 1200) {
        score += 15;
        matchReasons.push('Premium luxury formulation (₹1,200+)');
      } else {
        score += 5;
      }
    } else {
      score += 10; // 'all' budget
    }

    // 5. Fragrance-free requirement check
    if (profile.fragranceFreeOnly) {
      if (product.fragranceFree) {
        score += 10;
        matchReasons.push('Verified fragrance-free formulation');
      } else {
        // Disqualify or severely penalize if user specifically requested fragrance-free
        score -= 50;
      }
    }

    // 6. Rating boost (up to 5 pts)
    if (product.rating >= 4.5) {
      score += 5;
    }

    // Normalize score to 10 - 99 scale
    const finalScore = Math.min(99, Math.max(15, score));

    // Only include products with reasonable match score
    if (finalScore >= 40 && budgetMatches) {
      scoredList.push({
        product,
        score: finalScore,
        matchReasons: matchReasons.slice(0, 3), // Top 3 reasons
        unitCostFormatted: formatUnitPrice(price, product.size, product.unit),
      });
    }
  }

  // Sort by highest score first
  scoredList.sort((a, b) => b.score - a.score);

  return scoredList.slice(0, limit);
}
