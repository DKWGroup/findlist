import React, { useState, useEffect } from 'react';
import { Sparkles, TrendingUp, Heart, Clock, ArrowRight } from 'lucide-react';
import { Product } from '../../types';
import { SearchContext } from '../../types/search';
import { Link } from 'react-router-dom';
import { searchService } from '../../services/searchService';
import { LazyImage } from '../Performance/LazyImage';

interface SmartRecommendationsProps {
  context?: Partial<SearchContext>;
  currentProductId?: string;
  userId?: string;
  className?: string;
}

export const SmartRecommendations: React.FC<SmartRecommendationsProps> = ({
  context = {},
  currentProductId,
  userId,
  className = ""
}) => {
  const [recommendations, setRecommendations] = useState<{
    seasonal: Product[];
    contextual: Product[];
    complementary: Product[];
    frequentlyBought: Product[];
  }>({
    seasonal: [],
    contextual: [],
    complementary: [],
    frequentlyBought: []
  });
  
  const [activeTab, setActiveTab] = useState<'seasonal' | 'contextual' | 'complementary' | 'frequentlyBought'>('seasonal');
  const [isLoading, setIsLoading] = useState(true);

  // Track loading state for images
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});

  const handleImageLoad = (productId: string) => {
    setLoadedImages(prev => ({
      ...prev,
      [productId]: true
    }));
  };

  const handleImageError = (productId: string) => {
    setLoadedImages(prev => ({
      ...prev,
      [productId]: false
    }));
  };

  useEffect(() => {
    const fetchRecommendations = async () => {
      setIsLoading(true);
      
      try {
        // Get seasonal recommendations
        const seasonal = searchService.getSeasonalRecommendations(context.season);
        
        // Get contextual recommendations
        const contextual = searchService.getContextualRecommendations(context);
        
        // Get product-specific recommendations if we have a current product
        let complementary: Product[] = [];
        let frequentlyBought: Product[] = [];
        
        if (currentProductId) {
          complementary = searchService.getRelatedProducts(currentProductId, 'complementary');
          frequentlyBought = searchService.getRelatedProducts(currentProductId, 'frequently-bought');
        }
        
        setRecommendations({
          seasonal: seasonal.slice(0, 8),
          contextual: contextual.slice(0, 8),
          complementary: complementary.slice(0, 6),
          frequentlyBought: frequentlyBought.slice(0, 6)
        });
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, [context, currentProductId]);

  const tabs = [
    {
      id: 'seasonal' as const,
      label: 'Sezonowe',
      icon: Clock,
      description: 'Produkty idealne na obecną porę roku',
      products: recommendations.seasonal
    },
    {
      id: 'contextual' as const,
      label: 'Dla Ciebie',
      icon: Sparkles,
      description: 'Dopasowane do Twoich potrzeb',
      products: recommendations.contextual
    },
    ...(currentProductId ? [
      {
        id: 'complementary' as const,
        label: 'Podobne',
        icon: Heart,
        description: 'Produkty które mogą Ci się spodobać',
        products: recommendations.complementary
      },
      {
        id: 'frequentlyBought' as const,
        label: 'Często kupowane',
        icon: TrendingUp,
        description: 'Inne kupują razem z tym produktem',
        products: recommendations.frequentlyBought
      }
    ] : [])
  ];

  const activeTabData = tabs.find(tab => tab.id === activeTab);
  const hasAnyRecommendations = Object.values(recommendations).some(products => products.length > 0);

  if (isLoading) {
    return (
      <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="flex gap-4 mb-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-10 bg-gray-200 rounded w-24"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-square bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!hasAnyRecommendations) {
    return null;
  }

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 ${className}`}>
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="h-6 w-6 text-blue-600" />
        <h2 className="text-xl font-bold text-gray-900">Inteligentne rekomendacje</h2>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          const isActive = activeTab === tab.id;
          const hasProducts = tab.products.length > 0;
          
          if (!hasProducts) return null;
          
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <IconComponent className="h-4 w-4" />
              <span className="font-medium">{tab.label}</span>
              <span className={`text-xs px-2 py-1 rounded-full ${
                isActive ? 'bg-white/20' : 'bg-gray-200'
              }`}>
                {tab.products.length}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Tab Content */}
      {activeTabData && (
        <div>
          <div className="mb-4">
            <p className="text-gray-600">{activeTabData.description}</p>
          </div>

          {activeTabData.products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {activeTabData.products.map(product => (
                <Link 
                  key={product.id}
                  to={`/product/${product.id}`}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group"
                >
                  {/* Image */}
                  <div className="relative aspect-square overflow-hidden">
                    <LazyImage
                      src={product.images[0]}
                      alt={product.title}
                      className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                      width={300}
                      height={300}
                      onLoad={() => handleImageLoad(product.id)}
                      onError={() => handleImageError(product.id)}
                    />
                    
                    {/* Loading state */}
                    {loadedImages[product.id] === undefined && (
                      <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                    
                    {/* Price badge */}
                    <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1">
                      <span className="text-sm font-bold text-blue-600">
                        {product.price.discounted?.toFixed(2) || product.price.original?.toFixed(2)} {product.price.currency}
                      </span>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
                      {product.title}
                    </h3>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-2">
                      {product.tags.slice(0, 2).map(tag => (
                        <span
                          key={tag}
                          className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">{product.category}</span>
                      <span className="text-blue-600 flex items-center gap-1">
                        Zobacz produkt <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">🤔</div>
              <p className="text-gray-600">
                Brak rekomendacji w tej kategorii
              </p>
            </div>
          )}

          {/* Show More Button */}
          {activeTabData.products.length >= 4 && (
            <div className="text-center mt-6">
              <button className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors">
                <span>Zobacz więcej {activeTabData.label.toLowerCase()}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Context Information */}
      {(context.season || context.occasion) && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start gap-2">
            <Sparkles className="h-4 w-4 text-blue-600 mt-0.5" />
            <div className="text-sm">
              <p className="text-blue-900 font-medium mb-1">Personalizacja aktywna</p>
              <p className="text-blue-800">
                Rekomendacje dostosowane do:
                {context.season && <span className="ml-1 capitalize">{context.season}</span>}
                {context.season && context.occasion && <span>, </span>}
                {context.occasion && <span className="ml-1">{context.occasion}</span>}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};