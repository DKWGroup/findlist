import Cookies from "js-cookie";

// Constants
const COOKIE_PREFIX = "findlist_";
const AUTH_STATE_COOKIE = `${COOKIE_PREFIX}auth_state`;
const SESSION_ID_COOKIE = `${COOKIE_PREFIX}session_id`;
const REFRESH_TOKEN_COOKIE = `${COOKIE_PREFIX}refresh_token`;
const USER_ID_COOKIE = `${COOKIE_PREFIX}user_id`;

// Default cookie options
const DEFAULT_OPTIONS = {
  secure: true,
  sameSite: "strict" as const,
  expires: 1, // 1 day
  path: "/",
};

// Secure cookie options (for sensitive data)
const SECURE_OPTIONS = {
  ...DEFAULT_OPTIONS,
  expires: 1 / 24, // 1 hour
};

/**
 * Set authentication state cookie
 */
export const setAuthStateCookie = (isAuthenticated: boolean): void => {
  Cookies.set(AUTH_STATE_COOKIE, isAuthenticated ? "1" : "0", DEFAULT_OPTIONS);
};

/**
 * Get authentication state from cookie
 */
export const getAuthStateCookie = (): boolean => {
  return Cookies.get(AUTH_STATE_COOKIE) === "1";
};

/**
 * Set session ID cookie
 */
export const setSessionIdCookie = (sessionId: string): void => {
  // Store only a hash of the session ID for security
  const hashedSession = btoa(sessionId).substring(0, 20);
  Cookies.set(SESSION_ID_COOKIE, hashedSession, SECURE_OPTIONS);
};

/**
 * Get session ID from cookie
 */
export const getSessionIdCookie = (): string | undefined => {
  return Cookies.get(SESSION_ID_COOKIE);
};

/**
 * Set refresh token cookie (should be done server-side in production)
 */
export const setRefreshTokenCookie = (refreshToken: string): void => {
  // Store only a hash of the refresh token for security
  const hashedToken = btoa(refreshToken).substring(0, 20);
  Cookies.set(REFRESH_TOKEN_COOKIE, hashedToken, SECURE_OPTIONS);
};

/**
 * Get refresh token from cookie
 */
export const getRefreshTokenCookie = (): string | undefined => {
  return Cookies.get(REFRESH_TOKEN_COOKIE);
};

/**
 * Set user ID cookie
 */
export const setUserIdCookie = (userId: string): void => {
  Cookies.set(USER_ID_COOKIE, userId, DEFAULT_OPTIONS);
};

/**
 * Get user ID from cookie
 */
export const getUserIdCookie = (): string | undefined => {
  return Cookies.get(USER_ID_COOKIE);
};

/**
 * Clear all auth cookies
 */
export const clearAuthCookies = (): void => {
  Cookies.remove(AUTH_STATE_COOKIE, { path: "/" });
  Cookies.remove(SESSION_ID_COOKIE, { path: "/" });
  Cookies.remove(REFRESH_TOKEN_COOKIE, { path: "/" });
  Cookies.remove(USER_ID_COOKIE, { path: "/" });

  // Clear any other auth-related cookies
  Object.keys(Cookies.get()).forEach((key) => {
    if (key.startsWith(COOKIE_PREFIX)) {
      Cookies.remove(key, { path: "/" });
    }
  });
};

/**
 * Synchronize cookies with session storage
 * This helps maintain session across tabs
 */
export const syncCookiesWithStorage = (): void => {
  // Check if we have auth state in cookies but not in storage
  const cookieAuth = getAuthStateCookie();
  const storageAuth =
    localStorage.getItem(`${COOKIE_PREFIX}auth_state`) === "1";

  if (cookieAuth && !storageAuth) {
    // We have auth in cookies but not in storage, try to restore session
    const sessionId = getSessionIdCookie();
    const userId = getUserIdCookie();

    if (sessionId && userId) {
      localStorage.setItem(`${COOKIE_PREFIX}auth_state`, "1");
      localStorage.setItem(`${COOKIE_PREFIX}user_id`, userId);
      localStorage.setItem(`${COOKIE_PREFIX}session_id`, sessionId);
    }
  } else if (!cookieAuth && storageAuth) {
    // We have auth in storage but not in cookies, clear storage
    localStorage.removeItem(`${COOKIE_PREFIX}auth_state`);
    localStorage.removeItem(`${COOKIE_PREFIX}user_id`);
    localStorage.removeItem(`${COOKIE_PREFIX}session_id`);
  }
};
