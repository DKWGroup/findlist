/*
  # Add INSERT policy for user_settings table

  1. Changes
    - Add a new RLS policy that allows users to insert their own settings
    - This fixes the error when trying to login where user settings couldn't be created

  2. Security
    - The policy ensures users can only insert settings for their own user ID
    - Maintains the existing security model while fixing the functionality
*/

-- Add INSERT policy for user_settings table
CREATE POLICY "Users can insert own settings" ON user_settings
  FOR INSERT WITH CHECK (auth.uid() = id);