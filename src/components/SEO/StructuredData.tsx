import React from "react";
import { Product } from "../../types";
import { BlogPost } from "../../types/blog";

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
      name: "VIRALIST",
    },
    offers: {
      "@type": "Offer",
      price: product.price.discounted || product.price.original,
      priceCurrency: product.price.currency,
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: "VIRALIST",
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
      ? `https://findlist.net/${product.urlAlias}`
      : `https://findlist.net/product/${product.id}`,
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
      name: "VIRALIST",
      logo: {
        "@type": "ImageObject",
        url: "https://findlist.net/logo.png",
      },
    },
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://findlist.net/blog/${post.slug}`,
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
  searchUrl = "https://findlist.net/search?q={search_term_string}",
}) => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "VIRALIST",
    url: "https://findlist.net",
    description:
      "Katalog najlepszych viralowych produktów z TikToka i Instagrama",
    potentialAction: {
      "@type": "SearchAction",
      target: searchUrl,
      "query-input": "required name=search_term_string",
    },
    publisher: {
      "@type": "Organization",
      name: "VIRALIST",
      logo: {
        "@type": "ImageObject",
        url: "https://findlist.net/findlist-logo2.png",
      },
    },
    sameAs: [
      "https://tiktok.com/@findlist_pl",
      "https://instagram.com/findlist.net",
    ],
  };

  return (
    <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
  );
};
