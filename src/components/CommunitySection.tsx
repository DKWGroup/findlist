import {
  ArrowRight,
  Heart,
  MessageSquare,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

export const CommunitySection: React.FC = () => {
  const communityStats = [
    {
      icon: Users,
      label: "Aktywnych użytkowników",
      value: "10,000+",
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: Heart,
      label: "Produktów w wishlistach",
      value: "50,000+",
      color: "bg-red-100 text-red-600",
    },
    {
      icon: Star,
      label: "Wystawionych ocen",
      value: "25,000+",
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      icon: MessageSquare,
      label: "Recenzji społeczności",
      value: "15,000+",
      color: "bg-green-100 text-green-600",
    },
  ];

  const socialFeatures = [
    {
      icon: Heart,
      title: "Twórz Wishlisty",
      description:
        "Zapisuj ulubione produkty i organizuj je w kolekcje. Śledź zmiany cen i dostępność.",
      color: "text-red-600",
    },
    {
      icon: Star,
      title: "Oceniaj i Recenzuj",
      description:
        "Dziel się swoimi opiniami o produktach. Pomóż innym w podejmowaniu lepszych decyzji zakupowych.",
      color: "text-yellow-600",
    },
    {
      icon: Users,
      title: "Dołącz do Społeczności",
      description:
        "Poznaj innych miłośników viralowych produktów. Wymieniaj się opiniami i odkryciami.",
      color: "text-blue-600",
    },
    {
      icon: TrendingUp,
      title: "Bądź Pierwszy",
      description:
        "Otrzymuj powiadomienia o najnowszych trendach i produktach zanim staną się popularne.",
      color: "text-purple-600",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <Users className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Dołącz do Społeczności FINDLIST
            </h2>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Społeczność, która wie, co jest na topie! Odkrywaj trendy, dziel się
            opiniami i bądź pierwszą osobą, która pozna najnowsze viralowe hity.
          </p>
        </div>

        {/* Community Stats */}
        {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {communityStats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100 hover:shadow-lg transition-shadow"
              >
                <div
                  className={`w-12 h-12 ${stat.color} rounded-full flex items-center justify-center mx-auto mb-3`}
                >
                  <IconComponent className="h-6 w-6" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            );
          })}
        </div> */}

        {/* Social Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {socialFeatures.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div
                  className={`w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-4`}
                >
                  <IconComponent className={`h-6 w-6 ${feature.color}`} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg border border-gray-100">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                Gotowy na odkrywanie najlepszych viralowych produktów?
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Dołącz do tysięcy użytkowników, którzy już odkrywają najgorętsze
                trendy z TikToka i Instagrama. Twórz wishlisty, oceniaj produkty
                i bądź częścią społeczności, która wie, co jest warte uwagi!
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/rejestracja"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <Users className="h-5 w-5" />
                  <span>Załóż Darmowe Konto</span>
                </Link>
                <Link
                  to="/produkty"
                  className="bg-white hover:bg-gray-50 text-gray-900 font-semibold px-8 py-3 rounded-xl border-2 border-gray-200 hover:border-blue-300 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <span>Przeglądaj Produkty</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl p-8 text-center">
                <div className="flex justify-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center">
                    <svg
                      className="h-8 w-8 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43V7.83a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-.04-.26z" />
                    </svg>
                  </div>
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                    <svg
                      className="h-8 w-8 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </div>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Śledź nas w social mediach!
                </h4>
                <p className="text-gray-600 text-sm mb-4">
                  Bądź na bieżąco z najnowszymi trendami i produktami
                </p>
                <div className="flex justify-center gap-3">
                  <a
                    href="https://www.tiktok.com/@findlist.net"
                    className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    @findlist.net
                  </a>
                  <a
                    href="https://www.instagram.com/findlistnet"
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    @findlistnet
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
