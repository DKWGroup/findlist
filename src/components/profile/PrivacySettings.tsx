import React, { useState, useEffect } from 'react';
import { Lock, Download, Trash2, Info, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { securityService } from '../../services/securityService';

export const PrivacySettings: React.FC = () => {
  const { user, requestDataExport, requestAccountDeletion } = useAuth();
  const [consents, setConsents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [consentSettings, setConsentSettings] = useState({
    marketing: false,
    analytics: true,
    thirdParty: false
  });

  useEffect(() => {
    const loadConsentData = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        // Load consent history
        const consentHistory = await securityService.getConsentHistory(user.id);
        setConsents(consentHistory);
        
        // Set current consent states
        const marketingConsent = consentHistory.some(
          c => c.consent_type === 'marketing' && c.is_active
        );
        const analyticsConsent = consentHistory.some(
          c => c.consent_type === 'analytics' && c.is_active
        );
        const thirdPartyConsent = consentHistory.some(
          c => c.consent_type === 'third_party' && c.is_active
        );
        
        setConsentSettings({
          marketing: marketingConsent,
          analytics: analyticsConsent || true, // Default to true if no record
          thirdParty: thirdPartyConsent
        });
      } catch (error) {
        console.error('Error loading consent data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadConsentData();
  }, [user]);

  const handleConsentChange = async (type: string, checked: boolean) => {
    if (!user) return;
    
    try {
      await securityService.updateConsent(user.id, type, checked);
      
      // Update local state
      setConsentSettings(prev => ({
        ...prev,
        [type]: checked
      }));
      
      // Refresh consent history
      const consentHistory = await securityService.getConsentHistory(user.id);
      setConsents(consentHistory);
    } catch (error) {
      console.error(`Error updating ${type} consent:`, error);
    }
  };

  const handleExportData = async () => {
    setIsExporting(true);
    try {
      await requestDataExport();
    } catch (error) {
      console.error('Error exporting data:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await requestAccountDeletion();
      // Redirect will happen automatically after logout in the context
    } catch (error) {
      console.error('Error deleting account:', error);
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 mb-6">
        <Lock className="h-6 w-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-900">Prywatność i RODO</h2>
      </div>

      {/* Consent Management */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Zarządzanie zgodami</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Zgoda marketingowa</p>
              <p className="text-sm text-gray-600">
                Pozwala nam wysyłać Ci newsletter i informacje o promocjach
              </p>
            </div>
            <div className="relative inline-block w-12 h-6">
              <input
                type="checkbox"
                id="toggle-marketing"
                className="sr-only"
                checked={consentSettings.marketing}
                onChange={(e) => handleConsentChange('marketing', e.target.checked)}
              />
              <label
                htmlFor="toggle-marketing"
                className={`block w-12 h-6 rounded-full transition-colors duration-300 ease-in-out cursor-pointer ${
                  consentSettings.marketing ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 ease-in-out ${
                    consentSettings.marketing ? 'transform translate-x-6' : ''
                  }`}
                ></span>
              </label>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Analityka i statystyki</p>
              <p className="text-sm text-gray-600">
                Pozwala nam zbierać anonimowe dane o korzystaniu z serwisu
              </p>
            </div>
            <div className="relative inline-block w-12 h-6">
              <input
                type="checkbox"
                id="toggle-analytics"
                className="sr-only"
                checked={consentSettings.analytics}
                onChange={(e) => handleConsentChange('analytics', e.target.checked)}
              />
              <label
                htmlFor="toggle-analytics"
                className={`block w-12 h-6 rounded-full transition-colors duration-300 ease-in-out cursor-pointer ${
                  consentSettings.analytics ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 ease-in-out ${
                    consentSettings.analytics ? 'transform translate-x-6' : ''
                  }`}
                ></span>
              </label>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Udostępnianie danych partnerom</p>
              <p className="text-sm text-gray-600">
                Pozwala nam udostępniać Twoje dane zaufanym partnerom
              </p>
            </div>
            <div className="relative inline-block w-12 h-6">
              <input
                type="checkbox"
                id="toggle-third-party"
                className="sr-only"
                checked={consentSettings.thirdParty}
                onChange={(e) => handleConsentChange('third_party', e.target.checked)}
              />
              <label
                htmlFor="toggle-third-party"
                className={`block w-12 h-6 rounded-full transition-colors duration-300 ease-in-out cursor-pointer ${
                  consentSettings.thirdParty ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 ease-in-out ${
                    consentSettings.thirdParty ? 'transform translate-x-6' : ''
                  }`}
                ></span>
              </label>
            </div>
          </div>
        </div>
        
        <div className="mt-4 p-4 bg-blue-50 rounded-lg flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p>Możesz w dowolnym momencie zmienić swoje preferencje dotyczące przetwarzania danych.</p>
          </div>
        </div>
      </div>

      {/* Data Export */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Eksport danych (RODO)</h3>
        
        <p className="text-gray-600 mb-4">
          Zgodnie z RODO, masz prawo do eksportu wszystkich swoich danych osobowych, które przechowujemy.
          Plik eksportu będzie zawierał wszystkie informacje związane z Twoim kontem.
        </p>
        
        <button
          onClick={handleExportData}
          disabled={isExporting}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2"
        >
          {isExporting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Eksportowanie...</span>
            </>
          ) : (
            <>
              <Download className="h-4 w-4" />
              <span>Eksportuj moje dane</span>
            </>
          )}
        </button>
      </div>

      {/* Account Deletion */}
      <div className="bg-red-50 rounded-xl shadow-sm border border-red-200 p-6">
        <h3 className="text-lg font-semibold text-red-900 mb-4">Usunięcie konta</h3>
        
        <div className="flex items-start gap-3 mb-4">
          <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-red-800">
            <p className="font-medium mb-1">Uwaga! Ta operacja jest nieodwracalna</p>
            <p>Usunięcie konta spowoduje:</p>
            <ul className="list-disc ml-4 mt-1 space-y-1">
              <li>Trwałe usunięcie wszystkich Twoich danych osobowych</li>
              <li>Utratę dostępu do wszystkich zapisanych produktów i recenzji</li>
              <li>Anulowanie wszystkich subskrypcji i powiadomień</li>
            </ul>
          </div>
        </div>
        
        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            <span>Usuń moje konto</span>
          </button>
        ) : (
          <div className="border border-red-300 rounded-lg p-4 bg-red-100">
            <p className="font-medium text-red-800 mb-3">
              Czy na pewno chcesz usunąć swoje konto? Ta operacja jest nieodwracalna.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Usuwanie...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" />
                    <span>Tak, usuń moje konto</span>
                  </>
                )}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className="bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 text-gray-700 px-6 py-2 rounded-lg transition-colors"
              >
                Anuluj
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Consent History */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Historia zgód</h3>
        
        {consents.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-gray-700">Typ zgody</th>
                  <th className="px-4 py-2 text-left text-gray-700">Status</th>
                  <th className="px-4 py-2 text-left text-gray-700">Data</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {consents.map((consent) => (
                  <tr key={consent.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {consent.consent_type === 'marketing' && 'Zgoda marketingowa'}
                      {consent.consent_type === 'analytics' && 'Analityka i statystyki'}
                      {consent.consent_type === 'third_party' && 'Udostępnianie danych partnerom'}
                    </td>
                    <td className="px-4 py-3">
                      {consent.is_active ? (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                          Aktywna
                        </span>
                      ) : (
                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                          Wycofana
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {consent.is_active 
                        ? `Udzielona: ${new Date(consent.consented_at).toLocaleString('pl-PL')}`
                        : `Wycofana: ${new Date(consent.revoked_at).toLocaleString('pl-PL')}`
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600 text-center py-4">Brak historii zgód</p>
        )}
      </div>
    </div>
  );
};