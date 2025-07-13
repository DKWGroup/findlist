import {
  AlertCircle,
  Calendar,
  Check,
  Edit3,
  FileText,
  Lock,
  LogOut,
  Mail,
  Save,
  Settings,
  Shield,
  User,
  X,
} from "lucide-react";
import React, { useState } from "react";
import { useSimplifiedAuthContext } from "../../contexts/SimplifiedAuthContext";

export const IntegratedUserProfile: React.FC = () => {
  const { user, logout, isLoading } = useSimplifiedAuthContext();
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.email?.split("@")[0] || "",
    email: user?.email || "",
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!user) return null;

  const handleSave = async () => {
    // Implementacja aktualizacji profilu w przyszłości
    console.log("Zapisywanie profilu:", formData);
    setIsEditing(false);
  };

  const handleLogout = async () => {
    await logout();
  };

  const tabs = [
    { id: "profile", label: "Profil", icon: User },
    { id: "account", label: "Konto", icon: Settings },
    { id: "security", label: "Bezpieczeństwo", icon: Lock },
    { id: "privacy", label: "Prywatność", icon: Shield },
  ];

  const renderProfileTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">
          Informacje podstawowe
        </h2>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Edit3 className="h-4 w-4" />
            Edytuj
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Save className="h-4 w-4" />
              Zapisz
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <X className="h-4 w-4" />
              Anuluj
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nazwa użytkownika
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-900 p-2 bg-gray-50 rounded-lg">
                {formData.name || "Nie ustawiono"}
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
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ID użytkownika
            </label>
            <p className="text-gray-900 font-mono text-sm p-2 bg-gray-50 rounded-lg">
              {user.id}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data utworzenia konta
            </label>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <p className="text-gray-900">
                {user.created_at
                  ? new Date(user.created_at).toLocaleDateString("pl-PL", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "Nieznana"}
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ostatnia aktywność
            </label>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-green-700 font-medium">Aktywny teraz</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAccountTab = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Ustawienia konta</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="border rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">Status konta</h3>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-green-700">Aktywne</span>
            </div>
          </div>

          <div className="border rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">Typ konta</h3>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-400" />
              <span className="text-gray-900">Użytkownik standardowy</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="border rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">Preferencje</h3>
            <div className="space-y-2">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" defaultChecked />
                <span className="text-sm">Powiadomienia email</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" defaultChecked />
                <span className="text-sm">Aktualizacje produktów</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Bezpieczeństwo</h2>

      <div className="space-y-4">
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-medium text-gray-900">Zmiana hasła</h3>
              <p className="text-sm text-gray-600">
                Zaktualizuj swoje hasło dla lepszego bezpieczeństwa
              </p>
            </div>
            <Lock className="h-5 w-5 text-gray-400" />
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Zmień hasło
          </button>
        </div>

        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-medium text-gray-900">Sesje aktywne</h3>
              <p className="text-sm text-gray-600">
                Zarządzaj urządzeniami zalogowanymi na Twoje konto
              </p>
            </div>
            <Shield className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
              <div>
                <p className="font-medium text-green-900">Obecna sesja</p>
                <p className="text-sm text-green-700">
                  {navigator.userAgent.includes("Chrome")
                    ? "Chrome"
                    : navigator.userAgent.includes("Firefox")
                    ? "Firefox"
                    : "Przeglądarka"}{" "}
                  • Teraz
                </p>
              </div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPrivacyTab = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Prywatność</h2>

      <div className="space-y-4">
        <div className="border rounded-lg p-4">
          <h3 className="font-medium text-gray-900 mb-4">
            Ustawienia prywatności
          </h3>
          <div className="space-y-3">
            <label className="flex items-center justify-between">
              <span className="text-sm">Profil publiczny</span>
              <input type="checkbox" className="toggle" />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-sm">Pokazuj recenzje</span>
              <input type="checkbox" className="toggle" defaultChecked />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-sm">Udostępniaj wishlistę</span>
              <input type="checkbox" className="toggle" />
            </label>
          </div>
        </div>

        <div className="border rounded-lg p-4">
          <h3 className="font-medium text-gray-900 mb-4">Dane konta</h3>
          <div className="space-y-3">
            <button className="w-full p-3 text-left border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <span className="font-medium">Eksportuj dane</span>
                <FileText className="h-4 w-4 text-gray-400" />
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Pobierz kopię swoich danych
              </p>
            </button>
            <button className="w-full p-3 text-left border rounded-lg hover:bg-red-50 transition-colors border-red-200">
              <div className="flex items-center justify-between">
                <span className="font-medium text-red-600">Usuń konto</span>
                <AlertCircle className="h-4 w-4 text-red-400" />
              </div>
              <p className="text-sm text-red-600 mt-1">
                Trwale usuń swoje konto
              </p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {formData.name || user.email?.split("@")[0] || "Użytkownik"}
                  </h1>
                  <p className="text-gray-600">{user.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Wyloguj
              </button>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="flex border-b border-gray-200">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                    activeTab === tab.id
                      ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {activeTab === "profile" && renderProfileTab()}
          {activeTab === "account" && renderAccountTab()}
          {activeTab === "security" && renderSecurityTab()}
          {activeTab === "privacy" && renderPrivacyTab()}
        </div>
      </div>
    </div>
  );
};
