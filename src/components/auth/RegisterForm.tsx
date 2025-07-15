import {
  AlertCircle,
  Check,
  Eye,
  EyeOff,
  Info,
  Loader2,
  Lock,
  Mail,
  User,
} from "lucide-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSimplifiedAuthContext } from "../../contexts/SimplifiedAuthContext";
import { GoogleSignIn } from "./GoogleSignIn";

export const RegisterForm: React.FC = () => {
  const { register, error, validatePassword } = useSimplifiedAuthContext();
  const navigate = useNavigate();
  const [localLoading, setLocalLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
    marketingConsent: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formError, setFormError] = useState<string>("");
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    uppercase: false,
    number: false,
    special: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous errors
    setFormError("");

    if (!formData.acceptTerms) {
      setFormError("Musisz zaakceptować regulamin i politykę prywatności");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setFormError("Hasła nie są identyczne");
      return;
    }

    // Validate email format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(formData.email)) {
      setFormError("Nieprawidłowy format adresu email");
      return;
    }

    // Validate password strength
    if (!validatePassword(formData.password)) {
      setFormError("Hasło nie spełnia wymagań bezpieczeństwa");
      return;
    }

    setLocalLoading(true);
    try {
      const result = await register(formData);

      // Redirect to profile on successful registration
      if (result.success) {
        navigate("/profil");
      }
    } catch (error) {
      if (error instanceof Error) {
        setFormError(error.message);
      } else {
        setFormError("Wystąpił nieznany błąd podczas rejestracji");
      }
    } finally {
      setLocalLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    // Clear session data is not needed with simplified auth

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    // Check password strength when password field changes
    if (name === "password") {
      const password = value as string;
      setPasswordStrength({
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[^A-Za-z0-9]/.test(password),
      });
    }
  };

  const isFormLoading = localLoading;

  // Calculate overall password strength
  const passwordStrengthScore =
    Object.values(passwordStrength).filter(Boolean).length;
  const getPasswordStrengthColor = () => {
    if (passwordStrengthScore <= 1) return "bg-red-500";
    if (passwordStrengthScore === 2) return "bg-orange-500";
    if (passwordStrengthScore === 3) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Załóż konto</h2>
          <p className="text-gray-600">Dołącz do społeczności VIRALIST</p>
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
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Imię i nazwisko
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={isFormLoading}
                className={`w-full pl-10 pr-4 py-3 border ${
                  formError && !formData.name
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300"
                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                placeholder="Jan Kowalski"
              />
            </div>
          </div>

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
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={isFormLoading}
                className={`w-full pl-10 pr-4 py-3 border ${
                  formError && !formData.email
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300"
                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                placeholder="twoj@email.com"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Hasło
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                disabled={isFormLoading}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Minimum 6 znaków"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isFormLoading}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Password strength indicator */}
          <div className="mb-6">
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full ${getPasswordStrengthColor()} transition-all duration-300`}
                style={{ width: `${(passwordStrengthScore / 4) * 100}%` }}
              ></div>
            </div>
            <div className="mt-2 text-xs text-gray-600 space-y-1">
              <div className="flex items-center gap-1">
                <div
                  className={`w-4 h-4 rounded-full flex items-center justify-center ${
                    passwordStrength.length
                      ? "bg-green-100 text-green-600"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {passwordStrength.length ? (
                    <Check className="w-3 h-3" />
                  ) : null}
                </div>
                <span>Minimum 8 znaków</span>
              </div>
              <div className="flex items-center gap-1">
                <div
                  className={`w-4 h-4 rounded-full flex items-center justify-center ${
                    passwordStrength.uppercase &&
                    passwordStrength.number &&
                    passwordStrength.special
                      ? "bg-green-100 text-green-600"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {passwordStrength.uppercase &&
                  passwordStrength.number &&
                  passwordStrength.special ? (
                    <Check className="w-3 h-3" />
                  ) : null}
                </div>
                <span>Zawiera dużą literę, cyfrę i znak specjalny</span>
              </div>
            </div>
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Potwierdź hasło
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                disabled={isFormLoading}
                className={`w-full pl-10 pr-12 py-3 border ${
                  formData.password !== formData.confirmPassword &&
                  formData.confirmPassword
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300"
                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                placeholder="Powtórz hasło"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isFormLoading}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-start mb-4">
            <input
              type="checkbox"
              name="acceptTerms"
              checked={formData.acceptTerms}
              onChange={handleChange}
              required
              disabled={isFormLoading}
              className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label className="ml-2 text-sm text-gray-600">
              Akceptuję <span className="text-red-500">*</span>{" "}
              <Link
                to="/regulamin"
                className="text-blue-600 hover:text-blue-700"
              >
                regulamin
              </Link>{" "}
              i{" "}
              <Link
                to="/polityka-prywatnosci"
                className="text-blue-600 hover:text-blue-700"
              >
                politykę prywatności
              </Link>
            </label>
          </div>

          <div className="flex items-start mb-6">
            <input
              type="checkbox"
              name="marketingConsent"
              checked={formData.marketingConsent}
              onChange={handleChange}
              disabled={isFormLoading}
              className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label className="ml-2 text-sm text-gray-600">
              Chcę otrzymywać newsletter z najnowszymi trendami i promocjami
            </label>
          </div>

          <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg mb-6 text-xs text-blue-700">
            <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <p>
              Po rejestracji wyślemy Ci email z linkiem aktywacyjnym. Sprawdź
              swoją skrzynkę odbiorczą oraz folder spam.
            </p>
          </div>

          <button
            type="submit"
            disabled={isFormLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {isFormLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Tworzenie konta...</span>
              </>
            ) : (
              <span>Załóż konto</span>
            )}
          </button>
        </form>

        {/* Google Sign-In */}
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Lub kontynuuj przez</span>
            </div>
          </div>
          
          <div className="mt-6">
            <GoogleSignIn />
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-2">
            Masz już konto?{" "}
            <Link
              to="/logowanie"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Zaloguj się
            </Link>
          </p>
          <p className="text-xs text-gray-500">
            Pola oznaczone <span className="text-red-500">*</span> są wymagane
          </p>
        </div>
      </div>
    </div>
  );
};
