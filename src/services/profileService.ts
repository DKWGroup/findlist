import { supabase } from './supabaseStorage';
import { User } from '../types/auth';

interface UpdateProfileParams {
  name?: string;
  email?: string;
  notificationPreferences?: {
    email_notifications?: boolean;
    product_updates?: boolean;
    marketing_emails?: boolean;
    security_alerts?: boolean;
  };
  privacySettings?: {
    public_profile?: boolean;
    show_wishlist?: boolean;
    show_reviews?: boolean;
    allow_recommendations?: boolean;
  };
  theme?: 'light' | 'dark' | 'system';
  language?: string;
}

interface ChangePasswordParams {
  currentPassword: string;
  newPassword: string;
}

interface ChangeEmailParams {
  newEmail: string;
  password: string;
}

class ProfileService {
  /**
   * Update user profile and settings
   */
  async updateProfile(userId: string, params: UpdateProfileParams): Promise<{ success: boolean; message?: string }> {
    try {
      // Update profile
      if (params.name) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            full_name: params.name,
            updated_at: new Date().toISOString()
          })
          .eq('id', userId);

        if (profileError) throw profileError;
      }

      // Update user settings
      if (params.notificationPreferences || params.privacySettings || params.theme || params.language) {
        const { error: settingsError } = await supabase.rpc('update_user_settings', {
          user_uuid: userId,
          new_notification_preferences: params.notificationPreferences ? params.notificationPreferences : null,
          new_privacy_settings: params.privacySettings ? params.privacySettings : null,
          new_theme: params.theme || null,
          new_language: params.language || null
        });

        if (settingsError) throw settingsError;
      }

      return { success: true };
    } catch (error: any) {
      console.error('Error updating profile:', error);
      return { 
        success: false, 
        message: error.message || 'Wystąpił błąd podczas aktualizacji profilu'
      };
    }
  }

  /**
   * Change user password
   */
  async changePassword(userId: string, params: ChangePasswordParams): Promise<{ success: boolean; message?: string }> {
    try {
      // Verify current password
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: '', // We need to get the email first
        password: params.currentPassword
      });

      if (signInError) {
        return { 
          success: false, 
          message: 'Nieprawidłowe obecne hasło'
        };
      }

      // Update password
      const { error: updateError } = await supabase.auth.updateUser({
        password: params.newPassword
      });

      if (updateError) throw updateError;

      // Log security event
      await supabase
        .from('user_security_logs')
        .insert({
          user_id: userId,
          action: 'password_changed',
          details: { timestamp: new Date().toISOString() }
        });

      return { success: true };
    } catch (error: any) {
      console.error('Error changing password:', error);
      return { 
        success: false, 
        message: error.message || 'Wystąpił błąd podczas zmiany hasła'
      };
    }
  }

  /**
   * Initiate email change process
   */
  async changeEmail(userId: string, params: ChangeEmailParams): Promise<{ success: boolean; message?: string }> {
    try {
      // Verify password
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError || !userData.user) {
        throw new Error('Nie można pobrać danych użytkownika');
      }
      
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: userData.user.email || '',
        password: params.password
      });

      if (signInError) {
        return { 
          success: false, 
          message: 'Nieprawidłowe hasło'
        };
      }

      // Update profile with new email (this will trigger the verification process)
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          email: params.newEmail,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (updateError) throw updateError;

      return { 
        success: true,
        message: 'Link weryfikacyjny został wysłany na nowy adres email'
      };
    } catch (error: any) {
      console.error('Error changing email:', error);
      return { 
        success: false, 
        message: error.message || 'Wystąpił błąd podczas zmiany adresu email'
      };
    }
  }

  /**
   * Get user profile and settings
   */
  async getUserProfile(userId: string): Promise<{ 
    profile: any; 
    settings: any; 
    success: boolean; 
    message?: string 
  }> {
    try {
      // Get profile data
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) throw profileError;

      // Get user settings
      const { data: settings, error: settingsError } = await supabase
        .from('user_settings')
        .select('*')
        .eq('id', userId)
        .single();

      // It's okay if settings don't exist yet
      if (settingsError && settingsError.code !== 'PGRST116') {
        throw settingsError;
      }

      return { 
        profile, 
        settings: settings || {
          notification_preferences: {
            email_notifications: true,
            product_updates: true,
            marketing_emails: false,
            security_alerts: true
          },
          privacy_settings: {
            public_profile: false,
            show_wishlist: false,
            show_reviews: true,
            allow_recommendations: true
          },
          theme: 'light',
          language: 'pl'
        }, 
        success: true 
      };
    } catch (error: any) {
      console.error('Error getting user profile:', error);
      return { 
        profile: null, 
        settings: null, 
        success: false, 
        message: error.message || 'Wystąpił błąd podczas pobierania profilu użytkownika'
      };
    }
  }

  /**
   * Check email verification status
   */
  async checkEmailVerificationStatus(userId: string): Promise<{ 
    isVerificationPending: boolean; 
    verificationSentAt?: string;
    success: boolean;
    message?: string;
  }> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('email_verification_token, email_verification_sent_at')
        .eq('id', userId)
        .single();

      if (error) throw error;

      return {
        isVerificationPending: !!data?.email_verification_token,
        verificationSentAt: data?.email_verification_sent_at,
        success: true
      };
    } catch (error: any) {
      console.error('Error checking email verification status:', error);
      return {
        isVerificationPending: false,
        success: false,
        message: error.message || 'Wystąpił błąd podczas sprawdzania statusu weryfikacji'
      };
    }
  }

  /**
   * Cancel email change request
   */
  async cancelEmailChange(userId: string): Promise<{ success: boolean; message?: string }> {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          email_verification_token: null,
          email_verification_sent_at: null,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) throw error;

      return { success: true };
    } catch (error: any) {
      console.error('Error canceling email change:', error);
      return {
        success: false,
        message: error.message || 'Wystąpił błąd podczas anulowania zmiany adresu email'
      };
    }
  }
}

export const profileService = new ProfileService();