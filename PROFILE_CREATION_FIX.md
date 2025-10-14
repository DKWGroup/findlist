# 🔧 Rozwiązanie problemu tworzenia profilu użytkownika

## 🔴 Problem

Po rejestracji użytkownika, konto jest tworzone w `auth.users`, ale profil nie jest tworzony w `public.profiles`.

## ✅ Rozwiązanie

### Krok 1: Uruchom SQL w Supabase SQL Editor

1. Otwórz Supabase Dashboard → SQL Editor
2. Wklej zawartość pliku `fix_profiles_rls.sql`
3. Kliknij "Run" lub naciśnij Ctrl+Enter
4. Sprawdź wyniki - powinny pokazać:
   - RLS Enabled: 1
   - Policies Count: 4 (lub więcej)
   - Lista wszystkich polityk

### Krok 2: Zweryfikuj polityki RLS

Upewnij się, że masz następujące polityki:

```sql
✅ "Users can insert own profile during registration" - FOR INSERT
✅ "Users can view own profile" - FOR SELECT
✅ "Users can update own profile" - FOR UPDATE
✅ "Service role can do anything" - FOR ALL
```

### Krok 3: Sprawdź trigger

Wykonaj w SQL Editor:

```sql
-- Sprawdź czy trigger istnieje
SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';

-- Sprawdź funkcję trigger
SELECT routine_name, routine_definition
FROM information_schema.routines
WHERE routine_name = 'handle_new_user';
```

### Krok 4: Testuj rejestrację

1. Otwórz aplikację w trybie deweloperskim
2. Otwórz DevTools Console (F12)
3. Wypełnij formularz rejestracji
4. Kliknij "Załóż konto"
5. Obserwuj logi w konsoli

## 📊 Jak działa teraz system?

### Przepływ rejestracji:

```
1. Użytkownik wypełnia formularz
   ↓
2. RegisterForm wysyła dane do useSimplifiedAuth.register()
   ↓
3. supabase.auth.signUp() tworzy użytkownika w auth.users
   ↓
4. Trigger on_auth_user_created automatycznie tworzy profil
   ↓
5. Kod sprawdza czy profil istnieje (po 500ms)
   ↓
6. Jeśli NIE istnieje → tworzy ręcznie z pełnymi danymi
   ↓
7. Finalna weryfikacja czy profil został utworzony
   ↓
8. Zwrot success: true
```

## 🔍 Logi debugowania

Po rejestracji zobaczysz w konsoli:

```
✅ Sukces:
🔵 [SUPABASE_AUTH] Rozpoczęcie rejestracji...
📋 [SUPABASE_AUTH] Otrzymane dane: {full_name: "...", email: "..."}
✅ [SUPABASE_AUTH] Walidacja haseł przeszła
📤 [SUPABASE_AUTH] Wysyłanie żądania signUp
📥 [SUPABASE_AUTH] Odpowiedź: {hasUser: true, userId: "..."}
✅ [SUPABASE_AUTH] Rejestracja zakończona sukcesem!
🔍 [SUPABASE_AUTH] Tworzenie profilu użytkownika...
📊 [SUPABASE_AUTH] Sprawdzanie: {exists: true, profile: {...}}
✅ [SUPABASE_AUTH] Profil już istnieje (utworzony przez trigger)
✅ [SUPABASE_AUTH] Finalna weryfikacja profilu zakończona

❌ Jeśli trigger nie zadziałał:
⚠️ [SUPABASE_AUTH] Profil nie został automatycznie utworzony
📤 [SUPABASE_AUTH] Dane profilu do wstawienia: {...}
✅ [SUPABASE_AUTH] Profil utworzony ręcznie
✅ [SUPABASE_AUTH] Finalna weryfikacja profilu zakończona

🔒 Jeśli błąd RLS:
❌ [SUPABASE_AUTH] Błąd tworzenia profilu: {code: '42501', ...}
🔒 [SUPABASE_AUTH] Błąd polityki RLS - brak uprawnień
💡 [SUPABASE_AUTH] Rozwiązanie: Dodaj politykę RLS
```

## 🛠️ Rozwiązywanie problemów

### Problem: "new row violates row-level security policy"

**Rozwiązanie:** Uruchom `fix_profiles_rls.sql` w SQL Editor

### Problem: "duplicate key value violates unique constraint"

**Rozwiązanie:** Profil już istnieje, ale kod go nie widzi - sprawdź polityki SELECT

### Problem: Trigger nie tworzy profilu

**Rozwiązanie:**

1. Sprawdź czy trigger istnieje: `SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created'`
2. Jeśli nie - uruchom sekcję tworzenia triggera z `fix_profiles_rls.sql`

### Problem: Brak pola full_name w profilu

**Rozwiązanie:**

- Sprawdź czy w `auth.users.raw_user_meta_data` jest pole `full_name`
- Kod już przekazuje to pole w `signUp({ options: { data: { full_name } } })`

## ✨ Co zostało dodane?

1. **Szczegółowe logowanie** - każdy krok rejestracji jest logowany
2. **Sprawdzanie istniejącego profilu** - używa `maybeSingle()` zamiast `single()`
3. **Automatyczne tworzenie profilu** - fallback gdy trigger nie zadziała
4. **Pełne dane profilu** - wszystkie wymagane pola (wishlist, reviews, etc.)
5. **Finalna weryfikacja** - potwierdza że profil został utworzony
6. **Obsługa błędów RLS** - wykrywa i informuje o problemach z politykami
7. **SQL fix script** - gotowy skrypt do naprawy polityk RLS

## 📝 Weryfikacja po naprawie

Po uruchomieniu `fix_profiles_rls.sql`, zarejestruj nowego użytkownika i sprawdź:

```sql
-- 1. Sprawdź czy użytkownik istnieje w auth.users
SELECT id, email, created_at, raw_user_meta_data->'full_name' as full_name
FROM auth.users
WHERE email = 'test@example.com';

-- 2. Sprawdź czy profil został utworzony
SELECT id, email, full_name, created_at, wishlist, reviews
FROM public.profiles
WHERE email = 'test@example.com';

-- 3. Sprawdź czy dane się zgadzają
SELECT
    u.id as auth_id,
    u.email as auth_email,
    u.raw_user_meta_data->>'full_name' as auth_full_name,
    p.id as profile_id,
    p.email as profile_email,
    p.full_name as profile_full_name
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE u.email = 'test@example.com';
```

Wszystkie zapytania powinny zwrócić dane! 🎉
