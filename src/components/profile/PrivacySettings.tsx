import { AlertCircle, Download, Info, Lock, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { useSimplifiedAuthContext } from "../../contexts/SimplifiedAuthContext";

export const PrivacySettings: React.FC = () => {
  const { user } = useSimplifiedAuthContext();
  const [isExporting, setIsExporting] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDataExport = async () => {
    setIsExporting(true);
    try {
      // TODO: Implement data export functionality
      console.log("Eksport danych - do implementacji");
      alert("Eksport danych zostanie wkrótce zaimplementowany");
    } catch (error) {
      console.error("Błąd eksportu danych:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleAccountDeletion = async () => {
    setIsDeletingAccount(true);
    try {
      // TODO: Implement account deletion functionality
      console.log("Usuwanie konta - do implementacji");
      alert("Usuwanie konta zostanie wkrótce zaimplementowane");
    } catch (error) {
      console.error("Błąd usuwania konta:", error);
    } finally {
      setIsDeletingAccount(false);
      setShowDeleteConfirm(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Prywatność</h2>
      </div>

      {/* Privacy Settings */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <Lock className="h-6 w-6 text-blue-600" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Ustawienia prywatności
            </h3>
            <p className="text-sm text-gray-600">
              Kontroluj widoczność swojego profilu i danych
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Profil publiczny</p>
              <p className="text-sm text-gray-600">
                Pozwól innym użytkownikom znaleźć Twój profil
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Pokazuj recenzje</p>
              <p className="text-sm text-gray-600">
                Wyświetlaj swoje recenzje publicznie
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">
                Udostępniaj listę życzeń
              </p>
              <p className="text-sm text-gray-600">
                Pozwól innym zobaczyć Twoją wishlistę
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Data Management */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <Download className="h-6 w-6 text-green-600" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Zarządzanie danymi
            </h3>
            <p className="text-sm text-gray-600">
              Eksportuj lub usuń swoje dane
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Eksportuj dane</p>
              <p className="text-sm text-gray-600">
                Pobierz kopię wszystkich swoich danych
              </p>
            </div>
            <button
              onClick={handleDataExport}
              disabled={isExporting}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
            >
              <Download className="h-4 w-4" />
              {isExporting ? "Eksportowanie..." : "Eksportuj"}
            </button>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-red-900 mb-2">
                  Strefa niebezpieczna
                </p>
                <p className="text-sm text-red-700 mb-4">
                  Usunięcie konta jest nieodwracalne. Wszystkie Twoje dane
                  zostaną trwale usunięte.
                </p>
                {!showDeleteConfirm ? (
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                    Usuń konto
                  </button>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-red-800 font-medium">
                      Czy na pewno chcesz usunąć swoje konto? Ta akcja jest
                      nieodwracalna.
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={handleAccountDeletion}
                        disabled={isDeletingAccount}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-red-400 transition-colors"
                      >
                        {isDeletingAccount ? "Usuwanie..." : "Tak, usuń konto"}
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(false)}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        Anuluj
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Information */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="font-medium text-blue-900 mb-2">
              Informacje o prywatności
            </h3>
            <p className="text-sm text-blue-800">
              Dbamy o Twoją prywatność. Wszystkie dane są przechowywane zgodnie
              z RODO i nie są udostępniane osobom trzecim bez Twojej zgody.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
