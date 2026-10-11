export type Category = 'skincare' | 'haircare' | 'makeup' | 'bodycare';

export type SkinType = 'Oily' | 'Dry' | 'Combination' | 'Sensitive' | 'Normal' | 'All';

export type Concern = 
  | 'Acne & Blemishes'
  | 'Hyperpigmentation & Dark Spots'
  | 'Dryness & Dehydration'
  | 'Barrier Repair'
  | 'Anti-Aging & Fine Lines'
  | 'Sun Protection'
  | 'Hair Fall & Thinning'
  | 'Frizz & Dry Hair'
  | 'Dandruff & Scalp Health'
  | 'Uneven Skin Tone'
  | 'Body Tan & Keratosis Pilaris'
  | 'Sensitive & Reactive Skin';

export type RetailerName = 'Nykaa' | 'Tira' | 'Blinkit' | 'Purplle' | 'Amazon' | 'Myntra';

export interface RetailerOffer {
  retailer: RetailerName;
  price: number;
  inStock: boolean;
  offerTag?: string;
  deliverySpeed?: string;
  isLowest?: boolean;
}

export interface PriceHistoryPoint {
  date: string;
  price: number;
  retailer: string;
  eventNote?: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: Category;
  subcategory: string;
  size: number;
  unit: 'ml' | 'g';
  mrp: number;
  image: string;
  description: string;
  keyIngredients: string[];
  skinTypes: SkinType[];
  concerns: Concern[];
  rating: number;
  reviewCount: number;
  retailerOffers: RetailerOffer[];
  priceHistory: PriceHistoryPoint[];
  isTrending?: boolean;
  isBudgetPick?: boolean;
  editorialBadge?: string;
  crueltyFree?: boolean;
  fragranceFree?: boolean;
}

export interface UserProfile {
  skinType: SkinType;
  concerns: Concern[];
  budgetTier: 'budget' | 'mid-range' | 'luxury' | 'all';
  preferredCategories: Category[];
  fragranceFreeOnly: boolean;
}

export interface BasketItem {
  productId: string;
  quantity: number;
}

export interface FilterState {
  search: string;
  category: Category | 'all';
  subcategory: string | 'all';
  brand: string | 'all';
  minPrice: number;
  maxPrice: number;
  skinType: SkinType | 'all';
  concern: Concern | 'all';
  sortBy: 'recommended' | 'price-low' | 'price-high' | 'unit-price' | 'rating' | 'biggest-discount';
}

export interface RecommendationResult {
  product: Product;
  score: number; // 0 - 100
  matchReasons: string[];
  unitCostFormatted: string;
}

export interface BasketRetailerSummary {
  retailer: RetailerName;
  totalPrice: number;
  availableItemsCount: number;
  totalItemsCount: number;
  allAvailable: boolean;
  missingProducts: string[];
  sampleDeliveryFee: number;
  grandTotal: number;
}
