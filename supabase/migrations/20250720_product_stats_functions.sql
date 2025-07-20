-- Add liked_products column to profiles if it doesn't exist
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS liked_products jsonb DEFAULT '[]'::jsonb;

-- Create function to get product statistics
CREATE OR REPLACE FUNCTION get_product_stats(p_product_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_stats jsonb;
  v_review_count integer;
  v_avg_rating numeric;
BEGIN
  -- Get basic stats from product_stats table
  SELECT jsonb_build_object(
    'views', COALESCE(views, 0),
    'likes', COALESCE(likes, 0),
    'shares', COALESCE(shares, 0),
    'rating_average', COALESCE(rating_average, 0),
    'rating_count', COALESCE(rating_count, 0)
  ) INTO v_stats
  FROM product_stats
  WHERE product_id = p_product_id;
  
  -- If no stats found, calculate from reviews and return defaults
  IF v_stats IS NULL THEN
    -- Calculate rating from user reviews
    SELECT 
      COUNT(*) as review_count,
      COALESCE(AVG((review_data->>'rating')::integer), 0) as avg_rating
    INTO v_review_count, v_avg_rating
    FROM (
      SELECT jsonb_array_elements(COALESCE(reviews, '[]'::jsonb)) as review_data
      FROM profiles
      WHERE reviews IS NOT NULL
    ) as all_reviews
    WHERE (review_data->>'productId')::uuid = p_product_id;
    
    v_stats := jsonb_build_object(
      'views', 0,
      'likes', 0,
      'shares', 0,
      'rating_average', COALESCE(v_avg_rating, 0),
      'rating_count', COALESCE(v_review_count, 0)
    );
  END IF;
  
  RETURN v_stats;
END;
$$;

-- Create function to increment product views
CREATE OR REPLACE FUNCTION increment_product_views(p_product_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO product_stats (product_id, views, updated_at)
  VALUES (p_product_id, 1, now())
  ON CONFLICT (product_id) 
  DO UPDATE SET 
    views = product_stats.views + 1,
    updated_at = now();
    
  RETURN true;
EXCEPTION
  WHEN OTHERS THEN
    RETURN false;
END;
$$;

-- Create function to toggle product like
CREATE OR REPLACE FUNCTION toggle_product_like(p_product_id uuid, p_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_likes jsonb;
  v_has_liked boolean;
  v_increment integer;
BEGIN
  -- Get user's liked products
  SELECT COALESCE(liked_products, '[]'::jsonb) INTO v_user_likes
  FROM profiles
  WHERE id = p_user_id;
  
  -- Check if user already liked this product
  SELECT (v_user_likes ? p_product_id::text) INTO v_has_liked;
  
  IF v_has_liked THEN
    -- Remove like
    v_user_likes := v_user_likes - p_product_id::text;
    v_increment := -1;
  ELSE
    -- Add like
    v_user_likes := v_user_likes || jsonb_build_array(p_product_id);
    v_increment := 1;
  END IF;
  
  -- Update user's liked products
  UPDATE profiles 
  SET liked_products = v_user_likes
  WHERE id = p_user_id;
  
  -- Update product stats
  INSERT INTO product_stats (product_id, likes, updated_at)
  VALUES (p_product_id, GREATEST(v_increment, 0), now())
  ON CONFLICT (product_id) 
  DO UPDATE SET 
    likes = GREATEST(product_stats.likes + v_increment, 0),
    updated_at = now();
    
  RETURN NOT v_has_liked; -- Return new like status
END;
$$;
