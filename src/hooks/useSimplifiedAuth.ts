import { User } from "@supabase/supabase-js";
import { useCallback, useEffect, useState } from "react";
import { supabase } from "../services/supabaseStorage";
import { isUserAdmin } from "../utils/adminUtils";

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials {
  email: string;
  password: string;
  confirmPassword: string;
}

// SIMPLIFIED AUTH HOOK - maksymalnie uproszczona wersja
export const useSimplifiedAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string>("user");

  // Simple login
  const login = useCallback(
    async (credentials: LoginCredentials): Promise<{ success: boolean }> => {
      console.log("SimplifiedAuth: Starting login...");
      setIsLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: credentials.email.trim().toLowerCase(),
          password: credentials.password,
        });

        if (error) {
          // Map Supabase errors to user-friendly Polish messages
          let errorMessage = error.message;

          if (error.message.includes("Invalid login credentials")) {
            errorMessage = "Nieprawidłowy email lub hasło";
          } else if (error.message.includes("Email not confirmed")) {
            errorMessage =
              "Adres email nie został potwierdzony. Sprawdź swoją skrzynkę pocztową.";
          } else if (error.message.includes("Too many requests")) {
            errorMessage =
              "Zbyt wiele prób logowania. Spróbuj ponownie za chwilę.";
          } else if (error.message.includes("User not found")) {
            errorMessage = "Nie znaleziono użytkownika o podanym adresie email";
          } else if (error.message.includes("Invalid email")) {
            errorMessage = "Nieprawidłowy format adresu email";
          }

          throw new Error(errorMessage);
        }

        if (!data.user) throw new Error("Wystąpił błąd podczas logowania");

        console.log("SimplifiedAuth: Login successful");
        return { success: true };
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Wystąpił błąd podczas logowania";
        console.error("SimplifiedAuth: Login error:", message);
        setError(message);
        return { success: false };
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Simple logout
  const logout = useCallback(async () => {
    console.log("SimplifiedAuth: Logging out...");
    setIsLoading(true);
    try {
      await supabase.auth.signOut();
      console.log("SimplifiedAuth: Logout successful");
    } catch (err) {
      console.error("SimplifiedAuth: Logout error:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Simple register
  const register = useCallback(
    async (credentials: RegisterCredentials): Promise<{ success: boolean }> => {
      console.log("SimplifiedAuth: Starting registration...");
      setIsLoading(true);
      setError(null);

      try {
        if (credentials.password !== credentials.confirmPassword) {
          throw new Error("Hasła nie są identyczne");
        }

        const { error } = await supabase.auth.signUp({
          email: credentials.email.trim().toLowerCase(),
          password: credentials.password,
        });

        if (error) {
          // Map Supabase errors to user-friendly Polish messages
          let errorMessage = error.message;

          if (error.message.includes("User already registered")) {
            errorMessage = "Użytkownik z tym adresem email już istnieje";
          } else if (error.message.includes("Password should be at least")) {
            errorMessage = "Hasło musi mieć co najmniej 6 znaków";
          } else if (error.message.includes("Invalid email")) {
            errorMessage = "Nieprawidłowy format adresu email";
          } else if (error.message.includes("Signup is disabled")) {
            errorMessage = "Rejestracja jest obecnie niedostępna";
          }

          throw new Error(errorMessage);
        }

        console.log("SimplifiedAuth: Registration successful");
        return { success: true };
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Registration failed";
        console.error("SimplifiedAuth: Registration error:", message);
        setError(message);
        return { success: false };
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Password validation function
  const validatePassword = useCallback((password: string): boolean => {
    return (
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[0-9]/.test(password) &&
      /[!@#$%^&*(),.?":{}|<>]/.test(password)
    );
  }, []);

  // Reset password function
  const resetPassword = useCallback(
    async (email: string): Promise<{ success: boolean }> => {
      setIsLoading(true);
      setError(null);

      try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/update-password`,
        });

        if (error) {
          // Map Supabase errors to user-friendly Polish messages
          let errorMessage = error.message;

          if (error.message.includes("User not found")) {
            errorMessage = "Nie znaleziono użytkownika o podanym adresie email";
          } else if (error.message.includes("Invalid email")) {
            errorMessage = "Nieprawidłowy format adresu email";
          } else if (error.message.includes("Too many requests")) {
            errorMessage =
              "Zbyt wiele próśb resetowania hasła. Spróbuj ponownie za chwilę.";
          }

          throw new Error(errorMessage);
        }

        console.log("SimplifiedAuth: Password reset email sent");
        return { success: true };
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Reset password failed";
        console.error("SimplifiedAuth: Reset password error:", message);
        setError(message);
        return { success: false };
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Update password function
  const updatePassword = useCallback(
    async (newPassword: string): Promise<{ success: boolean }> => {
      setIsLoading(true);
      setError(null);

      try {
        const { error } = await supabase.auth.updateUser({
          password: newPassword,
        });

        if (error) {
          // Map Supabase errors to user-friendly Polish messages
          let errorMessage = error.message;

          if (error.message.includes("Password should be at least")) {
            errorMessage = "Hasło musi mieć co najmniej 6 znaków";
          } else if (error.message.includes("Same password")) {
            errorMessage = "Nowe hasło musi różnić się od poprzedniego";
          }

          throw new Error(errorMessage);
        }

        console.log("SimplifiedAuth: Password updated successfully");
        return { success: true };
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Update password failed";
        console.error("SimplifiedAuth: Update password error:", message);
        setError(message);
        return { success: false };
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Initialize and listen for auth changes
  useEffect(() => {
    let mounted = true;

    // Get initial session
    const getInitialSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (mounted) {
          setUser(session?.user ?? null);
          setIsLoading(false);
          console.log("SimplifiedAuth: Initial session loaded");
          
          // Check if user is admin and update role
          if (session?.user) {
            isUserAdmin().then(isAdmin => {
              if (isAdmin) {
                setUserRole("admin");
              }
            }).catch(err => {
              console.error("Error checking admin status:", err);
            });
          }
        }
      } catch (err) {
        console.error("SimplifiedAuth: Error getting initial session:", err);
        if (mounted) {
          setUser(null);
          setIsLoading(false);
        }
      }
    };

    getInitialSession();

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("SimplifiedAuth: Auth state change:", event);

      if (mounted) {
        setUser(session?.user ?? null);
        setError(null);
        setIsLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return {
    user,
    isAuthenticated: !!user,
    userRole,
    isLoading,
    error,
    login,
    logout,
    register,
    validatePassword,
    resetPassword,
    updatePassword,
  };
};
