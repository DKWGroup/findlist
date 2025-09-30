import { Product } from "../types";
import { supabase } from "./supabaseStorage";

export interface OverviewStats {
  totalProducts: number;
  totalUsers: number;
  totalViews: number;
  totalReviews: number;
  trendingProducts: number;
  verifiedProducts: number;
}

export const adminDashboardService = {
  async getOverviewStats(): Promise<OverviewStats> {
    // Count products
    const productsCountPromise = supabase
      .from("products")
      .select("id", { count: "exact", head: true });

    // Count users via profiles table
    const usersCountPromise = supabase
      .from("profiles")
      .select("id", { count: "exact", head: true });

    // Count trending and verified products
    const trendingCountPromise = supabase
      .from("products")
      .select("id", { count: "exact", head: true })
      .eq("is_trending", true);
    const verifiedCountPromise = supabase
      .from("products")
      .select("id", { count: "exact", head: true })
      .eq("is_verified", true);

    // Aggregate views and review counts from product_stats (sum client-side)
    const statsRowsPromise = supabase
      .from("product_stats")
      .select("views,rating_count");

    const [productsCount, usersCount, trendingCount, verifiedCount, statsRows] =
      await Promise.all([
        productsCountPromise,
        usersCountPromise,
        trendingCountPromise,
        verifiedCountPromise,
        statsRowsPromise,
      ]);

    const totalProducts = productsCount.count || 0;
    const totalUsers = usersCount.count || 0;
    const trendingProducts = trendingCount.count || 0;
    const verifiedProducts = verifiedCount.count || 0;

    let totalViews = 0;
    let totalReviews = 0;
    if (!statsRows.error && Array.isArray(statsRows.data)) {
      for (const row of statsRows.data as any[]) {
        totalViews += Number(row.views) || 0;
        totalReviews += Number(row.rating_count) || 0;
      }
    }

    return {
      totalProducts,
      totalUsers,
      totalViews,
      totalReviews,
      trendingProducts,
      verifiedProducts,
    };
  },

  async getRecentProducts(limit = 5): Promise<Product[]> {
    const { data, error } = await supabase
      .from("products")
      .select(
        `*,
        product_images(url, position),
        product_stats(*),
        product_tags(tag)
      `
      )
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error || !data) return [];

    // Map minimal model expected in AdminDashboard recent list
    return data.map((p: any) => ({
      id: p.id,
      title: p.title,
      description: p.description,
      category: p.category_id,
      productType: p.product_type,
      tags: Array.isArray(p.product_tags)
        ? p.product_tags.map((t: any) => t.tag)
        : [],
      images: Array.isArray(p.product_images)
        ? p.product_images
            .sort((a: any, b: any) => (a.position ?? 0) - (b.position ?? 0))
            .map((i: any) => i.url)
        : [],
      price: {
        original: p.price_original,
        discounted: p.price_discounted,
        currency: p.price_currency || "PLN",
      },
      affiliateLinks: {},
      socialLinks: {},
      popularity: {
        views: p.product_stats?.[0]?.views || 0,
        likes: p.product_stats?.[0]?.likes || 0,
        shares: p.product_stats?.[0]?.shares || 0,
      },
      ratings: {
        average: p.product_stats?.[0]?.rating_average || 0,
        count: p.product_stats?.[0]?.rating_count || 0,
      },
      dateAdded: p.created_at,
      isVerified: p.is_verified,
      isTrending: p.is_trending,
      code: p.code,
      urlAlias: p.url_alias,
    }));
  },
};
