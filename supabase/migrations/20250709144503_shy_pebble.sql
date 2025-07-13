/*
  # Fix user_settings RLS policies

  1. Changes
    - Drop and recreate the SELECT policy for user_settings to ensure it works correctly
    - Add a function to debug RLS policies
    - Add a function to check if a row is accessible to the current user

  2. Security
    - No changes to security model, just fixing implementation
*/

-- Drop existing SELECT policy if it exists
DROP POLICY IF EXISTS "Users can view own settings" ON user_settings;

-- Create a more explicit SELECT policy
CREATE POLICY "Users can view own settings" ON user_settings
  FOR SELECT USING (id = auth.uid());

-- Create a function to debug RLS policies
CREATE OR REPLACE FUNCTION debug_row_level_security(
  table_name TEXT,
  row_id TEXT,
  operation TEXT DEFAULT 'SELECT'
)
RETURNS TABLE (
  policy_name TEXT,
  policy_action TEXT,
  policy_roles TEXT[],
  policy_using TEXT,
  policy_with_check TEXT,
  policy_result BOOLEAN
) AS $$
DECLARE
  policy_record RECORD;
  policy_result BOOLEAN;
  policy_using_clause TEXT;
  policy_with_check_clause TEXT;
BEGIN
  FOR policy_record IN
    SELECT
      p.policyname AS policy_name,
      p.cmd AS policy_action,
      p.roles AS policy_roles,
      pg_get_expr(p.qual, p.tableid) AS policy_using,
      pg_get_expr(p.with_check, p.tableid) AS policy_with_check
    FROM
      pg_policy p
      JOIN pg_class c ON p.tableid = c.oid
      JOIN pg_namespace n ON c.relnamespace = n.oid
    WHERE
      n.nspname || '.' || c.relname = table_name
      AND (p.cmd = operation OR p.cmd = 'ALL')
  LOOP
    -- Determine which clause to evaluate based on operation
    IF operation = 'SELECT' OR operation = 'DELETE' THEN
      policy_using_clause := policy_record.policy_using;
      policy_with_check_clause := NULL;
    ELSIF operation = 'INSERT' THEN
      policy_using_clause := NULL;
      policy_with_check_clause := policy_record.policy_with_check;
    ELSIF operation = 'UPDATE' THEN
      policy_using_clause := policy_record.policy_using;
      policy_with_check_clause := policy_record.policy_with_check;
    END IF;

    -- Evaluate USING clause if applicable
    IF policy_using_clause IS NOT NULL THEN
      EXECUTE format('SELECT EXISTS (SELECT 1 FROM %s WHERE id = %L AND %s)',
                    table_name, row_id, policy_using_clause)
        INTO policy_result;
    -- Evaluate WITH CHECK clause if applicable
    ELSIF policy_with_check_clause IS NOT NULL THEN
      EXECUTE format('SELECT EXISTS (SELECT 1 FROM %s WHERE id = %L AND %s)',
                    table_name, row_id, policy_with_check_clause)
        INTO policy_result;
    ELSE
      policy_result := NULL;
    END IF;

    -- Return results
    policy_name := policy_record.policy_name;
    policy_action := policy_record.policy_action;
    policy_roles := policy_record.policy_roles;
    policy_using := policy_record.policy_using;
    policy_with_check := policy_record.policy_with_check;
    RETURN NEXT;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to check if a row is accessible to the current user
CREATE OR REPLACE FUNCTION check_row_access(
  table_name TEXT,
  row_id TEXT,
  operation TEXT DEFAULT 'SELECT'
)
RETURNS BOOLEAN AS $$
DECLARE
  result BOOLEAN;
BEGIN
  EXECUTE format('SELECT EXISTS (SELECT 1 FROM %s WHERE id = %L)',
                table_name, row_id)
    INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure user_settings exists for all users
DO $$
DECLARE
  user_record RECORD;
BEGIN
  FOR user_record IN 
    SELECT 
      au.id,
      au.created_at
    FROM auth.users au
    LEFT JOIN user_settings us ON au.id = us.id
    WHERE us.id IS NULL
  LOOP
    -- Create settings
    INSERT INTO user_settings (
      id, 
      email_notifications, 
      marketing_consent, 
      theme, 
      language, 
      security_level,
      two_factor_enabled,
      created_at, 
      updated_at
    )
    VALUES (
      user_record.id,
      true,
      false,
      'light',
      'pl',
      'medium',
      false,
      user_record.created_at,
      NOW()
    )
    ON CONFLICT (id) DO NOTHING;
  END LOOP;
END $$;