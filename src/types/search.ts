export interface SearchResult {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  price: {
    original?: number;
    discounted?: number;
    currency: string;
  };
  images: string[];
  relevanceScore: number;
  matchType: 'exact' | 'fuzzy' | 'semantic' | 'category' | 'tag';
  matchedTerms: string[];
}

export interface SearchSuggestion {
  id: string;
  text: string;
  type: 'query' | 'category' | 'product' | 'trending';
  imageUrl?: string;
  productId?: string;
  count?: number;
  icon?: string;
}

export interface SearchFilters {
  categories: string[];
  priceRange: {
    min: number;
    max: number;
  };
  tags: string[];
  isVerified?: boolean;
  isTrending?: boolean;
  hasDiscount?: boolean;
  rating?: {
    min: number;
    max: number;
  };
}

export interface SearchContext {
  season?: 'spring' | 'summer' | 'autumn' | 'winter';
  occasion?: string;
  userPreferences?: string[];
  location?: string;
  timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night';
}

export interface ProductAssociation {
  productId: string;
  associatedWith: string[];
  seasons: string[];
  occasions: string[];
  useCase: string[];
  complementaryProducts: string[];
  frequentlyBoughtTogether: string[];
}

export interface SearchAnalytics {
  query: string;
  timestamp: string;
  userId?: string;
  resultsCount: number;
  clickedResults: string[];
  filters: SearchFilters;
  context: SearchContext;
}