import React from 'react';
import { Product } from '../../types';
import { BlogPost } from '../../types/blog';

interface ProductStructuredDataProps {
  product: Product;
}

interface BlogStructuredDataProps {
  post: BlogPost;
}

interface WebsiteStructuredDataProps {
  searchUrl?: string;
}

export const ProductStructuredData: React.FC<ProductStructuredDataProps> = ({ product }) => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.title,
    "description": product.description,
    "image": product.images,
    "sku": product.code || product.id,
    "brand": {
      "@type": "Brand",
      "name": "VIRALIST"
    },
    "offers": {
      "@type": "Offer",
      "price": product.price.discounted || product.price.original,
      "priceCurrency": product.price.currency,
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "VIRALIST"
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": product.ratings.average,
      "reviewCount": product.ratings.count,
      "bestRating": 5,
      "worstRating": 1
    },
    "category": product.category,
    "url": product.urlAlias ? `https://viralist.pl/${product.urlAlias}` : `https://viralist.pl/product/${product.id}`
  };

  return (
    <script type="application/ld+json">
      {JSON.stringify(structuredData)}
    </script>
  );
};

export const BlogStructuredData: React.FC<BlogStructuredDataProps> = ({ post }) => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.excerpt,
    "image": post.featuredImage,
    "author": {
      "@type": "Person",
      "name": post.author.name
    },
    "publisher": {
      "@type": "Organization",
      "name": "VIRALIST",
      "logo": {
        "@type": "ImageObject",
        "url": "https://viralist.pl/logo.png"
      }
    },
    "datePublished": post.publishedAt,
    "dateModified": post.updatedAt,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://viralist.pl/blog/${post.slug}`
    },
    "articleSection": post.category,
    "keywords": post.tags.join(", ")
  };

  // Add review-specific structured data
  if (post.type === 'review' && post.overallRating) {
    structuredData["@type"] = "Review";
    structuredData["reviewRating"] = {
      "@type": "Rating",
      "ratingValue": post.overallRating,
      "bestRating": 5,
      "worstRating": 1
    };
    
    if (post.productId) {
      structuredData["itemReviewed"] = {
        "@type": "Product",
        "name": post.title.replace(" - recenzja", "").replace(" recenzja", "")
      };
    }
  }

  return (
    <script type="application/ld+json">
      {JSON.stringify(structuredData)}
    </script>
  );
};

export const WebsiteStructuredData: React.FC<WebsiteStructuredDataProps> = ({ 
  searchUrl = "https://viralist.pl/search?q={search_term_string}" 
}) => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "VIRALIST",
    "url": "https://viralist.pl",
    "description": "Katalog najlepszych viralowych produktów z TikToka i Instagrama",
    "potentialAction": {
      "@type": "SearchAction",
      "target": searchUrl,
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "name": "VIRALIST",
      "logo": {
        "@type": "ImageObject",
        "url": "https://viralist.pl/viralist-logo2.png"
      }
    },
    "sameAs": [
      "https://tiktok.com/@viralist_pl",
      "https://instagram.com/viralist.pl"
    ]
  };

  return (
    <script type="application/ld+json">
      {JSON.stringify(structuredData)}
    </script>
  );
};