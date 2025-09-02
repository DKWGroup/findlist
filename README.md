# VIRALIST - Viralowe Produkty Platform

Platforma agregująca najlepsze viralowe produkty z TikToka i Instagrama z funkcją przesyłania i optymalizacji obrazów.

## 🔐 Uwierzytelnianie

Platforma obsługuje następujące metody logowania:

- **Email i hasło** - standardowe logowanie

## 🚀 Funkcje

- **Drag & Drop Upload**: Intuicyjne przesyłanie obrazów z optymalizacją
- **Automatyczna Optymalizacja**: Konwersja do WebP, zmiana rozmiaru do HD, kompresja
- **Supabase Storage**: Bezpieczne przechowywanie plików w chmurze
- **Responsywny Design**: Pełna responsywność na wszystkich urządzeniach
- **Dostępność**: Zgodność z WCAG 2.1 AA
- **Uwierzytelnianie**: Logowanie przez email/hasło oraz Google OAuth

## 📋 Wymagania

- Node.js 18+
- Konto Supabase
- Nowoczesna przeglądarka z obsługą Canvas API

## 🛠️ Instalacja

1. **Klonowanie repozytorium**
```bash
git clone <repository-url>
cd viralist
```

2. **Instalacja zależności**
```bash
npm install
```

3. **Konfiguracja Supabase**
```bash
cp .env.example .env
```

Uzupełnij plik `.env` danymi z Supabase:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

4. **Uruchomienie aplikacji**
```bash
npm run dev
```

## 🗄️ Konfiguracja Supabase Storage

### 1. Utworzenie Bucket'a

W Supabase Dashboard:
1. Przejdź do Storage
2. Utwórz nowy bucket o nazwie `images`
3. Ustaw jako publiczny

### 2. Konfiguracja RLS Policies

Dodaj następujące polityki RLS:

**Policy 1: Public read access**
```sql
CREATE POLICY "Public read access" ON storage.objects
FOR SELECT USING (bucket_id = 'images');
```

**Policy 2: Authenticated upload**
```sql
CREATE POLICY "Authenticated upload" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'images' AND auth.role() = 'authenticated');
```

**Policy 3: Authenticated delete**
```sql
CREATE POLICY "Authenticated delete" ON storage.objects
FOR DELETE USING (bucket_id = 'images' AND auth.role() = 'authenticated');
```

### 3. Ograniczenia Bucket'a

W ustawieniach bucket'a ustaw:
- **File size limit**: 2MB
- **Allowed MIME types**: `image/jpeg`, `image/png`, `image/webp`

## 📸 Funkcje Upload'u Obrazów

### Automatyczna Optymalizacja

- **Rozdzielczość**: Maksymalnie 1920x1080 (HD)
- **Format**: Konwersja do WebP
- **Kompresja**: 85% jakości
- **Rozmiar**: Maksymalnie 2MB po kompresji

### Obsługiwane Formaty

- JPEG/JPG
- PNG
- WebP

### Funkcje UX

- Drag & drop interface
- Progress bar podczas upload'u
- Preview przed przesłaniem
- Walidacja plików
- Obsługa błędów
- Responsywny design
- Dostępność (ARIA labels, keyboard navigation)

## 🎨 Komponenty Upload'u

### ImageUploadZone

Główny komponent do przesyłania obrazów:

```tsx
<ImageUploadZone
  onUploadComplete={(urls) => console.log('Uploaded:', urls)}
  onUploadError={(error) => console.error('Error:', error)}
  maxFiles={5}
  folder="products"
  disabled={false}
/>
```

**Props:**
- `onUploadComplete`: Callback po pomyślnym upload'ie
- `onUploadError`: Callback w przypadku błędu
- `maxFiles`: Maksymalna liczba plików (domyślnie 5)
- `folder`: Folder w bucket'cie (domyślnie 'products')
- `disabled`: Wyłączenie komponentu

### Integracja z Formularzami

Komponent jest zintegrowany z:
- **ProductForm**: Dodawanie zdjęć produktów
- **BlogEditor**: Zdjęcie główne wpisu blogowego

## 🔧 Utilities

### imageUtils.ts

Funkcje do przetwarzania obrazów:
- `processImage()`: Optymalizacja obrazu
- `isValidImageFile()`: Walidacja typu pliku
- `formatFileSize()`: Formatowanie rozmiaru pliku
- `generateUniqueFilename()`: Generowanie unikalnych nazw

### supabaseStorage.ts

Funkcje do obsługi Supabase Storage:
- `uploadToSupabase()`: Upload z progress tracking
- `deleteFromSupabase()`: Usuwanie plików
- `initializeStorageBucket()`: Inicjalizacja bucket'a

## 🚀 Deployment

### Przygotowanie do produkcji

1. **Build aplikacji**
```bash
npm run build
```

2. **Konfiguracja zmiennych środowiskowych**
Ustaw zmienne w środowisku produkcyjnym:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

3. **Deploy na Netlify/Vercel**
```bash
# Netlify
npm run build && netlify deploy --prod --dir=dist

# Vercel
vercel --prod
```

## 📱 Responsywność

Aplikacja jest w pełni responsywna z breakpointami:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## ♿ Dostępność

- **ARIA labels**: Wszystkie interaktywne elementy
- **Keyboard navigation**: Pełna obsługa klawiatury
- **Screen readers**: Kompatybilność z czytnikami ekranu
- **Color contrast**: Zgodność z WCAG 2.1 AA
- **Focus indicators**: Wyraźne wskaźniki focus

## 🔒 Bezpieczeństwo

- **File validation**: Walidacja typu i rozmiaru plików
- **RLS Policies**: Kontrola dostępu na poziomie bazy danych
- **HTTPS**: Wymagane dla upload'u plików
- **CORS**: Konfiguracja dla Supabase

## 📊 Monitoring

### Metryki Upload'u

- Czas przetwarzania obrazów
- Rozmiar przed/po kompresji
- Sukces/błędy upload'u
- Wykorzystanie storage

### Logi

```javascript
// Przykład logowania
console.log('Image processed:', {
  originalSize: '5MB',
  compressedSize: '1.2MB',
  dimensions: '1920x1080',
  format: 'webp'
});
```

## 🐛 Troubleshooting

### Częste Problemy

1. **Błąd CORS**
   - Sprawdź konfigurację Supabase
   - Upewnij się, że domena jest dodana do allowed origins

2. **Upload nie działa**
   - Sprawdź zmienne środowiskowe
   - Zweryfikuj RLS policies
   - Sprawdź limity bucket'a

3. **Obrazy nie ładują się**
   - Sprawdź publiczny dostęp do bucket'a
   - Zweryfikuj URL obrazów

### Debug Mode

Włącz tryb debug w konsoli:
```javascript
localStorage.setItem('debug', 'true');
```

## 📄 Licencja

MIT License - zobacz plik LICENSE dla szczegółów.

## 🤝 Contributing

1. Fork projektu
2. Utwórz branch dla feature (`git checkout -b feature/AmazingFeature`)
3. Commit zmian (`git commit -m 'Add some AmazingFeature'`)
4. Push do branch (`git push origin feature/AmazingFeature`)
5. Otwórz Pull Request

## 📞 Wsparcie

W przypadku problemów:
1. Sprawdź dokumentację
2. Przeszukaj Issues na GitHub
3. Utwórz nowy Issue z opisem problemu