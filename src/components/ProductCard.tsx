import {
  Badge,
  ExternalLink,
  Eye,
  Hash,
  Heart,
  Share2,
  Star,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSimplifiedAuthContext } from "../contexts/SimplifiedAuthContext";
import {
  ProductStats,
  ProductStatsService,
} from "../services/productStatsService";
import { supabase } from "../services/supabaseStorage";
import { Product } from "../types";
import { LazyImage } from "./Performance/LazyImage";

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  // Safe auth hook usage with error handling
  let user: any = null;
  let toggleWishlist = async (productId: string) => {
    if (!user?.id) {
      console.log("No user found for wishlist toggle");
      return false;
    }

    try {
      console.log(
        "Toggling wishlist for product:",
        productId,
        "user:",
        user.id
      );

      // Use the toggle_wishlist function with correct parameter names
      const { data, error } = await supabase.rpc("toggle_wishlist", {
        p_product_id: productId,
        p_user_id: user.id,
      });

      if (error) {
        console.error("Error in toggle_wishlist RPC:", error);
        throw error;
      }

      console.log("Wishlist toggle result:", data);
      return data;
    } catch (error) {
      console.error("Error toggling wishlist:", error);
      return false;
    }
  };

  try {
    const auth = useSimplifiedAuthContext();
    user = auth.user;
  } catch (error) {
    // AuthProvider not ready yet, use defaults
    console.warn("AuthProvider not ready in ProductCard, using defaults");
  }

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [productStats, setProductStats] = useState<ProductStats | null>(null);

  // Load product statistics
  useEffect(() => {
    const loadProductStats = async () => {
      try {
        const stats = await ProductStatsService.getProductStats(product.id);
        if (stats) {
          setProductStats(stats);
        }
      } catch (error) {
        console.error("Error loading product stats:", error);
      }
    };

    loadProductStats();
  }, [product.id, user]);

  // Check if product is in user's wishlist
  useEffect(() => {
    const checkWishlistStatus = async () => {
      if (user?.id) {
        try {
          console.log(
            "Checking wishlist status for user:",
            user.id,
            "product:",
            product.id
          );

          // Check wishlist status using the same approach as ProductStatsService
          const { data, error } = await supabase
            .from("profiles")
            .select("wishlist")
            .eq("id", user.id)
            .single();

          if (error) {
            console.error("Error checking wishlist:", error);
            return;
          }

          console.log("User wishlist data:", data);

          if (data?.wishlist) {
            const wishlist = Array.isArray(data.wishlist) ? data.wishlist : [];
            const isInWishlist = wishlist.includes(product.id);
            console.log(
              "Product in wishlist:",
              isInWishlist,
              "wishlist:",
              wishlist
            );
            setIsInWishlist(isInWishlist);
          } else {
            console.log("No wishlist found for user");
            setIsInWishlist(false);
          }
        } catch (error) {
          console.error("Error in checkWishlistStatus:", error);
        }
      } else {
        console.log("No user logged in");
        setIsInWishlist(false);
      }
    };

    checkWishlistStatus();
  }, [user?.id, product.id]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const calculateDiscount = () => {
    if (product.price.original && product.price.discounted) {
      return Math.round(
        ((product.price.original - product.price.discounted) /
          product.price.original) *
          100
      );
    }
    return 0;
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const productUrl = product.urlAlias
      ? `${window.location.origin}/${product.urlAlias}`
      : `${window.location.origin}/product/${product.id}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: product.title,
          text: product.description,
          url: productUrl,
        });
      } catch (error) {
        console.log("Sharing failed:", error);
      }
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(productUrl);
    }
  };

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (user?.id) {
      try {
        const result = await toggleWishlist(product.id);
        if (result !== null && typeof result === "boolean") {
          // Update local state based on the result
          setIsInWishlist(result);
        } else {
          // If result is not clear, refresh the wishlist status
          const { data, error } = await supabase
            .from("profiles")
            .select("wishlist")
            .eq("id", user.id)
            .single();

          if (!error && data?.wishlist) {
            const wishlist = Array.isArray(data.wishlist) ? data.wishlist : [];
            setIsInWishlist(wishlist.includes(product.id));
          }
        }
      } catch (error) {
        console.error("Error in handleWishlistToggle:", error);
      }
    }
  };

  const handleCardClick = () => {
    // Increment views when card is clicked
    ProductStatsService.incrementViews(product.id);
  };

  // Use real stats or fallback to product data
  const displayStats = productStats || {
    views: product.popularity.views,
    likes: product.popularity.likes,
    shares: product.popularity.shares,
    rating_average: product.ratings.average,
    rating_count: product.ratings.count,
  };

  const productUrl = product.urlAlias
    ? `/${product.urlAlias}`
    : `/product/${product.id}`;

  return (
    <article className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group">
      {/* Image Section */}
      <div className="relative aspect-square overflow-hidden">
        <Link
          to={productUrl}
          onClick={handleCardClick}
          className="block relative w-full h-full"
          onMouseEnter={() =>
            product.images?.length > 1 && setCurrentImageIndex(1)
          }
          onMouseLeave={() => setCurrentImageIndex(0)}
        >
          <LazyImage
            src={
              product.images?.[currentImageIndex] ||
              product.images?.[0] ||
              "/images/placeholder-product.jpg"
            }
            alt={product.title}
            className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
            width={400}
            height={400}
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.isTrending && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                🔥 TREND
              </span>
            )}
            {product.isVerified && (
              <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                <Badge className="h-3 w-3" />
                ZWERYFIKOWANY
              </span>
            )}
            {calculateDiscount() > 0 && (
              <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                -{calculateDiscount()}%
              </span>
            )}
          </div>

          {/* Product Code */}
          {product.code && (
            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded px-2 py-1">
              <div className="flex items-center gap-1">
                <Hash className="h-3 w-3 text-gray-600" />
                <span className="text-xs font-mono font-medium text-gray-800">
                  {product.code}
                </span>
              </div>
            </div>
          )}
        </Link>

        {/* Buttons outside Link to prevent nesting issues */}
        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className="absolute bottom-3 right-3 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-200 group/heart z-10"
          aria-label={isInWishlist ? "Usuń z wishlist" : "Dodaj do wishlist"}
        >
          <Heart
            className={`h-5 w-5 transition-colors duration-200 group-hover/heart:scale-110 ${
              isInWishlist
                ? "fill-red-500 text-red-500"
                : "text-gray-400 hover:text-red-500"
            }`}
          />
        </button>

        {/* Quick Actions */}
        <div className="absolute bottom-3 left-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
          <button
            onClick={handleShare}
            className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:shadow-lg transition-all duration-200"
            aria-label="Udostępnij produkt"
          >
            <Share2 className="h-4 w-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4">
        {/* Title */}
        <Link to={productUrl} onClick={handleCardClick}>
          <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-2 hover:text-blue-600 transition-colors">
            {product.title}
          </h3>
        </Link>

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          {product.price.discounted && (
            <span className="text-lg font-bold text-blue-600">
              {product.price.discounted.toFixed(2)} {product.price.currency}
            </span>
          )}
          {product.price.original && product.price.discounted && (
            <span className="text-sm text-gray-500 line-through">
              {product.price.original.toFixed(2)} {product.price.currency}
            </span>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
          <div className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            <span>{formatNumber(displayStats.views)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span>{displayStats.rating_average.toFixed(1)}</span>
            <span>({displayStats.rating_count})</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {product.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* CTA Button */}
        <Link
          to={productUrl}
          onClick={handleCardClick}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 group/cta"
        >
          <span>Zobacz produkt</span>
          <ExternalLink className="h-4 w-4 group-hover/cta:translate-x-1 transition-transform duration-200" />
        </Link>
      </div>
    </article>
  );
};
