/**
 * Utilities for secure session persistence
 */

// Constants
const SESSION_KEY_PREFIX = 'viralist-session';
const AUTH_STATE_KEY = `${SESSION_KEY_PREFIX}-state`;
const TOKEN_KEY = `${SESSION_KEY_PREFIX}-token`;
const USER_DATA_KEY = `${SESSION_KEY_PREFIX}-user`;
const SESSION_EXPIRY_KEY = `${SESSION_KEY_PREFIX}-expiry`;

// Types
interface StoredSession {
  token: string;
  refreshToken: string;
  expiresAt: number;
  userId: string;
}

interface StoredUserData {
  id: string;
  email: string;
  name: string;
  role: string;
  lastLogin: string;
}

/**
 * Store authentication token securely
 */
export const storeAuthToken = (token: string, refreshToken: string, expiresAt: number, userId: string): void => {
  try {
    const sessionData: StoredSession = {
      token,
      refreshToken,
      expiresAt,
      userId
    };
    
    // Store in sessionStorage for security (cleared when browser is closed)
    sessionStorage.setItem(TOKEN_KEY, encryptData(JSON.stringify(sessionData)));
    
    // Store minimal data in localStorage for persistence
    localStorage.setItem(SESSION_EXPIRY_KEY, expiresAt.toString());
    localStorage.setItem(AUTH_STATE_KEY, 'authenticated');
  } catch (error) {
    console.error('Error storing auth token:', error);
  }
};

/**
 * Retrieve stored authentication token
 */
export const getStoredAuthToken = (): StoredSession | null => {
  try {
    const encryptedData = sessionStorage.getItem(TOKEN_KEY);
    if (!encryptedData) return null;
    
    const decryptedData = decryptData(encryptedData);
    return JSON.parse(decryptedData) as StoredSession;
  } catch (error) {
    console.error('Error retrieving auth token:', error);
    return null;
  }
};

/**
 * Store user data
 */
export const storeUserData = (userData: StoredUserData): void => {
  try {
    localStorage.setItem(USER_DATA_KEY, encryptData(JSON.stringify(userData)));
  } catch (error) {
    console.error('Error storing user data:', error);
  }
};

/**
 * Retrieve stored user data
 */
export const getStoredUserData = (): StoredUserData | null => {
  try {
    const encryptedData = localStorage.getItem(USER_DATA_KEY);
    if (!encryptedData) return null;
    
    const decryptedData = decryptData(encryptedData);
    return JSON.parse(decryptedData) as StoredUserData;
  } catch (error) {
    console.error('Error retrieving user data:', error);
    return null;
  }
};

/**
 * Check if session is expired
 */
export const isSessionExpired = (): boolean => {
  try {
    const expiryTimestamp = localStorage.getItem(SESSION_EXPIRY_KEY);
    if (!expiryTimestamp) {
      // Try to get expiry from Supabase session
      const supabaseSession = JSON.parse(localStorage.getItem('sb-thijvnpkoefkdpsricjb-auth-token') || '{}');
      if (supabaseSession?.expires_at) {
        // Convert to milliseconds if needed
        const expiresAt = supabaseSession.expires_at * 1000;
        return Date.now() >= expiresAt;
      }
      return true;
    }
    
    const expiresAt = parseInt(expiryTimestamp, 10);
    return Date.now() >= expiresAt;
  } catch (error) {
    console.error('Error checking session expiration:', error);
    return true;
  }
};

/**
 * Clear all session data
 */
export const clearAllSessionData = (): void => {
  try {
    // Clear sessionStorage
    sessionStorage.removeItem(TOKEN_KEY);
    
    // Clear localStorage
    localStorage.removeItem(AUTH_STATE_KEY);
    localStorage.removeItem(SESSION_EXPIRY_KEY);
    localStorage.removeItem(USER_DATA_KEY);
    
    // Clear any other auth-related data
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(SESSION_KEY_PREFIX) || key.includes('supabase')) {
        localStorage.removeItem(key);
      }
    });
    
    Object.keys(sessionStorage).forEach(key => {
      if (key.startsWith(SESSION_KEY_PREFIX) || key.includes('supabase')) {
        sessionStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.error('Error clearing session data:', error);
  }
};

/**
 * Simple encryption for sensitive data
 * NOTE: This is not secure for production! Use a proper encryption library.
 */
const encryptData = (data: string): string => {
  // In a real app, use a proper encryption library
  // This is just a simple obfuscation
  return btoa(data);
};

/**
 * Simple decryption for sensitive data
 * NOTE: This is not secure for production! Use a proper decryption library.
 */
const decryptData = (encryptedData: string): string => {
  // In a real app, use a proper decryption library
  // This is just a simple de-obfuscation
  return atob(encryptedData);
};