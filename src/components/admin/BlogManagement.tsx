import {
  BookOpen,
  Edit,
  Eye,
  EyeOff,
  Plus,
  Search,
  Star,
  Trash2,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  createPost,
  deletePost,
  getPosts,
  updatePost,
} from "../../services/blogService";
import { BlogPost } from "../../types/blog";
import { BlogEditor } from "../blog/BlogEditor";

export const BlogManagement: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | undefined>(
    undefined
  );
  const [isSaving, setIsSaving] = useState(false);

  const fetchPosts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedPosts = await getPosts();
      setPosts(fetchedPosts);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.excerpt &&
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = !filterType || post.type === filterType;
    const matchesStatus =
      !filterStatus ||
      (filterStatus === "published" && post.isPublished) ||
      (filterStatus === "draft" && !post.isPublished) ||
      (filterStatus === "featured" && post.isFeatured);

    return matchesSearch && matchesType && matchesStatus;
  });

  const handleAddNewPost = () => {
    setEditingPost(undefined);
    setIsEditorOpen(true);
  };

  const handleEditPost = (post: BlogPost) => {
    setEditingPost(post);
    setIsEditorOpen(true);
  };

  const handleSavePost = async (postData: Partial<BlogPost>) => {
    setIsSaving(true);
    setError(null);
    try {
      if (editingPost) {
        await updatePost(editingPost.id, postData);
      } else {
        await createPost(postData);
      }
      setIsEditorOpen(false);
      setEditingPost(undefined);
      await fetchPosts();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditorOpen(false);
    setEditingPost(undefined);
  };

  const handleDeletePost = async (postId: string) => {
    if (window.confirm("Czy na pewno chcesz usunąć ten wpis?")) {
      try {
        await deletePost(postId);
        await fetchPosts();
      } catch (err: any) {
        setError(err.message);
      }
    }
  };

  const handleTogglePublished = (postId: string) => {
    const postToUpdate = posts.find((p) => p.id === postId);
    if (postToUpdate) {
      updatePost(postId, { isPublished: !postToUpdate.isPublished }).then(() =>
        fetchPosts()
      );
    }
  };

  const handleToggleFeatured = (postId: string) => {
    const postToUpdate = posts.find((p) => p.id === postId);
    if (postToUpdate) {
      updatePost(postId, { isFeatured: !postToUpdate.isFeatured }).then(() =>
        fetchPosts()
      );
    }
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-600">Ładowanie wpisów...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 bg-red-50 rounded-lg">
        <p className="text-red-700 font-semibold">Wystąpił błąd</p>
        <p className="text-red-600 mt-2">{error}</p>
      </div>
    );
  }

  if (isEditorOpen) {
    return (
      <BlogEditor
        post={editingPost}
        onSave={handleSavePost}
        onCancel={handleCancel}
        isLoading={isSaving}
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
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {filteredPosts.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-900">
                  Wpis
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">
                  Typ
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">
                  Status
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">
                  Data
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">
                  Autor
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">
                  Akcje
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPosts.map((post) => {
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
                    <td className="py-4 px-4 text-gray-600 text-sm">
                      {post.author.name}
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
        ) : (
          <div className="text-center p-12">
            <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Brak wpisów
            </h3>
            <p className="text-gray-600 mb-4">
              {searchQuery || filterType || filterStatus
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
  );
};
