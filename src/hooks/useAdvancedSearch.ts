import { useCallback, useEffect, useState } from "react";
import searchService from "../services/searchService";
import { SearchSuggestion } from "../types/search";

interface UseAdvancedSearchOptions {
  initialQuery?: string;
  debounceMs?: number;
}

export const useAdvancedSearch = (options: UseAdvancedSearchOptions = {}) => {
  const { initialQuery = "", debounceMs = 300 } = options;

  const [query, setQuery] = useState(initialQuery);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

  const getSuggestions = useCallback(async (suggestionQuery: string) => {
    if (suggestionQuery.length < 2) {
      setSuggestions([]);
      return;
    }

    setIsLoadingSuggestions(true);
    try {
      const newSuggestions = await searchService.getSuggestions(
        suggestionQuery
      );
      setSuggestions(newSuggestions);
    } catch (err) {
      console.error("Error fetching suggestions:", err);
      setSuggestions([]);
    } finally {
      setIsLoadingSuggestions(false);
    }
  }, []);

  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    const handler = setTimeout(() => {
      getSuggestions(query);
    }, debounceMs);

    return () => {
      clearTimeout(handler);
    };
  }, [query, debounceMs, getSuggestions]);

  const updateQuery = (newQuery: string) => {
    setQuery(newQuery);
  };

  const clearSearch = useCallback(() => {
    setQuery("");
    setSuggestions([]);
  }, []);

  return {
    query,
    suggestions,
    isLoadingSuggestions,
    updateQuery,
    clearSearch,
  };
};
