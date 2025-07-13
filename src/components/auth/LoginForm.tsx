import { AlertCircle, Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSimplifiedAuthContext } from "../../contexts/SimplifiedAuthContext";

export const LoginForm: React.FC = () => {
  const { login, isLoading: authLoading } = useSimplifiedAuthContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [localLoading, setLocalLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.email.trim()) {
      setFormError("Wprowadź adres email");
      return;
    }

    if (!formData.password.trim()) {
      setFormError("Wprowadź hasło");
      return;
    }

    // Clear previous errors
    setFormError("");
    setLocalLoading(true);

    try {
      const result = await login({
        email: formData.email.trim(),
        password: formData.password,
      });

      if (result && result.success) {
        console.log("Login successful, navigating to profile");

        // Get redirect path from location state or default to profile
        const from = location.state?.from?.pathname || "/profil";

        // Use a short timeout to ensure the auth state is updated before navigation
        setTimeout(() => {
          navigate(from, { replace: true });
        }, 100);
      } else {
        setFormError("Wystąpił nieznany błąd podczas logowania");
      }
    } catch (error) {
      console.error("Login error:", error);
      if (error instanceof Error) {
        setFormError(error.message);
      } else {
        setFormError("Wystąpił nieznany błąd podczas logowania");
      }
    } finally {
      setLocalLoading(false);
    }
  };

  const [formError, setFormError] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Clear any stale session data when user starts typing - removed for simple auth

    setFormData((prev) => ({
      ...prev,
      [e.target.name]:
        e.target.type === "checkbox" ? e.target.checked : e.target.value,
    }));
  };

  const isFormLoading = localLoading || authLoading;

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Zaloguj się</h2>
          <p className="text-gray-600">Witaj ponownie w VIRALIST</p>
        </div>

        {formError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-start gap-2">
            <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <div>{formError}</div>
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
                disabled={isFormLoading}
                className={`w-full pl-10 pr-12 py-3 border ${
                  formError && !formData.password
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300"
                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                placeholder="Twoje hasło"
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

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.rememberMe}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    rememberMe: e.target.checked,
                  }))
                }
                disabled={isFormLoading}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-600">
                Zapamiętaj mnie
              </span>
            </label>
            <Link
              to="/reset-hasla"
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Nie pamiętasz hasła?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isFormLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {isFormLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Logowanie...</span>
              </>
            ) : (
              <span>Zaloguj się</span>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-2">
            Nie masz konta?{" "}
            <Link
              to="/rejestracja"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Zarejestruj się
            </Link>
          </p>
          <p className="text-xs text-gray-500">
            Logując się akceptujesz naszą{" "}
            <Link
              to="/polityka-prywatnosci"
              className="text-blue-600 hover:text-blue-700"
            >
              Politykę Prywatności
            </Link>{" "}
            oraz{" "}
            <Link to="/regulamin" className="text-blue-600 hover:text-blue-700">
              Regulamin
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
