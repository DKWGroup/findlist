import React from "react";
import { Layout } from "../components/Layout";
import { Breadcrumbs } from "../components/SEO/Breadcrumbs";
import { MetaTags } from "../components/SEO/MetaTags";

export const PrivacyPolicyPage: React.FC = () => {
  const breadcrumbItems = [{ label: "Polityka prywatności", current: true }];

  return (
    <>
      <MetaTags
        title="Polityka prywatności - FINDLIST"
        description="Polityka prywatności serwisu FINDLIST - dowiedz się jak przetwarzamy i chronimy Twoje dane osobowe."
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

            <p className="text-gray-700 text-base leading-relaxed mb-8">
              Polityka prywatności opisuje zasady przetwarzania przez nas
              informacji na Twój temat, w tym danych osobowych oraz ciasteczek,
              czyli tzw. cookies.
            </p>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                1. Informacje ogólne
              </h2>
              <div className="space-y-3 text-gray-700">
                <p>
                  Niniejsza polityka dotyczy Serwisu www, funkcjonującego pod
                  adresem url: <strong>findlist.net</strong>
                </p>
                <p>
                  Operatorem serwisu oraz Administratorem danych osobowych jest:{" "}
                  <strong>Kamil Krukowski</strong>
                </p>
                <p>
                  Adres operatora: <strong>Katowice, ul. Tysiąclecia</strong>
                </p>
                <p>
                  Adres kontaktowy poczty elektronicznej operatora:{" "}
                  <strong>kamil.krukowski00@gmail.com</strong>
                </p>
                <p>
                  Operator jest Administratorem Twoich danych osobowych w
                  odniesieniu do danych podanych dobrowolnie w Serwisie.
                </p>

                <div className="mt-4">
                  <p className="font-semibold mb-2">
                    Serwis wykorzystuje dane osobowe w następujących celach:
                  </p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Prowadzenie newslettera</li>
                    <li>Prowadzenie systemu komentarzy</li>
                    <li>Obsługa zapytań przez formularz</li>
                  </ul>
                </div>

                <div className="mt-4">
                  <p className="font-semibold mb-2">
                    Serwis realizuje funkcje pozyskiwania informacji o
                    użytkownikach i ich zachowaniu w następujący sposób:
                  </p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>
                      Poprzez dobrowolnie wprowadzone w formularzach dane, które
                      zostają wprowadzone do systemów Operatora.
                    </li>
                    <li>
                      Poprzez zapisywanie w urządzeniach końcowych plików cookie
                      (tzw. „ciasteczka").
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                2. Wybrane metody ochrony danych stosowane przez Operatora
              </h2>
              <ul className="list-disc pl-6 space-y-3 text-gray-700">
                <li>
                  Miejsca logowania i wprowadzania danych osobowych są chronione
                  w warstwie transmisji (certyfikat SSL). Dzięki temu dane
                  osobowe i dane logowania, wprowadzone na stronie, zostają
                  zaszyfrowane w komputerze użytkownika i mogą być odczytane
                  jedynie na docelowym serwerze.
                </li>
                <li>
                  Dane osobowe przechowywane w bazie danych są zaszyfrowane w
                  taki sposób, że jedynie posiadający Operator klucz może je
                  odczytać. Dzięki temu dane są chronione na wypadek wykradzenia
                  bazy danych z serwera.
                </li>
                <li>
                  Hasła użytkowników są przechowywane w postaci hashowanej.
                  Funkcja hashująca działa jednokierunkowo - nie jest możliwe
                  odwrócenie jej działania, co stanowi obecnie współczesny
                  standard w zakresie przechowywania haseł użytkowników.
                </li>
                <li>
                  Istotnym elementem ochrony danych jest regularna aktualizacja
                  wszelkiego oprogramowania, wykorzystywanego przez Operatora do
                  przetwarzania danych osobowych, co w szczególności oznacza
                  regularne aktualizacje komponentów programistycznych.
                </li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                3. Hosting
              </h2>
              <div className="space-y-3 text-gray-700">
                <p>
                  Serwis jest hostowany (technicznie utrzymywany) na serwerach
                  operatora: <strong>inna firma</strong>
                </p>
                <p className="font-semibold">
                  Firma hostingowa w celu zapewnienia niezawodności technicznej
                  prowadzi logi na poziomie serwera. Zapisowi mogą podlegać:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>
                    zasoby określone identyfikatorem URL (adresy żądanych
                    zasobów – stron, plików),
                  </li>
                  <li>czas nadejścia zapytania,</li>
                  <li>czas wysłania odpowiedzi,</li>
                  <li>
                    nazwę stacji klienta – identyfikacja realizowana przez
                    protokół HTTP,
                  </li>
                  <li>
                    informacje o błędach jakie nastąpiły przy realizacji
                    transakcji HTTP,
                  </li>
                  <li>
                    adres URL strony poprzednio odwiedzanej przez użytkownika
                    (referer link) – w przypadku gdy przejście do Serwisu
                    nastąpiło przez odnośnik,
                  </li>
                  <li>informacje o przeglądarce użytkownika,</li>
                  <li>informacje o adresie IP,</li>
                  <li>
                    informacje diagnostyczne związane z procesem samodzielnego
                    zamawiania usług poprzez rejestratory na stronie,
                  </li>
                  <li>
                    informacje związane z obsługą poczty elektronicznej
                    kierowanej do Operatora oraz wysyłanej przez Operatora.
                  </li>
                </ul>
              </div>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                4. Twoje prawa i dodatkowe informacje o sposobie wykorzystania
                danych
              </h2>
              <div className="space-y-4 text-gray-700">
                <div>
                  <p className="mb-2">
                    W niektórych sytuacjach Administrator ma prawo przekazywać
                    Twoje dane osobowe innym odbiorcom, jeśli będzie to
                    niezbędne do wykonania zawartej z Tobą umowy lub do
                    zrealizowania obowiązków ciążących na Administratorze.
                    Dotyczy to takich grup odbiorców:
                  </p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>
                      osoby upoważnione przez nas, pracownicy i współpracownicy,
                      którzy muszą mieć dostęp do danych osobowych w celu
                      wykonywania swoich obowiązków,
                    </li>
                    <li>firma hostingowa,</li>
                    <li>firmy obsługująca mailingi,</li>
                    <li>firmy obsługująca komunikaty SMS,</li>
                    <li>
                      firmy, z którymi Administrator współpracuje w zakresie
                      marketingu własnego,
                    </li>
                    <li>kurierzy,</li>
                    <li>ubezpieczyciele,</li>
                    <li>kancelarie prawne i windykatorzy,</li>
                    <li>banki,</li>
                    <li>operatorzy płatności,</li>
                    <li>organy publiczne.</li>
                  </ul>
                </div>

                <p>
                  Twoje dane osobowe przetwarzane przez Administratora nie
                  dłużej, niż jest to konieczne do wykonania związanych z nimi
                  czynności określonych osobnymi przepisami (np. o prowadzeniu
                  rachunkowości). W odniesieniu do danych marketingowych dane
                  nie będą przetwarzane dłużej niż przez 3 lata.
                </p>

                <div>
                  <p className="font-semibold mb-2">
                    Przysługuje Ci prawo żądania od Administratora:
                  </p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>dostępu do danych osobowych Ciebie dotyczących,</li>
                    <li>ich sprostowania,</li>
                    <li>usunięcia,</li>
                    <li>ograniczenia przetwarzania,</li>
                    <li>oraz przenoszenia danych.</li>
                  </ul>
                </div>

                <p>
                  Przysługuje Ci prawo do złożenia sprzeciwu w zakresie
                  przetwarzania wskazanego w pkt 3.2 wobec przetwarzania danych
                  osobowych w celu wykonania prawnie uzasadnionych interesów
                  realizowanych przez Administratora, w tym profilowania, przy
                  czym prawo sprzeciwu nie będzie mogło być wykonane w przypadku
                  istnienia ważnych prawnie uzasadnionych podstaw do
                  przetwarzania, nadrzędnych wobec Ciebie interesów, praw i
                  wolności, w szczególności ustalenia, dochodzenia lub obrony
                  roszczeń.
                </p>

                <p>
                  Na działania Administratora przysługuje skarga do Prezesa
                  Urzędu Ochrony Danych Osobowych, ul. Stawki 2, 00-193
                  Warszawa.
                </p>

                <p>
                  Podanie danych osobowych jest dobrowolne, lecz niezbędne do
                  obsługi Serwisu.
                </p>

                <p>
                  W stosunku do Ciebie mogą być podejmowane czynności polegające
                  na zautomatyzowanym podejmowaniu decyzji, w tym profilowaniu w
                  celu świadczenia usług w ramach zawartej umowy oraz w celu
                  prowadzenia przez Administratora marketingu bezpośredniego.
                </p>

                <p>
                  Dane osobowe nie są przekazywane od krajów trzecich w
                  rozumieniu przepisów o ochronie danych osobowych. Oznacza to,
                  że nie przesyłamy ich poza teren Unii Europejskiej.
                </p>
              </div>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                5. Informacje w formularzach
              </h2>
              <ul className="list-disc pl-6 space-y-3 text-gray-700">
                <li>
                  Serwis zbiera informacje podane dobrowolnie przez użytkownika,
                  w tym dane osobowe, o ile zostaną one podane.
                </li>
                <li>
                  Serwis może zapisać informacje o parametrach połączenia
                  (oznaczenie czasu, adres IP).
                </li>
                <li>
                  Serwis, w niektórych wypadkach, może zapisać informację
                  ułatwiającą powiązanie danych w formularzu z adresem e-mail
                  użytkownika wypełniającego formularz. W takim wypadku adres
                  e-mail użytkownika pojawia się wewnątrz adresu url strony
                  zawierającej formularz.
                </li>
                <li>
                  Dane podane w formularzu są przetwarzane w celu wynikającym z
                  funkcji konkretnego formularza, np. w celu dokonania procesu
                  obsługi zgłoszenia serwisowego lub kontaktu handlowego,
                  rejestracji usług itp. Każdorazowo kontekst i opis formularza
                  w czytelny sposób informuje, do czego on służy.
                </li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                6. Logi Administratora
              </h2>
              <p className="text-gray-700">
                Informacje zachowaniu użytkowników w serwisie mogą podlegać
                logowaniu. Dane te są wykorzystywane w celu administrowania
                serwisem.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                7. Istotne techniki marketingowe
              </h2>
              <ul className="list-disc pl-6 space-y-3 text-gray-700">
                <li>
                  Operator stosuje analizę statystyczną ruchu na stronie,
                  poprzez Google Analytics (Google Inc. z siedzibą w USA).
                  Operator nie przekazuje do operatora tej usługi danych
                  osobowych, a jedynie zanonimizowane informacje. Usługa bazuje
                  na wykorzystaniu ciasteczek w urządzeniu końcowym użytkownika.
                  W zakresie informacji o preferencjach użytkownika gromadzonych
                  przez sieć reklamową Google użytkownik może przeglądać i
                  edytować informacje wynikające z plików cookies przy pomocy
                  narzędzia:{" "}
                  <a
                    href="https://www.google.com/ads/preferences/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    https://www.google.com/ads/preferences/
                  </a>
                </li>
                <li>
                  Operator stosuje techniki remarketingowe, pozwalające na
                  dopasowanie przekazów reklamowych do zachowania użytkownika na
                  stronie, co może dawać złudzenie, że dane osobowe użytkownika
                  są wykorzystywane do jego śledzenia, jednak w praktyce nie
                  dochodzi do przekazania żadnych danych osobowych od Operatora
                  do operatorom reklam. Technologicznym warunkiem takich działań
                  jest włączona obsługa plików cookie.
                </li>
                <li>
                  Operator stosuje korzysta z piksela Facebooka. Ta technologia
                  powoduje, że serwis Facebook (Facebook Inc. z siedzibą w USA)
                  wie, że dana osoba w nim zarejestrowana korzysta z Serwisu.
                  Bazuje w tym wypadku na danych, wobec których sam jest
                  administratorem, Operator nie przekazuje od siebie żadnych
                  dodatkowych danych osobowych serwisowi Facebook. Usługa bazuje
                  na wykorzystaniu ciasteczek w urządzeniu końcowym użytkownika.
                </li>
                <li>
                  Operator stosuje rozwiązanie badające zachowanie użytkowników
                  poprzez tworzenie map ciepła oraz nagrywanie zachowania na
                  stronie. Te informacje są anonimizowane zanim zostaną
                  przesłane do operatora usługi tak, że nie wie on jakiej osoby
                  fizycznej one dotyczą. W szczególności nagrywaniu nie
                  podlegają wpisywane hasła oraz inne dane osobowe.
                </li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                8. Informacja o plikach cookies
              </h2>
              <div className="space-y-3 text-gray-700">
                <p>Serwis korzysta z plików cookies.</p>
                <p>
                  Pliki cookies (tzw. „ciasteczka") stanowią dane informatyczne,
                  w szczególności pliki tekstowe, które przechowywane są w
                  urządzeniu końcowym Użytkownika Serwisu i przeznaczone są do
                  korzystania ze stron internetowych Serwisu. Cookies zazwyczaj
                  zawierają nazwę strony internetowej, z której pochodzą, czas
                  przechowywania ich na urządzeniu końcowym oraz unikalny numer.
                </p>
                <p>
                  Podmiotem zamieszczającym na urządzeniu końcowym Użytkownika
                  Serwisu pliki cookies oraz uzyskującym do nich dostęp jest
                  operator Serwisu.
                </p>

                <div>
                  <p className="font-semibold mb-2">
                    Pliki cookies wykorzystywane są w następujących celach:
                  </p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>
                      utrzymanie sesji użytkownika Serwisu (po zalogowaniu),
                      dzięki której użytkownik nie musi na każdej podstronie
                      Serwisu ponownie wpisywać loginu i hasła;
                    </li>
                    <li>
                      realizacji celów określonych powyżej w części "Istotne
                      techniki marketingowe";
                    </li>
                  </ul>
                </div>

                <p>
                  W ramach Serwisu stosowane są dwa zasadnicze rodzaje plików
                  cookies: „sesyjne" (session cookies) oraz „stałe" (persistent
                  cookies). Cookies „sesyjne" są plikami tymczasowymi, które
                  przechowywane są w urządzeniu końcowym Użytkownika do czasu
                  wylogowania, opuszczenia strony internetowej lub wyłączenia
                  oprogramowania (przeglądarki internetowej). „Stałe" pliki
                  cookies przechowywane są w urządzeniu końcowym Użytkownika
                  przez czas określony w parametrach plików cookies lub do czasu
                  ich usunięcia przez Użytkownika.
                </p>

                <p>
                  Oprogramowanie do przeglądania stron internetowych
                  (przeglądarka internetowa) zazwyczaj domyślnie dopuszcza
                  przechowywanie plików cookies w urządzeniu końcowym
                  Użytkownika. Użytkownicy Serwisu mogą dokonać zmiany ustawień
                  w tym zakresie. Przeglądarka internetowa umożliwia usunięcie
                  plików cookies. Możliwe jest także automatyczne blokowanie
                  plików cookies Szczegółowe informacje na ten temat zawiera
                  pomoc lub dokumentacja przeglądarki internetowej.
                </p>

                <p>
                  Ograniczenia stosowania plików cookies mogą wpłynąć na
                  niektóre funkcjonalności dostępne na stronach internetowych
                  Serwisu.
                </p>

                <p>
                  Pliki cookies zamieszczane w urządzeniu końcowym Użytkownika
                  Serwisu wykorzystywane mogą być również przez współpracujące z
                  operatorem Serwisu podmioty, w szczególności dotyczy to firm:
                  Google (Google Inc. z siedzibą w USA), Facebook (Facebook Inc.
                  z siedzibą w USA), Twitter (Twitter Inc. z siedzibą w USA).
                </p>
              </div>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                9. Zarządzanie plikami cookies – jak w praktyce wyrażać i cofać
                zgodę?
              </h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  Jeśli użytkownik nie chce otrzymywać plików cookies, może
                  zmienić ustawienia przeglądarki. Zastrzegamy, że wyłączenie
                  obsługi plików cookies niezbędnych dla procesów
                  uwierzytelniania, bezpieczeństwa, utrzymania preferencji
                  użytkownika może utrudnić, a w skrajnych przypadkach może
                  uniemożliwić korzystanie ze stron www
                </p>

                <div>
                  <p className="font-semibold mb-2">
                    W celu zarządzania ustawienia cookies wybierz z listy
                    poniżej przeglądarkę internetową, której używasz i postępuj
                    zgodnie z instrukcjami:
                  </p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Edge</li>
                    <li>Internet Explorer</li>
                    <li>Chrome</li>
                    <li>Safari</li>
                    <li>Firefox</li>
                    <li>Opera</li>
                  </ul>
                </div>

                <div>
                  <p className="font-semibold mb-2">Urządzenia mobilne:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Android</li>
                    <li>Safari (iOS)</li>
                    <li>Windows Phone</li>
                  </ul>
                </div>
              </div>
            </section>
          </div>
        </main>
      </Layout>
    </>
  );
};
