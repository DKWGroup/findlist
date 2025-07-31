import React from "react";
import { BlogPreview } from "../components/BlogPreview";
import { Categories } from "../components/Categories";
import { CommunitySection } from "../components/CommunitySection";
import { Features } from "../components/Features";
import { Hero } from "../components/Hero";
import { HowItWorks } from "../components/HowItWorks";
import { Layout } from "../components/Layout";
import { MetaTags } from "../components/SEO/MetaTags";
import { WebsiteStructuredData } from "../components/SEO/StructuredData";
import { Testimonials } from "../components/Testimonials";
import { TrendingProducts } from "../components/TrendingProducts";

export const LandingPage: React.FC = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "FINDLIST",
    url: "https://findlist.net",
    description:
      "Katalog najlepszych viralowych produktów z TikToka i Instagrama",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://findlist.net/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
    publisher: {
      "@type": "Organization",
      name: "FINDLIST",
      url: "https://findlist.net",
      logo: {
        "@type": "ImageObject",
        url: "https://findlist.net/findlist-logo2.png",
      },
      sameAs: [
        "https://tiktok.com/@findlist_pl",
        "https://instagram.com/findlist.net",
      ],
    },
  };

  return (
    <>
      <MetaTags
        title="FINDLIST – Najlepsze viralowe produkty z TikToka i Instagrama"
        description="Odkryj najgorętsze trendy zakupowe z TikToka i Instagrama! FINDLIST to katalog viralowych produktów, recenzji i inspiracji. Przeglądaj, oceniaj, twórz wishlisty i kupuj przez sprawdzone linki afiliacyjne."
        keywords="viralowe produkty, TikTok, Instagram, trendy zakupowe, gadżety, prezenty, recenzje produktów, wishlist, social media shopping, viral shopping, hity z TikToka"
        canonical="https://findlist.net/"
        structuredData={structuredData}
      />
      <WebsiteStructuredData />

      <Layout showFooter={true}>
        <Hero />
        <TrendingProducts />
        {/* <Categories /> */}
        <Features />
        <BlogPreview />
        <HowItWorks />
        <CommunitySection />
        {/* <Testimonials /> */}
      </Layout>
    </>
  );
};
