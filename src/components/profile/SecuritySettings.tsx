import {
  AlertCircle,
  Check,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Shield,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useSimplifiedAuthContext } from "../../contexts/SimplifiedAuthContext";
import { supabase } from "../../services/supabaseStorage";

export const SecuritySettings: React.FC = () => {
  const { user } = useSimplifiedAuthContext();
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isChangingEmail, setIsChangingEmail] = useState(false);
  const [emailChangeRequested, setEmailChangeRequested] = useState(false);
  const [emailVerificationSent, setEmailVerificationSent] = useState(false);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [emailData, setEmailData] = useState({
    newEmail: "",
    password: "",
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showEmailPassword, setShowEmailPassword] = useState(false);

  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [emailFormError, setEmailFormError] = useState("");
  const [emailFormSuccess, setEmailFormSuccess] = useState("");

  useEffect(() => {
    if (user) {
      checkEmailVerificationStatus();
    }
  }, [user]);

  const checkEmailVerificationStatus = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("email_verification_token, email_verification_sent_at")
        .eq("id", user?.id)
        .single();

      if (error) throw error;

      if (data?.email_verification_token && data?.email_verification_sent_at) {
        setEmailChangeRequested(true);
        setEmailVerificationSent(true);
      }
    } catch (error) {
      console.error("Error checking email verification status:", error);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");
    setIsChangingPassword(true);

    try {
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setFormError("Nowe hasła nie są identyczne");
        return;
      }

      if (passwordData.newPassword.length < 8) {
        setFormError("Hasło musi mieć co najmniej 8 znaków");
        return;
      }

      // TODO: Implement password change with Supabase
      console.log("Zmiana hasła - do implementacji");
      setFormSuccess("Hasło zostało zmienione pomyślnie");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      setFormError("Wystąpił błąd podczas zmiany hasła");
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleEmailChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailFormError("");
    setEmailFormSuccess("");
    setIsChangingEmail(true);

    try {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailData.newEmail)) {
        setEmailFormError("Podany adres email jest nieprawidłowy");
        setIsChangingEmail(false);
        return;
      }

      // Verify current password
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user?.email || "",
        password: emailData.password,
      });

      if (signInError) {
        setEmailFormError("Nieprawidłowe hasło");
        setIsChangingEmail(false);
        return;
      }

      // Update profile with new email (this will trigger the verification process)
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          email: emailData.newEmail,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user?.id);

      if (updateError) throw updateError;

      setEmailFormSuccess(
        "Link weryfikacyjny został wysłany na nowy adres email"
      );
      setEmailChangeRequested(true);
      setEmailVerificationSent(true);
      setEmailData({
        newEmail: "",
        password: "",
      });
    } catch (error: any) {
      setEmailFormError(
        error.message || "Wystąpił błąd podczas zmiany adresu email"
      );
    } finally {
      setIsChangingEmail(false);
    }
  };

  const cancelEmailChange = async () => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          email_verification_token: null,
          email_verification_sent_at: null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user?.id);

      if (error) throw error;

      setEmailChangeRequested(false);
      setEmailVerificationSent(false);
      setEmailFormSuccess("Zmiana adresu email została anulowana");
    } catch (error: any) {
      setEmailFormError(
        error.message || "Wystąpił błąd podczas anulowania zmiany adresu email"
      );
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
                value={passwordData.currentPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    currentPassword: e.target.value,
                  })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
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
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    newPassword: e.target.value,
                  })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
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
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Potwierdź nowe hasło
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    confirmPassword: e.target.value,
                  })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
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

          <button
            type="submit"
            disabled={isChangingPassword}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-lg transition-colors font-medium"
          >
            {isChangingPassword ? "Zmienianie..." : "Zmień hasło"}
          </button>
        </form>
      </div>
    </div>
  );
};
