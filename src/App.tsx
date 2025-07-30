import { HelmetProvider } from "react-helmet-async";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { ScrollToTop } from "./components/ScrollToTop";
import { ShortUrlRedirect } from "./components/ShortUrlRedirect";
import { SimplifiedAuthProvider } from "./contexts/SimplifiedAuthContext";
import { AboutUsPage } from "./pages/AboutUsPage";
import { AdminPage } from "./pages/AdminPage";
import { AffiliateProgramPage } from "./pages/AffiliateProgramPage";
import { BlogEditorPage } from "./pages/BlogEditorPage";
import { BlogPage } from "./pages/BlogPage";
import { BlogPostPage } from "./pages/BlogPostPage";
import { ContactPage } from "./pages/ContactPage";
import { CookiePolicyPage } from "./pages/CookiePolicyPage";
import { HomePage } from "./pages/HomePage";
import { HowItWorksPage } from "./pages/HowItWorksPage";
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { PrivacyPolicyPage } from "./pages/PrivacyPolicyPage";
import { ProductPage } from "./pages/ProductPage";
import { ProductsPage } from "./pages/ProductsPage";
import { ProfilePage } from "./pages/ProfilePage";
import { RegisterPage } from "./pages/RegisterPage";
import { ResetPasswordPage } from "./pages/ResetPasswordPage";
import { SearchPage } from "./pages/SearchPage";
import { TermsOfServicePage } from "./pages/TermsOfServicePage";
import { UpdatePasswordPage } from "./pages/UpdatePasswordPage";
import { VerificationRequiredPage } from "./pages/VerificationRequiredPage";
import { isShortProductUrl } from "./utils/productUrlUtils";

function App() {
  console.log("App: Starting with simplified auth...");

  return (
    <HelmetProvider>
      <SimplifiedAuthProvider>
        <Router>
          <ScrollToTop />
          <div className="min-h-screen bg-gray-50">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/produkty" element={<ProductsPage />} />
              <Route path="/produkty/:slug" element={<ProductPage />} />
              <Route path="/produkt/:id" element={<ProductPage />} />
              <Route
                path="/:codeOrAlias"
                element={(() => {
                  const pathname = window.location.pathname;
                  if (isShortProductUrl(pathname)) {
                    return <ShortUrlRedirect />;
                  }
                  return <ProductPage />;
                })()}
              />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:slug" element={<BlogPostPage />} />
              <Route path="/blog-editor" element={<BlogEditorPage />} />
              <Route path="/szukaj" element={<SearchPage />} />
              <Route path="/o-nas" element={<AboutUsPage />} />
              <Route path="/jak-to-dziala" element={<HowItWorksPage />} />
              <Route path="/kontakt" element={<ContactPage />} />
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

              {/* Legal Pages */}
              <Route path="/regulamin" element={<TermsOfServicePage />} />
              <Route
                path="/polityka-prywatnosci"
                element={<PrivacyPolicyPage />}
              />
              <Route path="/cookies" element={<CookiePolicyPage />} />
              <Route path="/afiliacja" element={<AffiliateProgramPage />} />
            </Routes>
          </div>
        </Router>
      </SimplifiedAuthProvider>
    </HelmetProvider>
  );
}

export default App;
