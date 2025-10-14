import React, { useEffect, useRef, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { LoginForm } from "../components/auth/LoginForm";
import { useSimplifiedAuthContext } from "../contexts/SimplifiedAuthContext";
import { supabase } from "../services/supabaseStorage";

export const LoginPage: React.FC = () => {
  const { user, isLoading } = useSimplifiedAuthContext();
  const location = useLocation();
  const navigate = useNavigate();
  const [showVerificationSuccess, setShowVerificationSuccess] = useState(false);
  const verificationHandledRef = useRef(false);

  useEffect(() => {
    if (verificationHandledRef.current) return;
    const params = new URLSearchParams(location.search);
    if (params.get("verified") === "1") {
      verificationHandledRef.current = true;
      setShowVerificationSuccess(true);
      supabase.auth.signOut().catch((err) => {
        console.warn("LoginPage: signOut after verification failed", err);
      });

      params.delete("verified");
      const newSearch = params.toString();
      navigate(`${location.pathname}${newSearch ? `?${newSearch}` : ""}`, {
        replace: true,
      });
    }
  }, [location.pathname, location.search, navigate]);

  // Only redirect if we're not loading and the user is authenticated
  if (user && !isLoading && !showVerificationSuccess) {
    return <Navigate to="/profil" replace />;
  }

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 mb-6">
            <img
              src="/findlist-logo2.png"
              alt="FINDLIST"
              className="h-8 w-auto"
            />
          </Link>
        </div>

        <LoginForm />

        {showVerificationSuccess && (
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mt-6">
            <p className="font-semibold">Adres email został potwierdzony.</p>
            <p className="text-sm mt-1">
              Możesz teraz zalogować się, korzystając ze swojego adresu email i
              hasła.
            </p>
          </div>
        )}

        {/* Back to home */}
        <div className="mt-8 text-center">
          <Link to="/" className="text-blue-600 hover:text-blue-700 text-sm">
            ← Wróć do strony głównej
          </Link>
        </div>
      </div>
    </div>
  );
};
