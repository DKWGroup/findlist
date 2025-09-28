import {
  AlertTriangle,
  ArrowRight,
  CheckCircle,
  Eye,
  Heart,
  Search,
  Shield,
  ShoppingCart,
  Star,
  TrendingUp,
} from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import { Layout } from "../components/Layout";
import { Breadcrumbs } from "../components/SEO/Breadcrumbs";
import { MetaTags } from "../components/SEO/MetaTags";

export const HowItWorksPage: React.FC = () => {
  const breadcrumbItems = [{ label: "Jak to działa", current: true }];

  return (
    <>
      <MetaTags
        title="Jak to działa - FINDLIST | Proces weryfikacji produktów"
        description="Dowiedz się, jak działa FINDLIST - platforma agregująca viralowe produkty z TikToka i Instagrama. Poznaj nasz proces weryfikacji produktów i kryteria oceny."
        canonical="https://findlist.net/jak-to-dziala"
      />

      <Layout>
        <div className="bg-white border-b border-gray-200 py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Breadcrumbs items={breadcrumbItems} />
          </div>
        </div>

        <main>
          {/* Hero Section */}
          <section className="bg-gradient-to-r from-blue-50 to-purple-50 py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-3xl mx-auto">
                <h1 className="text-4xl font-bold text-gray-900 mb-6">
                  Jak działa FINDLIST?
                </h1>
                <p className="text-xl text-gray-600 mb-8">
                  Odkryj, w jaki sposób wybieramy, weryfikujemy i prezentujemy
                  najlepsze viralowe produkty z TikToka i Instagrama.
                </p>
              </div>
            </div>
          </section>

          {/* Process Steps */}
          <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Nasz proces w trzech krokach
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Od odkrycia trendu do bezpiecznego zakupu - tak wygląda droga
                  każdego produktu na FINDLIST.
                </p>
              </div>

              <div className="relative">
                {/* Connection lines for desktop */}
                <div className="hidden lg:block absolute top-24 left-1/2 transform -translate-x-1/2 w-full max-w-4xl">
                  <div className="flex justify-between items-center px-32">
                    <ArrowRight className="h-8 w-8 text-blue-300" />
                    <ArrowRight className="h-8 w-8 text-blue-300" />
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                  <div className="text-center group">
                    <div className="relative mb-6">
                      <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110">
                        <Search className="h-10 w-10 text-white" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                        1
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      Odkrywamy Trendy
                    </h3>
                    <p className="text-gray-600 leading-relaxed max-w-sm mx-auto">
                      Nasze algorytmy skanują TikTok, Instagram i inne platformy
                      w poszukiwaniu viralowych produktów. Monitorujemy
                      hashtagi, analizujemy zasięgi i śledzimy najnowsze trendy
                      24/7.
                    </p>
                  </div>

                  <div className="text-center group">
                    <div className="relative mb-6">
                      <div className="w-20 h-20 bg-green-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110">
                        <Eye className="h-10 w-10 text-white" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold">
                        2
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      Weryfikujemy Jakość
                    </h3>
                    <p className="text-gray-600 leading-relaxed max-w-sm mx-auto">
                      Każdy produkt przechodzi przez proces weryfikacji -
                      sprawdzamy opinie, analizujemy materiały promocyjne i
                      weryfikujemy wiarygodność sprzedawców. Wybrane produkty
                      testujemy osobiście.
                    </p>
                  </div>

                  <div className="text-center group">
                    <div className="relative mb-6">
                      <div className="w-20 h-20 bg-purple-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110">
                        <ShoppingCart className="h-10 w-10 text-white" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-bold">
                        3
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      Kupujesz Bezpiecznie
                    </h3>
                    <p className="text-gray-600 leading-relaxed max-w-sm mx-auto">
                      Przekierowujemy Cię do sprawdzonych sklepów z najlepszymi
                      cenami i warunkami zakupu. Wszystkie linki afiliacyjne są
                      wyraźnie oznaczone, a Ty kupujesz bezpośrednio od
                      sprzedawcy.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Verification Process */}
          <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Nasz proces weryfikacji
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Dowiedz się, jak dokładnie weryfikujemy produkty, aby upewnić
                  się, że spełniają nasze standardy jakości.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-blue-100 p-3 rounded-lg">
                        <Search className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          Analiza popularności
                        </h3>
                        <p className="text-gray-600">
                          Sprawdzamy liczbę wyświetleń, polubień i udostępnień,
                          aby upewnić się, że produkt rzeczywiście jest viralowy
                          i cieszy się zainteresowaniem.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="bg-green-100 p-3 rounded-lg">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          Weryfikacja sprzedawcy
                        </h3>
                        <p className="text-gray-600">
                          Sprawdzamy wiarygodność sprzedawcy, jego oceny,
                          historię i politykę zwrotów, aby upewnić się, że jest
                          godny zaufania.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="bg-yellow-100 p-3 rounded-lg">
                        <Star className="h-6 w-6 text-yellow-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          Analiza recenzji
                        </h3>
                        <p className="text-gray-600">
                          Przeglądamy recenzje produktu z różnych źródeł, aby
                          uzyskać pełny obraz jego zalet i wad. Zwracamy uwagę
                          na autentyczność opinii.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="bg-red-100 p-3 rounded-lg">
                        <AlertTriangle className="h-6 w-6 text-red-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          Wykrywanie scamów
                        </h3>
                        <p className="text-gray-600">
                          Aktywnie identyfikujemy i oznaczamy produkty, które
                          nie spełniają obietnic lub są promowane w nieuczciwy
                          sposób.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">
                    Nasze oznaczenia produktów
                  </h3>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <Shield className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium text-green-900">
                          Zweryfikowany
                        </p>
                        <p className="text-sm text-green-700">
                          Produkt sprawdzony i potwierdzony przez nasz zespół.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-red-600" />
                      <div>
                        <p className="font-medium text-red-900">Trending</p>
                        <p className="text-sm text-red-700">
                          Produkt, który aktualnie zyskuje popularność w social
                          mediach.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                      <Star className="h-5 w-5 text-yellow-600" />
                      <div>
                        <p className="font-medium text-yellow-900">
                          Wysoko oceniany
                        </p>
                        <p className="text-sm text-yellow-700">
                          Produkt z wysokimi ocenami użytkowników (4+ gwiazdek).
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                      <AlertTriangle className="h-5 w-5 text-orange-600" />
                      <div>
                        <p className="font-medium text-orange-900">
                          Scam Alert
                        </p>
                        <p className="text-sm text-orange-700">
                          Produkt, który nie spełnia obietnic lub jest promowany
                          nieuczciwie.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Product Categories */}
          <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Kategorie produktów
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Na FINDLIST znajdziesz viralowe produkty z różnych kategorii,
                  starannie wyselekcjonowane i zorganizowane.
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                <div className="bg-blue-50 rounded-xl p-6 text-center hover:shadow-md transition-shadow">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="h-8 w-8 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900">Elektronika</h3>
                </div>

                <div className="bg-green-50 rounded-xl p-6 text-center hover:shadow-md transition-shadow">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="h-8 w-8 text-green-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900">Dom i ogród</h3>
                </div>

                <div className="bg-purple-50 rounded-xl p-6 text-center hover:shadow-md transition-shadow">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="h-8 w-8 text-purple-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900">Moda</h3>
                </div>

                <div className="bg-pink-50 rounded-xl p-6 text-center hover:shadow-md transition-shadow">
                  <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="h-8 w-8 text-pink-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900">Uroda</h3>
                </div>

                <div className="bg-yellow-50 rounded-xl p-6 text-center hover:shadow-md transition-shadow">
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="h-8 w-8 text-yellow-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900">Rozrywka</h3>
                </div>
              </div>

              <div className="text-center mt-10">
                <Link
                  to="/produkty"
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
                >
                  <span>Zobacz wszystkie kategorie</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-3xl font-bold mb-6">
                Gotowy na odkrywanie najgorętszych trendów?
              </h2>
              <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
                Dołącz do społeczności FINDLIST i bądź na bieżąco z najnowszymi
                viralowymi produktami.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/produkty"
                  className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-xl font-semibold transition-colors"
                >
                  Przeglądaj produkty
                </Link>
                <Link
                  to="/rejestracja"
                  className="bg-transparent hover:bg-white/10 text-white border-2 border-white/30 hover:border-white/50 px-8 py-3 rounded-xl font-semibold transition-colors"
                >
                  Załóż konto
                </Link>
              </div>
            </div>
          </section>
        </main>
      </Layout>
    </>
  );
};
