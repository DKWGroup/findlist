import { Product } from '../types';
import { SearchResult, SearchFilters, SearchContext, SearchSuggestion } from '../types/search';
import { semanticMappings, productAssociations, trendingSearches, popularCategories } from '../data/searchData';
import { products } from '../data/mockData';

class SearchService {
  private searchCache = new Map<string, SearchResult[]>();
  private suggestionCache = new Map<string, SearchSuggestion[]>();
  private searchHistory: string[] = [];

  // Main search function with semantic understanding
  async search(
    query: string,
    filters: Partial<SearchFilters> = {},
    context: Partial<SearchContext> = {},
    options: { fuzzy?: boolean; semantic?: boolean } = { fuzzy: true, semantic: true }
  ): Promise<SearchResult[]> {
    const cacheKey = this.generateCacheKey(query, filters, context);
    
    // Check cache first
    if (this.searchCache.has(cacheKey)) {
      return this.searchCache.get(cacheKey)!;
    }

    // Normalize and expand query
    const expandedQuery = this.expandQuery(query, context);
    
    // Get base results
    let results = this.getBaseResults(expandedQuery, options);
    
    // Apply semantic search
    if (options.semantic) {
      results = this.applySemanticSearch(results, expandedQuery, context);
    }
    
    // Apply filters
    results = this.applyFilters(results, filters);
    
    // Sort by relevance
    results = this.sortByRelevance(results, query, context);
    
    // Add to cache
    this.searchCache.set(cacheKey, results);
    
    // Update search history
    this.updateSearchHistory(query);
    
    return results;
  }

  // Get search suggestions as user types
  async getSuggestions(query: string, limit: number = 10): Promise<SearchSuggestion[]> {
    if (query.length < 2) {
      return this.getDefaultSuggestions();
    }

    const cacheKey = `suggestions_${query}_${limit}`;
    if (this.suggestionCache.has(cacheKey)) {
      return this.suggestionCache.get(cacheKey)!;
    }

    const suggestions: SearchSuggestion[] = [];
    const queryLower = query.toLowerCase();

    // Product suggestions
    const productSuggestions = products
      .filter(product => 
        product.title.toLowerCase().includes(queryLower) ||
        product.description.toLowerCase().includes(queryLower) ||
        product.tags.some(tag => tag.toLowerCase().includes(queryLower))
      )
      .slice(0, 3)
      .map(product => ({
        id: `product_${product.id}`,
        text: product.title,
        type: 'product' as const, 
        imageUrl: product.images && product.images.length > 0 ? product.images[0] : undefined,
        productId: product.id
      }));

    suggestions.push(...productSuggestions);

    // Category suggestions
    const categorySuggestions = popularCategories
      .filter(cat => cat.text.toLowerCase().includes(queryLower))
      .slice(0, 2);

    suggestions.push(...categorySuggestions);

    // Trending suggestions
    const trendingSuggestions = trendingSearches
      .filter(trend => trend.text.toLowerCase().includes(queryLower))
      .slice(0, 3);

    suggestions.push(...trendingSuggestions);

    // Query suggestions based on semantic mappings
    const semanticSuggestions = this.getSemanticSuggestions(query);
    suggestions.push(...semanticSuggestions.slice(0, 2));

    const finalSuggestions = suggestions.slice(0, limit);
    this.suggestionCache.set(cacheKey, finalSuggestions);

    return finalSuggestions;
  }

  // Get related products based on associations
  getRelatedProducts(productId: string, type: 'complementary' | 'frequently-bought' = 'complementary'): Product[] {
    const association = productAssociations.find(assoc => assoc.productId === productId);
    if (!association) return [];

    const relatedIds = type === 'complementary' 
      ? association.complementaryProducts 
      : association.frequentlyBoughtTogether;

    return products.filter(product => relatedIds.includes(product.id));
  }

