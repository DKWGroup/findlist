/*
  # Create admin check function

  1. New Functions
    - `user_has_role_simple` - Checks if a user has a specific role
    - `is_admin` - Checks if the current user is an admin

  2. Security
    - Functions are accessible to all authenticated users
    - Functions only return boolean values for security
*/

-- Function to check if a user has a specific role (simplified version)
CREATE OR REPLACE FUNCTION public.user_has_role_simple(user_uuid UUID, role_name TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM user_role_assignments ura
    JOIN user_roles ur ON ura.role_id = ur.id
    WHERE ura.user_id = user_uuid
    AND ur.name = role_name
    AND ura.is_active = true
    AND (ura.expires_at IS NULL OR ura.expires_at > now())
  );
END;
$$;

-- Function to check if the current user is an admin
CREATE OR REPLACE FUNCTION public.is_admin(user_uuid UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN public.user_has_role_simple(user_uuid, 'admin');
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.user_has_role_simple TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin TO authenticated;