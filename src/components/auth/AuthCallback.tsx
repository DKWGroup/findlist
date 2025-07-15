import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../services/supabaseStorage';
import { Loader2 } from 'lucide-react';

export const AuthCallback: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the URL hash
        const hash = window.location.hash;
        
        // Check if we have a session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          throw sessionError;
        }
        
        if (session) {
          // Session exists, redirect to profile
          navigate('/profil');
          return;
        }
        
        // If no session but we have a hash, try to exchange the token
        if (hash && hash.includes('access_token')) {
          // The session should be automatically set by Supabase Auth
          // Just wait a moment and check again
          setTimeout(async () => {
            const { data: { session: newSession }, error: newSessionError } = await supabase.auth.getSession();
            
            if (newSessionError) {
              throw newSessionError;
            }
            
            if (newSession) {
              // Success! Redirect to profile
              navigate('/profil');
            } else {
              throw new Error('Nie udało się ustawić sesji po autoryzacji');
            }
          }, 1000);
        } else {
          // No hash and no session, something went wrong
          throw new Error('Brak danych autoryzacyjnych');
        }
      } catch (err) {
        console.error('Error in auth callback:', err);
        setError(err instanceof Error ? err.message : 'Wystąpił nieznany błąd podczas logowania');
        
        // Redirect to login page after a delay
        setTimeout(() => {
          navigate('/logowanie');
        }, 3000);
      }
    };
    
    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img 
            src="/viralist-logo2.png" 
            alt="VIRALIST" 
            className="h-12 w-auto mx-auto"
          />
        </div>
        
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {error ? (
            <div className="text-center">
              <div className="text-red-600 text-xl mb-4">⚠️</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Błąd logowania</h2>
              <p className="text-gray-600 mb-6">{error}</p>
              <p className="text-gray-600">Przekierowywanie do strony logowania...</p>
            </div>
          ) : (
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Logowanie w toku</h2>
              <p className="text-gray-600">Trwa przetwarzanie danych logowania...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};