/*
  # Fix add_product_review function

  1. Function Updates
    - Fix ambiguous column reference for product_id
    - Use proper parameter naming and table aliases
    - Ensure clear column references throughout function

  2. Changes
    - Rename parameters to avoid ambiguity (p_product_id, p_rating, p_comment)
    - Use explicit table aliases in queries
    - Add proper error handling and validation
*/

-- Drop existing function if it exists
DROP FUNCTION IF EXISTS add_product_review(uuid, integer, text);
DROP FUNCTION IF EXISTS add_product_review(uuid, uuid, integer, text);

-- Create improved add_product_review function
CREATE OR REPLACE FUNCTION add_product_review(
    p_product_id uuid,
    p_user_id uuid,
    p_rating integer,
    p_comment text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    review_id uuid;
    user_profile profiles%ROWTYPE;
    existing_reviews jsonb;
    new_review jsonb;
    updated_reviews jsonb;
BEGIN
    -- Validate inputs
    IF p_rating < 1 OR p_rating > 5 THEN
        RAISE EXCEPTION 'Rating must be between 1 and 5';
    END IF;
    
    IF LENGTH(TRIM(p_comment)) < 10 THEN
        RAISE EXCEPTION 'Comment must be at least 10 characters long';
    END IF;
    
    -- Check if product exists
    IF NOT EXISTS (SELECT 1 FROM products prod WHERE prod.id = p_product_id) THEN
        RAISE EXCEPTION 'Product not found';
    END IF;
    
    -- Get user profile
    SELECT prof.* INTO user_profile
    FROM profiles prof
    WHERE prof.id = p_user_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'User profile not found';
    END IF;
    
    -- Get existing reviews
    SELECT COALESCE(prof.reviews, '[]'::jsonb) INTO existing_reviews
    FROM profiles prof
    WHERE prof.id = p_user_id;
    
    -- Check if user already reviewed this product
    IF EXISTS (
        SELECT 1 
        FROM jsonb_array_elements(existing_reviews) AS review_elem
        WHERE (review_elem->>'productId')::uuid = p_product_id
    ) THEN
        RAISE EXCEPTION 'User has already reviewed this product';
    END IF;
    
    -- Generate new review ID
    review_id := gen_random_uuid();
    
    -- Create new review object
    new_review := jsonb_build_object(
        'id', review_id,
        'productId', p_product_id,
        'userId', p_user_id,
        'userName', COALESCE(user_profile.full_name, SPLIT_PART(user_profile.email, '@', 1)),
        'userAvatar', user_profile.avatar_url,
        'rating', p_rating,
        'comment', TRIM(p_comment),
        'dateCreated', NOW(),
        'isVerified', CASE 
            WHEN EXISTS (
                SELECT 1 FROM user_role_assignments ura
                JOIN user_roles ur ON ura.role_id = ur.id
                WHERE ura.user_id = p_user_id 
                AND ur.name = 'admin' 
                AND ura.is_active = true
            ) THEN true 
            ELSE false 
        END,
        'likes', 0,
        'dislikes', 0
    );
    
    -- Add new review to existing reviews
    updated_reviews := existing_reviews || jsonb_build_array(new_review);
    
    -- Update user's reviews in profile
    UPDATE profiles prof
    SET 
        reviews = updated_reviews,
        updated_at = NOW()
    WHERE prof.id = p_user_id;
    
    -- Log the review action
    INSERT INTO user_security_logs (user_id, action, details)
    VALUES (
        p_user_id,
        'review_added',
        jsonb_build_object(
            'product_id', p_product_id,
            'rating', p_rating,
            'review_id', review_id
        )
    );
    
    RETURN new_review;
END;
$$;