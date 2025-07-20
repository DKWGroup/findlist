import { supabase } from "./supabaseStorage";

export interface ProductStats {
  views: number;
  likes: number;
  shares: number;
  rating_average: number;
  rating_count: number;
}

export class ProductStatsService {
  /**
   * Get product statistics
   */
  static async getProductStats(
    productId: string
  ): Promise<ProductStats | null> {
    try {
      const { data, error } = await supabase.rpc("get_product_stats", {
        p_product_id: productId,
      });

      if (error) {
        console.error("Error fetching product stats:", error);
        return null;
      }

      return data as ProductStats;
    } catch (error) {
      console.error("Error in getProductStats:", error);
      return null;
    }
  }

  /**
   * Increment product views
   */
  static async incrementViews(productId: string): Promise<boolean> {
    try {
      console.log("Attempting to increment views for product:", productId);

      const { data, error } = await supabase.rpc("increment_product_views", {
        p_product_id: productId,
      });

      if (error) {
        console.error("Error incrementing views:", error);
        console.error(
          "Error details:",
          error.message,
          error.details,
          error.hint
        );
        return false;
      }

      console.log("Views incremented successfully:", data);
      console.log("Function returned:", typeof data, data);

      return data === true;
    } catch (error) {
      console.error("Error in incrementViews:", error);
      return false;
    }
  }

  /**
   * Toggle product like
   */
  static async toggleLike(
    productId: string,
    userId: string
  ): Promise<boolean | null> {
    try {
      const { data, error } = await supabase.rpc("toggle_product_like", {
        p_product_id: productId,
        p_user_id: userId,
      });

      if (error) {
        console.error("Error toggling like:", error);
        return null;
      }

      return data === true;
    } catch (error) {
      console.error("Error in toggleLike:", error);
      return null;
    }
  }

  /**
   * Check if user liked a product
   */
  static async isProductLiked(
    productId: string,
    userId: string
  ): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("liked_products")
        .eq("id", userId)
        .single();

      if (error || !data) {
        return false;
      }

      const likedProducts = data.liked_products || [];
      return Array.isArray(likedProducts) && likedProducts.includes(productId);
    } catch (error) {
      console.error("Error checking if product is liked:", error);
      return false;
    }
  }

  /**
   * Debug function to check database state
   */
  static async debugProductStats(productId: string): Promise<void> {
    try {
      console.log("=== DEBUG: Product Stats ===");
      console.log("Product ID:", productId);

      // Check if record exists in product_stats table
      const { data: statsData, error: statsError } = await supabase
        .from("product_stats")
        .select("*")
        .eq("product_id", productId);

      if (statsError) {
        console.error("Error querying product_stats:", statsError);
      } else {
        console.log("Current product_stats records:", statsData);
      }

      // Try to call the RPC function and see what happens
      const { data: rpcData, error: rpcError } = await supabase.rpc(
        "increment_product_views",
        {
          p_product_id: productId,
        }
      );

      if (rpcError) {
        console.error("RPC Error:", rpcError);
      } else {
        console.log("RPC Result:", rpcData);
      }

      // Check again after RPC call
      const { data: statsAfterData, error: statsAfterError } = await supabase
        .from("product_stats")
        .select("*")
        .eq("product_id", productId);

      if (statsAfterError) {
        console.error(
          "Error querying product_stats after RPC:",
          statsAfterError
        );
      } else {
        console.log("Product_stats records after RPC:", statsAfterData);
      }

      console.log("=== END DEBUG ===");
    } catch (error) {
      console.error("Debug function error:", error);
    }
  }
}
