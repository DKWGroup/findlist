import { SearchSuggestion } from "../types/search";
import { supabase } from "./supabaseStorage";

class SearchService {
  private suggestionCache = new Map<string, SearchSuggestion[]>();

  async getSuggestions(query: string): Promise<SearchSuggestion[]> {
    if (query.length < 2) {
      return [];
    }

    const cacheKey = `suggestions_${query}`;
    if (this.suggestionCache.has(cacheKey)) {
      return this.suggestionCache.get(cacheKey)!;
    }

    try {
      // Sprawdź czy query wygląda jak kod produktu (format: XX-XX-000)
      const isProductCodeQuery = /^[A-Z]{2}-[A-Z]{2}-\d{1,3}$/i.test(
        query.trim()
      );

      let searchResults: any[] = [];

      if (isProductCodeQuery) {
        // Wyszukiwanie po kodzie produktu (case-insensitive, exact match)
        const { data: productsByCode, error: codeError } = await supabase
          .from("products")
          .select(
            `
            id,
            title,
            url_alias,
            category_id,
            code
          `
          )
          .ilike("code", query.trim())
          .order("title")
          .limit(10);

        if (codeError) {
          console.error("Error fetching products by code:", codeError);
          return [];
        }

        searchResults = productsByCode || [];
      } else {
        // Standardowe wyszukiwanie po tytule
        const { data: productsByTitle, error: titleError } = await supabase
          .from("products")
          .select(
            `
            id,
            title,
            url_alias,
            category_id,
            code
          `
          )
          .ilike("title", `%${query}%`)
          .order("title")
          .limit(10);

        if (titleError) {
          console.error("Error fetching products by title:", titleError);
          return [];
        }

        searchResults = productsByTitle || [];
      }

      // Jeśli brak wyników
      if (!searchResults || searchResults.length === 0) {
        return [
          {
            id: "no-results",
            text: "Brak pasujących produktów",
            type: "query",
          },
        ];
      }

      // Pobieranie pierwszego zdjęcia dla każdego produktu
      const productIds = searchResults.map((p) => p.id);
      const { data: productImages, error: imagesError } = await supabase
        .from("product_images")
        .select("product_id, url")
        .in("product_id", productIds);

      // Mapa product_id -> pierwsze zdjęcie
      const imageMap: Record<string, string> = {};
      if (!imagesError && productImages) {
        productImages.forEach((img: any) => {
          if (!imageMap[img.product_id]) {
            imageMap[img.product_id] = img.url;
          }
        });
      }

      // Pobieranie kategorii dla znalezionych produktów
      const categoryIds = [
        ...new Set(searchResults.map((p) => p.category_id).filter(Boolean)),
      ];
      let categoryNames: Record<string, string> = {};

      if (categoryIds.length > 0) {
        const { data: categories, error: categoriesError } = await supabase
          .from("categories")
          .select("id, name")
          .in("id", categoryIds);

        if (!categoriesError && categories) {
          categoryNames = categories.reduce((acc: any, cat: any) => {
            acc[cat.id] = cat.name;
            return acc;
          }, {});
        }
      }

      // Mapowanie produktów na sugestie
      const productSuggestions: SearchSuggestion[] = searchResults.map(
        (product: any) => ({
          id: `product_${product.id}`,
          text:
            isProductCodeQuery && product.code
              ? `${product.code} - ${product.title}`
              : product.title,
          type: "product",
          imageUrl: imageMap[product.id] || undefined,
          url: `/produkty/${product.url_alias}`,
        })
      );

      // Zbieranie unikalnych kategorii
      const uniqueCategories = new Set<string>(
        searchResults
          .map((p: any) => categoryNames[p.category_id])
          .filter(Boolean)
      );

      const categorySuggestions: SearchSuggestion[] = Array.from(
        uniqueCategories
      ).map((categoryName) => ({
        id: `category_${categoryName.toLowerCase().replace(/\s+/g, "-")}`,
        text: categoryName,
        type: "category",
        url: `/produkty?category=${encodeURIComponent(categoryName)}`,
      }));

      // Sortowanie wyników: kategorie najpierw, potem produkty
      const finalSuggestions = [...categorySuggestions, ...productSuggestions];

      this.suggestionCache.set(cacheKey, finalSuggestions);
      return finalSuggestions;
    } catch (error) {
      console.error("Error fetching search suggestions:", error);
      return [];
    }
  }
}

export default new SearchService();
