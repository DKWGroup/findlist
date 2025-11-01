import {
  BookOpen,
  LogIn,
  LogOut,
  Menu,
  Package,
  Search,
  Shield,
  User,
  UserPlus,
  X,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSimplifiedAuthContext } from "../contexts/SimplifiedAuthContext";
import { isUserAdmin } from "../utils/adminUtils";
import { AdvancedSearchBar } from "./search/AdvancedSearchBar";

// Add loading state for auth
interface HeaderProps {
  onSearch?: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onSearch }) => {
  const { user, logout, isLoading, isAuthenticated, userRole } =
    useSimplifiedAuthContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const userMenuTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();

  console.log("Header auth state:", { user, isLoading, isAuthenticated });

  // Check admin status when user changes
  useEffect(() => {
    if (user) {
      isUserAdmin()
        .then((adminStatus) => {
          setIsAdmin(adminStatus);
        })
        .catch((err) => {
          console.error("Error checking admin status:", err);
          setIsAdmin(false);
        });
    } else {
      setIsAdmin(false);
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    // No need to navigate, the auth state change will trigger a re-render
  };

  const handleSearch = (query: string, filters?: any) => {
    if (onSearch) {
      onSearch(query);
    } else {
      // Navigate to search page with query
      navigate(`/szukaj?q=${encodeURIComponent(query)}`);
    }
  };

  // Close mobile search when clicking outside or opening menu
  useEffect(() => {
    if (isMenuOpen) {
      setIsMobileSearchOpen(false);
    }
  }, [isMenuOpen]);

  const handleUserMenuEnter = () => {
    if (userMenuTimeoutRef.current) {
      clearTimeout(userMenuTimeoutRef.current);
      userMenuTimeoutRef.current = null;
    }
    setIsUserMenuOpen(true);
  };

  const handleUserMenuLeave = () => {
    userMenuTimeoutRef.current = setTimeout(() => {
      setIsUserMenuOpen(false);
    }, 300); // 300ms opóźnienie
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (userMenuTimeoutRef.current) {
        clearTimeout(userMenuTimeoutRef.current);
      }
    };
  }, []);

  return (
    <header className="bg-white shadow-sm border-b border-blue-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img
              src="/findlist-logo2.png"
              alt="FINDLIST"
              className="h-8 w-auto"
            />
          </Link>

          {/* Desktop Search Bar */}
          <div className="hidden md:block flex-1 max-w-2xl mx-8">
            <AdvancedSearchBar
              onSearch={handleSearch}
              placeholder="Szukaj viralowych produktów..."
              showFilters={false}
              className="w-full"
            />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/produkty"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Produkty
            </Link>
            {/* <Link
              to="/szukaj"
              className="text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-1"
            >
              <Search className="h-4 w-4" />
              Wyszukiwanie
            </Link> */}
            <Link
              to="/blog"
              className="text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-1"
            >
              Blog
            </Link>

            {isLoading ? (
              <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
            ) : isAuthenticated && user ? (
              <div
                className="relative"
                onMouseEnter={handleUserMenuEnter}
                onMouseLeave={handleUserMenuLeave}
              >
                <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="font-medium">{user?.email}</span>
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 top-full w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <Link
                      to="/profil"
                      className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <User className="h-4 w-4" />
                      <span>Mój profil</span>
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <Shield className="h-4 w-4" />
                        <span>Panel Admin</span>
                      </Link>
                    )}
                    <hr className="my-2" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Wyloguj się</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/logowanie"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Logowanie
                </Link>
                <Link
                  to="/rejestracja"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Rejestracja
                </Link>
              </>
            )}
          </nav>

          {/* Mobile Menu Button and Search */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Mobile Search Button */}
            <button
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
              className="p-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-gray-100 transition-colors"
              aria-label="Szukaj"
            >
              <Search className="h-6 w-6" />
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-gray-100 transition-colors"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        {isMobileSearchOpen && (
          <div className="md:hidden pb-4 border-t border-gray-100 bg-gray-50">
            <div className="pt-4 px-4">
              <div className="flex items-center space-x-2">
                <div className="flex-1">
                  <AdvancedSearchBar
                    onSearch={(query, filters) => {
                      handleSearch(query, filters);
                      setIsMobileSearchOpen(false); // Zamknij wyszukiwanie po wyszukaniu
                    }}
                    placeholder="Szukaj viralowych produktów..."
                    showFilters={false}
                    className="w-full"
                  />
                </div>
                <button
                  onClick={() => setIsMobileSearchOpen(false)}
                  className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-200 transition-colors"
                  aria-label="Zamknij wyszukiwanie"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-4 space-y-4">
            <Link
              to="/produkty"
              className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <Package className="h-4 w-4" />
              Produkty
            </Link>
            {/* <Link
              to="/search"
              className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <Search className="h-4 w-4" />
              Wyszukiwanie
            </Link> */}
            <Link
              to="/blog"
              className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <BookOpen className="h-4 w-4" />
              Blog
            </Link>

            {isAuthenticated && user ? (
              <>
                <Link
                  to="/profil"
                  className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="h-5 w-5" />
                  <span>Mój profil</span>
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Shield className="h-5 w-5" />
                    <span>Panel Admin</span>
                  </Link>
                )}
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center space-x-2 text-red-600 hover:text-red-700 transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Wyloguj się</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/logowanie"
                  className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <LogIn className="h-4 w-4" />
                  Logowanie
                </Link>
                <Link
                  to="/rejestracja"
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <UserPlus className="h-4 w-4" />
                  Rejestracja
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
