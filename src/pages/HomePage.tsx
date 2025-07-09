import React, { useState, useMemo } from 'react';
import { Header } from '../components/Header';
import { CategoryNav } from '../components/CategoryNav';
import { FilterBar } from '../components/FilterBar';
import { ProductGrid } from '../components/ProductGrid';
import { products } from '../data/mockData';
import { Product } from '../types';

export const HomePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('popularity');
  const [showTrendingOnly, setShowTrendingOnly] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>([]);

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

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(product => product.category === selectedCategory);
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
  }, [searchQuery, selectedCategory, sortBy, showTrendingOnly]);

  const handleWishlistToggle = (productId: string) => {
    setWishlist(prev => 
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onSearch={setSearchQuery} />
      <CategoryNav 
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
      />
      <FilterBar
        sortBy={sortBy}
        onSortChange={setSortBy}
        showTrendingOnly={showTrendingOnly}
        onTrendingToggle={() => setShowTrendingOnly(!showTrendingOnly)}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Results Summary */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {searchQuery ? `Wyniki dla "${searchQuery}"` : 'Viralne Produkty'}
          </h1>
          <p className="text-gray-600">
            Znaleziono {filteredAndSortedProducts.length} produktów
            {selectedCategory && ` w kategorii`}
            {showTrendingOnly && ` (tylko trendy)`}
          </p>
        </div>

        {/* Products Grid */}
        <ProductGrid
          products={filteredAndSortedProducts}
          onWishlistToggle={handleWishlistToggle}
          wishlist={wishlist}
        />
      </main>
    </div>
  );
};