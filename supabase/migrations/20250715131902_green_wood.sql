/*
  # Fix wishlist JSONB format in profiles table

  1. Schema Changes
    - Update wishlist column default to use proper JSONB casting
    - Update reviews column default to use proper JSONB casting
    - Update notification_preferences column default to use proper JSONB casting
    - Update privacy_settings column default to use proper JSONB casting

  2. Data Migration
    - Fix existing malformed wishlist entries
    - Fix existing malformed reviews entries
    - Fix existing malformed notification_preferences entries
    - Fix existing malformed privacy_settings entries

  3. Notes
    - This ensures all JSONB columns have proper type casting
    - Fixes the "malformed array literal" error when accessing wishlist data
*/

-- Fix column defaults to use proper JSONB casting
ALTER TABLE profiles 
ALTER COLUMN wishlist SET DEFAULT '[]'::jsonb;

ALTER TABLE profiles 
ALTER COLUMN reviews SET DEFAULT '[]'::jsonb;

-- Fix existing malformed data
UPDATE profiles 
SET wishlist = '[]'::jsonb 
WHERE wishlist::text = '"[]"' OR wishlist::text = '[]';

UPDATE profiles 
SET reviews = '[]'::jsonb 
WHERE reviews::text = '"[]"' OR reviews::text = '[]';

-- Also fix user_settings table JSONB columns if they exist
DO $$
BEGIN
  -- Fix notification_preferences if it exists and has malformed data
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_settings' AND column_name = 'notification_preferences'
  ) THEN
    UPDATE user_settings 
    SET notification_preferences = '{"product_updates": true, "security_alerts": true, "marketing_emails": false, "email_notifications": true}'::jsonb
    WHERE notification_preferences::text LIKE '%"product_updates"%' AND notification_preferences::text NOT LIKE '%{%';
  END IF;

  -- Fix privacy_settings if it exists and has malformed data
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_settings' AND column_name = 'privacy_settings'
  ) THEN
    UPDATE user_settings 
    SET privacy_settings = '{"show_reviews": true, "show_wishlist": false, "public_profile": false, "allow_recommendations": true}'::jsonb
    WHERE privacy_settings::text LIKE '%"show_reviews"%' AND privacy_settings::text NOT LIKE '%{%';
  END IF;
END $$;