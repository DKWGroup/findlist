-- Add missing INSERT policy for profiles table to fix user profile creation issues

-- Add INSERT policy for profiles table
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Grant necessary permissions to authenticated users
GRANT INSERT, UPDATE, SELECT ON profiles TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;
