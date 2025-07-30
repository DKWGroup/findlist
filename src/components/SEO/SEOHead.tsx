import React from "react";
import { Helmet } from "react-helmet-async";

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: string;
  noIndex?: boolean;
  structuredData?: object;
  hreflang?: Array<{
    lang: string;
    url: string;
  }>;
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title = "FINDLIST – Najlepsze viralowe produkty z TikToka i Instagrama",
  description = "Odkryj najgorętsze trendy zakupowe z TikToka i Instagrama! FINDLIST to katalog viralowych produktów, recenzji i inspiracji. Przeglądaj, oceniaj, twórz wishlisty i kupuj przez sprawdzone linki afiliacyjne.",
  keywords = "viralowe produkty, TikTok, Instagram, trendy zakupowe, gadżety, prezenty, recenzje produktów, wishlist, social media shopping, viral shopping, hity z TikToka",
  canonicalUrl = "https://findlist.pl/",
  ogImage = "https://findlist.pl/og-image.png",
  ogType = "website",
  noIndex = false,
  structuredData,
  hreflang = [],
}) => {
  const truncatedTitle =
    title.length > 60 ? title.substring(0, 57) + "..." : title;
  const truncatedDescription =
    description.length > 155
      ? description.substring(0, 152) + "..."
      : description;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{truncatedTitle}</title>
      <meta name="description" content={truncatedDescription} />
      <meta name="keywords" content={keywords} />

      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />

      {/* Robots */}
      <meta
        name="robots"
        content={noIndex ? "noindex, nofollow" : "index, follow"}
      />
      <meta
        name="googlebot"
        content={noIndex ? "noindex, nofollow" : "index, follow"}
      />

      {/* Author */}
      <meta name="author" content="FINDLIST" />
      <meta name="publisher" content="FINDLIST" />

      {/* Language */}
      <meta httpEquiv="content-language" content="pl" />

      {/* Open Graph */}
      <meta property="og:title" content={truncatedTitle} />
      <meta property="og:description" content={truncatedDescription} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:alt" content={truncatedTitle} />
      <meta property="og:site_name" content="FINDLIST" />
      <meta property="og:locale" content="pl_PL" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={truncatedTitle} />
      <meta name="twitter:description" content={truncatedDescription} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content={truncatedTitle} />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:site" content="@findlist_pl" />
      <meta name="twitter:creator" content="@findlist_pl" />

      {/* Additional Meta Tags */}
      <meta name="theme-color" content="#2563eb" />
      <meta name="msapplication-TileColor" content="#2563eb" />
      <meta name="apple-mobile-web-app-title" content="FINDLIST" />
      <meta name="application-name" content="VIRALIST" />

      {/* Hreflang */}
      {hreflang.map((item, index) => (
        <link
          key={index}
          rel="alternate"
          hrefLang={item.lang}
          href={item.url}
        />
      ))}

      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEOHead;
