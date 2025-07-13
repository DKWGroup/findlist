import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, ArrowRight, Siren as Fire, Clock } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { products } from '../data/mockData';

export const TrendingProducts: React.FC = () => {
  // Get trending products
  const trendingProducts = products
    .filter(product => product.isTrending)
    .sort((a, b) => b.popularity.views - a.popularity.views)
    .slice(0, 8);

  // Get newest products
  const newestProducts = products
    .sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime())
    .slice(0, 4);

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
                <h2 className="text-3xl font-bold text-gray-900">Top Trendy Tygodnia</h2>
              </div>
              <p className="text-gray-600">
                Najczęściej oglądane i polecane produkty viralowe z social mediów
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
            {trendingProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
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
                <h2 className="text-3xl font-bold text-gray-900">Najnowsze Odkrycia</h2>
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
            {newestProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
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
                <h4 className="font-semibold text-gray-900 mb-2">🔍 Weryfikujemy każdy produkt</h4>
                <p className="text-gray-600 text-sm">
                  Sprawdzamy jakość, opinie i wiarygodność sprzedawców przed dodaniem do katalogu.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">📱 Śledzimy social media 24/7</h4>
                <p className="text-gray-600 text-sm">
                  Nasze algorytmy monitorują TikToka i Instagrama, aby znaleźć najnowsze trendy.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">💰 Najlepsze ceny i oferty</h4>
                <p className="text-gray-600 text-sm">
                  Porównujemy ceny z różnych sklepów i pokazujemy najkorzystniejsze opcje zakupu.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};