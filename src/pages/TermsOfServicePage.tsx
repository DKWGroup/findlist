import React from "react";
import { Layout } from "../components/Layout";
import { Breadcrumbs } from "../components/SEO/Breadcrumbs";
import { MetaTags } from "../components/SEO/MetaTags";

export const TermsOfServicePage: React.FC = () => {
  const breadcrumbItems = [{ label: "Regulamin", current: true }];

  return (
    <>
      <MetaTags
        title="Regulamin serwisu - FINDLIST"
        description="Regulamin korzystania z serwisu FINDLIST - pierwszej w Polsce platformy agregującej viralne produkty z mediów społecznościowych."
        canonical="https://findlist.net/regulamin"
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
              Regulamin serwisu FINDLIST
            </h1>

            <p className="text-gray-600 mb-8">
              <strong>Data wejścia w życie:</strong> 13 lipca 2025
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                § 1. Postanowienia ogólne
              </h2>
              <p className="mb-4">
                1. Niniejszy Regulamin określa zasady korzystania z serwisu
                internetowego FINDLIST dostępnego pod adresem findlist.net
                (zwany dalej "Serwisem").
              </p>
              <p className="mb-4">
                2. Właścicielem i administratorem Serwisu jest [Nazwa podmiotu]
                z siedzibą w [Adres], NIP: [Numer NIP], REGON: [Numer REGON]
                (zwany dalej "Administratorem").
              </p>
              <p className="mb-4">
                3. Serwis umożliwia użytkownikom przeglądanie, wyszukiwanie i
                odkrywanie viralnych produktów z mediów społecznościowych.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                § 2. Definicje
              </h2>
              <p className="mb-4">
                1. <strong>Użytkownik</strong> - osoba fizyczna, osoba prawna
                lub jednostka organizacyjna nieposiadająca osobowości prawnej,
                korzystająca z Serwisu.
              </p>
              <p className="mb-4">
                2. <strong>Konto</strong> - zbiór danych i ustawień Użytkownika
                w Serwisie, umożliwiający personalizację korzystania z usług.
              </p>
              <p className="mb-4">
                3. <strong>Treści</strong> - wszelkie informacje, dane, teksty,
                grafiki, zdjęcia umieszczone w Serwisie.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                § 3. Zasady korzystania z Serwisu
              </h2>
              <p className="mb-4">
                1. Korzystanie z Serwisu jest bezpłatne i nie wymaga
                rejestracji, z wyjątkiem funkcji wymagających utworzenia Konta.
              </p>
              <p className="mb-4">
                2. Użytkownik zobowiązuje się do korzystania z Serwisu zgodnie z
                prawem, dobrymi obyczajami i postanowieniami niniejszego
                Regulaminu.
              </p>
              <p className="mb-4">
                3. Zabrania się używania Serwisu w sposób naruszający prawa osób
                trzecich lub prawa autorskie.
              </p>
              <p className="mb-4">
                4. Użytkownik nie może podejmować działań zakłócających
                funkcjonowanie Serwisu.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                § 4. Rejestracja i Konto Użytkownika
              </h2>
              <p className="mb-4">
                1. Rejestracja w Serwisie jest dobrowolna i bezpłatna.
              </p>
              <p className="mb-4">
                2. Do założenia Konta wymagane jest podanie adresu e-mail i
                ustalenie hasła.
              </p>
              <p className="mb-4">
                3. Użytkownik zobowiązuje się do podania prawdziwych danych
                podczas rejestracji.
              </p>
              <p className="mb-4">
                4. Użytkownik jest odpowiedzialny za zachowanie poufności danych
                dostępowych do swojego Konta.
              </p>
              <p className="mb-4">
                5. Użytkownik może w każdej chwili usunąć swoje Konto,
                kontaktując się z Administratorem.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                § 5. Linki afiliacyjne
              </h2>
              <p className="mb-4">
                1. Serwis zawiera linki afiliacyjne do zewnętrznych sklepów
                internetowych.
              </p>
              <p className="mb-4">
                2. Administrator może otrzymywać prowizję od zakupów dokonanych
                za pośrednictwem linków afiliacyjnych.
              </p>
              <p className="mb-4">
                3. Korzystanie z linków afiliacyjnych nie wpływa na cenę
                produktów dla Użytkownika.
              </p>
              <p className="mb-4">
                4. Administrator nie ponosi odpowiedzialności za jakość
                produktów oferowanych przez zewnętrznych sprzedawców.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                § 6. Odpowiedzialność
              </h2>
              <p className="mb-4">
                1. Administrator dokłada wszelkich starań, aby informacje w
                Serwisie były aktualne i rzetelne.
              </p>
              <p className="mb-4">
                2. Administrator nie ponosi odpowiedzialności za szkody
                wynikające z korzystania z Serwisu.
              </p>
              <p className="mb-4">
                3. Administrator nie gwarantuje ciągłości działania Serwisu i
                może wprowadzać przerwy techniczne.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                § 7. Prawa autorskie
              </h2>
              <p className="mb-4">
                1. Wszelkie treści umieszczone w Serwisie są chronione prawami
                autorskimi.
              </p>
              <p className="mb-4">
                2. Kopiowanie, rozpowszechnianie lub wykorzystywanie treści bez
                zgody Administrator jest zabronione.
              </p>
              <p className="mb-4">
                3. Użytkownik może korzystać z treści wyłącznie do użytku
                osobistego.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                § 8. Postanowienia końcowe
              </h2>
              <p className="mb-4">
                1. Administrator zastrzega sobie prawo do wprowadzania zmian w
                Regulaminie.
              </p>
              <p className="mb-4">
                2. O zmianach Regulaminu Użytkownicy będą informowani za
                pośrednictwem Serwisu.
              </p>
              <p className="mb-4">
                3. W sprawach nieuregulowanych Regulaminem zastosowanie ma prawo
                polskie.
              </p>
              <p className="mb-4">
                4. Wszelkie spory będą rozstrzygane przez sąd właściwy dla
                siedziby Administratora.
              </p>
            </section>

            <div className="bg-gray-50 p-6 rounded-lg mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Kontakt
              </h3>
              <p className="text-gray-600">
                W przypadku pytań dotyczących Regulaminu, prosimy o kontakt pod
                adresem:{" "}
                <a
                  href="mailto:kontakt@findlist.net"
                  className="text-blue-600 hover:text-blue-800"
                >
                  kontakt@findlist.net
                </a>
              </p>
            </div>
          </div>
        </main>
      </Layout>
    </>
  );
};
