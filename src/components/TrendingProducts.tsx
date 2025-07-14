import { ArrowRight, Clock, Siren as Fire } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import { useProducts } from "../hooks/useProducts";
import { ProductCard } from "./ProductCard";

export const TrendingProducts: React.FC = () => {
  // Get trending products from database
  const { products: trendingProducts, loading: trendingLoading } = useProducts({
    trending: true,
    limit: 8,
    autoFetch: true,
  });

  // Get newest products from database
  const { products: newestProducts, loading: newestLoading } = useProducts({
    limit: 4,
    autoFetch: true,
  });

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Trending Products */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <Fire className="h-5 w-5 text-red-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">
                  Top Trendy Tygodnia
                </h2>
              </div>
              <p className="text-gray-600">
                Najczęściej oglądane i polecane produkty viralowe z social
                mediów
              </p>
            </div>
            <Link
              to="/produkty?trending=true"
              className="hidden md:flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              <span>Zobacz wszystkie trendy</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {trendingLoading ? (
              // Loading skeleton for trending products
              Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 animate-pulse"
                >
                  <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))
            ) : trendingProducts.length > 0 ? (
              trendingProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500">
                  Brak produktów trending w bazie danych
                </p>
              </div>
            )}
          </div>

          {/* Mobile CTA */}
          <div className="md:hidden text-center">
            <Link
              to="/produkty?trending=true"
              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              <span>Zobacz wszystkie trendy</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Newest Products */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">
                  Najnowsze Odkrycia
                </h2>
              </div>
              <p className="text-gray-600">
                Świeżo dodane produkty, które mogą stać się następnymi hitami
              </p>
            </div>
            <Link
              to="/produkty?sort=newest"
              className="hidden md:flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              <span>Zobacz najnowsze</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {newestLoading ? (
              // Loading skeleton for newest products
              Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 animate-pulse"
                >
                  <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))
            ) : newestProducts.length > 0 ? (
              newestProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500">
                  Brak nowych produktów w bazie danych
                </p>
              </div>
            )}
          </div>

          {/* Mobile CTA */}
          <div className="md:hidden text-center">
            <Link
              to="/produkty?sort=newest"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              <span>Zobacz najnowsze</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* SEO Content */}
        <div className="mt-16 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-8">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Dlaczego VIRALIST to najlepsze miejsce na viralowe produkty?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  🔍 Weryfikujemy każdy produkt
                </h4>
                <p className="text-gray-600 text-sm">
                  Sprawdzamy jakość, opinie i wiarygodność sprzedawców przed
                  dodaniem do katalogu.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  📱 Śledzimy social media 24/7
                </h4>
                <p className="text-gray-600 text-sm">
                  Nasze algorytmy monitorują TikToka i Instagrama, aby znaleźć
                  najnowsze trendy.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  💰 Najlepsze ceny i oferty
                </h4>
                <p className="text-gray-600 text-sm">
                  Porównujemy ceny z różnych sklepów i pokazujemy
                  najkorzystniejsze opcje zakupu.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
