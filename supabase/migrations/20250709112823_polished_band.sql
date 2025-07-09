/*
  # Fix user registration error

  1. Changes
    - Update the `handle_new_user` function to properly handle user metadata
    - Fix profile creation to match the expected schema
    - Add error handling to prevent registration failures

  2. Security
    - No changes to security policies
*/

-- Update the handle_new_user function to properly handle user metadata
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_role_id UUID;
  user_name TEXT;
BEGIN
  -- Get user name from metadata
  user_name := COALESCE(
    NEW.raw_user_meta_data->>'name',
    NEW.raw_user_meta_data->>'full_name',
    'User ' || substr(NEW.id::text, 1, 8)
  );
  
  -- Find 'user' role
  SELECT id INTO user_role_id FROM user_roles WHERE name = 'user' AND is_active = true;
  
  -- Create profile with correct column names
  INSERT INTO profiles (
    id, 
    email, 
    full_name,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id, 
    NEW.email, 
    user_name,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = NEW.email,
    updated_at = NOW();
  
  -- Assign default 'user' role if it exists
  IF user_role_id IS NOT NULL THEN
    -- Check if role assignment already exists
    IF NOT EXISTS (
      SELECT 1 FROM user_role_assignments 
      WHERE user_id = NEW.id AND role_id = user_role_id
    ) THEN
      INSERT INTO user_role_assignments (user_id, role_id, assigned_at, is_active)
      VALUES (NEW.id, user_role_id, NOW(), true);
      
      -- Update primary role in profile
      UPDATE profiles 
      SET 
        primary_role_id = user_role_id, 
        role_updated_at = NOW()
      WHERE id = NEW.id;
    END IF;
  END IF;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't prevent user creation
    RAISE WARNING 'Error in handle_new_user function: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Make sure the trigger is properly set
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();