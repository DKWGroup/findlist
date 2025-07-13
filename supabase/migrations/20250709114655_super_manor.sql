/*
  # Comprehensive Authentication System Enhancements

  1. New Tables
    - `user_settings` - User preferences and settings
    - `user_sessions` - Track user sessions for security
    - `user_consent_logs` - GDPR compliance for user consent
    - `user_security_logs` - Security audit logs

  2. Security
    - Enable RLS on all tables
    - Add policies for proper access control
    - Add password strength validation function
    - Add rate limiting for login attempts

  3. Changes
    - Enhance profiles table with additional fields
    - Add GDPR compliance fields
    - Add security settings
*/

-- User Settings Table
CREATE TABLE IF NOT EXISTS user_settings (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email_notifications BOOLEAN DEFAULT true,
  marketing_consent BOOLEAN DEFAULT false,
  theme TEXT DEFAULT 'light',
  language TEXT DEFAULT 'pl',
  security_level TEXT DEFAULT 'medium',
  two_factor_enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- User Sessions Table for tracking
CREATE TABLE IF NOT EXISTS user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  ip_address TEXT,
  user_agent TEXT,
  device_info JSONB,
  location_info JSONB,
  started_at TIMESTAMPTZ DEFAULT now(),
  last_active_at TIMESTAMPTZ DEFAULT now(),
  ended_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true
);

-- User Consent Logs for GDPR
CREATE TABLE IF NOT EXISTS user_consent_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  consent_type TEXT NOT NULL,
  consent_version TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  consented_at TIMESTAMPTZ DEFAULT now(),
  revoked_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true
);

-- Security Audit Logs
CREATE TABLE IF NOT EXISTS user_security_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Add GDPR fields to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS data_retention_policy TEXT DEFAULT 'standard';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS data_deletion_requested BOOLEAN DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS data_deletion_requested_at TIMESTAMPTZ;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS account_locked BOOLEAN DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS account_locked_reason TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS account_locked_at TIMESTAMPTZ;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS failed_login_attempts INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_failed_login_at TIMESTAMPTZ;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_password_change TIMESTAMPTZ;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS password_reset_required BOOLEAN DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS wishlist JSONB DEFAULT '[]';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS reviews JSONB DEFAULT '[]';

-- Enable RLS on all tables
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_consent_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_security_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_settings
CREATE POLICY "Users can view own settings" ON user_settings
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own settings" ON user_settings
  FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for user_sessions
CREATE POLICY "Users can view own sessions" ON user_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can manage sessions" ON user_sessions
  FOR ALL USING (true);

-- RLS Policies for user_consent_logs
CREATE POLICY "Users can view own consent logs" ON user_consent_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can manage consent logs" ON user_consent_logs
  FOR ALL USING (true);

-- RLS Policies for user_security_logs
CREATE POLICY "Users can view own security logs" ON user_security_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all security logs" ON user_security_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_role_assignments ura
      JOIN user_roles ur ON ura.role_id = ur.id
      WHERE ura.user_id = auth.uid() 
      AND ur.name = 'admin' 
      AND ura.is_active = true
    )
  );

CREATE POLICY "System can insert security logs" ON user_security_logs
  FOR INSERT WITH CHECK (true);