  // Get seasonal recommendations
  getSeasonalRecommendations(season?: string): Product[] {
    const currentSeason = season || this.getCurrentSeason();
    const seasonalProducts = productAssociations
      .filter(assoc => assoc.seasons.includes(currentSeason) || assoc.seasons.includes('all'))
      .map(assoc => assoc.productId);

    return products.filter(product => seasonalProducts.includes(product.id));
  }

  // Get contextual recommendations based on use case
  getContextualRecommendations(context: Partial<SearchContext>): Product[] {
    if (!context.occasion && !context.season) return [];

    const relevantAssociations = productAssociations.filter(assoc => {
      if (context.season && !assoc.seasons.includes(context.season) && !assoc.seasons.includes('all')) {
        return false;
      }
      if (context.occasion && !assoc.occasions.includes(context.occasion)) {
        return false;
      }
      return true;
    });

    const productIds = relevantAssociations.map(assoc => assoc.productId);
    return products.filter(product => productIds.includes(product.id));
  }

  // Private methods
  private expandQuery(query: string, context: Partial<SearchContext>): string[] {
    const terms = query.toLowerCase().split(/\s+/);
    const expandedTerms = new Set(terms);

    // Add synonyms
    terms.forEach(term => {
      const synonyms = semanticMappings.synonyms[term];
      if (synonyms) {
        synonyms.forEach(synonym => expandedTerms.add(synonym));
      }
    });

    // Add seasonal context
    if (context.season) {
      const seasonalTerms = semanticMappings.seasonal[context.season];
      if (seasonalTerms) {
        seasonalTerms.forEach(term => {
          if (query.toLowerCase().includes(term)) {
            expandedTerms.add(term);
          }
        });
      }
    }

    // Add occasion context
    if (context.occasion) {
      const occasionTerms = semanticMappings.occasions[context.occasion];
      if (occasionTerms) {
        occasionTerms.forEach(term => expandedTerms.add(term));
      }
    }

    return Array.from(expandedTerms);
  }

  private getBaseResults(expandedQuery: string[], options: { fuzzy?: boolean }): SearchResult[] {
    const results: SearchResult[] = [];

    products.forEach(product => {
      const relevanceScore = this.calculateRelevanceScore(product, expandedQuery, options);
      
      if (relevanceScore > 0) {
        const matchedTerms = this.getMatchedTerms(product, expandedQuery);
        const matchType = this.determineMatchType(product, expandedQuery);

        results.push({
          id: product.id,
          title: product.title,
          description: product.description,
          category: product.category,
          tags: product.tags,
          price: product.price,
          images: product.images,
          relevanceScore,
          matchType,
          matchedTerms
        });
      }
    });

    return results;
  }

  private calculateRelevanceScore(product: Product, expandedQuery: string[], options: { fuzzy?: boolean }): number {
    let score = 0;
    const queryStr = expandedQuery.join(' ').toLowerCase();

    // Exact title match (highest score)
    if (product.title.toLowerCase().includes(queryStr)) {
      score += 100;
    }

    // Individual term matches in title
    expandedQuery.forEach(term => {
      if (product.title.toLowerCase().includes(term)) {
        score += 50;
      }
    });

    // Description matches
    expandedQuery.forEach(term => {
      if (product.description.toLowerCase().includes(term)) {
        score += 20;
      }
    });

    // Tag matches
    expandedQuery.forEach(term => {
      product.tags.forEach(tag => {
        if (tag.toLowerCase().includes(term)) {
          score += 30;
        }
      });
    });

    // Category match
    expandedQuery.forEach(term => {
      if (product.category.toLowerCase().includes(term)) {
        score += 25;
      }
    });

    // Fuzzy matching
    if (options.fuzzy) {
      score += this.calculateFuzzyScore(product, expandedQuery);
    }

    // Boost for trending and verified products
    if (product.isTrending) score *= 1.2;
    if (product.isVerified) score *= 1.1;

    // Boost for high ratings
    score *= (1 + product.ratings.average / 10);

    return Math.round(score);
  }

