# SEO Setup Documentation

## Przegląd zaimplementowanych optymalizacji SEO

### 1. Podstawowe Meta Tagi

✅ **Zaimplementowane:**

- Unikalny meta title (automatyczne skracanie do 60 znaków)
- Meta description (automatyczne skracanie do 155 znaków)
- Canonical URL
- Robots meta tag
- Keywords meta tag
- Author i Publisher meta tags

### 2. Open Graph

✅ **Zaimplementowane:**

- og:title
- og:description
- og:image (1200x630px)
- og:url
- og:type
- og:site_name
- og:locale
- Twitter Card

### 3. Favicony i PWA

✅ **Zaimplementowane:**

- manifest.json z konfiguracją PWA
- Meta tagi dla theme-color
- Linki do różnych rozmiarów ikon

⚠️ **Do uzupełnienia:**

- Rzeczywiste pliki favicon (obecnie placeholder)
- Ikony PWA w różnych rozmiarach
- og-image.png (obraz 1200x630px)

### 4. Schema Markup

✅ **Zaimplementowane:**

- Organization Schema
- WebSite Schema
- BreadcrumbList Schema
- Product Schema
- Article/BlogPosting Schema
- FAQ Schema
- LocalBusiness Schema

### 5. Dodatkowe elementy SEO

✅ **Zaimplementowane:**

- Sitemap XML (główny + produkty + blog)
- robots.txt (rozszerzony)
- Komponenty ExternalLink z rel="nofollow"
- Zoptymalizowane nagłówki H1-H6
- Komponent OptimizedImage z alt tagami
- Security.txt
- Breadcrumbs z Schema Markup

## Jak używać komponentów SEO

### SEOHead Component

```tsx
import SEOHead from "../components/SEO/SEOHead";

<SEOHead
  title="Tytuł strony - VIRALIST"
  description="Opis strony (max 155 znaków)"
  canonicalUrl="https://viralist.pl/strona"
  ogImage="https://viralist.pl/obrazek.jpg"
  ogType="website" // lub "article", "product"
  structuredData={schemaObject}
  noIndex={false} // true dla stron które nie mają być indeksowane
/>;
```

### Breadcrumbs Component

```tsx
import { Breadcrumbs } from "../components/SEO/Breadcrumbs";

<Breadcrumbs
  items={[
    { label: "Produkty", href: "/produkty" },
    { label: "Elektronika", href: "/kategoria/elektronika" },
    { label: "Nazwa produktu", current: true },
  ]}
/>;
```

### OptimizedImage Component

```tsx
import OptimizedImage from "../components/SEO/OptimizedImage";

<OptimizedImage
  src="/image.jpg"
  alt="Opisowy tekst alternatywny"
  width={800}
  height={600}
  loading="lazy"
  quality={85}
/>;
```

### ExternalLink Component

```tsx
import ExternalLink from "../components/SEO/ExternalLink";

<ExternalLink
  href="https://external-site.com"
  sponsored={true} // dla linków afiliacyjnych
  nofollow={true}
  newTab={true}
>
  Link text
</ExternalLink>;
```

### Heading Components

```tsx
import { H1, H2, H3 } from '../components/SEO/Heading';

<H1>Główny nagłówek strony</H1>
<H2>Sekcja</H2>
<H3>Podsekcja</H3>
```

### FAQ Component

```tsx
import FAQ from "../components/SEO/FAQ";

const faqs = [
  {
    question: "Jak działa VIRALIST?",
    answer:
      "VIRALIST agreguje popularne produkty z mediów społecznościowych...",
  },
];

<FAQ faqs={faqs} />;
```

### Schema Markup

```tsx
import {
  generateProductSchema,
  generateArticleSchema,
} from "../components/SEO/SchemaMarkup";

// Dla produktu
const productSchema = generateProductSchema(product);

// Dla artykułu
const articleSchema = generateArticleSchema(article);

// Użycie w SEOHead
<SEOHead structuredData={productSchema} />;
```

## Przykłady użycia na różnych stronach

### Strona produktu

```tsx
import SEOHead from "../components/SEO/SEOHead";
import { Breadcrumbs } from "../components/SEO/Breadcrumbs";
import { generateProductSchema } from "../components/SEO/SchemaMarkup";

export const ProductPage = ({ product }) => {
  const productSchema = generateProductSchema(product);

  return (
    <>
      <SEOHead
        title={`${product.title} - VIRALIST`}
        description={product.description}
        canonicalUrl={`https://viralist.pl/produkt/${product.id}`}
        ogImage={product.images[0]}
        ogType="product"
        structuredData={productSchema}
      />

      <Breadcrumbs
        items={[
          { label: "Produkty", href: "/produkty" },
          { label: product.category, href: `/kategoria/${product.category}` },
          { label: product.title, current: true },
        ]}
      />

      {/* Reszta komponentu */}
    </>
  );
};
```

### Strona artykułu

```tsx
import SEOHead from "../components/SEO/SEOHead";
import { generateArticleSchema } from "../components/SEO/SchemaMarkup";

export const BlogPostPage = ({ article }) => {
  const articleSchema = generateArticleSchema(article);

  return (
    <>
      <SEOHead
        title={`${article.title} - Blog VIRALIST`}
        description={article.excerpt}
        canonicalUrl={`https://viralist.pl/blog/${article.slug}`}
        ogImage={article.featuredImage}
        ogType="article"
        structuredData={articleSchema}
      />

      {/* Reszta komponentu */}
    </>
  );
};
```

## Do zrobienia (TODO)

1. **Ikony i obrazy:**

   - [ ] Wygenerować prawdziwe favicony (16x16, 32x32, 180x180)
   - [ ] Utworzyć ikony PWA (72x72, 96x96, 128x128, 144x144, 152x152, 192x192, 384x384, 512x512)
   - [x] Przygotować og-image.png (1200x630px) - DODANE
   - [ ] Dodać apple-touch-icon.png

2. **Konfiguracja serwera:**

   - [ ] Skonfigurować proper Content-Type headers
   - [ ] Dodać Security Headers
   - [ ] Skonfigurować Cache Headers
   - [ ] Dodać robots.txt na serwer

3. **Analytics i monitorowanie:**

   - [ ] Dodać Google Analytics 4
   - [ ] Skonfigurować Google Search Console
   - [ ] Dodać monitoring błędów (Sentry)

4. **Testowanie:**
   - [ ] Walidacja w Google Rich Results Test
   - [ ] Test w Facebook Debugger
   - [ ] Test w Twitter Card Validator
   - [ ] Lighthouse SEO audit
   - [ ] Walidacja Schema.org

## Narzędzia do testowania

1. **Google Rich Results Test:** https://search.google.com/test/rich-results
2. **Facebook Sharing Debugger:** https://developers.facebook.com/tools/debug/
3. **Twitter Card Validator:** https://cards-dev.twitter.com/validator
4. **Schema.org Validator:** https://validator.schema.org/
5. **Lighthouse:** https://pagespeed.web.dev/
