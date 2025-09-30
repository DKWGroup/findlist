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

        {/* Social Proof / Community */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Dołącz do naszej społeczności
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                Obserwuj nas na social mediach, aby być na bieżąco z najnowszymi
                trendami i dodatkowymi treściami!
              </p>
              <div className="flex justify-center gap-6">
                <a
                  href="https://www.tiktok.com/@findlist.net"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-black text-white p-4 rounded-full hover:bg-gray-800 transition-colors"
                  title="TikTok"
                >
                  <svg
                    className="h-7 w-7"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"></path>
                  </svg>
                </a>
                <a
                  href="https://www.instagram.com/findlistnet"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-full hover:opacity-90 transition-opacity"
                  title="Instagram"
                >
                  <svg
                    className="h-7 w-7"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};
