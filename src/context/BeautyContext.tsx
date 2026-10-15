import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, UserProfile, BasketItem, FilterState } from '../types';
import { SAMPLE_PRODUCTS } from '../data/products';

interface BeautyContextType {
  products: Product[];
  profile: UserProfile;
  updateProfile: (profile: Partial<UserProfile>) => void;
  resetProfile: () => void;
  basket: BasketItem[];
  addToBasket: (productId: string, qty?: number) => void;
  removeFromBasket: (productId: string) => void;
  updateBasketQuantity: (productId: string, quantity: number) => void;
  clearBasket: () => void;
  isInBasket: (productId: string) => boolean;
  filterState: FilterState;
  setFilterState: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  activeTab: 'home' | 'catalog' | 'recommendations' | 'basket' | 'transparency';
  setActiveTab: (tab: 'home' | 'catalog' | 'recommendations' | 'basket' | 'transparency') => void;
  isProfileOpen: boolean;
  setIsProfileOpen: (open: boolean) => void;
  alternativesTarget: Product | null;
  setAlternativesTarget: (product: Product | null) => void;
  noticeDismissed: boolean;
  dismissNotice: () => void;
}

export const DEFAULT_PROFILE: UserProfile = {
  skinType: 'Combination',
  concerns: ['Acne & Blemishes', 'Sun Protection'],
  budgetTier: 'all',
  preferredCategories: ['skincare', 'haircare', 'makeup', 'bodycare'],
  fragranceFreeOnly: false,
};

export const DEFAULT_FILTERS: FilterState = {
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

const BeautyContext = createContext<BeautyContextType | undefined>(undefined);

export const BeautyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products] = useState<Product[]>(SAMPLE_PRODUCTS);

  // Profile from localStorage
  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('beautyprice_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...DEFAULT_PROFILE, ...parsed };
      }
      return DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  });

  // Basket from localStorage
  const [basket, setBasket] = useState<BasketItem[]>(() => {
    try {
      const saved = localStorage.getItem('beautyprice_basket');
      if (saved) return JSON.parse(saved);
      // Pre-seed with 2 sample products so the planner demonstrates value immediately
      return [
        { productId: 'prod-skin-01', quantity: 1 },
        { productId: 'prod-skin-02', quantity: 1 },
        { productId: 'prod-hair-01', quantity: 1 },
      ];
    } catch {
      return [];
    }
  });

  const [filterState, setFilterState] = useState<FilterState>(DEFAULT_FILTERS);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState<'home' | 'catalog' | 'recommendations' | 'basket' | 'transparency'>('home');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [alternativesTarget, setAlternativesTarget] = useState<Product | null>(null);

  const [noticeDismissed, setNoticeDismissed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('beautyprice_demo_notice') === 'true';
    } catch {
      return false;
    }
  });

  // Persist profile
  useEffect(() => {
    try {
      localStorage.setItem('beautyprice_profile', JSON.stringify(profile));
    } catch (e) {
      console.error('Error saving profile to localStorage', e);
    }
  }, [profile]);

  // Persist basket
  useEffect(() => {
    try {
      localStorage.setItem('beautyprice_basket', JSON.stringify(basket));
    } catch (e) {
      console.error('Error saving basket to localStorage', e);
    }
  }, [basket]);

  const updateProfile = (newProfile: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...newProfile }));
  };

  const resetProfile = () => {
    setProfile(DEFAULT_PROFILE);
  };

  const addToBasket = (productId: string, qty: number = 1) => {
    setBasket(prev => {
      const existing = prev.find(item => item.productId === productId);
      if (existing) {
        return prev.map(item =>
          item.productId === productId ? { ...item, quantity: item.quantity + qty } : item
        );
      }
      return [...prev, { productId, quantity: qty }];
    });
  };

  const removeFromBasket = (productId: string) => {
    setBasket(prev => prev.filter(item => item.productId !== productId));
  };

  const updateBasketQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromBasket(productId);
    } else {
      setBasket(prev =>
        prev.map(item => (item.productId === productId ? { ...item, quantity } : item))
      );
    }
  };

  const clearBasket = () => {
    setBasket([]);
  };

  const isInBasket = (productId: string) => {
    return basket.some(item => item.productId === productId);
  };

  const resetFilters = () => {
    setFilterState(DEFAULT_FILTERS);
  };

  const dismissNotice = () => {
    setNoticeDismissed(true);
    try {
      localStorage.setItem('beautyprice_demo_notice', 'true');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <BeautyContext.Provider
      value={{
        products,
        profile,
        updateProfile,
        resetProfile,
        basket,
        addToBasket,
        removeFromBasket,
        updateBasketQuantity,
        clearBasket,
        isInBasket,
        filterState,
        setFilterState,
        resetFilters,
        selectedProduct,
        setSelectedProduct,
        activeTab,
        setActiveTab,
        isProfileOpen,
        setIsProfileOpen,
        alternativesTarget,
        setAlternativesTarget,
        noticeDismissed,
        dismissNotice,
      }}
    >
      {children}
    </BeautyContext.Provider>
  );
};

export const useBeauty = () => {
  const context = useContext(BeautyContext);
  if (!context) {
    throw new Error('useBeauty must be used within a BeautyProvider');
  }
  return context;
};
