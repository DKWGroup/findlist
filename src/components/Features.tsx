import {
  Award,
  CheckCircle,
  Globe,
  Heart,
  Search,
  Shield,
  Star,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import React from "react";

export const Features: React.FC = () => {
  const features = [
    {
      icon: TrendingUp,
      title: "Najgorętsze Trendy",
      description:
        "Śledzimy TikTok, Instagram i inne platformy, aby znaleźć produkty zanim staną się popularne.",
      color: "bg-red-100 text-red-600",
    },
    {
      icon: Shield,
      title: "Zweryfikowane Produkty",
      description:
        "Każdy produkt jest sprawdzany pod kątem jakości i wiarygodności sprzedawcy.",
      color: "bg-green-100 text-green-600",
    },
    {
      icon: Search,
      title: "Inteligentne Wyszukiwanie",
      description:
        "Zaawansowane filtry i wyszukiwarka semantyczna pomagają znaleźć dokładnie to, czego szukasz.",
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: Star,
      title: "Szczere Recenzje",
      description:
        "Sprawdź opinie innych użytkowników i podziel się swoimi doświadczeniami z produktami.",
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      icon: Globe,
      title: "Najlepsze Ceny",
      description:
        "Porównujemy ceny z Temu, AliExpress, Amazon i innych sklepów online.",
      color: "bg-indigo-100 text-indigo-600",
    },
    {
      icon: Heart,
      title: "Wishlisty i Ulubione",
      description:
        "Zapisuj produkty na później i twórz własne kolekcje ulubionych przedmiotów.",
      color: "bg-pink-100 text-pink-600",
    },
    {
      icon: Zap,
      title: "Błyskawiczne Aktualizacje",
      description:
        "Nowe produkty i trendy pojawiają się na platformie w czasie rzeczywistym.",
      color: "bg-purple-100 text-purple-600",
    },
    {
      icon: Users,
      title: "Społeczność",
      description:
        "Dołącz do tysięcy użytkowników dzielących się swoimi odkryciami i opiniami.",
      color: "bg-teal-100 text-teal-600",
    },
  ];

  const trustIndicators = [
    { icon: Award, text: "100% zweryfikowane produkty" },
    { icon: CheckCircle, text: "Sprawdzone linki afiliacyjne" },
    { icon: Shield, text: "Bezpieczne zakupy" },
    { icon: Users, text: "10,000+ zadowolonych użytkowników" },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Dlaczego FINDLIST to najlepszy wybór?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Nasza platforma łączy w sobie najlepsze funkcje social commerce z
            inteligentnym wyszukiwaniem produktów
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={index}
                className="group p-6 bg-white rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2"
              >
                <div
                  className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}
                >
                  <IconComponent className="h-6 w-6" />
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

        {/* Trust Indicators */}
        {/* <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-100">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Zaufało nam już ponad 10,000 użytkowników
            </h3>
            <p className="text-gray-600">
              Dołącz do grona zadowolonych użytkowników, którzy odkrywają najlepsze viralowe produkty
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {trustIndicators.map((indicator, index) => {
              const IconComponent = indicator.icon;
              return (
                <div key={index} className="flex items-center gap-3 bg-white rounded-lg p-4 shadow-sm">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <IconComponent className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-900">{indicator.text}</span>
                </div>
              );
            })}
          </div>
        </div> */}

        {/* SEO Content */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="bg-gray-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Jak działamy? Proces weryfikacji produktów FINDLIST
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    1
                  </span>
                  Monitorowanie social mediów
                </h4>
                <p className="text-gray-600 text-sm mb-4">
                  Nasze algorytmy 24/7 skanują TikToka, Instagrama i inne
                  platformy w poszukiwaniu viralowych produktów.
                </p>

                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    2
                  </span>
                  Weryfikacja jakości
                </h4>
                <p className="text-gray-600 text-sm">
                  Sprawdzamy opinie, analizujemy materiały promocyjne i
                  weryfikujemy wiarygodność sprzedawców.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    3
                  </span>
                  Testowanie produktów
                </h4>
                <p className="text-gray-600 text-sm mb-4">
                  Wybrane produkty testujemy osobiście, aby sprawdzić czy
                  spełniają obietnice z reklam.
                </p>

                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    4
                  </span>
                  Publikacja recenzji
                </h4>
                <p className="text-gray-600 text-sm">
                  Tworzymy szczegółowe recenzje z oceną każdego aspektu produktu
                  i rekomendacjami zakupu.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