  private calculateFuzzyScore(product: Product, expandedQuery: string[]): number {
    let fuzzyScore = 0;

    expandedQuery.forEach(term => {
      // Check title with fuzzy matching
      const titleDistance = this.levenshteinDistance(term, product.title.toLowerCase());
      if (titleDistance <= 2 && term.length > 3) {
        fuzzyScore += 15;
      }

      // Check tags with fuzzy matching
      product.tags.forEach(tag => {
        const tagDistance = this.levenshteinDistance(term, tag.toLowerCase());
        if (tagDistance <= 1 && term.length > 2) {
          fuzzyScore += 10;
        }
      });
    });

    return fuzzyScore;
  }

  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));

    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;

    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + indicator
        );
      }
    }

    return matrix[str2.length][str1.length];
  }

  private applySemanticSearch(results: SearchResult[], expandedQuery: string[], context: Partial<SearchContext>): SearchResult[] {
    // Boost results based on semantic context
    return results.map(result => {
      let semanticBoost = 1;

      // Seasonal boost
      if (context.season) {
        const association = productAssociations.find(assoc => assoc.productId === result.id);
        if (association && (association.seasons.includes(context.season) || association.seasons.includes('all'))) {
          semanticBoost *= 1.3;
        }
      }

      // Occasion boost
      if (context.occasion) {
        const association = productAssociations.find(assoc => assoc.productId === result.id);
        if (association && association.occasions.includes(context.occasion)) {
          semanticBoost *= 1.25;
        }
      }

      // Use case boost
      expandedQuery.forEach(term => {
        Object.entries(semanticMappings.useCases).forEach(([useCase, keywords]) => {
          if (keywords.includes(term)) {
            const association = productAssociations.find(assoc => assoc.productId === result.id);
            if (association && association.useCase.includes(useCase)) {
              semanticBoost *= 1.15;
            }
          }
        });
      });

      return {
        ...result,
        relevanceScore: Math.round(result.relevanceScore * semanticBoost)
      };
    });
  }

  private applyFilters(results: SearchResult[], filters: Partial<SearchFilters>): SearchResult[] {
    return results.filter(result => {
      const product = products.find(p => p.id === result.id);
      if (!product) return false;

      // Category filter
      if (filters.categories && filters.categories.length > 0) {
        if (!filters.categories.includes(product.category)) return false;
      }

      // Price range filter
      if (filters.priceRange) {
        const price = product.price.discounted || product.price.original || 0;
        if (price < filters.priceRange.min || price > filters.priceRange.max) return false;
      }

      // Tags filter
      if (filters.tags && filters.tags.length > 0) {
        if (!filters.tags.some(tag => product.tags.includes(tag))) return false;
      }

      // Verified filter
      if (filters.isVerified !== undefined && product.isVerified !== filters.isVerified) {
        return false;
      }

      // Trending filter
      if (filters.isTrending !== undefined && product.isTrending !== filters.isTrending) {
        return false;
      }

      // Discount filter
      if (filters.hasDiscount && !product.price.discounted) {
        return false;
      }

      // Rating filter
      if (filters.rating) {
        if (product.ratings.average < filters.rating.min || product.ratings.average > filters.rating.max) {
          return false;
        }
      }

      return true;
    });
  }

  private sortByRelevance(results: SearchResult[], originalQuery: string, context: Partial<SearchContext>): SearchResult[] {
    return results.sort((a, b) => {
      // Primary sort by relevance score
      if (b.relevanceScore !== a.relevanceScore) {
        return b.relevanceScore - a.relevanceScore;
      }

      // Secondary sort by match type priority
      const matchTypePriority = { exact: 4, semantic: 3, fuzzy: 2, category: 1, tag: 0 };
      const aPriority = matchTypePriority[a.matchType] || 0;
      const bPriority = matchTypePriority[b.matchType] || 0;
      
      if (bPriority !== aPriority) {
        return bPriority - aPriority;
      }

      // Tertiary sort by product popularity
      const productA = products.find(p => p.id === a.id);
      const productB = products.find(p => p.id === b.id);
      
      if (productA && productB) {
        return productB.popularity.views - productA.popularity.views;
      }

      return 0;
    });
  }

  private getMatchedTerms(product: Product, expandedQuery: string[]): string[] {
    const matchedTerms: string[] = [];

    expandedQuery.forEach(term => {
      if (product.title.toLowerCase().includes(term) ||
          product.description.toLowerCase().includes(term) ||
          product.tags.some(tag => tag.toLowerCase().includes(term)) ||
          product.category.toLowerCase().includes(term)) {
        matchedTerms.push(term);
      }
    });

    return [...new Set(matchedTerms)];
  }

  private determineMatchType(product: Product, expandedQuery: string[]): SearchResult['matchType'] {
    const queryStr = expandedQuery.join(' ').toLowerCase();

    if (product.title.toLowerCase().includes(queryStr)) {
      return 'exact';
    }

    if (expandedQuery.some(term => product.title.toLowerCase().includes(term))) {
      return 'semantic';
    }

    if (expandedQuery.some(term => product.tags.some(tag => tag.toLowerCase().includes(term)))) {
      return 'tag';
    }

    if (expandedQuery.some(term => product.category.toLowerCase().includes(term))) {
      return 'category';
    }

    return 'fuzzy';
  }

  private getSemanticSuggestions(query: string): SearchSuggestion[] {
    const suggestions: SearchSuggestion[] = [];
    const queryLower = query.toLowerCase();
    
    // Find products that match semantic terms
    const matchingProducts = products.filter(product => {
      return Object.entries(semanticMappings.synonyms).some(([key, synonyms]) => {
        if (key.includes(queryLower) || synonyms.some(syn => syn.includes(queryLower))) {
          return product.title.toLowerCase().includes(key) || 
                 product.description.toLowerCase().includes(key) ||
                 product.tags.some(tag => tag.toLowerCase().includes(key));
        }
        return false;
      });
    }).slice(0, 2);
    
    // Add matching products as suggestions
    matchingProducts.forEach(product => {
      suggestions.push({
        id: `semantic_product_${product.id}`,
        text: product.title,
        type: 'product',
        imageUrl: product.images[0],
        productId: product.id
      });
    });

    // Check for semantic mappings
    Object.entries(semanticMappings.synonyms).forEach(([key, synonyms]) => {
      if (key.includes(queryLower) || synonyms.some(syn => syn.includes(queryLower))) {
        suggestions.push({
          id: `semantic_${key}`,
          text: key,
          type: 'query'
        });
      }
    });

    return suggestions;
  }

  private getDefaultSuggestions(): SearchSuggestion[] {
    return [
      ...trendingSearches.slice(0, 4),
      ...popularCategories.slice(0, 3)
    ];
  }

  private getCurrentSeason(): string {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4) return 'spring';
    if (month >= 5 && month <= 7) return 'summer';
    if (month >= 8 && month <= 10) return 'autumn';
    return 'winter';
  }

  private generateCacheKey(query: string, filters: Partial<SearchFilters>, context: Partial<SearchContext>): string {
    return `${query}_${JSON.stringify(filters)}_${JSON.stringify(context)}`;
  }

  private updateSearchHistory(query: string): void {
    this.searchHistory.unshift(query);
    this.searchHistory = this.searchHistory.slice(0, 50); // Keep last 50 searches
  }

  // Public method to clear cache (useful for testing or memory management)
  clearCache(): void {
    this.searchCache.clear();
    this.suggestionCache.clear();
  }

  // Get search analytics
  getSearchAnalytics() {
    return {
      cacheSize: this.searchCache.size,
      suggestionCacheSize: this.suggestionCache.size,
      recentSearches: this.searchHistory.slice(0, 10)
    };
  }
}

export const searchService = new SearchService();