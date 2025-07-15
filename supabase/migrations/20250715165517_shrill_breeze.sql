/*
  # Fix product review functions to work with product_reviews table

  1. Functions
    - `add_product_review` - Add or update product review
    - `get_product_reviews` - Get reviews for a product
    - `get_user_reviews` - Get reviews by a user

  2. Features
    - Proper ON CONFLICT handling with unique constraint
    - Update product stats when reviews are added/updated
    - Return structured review data
*/

-- Drop existing functions if they exist
DROP FUNCTION IF EXISTS add_product_review(uuid, uuid, integer, text);
DROP FUNCTION IF EXISTS add_product_review(p_product_id uuid, p_user_id uuid, p_rating integer, p_comment text);
DROP FUNCTION IF EXISTS get_product_reviews(uuid);
DROP FUNCTION IF EXISTS get_product_reviews(p_product_id uuid);
DROP FUNCTION IF EXISTS get_user_reviews(uuid);

-- Function to add or update a product review
CREATE OR REPLACE FUNCTION add_product_review(
  p_product_id uuid,
  p_user_id uuid,
  p_rating integer,
  p_comment text
) RETURNS uuid AS $$
DECLARE
  v_review_id uuid;
  v_user_name text;
  v_user_avatar text;
  v_is_admin boolean;
BEGIN
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
  IF NOT EXISTS (SELECT 1 FROM products WHERE id = p_product_id) THEN
    RAISE EXCEPTION 'Product not found';
  END IF;

  -- Check if user exists
  IF NOT EXISTS (SELECT 1 FROM users WHERE id = p_user_id) THEN
    RAISE EXCEPTION 'User not found';
  END IF;

  -- Get user info
  SELECT 
    COALESCE(p.full_name, u.email, 'User') as name,
    p.avatar_url,
    EXISTS (
      SELECT 1 FROM user_role_assignments ura
      JOIN user_roles ur ON ura.role_id = ur.id
      WHERE ura.user_id = p_user_id 
      AND ur.name = 'admin' 
      AND ura.is_active = true
    )
  INTO v_user_name, v_user_avatar, v_is_admin
  FROM users u
  LEFT JOIN profiles p ON u.id = p.id
  WHERE u.id = p_user_id;

  -- Insert or update review using ON CONFLICT with the unique constraint
  INSERT INTO product_reviews (product_id, user_id, rating, comment, is_verified)
  VALUES (p_product_id, p_user_id, p_rating, trim(p_comment), v_is_admin)
  ON CONFLICT (product_id, user_id) 
  DO UPDATE SET 
    rating = EXCLUDED.rating,
    comment = EXCLUDED.comment,
    updated_at = now(),
    is_verified = EXCLUDED.is_verified
  RETURNING id INTO v_review_id;

  -- Update product stats
  UPDATE product_stats 
  SET 
    rating_average = (
      SELECT AVG(rating)::numeric(3,2) 
      FROM product_reviews 
      WHERE product_id = p_product_id
    ),
    rating_count = (
      SELECT COUNT(*) 
      FROM product_reviews 
      WHERE product_id = p_product_id
    ),
    updated_at = now()
  WHERE product_id = p_product_id;

  -- If product_stats doesn't exist, create it
  IF NOT FOUND THEN
    INSERT INTO product_stats (product_id, rating_average, rating_count)
    SELECT 
      p_product_id,
      AVG(rating)::numeric(3,2),
      COUNT(*)
    FROM product_reviews 
    WHERE product_id = p_product_id;
  END IF;

  RETURN v_review_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get product reviews
CREATE OR REPLACE FUNCTION get_product_reviews(p_product_id uuid)
RETURNS jsonb AS $$
DECLARE
  v_reviews jsonb;
BEGIN
  IF p_product_id IS NULL THEN
    RETURN '[]'::jsonb;
  END IF;

  SELECT COALESCE(
    jsonb_agg(
      jsonb_build_object(
        'id', pr.id,
        'userId', pr.user_id,
        'userName', COALESCE(p.full_name, u.email, 'User'),
        'userAvatar', p.avatar_url,
        'rating', pr.rating,
        'comment', pr.comment,
        'dateCreated', pr.created_at,
        'isVerified', pr.is_verified,
        'likes', 0,
        'dislikes', 0
      ) ORDER BY pr.created_at DESC
    ),
    '[]'::jsonb
  )
  INTO v_reviews
  FROM product_reviews pr
  JOIN users u ON pr.user_id = u.id
  LEFT JOIN profiles p ON u.id = p.id
  WHERE pr.product_id = p_product_id;

  RETURN v_reviews;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user reviews
CREATE OR REPLACE FUNCTION get_user_reviews(p_user_id uuid)
RETURNS jsonb AS $$
DECLARE
  v_reviews jsonb;
BEGIN
  IF p_user_id IS NULL THEN
    RETURN '[]'::jsonb;
  END IF;

  SELECT COALESCE(
    jsonb_agg(
      jsonb_build_object(
        'id', pr.id,
        'productId', pr.product_id,
        'productTitle', prod.title,
        'rating', pr.rating,
        'comment', pr.comment,
        'dateCreated', pr.created_at,
        'isVerified', pr.is_verified
      ) ORDER BY pr.created_at DESC
    ),
    '[]'::jsonb
  )
  INTO v_reviews
  FROM product_reviews pr
  JOIN products prod ON pr.product_id = prod.id
  WHERE pr.user_id = p_user_id;

  RETURN v_reviews;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;