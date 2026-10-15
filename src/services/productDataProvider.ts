import { Product, FilterState } from '../types';
import { SAMPLE_PRODUCTS } from '../data/products';
import { filterAndSortProducts } from '../utils/search';

/**
 * Metadata detailing the provenance and live-readiness of the product catalog source.
 */
export interface DataSourceMetadata {
  id: string;
  name: string;
  isLive: boolean;
  providerType: 'local_sample' | 'authorized_affiliate_api' | 'verified_partner_feed';
  statusText: string;
  description: string;
  lastUpdated: string;
  disclaimer: string;
}

/**
 * Clean architectural provider interface to decouple UI components from data fetching.
 * Enables plugging in authorized retailer feeds or official affiliate APIs without UI refactors.
 */
export interface IProductDataProvider {
  getMetadata(): DataSourceMetadata;
  getProducts(): Promise<Product[]>;
  getProductById(id: string): Promise<Product | null>;
  searchProducts(query: string, filterState?: FilterState): Promise<Product[]>;
}

/**
 * Default offline implementation using curated demonstration sample records.
 * Explicitly declares non-live status and ensures no simulated integration claims are made.
 */
export class LocalSampleCatalogProvider implements IProductDataProvider {
  private readonly products: Product[];

  constructor() {
    // Ensure all sample products have explicit provenance and priceStatus metadata
    this.products = SAMPLE_PRODUCTS.map(product => ({
      ...product,
      retailerOffers: product.retailerOffers.map(offer => ({
        ...offer,
        source: offer.source || 'sample_catalog',
        priceStatus: offer.priceStatus || 'illustrative_sample',
        lastChecked: offer.lastChecked || '2026-10-01',
        // Product URLs remain undefined unless genuine, validated destination URLs are provided
        productUrl: offer.productUrl,
      })),
    }));
  }

  getMetadata(): DataSourceMetadata {
    return {
      id: 'local-sample-catalog',
      name: 'Local Demonstration Sample Catalog',
      isLive: false,
      providerType: 'local_sample',
      statusText: 'Offline Demonstration Benchmark (Non-Live)',
      description: 'Curated dataset of 50 popular Indian beauty formulations. Retailer comparisons are illustrative simulations and not connected to live APIs.',
      lastUpdated: '2026-10-01',
      disclaimer: 'BeautyPrice is not currently connected to live merchant APIs (Amazon, Nykaa, Tira, Purplle, Blinkit, Myntra). Prices, stock, and offers are illustrative benchmarks for testing.',
    };
  }

  async getProducts(): Promise<Product[]> {
    return this.products;
  }

  async getProductById(id: string): Promise<Product | null> {
    const product = this.products.find(p => p.id === id);
    return product || null;
  }

  async searchProducts(query: string, filterState?: FilterState): Promise<Product[]> {
    const state: FilterState = filterState || {
      search: query,
      category: 'all',
      subcategory: 'all',
      brand: 'all',
      minPrice: 0,
      maxPrice: 6500,
      skinType: 'all',
      concern: 'all',
      sortBy: 'recommended',
    };

    return filterAndSortProducts(this.products, { ...state, search: query });
  }
}

/**
 * Active data provider singleton.
 * Can be swapped with an AuthorizedAffiliateProvider or LiveFeedProvider once valid credentials exist.
 */
export const activeProductProvider: IProductDataProvider = new LocalSampleCatalogProvider();
