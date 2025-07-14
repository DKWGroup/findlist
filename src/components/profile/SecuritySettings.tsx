import {
  AlertCircle,
  Check,
  Eye,
  EyeOff,
  Info,
  Loader2,
  Lock,
  Shield,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useSimplifiedAuthContext } from "../../contexts/SimplifiedAuthContext";

export const SecuritySettings: React.FC = () => {
  const { user, updatePassword, validatePassword } = useSimplifiedAuthContext();
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  // Password strength state
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    uppercase: false,
    number: false,
    special: false,
  });

  useEffect(() => {
    // Component initialization if needed
  }, [user]);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");
    setIsChangingPassword(true);

    try {
      // Basic validation
      if (!passwordData.newPassword || !passwordData.confirmPassword) {
        setFormError("Wszystkie pola są wymagane");
        return;
      }

      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setFormError("Nowe hasła nie są identyczne");
        return;
      }

      // Validate password strength
      if (!validatePassword(passwordData.newPassword)) {
        setFormError("Hasło nie spełnia wymagań bezpieczeństwa");
        return;
      }

      // Update password using Supabase
      const result = await updatePassword(passwordData.newPassword);
      
      if (result.success) {
        setFormSuccess("Hasło zostało zmienione pomyślnie");
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        setFormError("Nie udało się zmienić hasła");
      }
    } catch (error) {
      if (error instanceof Error) {
        setFormError(error.message);
      } else {
        setFormError("Wystąpił błąd podczas zmiany hasła");
      }
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Handle password input change with strength checking
  const handlePasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));

    // Check password strength when new password field changes
    if (name === "newPassword") {
      setPasswordStrength({
        length: value.length >= 8,
        uppercase: /[A-Z]/.test(value),
        number: /[0-9]/.test(value),
        special: /[^A-Za-z0-9]/.test(value),
      });
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Bezpieczeństwo
        </h2>
      </div>

      {/* Password Change Section */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <Lock className="h-6 w-6 text-blue-600" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Zmiana hasła
            </h3>
            <p className="text-sm text-gray-600">
              Zaktualizuj swoje hasło dla lepszego bezpieczeństwa
            </p>
          </div>
        </div>

        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Obecne hasło
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? "text" : "password"}
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                placeholder="Wprowadź obecne hasło"
                required
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showCurrentPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nowe hasło
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                placeholder="Minimum 8 znaków"
                required
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showNewPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>

            {/* Password strength indicator */}
            {passwordData.newPassword && (
              <div className="mt-3">
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      Object.values(passwordStrength).filter(Boolean).length <= 1
                        ? "bg-red-500"
                        : Object.values(passwordStrength).filter(Boolean).length === 2
                        ? "bg-orange-500"
                        : Object.values(passwordStrength).filter(Boolean).length === 3
                        ? "bg-yellow-500"
                        : "bg-green-500"
                    }`}
                    style={{
                      width: `${
                        (Object.values(passwordStrength).filter(Boolean).length / 4) * 100
                      }%`,
                    }}
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
                      {passwordStrength.length ? <Check className="w-3 h-3" /> : null}
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
                      {passwordStrength.uppercase ? <Check className="w-3 h-3" /> : null}
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
                      {passwordStrength.number ? <Check className="w-3 h-3" /> : null}
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
                      {passwordStrength.special ? <Check className="w-3 h-3" /> : null}
                    </div>
                    <span>Przynajmniej jeden znak specjalny</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Potwierdź nowe hasło
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12 ${
                  passwordData.newPassword !== passwordData.confirmPassword &&
                  passwordData.confirmPassword
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300"
                }`}
                placeholder="Powtórz hasło"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            {passwordData.newPassword !== passwordData.confirmPassword &&
              passwordData.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">
                  Hasła nie są identyczne
                </p>
              )}
          </div>

          {formError && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">{formError}</span>
            </div>
          )}

          {formSuccess && (
            <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg">
              <Check className="h-4 w-4" />
              <span className="text-sm">{formSuccess}</span>
            </div>
          )}

          <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg text-xs text-blue-700">
            <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <p>
              Silne hasło jest kluczem do bezpieczeństwa Twojego konta. Nie używaj tego samego hasła w innych serwisach.
            </p>
          </div>

          <button
            type="submit"
            disabled={isChangingPassword}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
          >
            {isChangingPassword ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Zmienianie...</span>
              </>
            ) : (
              <span>Zmień hasło</span>
            )}
          </button>
        </form>
      </div>

      {/* Account Security */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="h-6 w-6 text-gray-600" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Bezpieczeństwo konta
            </h3>
            <p className="text-sm text-gray-600">
              Dodatkowe opcje bezpieczeństwa
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">
                Uwierzytelnianie dwuskładnikowe
              </p>
              <p className="text-sm text-gray-600">
                Dodatkowa warstwa bezpieczeństwa
              </p>
            </div>
            <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
              Wkrótce
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
