-- Fix/refresh RLS policies and trigger for public.profiles table
-- Run this script in the Supabase SQL Editor (SQL -> New query)
-- It is idempotent: you can rerun it safely when debugging profile creation issues.

BEGIN;

-- 1. Ensure RLS is enabled and enforced
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles FORCE ROW LEVEL SECURITY;

-- 2. Drop old policies to avoid duplicates/conflicts
DROP POLICY IF EXISTS "Users can insert own profile during registration" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Service role can do anything" ON public.profiles;

-- 3. Re-create clean policies
-- Authenticated users may insert exactly their own profile (used by trigger fallback scenarios)
CREATE POLICY "Users can insert own profile during registration"
    ON public.profiles
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = id);

-- Authenticated users can read only their own profile
CREATE POLICY "Users can view own profile"
    ON public.profiles
    FOR SELECT
    TO authenticated
    USING (auth.uid() = id);

-- Authenticated users can update only their own profile
CREATE POLICY "Users can update own profile"
    ON public.profiles
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- service_role (Edge Functions / backend) can do anything without restriction
CREATE POLICY "Service role can do anything"
    ON public.profiles
    FOR ALL
    TO service_role
    USING (TRUE)
    WITH CHECK (TRUE);

-- 4. Drop and recreate the trigger + function that copies auth.users -> public.profiles
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_full_name text;
BEGIN
    v_full_name := COALESCE(
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'name',
        ''
    );

    INSERT INTO public.profiles (
        id,
        email,
        full_name,
        created_at,
        updated_at,
        wishlist,
        reviews,
        liked_products,
        failed_login_attempts,
        account_locked,
        data_deletion_requested,
        password_reset_required
    )
    VALUES (
        NEW.id,
        NEW.email,
        v_full_name,
        NOW(),
        NOW(),
        '[]'::jsonb,
        '[]'::jsonb,
        '[]'::jsonb,
        0,
        FALSE,
        FALSE,
        FALSE
    )
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        full_name = COALESCE(NULLIF(EXCLUDED.full_name, ''), public.profiles.full_name),
        updated_at = NOW();

    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        RAISE WARNING 'Error in handle_new_user(): %', SQLERRM;
        RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

COMMIT;

-- 5. Verification queries (run separately after the transaction if you want to inspect results)
-- Shows that RLS is enabled and how many policies exist
SELECT 'profiles row count' AS check_type, COUNT(*) AS value FROM public.profiles
UNION ALL
SELECT 'rls enabled', CASE WHEN relrowsecurity THEN 1 ELSE 0 END
FROM pg_class WHERE relname = 'profiles' AND relnamespace = 'public'::regnamespace
UNION ALL
SELECT 'policies count', COUNT(*)
FROM pg_policies WHERE schemaname = 'public' AND tablename = 'profiles';

-- List policies for manual inspection
SELECT schemaname, tablename, policyname, roles, cmd, qual, with_check
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'profiles'
ORDER BY policyname;
