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
      // Wyszukiwanie produktów
      const { data: products, error: productsError } = await supabase
        .from("products")
        .select(
          `
          id,
          title,
          category_id
        `
        )
        .ilike("title", `%${query}%`)
        .order("title")
        .limit(10);

      if (productsError) {
        console.error("Error fetching products:", productsError);
        return [];
      }

      if (!products || products.length === 0) {
        return [
          {
            id: "no-results",
            text: "Brak pasujących produktów",
            type: "query",
          },
        ];
      }

      // Pobieranie pierwszego zdjęcia dla każdego produktu
      const productIds = products.map((p) => p.id);
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
        ...new Set(products.map((p) => p.category_id).filter(Boolean)),
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
      const productSuggestions: SearchSuggestion[] = products.map(
        (product: any) => ({
          id: `product_${product.id}`,
          text: product.title,
          type: "product",
          imageUrl: imageMap[product.id] || undefined,
          url: `/produkty/${product.id}`,
        })
      );

      // Zbieranie unikalnych kategorii
      const uniqueCategories = new Set<string>(
        products.map((p: any) => categoryNames[p.category_id]).filter(Boolean)
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
