// Schema Markup generators for different page types

export const generateOrganizationSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "FINDLIST",
    alternateName: "findlist.net",
    url: "https://findlist.net",
    logo: "https://findlist.net/findlist-logo.png",
    description:
      "Pierwsza w Polsce platforma agregująca viralne produkty z mediów społecznościowych. Odkryj trendy zanim staną się mainstream.",
    foundingDate: "2024",
    founders: [
      {
        "@type": "Person",
        name: "FINDLIST Team",
      },
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+48-000-000-000",
      contactType: "customer support",
      availableLanguage: "Polish",
    },
    sameAs: [
      "https://www.facebook.com/findlist",
      "https://www.instagram.com/findlist",
      "https://twitter.com/findlist_pl",
    ],
    address: {
      "@type": "PostalAddress",
      addressCountry: "PL",
      addressLocality: "Warszawa",
    },
  };
};

export const generateWebSiteSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "FINDLIST",
    url: "https://findlist.net",
    description:
      "Katalog najlepszych viralowych produktów z TikToka i Instagrama",
    publisher: {
      "@type": "Organization",
      name: "FINDLIST",
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://findlist.net/search?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
    mainEntity: {
      "@type": "WebPage",
      "@id": "https://findlist.net/#webpage",
    },
  };
};

export const generateBreadcrumbSchema = (
  breadcrumbs: Array<{ name: string; url: string }>
) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
};

export const generateProductSchema = (product: any) => {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images,
    brand: {
      "@type": "Brand",
      name: product.brand || "Generic",
    },
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "PLN",
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: "FINDLIST",
      },
      url: product.affiliateUrl,
    },
    aggregateRating: product.rating
      ? {
          "@type": "AggregateRating",
          ratingValue: product.rating,
          reviewCount: product.reviewCount || 1,
          bestRating: 5,
          worstRating: 1,
        }
      : undefined,
    review: product.reviews
      ? product.reviews.map((review: any) => ({
          "@type": "Review",
          author: {
            "@type": "Person",
            name: review.author,
          },
          reviewRating: {
            "@type": "Rating",
            ratingValue: review.rating,
            bestRating: 5,
            worstRating: 1,
          },
          reviewBody: review.comment,
        }))
      : undefined,
  };
};

export const generateArticleSchema = (article: any) => {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.excerpt,
    image: article.featuredImage,
    author: {
      "@type": "Person",
      name: article.author || "FINDLIST Team",
    },
    publisher: {
      "@type": "Organization",
      name: "FINDLIST",
      logo: {
        "@type": "ImageObject",
        url: "https://findlist.net/findlist-logo.png",
      },
    },
    datePublished: article.publishedAt,
    dateModified: article.updatedAt || article.publishedAt,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": article.url,
    },
    articleSection: article.category,
    keywords: article.tags?.join(", "),
    wordCount: article.content?.length || 0,
  };
};

export const generateFAQSchema = (
  faqs: Array<{ question: string; answer: string }>
) => {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
};

export const generateLocalBusinessSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "FINDLIST",
    description: "Platforma viralowych produktów z mediów społecznościowych",
    url: "https://findlist.net",
    address: {
      "@type": "PostalAddress",
      addressCountry: "PL",
      addressLocality: "Warszawa",
    },
    openingHours: "Mo-Su 00:00-23:59",
    telephone: "+48-000-000-000",
    priceRange: "$$",
    currenciesAccepted: "PLN",
    paymentAccepted: "Cash, Credit Card",
  };
};
