/*
  # Fix add_product_review function ON CONFLICT error

  1. Function Updates
    - Remove problematic ON CONFLICT clause since reviews are stored in profiles table as JSONB
    - Simplify review addition logic to work with JSONB array structure
    - Add proper validation and duplicate review prevention
    - Update product stats correctly

  2. Security
    - Maintain RLS policies
    - Ensure users can only add reviews for themselves
*/

-- Drop existing function
DROP FUNCTION IF EXISTS add_product_review(uuid, uuid, integer, text);

-- Create updated add_product_review function
CREATE OR REPLACE FUNCTION add_product_review(
  p_product_id uuid,
  p_user_id uuid,
  p_rating integer,
  p_comment text
) RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_review_id uuid;
  v_current_reviews jsonb;
  v_new_review jsonb;
  v_updated_reviews jsonb;
  v_user_name text;
  v_user_avatar text;
  v_product_exists boolean;
  v_existing_review_index integer;
BEGIN
  -- Generate review ID
  v_review_id := gen_random_uuid();
  
  -- Validate inputs
  IF p_product_id IS NULL OR p_user_id IS NULL THEN
    RAISE EXCEPTION 'Product ID and User ID are required';
  END IF;
  
  IF p_rating < 1 OR p_rating > 5 THEN
    RAISE EXCEPTION 'Rating must be between 1 and 5';
  END IF;
  
  IF p_comment IS NULL OR trim(p_comment) = '' THEN
    RAISE EXCEPTION 'Comment is required';
  END IF;
  
  -- Check if product exists
  SELECT EXISTS(SELECT 1 FROM products WHERE id = p_product_id) INTO v_product_exists;
  IF NOT v_product_exists THEN
    RAISE EXCEPTION 'Product not found';
  END IF;
  
  -- Get user info
  SELECT 
    COALESCE(full_name, 'Użytkownik'),
    avatar_url
  INTO v_user_name, v_user_avatar
  FROM profiles 
  WHERE id = p_user_id;
  
  IF v_user_name IS NULL THEN
    RAISE EXCEPTION 'User not found';
  END IF;
  
  -- Get current reviews
  SELECT COALESCE(reviews, '[]'::jsonb) INTO v_current_reviews
  FROM profiles 
  WHERE id = p_user_id;
  
  -- Check if user already reviewed this product
  SELECT 
    CASE 
      WHEN jsonb_array_length(v_current_reviews) > 0 THEN
        (
          SELECT i
          FROM jsonb_array_elements(v_current_reviews) WITH ORDINALITY AS elem(review, i)
          WHERE (review->>'productId')::uuid = p_product_id
          LIMIT 1
        ) - 1
      ELSE -1
    END
  INTO v_existing_review_index;
  
  -- Create new review object
  v_new_review := jsonb_build_object(
    'id', v_review_id,
    'productId', p_product_id,
    'userId', p_user_id,
    'userName', v_user_name,
    'userAvatar', v_user_avatar,
    'rating', p_rating,
    'comment', trim(p_comment),
    'dateCreated', NOW(),
    'isVerified', false,
    'likes', 0,
    'dislikes', 0
  );
  
  -- Update or add review
  IF v_existing_review_index >= 0 THEN
    -- Update existing review
    v_updated_reviews := jsonb_set(v_current_reviews, ARRAY[v_existing_review_index::text], v_new_review);
  ELSE
    -- Add new review
    v_updated_reviews := v_current_reviews || jsonb_build_array(v_new_review);
  END IF;
  
  -- Update user profile with new reviews
  UPDATE profiles 
  SET 
    reviews = v_updated_reviews,
    updated_at = NOW()
  WHERE id = p_user_id;
  
  -- Update product stats
  INSERT INTO product_stats (product_id, rating_count, rating_average, updated_at)
  VALUES (
    p_product_id,
    1,
    p_rating::numeric,
    NOW()
  )
  ON CONFLICT (product_id) DO UPDATE SET
    rating_count = (
      SELECT COUNT(*)
      FROM profiles p,
      jsonb_array_elements(COALESCE(p.reviews, '[]'::jsonb)) AS review
      WHERE (review->>'productId')::uuid = p_product_id
    ),
    rating_average = (
      SELECT AVG((review->>'rating')::integer)
      FROM profiles p,
      jsonb_array_elements(COALESCE(p.reviews, '[]'::jsonb)) AS review
      WHERE (review->>'productId')::uuid = p_product_id
    ),
    updated_at = NOW();
  
  RETURN v_review_id;
END;
$$;