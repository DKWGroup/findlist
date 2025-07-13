import { supabase } from './supabaseStorage';

interface ClientInfo {
  ip: string;
  userAgent: string;
  location?: string;
}

class SecurityService {
  /**
   * Check if login attempts should be rate limited
   */
  async checkLoginRateLimit(email: string): Promise<boolean> {
    try {
      // Get user ID from email
      const { data: userData } = await supabase
        .from('auth.users')
        .select('id')
        .eq('email', email)
        .single();
      
      if (!userData) {
        // User doesn't exist, but we'll still pretend to rate limit
        // to prevent user enumeration attacks
        return false;
      }
      
      // Check if account is locked or has too many failed attempts
      const { data: profile } = await supabase
        .from('profiles')
        .select('account_locked, failed_login_attempts, last_failed_login_at')
        .eq('id', userData.id)
        .single();
      
      if (!profile) return false;
      
      // If account is locked, rate limit
      if (profile.account_locked) return true;
      
      // If too many recent failed attempts, rate limit
      if (profile.failed_login_attempts >= 5) {
        // Check if the last attempt was within the last 30 minutes
        const lastAttempt = new Date(profile.last_failed_login_at);
        const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
        
        if (lastAttempt > thirtyMinutesAgo) {
          return true;
        }
        
        // If it's been more than 30 minutes, reset the counter
        await supabase
          .from('profiles')
          .update({ failed_login_attempts: 0 })
          .eq('id', userData.id);
      }
      
      return false;
    } catch (error) {
      console.error('Error checking rate limit:', error);
      return false; // Default to not rate limiting on error
    }
  }
  
  /**
   * Record a failed login attempt
   */
  async recordFailedLogin(email: string): Promise<void> {
    try {
      // Call the RPC function to record the failed login
      await supabase.rpc('record_failed_login', {
        user_email: email
      });
    } catch (error) {
      console.error('Error recording failed login:', error);
    }
  }
  
  /**
   * Record a successful login
   */
  async recordSuccessfulLogin(userId: string, clientInfo: ClientInfo): Promise<void> {
    try {
      // Call the RPC function to record the successful login
      await supabase.rpc('record_successful_login', {
        user_id: userId,
        ip_address: clientInfo.ip,
        user_agent: clientInfo.userAgent
      });
    } catch (error) {
      console.error('Error recording successful login:', error);
    }
  }
  
  /**
   * Get user's active sessions
   */
  async getUserSessions(userId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('user_sessions')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .order('last_active_at', { ascending: false });
      
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error getting user sessions:', error);
      return [];
    }
  }
  
  /**
   * Terminate a specific session
   */
  async terminateSession(sessionId: string, userId: string): Promise<boolean> {
    try {
      // Verify the session belongs to the user
      const { data: session } = await supabase
        .from('user_sessions')
        .select('user_id')
        .eq('id', sessionId)
        .single();
      
      if (!session || session.user_id !== userId) {
        throw new Error('Unauthorized session termination attempt');
      }
      
      // Update the session
      const { error } = await supabase
        .from('user_sessions')
        .update({
          is_active: false,
          ended_at: new Date().toISOString()
        })
        .eq('id', sessionId);
      
      if (error) throw error;
      
      // Log the security event
      await supabase
        .from('user_security_logs')
        .insert({
          user_id: userId,
          action: 'session_terminated',
          details: { session_id: sessionId }
        });
      
      return true;
    } catch (error) {
      console.error('Error terminating session:', error);
      return false;
    }
  }
  
  /**
   * Get security logs for a user
   */
  async getSecurityLogs(userId: string, limit: number = 20): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('user_security_logs')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error getting security logs:', error);
      return [];
    }
  }
  
  /**
   * Update user consent
   */
  async updateConsent(userId: string, consentType: string, consented: boolean): Promise<boolean> {
    try {
      if (consented) {
        // Add new consent
        const { error } = await supabase
          .from('user_consent_logs')
          .insert({
            user_id: userId,
            consent_type: consentType,
            consent_version: '1.0', // Should be dynamic in production
            user_agent: navigator.userAgent,
            is_active: true
          });
        
        if (error) throw error;
      } else {
        // Revoke existing consent
        const { error } = await supabase
          .from('user_consent_logs')
          .update({
            is_active: false,
            revoked_at: new Date().toISOString()
          })
          .eq('user_id', userId)
          .eq('consent_type', consentType)
          .eq('is_active', true);
        
        if (error) throw error;
      }
      
      // Update user settings for marketing consent
      if (consentType === 'marketing') {
        await supabase
          .from('user_settings')
          .update({ marketing_consent: consented })
          .eq('id', userId);
      }
      
      return true;
    } catch (error) {
      console.error('Error updating consent:', error);
      return false;
    }
  }
  
  /**
   * Get user's consent history
   */
  async getConsentHistory(userId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('user_consent_logs')
        .select('*')
        .eq('user_id', userId)
        .order('consented_at', { ascending: false });
      
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error getting consent history:', error);
      return [];
    }
  }
  
  /**
   * Enable two-factor authentication
   */
  async enableTwoFactor(userId: string): Promise<boolean> {
    try {
      // In a real implementation, this would generate and return a TOTP secret
      // For now, we'll just update the setting
      const { error } = await supabase
        .from('user_settings')
        .update({ two_factor_enabled: true })
        .eq('id', userId);
      
      if (error) throw error;
      
      // Log the security event
      await supabase
        .from('user_security_logs')
        .insert({
          user_id: userId,
          action: 'two_factor_enabled',
          details: { timestamp: new Date().toISOString() }
        });
      
      return true;
    } catch (error) {
      console.error('Error enabling two-factor auth:', error);
      return false;
    }
  }
  
  /**
   * Disable two-factor authentication
   */
  async disableTwoFactor(userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_settings')
        .update({ two_factor_enabled: false })
        .eq('id', userId);
      
      if (error) throw error;
      
      // Log the security event
      await supabase
        .from('user_security_logs')
        .insert({
          user_id: userId,
          action: 'two_factor_disabled',
          details: { timestamp: new Date().toISOString() }
        });
      
      return true;
    } catch (error) {
      console.error('Error disabling two-factor auth:', error);
      return false;
    }
  }
  
  /**
   * Unlock a locked account (admin only)
   */
  async unlockAccount(userId: string, adminId: string): Promise<boolean> {
    try {
      // Verify admin permissions
      const isAdmin = await supabase.rpc('user_has_role', {
        user_uuid: adminId,
        role_name: 'admin'
      });
      
      if (!isAdmin) {
        throw new Error('Only administrators can unlock accounts');
      }
      
      // Unlock the account
      const { error } = await supabase
        .from('profiles')
        .update({
          account_locked: false,
          account_locked_reason: null,
          account_locked_at: null,
          failed_login_attempts: 0,
          last_failed_login_at: null
        })
        .eq('id', userId);
      
      if (error) throw error;
      
      // Log the security event
      await supabase
        .from('user_security_logs')
        .insert({
          user_id: userId,
          action: 'account_unlocked',
          details: { 
            unlocked_by: adminId,
            timestamp: new Date().toISOString()
          }
        });
      
      return true;
    } catch (error) {
      console.error('Error unlocking account:', error);
      return false;
    }
  }
}

export const securityService = new SecurityService();