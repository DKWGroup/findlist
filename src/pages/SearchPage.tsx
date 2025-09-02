import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { AdvancedSearchBar } from '../components/search/AdvancedSearchBar';
import { SearchResults } from '../components/search/SearchResults';
import { SmartRecommendations } from '../components/search/SmartRecommendations';
import { MetaTags } from '../components/SEO/MetaTags';
import { useAdvancedSearch } from '../hooks/useAdvancedSearch';
import { SearchContext } from '../types/search';

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialCategory = searchParams.get('category') || '';
  
  const [searchContext, setSearchContext] = useState<Partial<SearchContext>>({
    season: getCurrentSeason(),
    timeOfDay: getCurrentTimeOfDay()
  });

  const {
    query,
    filters,
    results,
    suggestions,
    isLoading,
    error,
    totalResults,
    searchTime,
    search,
    getSuggestions,
    updateQuery,
    updateFilters,
    sortResults,
    getAnalytics
  } = useAdvancedSearch({
    initialQuery,
    initialFilters: initialCategory ? { categories: [initialCategory] } : {},
    initialContext: searchContext,
    autoSearch: false,
    debounceMs: 300
  });

  // Update URL when search changes
  useEffect(() => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (filters.categories?.length) params.set('category', filters.categories[0]);
    setSearchParams(params);
  }, [query, filters.categories, setSearchParams]);

  // Perform initial search if query exists
  useEffect(() => {
    if (initialQuery) {
      search(initialQuery);
    }
  }, [initialQuery, search]);

  const handleSearch = (searchQuery: string, searchFilters?: any) => {
    updateQuery(searchQuery);
    if (searchFilters) {
      updateFilters(searchFilters);
    }
    search(searchQuery, searchFilters, searchContext);
  };

  const handleSort = (sortBy: string) => {
    sortResults(sortBy);
  };

  const analytics = getAnalytics();

  return (
    <Layout>
      <MetaTags
        title={query ? `Wyniki wyszukiwania dla "${query}" | VIRALIST` : "Wyszukiwanie produktów | VIRALIST"}
        description={query ? `Przeglądaj wyniki wyszukiwania dla "${query}". Znajdź najlepsze viralowe produkty z TikToka i Instagrama.` : "Wyszukaj najlepsze viralowe produkty z TikToka i Instagrama. Zaawansowane wyszukiwanie z filtrowaniem i sugestiami."}
        keywords={`wyszukiwanie produktów, ${query || 'viralowe produkty'}, tiktok, instagram, trendy zakupowe`}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Inteligentne wyszukiwanie produktów
          </h1>
          <p className="text-gray-600 mb-6">
            Znajdź dokładnie to, czego szukasz dzięki zaawansowanemu wyszukiwaniu semantycznemu
          </p>
          
          <AdvancedSearchBar
            onSearch={handleSearch}
            onSuggestionSelect={(suggestion) => {
              if (suggestion.type === 'product') {
                handleSearch(suggestion.text);
              }
            }}
            showFilters={true}
            className="max-w-4xl"
          />
        </div>

        {/* Search Analytics (for development/debugging) */}
        {process.env.NODE_ENV === 'development' && analytics.hasResults && (
          <div className="mb-6 p-4 bg-gray-100 rounded-lg text-sm text-gray-600">
            <strong>Analytics:</strong> {analytics.totalResults} wyników w {analytics.searchTime.toFixed(0)}ms
            {analytics.averageRelevance > 0 && (
              <span> • Średnia trafność: {analytics.averageRelevance.toFixed(1)}%</span>
            )}
            {analytics.contextDetected && <span> • Kontekst wykryty</span>}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="text-red-600">⚠️</div>
              <div>
                <h3 className="font-medium text-red-900">Błąd wyszukiwania</h3>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Search Results */}
        <div className="mb-12">
          <SearchResults
            results={results}
            query={query}
            isLoading={isLoading}
            onSort={handleSort}
            onFilter={updateFilters}
            totalResults={totalResults}
          />
        </div>

        {/* Smart Recommendations */}
        {!isLoading && (
          <SmartRecommendations
            context={searchContext}
            className="mb-8"
          />
        )}

        {/* Search Tips */}
        {!query && !isLoading && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">
              💡 Wskazówki dotyczące wyszukiwania
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-blue-800">
              <div>
                <h4 className="font-medium mb-2">Wyszukiwanie semantyczne</h4>
                <ul className="text-sm space-y-1">
                  <li>• Używaj naturalnego języka: "produkty na lato"</li>
                  <li>• Opisuj zastosowanie: "do pracy z domu"</li>
                  <li>• Wspominaj okazje: "na prezent urodzinowy"</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Zaawansowane funkcje</h4>
                <ul className="text-sm space-y-1">
                  <li>• Automatyczne wykrywanie kontekstu sezonowego</li>
                  <li>• Sugestie w czasie rzeczywistym</li>
                  <li>• Inteligentne rekomendacje produktów</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

// Helper functions
function getCurrentSeason(): 'spring' | 'summer' | 'autumn' | 'winter' {
  const month = new Date().getMonth();
  if (month >= 2 && month <= 4) return 'spring';
  if (month >= 5 && month <= 7) return 'summer';
  if (month >= 8 && month <= 10) return 'autumn';
  return 'winter';
}

function getCurrentTimeOfDay(): 'morning' | 'afternoon' | 'evening' | 'night' {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 18) return 'afternoon';
  if (hour >= 18 && hour < 22) return 'evening';
  return 'night';
}