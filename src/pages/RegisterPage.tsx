import React from "react";
import { Link, Navigate } from "react-router-dom";
import { RegisterForm } from "../components/auth/RegisterForm";
import { useSimplifiedAuthContext } from "../contexts/SimplifiedAuthContext";

export const RegisterPage: React.FC = () => {
  const { isAuthenticated, isLoading, user } = useSimplifiedAuthContext();

  // Only redirect if we're not loading and the user is authenticated
  if (isAuthenticated && !isLoading && user) {
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
              alt="VIRALIST"
              className="h-8 w-auto"
            />
          </Link>
        </div>

        <RegisterForm />

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
