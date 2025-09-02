import { useCallback, useEffect, useMemo, useState } from "react";
import { productService } from "../services/productService";
import { Product } from "../types";
import { supabase } from "../services/supabaseStorage";

interface UseProductsOptions {
  page?: number;
  limit?: number;
  category?: string;
  trending?: boolean;
  search?: string;
  autoFetch?: boolean;
}

interface UseProductsResult {
  products: Product[];
  total: number;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  loadProducts: (options?: UseProductsOptions) => Promise<void>;
}

export const useProducts = (
  initialOptions: UseProductsOptions = {}
): UseProductsResult => {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Memoize the options to prevent infinite re-renders
  const { autoFetch = true, ...restOptions } = initialOptions;
  const memoizedOptions = useMemo(
    () => restOptions,
    [
      restOptions.page,
      restOptions.limit,
      restOptions.category,
      restOptions.trending,
      restOptions.search,
    ]
  );

  const loadProducts = useCallback(
    async (options: UseProductsOptions = {}) => {
      setLoading(true);
      setError(null);

      console.log("🔄 Loading products with options:", {
        ...memoizedOptions,
        ...options,
      });

      try {
        const result = await productService.getProducts({
          ...memoizedOptions,
          ...options,
        });

        console.log("✅ Products loaded successfully:", {
          count: result.products.length,
          total: result.total,
          products: result.products,
        });

        setProducts(result.products);
        setTotal(result.total);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load products";
        console.error("❌ Error loading products:", err);
        setError(errorMessage);
        setProducts([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    },
    [memoizedOptions]
  );

  const refresh = useCallback(() => {
    return loadProducts();
  }, [loadProducts]);

  // Auto-fetch on mount if enabled
  useEffect(() => {
    if (autoFetch) {
      loadProducts();
    }
  }, [autoFetch, loadProducts]);

  return {
    products,
    total,
    loading,
    error,
    refresh,
    loadProducts,
  };
};

// Hook for getting a single product
export const useProduct = (productId: string | null) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProduct = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);

    console.log("🔄 Loading product with ID:", id);

    try {
      // Get product with all related data
      const { data, error } = await supabase.rpc('get_product_complete', {
        p_product_id: id
      });
      
      if (error) throw error;
      
      if (data) {
        // Transform to Product type
        const productData: Product = {
          id: data.id,
          title: data.title,
          description: data.description,
          category: data.category_id,
          productType: data.product_type,
          tags: data.tags || [],
          images: data.images || [],
          price: {
            original: data.price_original,
            discounted: data.price_discounted,
            currency: data.price_currency || 'PLN'
          },
          affiliateLinks: data.affiliate_links || {},
          socialLinks: data.social_links || {},
          popularity: data.popularity || {
            views: 0,
            likes: 0,
            shares: 0
          },
          ratings: {
            average: data.ratings?.average || 0,
            count: data.ratings?.count || 0
          },
          dateAdded: data.created_at,
          isVerified: data.is_verified,
          isTrending: data.is_trending,
          code: data.code,
          urlAlias: data.url_alias
        };
        
        console.log("✅ Product loaded successfully:", productData);
        setProduct(productData);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load product";
      console.error("❌ Error loading product:", err);
      setError(errorMessage);
      setProduct(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (productId) {
      loadProduct(productId);
    } else {
      setProduct(null);
      setError(null);
    }
  }, [productId, loadProduct]);

  return {
    product,
    loading,
    error,
    refresh: () => (productId ? loadProduct(productId) : Promise.resolve()),
  };
};

// Hook for getting categories
export const useCategories = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCategories = useCallback(async () => {
    setLoading(true);
    setError(null);

    console.log("🔄 Loading categories...");

    try {
      const result = await productService.getCategories();
      console.log("✅ Categories loaded successfully:", result);
      setCategories(result);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load categories";
      console.error("❌ Error loading categories:", err);
      setError(errorMessage);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  return {
    categories,
    loading,
    error,
    refresh: loadCategories,
  };
};
