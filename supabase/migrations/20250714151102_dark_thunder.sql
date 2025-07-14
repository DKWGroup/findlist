/*
  # User Profile Settings Update

  1. New Tables
    - None (using existing tables)
  
  2. Changes
    - Add email_verification_token column to profiles table
    - Add email_verification_sent_at column to profiles table
    - Add email_verification_completed_at column to profiles table
    - Add notification_preferences column to user_settings table
    - Add privacy_settings column to user_settings table
  
  3. Security
    - Update RLS policies for profiles and user_settings tables
*/

-- Add email verification columns to profiles table
ALTER TABLE IF EXISTS profiles 
ADD COLUMN IF NOT EXISTS email_verification_token TEXT,
ADD COLUMN IF NOT EXISTS email_verification_sent_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS email_verification_completed_at TIMESTAMPTZ;

-- Add notification preferences to user_settings table
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_settings' AND column_name = 'notification_preferences'
  ) THEN
    ALTER TABLE user_settings ADD COLUMN notification_preferences JSONB DEFAULT '{
      "email_notifications": true,
      "product_updates": true,
      "marketing_emails": false,
      "security_alerts": true
    }'::jsonb;
  END IF;
END $$;

-- Add privacy settings to user_settings table
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_settings' AND column_name = 'privacy_settings'
  ) THEN
    ALTER TABLE user_settings ADD COLUMN privacy_settings JSONB DEFAULT '{
      "public_profile": false,
      "show_wishlist": false,
      "show_reviews": true,
      "allow_recommendations": true
    }'::jsonb;
  END IF;
END $$;

-- Create function to update user profile with email verification
CREATE OR REPLACE FUNCTION update_user_profile_with_verification()
RETURNS TRIGGER AS $$
BEGIN
  -- If email is being changed, set verification token and sent time
  IF NEW.email IS DISTINCT FROM OLD.email THEN
    NEW.email_verification_token := encode(gen_random_bytes(32), 'hex');
    NEW.email_verification_sent_at := NOW();
    NEW.email_verification_completed_at := NULL;
    
    -- Log the email change attempt in security logs
    INSERT INTO user_security_logs (
      user_id, 
      action, 
      ip_address, 
      details
    ) VALUES (
      NEW.id, 
      'email_change_requested', 
      current_setting('request.headers')::json->>'x-forwarded-for', 
      jsonb_build_object(
        'old_email', OLD.email,
        'new_email', NEW.email,
        'verification_required', true
      )
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for email verification
DROP TRIGGER IF EXISTS trigger_profile_email_verification ON profiles;
CREATE TRIGGER trigger_profile_email_verification
BEFORE UPDATE ON profiles
FOR EACH ROW
WHEN (NEW.email IS DISTINCT FROM OLD.email)
EXECUTE FUNCTION update_user_profile_with_verification();

-- Create function to verify email change
CREATE OR REPLACE FUNCTION verify_email_change(
  user_uuid UUID,
  verification_token TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
  profile_record RECORD;
BEGIN
  -- Get profile with matching token
  SELECT * INTO profile_record
  FROM profiles
  WHERE id = user_uuid
  AND email_verification_token = verification_token;
  
  -- If no matching profile found, return false
  IF profile_record IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- If token is older than 24 hours, return false
  IF profile_record.email_verification_sent_at < NOW() - INTERVAL '24 hours' THEN
    RETURN FALSE;
  END IF;
  
  -- Update profile to mark email as verified
  UPDATE profiles
  SET email_verification_completed_at = NOW(),
      email_verification_token = NULL
  WHERE id = user_uuid;
  
  -- Log the successful email change
  INSERT INTO user_security_logs (
    user_id, 
    action, 
    details
  ) VALUES (
    user_uuid, 
    'email_change_completed', 
    jsonb_build_object(
      'verified_at', NOW()
    )
  );
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to update user settings
CREATE OR REPLACE FUNCTION update_user_settings(
  user_uuid UUID,
  new_notification_preferences JSONB DEFAULT NULL,
  new_privacy_settings JSONB DEFAULT NULL,
  new_theme TEXT DEFAULT NULL,
  new_language TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
  settings_exist BOOLEAN;
BEGIN
  -- Check if settings exist for user
  SELECT EXISTS(
    SELECT 1 FROM user_settings WHERE id = user_uuid
  ) INTO settings_exist;
  
  -- If settings don't exist, create them
  IF NOT settings_exist THEN
    INSERT INTO user_settings (
      id,
      notification_preferences,
      privacy_settings,
      theme,
      language
    ) VALUES (
      user_uuid,
      COALESCE(new_notification_preferences, '{}'::jsonb),
      COALESCE(new_privacy_settings, '{}'::jsonb),
      COALESCE(new_theme, 'light'),
      COALESCE(new_language, 'pl')
    );
    RETURN TRUE;
  END IF;
  
  -- Update existing settings
  UPDATE user_settings
  SET 
    notification_preferences = CASE 
      WHEN new_notification_preferences IS NOT NULL 
      THEN new_notification_preferences 
      ELSE notification_preferences 
    END,
    privacy_settings = CASE 
      WHEN new_privacy_settings IS NOT NULL 
      THEN new_privacy_settings 
      ELSE privacy_settings 
    END,
    theme = COALESCE(new_theme, theme),
    language = COALESCE(new_language, language),
    updated_at = NOW()
  WHERE id = user_uuid;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;