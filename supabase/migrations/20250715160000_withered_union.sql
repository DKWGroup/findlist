/*
  # Fix get_user_wishlist function

  1. Function Updates
    - Fix malformed array literal error by ensuring proper JSON array return
    - Handle null/empty wishlist cases properly
    - Return valid JSON array even when wishlist is empty

  2. Changes
    - Modify get_user_wishlist function to return proper JSON array
    - Add proper null handling and empty array fallback
    - Ensure consistent return type
*/

-- Drop existing function if it exists
DROP FUNCTION IF EXISTS get_user_wishlist(uuid);

-- Create improved get_user_wishlist function
CREATE OR REPLACE FUNCTION get_user_wishlist(user_uuid uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    user_wishlist jsonb;
    result jsonb := '[]'::jsonb;
BEGIN
    -- Get user's wishlist from profiles table
    SELECT COALESCE(wishlist, '[]'::jsonb) INTO user_wishlist
    FROM profiles 
    WHERE id = user_uuid;
    
    -- If no user found or wishlist is null, return empty array
    IF user_wishlist IS NULL THEN
        RETURN '[]'::jsonb;
    END IF;
    
    -- If wishlist is empty array, return it directly
    IF jsonb_array_length(user_wishlist) = 0 THEN
        RETURN '[]'::jsonb;
    END IF;
    
    -- Build result with product details
    SELECT COALESCE(
        jsonb_agg(
            jsonb_build_object(
                'id', p.id,
                'title', p.title,
                'description', p.description,
                'images', COALESCE(
                    (SELECT jsonb_agg(pi.url ORDER BY pi.position)
                     FROM product_images pi 
                     WHERE pi.product_id = p.id), 
                    '[]'::jsonb
                ),
                'price', jsonb_build_object(
                    'original', p.price_original,
                    'discounted', p.price_discounted,
                    'currency', p.price_currency
                ),
                'is_verified', p.is_verified,
                'is_trending', p.is_trending,
                'created_at', p.created_at
            )
        ),
        '[]'::jsonb
    ) INTO result
    FROM products p
    WHERE p.id::text = ANY(
        SELECT jsonb_array_elements_text(user_wishlist)
    );
    
    RETURN COALESCE(result, '[]'::jsonb);
END;
$$;