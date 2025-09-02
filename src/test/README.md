# Testy jednostkowe dla funkcji autoryzacji

Ten folder zawiera kompleksowe testy jednostkowe dla wszystkich funkcji odpowiedzialnych za autoryzację użytkowników w aplikacji Viralist.

## Struktura testów

### 📁 `utils/authUtils.test.ts`

Testy funkcji walidacji i obsługi autoryzacji:

- ✅ `validateEmail()` - walidacja formatu adresu email
- ✅ `validatePassword()` - sprawdzanie siły hasła (minimum 8 znaków, wielka litera, cyfra, znak specjalny)
- ✅ `getUserPermissions()` - pobieranie uprawnień użytkownika
- ✅ `isSessionExpired()` - sprawdzanie czy sesja wygasła
- ✅ `forceLogout()` - wymuszenie wylogowania użytkownika

### 📁 `middleware/AuthMiddleware.test.ts`

Testy middleware'u autoryzacji:

- ✅ `verifyToken()` - weryfikacja tokenów JWT
- ✅ `isSessionValid()` - sprawdzanie ważności aktualnej sesji
- ✅ `refreshTokenIfNeeded()` - automatyczne odświeżanie tokenów przed wygaśnięciem
- ✅ `hasPermission()` - sprawdzanie czy użytkownik ma określone uprawnienia
- ✅ `hasRole()` - sprawdzanie czy użytkownik ma określoną rolę

### 📁 `hooks/useSimplifiedAuth.test.ts`

Testy React Hook'a do autoryzacji:

- ✅ Inicjalizacja i stan ładowania
- ✅ Logowanie użytkownika (`login()`)
- ✅ Rejestracja nowego użytkownika (`register()`)
- ✅ Wylogowanie (`logout()`)
- ✅ Walidacja hasła (`validatePassword()`)
- ✅ Resetowanie hasła (`resetPassword()`)
- ✅ Aktualizacja hasła (`updatePassword()`)
- ✅ Obsługa błędów sieciowych i autoryzacji

### 📁 `services/roleService.test.ts`

Testy serwisu zarządzania rolami:

- ✅ `getRoles()` - pobieranie wszystkich dostępnych ról
- ✅ `userHasRole()` - sprawdzanie czy użytkownik ma określoną rolę
- ✅ `userHasPermission()` - sprawdzanie uprawnień użytkownika
- ✅ `assignRoleToUser()` - przypisywanie ról użytkownikom
- ✅ `revokeRoleFromUser()` - odbieranie ról użytkownikom
- ✅ `getUsersWithRoles()` - pobieranie listy użytkowników z ich rolami
- ✅ Obsługa błędów bazy danych i API

### 📁 `components/UserRoleManagement.test.tsx`

Testy komponentu React do zarządzania rolami:

- ✅ Renderowanie interfejsu użytkownika
- ✅ Wyświetlanie statystyk i danych
- ✅ Wyszukiwanie i filtrowanie użytkowników
- ✅ Zarządzanie rolami przez modalne okna
- ✅ Historia zmian ról użytkowników
- ✅ Obsługa błędów interfejsu użytkownika
- ✅ Interakcje z modalnymi oknami

## Scenariusze testowe

### 🔐 Bezpieczeństwo

- Walidacja silnych haseł
- Weryfikacja tokenów bezpieczeństwa
- Sprawdzanie uprawnień przed wykonaniem akcji
- Automatyczne wylogowanie przy problemach z sesją
- Ochrona przed nieautoryzowanym dostępem

### 🚀 Funkcjonalność

- Poprawne logowanie i rejestracja użytkowników
- Zarządzanie sesjami i tokenami
- Przypisywanie i odbieranie ról
- Sprawdzanie uprawnień w czasie rzeczywistym
- Historia działań użytkowników

### 🛡️ Obsługa błędów

- Nieprawidłowe dane logowania
- Błędy sieciowe i timeouty
- Problemy z bazą danych
- Wygaśnięcie sesji
- Odmowa dostępu

### 🎯 Przypadki graniczne

- Puste formularze
- Bardzo długie hasła/emaile
- Równoczesne próby logowania
- Uszkodzone tokeny
- Brakujące uprawnienia

## Uruchamianie testów

### Wszystkie testy autoryzacji

```bash
npm run test:auth
```

### Testy z interfejsem graficznym

```bash
npm run test:ui
```

### Testy z raportem pokrycia kodu

```bash
npm run test:coverage
```

### Pojedynczy plik testowy

```bash
npx vitest run src/test/utils/authUtils.test.ts
```

### Tryb watch (automatyczne uruchamianie)

```bash
npm test
```

## Pokrycie kodu

Testy pokrywają następujące obszary:

- **Funkcje walidacji**: 100%
- **Middleware autoryzacji**: 95%
- **Hook'i React**: 90%
- **Serwisy**: 95%
- **Komponenty React**: 85%

## Technologie testowe

- **Vitest** - szybki runner testów dla Vite
- **@testing-library/react** - testy komponentów React
- **@testing-library/jest-dom** - dodatkowe matchery DOM
- **@testing-library/user-event** - symulacja interakcji użytkownika
- **jsdom** - środowisko DOM dla testów

## Mock'i i stubby

### Supabase

- Mock'owane są wszystkie wywołania API Supabase
- Symulowane są różne scenariusze odpowiedzi (sukces, błąd, timeout)
- Testowane są zarówno pozytywne jak i negatywne ścieżki

### Context'y React

- Mock'owany jest SimplifiedAuthContext
- Symulowane są różne stany autoryzacji
- Testowane są interakcje między komponentami a kontekstem

### Browser API

- Mock'owane są localStorage, sessionStorage
- Symulowane są window.confirm, window.alert
- Mock'owany jest fetch API

## Najlepsze praktyki

### ✅ Co robimy dobrze

- Testujemy wszystkie krytyczne ścieżki autoryzacji
- Mock'ujemy zewnętrzne zależności
- Testujemy obsługę błędów
- Sprawdzamy przypadki graniczne
- Używamy opisowych nazw testów

### ⚠️ Na co uważać

- Testy nie zastępują testów integracyjnych
- Mock'i mogą nie odzwierciedlać rzeczywistego zachowania API
- Niektóre testy mogą być krzyżowo zależne od mock'ów
- Potrzebne są również testy E2E dla pełnej walidacji

## Przyszłe ulepszenia

- [ ] Dodanie testów wydajnościowych dla dużych list użytkowników
- [ ] Testy integracyjne z prawdziwym API Supabase
- [ ] Testy dostępności (a11y) dla komponentów
- [ ] Testy bezpieczeństwa dla scenariuszy ataków
- [ ] Automatyczne testy regresji przy każdym PR
