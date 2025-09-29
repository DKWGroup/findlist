import {
  BookOpen,
  Calendar,
  Edit,
  Eye,
  EyeOff,
  Filter,
  Plus,
  Search,
  Star,
  Trash2,
} from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { blogCategories, blogLabels, blogPosts } from "../../data/blogData";
import { BlogPost } from "../../types/blog";
import { BlogEditor } from "../blog/BlogEditor"; // Import edytora

export const BlogManagement: React.FC = () => {
  const [posts, setPosts] = useState(blogPosts);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | undefined>(
    undefined
  );
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // This function should be implemented to fetch data from your backend (e.g., Supabase)
  const fetchPosts = async () => {
    console.log("Fetching posts...");
    // Example: const { data } = await supabase.from('blog_posts').select('*');
    // setPosts(data);
  };

  // These are likely defined elsewhere, adding placeholders to avoid errors
  const supabase: any = {
    from: () => ({
      update: () => ({
        eq: () => ({
          select: async () => ({ data: [], error: null }),
        }),
      }),
      insert: () => ({
        select: async () => ({ data: [], error: null }),
      }),
    }),
    auth: {
      getUser: async () => ({ data: { user: { id: "123" } }, error: null }),
    },
  };

  const toSnakeCase = (obj: any) => {
    // A simple implementation for demonstration
    if (typeof obj !== "object" || obj === null) return obj;
    return Object.keys(obj).reduce((acc, key) => {
      const snakeKey = key.replace(
        /[A-Z]/g,
        (letter) => `_${letter.toLowerCase()}`
      );
      acc[snakeKey] = obj[key];
      return acc;
    }, {} as any);
  };

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !filterCategory || post.category === filterCategory;
    const matchesType = !filterType || post.type === filterType;
    const matchesStatus =
      !filterStatus ||
      (filterStatus === "published" && post.isPublished) ||
      (filterStatus === "draft" && !post.isPublished) ||
      (filterStatus === "featured" && post.isFeatured);

    return matchesSearch && matchesCategory && matchesType && matchesStatus;
  });

  const handleAddNewPost = () => {
    setEditingPost(undefined); // Upewnij się, że edytor jest czysty
    setIsEditorOpen(true);
  };

  const handleEditPost = (post: BlogPost) => {
    setEditingPost(post);
    setIsEditorOpen(true);
  };

  const handleSavePost = async (postData: Partial<BlogPost>) => {
    setIsSaving(true);
    setError(null);

    // --- LOG 1: Sprawdź, co otrzymano z edytora ---
    console.log("[BlogManagement] Otrzymano dane z edytora:", postData);

    try {
      const dataForDb = toSnakeCase(postData);

      // --- LOG 2: Sprawdź dane po konwersji na snake_case ---
      console.log(
        "[BlogManagement] Dane po konwersji dla bazy danych:",
        dataForDb
      );

      if (editingPost) {
        // --- EDYCJA ---
        console.log(
          `[BlogManagement] Próba aktualizacji posta o ID: ${editingPost.id}`
        );
        const { data, error: updateError } = await supabase
          .from("blog_posts")
          .update(dataForDb)
          .eq("id", editingPost.id)
          .select(); // .select() jest kluczowe do debugowania - zwraca dane

        // --- LOG 3: Sprawdź odpowiedź z Supabase ---
        console.log("[BlogManagement] Odpowiedź z operacji UPDATE:", {
          data,
          error: updateError,
        });

        if (updateError) throw updateError;
      } else {
        // --- DODAWANIE ---
        console.log("[BlogManagement] Próba dodania nowego posta");
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) throw new Error("Użytkownik nie jest zalogowany.");

        const finalData = {
          ...dataForDb,
          author_id: user.id,
          slug:
            dataForDb.title
              ?.toLowerCase()
              .replace(/\s+/g, "-")
              .replace(/[^a-z0-9-]/g, "") || `post-${Date.now()}`,
        };

        const { data, error: insertError } = await supabase
          .from("blog_posts")
          .insert(finalData)
          .select(); // .select() jest kluczowe do debugowania - zwraca dane

        // --- LOG 4: Sprawdź odpowiedź z Supabase ---
        console.log("[BlogManagement] Odpowiedź z operacji INSERT:", {
          data,
          error: insertError,
        });

        if (insertError) throw insertError;
      }

      console.log(
        "[BlogManagement] Zapis zakończony sukcesem. Odświeżanie listy..."
      );
      setIsEditorOpen(false);
      setEditingPost(undefined);
      await fetchPosts();
    } catch (err: any) {
      console.error("[BlogManagement] Wystąpił błąd podczas zapisu:", err);
      setError(`Nie udało się zapisać posta: ${err.message}.`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditorOpen(false);
    setEditingPost(undefined);
  };

  const handleDeletePost = (postId: string) => {
    if (window.confirm("Czy na pewno chcesz usunąć ten wpis?")) {
      setPosts((prev) => prev.filter((p) => p.id !== postId));
    }
  };

  const handleTogglePublished = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              isPublished: !p.isPublished,
              updatedAt: new Date().toISOString(),
            }
          : p
      )
    );
  };

  const handleToggleFeatured = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              isFeatured: !p.isFeatured,
              updatedAt: new Date().toISOString(),
            }
          : p
      )
    );
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "review":
        return "Recenzja";
      case "collection":
        return "Zbiór";
      case "scam-alert":
        return "Scam Alert";
      default:
        return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "review":
        return "bg-blue-100 text-blue-800";
      case "collection":
        return "bg-green-100 text-green-800";
      case "scam-alert":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isEditorOpen) {
    return (
      <BlogEditor
        post={editingPost}
        onSave={handleSavePost}
        onCancel={handleCancel}
      />
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <BookOpen className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Zarządzanie blogiem
            </h1>
            <p className="text-gray-600">Twórz i zarządzaj wpisami blogowymi</p>
          </div>
        </div>
        <button
          onClick={handleAddNewPost}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Nowy wpis
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Wszystkie wpisy</p>
              <p className="text-3xl font-bold text-gray-900">{posts.length}</p>
            </div>
            <BookOpen className="h-12 w-12 text-blue-600 bg-blue-100 rounded-lg p-3" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Opublikowane</p>
              <p className="text-3xl font-bold text-gray-900">
                {posts.filter((p) => p.isPublished).length}
              </p>
            </div>
            <Eye className="h-12 w-12 text-green-600 bg-green-100 rounded-lg p-3" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Szkice</p>
              <p className="text-3xl font-bold text-gray-900">
                {posts.filter((p) => !p.isPublished).length}
              </p>
            </div>
            <EyeOff className="h-12 w-12 text-orange-600 bg-orange-100 rounded-lg p-3" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Wyróżnione</p>
              <p className="text-3xl font-bold text-gray-900">
                {posts.filter((p) => p.isFeatured).length}
              </p>
            </div>
            <Star className="h-12 w-12 text-yellow-600 bg-yellow-100 rounded-lg p-3" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Szukaj wpisów..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Wszystkie kategorie</option>
              {blogCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Wszystkie typy</option>
              <option value="review">Recenzje</option>
              <option value="collection">Zbiory</option>
              <option value="scam-alert">Scam Alert</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Wszystkie statusy</option>
              <option value="published">Opublikowane</option>
              <option value="draft">Szkice</option>
              <option value="featured">Wyróżnione</option>
            </select>
          </div>
        </div>
      </div>

      {/* Posts Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">
                    Wpis
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">
                    Typ
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">
                    Kategoria
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">
                    Data
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">
                    Akcje
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredPosts.map((post) => {
                  const category = blogCategories.find(
                    (cat) => cat.id === post.category
                  );
                  return (
                    <tr
                      key={post.id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={post.featuredImage}
                            alt={post.title}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                          <div>
                            <p className="font-medium text-gray-900 line-clamp-1">
                              {post.title}
                            </p>
                            <p className="text-sm text-gray-600 line-clamp-1">
                              {post.excerpt}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(
                            post.type
                          )}`}
                        >
                          {getTypeLabel(post.type)}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        {category && (
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium text-white ${category.color}`}
                          >
                            {category.name}
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex gap-2">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              post.isPublished
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {post.isPublished ? "Opublikowany" : "Szkic"}
                          </span>
                          {post.isFeatured && (
                            <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                              Wyróżniony
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-600 text-sm">
                        {new Date(post.publishedAt).toLocaleDateString("pl-PL")}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex gap-2">
                          <Link
                            to={`/blog/${post.slug}`}
                            target="_blank" // Otwórz w nowej karcie
                            rel="noopener noreferrer"
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Podgląd"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => handleEditPost(post)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Edytuj"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleTogglePublished(post.id)}
                            className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                            title={post.isPublished ? "Ukryj" : "Opublikuj"}
                          >
                            {post.isPublished ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                          <button
                            onClick={() => handleToggleFeatured(post.id)}
                            className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                            title={
                              post.isFeatured ? "Usuń wyróżnienie" : "Wyróżnij"
                            }
                          >
                            <Star
                              className={`h-4 w-4 ${
                                post.isFeatured ? "fill-current" : ""
                              }`}
                            />
                          </button>
                          <button
                            onClick={() => handleDeletePost(post.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Usuń"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Brak wpisów
              </h3>
              <p className="text-gray-600 mb-4">
                {searchQuery || filterCategory || filterType || filterStatus
                  ? "Nie znaleziono wpisów spełniających kryteria wyszukiwania"
                  : "Dodaj pierwszy wpis do bloga"}
              </p>
              <button
                onClick={handleAddNewPost}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                Dodaj wpis
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
function setIsSaving(arg0: boolean) {
  throw new Error("Function not implemented.");
}
