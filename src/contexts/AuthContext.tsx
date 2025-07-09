import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { User, AuthState, LoginCredentials, RegisterCredentials } from '../types/auth';
import { supabase } from '../services/supabaseStorage';
import { useAuthCore } from '../hooks/useAuth';
import { initializeAuthListeners, refreshTokenIfNeeded } from '../middleware/AuthMiddleware';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  toggleWishlist: (productId: string) => Promise<void>;
  addReview: (productId: string, review: any) => Promise<void>;
  requestDataExport: () => Promise<void>;
  requestAccountDeletion: () => Promise<void>;
  validatePassword: (password: string) => boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
    checkSession,
    refreshSession
  } = useAuthCore();
  
  // Debug auth state changes
  useEffect(() => {
    console.log('AuthContext state changed:', { 
      isAuthenticated, 
      user: user ? `User ${user.id} (${user.role})` : 'No user',
      isLoading
    });
  }, [isAuthenticated, user, isLoading]);
  
  // Create a state object that combines the hook state with the additional methods
  const state = {
    user,
    isAuthenticated,
    isLoading,
    error
  };

  return (
    <AuthContext.Provider value={{
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
      addReview
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};