import { SearchSuggestion } from "../types/search";
import { supabase } from "./supabaseStorage";

const PRODUCT_CODE_PREFIX_REGEX = /^[A-Z]{2}-\d{0,3}$/;
const PRODUCT_CODE_FULL_REGEX = /^[A-Z]{2}-\d{3}$/;

class SearchService {
  private suggestionCache = new Map<string, SearchSuggestion[]>();

  private escapeIlikeTerm(term: string) {
    return term.replace(/[%_]/g, (match) => "\\" + match);
  }

  async getSuggestions(
    rawQuery: string,
    limit = 10
  ): Promise<SearchSuggestion[]> {
    const trimmedQuery = rawQuery.trim();
    const normalizedQuery = trimmedQuery.toUpperCase();
    const cacheKey = `suggestions_${normalizedQuery}_${limit}`;

    // For general search we still require at least 2 characters.
    if (
      !PRODUCT_CODE_PREFIX_REGEX.test(normalizedQuery) &&
      normalizedQuery.length < 2
    ) {
      return [];
    }

    if (this.suggestionCache.has(cacheKey)) {
      return this.suggestionCache.get(cacheKey)!;
    }

    try {
      const isPotentialCodeQuery =
        PRODUCT_CODE_PREFIX_REGEX.test(normalizedQuery);
      const isCompleteCodeQuery = PRODUCT_CODE_FULL_REGEX.test(normalizedQuery);

      let searchResults: any[] = [];
      let treatAsCodeResult = false;

      if (isPotentialCodeQuery) {
        const ilikePattern = isCompleteCodeQuery
          ? normalizedQuery
          : `${normalizedQuery}%`;

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
          .ilike("code", ilikePattern)
          .order("code", { ascending: true })
          .limit(limit);

        if (codeError) {
          console.error("Error fetching products by code:", codeError);
          return [];
        }

        searchResults = productsByCode || [];
        treatAsCodeResult = searchResults.length > 0;
      }

      if (!treatAsCodeResult) {
        const escapedQuery = this.escapeIlikeTerm(trimmedQuery);
        const escapedCodeQuery = this.escapeIlikeTerm(normalizedQuery);

        const { data: productsBySearch, error: searchError } = await supabase
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
          .or(
            `title.ilike.%${escapedQuery}%,description.ilike.%${escapedQuery}%,code.ilike.%${escapedCodeQuery}%`
          )
          .order("title", { ascending: true })
          .limit(limit);

        if (searchError) {
          console.error("Error fetching products by search:", searchError);
          return [];
        }

        searchResults = productsBySearch || [];
      }

      if (!searchResults || searchResults.length === 0) {
        return [
          {
            id: "no-results",
            text: "Brak pasujących produktów",
            type: "query",
          },
        ];
      }

      const productIds = searchResults.map((p) => p.id);
      const { data: productImages, error: imagesError } = await supabase
        .from("product_images")
        .select("product_id, url")
        .in("product_id", productIds);

      const imageMap: Record<string, string> = {};
      if (!imagesError && productImages) {
        productImages.forEach((img: any) => {
          if (!imageMap[img.product_id]) {
            imageMap[img.product_id] = img.url;
          }
        });
      }

      const categoryIds = [
        ...new Set(searchResults.map((p) => p.category_id).filter(Boolean)),
      ];
      let categoryNames: Record<string, string> = {};

      if (categoryIds.length > 0) {
        const { data: categories, error: categoriesError } = await supabase
          .from("product_categories")
          .select("id, name")
          .in("id", categoryIds);

        if (!categoriesError && categories) {
          categoryNames = categories.reduce(
            (acc: Record<string, string>, cat: any) => {
              acc[cat.id] = cat.name;
              return acc;
            },
            {}
          );
        }
      }

      const productSuggestions: SearchSuggestion[] = searchResults.map(
        (product: any) => ({
          id: `product_${product.id}`,
          text: product.code
            ? `${product.code} - ${product.title}`
            : product.title,
          type: "product",
          imageUrl: imageMap[product.id] || undefined,
          url: product.url_alias
            ? `/produkty/${product.url_alias}`
            : product.code
            ? `/${product.code}`
            : `/produkt/${product.id}`,
          productId: product.id,
        })
      );

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
