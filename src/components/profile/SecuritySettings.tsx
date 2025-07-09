import React, { useState, useEffect } from 'react';
import { Shield, Eye, EyeOff, Lock, Smartphone, LogOut, AlertCircle, Check, Loader2, Info } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { securityService } from '../../services/securityService';

export const SecuritySettings: React.FC = () => {
  const { user, updatePassword, validatePassword } = useAuth();
  const [sessions, setSessions] = useState<any[]>([]);
  const [securityLogs, setSecurityLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState(false);
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    uppercase: false,
    number: false,
    special: false
  });

  useEffect(() => {
    const loadSecurityData = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        // Load active sessions
        const userSessions = await securityService.getUserSessions(user.id);
        setSessions(userSessions);
        
        // Load security logs
        const logs = await securityService.getSecurityLogs(user.id);
        setSecurityLogs(logs);
        
        // Get two-factor status
        setIsTwoFactorEnabled(user.settings?.twoFactorEnabled || false);
      } catch (error) {
        console.error('Error loading security data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSecurityData();
  }, [user]);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Check password strength when new password field changes
    if (name === 'newPassword') {
      setPasswordStrength({
        length: value.length >= 8,
        uppercase: /[A-Z]/.test(value),
        number: /[0-9]/.test(value),
        special: /[^A-Za-z0-9]/.test(value)
      });
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous messages
    setFormError('');
    setFormSuccess('');
    
    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setFormError('Nowe hasła nie są identyczne');
      return;
    }
    
    if (!validatePassword(passwordData.newPassword)) {
      setFormError('Nowe hasło nie spełnia wymagań bezpieczeństwa');
      return;
    }
    
    setIsChangingPassword(true);
    
    try {
      await updatePassword(passwordData.newPassword);
      setFormSuccess('Hasło zostało pomyślnie zmienione');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      if (error instanceof Error) {
        setFormError(error.message);
      } else {
        setFormError('Wystąpił nieznany błąd');
      }
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleTerminateSession = async (sessionId: string) => {
    if (!user) return;
    
    try {
      const success = await securityService.terminateSession(sessionId, user.id);
      if (success) {
        // Refresh sessions list
        const userSessions = await securityService.getUserSessions(user.id);
        setSessions(userSessions);
      }
    } catch (error) {
      console.error('Error terminating session:', error);
    }
  };

  const handleToggleTwoFactor = async () => {
    if (!user) return;
    
    try {
      if (isTwoFactorEnabled) {
        await securityService.disableTwoFactor(user.id);
        setIsTwoFactorEnabled(false);
      } else {
        await securityService.enableTwoFactor(user.id);
        setIsTwoFactorEnabled(true);
      }
    } catch (error) {
      console.error('Error toggling two-factor auth:', error);
    }
  };
  
  // Calculate overall password strength
  const passwordStrengthScore = Object.values(passwordStrength).filter(Boolean).length;
  const getPasswordStrengthColor = () => {
    if (passwordStrengthScore <= 1) return 'bg-red-500';
    if (passwordStrengthScore === 2) return 'bg-orange-500';
    if (passwordStrengthScore === 3) return 'bg-yellow-500';
    return 'bg-green-500';
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
        <Shield className="h-6 w-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-900">Bezpieczeństwo konta</h2>
      </div>

      {/* Password Change Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Zmiana hasła</h3>
        
        {formError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-start gap-2">
            <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <div>{formError}</div>
          </div>
        )}
        
        {formSuccess && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-start gap-2">
            <Check className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <div>{formSuccess}</div>
          </div>
        )}
        
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Aktualne hasło
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                id="currentPassword"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                required
                disabled={isChangingPassword}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Wprowadź aktualne hasło"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                disabled={isChangingPassword}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>
          
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Nowe hasło
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type={showNewPassword ? 'text' : 'password'}
                id="newPassword"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                required
                disabled={isChangingPassword}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Minimum 8 znaków"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                disabled={isChangingPassword}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
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
                <div className={`w-4 h-4 rounded-full flex items-center justify-center ${passwordStrength.length ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                  {passwordStrength.length ? <Check className="w-3 h-3" /> : null}
                </div>
                <span>Minimum 8 znaków</span>
              </div>
              <div className="flex items-center gap-1">
                <div className={`w-4 h-4 rounded-full flex items-center justify-center ${passwordStrength.uppercase ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                  {passwordStrength.uppercase ? <Check className="w-3 h-3" /> : null}
                </div>
                <span>Przynajmniej jedna duża litera</span>
              </div>
              <div className="flex items-center gap-1">
                <div className={`w-4 h-4 rounded-full flex items-center justify-center ${passwordStrength.number ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                  {passwordStrength.number ? <Check className="w-3 h-3" /> : null}
                </div>
                <span>Przynajmniej jedna cyfra</span>
              </div>
              <div className="flex items-center gap-1">
                <div className={`w-4 h-4 rounded-full flex items-center justify-center ${passwordStrength.special ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                  {passwordStrength.special ? <Check className="w-3 h-3" /> : null}
                </div>
                <span>Przynajmniej jeden znak specjalny</span>
              </div>
            </div>
          </div>
          
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Potwierdź nowe hasło
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                required
                disabled={isChangingPassword}
                className={`w-full pl-10 pr-12 py-3 border ${passwordData.newPassword !== passwordData.confirmPassword && passwordData.confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                placeholder="Powtórz nowe hasło"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isChangingPassword}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {passwordData.newPassword !== passwordData.confirmPassword && passwordData.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">Hasła nie są identyczne</p>
            )}
          </div>
          
          <button
            type="submit"
            disabled={isChangingPassword}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            {isChangingPassword ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Zapisywanie...</span>
              </>
            ) : (
              <span>Zmień hasło</span>
            )}
          </button>
        </form>
      </div>

      {/* Two-Factor Authentication */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Weryfikacja dwuetapowa</h3>
            <p className="text-sm text-gray-600">Dodatkowa warstwa zabezpieczeń dla Twojego konta</p>
          </div>
          <div className="relative inline-block w-12 h-6">
            <input
              type="checkbox"
              id="toggle-2fa"
              className="sr-only"
              checked={isTwoFactorEnabled}
              onChange={handleToggleTwoFactor}
            />
            <label
              htmlFor="toggle-2fa"
              className={`block w-12 h-6 rounded-full transition-colors duration-300 ease-in-out cursor-pointer ${
                isTwoFactorEnabled ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 ease-in-out ${
                  isTwoFactorEnabled ? 'transform translate-x-6' : ''
                }`}
              ></span>
            </label>
          </div>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Dlaczego warto włączyć?</p>
            <ul className="list-disc ml-4 space-y-1">
              <li>Dodatkowa ochrona przed nieautoryzowanym dostępem</li>
              <li>Ochrona nawet jeśli hasło zostanie skompromitowane</li>
              <li>Powiadomienia o próbach logowania</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Active Sessions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Aktywne sesje</h3>
        
        {sessions.length > 0 ? (
          <div className="space-y-4">
            {sessions.map((session) => (
              <div key={session.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Smartphone className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {session.device_info?.user_agent?.split(' ')[0] || 'Nieznane urządzenie'}
                    </p>
                    <p className="text-xs text-gray-500">
                      IP: {session.ip_address || 'Nieznany'} • 
                      Ostatnia aktywność: {new Date(session.last_active_at).toLocaleString('pl-PL')}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleTerminateSession(session.id)}
                  className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center gap-1"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Wyloguj</span>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-center py-4">Brak aktywnych sesji</p>
        )}
      </div>

      {/* Security Logs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Historia aktywności</h3>
        
        {securityLogs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-gray-700">Akcja</th>
                  <th className="px-4 py-2 text-left text-gray-700">Data</th>
                  <th className="px-4 py-2 text-left text-gray-700">IP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {securityLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <span className="font-medium text-gray-900">
                        {log.action === 'successful_login' && 'Udane logowanie'}
                        {log.action === 'failed_login_attempt' && 'Nieudane logowanie'}
                        {log.action === 'password_changed' && 'Zmiana hasła'}
                        {log.action === 'account_locked' && 'Konto zablokowane'}
                        {log.action === 'account_unlocked' && 'Konto odblokowane'}
                        {log.action === 'two_factor_enabled' && 'Włączenie 2FA'}
                        {log.action === 'two_factor_disabled' && 'Wyłączenie 2FA'}
                        {log.action === 'session_terminated' && 'Zakończenie sesji'}
                        {log.action === 'data_export' && 'Eksport danych'}
                        {log.action === 'data_deletion_requested' && 'Żądanie usunięcia danych'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {new Date(log.created_at).toLocaleString('pl-PL')}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {log.ip_address || 'Nieznane'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600 text-center py-4">Brak historii aktywności</p>
        )}
      </div>
    </div>
  );
};