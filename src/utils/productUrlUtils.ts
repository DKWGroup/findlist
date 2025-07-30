// Utility functions for product URL generation and management

import { generateSlug } from "./seoUtils";

export interface ProductUrlConfig {
  shortUrl: string; // /KK-TT-NNN
  longUrl: string; // /produkty/dlugi-pasek-do-telefonu
  canonicalUrl: string; // główny URL (długi)
}

/**
 * Generate long URL based on product title
 * Przykład: "Długi pasek do telefonu" -> "/produkty/dlugi-pasek-do-telefonu"
 */
export const generateProductLongUrl = (title: string): string => {
  const slug = generateSlug(title);
  return `/produkty/${slug}`;
};

/**
 * Generate short URL based on product code
 * Przykład: "KK-TT-001" -> "/KK-TT-001"
 */
export const generateProductShortUrl = (code: string): string => {
  return `/${code}`;
};

/**
 * Generate both URLs for a product
 */
export const generateProductUrls = (
  title: string,
  code: string
): ProductUrlConfig => {
  const longUrl = generateProductLongUrl(title);
  const shortUrl = generateProductShortUrl(code);

  return {
    shortUrl,
    longUrl,
    canonicalUrl: longUrl, // długi URL jest głównym/kanonicznym
  };
};

/**
 * Check if a path is a short product URL (matches code pattern)
 * Pattern: XX-YY-NNN where XX=category, YY=type, NNN=number
 */
export const isShortProductUrl = (path: string): boolean => {
  // Remove leading slash if present
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;

  // Pattern: 2-3 uppercase letters, dash, 2-3 uppercase letters, dash, 3+ digits
  const shortUrlPattern = /^[A-Z]{2,3}-[A-Z]{2,3}-\d{3,}$/;

  return shortUrlPattern.test(cleanPath);
};

/**
 * Check if a path is a long product URL
 */
export const isLongProductUrl = (path: string): boolean => {
  return path.startsWith("/produkty/") && path.length > "/produkty/".length;
};

/**
 * Extract product slug from long URL
 * Przykład: "/produkty/dlugi-pasek-do-telefonu" -> "dlugi-pasek-do-telefonu"
 */
export const extractSlugFromLongUrl = (path: string): string | null => {
  if (!isLongProductUrl(path)) {
    return null;
  }

  return path.replace("/produkty/", "");
};

/**
 * Extract product code from short URL
 * Przykład: "/KK-TT-001" -> "KK-TT-001"
 */
export const extractCodeFromShortUrl = (path: string): string | null => {
  if (!isShortProductUrl(path)) {
    return null;
  }

  return path.startsWith("/") ? path.slice(1) : path;
};

/**
 * Determine URL type and extract identifier
 */
export const parseProductUrl = (
  path: string
): {
  type: "short" | "long" | "id" | "unknown";
  identifier: string | null;
} => {
  if (isShortProductUrl(path)) {
    return {
      type: "short",
      identifier: extractCodeFromShortUrl(path),
    };
  }

  if (isLongProductUrl(path)) {
    return {
      type: "long",
      identifier: extractSlugFromLongUrl(path),
    };
  }

  // Check if it's a direct ID path (e.g., /produkt/uuid)
  if (path.startsWith("/produkt/")) {
    return {
      type: "id",
      identifier: path.replace("/produkt/", ""),
    };
  }

  return {
    type: "unknown",
    identifier: null,
  };
};

/**
 * Generate URL slug alias for database storage
 * This combines the functionality for database storage
 */
export const generateUrlSlugForProduct = (title: string): string => {
  const slug = generateSlug(title);
  return slug; // Store only the slug part, not the full path
};
