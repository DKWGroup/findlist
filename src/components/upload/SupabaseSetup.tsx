import React, { useState } from 'react';
import { Database, Settings, CheckCircle, AlertCircle, ExternalLink, Info } from 'lucide-react';
import { initializeStorageBucket } from '../../services/supabaseStorage';

export const SupabaseSetup: React.FC = () => {
  const [isChecking, setIsChecking] = useState(false);
  const [checkStatus, setCheckStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleCheckBucket = async () => {
    setIsChecking(true);
    setCheckStatus('idle');
    setErrorMessage('');

    try {
      await initializeStorageBucket('images');
      setCheckStatus('success');
    } catch (error) {
      setCheckStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Błąd sprawdzania bucket\'a');
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center gap-3 mb-6">
        <Database className="h-6 w-6 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900">Konfiguracja Supabase Storage</h2>
      </div>

      <div className="space-y-6">
        {/* Manual Setup Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-900 mb-2">Instrukcje konfiguracji Storage</h3>
              <p className="text-blue-800 text-sm mb-3">
                Storage bucket musi być utworzony ręcznie w Supabase Dashboard z odpowiednimi uprawnieniami.
              </p>
              
              <div className="space-y-3 text-sm">
                <div>
                  <div className="font-semibold text-blue-900 mb-1">Krok 1: Utwórz bucket</div>
                  <ul className="text-blue-800 space-y-1 ml-4">
                    <li>• Przejdź do Supabase Dashboard → Storage</li>
                    <li>• Kliknij "New bucket"</li>
                    <li>• Nazwa: <code className="bg-blue-100 px-1 rounded">images</code></li>
                    <li>• Zaznacz "Public bucket"</li>
                    <li>• File size limit: <code className="bg-blue-100 px-1 rounded">2097152</code> (2MB)</li>
                    <li>• Allowed MIME types: <code className="bg-blue-100 px-1 rounded">image/jpeg,image/png,image/webp</code></li>
                  </ul>
                </div>
                
                <div>
                  <div className="font-semibold text-blue-900 mb-1">Krok 2: Skonfiguruj RLS Policies</div>
                  <ul className="text-blue-800 space-y-1 ml-4">
                    <li>• Przejdź do Storage → images bucket → Policies</li>
                    <li>• Dodaj policy "Public read access" (SELECT, public, expression: true)</li>
                    <li>• Dodaj policy "Authenticated upload" (INSERT, authenticated, expression: true)</li>
                  </ul>
                </div>
              </div>
              
              <a
                href="https://supabase.com/dashboard"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-3 text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                <span>Otwórz Supabase Dashboard</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
        {/* Environment Variables */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Settings className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-yellow-900 mb-2">Wymagane zmienne środowiskowe</h3>
              <p className="text-yellow-800 text-sm mb-3">
                Dodaj następujące zmienne do pliku <code className="bg-yellow-100 px-1 rounded">.env</code>:
              </p>
              <div className="bg-yellow-100 rounded p-3 font-mono text-sm">
                <div>VITE_SUPABASE_URL=https://your-project.supabase.co</div>
                <div>VITE_SUPABASE_ANON_KEY=your-anon-key</div>
              </div>
            </div>
          </div>
        </div>

        {/* Authentication Setup */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-green-900 mb-2">Konfiguracja Authentication</h3>
              <p className="text-green-800 text-sm mb-3">
                Skonfiguruj Authentication w Supabase Dashboard:
              </p>
              
              <div className="space-y-3 text-sm">
                <div>
                  <div className="font-semibold text-green-900 mb-1">Krok 1: Włącz Email Authentication</div>
                  <ul className="text-green-800 space-y-1 ml-4">
                    <li>• Przejdź do Authentication → Settings</li>
                    <li>• Włącz "Enable email confirmations" (opcjonalnie)</li>
                    <li>• Ustaw "Site URL" na domenę aplikacji</li>
                  </ul>
                </div>
                
                <div>
                  <div className="font-semibold text-green-900 mb-1">Krok 2: Utwórz tabelę profiles</div>
                  <div className="bg-green-100 rounded p-3 font-mono text-xs mt-2">
                    <div>CREATE TABLE profiles (</div>
                    <div>  id UUID REFERENCES auth.users PRIMARY KEY,</div>
                    <div>  email TEXT,</div>
                    <div>  name TEXT,</div>
                    <div>  avatar TEXT,</div>
                    <div>  role TEXT DEFAULT 'user',</div>
                    <div>  wishlist JSONB DEFAULT '[]',</div>
                    <div>  reviews JSONB DEFAULT '[]',</div>
                    <div>  created_at TIMESTAMPTZ DEFAULT NOW(),</div>
                    <div>  updated_at TIMESTAMPTZ DEFAULT NOW(),</div>
                    <div>  last_login TIMESTAMPTZ</div>
                    <div>);</div>
                    <div className="mt-2">ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;</div>
                    <div className="mt-1">CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);</div>
                    <div>CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);</div>
                  </div>
                </div>
              </div>
              
              <a
                href="https://supabase.com/dashboard"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-3 text-green-600 hover:text-green-700 text-sm font-medium"
              >
                <span>Otwórz Supabase Dashboard</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
        {/* Storage Bucket Check */}
        <div>
          <h3 className="font-medium text-gray-900 mb-3">Sprawdź konfigurację Storage</h3>
          <p className="text-gray-600 text-sm mb-4">
            Po skonfigurowaniu bucket'a w Dashboard, sprawdź czy jest dostępny dla aplikacji.
          </p>
          
          <button
            onClick={handleCheckBucket}
            disabled={isChecking}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            {isChecking ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Sprawdzanie...</span>
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4" />
                <span>Sprawdź Storage</span>
              </>
            )}
          </button>

          {/* Status Messages */}
          {checkStatus === 'success' && (
            <div className="mt-4 flex items-center gap-2 text-green-600">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm">Storage bucket jest dostępny i gotowy do użycia</span>
            </div>
          )}

          {checkStatus === 'error' && (
            <div className="mt-4 flex items-start gap-2 text-red-600">
              <AlertCircle className="h-4 w-4 mt-0.5" />
              <div className="text-sm">
                <div className="font-medium">Błąd sprawdzania:</div>
                <div>{errorMessage}</div>
              </div>
            </div>
          )}
        </div>

        {/* File Size and Type Restrictions */}
        <div>
          <h3 className="font-medium text-gray-900 mb-2">Ograniczenia plików</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Maksymalny rozmiar pliku: 2MB</li>
            <li>• Obsługiwane formaty: JPEG, PNG, WebP</li>
            <li>• Automatyczna optymalizacja do rozdzielczości HD (1920x1080)</li>
            <li>• Konwersja do formatu WebP dla lepszej kompresji</li>
            <li>• Jakość kompresji: 85%</li>
          </ul>
        </div>
      </div>
    </div>
  );
};