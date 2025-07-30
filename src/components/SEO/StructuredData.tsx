import React from "react";
import { Product } from "../../types";
import { BlogPost } from "../../types/blog";
import { generateProductLongUrl } from "../../utils/productUrlUtils";

interface ProductStructuredDataProps {
  product: Product;
}

interface BlogStructuredDataProps {
  post: BlogPost;
}

interface WebsiteStructuredDataProps {
  searchUrl?: string;
}

export const ProductStructuredData: React.FC<ProductStructuredDataProps> = ({
  product,
}) => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.images,
    sku: product.code || product.id,
    brand: {
      "@type": "Brand",
      name: "FINDLIST",
    },
    offers: {
      "@type": "Offer",
      price: product.price.discounted || product.price.original,
      priceCurrency: product.price.currency,
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: "FINDLIST",
      },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.ratings.average,
      reviewCount: product.ratings.count,
      bestRating: 5,
      worstRating: 1,
    },
    category: product.category,
    url: product.urlAlias
      ? `https://findlist.pl/produkty/${product.urlAlias}`
      : `https://findlist.pl${generateProductLongUrl(product.title)}`,
  };

  return (
    <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
  );
};

export const BlogStructuredData: React.FC<BlogStructuredDataProps> = ({
  post,
}) => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: post.featuredImage,
    author: {
      "@type": "Person",
      name: post.author.name,
    },
    publisher: {
      "@type": "Organization",
      name: "FINDLIST",
      logo: {
        "@type": "ImageObject",
        url: "https://findlist.pl/logo.png",
      },
    },
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://findlist.pl/blog/${post.slug}`,
    },
    articleSection: post.category,
    keywords: post.tags.join(", "),
  };

  // Add review-specific structured data
  if (post.type === "review" && post.overallRating) {
    structuredData["@type"] = "Review";
    structuredData["reviewRating"] = {
      "@type": "Rating",
      ratingValue: post.overallRating,
      bestRating: 5,
      worstRating: 1,
    };

    if (post.productId) {
      structuredData["itemReviewed"] = {
        "@type": "Product",
        name: post.title.replace(" - recenzja", "").replace(" recenzja", ""),
      };
    }
  }

  return (
    <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
  );
};

export const WebsiteStructuredData: React.FC<WebsiteStructuredDataProps> = ({
  searchUrl = "https://findlist.pl/search?q={search_term_string}",
}) => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "FINDLIST",
    url: "https://findlist.pl",
    description:
      "Katalog najlepszych viralowych produktów z TikToka i Instagrama",
    potentialAction: {
      "@type": "SearchAction",
      target: searchUrl,
      "query-input": "required name=search_term_string",
    },
    publisher: {
      "@type": "Organization",
      name: "FINDLIST",
      logo: {
        "@type": "ImageObject",
        url: "https://findlist.pl/findlist-logo2.png",
      },
    },
    sameAs: [
      "https://tiktok.com/@findlist_pl",
      "https://instagram.com/findlist.pl",
    ],
  };

  return (
    <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
  );
};
