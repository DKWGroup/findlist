import {
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  Eye,
  EyeOff,
  Info,
  Loader2,
  Lock,
  Mail,
} from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSimplifiedAuthContext } from "../../contexts/SimplifiedAuthContext";

export const ResetPasswordForm: React.FC = () => {
  const {
    resetPassword,
    updatePassword,
    validatePassword,
    error: authError,
  } = useSimplifiedAuthContext();
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localLoading, setLocalLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showResetForm, setShowResetForm] = useState(true);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [linkError, setLinkError] = useState<string | null>(null);
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    uppercase: false,
    number: false,
    special: false,
  });

  // Check if we have a hash in the URL (for password reset flow)
  React.useEffect(() => {
    const url = new URL(window.location.href);
    const hash = url.hash;
    const errorParam = url.searchParams.get("error");
    const errorCode = url.searchParams.get("error_code");
    const errorDescription = url.searchParams.get("error_description");

    // Check for error parameters
    if (errorParam && errorCode) {
      let errorMessage = "Link resetowania hasła jest nieprawidłowy.";

      if (errorCode === "otp_expired") {
        errorMessage =
          "Link resetowania hasła wygasł. Proszę wygenerować nowy link.";
      } else if (errorDescription) {
        errorMessage = decodeURIComponent(errorDescription).replace(/\+/g, " ");
      }

      setLinkError(errorMessage);
      setShowResetForm(true);
      setShowPasswordForm(false);
    } else if (hash && hash.includes("type=recovery")) {
      setShowResetForm(false);
      setShowPasswordForm(true);
    }
  }, []);

  const handleResetSubmit = async (e: React.FormEvent) => {
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

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!newPassword || !confirmPassword) {
      setFormError("Wszystkie pola są wymagane");
      return;
    }

    if (newPassword !== confirmPassword) {
      setFormError("Hasła nie są identyczne");
      return;
    }

    // Validate password strength
    if (!validatePassword(newPassword)) {
      setFormError("Hasło nie spełnia wymagań bezpieczeństwa");
      return;
    }

    // Clear previous errors
    setFormError("");
    setLocalLoading(true);

    try {
      const result = await updatePassword(newPassword);
      if (result.success) {
        setSuccess(true);
        setShowPasswordForm(false);
      } else {
        setFormError("Nie udało się zaktualizować hasła");
      }
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

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    setNewPassword(password);

    // Check password strength
    setPasswordStrength({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    });
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
            {showResetForm ? "Resetowanie hasła" : "Ustaw nowe hasło"}
          </h2>
          {showResetForm ? (
            <p className="text-gray-600">
              Podaj adres email, na który wyślemy link do resetowania hasła
            </p>
          ) : (
            <p className="text-gray-600">Utwórz nowe hasło dla swojego konta</p>
          )}
        </div>

        {(authError || formError || linkError) && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-start gap-2">
            <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <div>{linkError || authError || formError}</div>
          </div>
        )}

        {showResetForm && (
          <form onSubmit={handleResetSubmit} className="space-y-6">
            {linkError && (
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg mb-6 flex items-start gap-2">
                <Info className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <div>
                  Link resetowania hasła wygasł lub jest nieprawidłowy. Proszę
                  wygenerować nowy link.
                </div>
              </div>
            )}

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
        )}

        {showPasswordForm && (
          <form onSubmit={handlePasswordSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Nowe hasło
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="newPassword"
                  value={newPassword}
                  onChange={handlePasswordChange}
                  required
                  disabled={isFormLoading}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Minimum 8 znaków"
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
            <div>
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
                      <CheckCircle className="w-3 h-3" />
                    ) : null}
                  </div>
                  <span>Minimum 8 znaków</span>
                </div>
                <div className="flex items-center gap-1">
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center ${
                      passwordStrength.uppercase
                        ? "bg-green-100 text-green-600"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {passwordStrength.uppercase ? (
                      <CheckCircle className="w-3 h-3" />
                    ) : null}
                  </div>
                  <span>Przynajmniej jedna duża litera</span>
                </div>
                <div className="flex items-center gap-1">
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center ${
                      passwordStrength.number
                        ? "bg-green-100 text-green-600"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {passwordStrength.number ? (
                      <CheckCircle className="w-3 h-3" />
                    ) : null}
                  </div>
                  <span>Przynajmniej jedna cyfra</span>
                </div>
                <div className="flex items-center gap-1">
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center ${
                      passwordStrength.special
                        ? "bg-green-100 text-green-600"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {passwordStrength.special ? (
                      <CheckCircle className="w-3 h-3" />
                    ) : null}
                  </div>
                  <span>Przynajmniej jeden znak specjalny</span>
                </div>
              </div>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Potwierdź nowe hasło
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={isFormLoading}
                  className={`w-full pl-10 pr-12 py-3 border ${
                    newPassword !== confirmPassword && confirmPassword
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
              {newPassword !== confirmPassword && confirmPassword && (
                <p className="mt-1 text-sm text-red-600">
                  Hasła nie są identyczne
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isFormLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {isFormLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Zapisywanie...</span>
                </>
              ) : (
                <span>Ustaw nowe hasło</span>
              )}
            </button>
          </form>
        )}

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
