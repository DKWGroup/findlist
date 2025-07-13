import React, { createContext, useContext, useEffect } from "react";
import { useAuthCore } from "../hooks/useAuth";
import {
  AuthState,
  LoginCredentials,
  RegisterCredentials,
  User,
} from "../types/auth";

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<{ success: boolean }>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  resetPassword: (
    email: string
  ) => Promise<{ success: boolean; message: string }>;
  updatePassword: (password: string) => Promise<{ success: boolean }>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  toggleWishlist: (productId: string) => Promise<void>;
  addReview: (productId: string, review: any) => Promise<void>;
  requestDataExport: () => Promise<void>;
  requestAccountDeletion: () => Promise<void>;
  validatePassword: (password: string) => boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Use the custom hook for auth logic
  const {
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
    updateProfile,
    toggleWishlist,
    addReview,
    requestDataExport,
    requestAccountDeletion,
  } = useAuthCore();

  // Debug auth state changes
  useEffect(() => {
    console.log("AuthContext state changed:", {
      isAuthenticated,
      user: user ? `User ${user.id} (${user.role})` : "No user",
      isLoading,
    });
  }, [isAuthenticated, user, isLoading]);

  // Create a state object that combines the hook state with the additional methods
  const state = {
    user,
    isAuthenticated,
    isLoading,
    error,
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        resetPassword,
        updatePassword,
        register,
        logout,
        updateProfile,
        requestDataExport,
        requestAccountDeletion,
        validatePassword,
        toggleWishlist,
        addReview,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
