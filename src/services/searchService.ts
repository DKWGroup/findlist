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
      const trimmedQuery = query.trim();
      const normalizedCodeQuery = trimmedQuery.replace(/\s+/g, "");
      const escapedCodeQuery = normalizedCodeQuery.replace(/[%_]/g, "\\$&");
      const escapedTitleQuery = trimmedQuery.replace(/[%_]/g, "\\$&");
      const isProductCodeQuery = normalizedCodeQuery.length >= 2;
      

      let searchResults: any[] = [];

      if (isProductCodeQuery) {
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
          .ilike("code", `%${escapedCodeQuery}%`)
          .order("title")
          .limit(10);

        if (codeError) {
          console.error("Error fetching products by code:", codeError);
        }

        if (productsByCode && productsByCode.length > 0) {
          searchResults = productsByCode;
        }
      }

      if (searchResults.length === 0) {
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
          .ilike("title", `%${escapedTitleQuery}%`)
          .order("title")
          .limit(10);

        if (titleError) {
          console.error("Error fetching products by title:", titleError);
          return [];
        }

        searchResults = productsByTitle || [];
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
