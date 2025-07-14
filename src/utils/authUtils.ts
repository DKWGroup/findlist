import { clearSessionData } from "../middleware/AuthMiddleware";
import { supabase } from "../services/supabaseStorage";
import { User } from "../types/auth";
import { clearAuthCookies } from "./cookieUtils";

/**
 * Validate email format
 */
export const validateEmail = (email: string): boolean => {
  if (!email || email.trim() === "") return false;

  const trimmedEmail = email.trim();

  // Basic email pattern - more permissive for + and special chars
  const re = /^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!re.test(trimmedEmail)) return false;

  // Check for invalid patterns
  if (trimmedEmail.includes("..")) return false; // No consecutive dots
  if (trimmedEmail.includes("@.") || trimmedEmail.includes(".@")) return false; // No dots adjacent to @
  if (trimmedEmail.startsWith("@") || trimmedEmail.endsWith("@")) return false; // No @ at start/end
  if (trimmedEmail.split("@").length !== 2) return false; // Exactly one @

  const [localPart, domainPart] = trimmedEmail.split("@");
  if (!localPart || !domainPart) return false; // Both parts must exist
  if (domainPart.endsWith(".")) return false; // Domain can't end with dot

  return true;
};

/**
 * Validate password strength
 */
export const validatePassword = (password: string): boolean => {
  // At least 8 characters
  if (password.length < 8) return false;

  // At least one uppercase letter
  if (!/[A-Z]/.test(password)) return false;

  // At least one number
  if (!/[0-9]/.test(password)) return false;

  // At least one special character
  if (!/[^A-Za-z0-9]/.test(password)) return false;

  return true;
};

/**
 * Get user permissions from roles
 */
export const getUserPermissions = async (userId: string): Promise<string[]> => {
  try {
    const { data, error } = await supabase.rpc("get_user_permissions", {
      user_uuid: userId,
    });

    if (error) {
      console.error("Error fetching user permissions:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error in getUserPermissions:", error);
    return [];
  }
};

/**
 * Check if current session is expired
 */
export const isSessionExpired = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase.auth.getSession();

    if (error || !data.session) {
      return true;
    }

    const expiresAt = new Date(data.session.expires_at || "").getTime();
    return Date.now() >= expiresAt;
  } catch (error) {
    console.error("Error checking session expiration:", error);
    return true;
  }
};

/**
 * Force logout and clear all session data
 */
export const forceLogout = async (): Promise<void> => {
  try {
    await supabase.auth.signOut();
    // Clear all session data
    clearSessionData();
    clearAuthCookies();

    // Redirect to login page
    window.location.href = "/logowanie";
  } catch (error) {
    console.error("Force logout error:", error);
    // Force clear even if API call fails
    clearSessionData();
    clearAuthCookies();
    window.location.href = "/logowanie";
  }
};

/**
 * Create HTTP interceptor for authentication
 */
export const createAuthInterceptor = (
  fetch: WindowOrWorkerGlobalScope["fetch"]
): WindowOrWorkerGlobalScope["fetch"] => {
  return async (input: RequestInfo, init?: RequestInit) => {
    try {
      // Check if session is valid before making request
      const { data } = await supabase.auth.getSession();

      if (!data.session) {
        throw new Error("No active session");
      }

      // Add authorization header if not present
      const headers = init?.headers || {};
      const newHeaders = { ...headers };

      if (!newHeaders["Authorization"] && !newHeaders["authorization"]) {
        newHeaders["Authorization"] = `Bearer ${data.session.access_token}`;
      }

      // Make the request with auth header
      const response = await fetch(input, {
        ...init,
        headers: newHeaders,
      });

      // Handle 401/403 responses
      if (response.status === 401 || response.status === 403) {
        // Try to refresh token
        const { error } = await supabase.auth.refreshSession();

        if (error) {
          // If refresh fails, force logout
          await forceLogout();
          throw new Error("Session expired and refresh failed");
        }

        // Retry the request with new token
        const { data: newSession } = await supabase.auth.getSession();

        if (!newSession.session) {
          await forceLogout();
          throw new Error("Failed to get new session");
        }

        newHeaders[
          "Authorization"
        ] = `Bearer ${newSession.session.access_token}`;

        return fetch(input, {
          ...init,
          headers: newHeaders,
        });
      }

      return response;
    } catch (error) {
      console.error("Auth interceptor error:", error);

      // If any auth error occurs, redirect to login
      if (
        error instanceof Error &&
        (error.message.includes("session") || error.message.includes("token"))
      ) {
        await forceLogout();
      }

      throw error;
    }
  };
};

/**
 * Setup global fetch interceptor
 */
export const setupAuthInterceptor = (): void => {
  const originalFetch = window.fetch;
  window.fetch = createAuthInterceptor(originalFetch);
};

/**
 * Get current user with fresh data
 */
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const { data, error } = await supabase.auth.getUser();

    if (error || !data.user) {
      return null;
    }

    // Get additional user data from profiles
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", data.user.id)
      .maybeSingle();

    // Get user roles
    const { data: roles } = await supabase
      .from("user_role_assignments")
      .select(
        `
        role:user_roles(name, display_name)
      `
      )
      .eq("user_id", data.user.id)
      .eq("is_active", true);

    const userRoles = roles?.map((r) => r.role.name) || [];
    const primaryRole = userRoles.includes("admin")
      ? "admin"
      : userRoles.includes("moderator")
      ? "moderator"
      : userRoles.includes("editor")
      ? "editor"
      : "user";

    return {
      id: data.user.id,
      email: data.user.email || "",
      name: profile?.full_name || data.user.user_metadata?.name || "Użytkownik",
      avatar: profile?.avatar_url,
      role: primaryRole as "user" | "admin" | "moderator" | "editor",
      wishlist: profile?.wishlist || [],
      reviews: profile?.reviews || [],
      createdAt: data.user.created_at,
      lastLogin: profile?.last_login || new Date().toISOString(),
      isActive: true,
      settings: {
        emailNotifications: true,
        marketingConsent: false,
        theme: "light",
        language: "pl",
        twoFactorEnabled: false,
      },
    };
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
};
