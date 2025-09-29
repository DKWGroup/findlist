import { Filter, Plus, Search } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { BlogCard } from "../components/blog/BlogCard";
import { Layout } from "../components/Layout";
import { Breadcrumbs } from "../components/SEO/Breadcrumbs";
import { generateWebSiteSchema } from "../components/SEO/SchemaMarkup";
import SEOHead from "../components/SEO/SEOHead";
import { useSimplifiedAuthContext } from "../contexts/SimplifiedAuthContext";
import { blogLabels } from "../data/blogData";
import { getPosts } from "../services/blogService";
import { getCategoryNames } from "../services/productService";
import { BlogPost } from "../types/blog";

export const BlogPage: React.FC = () => {
  const { user } = useSimplifiedAuthContext();

  // 3. Stany dla danych z bazy, ładowania i błędów
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Stany dla filtrów (bez zmian)
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);

  // 4. Pobieranie danych przy montowaniu komponentu
  useEffect(() => {
    const fetchBlogData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [fetchedPosts, fetchedCategories] = await Promise.all([
          getPosts(),
          getCategoryNames(),
        ]);
        setPosts(fetchedPosts);
        setCategories(fetchedCategories);
      } catch (err: any) {
        setError("Nie udało się załadować danych. Spróbuj odświeżyć stronę.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBlogData();
  }, []);

  const filteredPosts = useMemo(() => {
    let filtered = [...posts]; // 5. Użycie stanu 'posts' zamiast 'blogPosts'

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          (post.excerpt && post.excerpt.toLowerCase().includes(query)) ||
          (post.tags &&
            post.tags.some((tag) => tag.toLowerCase().includes(query)))
      );
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter((post) => post.category === selectedCategory);
    }

    // Filter by type
    if (selectedType) {
      filtered = filtered.filter((post) => post.type === selectedType);
    }

    // Filter by labels
    if (selectedLabels.length > 0) {
      filtered = filtered.filter((post) =>
        selectedLabels.some(
          (label) => post.labels && post.labels.includes(label)
        )
      );
    }

    // Only show published posts for non-admin users
    if (user?.role !== "admin") {
      filtered = filtered.filter((post) => post.isPublished);
    }

    // Sort by featured first, then by date
    filtered.sort((a, b) => {
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      return (
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
    });

    return filtered;
  }, [
    searchQuery,
    selectedCategory,
    selectedType,
    selectedLabels,
    user,
    posts,
  ]); // 6. Dodanie 'posts' do zależności

  const toggleLabel = (labelId: string) => {
    setSelectedLabels((prev) =>
      prev.includes(labelId)
        ? prev.filter((id) => id !== labelId)
        : [...prev, labelId]
    );
  };

  const websiteSchema = generateWebSiteSchema();

  const breadcrumbItems = [{ label: "Blog", href: "/blog", current: true }];

  return (
    <Layout>
      <SEOHead
        title="Blog - FINDLIST"
        description="Recenzje, porady i ostrzeżenia o viralnych produktach. Odkryj najlepsze i najgorsze produkty z TikToka i Instagrama."
        canonicalUrl="https://findlist.net/blog"
        structuredData={websiteSchema}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs */}
        <div className="mb-4">
          <Breadcrumbs items={breadcrumbItems} />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Blog FINDLIST
            </h1>
            <p className="text-gray-600">
              Recenzje, porady i ostrzeżenia o viralnych produktach
            </p>
          </div>

          {user?.role === "admin" && (
            <Link
              to="/blog/edytor/nowy"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Nowy wpis
            </Link>
          )}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Filter className="h-5 w-5 text-gray-400" />
            <span className="font-medium text-gray-900">Filtry</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kategoria
              </label>
              <select
                value={selectedCategory || ""}
                onChange={(e) => setSelectedCategory(e.target.value || null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Wszystkie kategorie</option>
                {/* 7. Użycie stanu 'categories' zamiast 'blogCategories' */}
                {/* {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))} */}
              </select>
            </div>

            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Typ wpisu
              </label>
              <select
                value={selectedType || ""}
                onChange={(e) => setSelectedType(e.target.value || null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Wszystkie typy</option>
                <option value="review">Recenzje</option>
                <option value="collection">Zbiory produktów</option>
                <option value="scam-alert">Scam Alert</option>
              </select>
            </div>

            {/* Search */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Szukaj
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Szukaj wpisów..."
                />
              </div>
            </div>
          </div>

          {/* Labels Filter */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Etykiety
            </label>
            <div className="flex flex-wrap gap-2">
              {blogLabels.map((label) => (
                <button
                  key={label.id}
                  onClick={() => toggleLabel(label.id)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    selectedLabels.includes(label.id)
                      ? "bg-blue-600 text-white"
                      : label.color
                  }`}
                >
                  {label.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 8. Obsługa stanu ładowania i błędów */}
        {isLoading ? (
          <div className="text-center py-16">
            <p className="text-gray-600">Ładowanie wpisów...</p>
          </div>
        ) : error ? (
          <div className="text-center py-16 bg-red-50 rounded-lg">
            <p className="text-red-700 font-semibold">{error}</p>
          </div>
        ) : (
          <>
            {/* Results */}
            <div className="mb-6">
              <p className="text-gray-600">
                Znaleziono {filteredPosts.length} wpisów
              </p>
            </div>

            {/* Posts Grid */}
            {filteredPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPosts.map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Brak wpisów
                </h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Nie znaleziono wpisów spełniających kryteria wyszukiwania.
                  Spróbuj zmienić filtry.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};
