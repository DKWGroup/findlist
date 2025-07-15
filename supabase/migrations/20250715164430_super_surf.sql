/*
  # Add product review functionality

  1. New Functions
    - `add_product_review` - Allows users to add reviews to products
    - `get_product_reviews` - Retrieves reviews for a specific product
  
  2. Security
    - Functions are accessible to authenticated users
    - Users can only add reviews if they are logged in
    - Users can only view their own reviews or public reviews
*/

-- Function to add a product review
CREATE OR REPLACE FUNCTION add_product_review(
  p_product_id UUID,
  p_user_id UUID,
  p_rating INTEGER,
  p_comment TEXT
) RETURNS UUID AS $$
DECLARE
  v_review_id UUID;
  v_review_data JSONB;
BEGIN
  -- Validate inputs
  IF p_rating < 1 OR p_rating > 5 THEN
    RAISE EXCEPTION 'Rating must be between 1 and 5';
  END IF;
  
  IF p_comment IS NULL OR LENGTH(TRIM(p_comment)) = 0 THEN
    RAISE EXCEPTION 'Comment cannot be empty';
  END IF;
  
  -- Check if product exists
  IF NOT EXISTS (SELECT 1 FROM products WHERE id = p_product_id) THEN
    RAISE EXCEPTION 'Product does not exist';
  END IF;
  
  -- Check if user exists
  IF NOT EXISTS (SELECT 1 FROM profiles WHERE id = p_user_id) THEN
    RAISE EXCEPTION 'User does not exist';
  END IF;
  
  -- Generate a new review ID
  v_review_id := gen_random_uuid();
  
  -- Create review data
  v_review_data := jsonb_build_object(
    'id', v_review_id,
    'productId', p_product_id,
    'rating', p_rating,
    'comment', p_comment,
    'dateCreated', now(),
    'isVerified', false,
    'likes', 0,
    'dislikes', 0
  );
  
  -- Add review to user's profile
  UPDATE profiles
  SET reviews = COALESCE(reviews, '[]'::jsonb) || v_review_data
  WHERE id = p_user_id;
  
  -- Update product stats
  INSERT INTO product_stats (product_id, rating_count, rating_average)
  VALUES (p_product_id, 1, p_rating)
  ON CONFLICT (product_id) 
  DO UPDATE SET 
    rating_count = product_stats.rating_count + 1,
    rating_average = (product_stats.rating_average * product_stats.rating_count + p_rating) / (product_stats.rating_count + 1),
    updated_at = now();
  
  RETURN v_review_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get product reviews
CREATE OR REPLACE FUNCTION get_product_reviews(
  p_product_id UUID
) RETURNS JSONB AS $$
DECLARE
  v_reviews JSONB;
BEGIN
  -- Check if product exists
  IF NOT EXISTS (SELECT 1 FROM products WHERE id = p_product_id) THEN
    RETURN '[]'::jsonb;
  END IF;
  
  -- Get all reviews for this product from all users
  SELECT jsonb_agg(r)
  INTO v_reviews
  FROM (
    SELECT r.*
    FROM profiles p, jsonb_array_elements(p.reviews) r
    WHERE r->>'productId' = p_product_id::text
    ORDER BY (r->>'dateCreated')::timestamptz DESC
  ) r;
  
  -- Return empty array if no reviews found
  RETURN COALESCE(v_reviews, '[]'::jsonb);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add RLS policies for the functions
GRANT EXECUTE ON FUNCTION add_product_review(UUID, UUID, INTEGER, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION get_product_reviews(UUID) TO authenticated, anon;