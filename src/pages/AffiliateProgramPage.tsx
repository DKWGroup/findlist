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
        canonical="https://findlist.pl/afiliacja"
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

            <p className="text-gray-600 mb-8">
              <strong>Data wejścia w życie:</strong> 13 lipca 2025
            </p>

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
                <strong>Administrator:</strong> [Nazwa podmiotu], NIP: [Numer
                NIP]
                <br />
                <strong>Kontakt:</strong> afiliacja@findlist.pl
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="border border-gray-200 p-6 rounded-lg">
                  <h4 className="font-semibold text-lg mb-2">
                    Amazon Associates
                  </h4>
                  <p className="text-gray-600 mb-3">
                    Największa platforma e-commerce na świecie
                  </p>
                  <ul className="text-sm text-gray-600">
                    <li>• Prowizja: 1-10% wartości zakupu</li>
                    <li>• Czas na decyzję: 24 godziny</li>
                    <li>• Oznaczenie: "Partner Amazon"</li>
                  </ul>
                </div>

                <div className="border border-gray-200 p-6 rounded-lg">
                  <h4 className="font-semibold text-lg mb-2">AliExpress</h4>
                  <p className="text-gray-600 mb-3">
                    Globalna platforma handlu elektronicznego
                  </p>
                  <ul className="text-sm text-gray-600">
                    <li>• Prowizja: 3-8% wartości zakupu</li>
                    <li>• Czas na decyzję: 15 dni</li>
                    <li>• Oznaczenie: "Partner AliExpress"</li>
                  </ul>
                </div>

                <div className="border border-gray-200 p-6 rounded-lg">
                  <h4 className="font-semibold text-lg mb-2">Allegro</h4>
                  <p className="text-gray-600 mb-3">
                    Największa platforma e-commerce w Polsce
                  </p>
                  <ul className="text-sm text-gray-600">
                    <li>• Prowizja: 2-6% wartości zakupu</li>
                    <li>• Czas na decyzję: 30 dni</li>
                    <li>• Oznaczenie: "Partner Allegro"</li>
                  </ul>
                </div>

                <div className="border border-gray-200 p-6 rounded-lg">
                  <h4 className="font-semibold text-lg mb-2">Inne sklepy</h4>
                  <p className="text-gray-600 mb-3">
                    Współpraca z wyspecjalizowanymi sklepami
                  </p>
                  <ul className="text-sm text-gray-600">
                    <li>• Prowizja: zmienna</li>
                    <li>• Czas na decyzję: zmienny</li>
                    <li>• Oznaczenie: "Link partnerski"</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                4. Oznaczanie linków afiliacyjnych
              </h2>
              <p className="mb-4">
                Zgodnie z wymogami prawnymi i dobrymi praktykami, wszystkie
                linki afiliacyjne są wyraźnie oznaczone:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>
                  <strong>Ikony partnerów:</strong> widoczne logo sklepu
                  partnera
                </li>
                <li>
                  <strong>Oznaczenia tekstowe:</strong> "Link partnerski",
                  "Reklama", "Sponsorowane"
                </li>
                <li>
                  <strong>Kolory:</strong> wyróżnienie kolorystyczne
                  przycisku/linku
                </li>
                <li>
                  <strong>Tooltips:</strong> dodatkowe informacje po najechaniu
                  myszką
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                5. Jak działają linki afiliacyjne?
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
                6. Polityka rekomendacji
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
                <li>
                  <strong>Aktualność:</strong> regularnie sprawdzamy dostępność
                  i ceny produktów
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                7. Prawa użytkowników
              </h2>
              <p className="mb-4">Jako użytkownik masz prawo do:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Pełnej informacji o charakterze linku przed kliknięciem</li>
                <li>Wyboru między linkami afiliacyjnymi a bezpośrednimi</li>
                <li>Dostępu do alternatywnych źródeł zakupu</li>
                <li>Informacji o wysokości prowizji (na żądanie)</li>
                <li>Rezygnacji z linków afiliacyjnych w ustawieniach konta</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                8. Ochrona danych w programie afiliacyjnym
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

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                9. Dołącz do programu partnerskiego
              </h2>
              <p className="mb-4">
                Jesteś właścicielem sklepu internetowego lub platformy
                e-commerce? Rozważ współpracę z FINDLIST:
              </p>
              <div className="bg-green-50 p-6 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-2">
                  Korzyści dla partnerów:
                </h4>
                <ul className="list-disc pl-6 text-green-800">
                  <li>Dostęp do wysoko zaangażowanej społeczności</li>
                  <li>Zwiększenie widoczności produktów</li>
                  <li>Profesjonalna prezentacja oferty</li>
                  <li>Szczegółowe raportowanie sprzedaży</li>
                  <li>Transparentne rozliczenia</li>
                </ul>
                <p className="mt-4 text-green-800">
                  <strong>Kontakt:</strong> partnerzy@findlist.pl
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                10. Zmiany w programie
              </h2>
              <p className="mb-4">
                FINDLIST zastrzega sobie prawo do wprowadzania zmian w programie
                afiliacyjnym, w tym:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Dodawania nowych partnerów</li>
                <li>Modyfikacji sposób oznaczania linków</li>
                <li>Zmiany polityki rekomendacji</li>
                <li>Aktualizacji warunków współpracy</li>
              </ul>
              <p className="mb-4">
                O istotnych zmianach będziemy informować użytkowników za
                pośrednictwem serwisu.
              </p>
            </section>

            <div className="bg-gray-50 p-6 rounded-lg mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Pytania i kontakt
              </h3>
              <p className="text-gray-600 mb-2">
                Jeśli masz pytania dotyczące programu afiliacyjnego lub chcesz
                rozpocząć współpracę:
              </p>
              <ul className="text-gray-600">
                <li>
                  <strong>E-mail ogólny:</strong> afiliacja@findlist.pl
                </li>
                <li>
                  <strong>Dla partnerów:</strong> partnerzy@findlist.pl
                </li>
                <li>
                  <strong>Dla użytkowników:</strong> kontakt@findlist.pl
                </li>
              </ul>
            </div>
          </div>
        </main>
      </Layout>
    </>
  );
};
