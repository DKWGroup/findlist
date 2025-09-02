import React from "react";
import { Helmet } from "react-helmet-async";

interface MetaTagsProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  structuredData?: object;
  noIndex?: boolean;
  prevPage?: string;
  nextPage?: string;
}

export const MetaTags: React.FC<MetaTagsProps> = ({
  title = "FINDLIST – Najlepsze viralowe produkty z TikToka i Instagrama",
  description = "Odkryj najgorętsze trendy zakupowe z TikToka i Instagrama! FINDLIST to katalog viralowych produktów, recenzji i inspiracji.",
  keywords = "viralowe produkty, TikTok, Instagram, trendy zakupowe, gadżety, prezenty, recenzje produktów",
  canonical,
  ogImage = "https://findlist.net/og-image.png",
  ogType = "website",
  structuredData,
  noIndex = false,
  prevPage,
  nextPage,
}) => {
  const fullTitle = title.length <= 60 ? title : title.substring(0, 57) + "...";
  const fullDescription =
    description.length <= 155
      ? description
      : description.substring(0, 152) + "...";
  const currentUrl =
    canonical ||
    (typeof window !== "undefined"
      ? window.location.href
      : "https://findlist.net");

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={fullDescription} />
      <meta name="keywords" content={keywords} />

      {/* Robots */}
      <meta
        name="robots"
        content={noIndex ? "noindex, nofollow" : "index, follow"}
      />
      <meta
        name="googlebot"
        content={noIndex ? "noindex, nofollow" : "index, follow"}
      />

      {/* Canonical */}
      <link rel="canonical" href={currentUrl} />

      {/* Pagination */}
      {prevPage && <link rel="prev" href={prevPage} />}
      {nextPage && <link rel="next" href={nextPage} />}

      {/* Open Graph */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content="pl_PL" />
      <meta property="og:site_name" content="FINDLIST" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={fullDescription} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:site" content="@findlist_pl" />

      {/* Additional SEO */}
      <meta name="author" content="FINDLIST" />
      <meta name="publisher" content="FINDLIST" />
      <meta name="language" content="pl" />
      <meta name="geo.region" content="PL" />
      <meta name="geo.country" content="Poland" />

      {/* Mobile */}
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, maximum-scale=5.0"
      />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />

      {/* Performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://images.pexels.com" />
      <link rel="dns-prefetch" href="https://temu.com" />
      <link rel="dns-prefetch" href="https://aliexpress.com" />
      <link rel="dns-prefetch" href="https://amazon.com" />

      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};
