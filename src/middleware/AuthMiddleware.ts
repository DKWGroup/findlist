import { supabase } from "../services/supabaseStorage";
import {
  clearAuthCookies,
  setAuthStateCookie,
  setSessionIdCookie,
  setUserIdCookie,
} from "../utils/cookieUtils";

// Constants for token management
const TOKEN_REFRESH_THRESHOLD = 5 * 60 * 1000; // 5 minutes in milliseconds
const SESSION_STORAGE_KEY = "viralist-session";
const AUTH_ERROR_EVENTS = ["SIGNED_OUT", "USER_DELETED", "TOKEN_REFRESHED"];

// Mutex to prevent concurrent token refresh calls
let refreshInProgress = false;

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  userId: string;
  role: string;
}

/**
 * Middleware for verifying JWT tokens in requests
 */
export const verifyToken = async (token: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.auth.getUser(token);
    return !error && !!data.user;
  } catch (error) {
    console.error("Token verification error:", error);
    return false;
  }
};

/**
 * Check if the current session is valid and not expired
 */
export const isSessionValid = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error || !data.session) return false;

    // Check if token is about to expire
    const expiresAt = data.session.expires_at
      ? data.session.expires_at * 1000
      : 0;
    const now = Date.now();

    return expiresAt > now;
  } catch (error) {
    console.error("Session validation error:", error);
    return false;
  }
};

/**
 * Refresh the authentication token if needed
 */
export const refreshTokenIfNeeded = async (): Promise<boolean> => {
  // Prevent concurrent refresh attempts
  if (refreshInProgress) {
    console.log("Token refresh already in progress, skipping...");
    return true;
  }

  try {
    refreshInProgress = true;

    console.log("Starting token refresh check...");

    // DEBUG: Check if session exists before any Supabase calls
    const sessionBefore = localStorage.getItem("supabase.auth.token");
    console.log(
      "Session in localStorage before getSession():",
      sessionBefore ? "exists" : "missing"
    );

    const { data: sessionData } = await supabase.auth.getSession();
    console.log(
      "Checking if token needs refresh, session:",
      sessionData.session ? "exists" : "none"
    );

    // Debug: Log session details
    if (sessionData.session) {
      console.log("Session details:", {
        accessToken: sessionData.session.access_token.substring(0, 20) + "...",
        refreshToken:
          sessionData.session.refresh_token?.substring(0, 20) + "...",
        expiresAt: new Date(
          (sessionData.session.expires_at || 0) * 1000
        ).toISOString(),
        userId: sessionData.session.user.id,
      });
    } else {
      console.log("No session found in getSession() call");
    }

    if (!sessionData.session) {
      console.log("No active session to refresh");
      return false;
    }

    const expiresAt = sessionData.session.expires_at
      ? sessionData.session.expires_at * 1000
      : 0;
    const now = Date.now();

    console.log("Token refresh check details:", {
      expiresAt: new Date(expiresAt).toISOString(),
      now: new Date(now).toISOString(),
      timeUntilExpiry: Math.round((expiresAt - now) / 60000) + " minutes",
      threshold: Math.round(TOKEN_REFRESH_THRESHOLD / 60000) + " minutes",
      needsRefresh: expiresAt - now < TOKEN_REFRESH_THRESHOLD,
    });

    // If token is about to expire, refresh it
    if (expiresAt - now < TOKEN_REFRESH_THRESHOLD) {
      console.log("Token is about to expire, refreshing...");
      const { data, error } = await supabase.auth.refreshSession();
      console.log(
        "Token refresh result:",
        error ? `Error: ${error.message}` : "Success"
      );

      if (error || !data.session) {
        // Check if this is an expected "no session" scenario
        if (
          error &&
          (error.message.includes("Auth session missing") ||
            error.message.includes("Refresh Token Not Found") ||
            error.message.includes("Invalid Refresh Token"))
        ) {
          console.log(
            "Token refresh skipped - no valid session available:",
            error.message
          );
        } else {
          console.error("Token refresh failed:", error);
        }
        return false;
      }

      // Update cookies with new token
      if (data.session) {
        setAuthStateCookie(true);
        setSessionIdCookie(data.session.access_token);
        if (data.user) {
          setUserIdCookie(data.user.id);
        }
      }

      console.log("Token refreshed successfully");
      return true;
    }

    console.log("Token is still valid, no refresh needed");

    // DEBUG: Verify session still exists after our check
    const { data: sessionCheck } = await supabase.auth.getSession();
    console.log(
      "Session verification after check:",
      sessionCheck.session ? "still exists" : "DISAPPEARED!"
    );

    return true;
  } catch (error) {
    // Handle expected scenarios where no session exists
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (
      errorMessage.includes("Auth session missing") ||
      errorMessage.includes("Refresh Token Not Found") ||
      errorMessage.includes("Invalid Refresh Token")
    ) {
      console.log(
        "Token refresh skipped - no valid session available:",
        errorMessage
      );
    } else {
      console.error("Token refresh error:", error);
    }
    return false;
  } finally {
    // Always release the mutex
    refreshInProgress = false;
  }
};

