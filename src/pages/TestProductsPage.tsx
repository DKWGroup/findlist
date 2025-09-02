import React from "react";
import { useProducts } from "../hooks/useProducts";

export const TestProductsPage: React.FC = () => {
  const { products, loading, error, refresh } = useProducts({
    autoFetch: true,
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Ładowanie produktów...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-red-600">
          <h2 className="text-xl font-semibold mb-2">
            Błąd ładowania produktów
          </h2>
          <p className="mb-4">{error}</p>
          <button
            onClick={refresh}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Spróbuj ponownie
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Test ładowania produktów z bazy danych
          </h1>
          <p className="text-gray-600">
            Znaleziono {products.length} produktów
          </p>
          <button
            onClick={refresh}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Odśwież
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <h3 className="font-semibold text-gray-900 mb-2">
                {product.title}
              </h3>
              <p className="text-sm text-gray-600 mb-2">ID: {product.id}</p>
              <p className="text-sm text-gray-600 mb-2">
                Kod: {product.code || "Brak kodu"}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                Kategoria: {product.category}
              </p>
              <p className="text-sm text-gray-600 mb-4">
                Cena: {product.price.discounted || product.price.original}{" "}
                {product.price.currency}
              </p>
              {product.images.length > 0 && (
                <img
                  src={product.images[0]}
                  alt={product.title}
                  className="w-full h-32 object-cover rounded-lg"
                />
              )}
              <div className="mt-4 flex gap-2">
                {product.isVerified && (
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                    Zweryfikowany
                  </span>
                )}
                {product.isTrending && (
                  <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                    Trending
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">Brak produktów w bazie danych</p>
          </div>
        )}
      </div>
    </div>
  );
};
