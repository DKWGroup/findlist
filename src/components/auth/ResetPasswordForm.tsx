import {
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  Loader2,
  Mail,
} from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSimplifiedAuthContext } from "../../contexts/SimplifiedAuthContext";

export const ResetPasswordForm: React.FC = () => {
  const { resetPassword, error } = useSimplifiedAuthContext();
  const [email, setEmail] = useState("");
  const [localLoading, setLocalLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!email.trim()) {
      setFormError("Wprowadź adres email");
      return;
    }

    // Email format validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      setFormError("Nieprawidłowy format adresu email");
      return;
    }

    // Clear previous errors
    setFormError("");
    setLocalLoading(true);

    try {
      await resetPassword(email);
      setSuccess(true);
    } catch (error) {
      if (error instanceof Error) {
        setFormError(error.message);
      } else {
        setFormError("Wystąpił nieznany błąd");
      }
    } finally {
      setLocalLoading(false);
    }
  };

  const isFormLoading = localLoading;

  if (success) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Link wysłany!
            </h2>
            <p className="text-gray-600">
              Instrukcje resetowania hasła zostały wysłane na adres {email}
            </p>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Sprawdź swoją skrzynkę odbiorczą oraz folder spam. Link do
              resetowania hasła jest ważny przez 24 godziny.
            </p>

            <div className="flex flex-col gap-3">
              <Link
                to="/logowanie"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                Wróć do logowania
              </Link>

              <button
                onClick={() => {
                  setSuccess(false);
                  setEmail("");
                }}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors"
              >
                Wyślij ponownie
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Resetowanie hasła
          </h2>
          <p className="text-gray-600">
            Podaj adres email, na który wyślemy link do resetowania hasła
          </p>
        </div>

        {(error || formError) && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-start gap-2">
            <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <div>{error || formError}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Adres email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isFormLoading}
                className={`w-full pl-10 pr-4 py-3 border ${
                  formError ? "border-red-300 bg-red-50" : "border-gray-300"
                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                placeholder="twoj@email.com"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isFormLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {isFormLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Wysyłanie...</span>
              </>
            ) : (
              <span>Wyślij link resetujący</span>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link
            to="/logowanie"
            className="inline-flex items-center text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Wróć do logowania
          </Link>
        </div>
      </div>
    </div>
  );
};
