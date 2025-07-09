export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'user' | 'admin' | 'moderator' | 'editor';
  wishlist: string[];
  reviews: Review[];
  createdAt: string;
  lastLogin: string;
  isActive: boolean;
  settings?: UserSettings;
  securityInfo?: UserSecurityInfo;
  gdprInfo?: UserGdprInfo;
  wishlist?: string[];
  reviews?: any[];
  data_deletion_requested?: boolean;
  data_deletion_requested_at?: string;
}

export interface UserSettings {
  emailNotifications: boolean;
  marketingConsent: boolean;
  theme: 'light' | 'dark' | 'system';
  language: string;
  twoFactorEnabled: boolean;
}

export interface UserSecurityInfo {
  accountLocked: boolean;
  failedLoginAttempts: number;
  lastPasswordChange: string | null;
  passwordResetRequired: boolean;
}

export interface UserGdprInfo {
  dataRetentionPolicy: string;
  dataDeletionRequested: boolean;
  dataDeletionRequestedAt: string | null;
}

export interface Review {
  id: string;
  userId: string;
  productId: string;
  rating: number;
  comment: string;
  dateCreated: string;
  isVerified: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
  marketingConsent?: boolean;
}