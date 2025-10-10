import {
  ArrowRight,
  Award,
  Heart,
  Search,
  Sparkles,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AdvancedSearchBar } from "./search/AdvancedSearchBar";
import { SearchBar } from "./search/SearchBar";

export const Hero: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query: string) => {
    if (query.trim()) {
      window.location.href = `/szukaj?q=${encodeURIComponent(query)}`;
    }
  };

  const trendingSearches = [
    "gadżety z TikToka",
    "prezenty na Dzień Matki",
    "viralowe kosmetyki",
    "smart home",
    "letnie trendy",
  ];

  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 py-16 lg:py-24 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-20 right-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-20 left-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 px-6 py-3 rounded-full text-sm font-medium mb-8 animate-fade-in border border-blue-200">
            <TrendingUp className="h-4 w-4" />
            <span>Sprawdzamy viralowe hity z TikToka i Instagrama</span>
            <Sparkles className="h-4 w-4" />
          </div>

          {/* Main heading - SEO optimized H1 */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Sprawdzamy <span className="text-blue-600">viralowe hity</span> –
            <br />
            polecamy tylko{" "}
            <span className="text-purple-600">najlepsze produkty</span>
            <br />z social mediów!
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
            Odkryj najgorętsze trendy zakupowe z TikToka i Instagrama!
            Przeglądaj zweryfikowane produkty, czytaj szczere recenzje i kupuj
            przez sprawdzone linki.
            <strong className="text-gray-800">
              {" "}
              Dołącz do społeczności, która wie, co jest na topie!
            </strong>
          </p>

          {/* Search Bar */}
          <div className="max-w-3xl mx-auto mb-8">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-2">
              {/* <AdvancedSearchBar
                onSearch={handleSearch}
                placeholder="Czego szukasz? Viralowe gadżety, prezenty, hity z TikToka..."
                showFilters={false}
                className="w-full"
              /> */}
              <SearchBar
                onSearch={handleSearch}
                placeholder="Czego szukasz? Viralowe gadżety, prezenty, hity z TikToka..."
              />
            </div>

            {/* Trending searches */}
            {/* <div className="mt-4 flex flex-wrap justify-center gap-2">
              <span className="text-sm text-gray-500 mr-2">Popularne:</span>
              {trendingSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => handleSearch(search)}
                  className="text-sm bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-700 px-3 py-1 rounded-full transition-colors"
                >
                  {search}
                </button>
              ))}
            </div> */}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link
              to="/produkty"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1 group"
            >
              <span>Przeglądaj Viralowe Produkty</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/blog"
              className="bg-white hover:bg-gray-50 text-gray-900 font-semibold px-8 py-4 rounded-xl border-2 border-gray-200 hover:border-blue-300 transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg"
            >
              <span>Czytaj Recenzje</span>
            </Link>
          </div>

          {/* Trust indicators */}
          {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto mb-8">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">500+</div>
              <div className="text-sm text-gray-600">Viralowych Produktów</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Award className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">100%</div>
              <div className="text-sm text-gray-600">Zweryfikowane</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">10K+</div>
              <div className="text-sm text-gray-600">Użytkowników</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Star className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">4.8/5</div>
              <div className="text-sm text-gray-600">Średnia Ocena</div>
            </div>
          </div> */}

          {/* Social proof */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 max-w-2xl mx-auto border border-gray-100">
            <p className="text-gray-700 mb-4">
              <strong>Dołącz do społeczności</strong> która odkrywa najlepsze
              viralowe produkty przed wszystkimi!
            </p>
            <div className="flex justify-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Heart className="h-4 w-4 text-red-500" />
                <span>Twórz wishlisty</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Star className="h-4 w-4 text-yellow-500" />
                <span>Oceniaj produkty</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="h-4 w-4 text-blue-500" />
                <span>Dziel się opiniami</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
