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

      {/* Data Management */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="space-y-4">
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
