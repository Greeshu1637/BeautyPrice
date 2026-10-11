import { Product } from '../types';
import { getLowestOffer, getUnitPrice, formatUnitPrice } from './pricing';

export interface AlternativeComparison {
  product: Product;
  sharedIngredients: string[];
  unitPriceDifference: number; // alternative - target (negative means alternative is cheaper)
  unitPriceDifferencePercent: number;
  isCheaperPerUnit: boolean;
  unitPriceFormatted: string;
  targetUnitPriceFormatted: string;
  rationale: string;
}

/**
 * Finds sensible similar alternatives for a given product and analyzes unit-price value
 */
export function findSimilarAlternatives(
  target: Product,
  allProducts: Product[],
  limit: number = 4
): AlternativeComparison[] {
  const targetLowestOffer = getLowestOffer(target);
  const targetPrice = targetLowestOffer?.price || target.mrp;
  const targetUnitPrice = getUnitPrice(targetPrice, target.size);

  const candidates = allProducts.filter(p => p.id !== target.id);

  const scoredAlternatives: (AlternativeComparison & { similarityScore: number })[] = [];

  for (const candidate of candidates) {
    // Look for matching category or subcategory
    let similarityScore = 0;
    if (candidate.category === target.category) similarityScore += 30;
    if (candidate.subcategory === target.subcategory) similarityScore += 40;

    // Check overlapping concerns
    const sharedConcerns = candidate.concerns.filter(c => target.concerns.includes(c));
    similarityScore += sharedConcerns.length * 15;

    // Check shared key ingredients
    const sharedIngredients = candidate.keyIngredients.filter(ing => 
      target.keyIngredients.some(tIng => 
        tIng.toLowerCase().includes(ing.toLowerCase()) || ing.toLowerCase().includes(tIng.toLowerCase())
      )
    );
    similarityScore += sharedIngredients.length * 25;

    // Shared skin types
    const sharedSkinTypes = candidate.skinTypes.filter(st => target.skinTypes.includes(st) || st === 'All');
    similarityScore += sharedSkinTypes.length * 10;

    if (similarityScore < 40) continue; // Not similar enough

    const candidateLowestOffer = getLowestOffer(candidate);
    const candidatePrice = candidateLowestOffer?.price || candidate.mrp;
    const candidateUnitPrice = getUnitPrice(candidatePrice, candidate.size);

    const isCompatibleUnit = candidate.unit === target.unit;
    let unitPriceDifference = 0;
    let unitPriceDifferencePercent = 0;
    let isCheaperPerUnit = false;

    if (isCompatibleUnit && targetUnitPrice > 0) {
      unitPriceDifference = Number((candidateUnitPrice - targetUnitPrice).toFixed(2));
      unitPriceDifferencePercent = Math.round(((candidateUnitPrice - targetUnitPrice) / targetUnitPrice) * 100);
      isCheaperPerUnit = candidateUnitPrice < targetUnitPrice;
    }

    let rationale = '';
    if (sharedIngredients.length > 0) {
      rationale = `Shares key actives (${sharedIngredients.slice(0, 2).join(', ')})`;
    } else if (candidate.subcategory === target.subcategory) {
      rationale = `Same ${candidate.subcategory.toLowerCase()} category with similar barrier focus`;
    } else {
      rationale = `Addresses shared concerns: ${sharedConcerns[0] || 'daily skin health'}`;
    }

    if (isCompatibleUnit && isCheaperPerUnit) {
      const diffSavings = Math.abs(unitPriceDifference).toFixed(2);
      rationale += ` · ₹${diffSavings}/${target.unit} cheaper`;
    }

    scoredAlternatives.push({
      product: candidate,
      sharedIngredients,
      unitPriceDifference,
      unitPriceDifferencePercent,
      isCheaperPerUnit,
      unitPriceFormatted: formatUnitPrice(candidatePrice, candidate.size, candidate.unit),
      targetUnitPriceFormatted: formatUnitPrice(targetPrice, target.size, target.unit),
      rationale,
      similarityScore,
    });
  }

  // Sort by highest similarity
  scoredAlternatives.sort((a, b) => b.similarityScore - a.similarityScore);

  return scoredAlternatives.slice(0, limit);
}
