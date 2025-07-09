import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SearchResult, SearchFilters } from '../../types/search';
import { ProductCard } from '../ProductCard';
import { Filter, SortAsc, Grid, List, Sparkles, Image, ExternalLink } from 'lucide-react';
import { LazyImage } from '../Performance/LazyImage';

interface SearchResultsProps {
  results: SearchResult[];
  query: string;
  isLoading?: boolean;
  onSort?: (sortBy: string) => void;
  onFilter?: (filters: Partial<SearchFilters>) => void;
  totalResults?: number;
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  query,
  isLoading = false,
  onSort,
  onFilter,
  totalResults
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('relevance');

  // Track loading state for images
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});

  const handleImageLoad = (resultId: string) => {
    setLoadedImages(prev => ({
      ...prev,
      [resultId]: true
    }));
  };

  const handleImageError = (resultId: string) => {
    setLoadedImages(prev => ({
      ...prev,
      [resultId]: false
    }));
  };

  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy);
    if (onSort) {
      onSort(newSortBy);
    }
  };

  const getMatchTypeColor = (matchType: SearchResult['matchType']) => {
    switch (matchType) {
      case 'exact':
        return 'bg-green-100 text-green-800';
      case 'semantic':
        return 'bg-blue-100 text-blue-800';
      case 'fuzzy':
        return 'bg-yellow-100 text-yellow-800';
      case 'category':
        return 'bg-purple-100 text-purple-800';
      case 'tag':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getMatchTypeLabel = (matchType: SearchResult['matchType']) => {
    switch (matchType) {
      case 'exact':
        return 'Dokładne dopasowanie';
      case 'semantic':
        return 'Semantyczne';
      case 'fuzzy':
        return 'Podobne';
      case 'category':
        return 'Kategoria';
      case 'tag':
        return 'Tag';
      default:
        return 'Inne';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Loading skeleton */}
        <div className="flex items-center justify-between">
          <div className="h-8 bg-gray-200 rounded w-64 animate-pulse"></div>
          <div className="flex gap-2">
            <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded w-24 animate-pulse"></div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
              <div className="aspect-square bg-gray-200"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="flex gap-2">
                  <div className="h-3 bg-gray-200 rounded w-12"></div>
                  <div className="h-3 bg-gray-200 rounded w-12"></div>
                </div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {query ? `Wyniki dla "${query}"` : 'Wszystkie produkty'}
          </h2>
          <p className="text-gray-600">
            Znaleziono {totalResults || results.length} produktów
            {results.length > 0 && (
              <span className="ml-2 text-sm">
                • Średnia trafność: {Math.round(results.reduce((sum, r) => sum + r.relevanceScore, 0) / results.length)}%
              </span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Sort Options */}
          <div className="flex items-center gap-2">
            <SortAsc className="h-4 w-4 text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="relevance">Trafność</option>
              <option value="popularity">Popularność</option>
              <option value="rating">Ocena</option>
              <option value="price-low">Cena: rosnąco</option>
              <option value="price-high">Cena: malejąco</option>
              <option value="newest">Najnowsze</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'} transition-colors`}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'} transition-colors`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Search Insights */}
      {results.length > 0 && query && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Sparkles className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-900 mb-1">Inteligentne wyszukiwanie</h3>
              <p className="text-blue-800 text-sm">
                Znaleźliśmy produkty pasujące do "{query}" używając zaawansowanych algorytmów semantycznych.
                {results.some(r => r.matchType === 'semantic') && (
                  <span className="ml-1">Uwzględniliśmy również powiązane terminy i kontekst.</span>
                )}
              </p>
              
              {/* Match Types Summary */}
              <div className="flex flex-wrap gap-2 mt-2">
                {Array.from(new Set(results.map(r => r.matchType))).map(matchType => {
                  const count = results.filter(r => r.matchType === matchType).length;
                  return (
                    <span
                      key={matchType}
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getMatchTypeColor(matchType)}`}
                    >
                      {getMatchTypeLabel(matchType)}: {count}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results Grid/List */}
      {results.length > 0 ? (
        <div className={
          viewMode === 'grid'
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            : "space-y-4"
        }>
          {results.map((result) => (
            viewMode === 'grid' ? (
              <div key={result.id} className="relative">
                {/* Enhanced ProductCard with search metadata */}
                <div className="relative">
                  <ProductCard
                    product={{
                      id: result.id,
                      title: result.title,
                      description: result.description,
                      category: result.category,
                      tags: result.tags,
                      price: result.price,
                      images: result.images,
                      // Add other required Product fields with defaults
                      affiliateLinks: {},
                      socialLinks: {},
                      popularity: { views: 0, likes: 0, shares: 0 },
                      ratings: { average: 0, count: 0 },
                      dateAdded: new Date().toISOString().split('T')[0],
                      isVerified: false,
                      isTrending: false
                    }}
                  />
                  
                  {/* Search metadata overlay */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMatchTypeColor(result.matchType)}`}>
                      {result.relevanceScore}% trafność
                    </span>
                    
                    {result.matchedTerms.length > 0 && (
                      <div className="bg-white/90 backdrop-blur-sm rounded px-2 py-1">
                        <p className="text-xs text-gray-600">
                          Pasuje: {result.matchedTerms.slice(0, 2).join(', ')}
                          {result.matchedTerms.length > 2 && ` +${result.matchedTerms.length - 2}`}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <Link 
                key={result.id} 
                to={`/product/${result.id}`}
                className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-100 hover:shadow-md transition-all duration-200"
              >
                {/* Thumbnail with lazy loading */}
                <div className="relative w-[100px] h-[100px] flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                  {result.images && result.images.length > 0 ? (
                    <LazyImage
                      src={result.images[0]}
                      alt={result.title}
                      className="w-full h-full object-cover"
                      width={100}
                      height={100}
                      onLoad={() => handleImageLoad(result.id)}
                      onError={() => handleImageError(result.id)}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <Image className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                  
                  {/* Loading overlay */}
                  {loadedImages[result.id] === undefined && (
                    <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                      <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                  
                  {/* Error fallback */}
                  {loadedImages[result.id] === false && (
                    <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                      <Image className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                  
                  {/* Relevance badge */}
                  <div className="absolute top-1 left-1">
                    <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-medium ${getMatchTypeColor(result.matchType)}`}>
                      {result.relevanceScore}%
                    </span>
                  </div>
                </div>
                
                {/* Product details */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 mb-1 line-clamp-1">{result.title}</h3>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">{result.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {/* Price */}
                      <span className="text-blue-600 font-semibold whitespace-nowrap">
                        {result.price.discounted?.toFixed(2) || result.price.original?.toFixed(2) || '0.00'} {result.price.currency}
                      </span>
                      
                      {/* Tags */}
                      <div className="hidden sm:flex flex-wrap gap-1">
                        {result.tags.slice(0, 2).map(tag => (
                          <span key={tag} className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <span className="text-blue-600 flex items-center gap-1 text-xs whitespace-nowrap">
                      Zobacz <ExternalLink className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              </Link>
            )
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Brak wyników
          </h3>
          <p className="text-gray-600 max-w-md mx-auto mb-6">
            {query 
              ? `Nie znaleźliśmy produktów dla "${query}". Spróbuj użyć innych słów kluczowych lub sprawdź pisownię.`
              : 'Nie znaleziono produktów spełniających kryteria wyszukiwania.'
            }
          </p>
          
          {query && (
            <div className="bg-gray-50 rounded-lg p-4 max-w-md mx-auto">
              <h4 className="font-medium text-gray-900 mb-2">Sugestie:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Sprawdź pisownię słów kluczowych</li>
                <li>• Użyj bardziej ogólnych terminów</li>
                <li>• Spróbuj synonimów lub powiązanych słów</li>
                <li>• Usuń niektóre filtry wyszukiwania</li>
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};