-- Password strength validation function
CREATE OR REPLACE FUNCTION validate_password_strength(password TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  -- Check length
  IF LENGTH(password) < 8 THEN
    RETURN false;
  END IF;
  
  -- Check for numbers
  IF password !~ '[0-9]' THEN
    RETURN false;
  END IF;
  
  -- Check for special characters
  IF password !~ '[^a-zA-Z0-9]' THEN
    RETURN false;
  END IF;
  
  -- Check for uppercase
  IF password !~ '[A-Z]' THEN
    RETURN false;
  END IF;
  
  -- Check for lowercase
  IF password !~ '[a-z]' THEN
    RETURN false;
  END IF;
  
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check and handle rate limiting
CREATE OR REPLACE FUNCTION check_login_rate_limit(user_email TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  user_id UUID;
  attempt_count INTEGER;
  last_attempt TIMESTAMPTZ;
  is_locked BOOLEAN;
BEGIN
  -- Get user ID from email
  SELECT id INTO user_id FROM auth.users WHERE email = user_email;
  
  IF user_id IS NULL THEN
    -- User doesn't exist, but we'll still pretend to rate limit to prevent user enumeration
    RETURN true;
  END IF;
  
  -- Check if account is locked
  SELECT account_locked, failed_login_attempts, last_failed_login_at 
  INTO is_locked, attempt_count, last_attempt 
  FROM profiles 
  WHERE id = user_id;
  
  IF is_locked THEN
    -- Account is locked
    RETURN false;
  END IF;
  
  -- Check if we need to reset the counter (after 30 minutes)
  IF last_attempt IS NOT NULL AND (now() - last_attempt) > interval '30 minutes' THEN
    UPDATE profiles SET failed_login_attempts = 0 WHERE id = user_id;
    RETURN true;
  END IF;
  
  -- Check if too many attempts (5 attempts)
  IF attempt_count >= 5 THEN
    -- Lock the account
    UPDATE profiles 
    SET 
      account_locked = true, 
      account_locked_reason = 'Too many failed login attempts', 
      account_locked_at = now()
    WHERE id = user_id;
    
    -- Log the security event
    INSERT INTO user_security_logs (user_id, action, details)
    VALUES (user_id, 'account_locked', jsonb_build_object('reason', 'Too many failed login attempts'));
    
    RETURN false;
  END IF;
  
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to record failed login attempt
CREATE OR REPLACE FUNCTION record_failed_login(user_email TEXT)
RETURNS VOID AS $$
DECLARE
  user_id UUID;
BEGIN
  -- Get user ID from email
  SELECT id INTO user_id FROM auth.users WHERE email = user_email;
  
  IF user_id IS NULL THEN
    -- User doesn't exist, do nothing
    RETURN;
  END IF;
  
  -- Increment failed login attempts
  UPDATE profiles 
  SET 
    failed_login_attempts = failed_login_attempts + 1,
    last_failed_login_at = now()
  WHERE id = user_id;
  
  -- Log the security event
  INSERT INTO user_security_logs (user_id, action, details)
  VALUES (user_id, 'failed_login_attempt', jsonb_build_object('timestamp', now()));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to record successful login
CREATE OR REPLACE FUNCTION record_successful_login(user_id UUID, ip_address TEXT, user_agent TEXT)
RETURNS VOID AS $$
DECLARE
  device_info JSONB;
BEGIN
  -- Reset failed login attempts
  UPDATE profiles 
  SET 
    failed_login_attempts = 0,
    last_failed_login_at = NULL,
    last_login = now()
  WHERE id = user_id;
  
  -- Create basic device info
  device_info := jsonb_build_object(
    'user_agent', user_agent,
    'ip_address', ip_address
  );
  
  -- Create session record
  INSERT INTO user_sessions (user_id, ip_address, user_agent, device_info)
  VALUES (user_id, ip_address, user_agent, device_info);
  
  -- Log the security event
  INSERT INTO user_security_logs (user_id, action, ip_address, user_agent, details)
  VALUES (user_id, 'successful_login', ip_address, user_agent, device_info);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to handle GDPR data export
CREATE OR REPLACE FUNCTION export_user_data(user_uuid UUID)
RETURNS JSONB AS $$
DECLARE
  user_data JSONB;
BEGIN
  -- Check if the requesting user is the same as the target user
  IF auth.uid() != user_uuid THEN
    RAISE EXCEPTION 'Unauthorized access to user data';
  END IF;
  
  -- Collect user data from various tables
  WITH user_profile AS (
    SELECT * FROM profiles WHERE id = user_uuid
  ),
  user_settings AS (
    SELECT * FROM user_settings WHERE id = user_uuid
  ),
  user_roles AS (
    SELECT 
      ur.name, ur.display_name
    FROM user_role_assignments ura
    JOIN user_roles ur ON ura.role_id = ur.id
    WHERE ura.user_id = user_uuid AND ura.is_active = true
  ),
  user_consents AS (
    SELECT * FROM user_consent_logs 
    WHERE user_id = user_uuid
  ),
  user_sessions_data AS (
    SELECT * FROM user_sessions 
    WHERE user_id = user_uuid
  )
  SELECT 
    jsonb_build_object(
      'profile', to_jsonb(p.*),
      'settings', to_jsonb(s.*),
      'roles', jsonb_agg(DISTINCT r.*),
      'consents', jsonb_agg(DISTINCT c.*),
      'sessions', jsonb_agg(DISTINCT sess.*)
    ) INTO user_data
  FROM user_profile p
  LEFT JOIN user_settings s ON p.id = s.id
  LEFT JOIN user_roles r ON true
  LEFT JOIN user_consents c ON true
  LEFT JOIN user_sessions_data sess ON true;
  
  -- Log the data export
  INSERT INTO user_security_logs (user_id, action, details)
  VALUES (user_uuid, 'data_export', jsonb_build_object('timestamp', now()));
  
  RETURN user_data;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to handle GDPR data deletion request
CREATE OR REPLACE FUNCTION request_data_deletion(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  -- Check if the requesting user is the same as the target user
  IF auth.uid() != user_uuid THEN
    RAISE EXCEPTION 'Unauthorized access to user data';
  END IF;
  
  -- Mark the account for deletion
  UPDATE profiles 
  SET 
    data_deletion_requested = true,
    data_deletion_requested_at = now()
  WHERE id = user_uuid;
  
  -- Log the deletion request
  INSERT INTO user_security_logs (user_id, action, details)
  VALUES (user_uuid, 'data_deletion_requested', jsonb_build_object('timestamp', now()));
  
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to execute data deletion (admin only)
CREATE OR REPLACE FUNCTION execute_data_deletion(user_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
  is_admin BOOLEAN;
BEGIN
  -- Check if the requesting user is an admin
  SELECT EXISTS (
    SELECT 1 FROM user_role_assignments ura
    JOIN user_roles ur ON ura.role_id = ur.id
    WHERE ura.user_id = auth.uid() 
    AND ur.name = 'admin' 
    AND ura.is_active = true
  ) INTO is_admin;
  
  IF NOT is_admin THEN
    RAISE EXCEPTION 'Only administrators can execute data deletion';
  END IF;
  
  -- Check if deletion was requested
  IF NOT EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = user_uuid AND data_deletion_requested = true
  ) THEN
    RAISE EXCEPTION 'No data deletion request found for this user';
  END IF;
  
  -- Anonymize user data instead of deleting (GDPR compliant)
  UPDATE profiles 
  SET 
    email = 'deleted_' || id || '@example.com',
    full_name = 'Deleted User',
    avatar_url = NULL,
    data_retention_policy = 'deleted',
    wishlist = '[]'::jsonb,
    reviews = '[]'::jsonb,
    updated_at = now()
  WHERE id = user_uuid;
  
  -- Deactivate all roles
  UPDATE user_role_assignments
  SET is_active = false
  WHERE user_id = user_uuid;
  
  -- Log the deletion execution
  INSERT INTO user_security_logs (user_id, action, details)
  VALUES (user_uuid, 'data_deletion_executed', jsonb_build_object(
    'executed_by', auth.uid(),
    'timestamp', now()
  ));
  
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_is_active ON user_sessions(is_active);
CREATE INDEX IF NOT EXISTS idx_user_consent_logs_user_id ON user_consent_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_user_security_logs_user_id ON user_security_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_user_security_logs_action ON user_security_logs(action);
CREATE INDEX IF NOT EXISTS idx_profiles_account_locked ON profiles(account_locked);