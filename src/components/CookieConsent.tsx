import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const COOKIE_CONSENT_KEY = "viralist_cookie_consent";

export const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Sprawdź czy użytkownik już wyraził zgodę
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      // Pokaż popup po małym opóźnieniu dla lepszego UX
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "accepted");
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "declined");
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/30 z-40 transition-opacity duration-300" />

      {/* Cookie Consent Popup */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 animate-slide-up">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-2xl border border-gray-200">
          <div className="p-6 md:p-8">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <h3 className="text-xl md:text-2xl font-bold text-gray-900">
                  🍪 Cenimy Twoją prywatność
                </h3>
              </div>
              <button
                onClick={handleDecline}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Zamknij"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="mb-6">
              <p className="text-gray-700 text-base md:text-lg mb-3">
                Używamy plików cookie, aby zapewnić najlepsze doświadczenia na
                naszej stronie. Pliki cookie pomagają nam w analizie ruchu,
                personalizacji treści i poprawie funkcjonalności serwisu.
              </p>
              <p className="text-gray-600 text-sm">
                Kontynuując korzystanie ze strony, wyrażasz zgodę na używanie
                plików cookie zgodnie z naszą{" "}
                <Link
                  to="/polityka-prywatnosci"
                  className="text-blue-600 hover:text-blue-700 underline font-medium"
                >
                  Polityką Prywatności
                </Link>{" "}
                .
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAccept}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
              >
                Akceptuję wszystkie
              </button>
              <button
                onClick={handleDecline}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
              >
                Odrzuć opcjonalne
              </button>
            </div>

            {/* Additional info */}
            <p className="text-xs text-gray-500 mt-4 text-center">
              Możesz zmienić ustawienia cookies w każdej chwili w ustawieniach
              przeglądarki
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-up {
          animation: slide-up 0.4s ease-out;
        }
      `}</style>
    </>
  );
};
