# 🚫 Rozwiązanie problemu Rate Limiting (429 Too Many Requests)

## 🔴 Problem

Błąd: `POST /auth/v1/signup 429 (Too Many Requests)`

## 📊 Dlaczego to się dzieje?

Supabase ma limity dla darmowego planu:

- **Email rate limit**: 3-4 emaile/godzinę z tego samego IP
- **Signup rate limit**: ~30 rejestracji/godzinę
- **API rate limit**: 100 zapytań/sekundę

## ✅ Rozwiązania

### 1️⃣ **Natychmiastowe - Poczekaj**

```
⏱️ Zaczekaj 15-60 minut
✅ Rate limit się zresetuje automatycznie
```

### 2️⃣ **Wyłącz email confirmation (DEV ONLY)**

#### Przez Dashboard:

```
1. Otwórz Supabase Dashboard
2. Idź do: Authentication → Providers → Email
3. Znajdź: "Confirm email"
4. ❌ Wyłącz: "Enable email confirmations"
5. 💾 Zapisz
```

#### Przez SQL:

```sql
-- UWAGA: Tylko na środowisku deweloperskim!
-- NIE uruchamiaj tego na produkcji!

-- Sprawdź aktualną konfigurację
SELECT * FROM auth.config;

-- Wyłącz wymóg potwierdzenia email
UPDATE auth.config
SET config = jsonb_set(
  config,
  '{MAILER_AUTOCONFIRM}',
  'true'::jsonb
);

-- Weryfikacja
SELECT config->>'MAILER_AUTOCONFIRM' as auto_confirm
FROM auth.config;
-- Powinno zwrócić: true
```

### 3️⃣ **Użyj testowych kont email**

Zamiast ciągle tworzyć nowe konta, użyj:

```typescript
// Email z plusem - traktowany jako oddzielny, ale trafia do tej samej skrzynki
test@example.com
test+1@example.com
test+2@example.com
test+test1@example.com

// Lub użyj tymczasowych emaili:
- https://temp-mail.org
- https://10minutemail.com
- https://guerrillamail.com
```

### 4️⃣ **Dodaj Captcha (Produkcja)**

Dla produkcji dodaj zabezpieczenie:

```typescript
// W RegisterForm.tsx
import ReCAPTCHA from "react-google-recaptcha";

const [captchaToken, setCaptchaToken] = useState<string | null>(null);

// W formularzu
<ReCAPTCHA
  sitekey="YOUR_SITE_KEY"
  onChange={(token) => setCaptchaToken(token)}
/>;

// W handleSubmit
if (!captchaToken) {
  setFormError("Potwierdź, że nie jesteś robotem");
  return;
}
```

### 5️⃣ **Upgrade do płatnego planu**

Jeśli to dla produkcji:

```
Pro Plan ($25/mies):
✅ 100,000 MAU (Monthly Active Users)
✅ Wyższe limity rate limiting
✅ Custom SMTP (własny serwer email)
✅ Support 24/7
```

## 🛡️ Zabezpieczenia dodane w kodzie

### ✅ 1. Obsługa błędu 429

```typescript
// useSimplifiedAuth.ts - już dodane
if (error.status === 429) {
  errorMessage = "Zbyt wiele prób rejestracji. Spróbuj za kilka minut.";
}
```

### ✅ 2. Blokada wielokrotnego klikania

```typescript
// RegisterForm.tsx - już dodane
if (localLoading) {
  console.warn("⚠️ Rejestracja już w toku");
  return;
}
```

### ✅ 3. Wyłączenie przycisku podczas ładowania

```typescript
// RegisterForm.tsx - już jest
<button
  type="submit"
  disabled={isFormLoading}  // ✅
  className="... disabled:bg-blue-400 disabled:cursor-not-allowed"
>
```

## 🧪 Testowanie bez limitów

### Opcja A: Local Supabase (Docker)

```bash
# Zainstaluj Supabase CLI
npm install -g supabase

# Inicjalizuj projekt
supabase init

# Uruchom lokalnie (bez limitów!)
supabase start

# Aktualizuj .env.local
VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_ANON_KEY=<local_anon_key>
```

### Opcja B: Użyj Mock Service Worker (MSW)

```bash
npm install -D msw

# Symuluj rejestrację bez prawdziwych requestów
```

## 📈 Monitoring rate limitów

Sprawdź w Supabase Dashboard:

```
Reports → API → Rate Limits
```

## ⚠️ Najlepsze praktyki

### ✅ DO (Rób):

- Użyj debouncing dla formularzy
- Dodaj Captcha na produkcji
- Wyłącz auto-confirm na produkcji
- Monitoruj rate limity w Dashboard
- Użyj local Supabase do testów

### ❌ DON'T (Nie rób):

- Nie testuj rejestracji w pętli
- Nie używaj tego samego emaila wielokrotnie
- Nie wyłączaj email confirmation na produkcji
- Nie ignoruj błędów 429
- Nie twórz wielu kont testowych w krótkim czasie

## 🆘 Co zrobić jeśli dalej masz problem?

1. **Sprawdź logi Supabase:**

   ```
   Dashboard → Logs → Auth Logs
   ```

2. **Sprawdź czy to nie inny problem:**

   ```javascript
   // W DevTools Console
   // Sprawdź czy nie masz innych błędów
   console.log(error);
   ```

3. **Skontaktuj się z Supabase Support:**

   ```
   Dashboard → Support → New Ticket
   ```

4. **Tymczasowo użyj innego IP:**
   ```
   - Zmień sieć (WiFi → Hotspot)
   - Użyj VPN
   - Użyj trybu incognito (czasem pomaga)
   ```

## 📝 Checklist dla Dev Environment

- [ ] Wyłącz email confirmation w Dashboard
- [ ] Dodaj obsługę błędu 429 w kodzie (✅ już jest)
- [ ] Dodaj blokadę wielokrotnego submitowania (✅ już jest)
- [ ] Użyj różnych emaili do testów
- [ ] Rozważ local Supabase dla intensywnych testów
- [ ] Monitoruj rate limity w Dashboard

## 📝 Checklist dla Production

- [ ] Włącz email confirmation
- [ ] Dodaj Captcha
- [ ] Ustaw custom SMTP (opcjonalnie)
- [ ] Monitoruj rate limity
- [ ] Rozważ upgrade do Pro planu
- [ ] Dodaj analytics dla failed registrations
- [ ] Ustaw alerty dla wysokiego % błędów 429

---

**Aktualne zabezpieczenia w kodzie:** ✅ DODANE

- Obsługa błędu 429 z polskim komunikatem
- Blokada wielokrotnego klikania
- Szczegółowe logowanie w konsoli
