import React from "react";
import { HelmetProvider } from "react-helmet-async";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { SimplifiedAuthProvider } from "./contexts/SimplifiedAuthContext";
import { AdminPage } from "./pages/AdminPage";
import { BlogEditorPage } from "./pages/BlogEditorPage";
import { BlogPage } from "./pages/BlogPage";
import { BlogPostPage } from "./pages/BlogPostPage";
import { HomePage } from "./pages/HomePage";
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { ProductPage } from "./pages/ProductPage";
import { ProductsPage } from "./pages/ProductsPage";
import { ProfilePage } from "./pages/ProfilePage";
import { RegisterPage } from "./pages/RegisterPage";
import { ResetPasswordPage } from "./pages/ResetPasswordPage";
import { SearchPage } from "./pages/SearchPage";
import { UpdatePasswordPage } from "./pages/UpdatePasswordPage";
import { VerificationRequiredPage } from "./pages/VerificationRequiredPage";

function App() {
  console.log("App: Starting with simplified auth...");

  return (
    <HelmetProvider>
      <SimplifiedAuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/produkty" element={<ProductsPage />} />
              <Route path="/produkt/:id" element={<ProductPage />} />
              <Route path="/:codeOrAlias" element={<ProductPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:slug" element={<BlogPostPage />} />
              <Route path="/blog-editor" element={<BlogEditorPage />} />
              <Route path="/szukaj" element={<SearchPage />} />
              <Route path="/logowanie" element={<LoginPage />} />
              <Route path="/rejestracja" element={<RegisterPage />} />
              <Route path="/reset-hasla" element={<ResetPasswordPage />} />
              <Route path="/update-password" element={<UpdatePasswordPage />} />
              <Route
                path="/verification-required"
                element={<VerificationRequiredPage />}
              />
              <Route path="/profil" element={<ProfilePage />} />
              <Route path="/admin" element={<AdminPage />} />
            </Routes>
          </div>
        </Router>
      </SimplifiedAuthProvider>
    </HelmetProvider>
  );
}

export default App;
