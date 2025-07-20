import { BookOpen, Instagram, Mail } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <img
                src="/viralist-logo2.png"
                alt="VIRALIST"
                className="h-8 w-auto"
              />
            </Link>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Pierwsza w Polsce platforma agregująca viralne produkty z mediów
              społecznościowych. Odkryj trendy zanim staną się mainstream.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-blue-400 transition-colors"
              >
                <Instagram className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Produkty</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/produkty"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Wszystkie produkty
                </Link>
              </li>
              {/* <li>
                <Link
                  to="/produkty?trending=true"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Trendy
                </Link>
              </li>
              <li>
                <Link
                  to="/produkty?kategoria=elektronika"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Elektronika
                </Link>
              </li>
              <li>
                <Link
                  to="/produkty?kategoria=moda"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Moda
                </Link>
              </li>
              <li>
                <Link
                  to="/produkty?kategoria=dom-ogrod"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Dom i ogród
                </Link>
              </li> */}
            </ul>
          </div>

          {/* Blog & Company */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Blog & Firma</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/blog"
                  className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
                >
                  <BookOpen className="h-4 w-4" />
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  to="/jak-to-dziala"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Jak to działa
                </Link>
              </li>
              <li>
                <Link
                  to="/o-nas"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  O nas
                </Link>
              </li>
              <li>
                <Link
                  to="/kontakt"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Kontakt
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Informacje prawne</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/regulamin"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Regulamin
                </Link>
              </li>
              <li>
                <Link
                  to="/polityka-prywatnosci"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Polityka prywatności
                </Link>
              </li>
              <li>
                <Link
                  to="/cookies"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Polityka cookies
                </Link>
              </li>
              <li>
                <Link
                  to="/afiliacja"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Program afiliacyjny
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="mb-4 md:mb-0">
              <h3 className="text-lg font-semibold mb-2">
                Bądź na bieżąco z trendami
              </h3>
              <p className="text-gray-400">
                Otrzymuj powiadomienia o najnowszych viralnych produktach
              </p>
            </div>
            <div className="flex flex-col w-full md:w-auto gap-3">
              <div className="flex w-full md:w-auto">
                <input
                  type="email"
                  placeholder="Twój adres email"
                  className="flex-1 md:w-64 px-4 py-3 bg-gray-800 border border-gray-700 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-r-lg transition-colors flex items-center">
                  <Mail className="h-5 w-5" />
                </button>
              </div>
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="newsletter-terms"
                  required
                  className="mt-1 rounded border-gray-600 bg-gray-800 text-blue-600 focus:ring-blue-500"
                />
                <label
                  htmlFor="newsletter-terms"
                  className="text-xs text-gray-400"
                >
                  Akceptuję{" "}
                  <Link
                    to="/regulamin"
                    className="text-blue-400 hover:text-blue-300 underline"
                  >
                    regulamin
                  </Link>{" "}
                  oraz{" "}
                  <Link
                    to="/polityka-prywatnosci"
                    className="text-blue-400 hover:text-blue-300 underline"
                  >
                    politykę prywatności
                  </Link>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-gray-400">
          <p>&copy; {currentYear} VIRALIST. Wszystkie prawa zastrzeżone.</p>
          <p className="mt-2 md:mt-0">Wykonane z ❤️ w Polsce</p>
        </div>
      </div>
    </footer>
  );
};
