/*
  # Fix Authentication and RLS Policy Issues
  
  1. Changes
    - Create helper functions for role checking without recursion
    - Fix RLS policies on user_role_assignments table
    - Ensure profiles exist for all users
    - Set up proper admin access
    
  2. Security
    - Prevent infinite recursion in policies
    - Maintain proper access controls
*/

-- Create helper functions for role checking that don't cause recursion
CREATE OR REPLACE FUNCTION user_has_role_simple(user_uuid UUID, role_name TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM user_role_assignments ura
    JOIN user_roles ur ON ura.role_id = ur.id
    WHERE ura.user_id = user_uuid 
      AND ur.name = role_name 
      AND ura.is_active = true
      AND ur.is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_admin(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN user_has_role_simple(user_uuid, 'admin');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fix RLS policies to prevent infinite recursion
-- Drop existing problematic policies
DROP POLICY IF EXISTS "Users can view own role assignments" ON user_role_assignments;
DROP POLICY IF EXISTS "Admins can view all role assignments" ON user_role_assignments;
DROP POLICY IF EXISTS "Only admins can manage role assignments" ON user_role_assignments;
DROP POLICY IF EXISTS "Only admins can update role assignments" ON user_role_assignments;

-- Create simplified policies that don't cause recursion
CREATE POLICY "Users can view own role assignments"
  ON user_role_assignments
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all role assignments"
  ON user_role_assignments
  FOR SELECT
  USING (is_admin(auth.uid()));

CREATE POLICY "Admins can insert role assignments"
  ON user_role_assignments
  FOR INSERT
  WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can update role assignments"
  ON user_role_assignments
  FOR UPDATE
  USING (is_admin(auth.uid()));

CREATE POLICY "Admins can delete role assignments"
  ON user_role_assignments
  FOR DELETE
  USING (is_admin(auth.uid()));

-- Ensure user_roles policies are simple and don't cause recursion
DROP POLICY IF EXISTS "Anyone can view active roles" ON user_roles;
DROP POLICY IF EXISTS "Only admins can manage roles" ON user_roles;

CREATE POLICY "Anyone can view active roles"
  ON user_roles
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage roles"
  ON user_roles
  FOR ALL
  USING (is_admin(auth.uid()));

-- Ensure profiles policies are correct
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

CREATE POLICY "Users can view own profile"
  ON profiles
  FOR SELECT
  USING (id = auth.uid());

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  USING (id = auth.uid());

-- Fix the handle_new_user function
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_role_id UUID;
  v_full_name TEXT;
BEGIN
  -- Extract full_name from raw_user_meta_data, fallback to email part
  v_full_name := COALESCE(
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'name',
    SPLIT_PART(NEW.email, '@', 1)
  );

  -- Insert into profiles table
  INSERT INTO profiles (id, email, full_name, created_at, updated_at)
  VALUES (
    NEW.id, 
    NEW.email, 
    v_full_name,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    updated_at = NOW();

  -- Insert into user_settings table
  INSERT INTO user_settings (id, created_at, updated_at)
  VALUES (NEW.id, NOW(), NOW())
  ON CONFLICT (id) DO NOTHING;

  -- Find user role
  SELECT id INTO user_role_id FROM user_roles WHERE name = 'user' AND is_active = true;
  
  -- Assign user role
  IF user_role_id IS NOT NULL THEN
    INSERT INTO user_role_assignments (user_id, role_id, assigned_at, is_active)
    VALUES (NEW.id, user_role_id, NOW(), true)
    ON CONFLICT (user_id, role_id) DO NOTHING;
  END IF;

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't prevent user creation
    RAISE WARNING 'Error in handle_new_user function: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure the trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Create missing profiles for existing users
DO $$
DECLARE
  user_record RECORD;
  admin_role_id UUID;
  first_user_id UUID;
BEGIN
  -- Get admin role ID
  SELECT id INTO admin_role_id FROM user_roles WHERE name = 'admin' AND is_active = true;
  
  -- Find first user
  SELECT id INTO first_user_id FROM auth.users ORDER BY created_at LIMIT 1;
  
  -- Process each user
  FOR user_record IN 
    SELECT 
      au.id,
      au.email,
      au.raw_user_meta_data->>'name' as name,
      au.raw_user_meta_data->>'full_name' as full_name,
      au.created_at
    FROM auth.users au
    LEFT JOIN profiles p ON au.id = p.id
    WHERE p.id IS NULL
  LOOP
    -- Create profile
    INSERT INTO profiles (
      id, 
      email, 
      full_name, 
      created_at, 
      updated_at
    )
    VALUES (
      user_record.id,
      user_record.email,
      COALESCE(user_record.name, user_record.full_name, 'User'),
      user_record.created_at,
      NOW()
    )
    ON CONFLICT (id) DO NOTHING;
    
    -- Create settings
    INSERT INTO user_settings (id, created_at, updated_at)
    VALUES (user_record.id, user_record.created_at, NOW())
    ON CONFLICT (id) DO NOTHING;
    
    -- If this is the first user and admin role exists, make them admin
    IF user_record.id = first_user_id AND admin_role_id IS NOT NULL THEN
      INSERT INTO user_role_assignments (user_id, role_id, assigned_at, is_active)
      VALUES (user_record.id, admin_role_id, NOW(), true)
      ON CONFLICT (user_id, role_id) DO UPDATE SET is_active = true;
    END IF;
  END LOOP;
END $$;