/**
 * Check if user has required permissions
 */
export const hasPermission = async (
  userId: string,
  permission: string
): Promise<boolean> => {
  try {
    const { data, error } = await supabase.rpc("user_has_permission", {
      user_uuid: userId,
      permission_name: permission,
    });

    if (error) {
      console.error("Permission check error:", error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error("Permission check error:", error);
    return false;
  }
};

/**
 * Check if user has required role
 */
export const hasRole = async (
  userId: string,
  role: string
): Promise<boolean> => {
  try {
    const { data, error } = await supabase.rpc("user_has_role", {
      user_uuid: userId,
      role_name: role,
    });

    if (error) {
      console.error("Role check error:", error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error("Role check error:", error);
    return false;
  }
};

/**
 * Store session data securely
 */
export const storeSessionData = (session: AuthSession): void => {
  try {
    // Encrypt sensitive data before storing
    const encryptedData = encryptSessionData(session);
    sessionStorage.setItem(SESSION_STORAGE_KEY, encryptedData);

    // Also store in localStorage for persistence, but with less sensitive data
    const persistentData = {
      userId: session.userId,
      expiresAt: session.expiresAt,
    };
    localStorage.setItem(
      `${SESSION_STORAGE_KEY}-persistent`,
      JSON.stringify(persistentData)
    );
  } catch (error) {
    console.error("Error storing session data:", error);
  }
};

/**
 * Retrieve stored session data
 */
export const getStoredSessionData = (): AuthSession | null => {
  try {
    const encryptedData = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!encryptedData) return null;

    return decryptSessionData(encryptedData);
  } catch (error) {
    console.error("Error retrieving session data:", error);
    return null;
  }
};

/**
 * Clear all session data on logout
 */
export const clearSessionData = (): void => {
  try {
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
    localStorage.removeItem(`${SESSION_STORAGE_KEY}-persistent`);

    // Clear only custom auth-related data, not Supabase storage
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("viralist-") && !key.includes("supabase.auth.token")) {
        localStorage.removeItem(key);
      }
    });

    Object.keys(sessionStorage).forEach((key) => {
      if (key.startsWith("viralist-") && !key.includes("supabase.auth.token")) {
        sessionStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.error("Error clearing session data:", error);
  }
};

/**
 * Simple encryption for session data (for demo purposes)
 * In production, use a proper encryption library
 */
const encryptSessionData = (data: AuthSession): string => {
  // This is a simple base64 encoding for demonstration
  // In production, use a proper encryption method
  return btoa(JSON.stringify(data));
};

/**
 * Simple decryption for session data (for demo purposes)
 * In production, use a proper decryption library
 */
const decryptSessionData = (encryptedData: string): AuthSession => {
  // This is a simple base64 decoding for demonstration
  // In production, use a proper decryption method
  return JSON.parse(atob(encryptedData));
};

/**
 * Initialize auth listeners for session management
 */
export const initializeAuthListeners = (): (() => void) => {
  const { data } = supabase.auth.onAuthStateChange((event, session) => {
    console.log("Auth state change in middleware:", event);

    if (event === "SIGNED_IN" && session) {
      // Store session data
      const expiresAt = session.expires_at
        ? session.expires_at * 1000
        : Date.now() + (session.expires_in || 3600) * 1000;

      const authSession: AuthSession = {
        accessToken: session.access_token,
        refreshToken: session.refresh_token,
        expiresAt,
        userId: session.user.id,
        role: session.user.app_metadata.role || "user",
      };

      storeSessionData(authSession);

      // Also update cookies for cross-tab auth state
      setAuthStateCookie(true);
      setSessionIdCookie(session.access_token);
      setUserIdCookie(session.user.id);

      console.log("Session stored after sign in");
    } else if (AUTH_ERROR_EVENTS.includes(event)) {
      // Clear session data on auth errors or sign out
      clearSessionData();
      clearAuthCookies();
      console.log("Session cleared due to auth event:", event);
    }
  });

  // Set up token refresh interval - DISABLED to prevent race conditions
  // Token refresh is now handled by useSessionTimeout hook
  // const refreshInterval = setInterval(async () => {
  //   const isValid = await isSessionValid();
  //   if (isValid) {
  //     await refreshTokenIfNeeded();
  //   }
  // }, 60000); // Check every minute

  // Return cleanup function
  return () => {
    data.subscription.unsubscribe();
    // clearInterval(refreshInterval);
  };
};
