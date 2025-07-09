import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { supabase, debugSession } from './services/supabaseStorage';
import { AuthProvider } from './contexts/AuthContext';
import { clearSessionData } from './middleware/AuthMiddleware';
import { LandingPage } from './pages/LandingPage';
import { ProductsPage } from './pages/ProductsPage';
import { ProductPage } from './pages/ProductPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminPage } from './pages/AdminPage';
import { BlogPage } from './pages/BlogPage';
import { BlogPostPage } from './pages/BlogPostPage';
import { BlogEditorPage } from './pages/BlogEditorPage';
import { SearchPage } from './pages/SearchPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { UpdatePasswordPage } from './pages/UpdatePasswordPage';
import { VerificationRequiredPage } from './pages/VerificationRequiredPage';
import { usePerformanceMonitoring } from './hooks/usePerformanceMonitoring';
import { preloadCriticalResources, measureCoreWebVitals } from './utils/seoUtils';
import { setupAuthInterceptor } from './utils/authUtils';
import { initializeAuthListeners } from './middleware/AuthMiddleware';
import { syncCookiesWithStorage } from './utils/cookieUtils';

function App() {
  const [authInitialized, setAuthInitialized] = useState(false);
  
  // Initialize performance monitoring
  usePerformanceMonitoring();
  
  // Preload critical resources
  React.useEffect(() => {
    preloadCriticalResources();
    measureCoreWebVitals();
  }, []);

  // Set up auth interceptor and listeners
  React.useEffect(() => {
    setupAuthInterceptor();
    
    // Synchronize cookies with storage for cross-tab auth state
    syncCookiesWithStorage();
    
    const cleanup = initializeAuthListeners();
    return cleanup;
  }, []);

  // Add effect to track auth initialization
  React.useEffect(() => {
    const checkAuthInit = async () => {
      // Clear any stale session data first
      clearSessionData();
      
      try {
        const { data } = await supabase.auth.getSession();
        console.log('Auth initialized, session state:', data.session ? 'Active' : 'None');
        setAuthInitialized(true);
        await debugSession();
      } catch (error) {
        console.error('Error checking auth initialization:', error);
        setAuthInitialized(true); // Set to true anyway to avoid blocking the app
      }
    };
    
    checkAuthInit();
  }, []);

  return (
    <HelmetProvider>
      <AuthProvider>
        {authInitialized ? (
          <Router>
            <div className="min-h-screen bg-gray-50">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/produkty" element={<ProductsPage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/product/:id" element={<ProductPage />} />
                {/* Route for product codes and aliases */}
                <Route path="/:codeOrAlias" element={<ProductPage />} />
                <Route path="/logowanie" element={<LoginPage />} />
                <Route path="/rejestracja" element={<RegisterPage />} />
                <Route path="/reset-hasla" element={<ResetPasswordPage />} />
                <Route path="/reset-password" element={<UpdatePasswordPage />} />
                <Route path="/verification-required" element={<VerificationRequiredPage />} />
                <Route path="/profil" element={<ProfilePage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/blog/:slug" element={<BlogPostPage />} />
                <Route path="/blog/edytor/:slug" element={<BlogEditorPage />} />
              </Routes>
            </div>
          </Router>
        ) : (
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
          </div>
        )}
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;