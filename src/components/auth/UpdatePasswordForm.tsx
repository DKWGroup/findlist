import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Loader2, AlertCircle, Check, Info } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { refreshTokenIfNeeded } from '../../middleware/AuthMiddleware';

export const UpdatePasswordForm: React.FC = () => {
  const { updatePassword, error, validatePassword } = useAuth();
  const navigate = useNavigate();
  const [localLoading, setLocalLoading] = useState(false);
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formError, setFormError] = useState('');
  const [success, setSuccess] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    uppercase: false,
    number: false,
    special: false
  });

  // Check if we have a valid hash in the URL (for password reset flow)
  useEffect(() => {
    const hash = window.location.hash;
    
    // Ensure token is fresh
    refreshTokenIfNeeded();
    
    if (!hash || !hash.includes('type=recovery')) {
      setFormError('Nieprawidłowy link resetowania hasła');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.password.trim() || !formData.confirmPassword.trim()) {
      setFormError('Wszystkie pola są wymagane');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setFormError('Hasła nie są identyczne');
      return;
    }
    
    // Validate password strength
    if (!validatePassword(formData.password)) {
      setFormError('Hasło nie spełnia wymagań bezpieczeństwa');
      return;
    }
    
    // Clear previous errors
    setFormError('');
    setLocalLoading(true);
    
    try {
      await updatePassword(formData.password);
      setSuccess(true);
      
      // Redirect after 3 seconds
      setTimeout(() => {
        navigate('/logowanie');
      }, 3000);
    } catch (error) {
      if (error instanceof Error) {
        setFormError(error.message);
      } else {
        setFormError('Wystąpił nieznany błąd');
      }
    } finally {
      setLocalLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Check password strength when password field changes
    if (name === 'password') {
      setPasswordStrength({
        length: value.length >= 8,
        uppercase: /[A-Z]/.test(value),
        number: /[0-9]/.test(value),
        special: /[^A-Za-z0-9]/.test(value)
      });
    }
  };

  const isFormLoading = localLoading;
  
  // Calculate overall password strength
  const passwordStrengthScore = Object.values(passwordStrength).filter(Boolean).length;
  const getPasswordStrengthColor = () => {
    if (passwordStrengthScore <= 1) return 'bg-red-500';
    if (passwordStrengthScore === 2) return 'bg-orange-500';
    if (passwordStrengthScore === 3) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  if (success) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Hasło zmienione!</h2>
            <p className="text-gray-600">
              Twoje hasło zostało pomyślnie zmienione
            </p>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-6">
              Za chwilę zostaniesz przekierowany do strony logowania...
            </p>
            
            <button
              onClick={() => navigate('/logowanie')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Przejdź do logowania
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Ustaw nowe hasło</h2>
          <p className="text-gray-600">
            Utwórz silne hasło, którego nie używasz w innych serwisach
          </p>
        </div>

        {(error || formError) && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-start gap-2">
            <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <div>{error || formError}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Nowe hasło
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
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
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
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
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                disabled={isFormLoading}
                className={`w-full pl-10 pr-12 py-3 border ${formData.password !== formData.confirmPassword && formData.confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                placeholder="Powtórz hasło"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isFormLoading}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {formData.password !== formData.confirmPassword && formData.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">Hasła nie są identyczne</p>
            )}
          </div>

          <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg text-xs text-blue-700">
            <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <p>Silne hasło jest kluczem do bezpieczeństwa Twojego konta. Nie używaj tego samego hasła w innych serwisach.</p>
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
      </div>
    </div>
  );
};