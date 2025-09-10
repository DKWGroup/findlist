import {
  BarChart3,
  BookOpen,
  Edit,
  Eye,
  Filter,
  Hash,
  MessageSquare,
  Package,
  Plus,
  Search,
  Settings,
  Star,
  ThumbsUp,
  Trash2,
  TrendingUp,
  Users,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { usePageState } from "../../hooks/usePageState";
import { useProducts } from "../../hooks/useProducts";
import { Product } from "../../types";
import { BlogManagement } from "./BlogManagement";
import { ProductCodeManager } from "./ProductCodeManager";
import { ProductForm } from "./ProductForm";
import { UserRoleManagement } from "./UserRoleManagement";

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  // Zarządzanie stanem strony
  const pageState = usePageState();

  // Use products hook
  const { products: productList, refresh: refreshProducts } = useProducts({
    autoFetch: true,
  });

  const stats = {
    totalProducts: productList.length,
    totalUsers: 1247,
    totalViews: productList.reduce(
      (sum: number, p: Product) => sum + p.popularity.views,
      0
    ),
    totalReviews: productList.reduce(
      (sum: number, p: Product) => sum + p.ratings.count,
      0
    ),
    trendingProducts: productList.filter((p: Product) => p.isTrending).length,
    verifiedProducts: productList.filter((p: Product) => p.isVerified).length,
  };

  const recentProducts = productList.slice(0, 5);

  const tabs = [
    { id: "overview", label: "Przegląd", icon: BarChart3 },
    { id: "products", label: "Produkty", icon: Package },
    { id: "product-codes", label: "Kody produktów", icon: Hash },
    { id: "blog", label: "Blog", icon: BookOpen },
    { id: "users", label: "Role użytkowników", icon: Users },
    { id: "reviews", label: "Recenzje", icon: MessageSquare },
    { id: "settings", label: "Ustawienia", icon: Settings },
  ];

  const filteredProducts = productList.filter((product: Product) => {
    const matchesSearch =
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.code &&
        product.code.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory =
      !filterCategory || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setIsProductFormOpen(true);
    pageState.markAsModified(); // Oznacz jako zmodyfikowane gdy otwieramy formularz
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsProductFormOpen(true);
    pageState.markAsModified(); // Oznacz jako zmodyfikowane gdy otwieramy formularz
  };

  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm("Czy na pewno chcesz usunąć ten produkt?")) {
      setIsLoading(true);
      try {
        // Here you would call productService.deleteProduct(productId)
        console.log("Deleting product:", productId);
        // For now, just refresh the products list
        await refreshProducts();
        pageState.markAsSaved(); // Oznacz jako zapisane po udanym usunięciu
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Błąd podczas usuwania produktu");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSaveProduct = async (productData: Partial<Product>) => {
    setIsLoading(true);

    try {
      // Product saving is handled in ProductForm component
      console.log("Saving product:", productData);
      // Just refresh the products list and close the form
      await refreshProducts();
      setIsProductFormOpen(false);
      setSelectedProduct(null);
      pageState.markAsSaved(); // Oznacz jako zapisane po udanym zapisie
    } catch (error) {
      console.error("Error in product save callback:", error);
      alert("Wystąpił błąd podczas zapisywania produktu");
    } finally {
      setIsLoading(false);
    }
  };

  const categories = Array.from(
    new Set(productList.map((p: Product) => p.category))
  );

  // On mount, auto-reopen ProductForm if a draft exists (after refresh/tab restore)
  const hasCheckedDraftRef = useRef(false);
  useEffect(() => {
    try {
      // Skip restore if user closed manually in this session
      const skipRestore = sessionStorage.getItem("admin-form-restore-skip");
      if (skipRestore === "1") return;

      // Ensure we only auto-open once per mount/session
      if (hasCheckedDraftRef.current) return;

      const draftNew = localStorage.getItem("admin-product-form-draft:new");
      const draftExistingKeys = Object.keys(localStorage).filter(
        (k) =>
          k.startsWith("admin-product-form-draft:") &&
          k !== "admin-product-form-draft:new"
      );

      if (!isProductFormOpen && draftExistingKeys.length > 0) {
        // Extract first product id from key and try to preselect product
        const firstKey = draftExistingKeys[0];
        const productId = firstKey.split(":")[1];
        const prod = productList.find((p) => p.id === productId) || null;
        setSelectedProduct(prod);
        setIsProductFormOpen(true);
        sessionStorage.setItem("admin-form-restore-attempted", "1");
        pageState.markAsModified();
        hasCheckedDraftRef.current = true;
      } else if (!isProductFormOpen && draftNew) {
        setSelectedProduct(null);
        setIsProductFormOpen(true);
        sessionStorage.setItem("admin-form-restore-attempted", "1");
        pageState.markAsModified();
        hasCheckedDraftRef.current = true;
      }
    } catch (e) {
      // no-op
    }
  }, [productList, isProductFormOpen, pageState]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-sm border-r border-gray-200 min-h-screen">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Panel Admin
            </h2>
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <IconComponent className="h-5 w-5" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {activeTab === "overview" && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Przegląd</h1>
                <button
                  onClick={handleAddProduct}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Dodaj produkt
                </button>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Produkty</p>
                      <p className="text-3xl font-bold text-gray-900">
                        {stats.totalProducts}
                      </p>
                    </div>
                    <Package className="h-12 w-12 text-blue-600 bg-blue-100 rounded-lg p-3" />
                  </div>
                  <div className="mt-4 flex items-center text-sm">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-green-600">+12% w tym miesiącu</span>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Użytkownicy</p>
                      <p className="text-3xl font-bold text-gray-900">
                        {stats.totalUsers.toLocaleString()}
                      </p>
                    </div>
                    <Users className="h-12 w-12 text-green-600 bg-green-100 rounded-lg p-3" />
                  </div>
                  <div className="mt-4 flex items-center text-sm">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-green-600">+8% w tym miesiącu</span>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Wyświetlenia</p>
                      <p className="text-3xl font-bold text-gray-900">
                        {(stats.totalViews / 1000).toFixed(0)}K
                      </p>
                    </div>
                    <Eye className="h-12 w-12 text-purple-600 bg-purple-100 rounded-lg p-3" />
                  </div>
                  <div className="mt-4 flex items-center text-sm">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-green-600">+24% w tym miesiącu</span>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Recenzje</p>
                      <p className="text-3xl font-bold text-gray-900">
                        {stats.totalReviews}
                      </p>
                    </div>
                    <Star className="h-12 w-12 text-yellow-600 bg-yellow-100 rounded-lg p-3" />
                  </div>
                  <div className="mt-4 flex items-center text-sm">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-green-600">+18% w tym miesiącu</span>
                  </div>
                </div>
              </div>

              {/* Recent Products */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Najnowsze produkty
                  </h2>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {recentProducts.map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                      >
                        <img
                          src={product.images[0]}
                          alt={product.title}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">
                            {product.title}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <p>
                              {product.price.discounted?.toFixed(2)}{" "}
                              {product.price.currency}
                            </p>
                            {product.code && (
                              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-mono">
                                {product.code}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            {(product.popularity.views / 1000).toFixed(1)}K
                          </div>
                          <div className="flex items-center gap-1">
                            <ThumbsUp className="h-4 w-4" />
                            {(product.popularity.likes / 1000).toFixed(1)}K
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4" />
                            {product.ratings.average}
                          </div>
                        </div>
                        {product.isTrending && (
                          <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-medium">
                            Trending
                          </span>
                        )}
                        {product.isVerified && (
                          <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                            Zweryfikowany
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "products" && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                  Zarządzanie produktami
                </h1>
                <button
                  onClick={handleAddProduct}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Dodaj produkt
                </button>
              </div>

              {/* Filters */}
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Szukaj produktów (tytuł, opis, kod)..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="relative">
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <select
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                      className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Wszystkie kategorie</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="p-6">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 font-semibold text-gray-900">
                            Produkt
                          </th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-900">
                            Kod
                          </th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-900">
                            Kategoria
                          </th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-900">
                            Cena
                          </th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-900">
                            Status
                          </th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-900">
                            Wyświetlenia
                          </th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-900">
                            Akcje
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredProducts.map((product) => (
                          <tr
                            key={product.id}
                            className="border-b border-gray-100 hover:bg-gray-50"
                          >
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-3">
                                <img
                                  src={product.images[0]}
                                  alt={product.title}
                                  className="w-12 h-12 object-cover rounded-lg"
                                />
                                <div>
                                  <p className="font-medium text-gray-900 line-clamp-1">
                                    {product.title}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    ID: {product.id}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              {product.code ? (
                                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-mono">
                                  {product.code}
                                </span>
                              ) : (
                                <span className="text-gray-400 text-xs">
                                  Brak kodu
                                </span>
                              )}
                            </td>
                            <td className="py-4 px-4 text-gray-600 capitalize">
                              {product.category}
                            </td>
                            <td className="py-4 px-4 text-gray-900 font-medium">
                              {product.price.discounted?.toFixed(2)}{" "}
                              {product.price.currency}
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex gap-2">
                                {product.isTrending && (
                                  <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs">
                                    Trending
                                  </span>
                                )}
                                {product.isVerified && (
                                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                                    Zweryfikowany
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="py-4 px-4 text-gray-600">
                              {(product.popularity.views / 1000).toFixed(1)}K
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleEditProduct(product)}
                                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                  title="Edytuj"
                                >
                                  <Edit className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() =>
                                    handleDeleteProduct(product.id)
                                  }
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Usuń"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {filteredProducts.length === 0 && (
                    <div className="text-center py-12">
                      <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Brak produktów
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {searchQuery || filterCategory
                          ? "Nie znaleziono produktów spełniających kryteria wyszukiwania"
                          : "Dodaj pierwszy produkt do katalogu"}
                      </p>
                      <button
                        onClick={handleAddProduct}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                      >
                        Dodaj produkt
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "product-codes" && <ProductCodeManager />}
          {activeTab === "blog" && <BlogManagement />}
          {activeTab === "users" && <UserRoleManagement />}

          {/* Other tabs content would go here */}
          {!["overview", "products", "product-codes", "blog", "users"].includes(
            activeTab
          ) && (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {tabs.find((t) => t.id === activeTab)?.label}
              </h2>
              <p className="text-gray-600">Ta sekcja jest w trakcie rozwoju.</p>
            </div>
          )}
        </div>
      </div>

      {/* Product Form Modal */}
      <ProductForm
        product={selectedProduct}
        isOpen={isProductFormOpen}
        onClose={() => {
          try {
            sessionStorage.setItem("admin-form-restore-skip", "1");
          } catch {}
          setIsProductFormOpen(false);
          setSelectedProduct(null);
        }}
        onSave={handleSaveProduct}
        isLoading={isLoading}
      />
    </div>
  );
};
