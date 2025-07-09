import React from 'react';
import { Layout } from '../components/Layout';
import { Hero } from '../components/Hero';
import { TrendingProducts } from '../components/TrendingProducts';
import { Categories } from '../components/Categories';
import { Features } from '../components/Features';
import { BlogPreview } from '../components/BlogPreview';
import { HowItWorks } from '../components/HowItWorks';
import { CommunitySection } from '../components/CommunitySection';
import { Testimonials } from '../components/Testimonials';
import { MetaTags } from '../components/SEO/MetaTags';
import { WebsiteStructuredData } from '../components/SEO/StructuredData';

export const LandingPage: React.FC = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "VIRALIST",
    "url": "https://viralist.pl",
    "description": "Katalog najlepszych viralowych produktów z TikToka i Instagrama",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://viralist.pl/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "name": "VIRALIST",
      "url": "https://viralist.pl",
      "logo": {
        "@type": "ImageObject",
        "url": "https://viralist.pl/viralist-logo2.png"
      },
      "sameAs": [
        "https://tiktok.com/@viralist_pl",
        "https://instagram.com/viralist.pl"
      ]
    }
  };

  return (
    <>
      <MetaTags
        title="VIRALIST – Najlepsze viralowe produkty z TikToka i Instagrama"
        description="Odkryj najgorętsze trendy zakupowe z TikToka i Instagrama! VIRALIST to katalog viralowych produktów, recenzji i inspiracji. Przeglądaj, oceniaj, twórz wishlisty i kupuj przez sprawdzone linki afiliacyjne."
        keywords="viralowe produkty, TikTok, Instagram, trendy zakupowe, gadżety, prezenty, recenzje produktów, wishlist, social media shopping, viral shopping, hity z TikToka"
        canonical="https://viralist.pl/"
        structuredData={structuredData}
      />
      <WebsiteStructuredData />
      
      <Layout showFooter={true}>
        <Hero />
        <TrendingProducts />
        <Categories />
        <Features />
        <BlogPreview />
        <HowItWorks />
        <CommunitySection />
        <Testimonials />
      </Layout>
    </>
  );
};