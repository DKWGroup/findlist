import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Heart, Share2, ExternalLink, Star, Eye, ThumbsUp, Badge, Calendar, TrendingUp, Hash, Copy } from 'lucide-react';
import { Layout } from '../components/Layout';
import { products } from '../data/mockData';
import { Product } from '../types';
import { ProductReviews } from '../components/ProductReviews';
import { useAuth } from '../contexts/AuthContext';
import { productCodeService } from '../services/productCodeService';

export const ProductPage: React.FC = () => {
  const { id, codeOrAlias } = useParams<{ id?: string; codeOrAlias?: string }>();
  const { user, toggleWishlist, addReview } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [productReviews, setProductReviews] = useState<any[]>([]);

  useEffect(() => {
    let foundProduct: Product | null = null;

    if (id) {
      // Direct product ID access
      foundProduct = products.find(p => p.id === id) || null;
    } else if (codeOrAlias) {
      // Search by product code or URL alias
      foundProduct = products.find(p => 
        p.code?.toLowerCase() === codeOrAlias.toLowerCase() ||
        p.urlAlias?.toLowerCase() === codeOrAlias.toLowerCase()
      ) || null;
    }

    setProduct(foundProduct);
    
    // Mock reviews for demo
    if (foundProduct) {
      setProductReviews([
        {
          id: '1',
          userId: '1',
          userName: 'Administrator',
          rating: 5,
          comment: 'Świetny produkt! Bardzo polecam wszystkim. Jakość wykonania jest na najwyższym poziomie.',
          dateCreated: '2024-01-10',
          isVerified: true,
          likes: 12,
          dislikes: 1
        },
        {
          id: '2',
          userId: '2',
          userName: 'Anna Kowalska',
          rating: 4,
          comment: 'Dobry produkt, ale mogłby być lepszy. Przydałoby się więcej opcji kolorystycznych.',
          dateCreated: '2024-01-12',
          isVerified: false,
          likes: 8,
          dislikes: 2
        },
        {
          id: '3',
          userId: '3',
          userName: 'Michał Nowak',
          rating: 5,
          comment: 'Dokładnie to, czego szukałem! Szybka dostawa i produkt zgodny z opisem.',
          dateCreated: '2024-01-14',
          isVerified: false,
          likes: 15,
          dislikes: 0
        }
      ]);
    }
  }, [id, codeOrAlias]);

  if (!product) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">😕</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Produkt nie znaleziony</h2>
            <p className="text-gray-600 mb-4">Przepraszamy, nie możemy znaleźć tego produktu.</p>
            <Link to="/" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors">
              Wróć do strony głównej
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const isInWishlist = user?.wishlist.includes(product.id) || false;

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const calculateDiscount = () => {
    if (product.price.original && product.price.discounted) {
      return Math.round(((product.price.original - product.price.discounted) / product.price.original) * 100);
    }
    return 0;
  };

  const handleShare = async () => {
    const shareUrl = product.urlAlias 
      ? `${window.location.origin}/${product.urlAlias}`
      : window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: product.title,
          text: product.description,
          url: shareUrl
        });
      } catch (error) {
        console.log('Sharing failed:', error);
      }
    } else {
      navigator.clipboard.writeText(shareUrl);
    }
  };

  const handleWishlistToggle = () => {
    if (user) {
      toggleWishlist(product.id);
    }
  };

  const handleAddReview = (reviewData: any) => {
    const newReview = {
      id: Date.now().toString(),
      userId: user!.id,
      userName: user!.name,
      userAvatar: user!.avatar,
      ...reviewData,
      dateCreated: new Date().toISOString(),
      likes: 0,
      dislikes: 0
    };
    
    setProductReviews(prev => [newReview, ...prev]);
    addReview(product.id, reviewData);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Można dodać toast notification
  };

  const affiliateLinks = Object.entries(product.affiliateLinks).filter(([_, url]) => url);

  return (
    <Layout showFooter={false}>
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors">
              <ArrowLeft className="h-5 w-5" />
              <span>Powrót do produktów</span>
            </Link>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={handleWishlistToggle}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-gray-300 hover:border-red-300 transition-colors group"
              >
                <Heart className={`h-5 w-5 transition-colors ${isInWishlist ? 'fill-red-500 text-red-500' : 'text-gray-400 group-hover:text-red-500'}`} />
                <span className="text-sm font-medium">
                  {isInWishlist ? 'W wishlist' : 'Dodaj do wishlist'}
                </span>
              </button>
              
              <button
                onClick={handleShare}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-gray-300 hover:border-blue-300 transition-colors"
              >
                <Share2 className="h-5 w-5 text-gray-400" />
                <span className="text-sm font-medium">Udostępnij</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-xl overflow-hidden bg-white shadow-sm">
              <img
                src={product.images[currentImageIndex]}
                alt={product.title}
                className="w-full h-full object-cover"
              />
              
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.isTrending && (
                  <span className="bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    🔥 TRENDING
                  </span>
                )}
                {product.isVerified && (
                  <span className="bg-green-500 text-white text-sm font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    <Badge className="h-4 w-4" />
                    ZWERYFIKOWANY
                  </span>
                )}
                {calculateDiscount() > 0 && (
                  <span className="bg-blue-600 text-white text-sm font-bold px-3 py-1 rounded-full">
                    -{calculateDiscount()}% TANIEJ
                  </span>
                )}
              </div>
            </div>
            
            {/* Thumbnail Gallery */}
            {product.images.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative aspect-square w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      currentImageIndex === index ? 'border-blue-600' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img src={image} alt={`${product.title} ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
              <p className="text-gray-600 text-lg leading-relaxed">{product.description}</p>
            </div>

            {/* Product Code */}
            {product.code && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Hash className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">Kod produktu:</span>
                    <span className="font-mono font-bold text-blue-800">{product.code}</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(product.code)}
                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                    title="Kopiuj kod"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
                {product.urlAlias && (
                  <div className="mt-2 text-sm text-blue-700">
                    <span className="font-medium">Link bezpośredni:</span>{' '}
                    <span className="font-mono">{window.location.origin}/{product.urlAlias}</span>
                  </div>
                )}
              </div>
            )}

            {/* Price */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-4 mb-4">
                {product.price.discounted && (
                  <span className="text-3xl font-bold text-blue-600">
                    {product.price.discounted.toFixed(2)} {product.price.currency}
                  </span>
                )}
                {product.price.original && product.price.discounted && (
                  <span className="text-xl text-gray-500 line-through">
                    {product.price.original.toFixed(2)} {product.price.currency}
                  </span>
                )}
              </div>
              
              {calculateDiscount() > 0 && (
                <p className="text-green-600 font-medium mb-4">
                  Oszczędzasz {(product.price.original! - product.price.discounted!).toFixed(2)} {product.price.currency} ({calculateDiscount()}%)
                </p>
              )}

              {/* Affiliate Links */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">Dostępne w sklepach:</h3>
                {affiliateLinks.map(([platform, url]) => (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                        <ExternalLink className="h-4 w-4 text-white" />
                      </div>
                      <span className="font-medium text-gray-900 capitalize">
                        {platform === 'aliexpress' ? 'AliExpress' : platform.charAt(0).toUpperCase() + platform.slice(1)}
                      </span>
                    </div>
                    <ExternalLink className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                  </a>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4">Statystyki popularności</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Eye className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{formatNumber(product.popularity.views)}</p>
                    <p className="text-sm text-gray-600">Wyświetleń</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <ThumbsUp className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{formatNumber(product.popularity.likes)}</p>
                    <p className="text-sm text-gray-600">Polubień</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Star className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{product.ratings.average}</p>
                    <p className="text-sm text-gray-600">{product.ratings.count} ocen</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <Share2 className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{formatNumber(product.popularity.shares)}</p>
                    <p className="text-sm text-gray-600">Udostępnień</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4">Tagi</h3>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium hover:bg-blue-100 transition-colors cursor-pointer"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Social Links */}
            {(product.socialLinks.tiktok || product.socialLinks.instagram) && (
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-4">Zobacz w social media</h3>
                <div className="space-y-3">
                  {product.socialLinks.tiktok && (
                    <a
                      href={product.socialLinks.tiktok}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-black hover:bg-gray-800 text-white rounded-lg transition-colors"
                    >
                      <TrendingUp className="h-5 w-5" />
                      <span>Zobacz na TikTok</span>
                      <ExternalLink className="h-4 w-4 ml-auto" />
                    </a>
                  )}
                  {product.socialLinks.instagram && (
                    <a
                      href={product.socialLinks.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg transition-colors"
                    >
                      <Heart className="h-5 w-5" />
                      <span>Zobacz na Instagram</span>
                      <ExternalLink className="h-4 w-4 ml-auto" />
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Product Info */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4">Informacje o produkcie</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">Dodano:</span>
                  <span className="font-medium">{new Date(product.dateAdded).toLocaleDateString('pl-PL')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">Status:</span>
                  <span className={`font-medium ${product.isVerified ? 'text-green-600' : 'text-orange-600'}`}>
                    {product.isVerified ? 'Zweryfikowany' : 'Niezweryfikowany'}
                  </span>
                </div>
                {product.code && (
                  <div className="flex items-center gap-2">
                    <Hash className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">Kod produktu:</span>
                    <span className="font-mono font-medium">{product.code}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <ProductReviews
          productId={product.id}
          reviews={productReviews}
          onAddReview={handleAddReview}
        />
      </div>
    </Layout>
  );
};