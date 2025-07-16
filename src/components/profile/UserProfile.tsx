import {
  AlertCircle,
  Calendar,
  Check,
  Heart,
  Lock,
  Mail,
  Settings,
  Star,
  User,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useSimplifiedAuthContext } from "../../contexts/SimplifiedAuthContext";
import { supabase } from "../../services/supabaseStorage";
import { SecuritySettings } from "./SecuritySettings";

export const UserProfile: React.FC = () => {
  const { user } = useSimplifiedAuthContext();
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [formData, setFormData] = useState({
    name: user?.email?.split("@")[0] || "",
    email: user?.email || "",
    notification_preferences: {
      email_notifications: true,
      product_updates: true,
      marketing_emails: false,
      security_alerts: true,
    },
    privacy_settings: {
      public_profile: false,
      show_wishlist: false,
      show_reviews: true,
      allow_recommendations: true,
    },
    theme: "light",
    language: "pl",
  });
  const [wishlistProducts, setWishlistProducts] = useState<any[]>([]);
  const [userReviews, setUserReviews] = useState<any[]>([]);

  // Load user settings when component mounts
  useEffect(() => {
    console.log(
      "🚀 [INIT] UserProfile useEffect uruchomiony, użytkownik:",
      user?.id
    );

    if (user) {
      console.log("👤 [INIT] Użytkownik zalogowany, ładowanie danych...");

      console.log("🔄 [INIT] Ładowanie ustawień użytkownika...");
      loadUserSettings();

      console.log("🔄 [INIT] Ładowanie produktów wishlisty...");
      // Load wishlist products
      loadWishlistProducts();

      console.log("🔄 [INIT] Ładowanie recenzji użytkownika...");
      // Load user reviews
      loadUserReviews();
    } else {
      console.log("❌ [INIT] Brak zalogowanego użytkownika");
    }
  }, [user]);

  const loadWishlistProducts = async () => {
    console.log(
      "🔄 [WISHLIST] Rozpoczęcie ładowania wishlisty dla użytkownika:",
      user?.id
    );
    try {
      // Use the get_user_wishlist function with correct parameter name
      const { data, error } = await supabase.rpc("get_user_wishlist", {
        p_user_id: user?.id
      });

      console.log("📊 [WISHLIST] Odpowiedź z RPC get_user_wishlist:", {
        data,
        error,
      });

      if (error) {
        console.error(
          "❌ [WISHLIST] Błąd podczas pobierania wishlisty:",
          error
        );
        throw error;
      }

      // Handle the case where data might be a string representation of JSON
      let wishlistData = data || [];
      console.log(
        "📝 [WISHLIST] Surowe dane wishlisty:",
        wishlistData,
        "Typ:",
        typeof wishlistData
      );

      if (typeof wishlistData === "string") {
        try {
          console.log("🔄 [WISHLIST] Parsowanie stringowych danych JSON...");
          wishlistData = JSON.parse(wishlistData);
          console.log("✅ [WISHLIST] Dane po parsowaniu:", wishlistData);
        } catch (parseError) {
          console.error(
            "❌ [WISHLIST] Błąd parsowania danych wishlisty:",
            parseError
          );
          wishlistData = [];
        }
      }

      console.log(
        "✅ [WISHLIST] Załadowano produkty wishlisty:",
        wishlistData.length,
        "produktów"
      );
      setWishlistProducts(wishlistData);
    } catch (error) {
      console.error("❌ [WISHLIST] Błąd ładowania wishlisty:", error);
      setWishlistProducts([]);
    }
  };

  const loadUserReviews = async () => {
    console.log(
      "🔄 [REVIEWS] Rozpoczęcie ładowania recenzji dla użytkownika:",
      user?.id
    );
    try {
      // Get user reviews from profile
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("reviews")
        .eq("id", user?.id)
        .single();

      console.log("📊 [REVIEWS] Odpowiedź z tabeli profiles:", {
        profile,
        error,
      });

      if (error) {
        console.error("❌ [REVIEWS] Błąd podczas pobierania profilu:", error);
        throw error;
      }

      if (profile && profile.reviews) {
        console.log(
          "📝 [REVIEWS] Znalezione recenzje w profilu:",
          profile.reviews.length,
          "recenzji"
        );
        console.log("📄 [REVIEWS] Surowe dane recenzji:", profile.reviews);

        // Get product details for each review
        const reviewsWithProducts = await Promise.all(
          profile.reviews.map(async (review: any, index: number) => {
            console.log(
              `🔄 [REVIEWS] Ładowanie produktu ${index + 1}/${
                profile.reviews.length
              } dla recenzji:`,
              review.productId
            );
            try {
              const { data: product, error: productError } = await supabase
                .from("products")
                .select("id, title, images:product_images(url)")
                .eq("id", review.productId)
                .single();

              console.log(`📊 [REVIEWS] Produkt ${index + 1}:`, {
                product,
                productError,
              });

              if (productError) {
                console.warn(
                  `⚠️ [REVIEWS] Nie znaleziono produktu ${review.productId}:`,
                  productError
                );
              }

              const reviewWithProduct = {
                ...review,
                product: product
                  ? {
                      id: product.id,
                      title: product.title,
                      image: product.images?.[0]?.url,
                    }
                  : null,
              };

              console.log(
                `✅ [REVIEWS] Recenzja ${index + 1} z produktem:`,
                reviewWithProduct
              );
              return reviewWithProduct;
            } catch (err) {
              console.error(
                `❌ [REVIEWS] Błąd ładowania produktu dla recenzji ${review.productId}:`,
                err
              );
              return review;
            }
          })
        );

        console.log(
          "✅ [REVIEWS] Wszystkie recenzje z produktami załadowane:",
          reviewsWithProducts.length
        );
        setUserReviews(reviewsWithProducts || []);
      } else {
        console.log("ℹ️ [REVIEWS] Brak recenzji w profilu użytkownika");
        setUserReviews([]);
      }
    } catch (error) {
      console.error("❌ [REVIEWS] Błąd ładowania recenzji:", error);
      setUserReviews([]);
    }
  };

  const loadUserSettings = async () => {
    console.log("🔄 [SETTINGS] Ładowanie ustawień użytkownika:", user?.id);
    try {
      // Get profile data
      console.log("📤 [SETTINGS] Pobieranie danych profilu...");
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single();

      console.log("📊 [SETTINGS] Dane profilu:", { profile, profileError });

      if (profileError) {
        console.error("❌ [SETTINGS] Błąd profilu:", profileError);
        throw profileError;
      }

      // Get user settings
      console.log("📤 [SETTINGS] Pobieranie ustawień użytkownika...");
      const { data: settings, error: settingsError } = await supabase
        .from("user_settings")
        .select("*")
        .eq("id", user?.id)
        .single();

      console.log("📊 [SETTINGS] Ustawienia użytkownika:", {
        settings,
        settingsError,
      });

      if (settingsError && settingsError.code !== "PGRST116") {
        console.error("❌ [SETTINGS] Błąd ustawień:", settingsError);
        throw settingsError;
      }

      if (settingsError?.code === "PGRST116") {
        console.log("ℹ️ [SETTINGS] Brak ustawień - używanie domyślnych");
      }

      const finalFormData = {
        name: profile?.full_name || user?.email?.split("@")[0] || "",
        email: user?.email || "",
        notification_preferences: settings?.notification_preferences || {
          email_notifications: true,
          product_updates: true,
          marketing_emails: false,
          security_alerts: true,
        },
        privacy_settings: settings?.privacy_settings || {
          public_profile: false,
          show_wishlist: false,
          show_reviews: true,
          allow_recommendations: true,
        },
        theme: settings?.theme || "light",
        language: settings?.language || "pl",
      };

      console.log("✅ [SETTINGS] Finalne dane formularza:", finalFormData);
      setFormData(finalFormData);
    } catch (error) {
      console.error(
        "❌ [SETTINGS] Błąd ładowania ustawień użytkownika:",
        error
      );
      setFormError("Nie udało się załadować ustawień użytkownika");
    }
  };

  if (!user) return null;

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    console.log(
      "🔄 [SAVE] Rozpoczęcie zapisywania profilu dla użytkownika:",
      user?.id
    );
    console.log("📝 [SAVE] Dane do zapisania:", formData);

    setFormError("");
    setFormSuccess("");
    setIsSaving(true);

    try {
      // Update profile
      console.log("📤 [SAVE] Aktualizacja profilu...");
      const profileUpdateData = {
        full_name: formData.name,
        updated_at: new Date().toISOString(),
      };
      console.log("📊 [SAVE] Dane profilu do aktualizacji:", profileUpdateData);

      const { error: profileError } = await supabase
        .from("profiles")
        .update(profileUpdateData)
        .eq("id", user?.id);

      console.log("📊 [SAVE] Wynik aktualizacji profilu:", { profileError });

      if (profileError) {
        console.error("❌ [SAVE] Błąd aktualizacji profilu:", profileError);
        throw profileError;
      }

      // Update user settings using RPC function
      console.log("📤 [SAVE] Aktualizacja ustawień użytkownika przez RPC...");
      const rpcParams = {
        user_uuid: user?.id,
        new_notification_preferences: formData.notification_preferences,
        new_privacy_settings: formData.privacy_settings,
        new_theme: formData.theme,
        new_language: formData.language,
      };
      console.log("📊 [SAVE] Parametry RPC:", rpcParams);

      const { error: settingsError } = await supabase.rpc(
        "update_user_settings",
        rpcParams
      );

      console.log("📊 [SAVE] Wynik aktualizacji ustawień:", { settingsError });

      if (settingsError) {
        console.error("❌ [SAVE] Błąd aktualizacji ustawień:", settingsError);
        throw settingsError;
      }

      console.log("✅ [SAVE] Profil został pomyślnie zaktualizowany");
      setFormSuccess("Profil został zaktualizowany pomyślnie");
      setIsEditing(false);
    } catch (error: any) {
      console.error("❌ [SAVE] Błąd aktualizacji profilu:", error);
      setFormError(
        error.message || "Wystąpił błąd podczas aktualizacji profilu"
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleNotificationChange = async (key: string, value: boolean) => {
    setFormError("");
    setFormSuccess("");
    setIsSaving(true);

    try {
      const updatedNotificationPreferences = {
        ...formData.notification_preferences,
        [key]: value,
      };

      // Update in database
      const { error } = await supabase
        .from("user_settings")
        .update({
          notification_preferences: updatedNotificationPreferences,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user?.id);

      if (error) throw error;

      // Update local state
      setFormData((prev) => ({
        ...prev,
        notification_preferences: updatedNotificationPreferences,
      }));

      setFormSuccess("Ustawienia powiadomień zostały zaktualizowane");
    } catch (error: any) {
      console.error("Error updating notification preferences:", error);
      setFormError(
        error.message ||
          "Wystąpił błąd podczas aktualizacji ustawień powiadomień"
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (
      !window.confirm(
        "Czy na pewno chcesz usunąć swoje konto? Ta operacja jest nieodwracalna!"
      )
    ) {
      return;
    }

    setFormError("");
    setFormSuccess("");
    setIsSaving(true);

    try {
      // Mark account for deletion in profiles table
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          data_deletion_requested: true,
          data_deletion_requested_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", user?.id);

      if (profileError) throw profileError;

      setFormSuccess(
        "Żądanie usunięcia konta zostało zarejestrowane. Skontaktujemy się z Tobą w ciągu 24 godzin."
      );

      // Optionally sign out the user
      setTimeout(() => {
        supabase.auth.signOut();
      }, 3000);
    } catch (error: any) {
      console.error("Error requesting account deletion:", error);
      setFormError(
        error.message || "Wystąpił błąd podczas żądania usunięcia konta"
      );
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: "profile", label: "Profil", icon: User },
    {
      id: "wishlist",
      label: `Wishlist (${wishlistProducts.length})`,
      icon: Heart,
    },
    { id: "reviews", label: `Recenzje (${userReviews.length})`, icon: Star },
    { id: "security", label: "Bezpieczeństwo", icon: Lock },
    { id: "settings", label: "Ustawienia", icon: Settings },
  ];

  function toggleWishlist(productId: string): void {
    handleWishlistToggle(productId);
  }

  const handleWishlistToggle = async (productId: string) => {
    console.log(
      "🔄 [WISHLIST_TOGGLE] Przełączanie wishlisty dla produktu:",
      productId,
      "użytkownik:",
      user?.id
    );

    if (!user) {
      console.warn("⚠️ [WISHLIST_TOGGLE] Brak zalogowanego użytkownika");
      return;
    }

    try {
      console.log("📤 [WISHLIST_TOGGLE] Wysyłanie RPC toggle_wishlist...");
      // Use the toggle_wishlist function with correct parameter names
      const { data, error } = await supabase.rpc("toggle_wishlist", {
        p_product_id: productId,
        p_user_id: user.id
      });

      console.log("📊 [WISHLIST_TOGGLE] Odpowiedź z RPC toggle_wishlist:", {
        data,
        error,
      });

      if (error) {
        console.error("❌ [WISHLIST_TOGGLE] Błąd RPC:", error);
        throw error;
      }

      const isAdded = data;
      console.log(
        "✅ [WISHLIST_TOGGLE] Operacja zakończona:",
        isAdded ? "DODANO" : "USUNIĘTO"
      );

      setFormSuccess(
        !isAdded
          ? "Produkt został usunięty z wishlist"
          : "Produkt został dodany do wishlist"
      );

      // Reload wishlist products
      console.log("🔄 [WISHLIST_TOGGLE] Przeładowywanie wishlisty...");
      await loadWishlistProducts();

      setTimeout(() => setFormSuccess(""), 3000);
    } catch (error: any) {
      console.error("❌ [WISHLIST_TOGGLE] Błąd aktualizacji wishlist:", error);
      setFormError(
        error.message || "Wystąpił błąd podczas aktualizacji wishlist"
      );
      setTimeout(() => setFormError(""), 3000);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-12">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
              <User className="h-12 w-12 text-blue-600" />
            </div>
            <div className="text-white">
              <h1 className="text-3xl font-bold mb-2">
                {formData.name || user.email?.split("@")[0] || "Użytkownik"}
              </h1>
              <p className="text-blue-100 mb-1">{user.email}</p>
              <div className="flex items-center gap-4 text-sm text-blue-100">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Dołączył{" "}
                  {user.created_at
                    ? new Date(user.created_at).toLocaleDateString("pl-PL")
                    : "Nieznana data"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <IconComponent className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="p-8">
          {activeTab === "profile" && (
            <div className="max-w-2xl">
              <form onSubmit={handleSave}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Informacje o profilu
                  </h2>
                  {!isEditing ? (
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Edytuj
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        disabled={isSaving}
                        className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        {isSaving ? "Zapisywanie..." : "Zapisz zmiany"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        Anuluj
                      </button>
                    </div>
                  )}
                </div>

                {/* Success/Error messages */}
                {formSuccess && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2 text-green-800">
                    <Check className="h-5 w-5 mt-0.5" />
                    <div>{formSuccess}</div>
                  </div>
                )}

                {formError && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 text-red-800">
                    <AlertCircle className="h-5 w-5 mt-0.5" />
                    <div>{formError}</div>
                  </div>
                )}

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Imię i nazwisko
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-lg">
                        {formData.name ||
                          user.email?.split("@")[0] ||
                          "Nie ustawiono"}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Adres email
                    </label>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <p className="text-gray-900">{user.email}</p>
                      <div className="flex items-center gap-1 text-green-600">
                        <Check className="h-4 w-4" />
                        <span className="text-sm">Zweryfikowany</span>
                      </div>
                    </div>
                    {isEditing && (
                      <div className="mt-2 p-3 bg-yellow-50 rounded-lg text-sm text-yellow-800">
                        <p>
                          Zmiana adresu email wymaga weryfikacji i jest dostępna
                          w zakładce Bezpieczeństwo.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Notification Preferences */}
                  {isEditing && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Preferencje powiadomień
                      </h3>
                      <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={
                              formData.notification_preferences
                                .email_notifications
                            }
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                notification_preferences: {
                                  ...prev.notification_preferences,
                                  email_notifications: e.target.checked,
                                },
                              }))
                            }
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-gray-700">
                            Powiadomienia email
                          </span>
                        </label>

                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={
                              formData.notification_preferences.product_updates
                            }
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                notification_preferences: {
                                  ...prev.notification_preferences,
                                  product_updates: e.target.checked,
                                },
                              }))
                            }
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-gray-700">
                            Aktualizacje produktów
                          </span>
                        </label>

                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={
                              formData.notification_preferences.marketing_emails
                            }
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                notification_preferences: {
                                  ...prev.notification_preferences,
                                  marketing_emails: e.target.checked,
                                },
                              }))
                            }
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-gray-700">
                            Wiadomości marketingowe
                          </span>
                        </label>

                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={
                              formData.notification_preferences.security_alerts
                            }
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                notification_preferences: {
                                  ...prev.notification_preferences,
                                  security_alerts: e.target.checked,
                                },
                              }))
                            }
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-gray-700">
                            Alerty bezpieczeństwa
                          </span>
                        </label>
                      </div>
                    </div>
                  )}

                  {/* Privacy Settings */}
                  {isEditing && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Ustawienia prywatności
                      </h3>
                      <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.privacy_settings.public_profile}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                privacy_settings: {
                                  ...prev.privacy_settings,
                                  public_profile: e.target.checked,
                                },
                              }))
                            }
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-gray-700">
                            Profil publiczny
                          </span>
                        </label>

                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.privacy_settings.show_wishlist}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                privacy_settings: {
                                  ...prev.privacy_settings,
                                  show_wishlist: e.target.checked,
                                },
                              }))
                            }
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-gray-700">
                            Pokazuj moją wishlistę innym
                          </span>
                        </label>

                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.privacy_settings.show_reviews}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                privacy_settings: {
                                  ...prev.privacy_settings,
                                  show_reviews: e.target.checked,
                                },
                              }))
                            }
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-gray-700">
                            Pokazuj moje recenzje
                          </span>
                        </label>

                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={
                              formData.privacy_settings.allow_recommendations
                            }
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                privacy_settings: {
                                  ...prev.privacy_settings,
                                  allow_recommendations: e.target.checked,
                                },
                              }))
                            }
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-gray-700">
                            Zezwalaj na personalizowane rekomendacje
                          </span>
                        </label>
                      </div>
                    </div>
                  )}

                  {/* Appearance Settings */}
                  {isEditing && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Wygląd
                      </h3>
                      <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Motyw
                          </label>
                          <select
                            value={formData.theme}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                theme: e.target.value,
                              }))
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="light">Jasny</option>
                            <option value="dark">Ciemny</option>
                            <option value="system">Systemowy</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Język
                          </label>
                          <select
                            value={formData.language}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                language: e.target.value,
                              }))
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="pl">Polski</option>
                            <option value="en">English</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </form>
            </div>
          )}

          {activeTab === "wishlist" && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Moja Wishlist ({wishlistProducts.length})
              </h2>
              {wishlistProducts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {wishlistProducts.map((product) => (
                    <div
                      key={product.id}
                      className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors"
                    >
                      <img
                        src={product.images[0]}
                        alt={product.title}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                        {product.title}
                      </h3>
                      <p className="text-blue-600 font-bold mb-3">
                        {product.price.discounted?.toFixed(2)}{" "}
                        {product.price.currency}
                      </p>
                      <div className="flex gap-2">
                        <a
                          href={`/produkt/${product.id}`}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-4 rounded-lg transition-colors text-sm"
                        >
                          Zobacz produkt
                        </a>
                        <button
                          onClick={() =>
                            user && toggleWishlist && toggleWishlist(product.id)
                          }
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Usuń z wishlist"
                        >
                          <Heart className="h-5 w-5 fill-current" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Pusta wishlist
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Dodaj produkty do swojej listy życzeń
                  </p>
                  <a
                    href="/produkty"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors inline-block"
                  >
                    Przeglądaj produkty
                  </a>
                </div>
              )}
            </div>
          )}

          {activeTab === "reviews" && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Moje Recenzje ({userReviews.length})
              </h2>
              {userReviews.length > 0 ? (
                <div className="space-y-6">
                  {userReviews.map((review) => {
                    const product = review.product;
                    return (
                      <div
                        key={review.id}
                        className="bg-gray-50 rounded-xl p-6"
                      >
                        {product && (
                          <div className="flex items-center gap-4 mb-4">
                            <img
                              src={product.image}
                              alt={product.title}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                            <div>
                              <h4 className="font-semibold text-gray-900">
                                {product?.title || "Produkt"}
                              </h4>
                              <a
                                href={`/produkt/${product.id}`}
                                className="text-blue-600 hover:text-blue-700 text-sm"
                              >
                                Zobacz produkt →
                              </a>
                            </div>
                          </div>
                        )}
                        <div className="flex items-center gap-2 mb-2">
                          {Array.from({ length: review.rating }).map((_, i) => (
                            <Star
                              key={i}
                              className="h-5 w-5 text-yellow-400 fill-current"
                            />
                          ))}
                          <span className="text-sm text-gray-600 ml-2">
                            {new Date(review.dateCreated).toLocaleDateString(
                              "pl-PL"
                            )}
                          </span>
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Star className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Brak recenzji
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Podziel się swoimi opiniami o produktach
                  </p>
                  <a
                    href="/produkty"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors inline-block"
                  >
                    Przeglądaj produkty
                  </a>
                </div>
              )}
            </div>
          )}

          {activeTab === "security" && <SecuritySettings />}

          {activeTab === "settings" && (
            <div className="max-w-2xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Ustawienia konta
              </h2>

              {/* Success/Error messages */}
              {formSuccess && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2 text-green-800">
                  <Check className="h-5 w-5 mt-0.5" />
                  <div>{formSuccess}</div>
                </div>
              )}

              {formError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 text-red-800">
                  <AlertCircle className="h-5 w-5 mt-0.5" />
                  <div>{formError}</div>
                </div>
              )}

              <div className="space-y-6">
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    Powiadomienia
                  </h3>
                  <div className="space-y-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={
                          formData.notification_preferences.product_updates
                        }
                        onChange={(e) =>
                          handleNotificationChange(
                            "product_updates",
                            e.target.checked
                          )
                        }
                        disabled={isSaving}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
                      />
                      <span className="ml-3 text-gray-700">
                        Powiadomienia o nowych produktach
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={
                          formData.notification_preferences.marketing_emails
                        }
                        onChange={(e) =>
                          handleNotificationChange(
                            "marketing_emails",
                            e.target.checked
                          )
                        }
                        disabled={isSaving}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
                      />
                      <span className="ml-3 text-gray-700">
                        Newsletter z trendami
                      </span>
                    </label>
                  </div>
                </div>

                <div className="bg-red-50 rounded-xl p-6 border border-red-200">
                  <h3 className="font-semibold text-red-900 mb-2">
                    Strefa niebezpieczna
                  </h3>
                  <p className="text-red-700 text-sm mb-4">
                    Usunięcie konta jest nieodwracalne i spowoduje utratę
                    wszystkich danych.
                  </p>
                  <button
                    onClick={handleDeleteAccount}
                    disabled={isSaving}
                    className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    {isSaving ? "Przetwarzanie..." : "Usuń konto"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
