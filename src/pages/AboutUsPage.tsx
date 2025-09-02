import {
  Award,
  Clock,
  ExternalLink,
  Heart,
  Mail,
  MapPin,
  Phone,
  Users,
} from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import { Layout } from "../components/Layout";
import { Breadcrumbs } from "../components/SEO/Breadcrumbs";
import { MetaTags } from "../components/SEO/MetaTags";

export const AboutUsPage: React.FC = () => {
  const breadcrumbItems = [{ label: "O nas", current: true }];

  const teamMembers = [
    {
      name: "Karol Wolny",
      role: "CEO & Founder",
      bio: "Pasjonat social mediów i e-commerce. Wierzy, że viralowe produkty mogą zmienić sposób, w jaki kupujemy.",
      image: "/images/Karol-Wolny.webp",
    },
    {
      name: "Kamil Krukowski",
      role: "CTO & Marketing",
      bio: "Specjalista od technologii webowych i aplikacji mobilnych. Uwielbia tworzyć innowacyjne rozwiązania.",
      image: "/images/Kamil-Krukowski.webp",
    },
  ];

  return (
    <>
      <MetaTags
        title="O nas - FINDLIST | Poznaj nasz zespół i misję"
        description="Poznaj zespół FINDLIST - pierwszej w Polsce platformy agregującej viralowe produkty z TikToka i Instagrama. Dowiedz się więcej o naszej misji i wartościach."
        canonical="https://findlist.net/o-nas"
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
                  Poznaj zespół FINDLIST
                </h1>
                <p className="text-xl text-gray-600 mb-8">
                  Jesteśmy grupą pasjonatów social mediów, e-commerce i nowych
                  technologii, którzy połączyli siły, aby stworzyć pierwszą w
                  Polsce platformę agregującą viralowe produkty z TikToka i
                  Instagrama.
                </p>
              </div>
            </div>
          </section>

          {/* Our Mission */}
          <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">
                    Nasza misja
                  </h2>
                  <p className="text-lg text-gray-600 mb-6">
                    W FINDLIST wierzymy, że odkrywanie najnowszych trendów i
                    produktów powinno być łatwe, przyjemne i bezpieczne. Naszą
                    misją jest:
                  </p>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <div className="mt-1 bg-blue-100 p-1 rounded-full">
                        <Award className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          Weryfikacja jakości
                        </p>
                        <p className="text-gray-600">
                          Sprawdzamy każdy produkt, aby upewnić się, że spełnia
                          obietnice z reklam.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="mt-1 bg-green-100 p-1 rounded-full">
                        <Clock className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          Oszczędność czasu
                        </p>
                        <p className="text-gray-600">
                          Agregujemy najlepsze produkty w jednym miejscu, abyś
                          nie musiał przeszukiwać całego internetu.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="mt-1 bg-purple-100 p-1 rounded-full">
                        <Heart className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          Budowanie społeczności
                        </p>
                        <p className="text-gray-600">
                          Tworzymy miejsce, gdzie pasjonaci nowych trendów mogą
                          dzielić się opiniami i odkryciami.
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
                <div className="relative">
                  <img
                    src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800"
                    alt="Zespół FINDLIST podczas pracy"
                    className="rounded-xl shadow-lg"
                  />
                  <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-lg shadow-lg">
                    <p className="font-bold text-blue-600">Od 2023 roku</p>
                    <p className="text-gray-600">Pomagamy odkrywać trendy</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Our Team */}
          <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Poznaj nasz zespół
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Za FINDLIST stoi zespół pasjonatów, którzy codziennie pracują
                  nad tym, aby dostarczać Ci najlepsze viralowe produkty i
                  treści.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
                {teamMembers.map((member, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-64 object-cover"
                    />
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {member.name}
                      </h3>
                      <p className="text-blue-600 font-medium mb-3">
                        {member.role}
                      </p>
                      <p className="text-gray-600">{member.bio}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Our Values */}
          <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Nasze wartości
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  W FINDLIST kierujemy się wartościami, które pomagają nam
                  tworzyć platformę godną zaufania naszych użytkowników.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-blue-50 rounded-xl p-8">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <Award className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Jakość
                  </h3>
                  <p className="text-gray-600">
                    Stawiamy na jakość ponad ilość. Każdy produkt jest
                    weryfikowany przez nasz zespół, aby upewnić się, że spełnia
                    nasze standardy.
                  </p>
                </div>

                <div className="bg-green-50 rounded-xl p-8">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Transparentność
                  </h3>
                  <p className="text-gray-600">
                    Zawsze jasno komunikujemy, które produkty zostały przez nas
                    przetestowane, a które są polecane na podstawie opinii
                    społeczności.
                  </p>
                </div>

                <div className="bg-purple-50 rounded-xl p-8">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                    <Heart className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Społeczność
                  </h3>
                  <p className="text-gray-600">
                    Wierzymy w siłę społeczności. Opinie i recenzje naszych
                    użytkowników są dla nas niezwykle cenne i pomagają innym w
                    podejmowaniu decyzji.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Join Us */}
          <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-3xl font-bold mb-6">
                Dołącz do społeczności FINDLIST
              </h2>
              <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
                Odkrywaj najnowsze trendy, dziel się opiniami i bądź na bieżąco
                z viralowymi produktami z całego świata.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/rejestracja"
                  className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-xl font-semibold transition-colors"
                >
                  Załóż konto
                </Link>
                <Link
                  to="/kontakt"
                  className="bg-transparent hover:bg-white/10 text-white border-2 border-white/30 hover:border-white/50 px-8 py-3 rounded-xl font-semibold transition-colors"
                >
                  Skontaktuj się z nami
                </Link>
              </div>
            </div>
          </section>
        </main>
      </Layout>
    </>
  );
};
