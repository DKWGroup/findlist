import React from "react";
import { Layout } from "../components/Layout";
import { Breadcrumbs } from "../components/SEO/Breadcrumbs";
import { MetaTags } from "../components/SEO/MetaTags";

export const CookiePolicyPage: React.FC = () => {
  const breadcrumbItems = [{ label: "Polityka cookies", current: true }];

  return (
    <>
      <MetaTags
        title="Polityka cookies - VIRALIST"
        description="Polityka cookies serwisu VIRALIST - informacje o wykorzystywanych plikach cookies i technologiach śledzących."
        canonical="https://viralist.pl/cookies"
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
              Polityka cookies
            </h1>

            <p className="text-gray-600 mb-8">
              <strong>Data wejścia w życie:</strong> 13 lipca 2025
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                1. Czym są pliki cookies?
              </h2>
              <p className="mb-4">
                Pliki cookies to małe pliki tekstowe zapisywane na urządzeniu
                użytkownika podczas korzystania z serwisu internetowego.
                Zawierają informacje o aktywności użytkownika i jego
                preferencjach.
              </p>
              <p className="mb-4">
                Podobną funkcję pełnią inne technologie, takie jak:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Local Storage</li>
                <li>Session Storage</li>
                <li>Web beacons</li>
                <li>Piksele śledzące</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                2. Jak wykorzystujemy cookies?
              </h2>
              <p className="mb-4">
                W serwisie VIRALIST wykorzystujemy pliki cookies w celu:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Zapewnienia prawidłowego funkcjonowania serwisu</li>
                <li>Zapamiętywania preferencji użytkownika</li>
                <li>Analizy ruchu na stronie</li>
                <li>Personalizacji treści i reklam</li>
                <li>Optymalizacji wydajności serwisu</li>
                <li>Zapewnienia bezpieczeństwa</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                3. Rodzaje wykorzystywanych cookies
              </h2>

              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Cookies niezbędne
                </h3>
                <p className="mb-4">
                  Te pliki cookies są niezbędne do prawidłowego funkcjonowania
                  serwisu i nie można ich wyłączyć.
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <ul className="list-disc pl-6">
                    <li>
                      <strong>Sesja użytkownika:</strong> przechowywanie
                      informacji o zalogowaniu
                    </li>
                    <li>
                      <strong>Preferencje:</strong> język, motyw, ustawienia
                      wyświetlania
                    </li>
                    <li>
                      <strong>Bezpieczeństwo:</strong> ochrona przed atakami
                      CSRF
                    </li>
                    <li>
                      <strong>Funkcjonalność:</strong> koszyk, ulubione produkty
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Cookies analityczne
                </h3>
                <p className="mb-4">
                  Pomagają nam zrozumieć, jak użytkownicy korzystają z serwisu,
                  co pozwala na jego ulepszanie.
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <ul className="list-disc pl-6">
                    <li>
                      <strong>Google Analytics:</strong> analiza ruchu i
                      zachowań użytkowników
                    </li>
                    <li>
                      <strong>Statystyki:</strong> liczba odwiedzin, czas
                      spędzony na stronie
                    </li>
                    <li>
                      <strong>Wydajność:</strong> monitoring szybkości ładowania
                      strony
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Cookies marketingowe
                </h3>
                <p className="mb-4">
                  Wykorzystywane do wyświetlania spersonalizowanych reklam i
                  treści.
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <ul className="list-disc pl-6">
                    <li>
                      <strong>Retargeting:</strong> wyświetlanie reklam na
                      innych stronach
                    </li>
                    <li>
                      <strong>Personalizacja:</strong> dopasowanie treści do
                      zainteresowań
                    </li>
                    <li>
                      <strong>Afiliacja:</strong> śledzenie konwersji z linków
                      partnerskich
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Cookies społecznościowe
                </h3>
                <p className="mb-4">
                  Umożliwiają integrację z mediami społecznościowymi.
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <ul className="list-disc pl-6">
                    <li>
                      <strong>Facebook:</strong> przyciski udostępniania,
                      logowanie przez Facebook
                    </li>
                    <li>
                      <strong>Instagram:</strong> osadzanie postów
                    </li>
                    <li>
                      <strong>TikTok:</strong> integracja z treściami
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                4. Czas przechowywania cookies
              </h2>
              <p className="mb-4">
                Pliki cookies przechowujemy przez różne okresy:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>
                  <strong>Cookies sesyjne:</strong> usuwane po zamknięciu
                  przeglądarki
                </li>
                <li>
                  <strong>Cookies krótkoterminowe:</strong> od kilku godzin do
                  kilku dni
                </li>
                <li>
                  <strong>Cookies długoterminowe:</strong> do 2 lat (z
                  możliwością przedłużenia)
                </li>
                <li>
                  <strong>Cookies analityczne:</strong> do 26 miesięcy
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                5. Cookies stron trzecich
              </h2>
              <p className="mb-4">
                Nasz serwis może wykorzystywać cookies pochodzące od
                następujących dostawców:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Google Analytics</h4>
                  <p className="text-sm text-gray-600">
                    Analiza ruchu i zachowań użytkowników
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Google Ads</h4>
                  <p className="text-sm text-gray-600">
                    Remarketing i optymalizacja reklam
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Facebook Pixel</h4>
                  <p className="text-sm text-gray-600">
                    Śledzenie konwersji i retargeting
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">YouTube</h4>
                  <p className="text-sm text-gray-600">
                    Osadzanie filmów promocyjnych
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                6. Zarządzanie cookies
              </h2>
              <p className="mb-4">
                Masz pełną kontrolę nad plikami cookies. Możesz:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Zaakceptować wszystkie cookies</li>
                <li>Odrzucić cookies opcjonalne</li>
                <li>Dostosować ustawienia według kategorii</li>
                <li>Zmienić ustawienia w dowolnym momencie</li>
              </ul>

              <div className="bg-blue-50 p-6 rounded-lg mb-4">
                <h4 className="font-semibold text-blue-900 mb-2">
                  Zarządzanie w przeglądarce
                </h4>
                <p className="text-blue-800 mb-2">
                  Możesz również zarządzać cookies bezpośrednio w ustawieniach
                  przeglądarki:
                </p>
                <ul className="list-disc pl-6 text-blue-800">
                  <li>
                    <strong>Chrome:</strong> Ustawienia → Prywatność i
                    bezpieczeństwo → Pliki cookie
                  </li>
                  <li>
                    <strong>Firefox:</strong> Ustawienia → Prywatność i
                    bezpieczeństwo
                  </li>
                  <li>
                    <strong>Safari:</strong> Preferencje → Prywatność
                  </li>
                  <li>
                    <strong>Edge:</strong> Ustawienia → Pliki cookie i
                    uprawnienia witryny
                  </li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                7. Wpływ na funkcjonalność
              </h2>
              <p className="mb-4">
                Wyłączenie niektórych kategorii cookies może wpłynąć na
                funkcjonalność serwisu:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>
                  <strong>Cookies niezbędne:</strong> brak możliwości logowania,
                  utrata preferencji
                </li>
                <li>
                  <strong>Cookies analityczne:</strong> brak wpływu na
                  funkcjonalność
                </li>
                <li>
                  <strong>Cookies marketingowe:</strong> mniej spersonalizowane
                  treści
                </li>
                <li>
                  <strong>Cookies społecznościowe:</strong> ograniczona
                  integracja z social media
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                8. Aktualizacje polityki
              </h2>
              <p className="mb-4">
                Polityka cookies może być aktualizowana w związku z:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Zmianami w przepisach prawnych</li>
                <li>Wprowadzeniem nowych technologii</li>
                <li>Zmianami w funkcjonalności serwisu</li>
                <li>Wprowadzeniem nowych partnerów</li>
              </ul>
              <p className="mb-4">
                O istotnych zmianach będziemy informować za pośrednictwem
                bannera cookies lub e-mail.
              </p>
            </section>

            <div className="bg-gray-50 p-6 rounded-lg mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Kontakt
              </h3>
              <p className="text-gray-600 mb-2">
                Jeśli masz pytania dotyczące wykorzystywania cookies, skontaktuj
                się z nami:
              </p>
              <ul className="text-gray-600">
                <li>
                  <strong>E-mail:</strong> kontakt@viralist.pl
                </li>
                <li>
                  <strong>Temat:</strong> "Polityka cookies"
                </li>
              </ul>
            </div>
          </div>
        </main>
      </Layout>
    </>
  );
};
