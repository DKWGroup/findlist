import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { supabase, checkAndRefreshToken, debugSession } from './services/supabaseStorage';
import App from './App.tsx';
import './index.css';
import { clearSessionData } from './middleware/AuthMiddleware';

// Dodaj globalny listener dla stanu sesji
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Global auth state change:', event, session ? 'Session active' : 'No session');

  // Debug session state after auth change
  debugSession();
  
  // Zapisz informację o ostatnim zdarzeniu auth
  if (event) {
    localStorage.setItem('viralist-last-auth-event', JSON.stringify({
      event,
      timestamp: Date.now()
    }));
  }
});

// Dodaj obsługę błędów niezłapanych
window.addEventListener('error', (event) => {
  console.error('Uncaught error:', event.error);
  
  // Sprawdź czy błąd jest związany z autoryzacją
  const errorMessage = event.error?.message || '';
  if (
    errorMessage.includes('auth') || 
    errorMessage.includes('token') || 
    errorMessage.includes('session') ||
    errorMessage.includes('unauthorized')
  ) {
    console.warn('Auth-related error detected, cleaning up session data');
    clearSessionData();
  }
});

// Ustaw interwał do odświeżania tokenu
setInterval(async () => {
  console.log('Running scheduled token refresh check');
  await checkAndRefreshToken();
}, 4 * 60 * 1000); // Co 4 minuty

createRoot(document.getElementById('root')!).render(
  // Wyłączamy StrictMode, aby uniknąć podwójnego renderowania i potencjalnych problemów z sesją
  // <StrictMode>
    <App />
  // </StrictMode>
);
