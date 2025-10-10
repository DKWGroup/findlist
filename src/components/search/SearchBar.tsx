import { Image, Package, Search, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import searchService from "../../services/searchService";
import { SearchSuggestion } from "../../types/search";
import { LazyImage } from "../Performance/LazyImage";

interface SearchBarProps {
  onSearch: (query: string) => void;
  onSuggestionSelect?: (suggestion: SearchSuggestion) => void;
  placeholder?: string;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  onSuggestionSelect,
  placeholder = "Szukaj produktów...",
  className = "",
}) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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
          // Filter to show only products
          const productSuggestions = newSuggestions.filter(
            (s) => s.type === "product"
          );
          setSuggestions(productSuggestions);
          setShowSuggestions(true);
        } catch (error) {
          console.error("Error fetching suggestions:", error);
        } finally {
          setIsLoading(false);
        }
      } else if (query.length === 0 && hasUserInteracted) {
        // Show default product suggestions only after user interaction
        const defaultSuggestions = await searchService.getSuggestions("");
        const productSuggestions = defaultSuggestions.filter(
          (s) => s.type === "product"
        );
        setSuggestions(productSuggestions);
        setShowSuggestions(true);
      } else {
        setShowSuggestions(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 200);
    return () => clearTimeout(debounceTimer);
  }, [query, hasUserInteracted]);

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    // Ignore click on "no results" element
    if (suggestion.id === "no-results") {
      return;
    }

    if (suggestion.url) {
      // Redirect to product page using URL from suggestion
      window.location.href = suggestion.url;
    } else {
      setQuery(suggestion.text);
      onSearch(suggestion.text);
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
    const value = e.target.value;
    setQuery(value);
    setHasUserInteracted(true);

    // Don't trigger search on every change - only show suggestions
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && query.trim()) {
      onSearch(query.trim());
      setShowSuggestions(false);
    }
  };
  const fetchDefaultSuggestions = async () => {
    try {
      const defaultSuggestions = await searchService.getSuggestions("");
      // Filter to show only products
      const productSuggestions = defaultSuggestions.filter(
        (s) => s.type === "product"
      );
      setSuggestions(productSuggestions);
      setShowSuggestions(true);
    } catch (error) {
      console.error("Error fetching default suggestions:", error);
    }
  };

  const clearQuery = () => {
    setQuery("");
    setShowSuggestions(false);
    onSearch("");
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

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none z-10" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleInputFocus}
          onClick={handleInputClick}
          className="w-full pl-12 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
          placeholder={placeholder}
          autoComplete="off"
        />
        {/* Show loading spinner or clear button */}
        {isLoading && hasUserInteracted ? (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 z-10">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          query && (
            <button
              type="button"
              onClick={clearQuery}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors z-10"
            >
              <X className="h-4 w-4" />
            </button>
          )
        )}
      </div>

      {/* Search Suggestions - Only show products after user interaction */}
      {showSuggestions && hasUserInteracted && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-96 overflow-y-auto">
          <div className="p-2">
            {suggestions.map((suggestion) =>
              suggestion.id === "no-results" ? (
                <div
                  key={suggestion.id}
                  className="w-full flex items-center gap-3 px-3 py-3 text-left rounded-lg text-gray-500 bg-gray-50 cursor-default"
                >
                  <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center flex-shrink-0">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <span className="text-gray-500">{suggestion.text}</span>
                  </div>
                </div>
              ) : (
                <button
                  key={suggestion.id}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full flex items-center gap-3 px-3 py-3 text-left hover:bg-blue-50 rounded-lg transition-colors group relative cursor-pointer"
                >
                  {suggestion.imageUrl ? (
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
                      <LazyImage
                        src={suggestion.imageUrl}
                        alt={suggestion.text}
                        className="w-full h-full object-cover"
                        width={48}
                        height={48}
                        onLoad={() => handleImageLoad(suggestion.id)}
                        onError={() => handleImageError(suggestion.id)}
                      />
                      {loadedImages[suggestion.id] === undefined && (
                        <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
                      )}
                      {loadedImages[suggestion.id] === false && (
                        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                          <Image className="h-5 w-5 text-gray-400" />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-gray-100 flex-shrink-0 border border-gray-200">
                      <Package className="h-5 w-5 text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                      {suggestion.text}
                    </div>
                    {suggestion.count && (
                      <div className="text-xs text-gray-500 mt-0.5">
                        {suggestion.count.toLocaleString()} wyświetleń
                      </div>
                    )}
                  </div>
                  <Search className="h-4 w-4 text-gray-300 group-hover:text-blue-400 transition-colors flex-shrink-0" />
                </button>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
};
