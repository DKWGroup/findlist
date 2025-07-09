import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ArrowRight, Calendar, User, Star, AlertTriangle } from 'lucide-react';
import { blogPosts } from '../data/blogData';

export const BlogPreview: React.FC = () => {
  // Get featured and recent blog posts
  const featuredPosts = blogPosts
    .filter(post => post.isFeatured && post.isPublished)
    .slice(0, 2);
  
  const recentPosts = blogPosts
    .filter(post => post.isPublished && !post.isFeatured)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 2);

  const displayPosts = [...featuredPosts, ...recentPosts].slice(0, 3);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'review':
        return <Star className="h-4 w-4" />;
      case 'collection':
        return <BookOpen className="h-4 w-4" />;
      case 'scam-alert':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'review':
        return 'Recenzja';
      case 'collection':
        return 'Zbiór produktów';
      case 'scam-alert':
        return 'Scam Alert';
      default:
        return 'Artykuł';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'review':
        return 'bg-blue-100 text-blue-800';
      case 'collection':
        return 'bg-green-100 text-green-800';
      case 'scam-alert':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-purple-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Viralowe Recenzje i Poradniki</h2>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Najnowsze testy, opinie społeczności i poradniki zakupowe. 
            Dowiedz się, które produkty warto kupić, a których unikać!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {displayPosts.map((post) => (
            <article key={post.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group">
              <Link to={`/blog/${post.slug}`} className="block">
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={post.featuredImage}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(post.type)}`}>
                      {getTypeIcon(post.type)}
                      {getTypeLabel(post.type)}
                    </span>
                    {post.isFeatured && (
                      <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                        Wyróżnione
                      </span>
                    )}
                  </div>
                  {post.overallRating && (
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-500 fill-current" />
                      <span className="text-xs font-medium">{post.overallRating}/5</span>
                    </div>
                  )}
                </div>
              </Link>

              <div className="p-6">
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(post.publishedAt).toLocaleDateString('pl-PL')}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span>{post.author.name}</span>
                  </div>
                </div>

                <Link to={`/blog/${post.slug}`}>
                  <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {post.title}
                  </h3>
                </Link>

                <p className="text-gray-600 mb-4 line-clamp-3 text-sm">
                  {post.excerpt}
                </p>

                <Link
                  to={`/blog/${post.slug}`}
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm group-hover:gap-2 transition-all"
                >
                  <span>Czytaj więcej</span>
                  <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* Blog CTA */}
        <div className="text-center">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8 py-4 rounded-xl transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <BookOpen className="h-5 w-5" />
            <span>Zobacz wszystkie recenzje i poradniki</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>

        {/* SEO Content for Blog */}
        <div className="mt-12 bg-white rounded-2xl p-8 border border-gray-100">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Najlepsze poradniki zakupowe w Polsce
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">📝 Szczere recenzje produktów</h4>
                <ul className="space-y-2 text-gray-600 text-sm">
                  <li>• Testujemy każdy produkt przed recenzją</li>
                  <li>• Pokazujemy plusy i minusy bez ukrywania wad</li>
                  <li>• Oceniamy stosunek jakości do ceny</li>
                  <li>• Sprawdzamy, czy produkt spełnia obietnice z reklam</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">⚠️ Ostrzeżenia przed scamami</h4>
                <ul className="space-y-2 text-gray-600 text-sm">
                  <li>• Identyfikujemy podejrzane produkty i sprzedawców</li>
                  <li>• Analizujemy fałszywe recenzje i opinie</li>
                  <li>• Sprawdzamy prawdziwość reklam w social mediach</li>
                  <li>• Pomagamy uniknąć nieudanych zakupów</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};