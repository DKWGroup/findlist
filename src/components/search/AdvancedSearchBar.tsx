import {
  Clock,
  Filter,
  Image,
  Package,
  Search,
  Tag,
  TrendingUp,
  X,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import searchService from "../../services/searchService";
import { SearchFilters, SearchSuggestion } from "../../types/search";
import { LazyImage } from "../Performance/LazyImage";

interface AdvancedSearchBarProps {
  onSearch: (query: string, filters?: Partial<SearchFilters>) => void;
  onSuggestionSelect?: (suggestion: SearchSuggestion) => void;
  placeholder?: string;
  showFilters?: boolean;
  className?: string;
}

export const AdvancedSearchBar: React.FC<AdvancedSearchBarProps> = ({
  onSearch,
  onSuggestionSelect,
  placeholder = "Szukaj viralnych produktów...",
  showFilters = true,
  className = "",
}) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState<Partial<SearchFilters>>({});
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});
  const [hasUserInteracted, setHasUserInteracted] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
        setShowFiltersPanel(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    // Only fetch suggestions if user has interacted with the search bar
    if (!hasUserInteracted) return;

    const fetchSuggestions = async () => {
      if (query.length >= 2) {
        setIsLoading(true);
        try {
          const newSuggestions = await searchService.getSuggestions(query);
          setSuggestions(newSuggestions);
          setShowSuggestions(true);
        } catch (error) {
          console.error("Error fetching suggestions:", error);
        } finally {
          setIsLoading(false);
        }
      } else if (query.length === 0 && hasUserInteracted) {
        // Show default suggestions only after user interaction
        const defaultSuggestions = await searchService.getSuggestions("");
        setSuggestions(defaultSuggestions);
        setShowSuggestions(true);
      } else {
        setShowSuggestions(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 200);
    return () => clearTimeout(debounceTimer);
  }, [query, hasUserInteracted]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim(), filters);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    // Ignoruj kliknięcie na element "Brak pasujących produktów"
    if (suggestion.id === "no-results") {
      return;
    }

    if (suggestion.url) {
      // Przekierowanie do strony produktu lub kategorii używając URL z sugestii
      window.location.href = suggestion.url;
    } else {
      setQuery(suggestion.text);
      onSearch(suggestion.text, filters);
    }

    if (onSuggestionSelect) {
      onSuggestionSelect(suggestion);
    }
    setShowSuggestions(false);
  };

  const handleInputFocus = () => {
    setHasUserInteracted(true);
    // Only show suggestions if we have them and user has interacted
    if (suggestions.length > 0 && hasUserInteracted) {
      setShowSuggestions(true);
    }
  };

  const handleInputClick = () => {
    setHasUserInteracted(true);
    // Fetch default suggestions on click if query is empty
    if (query.length === 0) {
      fetchDefaultSuggestions();
    } else if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setHasUserInteracted(true);
  };

  const fetchDefaultSuggestions = async () => {
    try {
      const defaultSuggestions = await searchService.getSuggestions("", 6);
      setSuggestions(defaultSuggestions);
      setShowSuggestions(true);
    } catch (error) {
      console.error("Error fetching default suggestions:", error);
    }
  };

  const clearQuery = () => {
    setQuery("");
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleImageLoad = (suggestionId: string) => {
    setLoadedImages((prev) => ({
      ...prev,
      [suggestionId]: true,
    }));
  };

  const handleImageError = (suggestionId: string) => {
    setLoadedImages((prev) => ({
      ...prev,
      [suggestionId]: false,
    }));
  };

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case "trending":
        return <TrendingUp className="h-4 w-4 text-red-500" />;
      case "category":
        return <Tag className="h-4 w-4 text-blue-500" />;
      case "product":
        return <Package className="h-4 w-4 text-green-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getSuggestionLabel = (type: string) => {
    switch (type) {
      case "trending":
        return "Trending";
      case "category":
        return "Kategoria";
      case "product":
        return "Produkt";
      default:
        return "Zapytanie";
    }
  };

  const activeFiltersCount = Object.values(filters).filter((value) => {
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === "object" && value !== null)
      return Object.keys(value).length > 0;
    return value !== undefined && value !== null;
  }).length;

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              onClick={handleInputClick}
              className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-l-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
              placeholder={placeholder}
              autoComplete="off"
            />
            {query && (
              <button
                type="button"
                onClick={clearQuery}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {showFilters && (
            <button
              type="button"
              onClick={() => setShowFiltersPanel(!showFiltersPanel)}
              className={`px-4 py-3 border-t border-b border-gray-300 transition-colors relative ${
                showFiltersPanel
                  ? "bg-blue-50 text-blue-600 border-blue-300"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Filter className="h-5 w-5" />
              {activeFiltersCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          )}

          <button
            type="submit"
            disabled={!query.trim()}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-r-xl transition-colors font-medium"
          >
            Szukaj
          </button>
        </div>
      </form>

      {/* Search Suggestions - Only show after user interaction */}
      {showSuggestions && hasUserInteracted && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-96 overflow-y-auto">
          <div className="p-2">
            {suggestions.map((suggestion) =>
              suggestion.id === "no-results" ? (
                <div
                  key={suggestion.id}
                  className="w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg text-gray-500 bg-gray-50 cursor-default"
                >
                  <div className="w-10 h-10 rounded bg-gray-200 flex items-center justify-center flex-shrink-0">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">{suggestion.text}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  key={suggestion.id}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-50 rounded-lg transition-colors group relative cursor-pointer"
                >
                  {suggestion.type === "product" && suggestion.imageUrl ? (
                    <div className="relative w-10 h-10 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                      <LazyImage
                        src={suggestion.imageUrl}
                        alt={suggestion.text}
                        className="w-full h-full object-cover"
                        width={40}
                        height={40}
                        onLoad={() => handleImageLoad(suggestion.id)}
                        onError={() => handleImageError(suggestion.id)}
                      />
                      {loadedImages[suggestion.id] === undefined && (
                        <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
                      )}
                      {loadedImages[suggestion.id] === false && (
                        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                          <Image className="h-4 w-4 text-gray-400" />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded flex items-center justify-center bg-gray-100 flex-shrink-0">
                      {getSuggestionIcon(suggestion.type)}
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-900 group-hover:text-blue-600 transition-colors">
                        {suggestion.text.length > 40
                          ? `${suggestion.text.substring(0, 40)}...`
                          : suggestion.text}
                      </span>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {getSuggestionLabel(suggestion.type)}
                      </span>
                    </div>
                    {suggestion.count && (
                      <div className="text-xs text-gray-500 mt-1">
                        {suggestion.count.toLocaleString()} wyszukiwań
                      </div>
                    )}
                  </div>
                  <Search className="h-4 w-4 text-gray-300 group-hover:text-blue-400 transition-colors" />
                </button>
              )
            )}
          </div>
        </div>
      )}

      {/* Loading indicator - Only show after user interaction */}
      {isLoading && hasUserInteracted && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 p-4">
          <div className="flex items-center justify-center gap-2 text-gray-500">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span>Wyszukiwanie...</span>
          </div>
        </div>
      )}

      {/* Filters Panel */}
      {showFiltersPanel && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-40 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Filtry wyszukiwania
            </h3>
            <button
              onClick={() => setShowFiltersPanel(false)}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Zakres cen (PLN)
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Od"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      priceRange: {
                        ...prev.priceRange,
                        min: parseFloat(e.target.value) || 0,
                      },
                    }))
                  }
                />
                <input
                  type="number"
                  placeholder="Do"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      priceRange: {
                        ...prev.priceRange,
                        max: parseFloat(e.target.value) || 1000,
                      },
                    }))
                  }
                />
              </div>
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimalna ocena
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    rating: e.target.value
                      ? { min: parseFloat(e.target.value), max: 5 }
                      : undefined,
                  }))
                }
              >
                <option value="">Wszystkie oceny</option>
                <option value="4">4+ gwiazdek</option>
                <option value="3">3+ gwiazdek</option>
                <option value="2">2+ gwiazdek</option>
              </select>
            </div>

            {/* Quick Filters */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Szybkie filtry
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        isTrending: e.target.checked ? true : undefined,
                      }))
                    }
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Tylko trendy
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        isVerified: e.target.checked ? true : undefined,
                      }))
                    }
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Zweryfikowane
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        hasDiscount: e.target.checked ? true : undefined,
                      }))
                    }
                  />
                  <span className="ml-2 text-sm text-gray-700">Z promocją</span>
                </label>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
            <button
              onClick={() => {
                setFilters({});
                setShowFiltersPanel(false);
              }}
              className="text-gray-600 hover:text-gray-800 transition-colors"
            >
              Wyczyść filtry
            </button>
            <button
              onClick={() => {
                onSearch(query, filters);
                setShowFiltersPanel(false);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Zastosuj filtry
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
