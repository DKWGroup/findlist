import React, { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { supabase } from "../services/supabaseStorage";
import { generateProductUrls } from "../utils/productUrlUtils";

/**
 * Component to handle short URL redirects
 * Handles URLs like /KK-TT-001 and redirects to /produkty/product-name
 */
export const ShortUrlRedirect: React.FC = () => {
  const { codeOrAlias } = useParams<{ codeOrAlias: string }>();
  const [redirectTo, setRedirectTo] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const resolveShortUrl = async () => {
      if (!codeOrAlias) {
        setError("No code provided");
        setLoading(false);
        return;
      }

      try {
        // Query database for product with this code
        const { data, error } = await supabase
          .from("products")
          .select("title, code")
          .eq("code", codeOrAlias)
          .single();

        if (error) throw error;

        if (data) {
          // Generate the canonical long URL
          const urls = generateProductUrls(data.title, data.code);
          setRedirectTo(urls.canonicalUrl);
        } else {
          setError("Product not found");
        }
      } catch (err) {
        console.error("Error resolving short URL:", err);
        setError("Product not found");
      } finally {
        setLoading(false);
      }
    };

    resolveShortUrl();
  }, [codeOrAlias]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !redirectTo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Produkt nie znaleziony
          </h2>
          <p className="text-gray-600 mb-4">
            Przepraszamy, nie możemy znaleźć produktu o kodzie: {codeOrAlias}
          </p>
          <a
            href="/"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Wróć do strony głównej
          </a>
        </div>
      </div>
    );
  }

  // Redirect to the canonical URL
  return <Navigate to={redirectTo} replace />;
};
