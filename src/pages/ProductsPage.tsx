import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { FilterBar } from '../components/FilterBar';
import { ProductGrid } from '../components/ProductGrid';
import { MetaTags } from '../components/SEO/MetaTags';
import { Breadcrumbs } from '../components/SEO/Breadcrumbs';
import { products } from '../data/mockData';

export const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popularity');
  const [showTrendingOnly, setShowTrendingOnly] = useState(
    searchParams.get('trending') === 'true'
  );

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...products];

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Filter by trending
    if (showTrendingOnly) {
      filtered = filtered.filter(product => product.isTrending);
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'popularity':
          return b.popularity.views - a.popularity.views;
        case 'newest':
          return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
        case 'rating':
          return b.ratings.average - a.ratings.average;
        case 'price-low':
          const priceA = a.price.discounted || a.price.original || 0;
          const priceB = b.price.discounted || b.price.original || 0;
          return priceA - priceB;
        case 'price-high':
          const priceA2 = a.price.discounted || a.price.original || 0;
          const priceB2 = b.price.discounted || b.price.original || 0;
          return priceB2 - priceA2;
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchQuery, sortBy, showTrendingOnly]);

  const handleTrendingToggle = () => {
    const newValue = !showTrendingOnly;
    setShowTrendingOnly(newValue);
    const newParams = new URLSearchParams(searchParams);
    if (newValue) {
      newParams.set('trending', 'true');
    } else {
      newParams.delete('trending');
    }
    setSearchParams(newParams);
  };

  const breadcrumbItems = [
    { label: 'Produkty', current: true }
  ];

  const pageTitle = showTrendingOnly 
    ? "Trending Produkty - Najgorętsze viralowe hity z TikToka | VIRALIST"
    : "Wszystkie Produkty - Katalog viralowych produktów z social mediów | VIRALIST";

  const pageDescription = showTrendingOnly
    ? "Odkryj najgorętsze trending produkty z TikToka i Instagrama. Sprawdzone viralowe hity, które podbijają social media."
    : "Przeglądaj pełny katalog viralowych produktów z TikToka i Instagrama. Zweryfikowane produkty, szczere recenzje, najlepsze ceny.";

  return (
    <>
      <MetaTags
        title={pageTitle}
        description={pageDescription}
        canonical="https://viralist.pl/produkty"
        keywords="viralowe produkty, katalog produktów, TikTok produkty, Instagram produkty, trending, viral shopping"
      />
      
      <Layout showFooter={false}>
        <div className="bg-white border-b border-gray-200 py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Breadcrumbs items={breadcrumbItems} />
          </div>
        </div>

        <FilterBar
          sortBy={sortBy}
          onSortChange={setSortBy}
          showTrendingOnly={showTrendingOnly}
          onTrendingToggle={handleTrendingToggle}
        />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Results Summary */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {showTrendingOnly ? 'Trending Produkty' : 'Wszystkie Produkty'}
            </h1>
            <p className="text-gray-600">
              Znaleziono {filteredAndSortedProducts.length} produktów
              {showTrendingOnly && ' (tylko trendy)'}
            </p>
            
            {showTrendingOnly && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="text-red-600 text-lg">🔥</span>
                  <div>
                    <h3 className="font-medium text-red-900">Najgorętsze trendy</h3>
                    <p className="text-red-700 text-sm">
                      Produkty, które obecnie podbijają TikToka i Instagrama
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Products Grid */}
          <ProductGrid products={filteredAndSortedProducts} />

          {/* SEO Content */}
          <div className="mt-16 bg-gray-50 rounded-2xl p-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                {showTrendingOnly 
                  ? "Dlaczego warto śledzić trending produkty?"
                  : "Największy katalog viralowych produktów w Polsce"
                }
              </h2>
              
              {showTrendingOnly ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">🚀 Bądź pierwszy</h3>
                    <p className="text-gray-600 text-sm mb-4">
                      Trending produkty to te, które dopiero zaczynają podbijać social media. 
                      Kupując je wcześnie, możesz być trendsetter w swoim otoczeniu.
                    </p>
                    
                    <h3 className="font-semibold text-gray-900 mb-3">💰 Lepsze ceny</h3>
                    <p className="text-gray-600 text-sm">
                      Produkty w fazie trending często mają lepsze ceny promocyjne, 
                      zanim staną się mainstream i ich ceny wzrosną.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">📱 Sprawdzone źródła</h3>
                    <p className="text-gray-600 text-sm mb-4">
                      Monitorujemy TikToka i Instagrama 24/7, aby wyłapać produkty 
                      w momencie, gdy zaczynają zyskiwać popularność.
                    </p>
                    
                    <h3 className="font-semibold text-gray-900 mb-3">✅ Zweryfikowana jakość</h3>
                    <p className="text-gray-600 text-sm">
                      Każdy trending produkt przechodzi przez nasz proces weryfikacji 
                      jakości i wiarygodności sprzedawcy.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">🔍 Wszystko w jednym miejscu</h3>
                    <p className="text-gray-600 text-sm">
                      Przeglądaj kompletny katalog viralowych produktów z różnych kategorii. 
                      Od gadżetów tech po produkty beauty - znajdziesz tu wszystko, co jest popularne w social mediach.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">⭐ Sprawdzone recenzje</h3>
                    <p className="text-gray-600 text-sm">
                      Każdy produkt ma szczegółowe recenzje od naszej społeczności. 
                      Sprawdź opinie innych użytkowników przed zakupem i podejmij świadomą decyzję.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">💸 Najlepsze oferty</h3>
                    <p className="text-gray-600 text-sm">
                      Porównujemy ceny z różnych sklepów i pokazujemy najkorzystniejsze opcje zakupu. 
                      Oszczędzaj czas i pieniądze dzięki naszym sprawdzonym linkom afiliacyjnym.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </Layout>
    </>
  );
};