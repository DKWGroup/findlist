import { User } from "@supabase/supabase-js";
import { useCallback, useEffect, useState } from "react";
import { supabase } from "../services/supabaseStorage";
import { isUserAdmin } from "../utils/adminUtils";

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials {
  full_name: string;
  email: string;
  password: string;
  confirmPassword?: string;
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
      setIsLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: credentials.email.trim().toLowerCase(),
          password: credentials.password,
        });

        if (error) {
          // Map Supabase errors to user-friendly Polish messages
          let errorMessage = error.message || "Błąd logowania";
          if (error.message.includes("Invalid login credentials")) {
            errorMessage = "Nieprawidłowy email lub hasło";
          }
          setError(errorMessage);
          return { success: false };
        }

        if (data?.user) setUser(data.user);
        return { success: true };
      } catch (err) {
        const message = err instanceof Error ? err.message : "Login failed";
        setError(message);
        return { success: false };
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Register (sign up) with polling for profile creation (trigger)
  const register = useCallback(
    async (credentials: RegisterCredentials): Promise<{ success: boolean }> => {
      setIsLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase.auth.signUp({
          email: credentials.email.trim().toLowerCase(),
          password: credentials.password,
          options: {
            data: { full_name: credentials.full_name },
          },
        });

        if (error) {
          // Map supabase errors
          let msg = error.message || "Błąd rejestracji";
          if (
            error.status === 429 ||
            msg.includes("rate limit") ||
            msg.includes("Too Many Requests")
          ) {
            msg =
              "Zbyt wiele prób rejestracji. Spróbuj ponownie za kilka minut.";
          }
          setError(msg);
          return { success: false };
        }

        if (!data?.user) {
          setError("Brak danych użytkownika w odpowiedzi z serwera");
          return { success: false };
        }

        // Poll for profile created by DB trigger
        const maxAttempts = 5;
        let attempt = 0;
        let profileFound: any = null;
        let lastErr: any = null;

        while (attempt < maxAttempts) {
          attempt += 1;
          const backoff = 300 * Math.pow(2, attempt - 1);
          try {
            const { data: profile, error: checkErr } = await supabase
              .from("profiles")
              .select("id, email, full_name, wishlist, reviews")
              .eq("id", data.user.id)
              .maybeSingle();

            if (checkErr) {
              lastErr = checkErr;
            } else if (profile) {
              profileFound = profile;
              break;
            }
          } catch (e) {
            lastErr = e;
          }

          // wait
          // eslint-disable-next-line no-await-in-loop
          await new Promise((r) => setTimeout(r, backoff));
        }

        if (!profileFound) {
          console.error("Profil nie został utworzony przez trigger:", lastErr);
          setError(
            "Profil użytkownika nie został automatycznie utworzony. Sprawdź polityki RLS dla tabeli public.profiles lub uruchom skrypt naprawczy."
          );
          return { success: false };
        }

        // success
        return { success: true };
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Registration failed";
        setError(message);
        return { success: false };
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Logout
  const logout = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Password validation
  const validatePassword = useCallback((password: string): boolean => {
    return (
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[0-9]/.test(password) &&
      /[!@#$%^&*(),.?":{}|<>]/.test(password)
    );
  }, []);

  // Reset password
  const resetPassword = useCallback(
    async (email: string): Promise<{ success: boolean }> => {
      setIsLoading(true);
      setError(null);
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/update-password`,
        });
        if (error) {
          let msg = error.message || "Błąd wysyłania emaila";
          if (msg.includes("User not found"))
            msg = "Nie znaleziono użytkownika o podanym adresie email";
          setError(msg);
          return { success: false };
        }
        return { success: true };
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Reset password failed";
        setError(message);
        return { success: false };
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Update password
  const updatePassword = useCallback(
    async (newPassword: string): Promise<{ success: boolean }> => {
      setIsLoading(true);
      setError(null);
      try {
        const { error } = await supabase.auth.updateUser({
          password: newPassword,
        });
        if (error) {
          setError(error.message || "Błąd aktualizacji hasła");
          return { success: false };
        }
        return { success: true };
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Update password failed";
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

    const getInitialSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (mounted) {
          setUser(session?.user ?? null);
          setIsLoading(false);

          if (session?.user) {
            isUserAdmin()
              .then((isAdmin) => {
                if (isAdmin) setUserRole("admin");
              })
              .catch((err) =>
                console.error("Error checking admin status:", err)
              );
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

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;
      try {
        if (event === "SIGNED_OUT") setUser(null);
        else if (session?.user) setUser(session.user);
        setError(null);
      } finally {
        setIsLoading(false);
      }
    });

    return () => {
      mounted = false;
      try {
        subscription.unsubscribe();
      } catch (e) {
        /* ignore */
      }
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
