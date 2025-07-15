import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../services/supabaseStorage';
import { useNavigate } from 'react-router-dom';

interface UseGoogleAuthOptions {
  redirectTo?: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const useGoogleAuth = (options: UseGoogleAuthOptions = {}) => {
  const { 
    redirectTo = '/profil',
    onSuccess,
    onError
  } = options;
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Check for authentication callback in URL
  useEffect(() => {
    const handleAuthCallback = async () => {
      const hash = window.location.hash;
      if (hash && hash.includes('access_token')) {
        setIsLoading(true);
        try {
          // The session will be automatically set by Supabase Auth
          // We just need to check if it was successful
          const { data: { session }, error: sessionError } = await supabase.auth.getSession();
          
          if (sessionError) {
            throw sessionError;
          }
          
          if (!session) {
            throw new Error('Nie udało się ustawić sesji');
          }
          
          // Success! Call the callback and redirect
          onSuccess?.();
          navigate(redirectTo);
        } catch (err) {
          console.error('Error handling auth callback:', err);
          const errorMessage = err instanceof Error ? err.message : 'Wystąpił nieznany błąd podczas logowania';
          setError(errorMessage);
          onError?.(err instanceof Error ? err : new Error(errorMessage));
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    handleAuthCallback();
  }, [navigate, onSuccess, onError, redirectTo]);

  const signInWithGoogle = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Generate CSRF token for security
      const csrfToken = crypto.randomUUID();
      localStorage.setItem('supabase_auth_csrf_token', csrfToken);
      
      // Initiate Google sign-in
      const { data, error: signInError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
          scopes: 'email profile',
        }
      });
      
      if (signInError) {
        throw signInError;
      }
      
      // Redirect to the Google authorization URL
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error('Nie udało się uzyskać URL autoryzacji');
      }
    } catch (err) {
      console.error('Google sign-in error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Wystąpił nieznany błąd podczas logowania';
      setError(errorMessage);
      onError?.(err instanceof Error ? err : new Error(errorMessage));
      setIsLoading(false);
    }
  }, [onError]);

  const signOut = useCallback(async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/logowanie');
    } catch (err) {
      console.error('Sign out error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Wystąpił błąd podczas wylogowywania';
      setError(errorMessage);
      onError?.(err instanceof Error ? err : new Error(errorMessage));
    } finally {
      setIsLoading(false);
    }
  }, [navigate, onError]);

  return {
    signInWithGoogle,
    signOut,
    isLoading,
    error
  };
};