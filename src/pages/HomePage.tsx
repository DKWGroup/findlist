import React, { useEffect, useMemo, useState } from "react";
import { CategoryNav } from "../components/CategoryNav";
import { FilterBar } from "../components/FilterBar";
import { Header } from "../components/Header";
import { ProductGrid } from "../components/ProductGrid";
import SEOHead from "../components/SEO/SEOHead";
import {
  generateOrganizationSchema,
  generateWebSiteSchema,
} from "../components/SEO/SchemaMarkup";
import { useProducts } from "../hooks/useProducts";

export const HomePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("popularity");
  const [showTrendingOnly, setShowTrendingOnly] = useState(false);

  // Use the products hook with search and filtering options
  const { products, loading, error, loadProducts } = useProducts({
    search: searchQuery.trim() || undefined,
    category: selectedCategory || undefined,
    trending: showTrendingOnly || undefined,
    autoFetch: true,
  });

  // Reload products when filters change
  useEffect(() => {
    loadProducts({
      search: searchQuery.trim() || undefined,
      category: selectedCategory || undefined,
      trending: showTrendingOnly || undefined,
    });
  }, [searchQuery, selectedCategory, showTrendingOnly, loadProducts]);

  const filteredAndSortedProducts = useMemo(() => {
    if (!products.length) return [];

    let filtered = [...products];

    // Client-side sorting (since backend doesn't handle all sort options yet)
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "popularity":
          return b.popularity.views - a.popularity.views;
        case "newest":
          return (
            new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
          );
        case "rating":
          return b.ratings.average - a.ratings.average;
        case "price-low":
          const priceA = a.price.discounted || a.price.original || 0;
          const priceB = b.price.discounted || b.price.original || 0;
          return priceA - priceB;
        case "price-high":
          const priceA2 = a.price.discounted || a.price.original || 0;
          const priceB2 = b.price.discounted || b.price.original || 0;
          return priceB2 - priceA2;
        default:
          return 0;
      }
    });

    return filtered;
  }, [products, sortBy]);

  const organizationSchema = generateOrganizationSchema();
  const websiteSchema = generateWebSiteSchema();

  const combinedSchema = {
    "@context": "https://schema.org",
    "@graph": [organizationSchema, websiteSchema],
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-red-600">
            <h2 className="text-xl font-semibold mb-2">
              Błąd ładowania produktów
            </h2>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEOHead
        title="FINDLIST – Najlepsze viralowe produkty z TikToka i Instagrama"
        description="Odkryj najgorętsze trendy zakupowe z TikToka i Instagrama! FINDLIST to katalog viralowych produktów, recenzji i inspiracji. Przeglądaj, oceniaj, twórz wishlisty."
        keywords="viralowe produkty, TikTok, Instagram, trendy zakupowe, gadżety, prezenty, recenzje produktów, wishlist, social media shopping, viral shopping"
        canonicalUrl="https://findlist.net/"
        structuredData={combinedSchema}
      />
      <div className="min-h-screen bg-gray-50">
        <Header onSearch={setSearchQuery} />

        <CategoryNav
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
        />

        <main className="container mx-auto px-4 py-6">
          <FilterBar
            sortBy={sortBy}
            onSortChange={setSortBy}
            showTrendingOnly={showTrendingOnly}
            onTrendingToggle={() => setShowTrendingOnly(!showTrendingOnly)}
          />

          {/* Search Results Summary */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {searchQuery ? `Wyniki dla "${searchQuery}"` : "Viralne Produkty"}
            </h1>
            <p className="text-gray-600">
              {loading
                ? "Ładowanie..."
                : `Znaleziono ${filteredAndSortedProducts.length} produktów`}
              {selectedCategory && ` w kategorii`}
              {showTrendingOnly && ` (tylko trendy)`}
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Ładowanie produktów...</p>
            </div>
          ) : (
            <ProductGrid
              products={filteredAndSortedProducts}
              loading={loading}
            />
          )}
        </main>
      </div>
    </>
  );
};
