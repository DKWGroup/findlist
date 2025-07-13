import { useState, useCallback, useEffect } from 'react';
import { SearchResult, SearchFilters, SearchContext, SearchSuggestion } from '../types/search';
import { searchService } from '../services/searchService';

interface UseAdvancedSearchOptions {
  initialQuery?: string;
  initialFilters?: Partial<SearchFilters>;
  initialContext?: Partial<SearchContext>;
  autoSearch?: boolean;
  debounceMs?: number;
}

export const useAdvancedSearch = (options: UseAdvancedSearchOptions = {}) => {
  const {
    initialQuery = '',
    initialFilters = {},
    initialContext = {},
    autoSearch = false,
    debounceMs = 300
  } = options;

  const [query, setQuery] = useState(initialQuery);
  const [filters, setFilters] = useState<Partial<SearchFilters>>(initialFilters);
  const [context, setContext] = useState<Partial<SearchContext>>(initialContext);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalResults, setTotalResults] = useState(0);
  const [searchTime, setSearchTime] = useState(0);

  // Perform search
  const search = useCallback(async (
    searchQuery?: string,
    searchFilters?: Partial<SearchFilters>,
    searchContext?: Partial<SearchContext>
  ) => {
    const finalQuery = searchQuery ?? query;
    const finalFilters = searchFilters ?? filters;
    const finalContext = searchContext ?? context;

    if (!finalQuery.trim()) {
      setResults([]);
      setTotalResults(0);
      return;
    }

    setIsLoading(true);
    setError(null);
    const startTime = performance.now();

    try {
      const searchResults = await searchService.search(
        finalQuery,
        finalFilters,
        finalContext,
        { fuzzy: true, semantic: true }
      );

      setResults(searchResults);
      setTotalResults(searchResults.length);
      setSearchTime(performance.now() - startTime);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Wystąpił błąd podczas wyszukiwania');
      setResults([]);
      setTotalResults(0);
    } finally {
      setIsLoading(false);
    }
  }, [query, filters, context]);

  // Get suggestions
  const getSuggestions = useCallback(async (suggestionQuery?: string) => {
    const finalQuery = suggestionQuery ?? query;
    
    if (finalQuery.length < 2 && hasUserInteracted) {
      const defaultSuggestions = await searchService.getSuggestions('', 6);
      setSuggestions(defaultSuggestions);
      return;
    }

    setIsLoadingSuggestions(true);
    
    try {
      const newSuggestions = await searchService.getSuggestions(finalQuery, 8);
      setSuggestions(newSuggestions);
    } catch (err) {
      console.error('Error fetching suggestions:', err);
      setSuggestions([]);
    } finally {
      setIsLoadingSuggestions(false);
    }
  }, [query]);

  // Update query
  const updateQuery = useCallback((newQuery: string, runSearch = false) => {
    setQuery(newQuery);
    if (autoSearch || runSearch) {
      const timeoutId = setTimeout(() => {
        search(newQuery);
      }, debounceMs);
      return () => clearTimeout(timeoutId);
    }
  }, [autoSearch, debounceMs, search]);

  // Update filters
  const updateFilters = useCallback((newFilters: Partial<SearchFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    if (autoSearch && query.trim()) {
      search(query, { ...filters, ...newFilters });
    }
  }, [autoSearch, query, filters, search]);

  // Update context
  const updateContext = useCallback((newContext: Partial<SearchContext>) => {
    setContext(prev => ({ ...prev, ...newContext }));
    if (autoSearch && query.trim()) {
      search(query, filters, { ...context, ...newContext });
    }
  }, [autoSearch, query, filters, context, search]);

  // Clear search
  const clearSearch = useCallback(() => {
    setQuery('');
    setResults([]);
    setTotalResults(0);
    setError(null);
    setSuggestions([]);
  }, []);

  // Sort results
  const sortResults = useCallback((sortBy: string) => {
    const sortedResults = [...results].sort((a, b) => {
      switch (sortBy) {
        case 'relevance':
          return b.relevanceScore - a.relevanceScore;
        case 'popularity':
          // Would need to get full product data for this
          return 0;
        case 'rating':
          // Would need to get full product data for this
          return 0;
        case 'price-low':
          const priceA = a.price.discounted || a.price.original || 0;
          const priceB = b.price.discounted || b.price.original || 0;
          return priceA - priceB;
        case 'price-high':
          const priceA2 = a.price.discounted || a.price.original || 0;
          const priceB2 = b.price.discounted || b.price.original || 0;
          return priceB2 - priceA2;
        case 'newest':
          // Would need dateAdded in SearchResult
          return 0;
        default:
          return 0;
      }
    });
    setResults(sortedResults);
  }, [results]);

  // Auto-detect context based on query
  useEffect(() => {
    if (!query.trim()) return;

    const detectedContext: Partial<SearchContext> = {};
    const queryLower = query.toLowerCase();

    // Detect season
    if (queryLower.includes('zima') || queryLower.includes('winter') || queryLower.includes('ciepł')) {
      detectedContext.season = 'winter';
    } else if (queryLower.includes('lato') || queryLower.includes('summer') || queryLower.includes('plaż')) {
      detectedContext.season = 'summer';
    } else if (queryLower.includes('wiosna') || queryLower.includes('spring')) {
      detectedContext.season = 'spring';
    } else if (queryLower.includes('jesień') || queryLower.includes('autumn') || queryLower.includes('fall')) {
      detectedContext.season = 'autumn';
    }

    // Detect occasion
    if (queryLower.includes('praca') || queryLower.includes('biuro')) {
      detectedContext.occasion = 'praca';
    } else if (queryLower.includes('sport') || queryLower.includes('fitness')) {
      detectedContext.occasion = 'sport';
    } else if (queryLower.includes('podróż') || queryLower.includes('wakacje')) {
      detectedContext.occasion = 'podróże';
    }

    // Only update if we detected something new
    if (Object.keys(detectedContext).length > 0) {
      setContext(prev => ({ ...prev, ...detectedContext }));
    }
  }, [query]);

  // Get search analytics
  const getAnalytics = useCallback(() => {
    return {
      query,
      totalResults,
      searchTime,
      hasResults: results.length > 0,
      averageRelevance: results.length > 0 
        ? results.reduce((sum, r) => sum + r.relevanceScore, 0) / results.length 
        : 0,
      matchTypes: results.reduce((acc, r) => {
        acc[r.matchType] = (acc[r.matchType] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      appliedFilters: Object.keys(filters).length,
      contextDetected: Object.keys(context).length > 0
    };
  }, [query, totalResults, searchTime, results, filters, context]);

  return {
    // State
    query,
    filters,
    context,
    results,
    suggestions,
    isLoading,
    isLoadingSuggestions,
    error,
    totalResults,
    searchTime,

    // Actions
    search,
    getSuggestions,
    updateQuery,
    updateFilters,
    updateContext,
    clearSearch,
    sortResults,

    // Analytics
    getAnalytics
  };
};