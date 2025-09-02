import React from "react";
import { Layout } from "../components/Layout";
import { Breadcrumbs } from "../components/SEO/Breadcrumbs";
import { MetaTags } from "../components/SEO/MetaTags";

export const PrivacyPolicyPage: React.FC = () => {
  const breadcrumbItems = [{ label: "Polityka prywatności", current: true }];

  return (
    <>
      <MetaTags
        title="Polityka prywatności - VIRALIST"
        description="Polityka prywatności serwisu VIRALIST - dowiedz się jak przetwarzamy i chronimy Twoje dane osobowe."
        canonical="https://findlist.net/polityka-prywatnosci"
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
              Polityka prywatności
            </h1>

            <p className="text-gray-600 mb-8">
              <strong>Data wejścia w życie:</strong> 13 lipca 2025
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                1. Informacje ogólne
              </h2>
              <p className="mb-4">
                Niniejsza Polityka prywatności określa zasady przetwarzania i
                ochrony danych osobowych przekazanych przez Użytkowników w
                związku z korzystaniem z serwisu VIRALIST.
              </p>
              <p className="mb-4">
                Administratorem danych osobowych jest [Nazwa podmiotu] z
                siedzibą w [Adres], e-mail: kontakt@findlist.net.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                2. Rodzaje przetwarzanych danych
              </h2>
              <p className="mb-4">
                W ramach świadczonych usług możemy przetwarzać następujące
                kategorie danych osobowych:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>
                  <strong>Dane rejestracyjne:</strong> adres e-mail, hasło, imię
                  (opcjonalnie)
                </li>
                <li>
                  <strong>Dane techniczne:</strong> adres IP, typ przeglądarki,
                  system operacyjny
                </li>
                <li>
                  <strong>Dane behawioralne:</strong> historia przeglądania,
                  preferencje produktów
                </li>
                <li>
                  <strong>Dane kontaktowe:</strong> adres e-mail w przypadku
                  kontaktu z obsługą
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                3. Cele przetwarzania danych
              </h2>
              <p className="mb-4">
                Przetwarzamy dane osobowe w następujących celach:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Świadczenie usług w ramach serwisu VIRALIST</li>
                <li>Utworzenie i zarządzanie kontem użytkownika</li>
                <li>Personalizacja treści i rekomendacji</li>
                <li>Komunikacja z użytkownikami</li>
                <li>Wysyłanie newslettera (za zgodą)</li>
                <li>Analiza ruchu i optymalizacja serwisu</li>
                <li>Zapewnienie bezpieczeństwa serwisu</li>
                <li>Wywiązanie się z obowiązków prawnych</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                4. Podstawy prawne przetwarzania
              </h2>
              <p className="mb-4">
                Przetwarzanie danych osobowych odbywa się na podstawie:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>
                  <strong>Art. 6 ust. 1 lit. a RODO</strong> - zgoda
                  (newsletter, marketing)
                </li>
                <li>
                  <strong>Art. 6 ust. 1 lit. b RODO</strong> - wykonanie umowy
                  (świadczenie usług)
                </li>
                <li>
                  <strong>Art. 6 ust. 1 lit. c RODO</strong> - obowiązek prawny
                </li>
                <li>
                  <strong>Art. 6 ust. 1 lit. f RODO</strong> - prawnie
                  uzasadniony interes (analityka, bezpieczeństwo)
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                5. Okres przechowywania danych
              </h2>
              <p className="mb-4">Dane osobowe przechowujemy przez okres:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>
                  <strong>Dane konta:</strong> do momentu usunięcia konta przez
                  użytkownika
                </li>
                <li>
                  <strong>Dane techniczne:</strong> do 12 miesięcy
                </li>
                <li>
                  <strong>Newsletter:</strong> do momentu wycofania zgody
                </li>
                <li>
                  <strong>Dane kontaktowe:</strong> do 3 lat od ostatniego
                  kontaktu
                </li>
                <li>
                  <strong>Dane finansowe:</strong> zgodnie z przepisami prawa
                  podatkowego
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                6. Udostępnianie danych
              </h2>
              <p className="mb-4">Dane osobowe mogą być udostępniane:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Dostawcom usług technicznych (hosting, analityka)</li>
                <li>
                  Partnerom afiliacyjnym (w zakresie anonimowych statystyk)
                </li>
                <li>Organom państwowym na podstawie przepisów prawa</li>
              </ul>
              <p className="mb-4">
                Wszystkie podmioty, którym udostępniamy dane, są zobowiązane do
                ich ochrony zgodnie z obowiązującymi przepisami.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                7. Prawa użytkownika
              </h2>
              <p className="mb-4">Zgodnie z RODO, użytkownik ma prawo do:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>
                  <strong>Dostępu</strong> do swoich danych osobowych
                </li>
                <li>
                  <strong>Sprostowania</strong> nieprawidłowych danych
                </li>
                <li>
                  <strong>Usunięcia</strong> danych (prawo do bycia zapomnianym)
                </li>
                <li>
                  <strong>Ograniczenia</strong> przetwarzania
                </li>
                <li>
                  <strong>Przenoszenia</strong> danych
                </li>
                <li>
                  <strong>Sprzeciwu</strong> wobec przetwarzania
                </li>
                <li>
                  <strong>Wycofania zgody</strong> w dowolnym momencie
                </li>
              </ul>
              <p className="mb-4">
                Aby skorzystać ze swoich praw, skontaktuj się z nami pod
                adresem: kontakt@findlist.net
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                8. Bezpieczeństwo danych
              </h2>
              <p className="mb-4">
                Stosujemy odpowiednie środki techniczne i organizacyjne w celu
                zapewnienia bezpieczeństwa przetwarzanych danych osobowych, w
                tym:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Szyfrowanie danych w transmisji (SSL/TLS)</li>
                <li>Regularne kopie zapasowe</li>
                <li>Kontrola dostępu do danych</li>
                <li>Monitoring bezpieczeństwa</li>
                <li>Szkolenia personelu w zakresie ochrony danych</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                9. Pliki cookies
              </h2>
              <p className="mb-4">
                Serwis wykorzystuje pliki cookies w celu zapewnienia
                prawidłowego funkcjonowania, analizy ruchu i personalizacji
                treści. Szczegółowe informacje znajdują się w{" "}
                <a
                  href="/cookies"
                  className="text-blue-600 hover:text-blue-800"
                >
                  Polityce cookies
                </a>
                .
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                10. Zmiany w polityce prywatności
              </h2>
              <p className="mb-4">
                Zastrzegamy sobie prawo do wprowadzania zmian w niniejszej
                Polityce prywatności. O istotnych zmianach będziemy informować
                użytkowników za pośrednictwem serwisu lub e-mail.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                11. Kontakt
              </h2>
              <p className="mb-4">
                W przypadku pytań dotyczących przetwarzania danych osobowych lub
                niniejszej Polityki prywatności, prosimy o kontakt:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>
                  <strong>E-mail:</strong> kontakt@findlist.net
                </li>
                <li>
                  <strong>Adres pocztowy:</strong> [Adres siedziby]
                </li>
              </ul>
            </section>

            <div className="bg-gray-50 p-6 rounded-lg mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Prawo do wniesienia skargi
              </h3>
              <p className="text-gray-600">
                W przypadku naruszenia przepisów o ochronie danych osobowych,
                masz prawo wniesienia skargi do Prezesa Urzędu Ochrony Danych
                Osobowych.
              </p>
            </div>
          </div>
        </main>
      </Layout>
    </>
  );
};
