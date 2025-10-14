import React from "react";
import { Layout } from "../components/Layout";
import { Breadcrumbs } from "../components/SEO/Breadcrumbs";
import { MetaTags } from "../components/SEO/MetaTags";

export const AffiliateProgramPage: React.FC = () => {
  const breadcrumbItems = [{ label: "Program afiliacyjny", current: true }];

  return (
    <>
      <MetaTags
        title="Program afiliacyjny - FINDLIST"
        description="Program partnerski FINDLIST - zarabiaj na polecaniu viralnych produktów. Transparentne zasady współpracy afiliacyjnej."
        canonical="https://findlist.net/afiliacja"
      />

      <Layout>
        <div className="bg-white border-b border-gray-200 py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Breadcrumbs items={breadcrumbItems} />
          </div>
        </div>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="prose prose-lg max-w-none">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">
              Program afiliacyjny
            </h1>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                1. Informacje ogólne
              </h2>
              <p className="mb-4">
                FINDLIST współpracuje z programami afiliacyjnymi w celu
                zapewnienia użytkownikom najlepszych ofert produktów viralowych.
                Niniejszy dokument wyjaśnia zasady funkcjonowania programu
                partnerskiego i sposób wykorzystywania linków afiliacyjnych.
              </p>
              <p className="mb-4">
                <strong>Administrator:</strong> Kamil Krukowski, Katowice ul.
                Tysiąclecia
                <br />
                <strong>Kontakt:</strong> kamil.krukowski00@gmail.com
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                2. Czym są linki afiliacyjne?
              </h2>
              <p className="mb-4">
                Linki afiliacyjne to specjalne adresy URL, które zawierają
                unikalny identyfikator partnera. Gdy użytkownik dokona zakupu za
                pośrednictwem takiego linku, FINDLIST może otrzymać prowizję od
                sprzedawcy.
              </p>
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                  Ważne informacje
                </h3>
                <ul className="list-disc pl-6 text-blue-800">
                  <li>
                    Korzystanie z linków afiliacyjnych nie wpływa na cenę
                    produktu dla użytkownika
                  </li>
                  <li>Wszystkie linki afiliacyjne są wyraźnie oznaczone</li>
                  <li>
                    Prowizje pomagają nam utrzymywać serwis i rozwijać jego
                    funkcjonalności
                  </li>
                  <li>
                    Rekomendujemy tylko produkty, które faktycznie uznajemy za
                    wartościowe
                  </li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                3. Partnerzy afiliacyjni
              </h2>
              <p className="mb-4">
                FINDLIST współpracuje z następującymi programami partnerskimi:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="border border-gray-200 p-6 rounded-lg hover:shadow-lg transition-shadow">
                  <h4 className="font-semibold text-lg mb-2">AliExpress</h4>
                  <p className="text-gray-600 mb-3">
                    Globalna platforma handlu elektronicznego z Chin
                  </p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Prowizja: 3-8% wartości zakupu</li>
                  </ul>
                </div>

                <div className="border border-gray-200 p-6 rounded-lg hover:shadow-lg transition-shadow">
                  <h4 className="font-semibold text-lg mb-2">Temu</h4>
                  <p className="text-gray-600 mb-3">
                    Szybko rozwijająca się platforma zakupów online
                  </p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Prowizja: 5-12% wartości zakupu</li>
                  </ul>
                </div>

                <div className="border border-gray-200 p-6 rounded-lg hover:shadow-lg transition-shadow">
                  <h4 className="font-semibold text-lg mb-2">
                    Amazon Associates
                  </h4>
                  <p className="text-gray-600 mb-3">
                    Największa platforma e-commerce na świecie
                  </p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Prowizja: 1-10% wartości zakupu</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                4. Jak działają linki afiliacyjne?
              </h2>
              <div className="bg-gray-50 p-6 rounded-lg mb-4">
                <h4 className="font-semibold mb-4">Proces krok po kroku:</h4>
                <ol className="list-decimal pl-6 space-y-2">
                  <li>Użytkownik klika w link afiliacyjny na FINDLIST</li>
                  <li>
                    Zostaje przekierowany do sklepu partnera z naszym
                    identyfikatorem
                  </li>
                  <li>
                    Sklep zapisuje informację o źródle ruchu (cookie/tracking)
                  </li>
                  <li>Użytkownik dokonuje zakupu w określonym czasie</li>
                  <li>Sklep nalicza prowizję dla FINDLIST</li>
                  <li>Prowizja jest wypłacana zgodnie z umową partnerską</li>
                </ol>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                5. Polityka rekomendacji
              </h2>
              <p className="mb-4">
                FINDLIST stosuje się do następujących zasad przy rekomendowaniu
                produktów:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>
                  <strong>Autentyczność:</strong> rekomendujemy tylko produkty,
                  które rzeczywiście uznajemy za wartościowe
                </li>
                <li>
                  <strong>Transparentność:</strong> jasno komunikujemy związki
                  partnerskie
                </li>
                <li>
                  <strong>Jakość:</strong> priorytetowo traktujemy jakość
                  produktu nad wysokością prowizji
                </li>
                <li>
                  <strong>Uczciwość:</strong> prezentujemy zarówno zalety, jak i
                  wady produktów
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                6. Ochrona danych w programie afiliacyjnym
              </h2>
              <p className="mb-4">
                W ramach programu afiliacyjnego przetwarzamy minimalne dane
                niezbędne do:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Śledzenia konwersji (anonimowe identyfikatory)</li>
                <li>Analizy skuteczności kampanii</li>
                <li>Rozliczenia prowizji</li>
                <li>Optymalizacji rekomendacji</li>
              </ul>
              <p className="mb-4">
                Szczegółowe informacje o przetwarzaniu danych znajdują się w
                <a
                  href="/polityka-prywatnosci"
                  className="text-blue-600 hover:text-blue-800"
                >
                  {" "}
                  Polityce prywatności
                </a>
                .
              </p>
            </section>
          </div>
        </main>
      </Layout>
    </>
  );
};
