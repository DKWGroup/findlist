import { useCallback, useEffect, useState } from "react";
import {
  clearSessionData,
  isSessionValid,
  refreshTokenIfNeeded,
} from "../middleware/AuthMiddleware";
import { supabase } from "../services/supabaseStorage";
import { LoginCredentials, RegisterCredentials, User } from "../types/auth";
import { validateEmail, validatePassword } from "../utils/authUtils";
import {
  clearAuthCookies,
  setAuthStateCookie,
  setSessionIdCookie,
  setUserIdCookie,
} from "../utils/cookieUtils";

interface UseAuthReturn {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<{ success: boolean }>;
  register: (credentials: RegisterCredentials) => Promise<any>;
  logout: () => Promise<void>;
  resetPassword: (
    email: string
  ) => Promise<{ success: boolean; message: string }>;
  updatePassword: (password: string) => Promise<{ success: boolean }>;
  validatePassword: (password: string) => boolean;
  checkSession: () => Promise<boolean>;
  refreshSession: () => Promise<boolean>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  toggleWishlist: (productId: string) => Promise<void>;
  addReview: (productId: string, review: any) => Promise<void>;
  requestDataExport: () => Promise<void>;
  requestAccountDeletion: () => Promise<void>;
}

export const useAuthCore = (): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      try {
        // Check if we have a valid session
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error("Error getting session:", error);
          setIsAuthenticated(false);
          setUser(null);
          setIsLoading(false);
          return;
        }

        if (data.session) {
          // We have a session, get user data
          try {
            const { data: userData, error: userError } =
              await supabase.auth.getUser();

            if (userError || !userData.user) {
              console.error("Error getting user data:", userError);
              console.log(
                "CRITICAL: About to call signOut() due to getUser() error"
              );
              setIsAuthenticated(false);
              setUser(null);
              // Try to sign out to clear invalid session
              await supabase.auth.signOut();
              console.log("CRITICAL: signOut() completed");
              setIsLoading(false);
              return;
            }

            // Get profile data
            const { data: profile } = await supabase
              .from("profiles")
              .select("*")
              .eq("id", userData.user.id)
              .single();

            // Get user settings
            const { data: settings } = await supabase
              .from("user_settings")
              .select("*")
              .eq("id", userData.user.id);

            // Determine user role
            let role = "user";
            try {
              const { data: isAdmin } = await supabase.rpc(
                "user_has_role_simple",
                {
                  user_uuid: userData.user.id,
                  role_name: "admin",
                }
              );

              if (isAdmin) {
                role = "admin";
              } else {
                const { data: isModerator } = await supabase.rpc(
                  "user_has_role_simple",
                  {
                    user_uuid: userData.user.id,
                    role_name: "moderator",
                  }
                );

                if (isModerator) {
                  role = "moderator";
                }
              }
            } catch (roleError) {
              console.error("Error checking user role:", roleError);
            }

            // Create user object
            const user: User = {
              id: userData.user.id,
              email: userData.user.email || "",
              name:
                profile?.full_name ||
                userData.user.user_metadata?.name ||
                "Użytkownik",
              avatar: profile?.avatar_url,
              role: role as "user" | "admin" | "moderator" | "editor",
              wishlist: profile?.wishlist || [],
              reviews: profile?.reviews || [],
              createdAt: userData.user.created_at,
              lastLogin: profile?.last_login || new Date().toISOString(),
              isActive: true,
              settings: (settings && settings.length > 0
                ? settings[0]
                : null) || {
                emailNotifications: true,
                marketingConsent: false,
                theme: "light",
                language: "pl",
                twoFactorEnabled: false,
              },
            };

            setUser(user);
            setIsAuthenticated(true);

            // Set cookies for cross-tab auth state
            setAuthStateCookie(true);
            setSessionIdCookie(data.session.access_token);
            setUserIdCookie(userData.user.id);
          } catch (userDataError) {
            console.error("Error processing user data:", userDataError);
            setIsAuthenticated(false);
            setUser(null);
          }
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (err) {
        console.error("Auth initialization error:", err);
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    // Set up auth state change listener
    const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state change in hook:", event);

      if (event === "SIGNED_IN" && session) {
        try {
          const { data: userData } = await supabase.auth.getUser();

          if (userData && userData.user) {
            // Get profile data
            const { data: profile } = await supabase
              .from("profiles")
              .select("*")
              .eq("id", userData.user.id)
              .single();

            // Get user settings
            const { data: settings } = await supabase
              .from("user_settings")
              .select("*")
              .eq("id", userData.user.id);

            // Determine user role
            let role = "user";
            try {
              const { data: isAdmin } = await supabase.rpc(
                "user_has_role_simple",
                {
                  user_uuid: userData.user.id,
                  role_name: "admin",
                }
              );

              if (isAdmin) {
                role = "admin";
              } else {
                const { data: isModerator } = await supabase.rpc(
                  "user_has_role_simple",
                  {
                    user_uuid: userData.user.id,
                    role_name: "moderator",
                  }
                );

                if (isModerator) {
                  role = "moderator";
                }
              }
            } catch (roleError) {
              console.error("Error checking user role:", roleError);
            }

            // Create user object
            const user: User = {
              id: userData.user.id,
              email: userData.user.email || "",
              name:
                profile?.full_name ||
                userData.user.user_metadata?.name ||
                "Użytkownik",
              avatar: profile?.avatar_url,
              role: role as "user" | "admin" | "moderator" | "editor",
              wishlist: profile?.wishlist || [],
              reviews: profile?.reviews || [],
              createdAt: userData.user.created_at,
              lastLogin: profile?.last_login || new Date().toISOString(),
              isActive: true,
              settings: (settings && settings.length > 0
                ? settings[0]
                : null) || {
                emailNotifications: true,
                marketingConsent: false,
                theme: "light",
                language: "pl",
                twoFactorEnabled: false,
              },
            };

            setUser(user);
            setIsAuthenticated(true);

            // Set cookies for cross-tab auth state
            setAuthStateCookie(true);
            setSessionIdCookie(session.access_token);
            setUserIdCookie(userData.user.id);
          }
        } catch (err) {
          console.error("Error getting user data after sign in:", err);
        }
      } else if (event === "SIGNED_OUT") {
        setUser(null);
        setIsAuthenticated(false);
        clearSessionData();
        clearAuthCookies();
      } else if (event === "TOKEN_REFRESHED" && session) {
        // Just update the authenticated state, no need to fetch user again
        setIsAuthenticated(true);

        // Update cookies with new token
        setAuthStateCookie(true);
        setSessionIdCookie(session.access_token);
      }

      setIsLoading(false);
    });

    // Set up session check interval - DISABLED FOR DEBUGGING
    console.log("useAuth: SKIPPING session check interval for debug");
    /*
    const interval = window.setInterval(async () => {
      const { data: currentSession } = await supabase.auth.getSession();
      if (currentSession.session) {
        const valid = await isSessionValid();
        if (!valid) {
          console.log(
            "useAuth: Session invalid, about to call refreshTokenIfNeeded()"
          );
          const refreshed = await refreshTokenIfNeeded();
          console.log(
            "useAuth: refreshTokenIfNeeded() completed, result:",
            refreshed
          );
          if (!refreshed) {
            // Session couldn't be refreshed, log out
            setUser(null);
            setIsAuthenticated(false);
            clearSessionData();
            clearAuthCookies();
          }
        }
      }
    }, 60000); // Check every minute
    */ // DISABLED FOR DEBUGGING
    const interval = null; // DISABLED FOR DEBUGGING

    return () => {
      data.subscription.unsubscribe();
      if (interval) {
        clearInterval(interval);
      }
    };
  }, []); // Keep empty dependency array as we're using current session state

  // Login function
  const login = async (
    credentials: LoginCredentials
  ): Promise<{ success: boolean }> => {
    setIsLoading(true);
    setError(null);

    try {
      // Validate inputs
      if (!credentials.email || !credentials.password) {
        throw new Error("Email i hasło są wymagane");
      }

      const email = credentials.email.trim().toLowerCase();

      // Attempt login
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: credentials.password,
      });

      if (error) {
        console.error("Supabase login error:", error);
        throw error;
      }

      if (!data.user) {
        throw new Error("Nie udało się zalogować - brak danych użytkownika");
      }

      // Login successful, user data will be set by the auth state change listener
      console.log("Login successful, user:", data.user.id);

      // Set cookies for cross-tab auth state
      if (data.session) {
        setAuthStateCookie(true);
        setUserIdCookie(data.user.id);
      }

      // Get user data and update state immediately for faster UI response
      try {
        // Get profile data
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", data.user.id)
          .single();

        // Get user settings
        const { data: settings } = await supabase
          .from("user_settings")
          .select("*")
          .eq("id", data.user.id);

        // Determine user role
        let role = "user";
        try {
          const { data: isAdmin } = await supabase.rpc("user_has_role_simple", {
            user_uuid: data.user.id,
            role_name: "admin",
          });

          if (isAdmin) {
            role = "admin";
          } else {
            const { data: isModerator } = await supabase.rpc(
              "user_has_role_simple",
              {
                user_uuid: data.user.id,
                role_name: "moderator",
              }
            );

            if (isModerator) {
              role = "moderator";
            }
          }
        } catch (roleError) {
          console.error("Error checking user role:", roleError);
        }

        // Create user object
        const user: User = {
          id: data.user.id,
          email: data.user.email || "",
          name:
            profile?.full_name || data.user.user_metadata?.name || "Użytkownik",
          avatar: profile?.avatar_url,
          role: role as "user" | "admin" | "moderator" | "editor",
          wishlist: profile?.wishlist || [],
          reviews: profile?.reviews || [],
          createdAt: data.user.created_at,
          lastLogin: profile?.last_login || new Date().toISOString(),
          isActive: true,
          settings: (settings && settings.length > 0 ? settings[0] : null) || {
            emailNotifications: true,
            marketingConsent: false,
            theme: "light",
            language: "pl",
            twoFactorEnabled: false,
          },
        };

        setUser(user);
        setIsAuthenticated(true);
      } catch (userDataError) {
        console.error("Error getting user data after login:", userDataError);
        // Continue anyway, the auth state listener should handle this
      }

      setIsLoading(false);
      return { success: true };
    } catch (err: any) {
      let errorMessage = "Błąd logowania";

      if (err.message === "Invalid login credentials") {
        errorMessage = "Nieprawidłowe dane logowania";
      } else if (err.message === "Email not confirmed") {
        errorMessage = "Potwierdź swój adres email przed logowaniem";
      } else if (err.message === "Too many requests") {
        errorMessage = "Zbyt wiele prób logowania. Spróbuj ponownie za chwilę";
      } else if (err.message) {
        errorMessage = err.message;
      }

      console.error("Login error:", errorMessage);
      setError(errorMessage);
      setIsLoading(false);
      throw new Error(errorMessage);
    }
  };

  // Register function
  const register = async (credentials: RegisterCredentials) => {
    setIsLoading(true);
    setError(null);

    try {
      // Validate inputs
      if (credentials.password !== credentials.confirmPassword) {
        throw new Error("Hasła nie są identyczne");
      }

      const email = credentials.email.trim().toLowerCase();
      if (!validateEmail(email)) {
        throw new Error("Nieprawidłowy format adresu email");
      }

      if (!validatePassword(credentials.password)) {
        throw new Error(
          "Hasło musi mieć co najmniej 8 znaków i zawierać dużą literę, cyfrę oraz znak specjalny"
        );
      }

      // Attempt registration
      const { data, error } = await supabase.auth.signUp({
        email,
        password: credentials.password,
        options: {
          data: {
            name: credentials.name,
            marketing_consent: credentials.marketingConsent,
          },
        },
      });

      if (error) {
        throw error;
      }

      // Check if email confirmation is required
      const requiresEmailVerification = !data.session;

      // If session exists (no email verification required), set user data
      if (data.session && data.user) {
        // Get profile data
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", data.user.id)
          .single();

        // Get user settings
        const { data: settings } = await supabase
          .from("user_settings")
          .select("*")
          .eq("id", data.user.id);

        // Create user object
        const user: User = {
          id: data.user.id,
          email: data.user.email || "",
          name:
            profile?.full_name ||
            data.user.user_metadata?.name ||
            credentials.name ||
            "Użytkownik",
          avatar: profile?.avatar_url,
          role: "user",
          wishlist: [],
          reviews: [],
          createdAt: data.user.created_at,
          lastLogin: new Date().toISOString(),
          isActive: true,
          settings: (settings && settings.length > 0 ? settings[0] : null) || {
            emailNotifications: true,
            marketingConsent: credentials.marketingConsent || false,
            theme: "light",
            language: "pl",
            twoFactorEnabled: false,
          },
        };

        setUser(user);
        setIsAuthenticated(true);

        // Set cookies for cross-tab auth state
        setAuthStateCookie(true);
        setSessionIdCookie(data.session.access_token);
        setUserIdCookie(data.user.id);
      }

      setIsLoading(false);
      return {
        success: true,
        requiresEmailVerification,
        user: data.user,
      };
    } catch (err: any) {
      let errorMessage = "Błąd rejestracji";

      if (err.message === "User already registered") {
        errorMessage = "Użytkownik z tym adresem email już istnieje";
      } else if (err.message === "Password should be at least 6 characters") {
        errorMessage = "Hasło musi mieć co najmniej 6 znaków";
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      setIsLoading(false);
      throw new Error(errorMessage);
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    setIsLoading(true);

    try {
      await supabase.auth.signOut();
      clearSessionData();
      clearAuthCookies();
      setUser(null);
      setIsAuthenticated(false);
    } catch (err) {
      console.error("Logout error:", err);
      // Force logout even if API call fails
      clearSessionData();
      clearAuthCookies();
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset password function
  const resetPassword = async (
    email: string
  ): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true);
    setError(null);

    try {
      if (!validateEmail(email)) {
        throw new Error("Nieprawidłowy format adresu email");
      }

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        throw error;
      }

      setIsLoading(false);
      return {
        success: true,
        message:
          "Link do resetowania hasła został wysłany na podany adres email",
      };
    } catch (err: any) {
      const errorMessage = err.message || "Błąd resetowania hasła";
      setError(errorMessage);
      setIsLoading(false);
      throw new Error(errorMessage);
    }
  };

  // Update password function
  const updatePassword = async (
    password: string
  ): Promise<{ success: boolean }> => {
    setIsLoading(true);
    setError(null);

    try {
      if (!validatePassword(password)) {
        throw new Error(
          "Hasło musi mieć co najmniej 8 znaków i zawierać dużą literę, cyfrę oraz znak specjalny"
        );
      }

      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        throw error;
      }

      setIsLoading(false);
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.message || "Błąd aktualizacji hasła";
      setError(errorMessage);
      setIsLoading(false);
      throw new Error(errorMessage);
    }
  };

  // Check session validity
  const checkSession = useCallback(async (): Promise<boolean> => {
    try {
      return await isSessionValid();
    } catch (err) {
      console.error("Session check error:", err);
      return false;
    }
  }, []);

  // Refresh session
  const refreshSession = useCallback(async (): Promise<boolean> => {
    try {
      console.log("useAuth: refreshSession callback called");
      const result = await refreshTokenIfNeeded();
      console.log(
        "useAuth: refreshSession callback completed, result:",
        result
      );
      return result;
    } catch (err) {
      console.error("Session refresh error:", err);
      return false;
    }
  }, []);

  // Update profile function
  const updateProfile = async (data: Partial<User>): Promise<void> => {
    if (!user) {
      throw new Error("Użytkownik nie jest zalogowany");
    }

    setIsLoading(true);
    setError(null);

    try {
      // Update profile in Supabase
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: data.name,
          avatar_url: data.avatar,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) {
        throw error;
      }

      // Update local user state
      setUser((prev) => (prev ? { ...prev, ...data } : null));
      setIsLoading(false);
    } catch (err: any) {
      const errorMessage = err.message || "Błąd aktualizacji profilu";
      setError(errorMessage);
      setIsLoading(false);
      throw new Error(errorMessage);
    }
  };

  // Toggle wishlist function
  const toggleWishlist = async (productId: string): Promise<void> => {
    if (!user) {
      throw new Error("Użytkownik nie jest zalogowany");
    }

    try {
      // Use the RPC function to toggle wishlist
      const { data, error } = await supabase.rpc('toggle_wishlist', {
        product_id: productId,
        user_uuid: user.id
      });

      if (error) {
        throw error;
      }

      // Reload user data to get updated wishlist
      const { data: profile } = await supabase
        .from("profiles")
        .select("wishlist")
        .eq("id", user.id)
        .single();

      if (profile) {
        setUser((prev) => (prev ? { ...prev, wishlist: profile.wishlist || [] } : null));
      }
    } catch (err: any) {
      const errorMessage = err.message || "Błąd aktualizacji listy życzeń";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Add review function
  const addReview = async (productId: string, review: any): Promise<void> => {
    if (!user) {
      throw new Error("Użytkownik nie jest zalogowany");
    }

    try {
      // Use the RPC function to add review
      const { data, error } = await supabase.rpc('add_product_review', {
        product_id: productId,
        rating: review.rating,
        comment: review.comment,
        user_uuid: user.id
      });

      if (error) {
        throw error;
      }

      // Reload user data to get updated reviews
      const { data: profile } = await supabase
        .from("profiles")
        .select("reviews")
        .eq("id", user.id)
        .single();

      if (profile) {
        setUser((prev) => (prev ? { ...prev, reviews: profile.reviews || [] } : null));
      }
    } catch (err: any) {
      const errorMessage = err.message || "Błąd dodawania recenzji";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Request data export function
  const requestDataExport = async (): Promise<void> => {
    if (!user) {
      throw new Error("Użytkownik nie jest zalogowany");
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.rpc("export_user_data", {
        user_uuid: user.id,
      });

      if (error) {
        throw error;
      }

      // Create and download a JSON file with the user data
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `user_data_${new Date().toISOString()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setIsLoading(false);
    } catch (err: any) {
      const errorMessage = err.message || "Błąd żądania eksportu danych";
      setError(errorMessage);
      setIsLoading(false);
      throw new Error(errorMessage);
    }
  };

  // Request account deletion function
  const requestAccountDeletion = async (): Promise<void> => {
    if (!user) {
      throw new Error("Użytkownik nie jest zalogowany");
    }

    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.rpc("request_data_deletion", {
        user_uuid: user.id,
      });

      if (error) {
        throw error;
      }

      // Update local state to reflect deletion request
      setUser((prev) =>
        prev
          ? {
              ...prev,
              data_deletion_requested: true,
              data_deletion_requested_at: new Date().toISOString(),
            }
          : null
      );

      // Log the user out after requesting deletion
      await logout();

      setIsLoading(false);
    } catch (err: any) {
      const errorMessage = err.message || "Błąd żądania usunięcia konta";
      setError(errorMessage);
      setIsLoading(false);
      throw new Error(errorMessage);
    }
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    resetPassword,
    updatePassword,
    validatePassword,
    checkSession,
    refreshSession,
    updateProfile,
    toggleWishlist,
    addReview,
    requestDataExport,
    requestAccountDeletion,
  };
};
