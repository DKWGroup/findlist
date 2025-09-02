import { useMemo } from "react";
import { useLocation } from "react-router-dom";

interface SEOConfig {
  title: string;
  description: string;
  keywords: string;
  canonicalUrl: string;
  ogImage?: string;
  ogType?: string;
  noIndex?: boolean;
}

export const useSEO = (pageConfig?: Partial<SEOConfig>) => {
  const location = useLocation();

  const defaultConfig: SEOConfig = {
    title: "VIRALIST – Najlepsze viralowe produkty z TikToka i Instagrama",
    description:
      "Odkryj najgorętsze trendy zakupowe z TikToka i Instagrama! VIRALIST to katalog viralowych produktów, recenzji i inspiracji.",
    keywords:
      "viralowe produkty, TikTok, Instagram, trendy zakupowe, gadżety, prezenty, recenzje produktów, wishlist, social media shopping",
    canonicalUrl: `https://findlist.net${location.pathname}`,
    ogImage: "https://findlist.net/og-image.png",
    ogType: "website",
    noIndex: false,
  };

  const seoConfig = useMemo(() => {
    return { ...defaultConfig, ...pageConfig };
  }, [pageConfig, location.pathname]);

  const breadcrumbs = useMemo(() => {
    const pathSegments = location.pathname.split("/").filter(Boolean);
    const breadcrumbItems = [];

    let currentPath = "";
    for (const segment of pathSegments) {
      currentPath += `/${segment}`;

      // Map path segments to human-readable names
      const nameMapping: Record<string, string> = {
        produkty: "Produkty",
        blog: "Blog",
        kategorie: "Kategorie",
        search: "Wyszukiwanie",
        profil: "Profil",
        kontakt: "Kontakt",
        "o-nas": "O nas",
        regulamin: "Regulamin",
        "polityka-prywatnosci": "Polityka prywatności",
        admin: "Panel administracyjny",
      };

      breadcrumbItems.push({
        name:
          nameMapping[segment] ||
          segment.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
        url: `https://findlist.net${currentPath}`,
      });
    }

    return breadcrumbItems;
  }, [location.pathname]);

  return {
    seoConfig,
    breadcrumbs,
    isHomePage: location.pathname === "/",
    currentPath: location.pathname,
  };
};
