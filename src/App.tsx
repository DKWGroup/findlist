import React from "react";
import { HelmetProvider } from "react-helmet-async";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { SimplifiedAuthProvider } from "./contexts/SimplifiedAuthContext";
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { ProductsPage } from "./pages/ProductsPage";
import { ProfilePage } from "./pages/ProfilePage";

function App() {
  console.log("App: Starting with simplified auth...");

  return (
    <HelmetProvider>
      <SimplifiedAuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/produkty" element={<ProductsPage />} />
              <Route path="/logowanie" element={<LoginPage />} />
              <Route path="/profil" element={<ProfilePage />} />
            </Routes>
          </div>
        </Router>
      </SimplifiedAuthProvider>
    </HelmetProvider>
  );
}

export default App;
