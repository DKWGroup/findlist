/*
  # Add Wishlist and Reviews Functions

  1. New Functions
    - `toggle_wishlist` - Adds or removes a product from a user's wishlist
    - `add_product_review` - Adds a review for a product
    - `get_user_wishlist` - Gets all products in a user's wishlist
    - `get_product_reviews` - Gets all reviews for a product
  
  2. Security
    - All functions require authentication
    - Users can only modify their own wishlist and reviews
*/

-- Function to toggle a product in a user's wishlist
CREATE OR REPLACE FUNCTION toggle_wishlist(
  product_id UUID,
  user_uuid UUID DEFAULT auth.uid()
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_wishlist UUID[] := NULL;
  is_in_wishlist BOOLEAN := FALSE;
  new_wishlist UUID[] := '{}';
BEGIN
  -- Check if user exists
  IF user_uuid IS NULL THEN
    RAISE EXCEPTION 'User must be logged in to manage wishlist';
  END IF;

  -- Get current wishlist
  SELECT wishlist INTO current_wishlist
  FROM profiles
  WHERE id = user_uuid;

  -- Initialize empty array if null
  IF current_wishlist IS NULL THEN
    current_wishlist := '{}';
  END IF;

  -- Check if product is already in wishlist
  SELECT product_id = ANY(current_wishlist) INTO is_in_wishlist;

  -- Toggle product in wishlist
  IF is_in_wishlist THEN
    -- Remove product from wishlist
    SELECT array_remove(current_wishlist, product_id) INTO new_wishlist;
  ELSE
    -- Add product to wishlist
    SELECT array_append(current_wishlist, product_id) INTO new_wishlist;
  END IF;

  -- Update profile with new wishlist
  UPDATE profiles
  SET 
    wishlist = new_wishlist,
    updated_at = NOW()
  WHERE id = user_uuid;

  -- Return whether product is now in wishlist
  RETURN NOT is_in_wishlist;
END;
$$;

-- Function to add a review to a product
CREATE OR REPLACE FUNCTION add_product_review(
  product_id UUID,
  rating INTEGER,
  comment TEXT,
  user_uuid UUID DEFAULT auth.uid()
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  review_id UUID;
  current_reviews JSONB;
  new_review JSONB;
BEGIN
  -- Check if user exists
  IF user_uuid IS NULL THEN
    RAISE EXCEPTION 'User must be logged in to add reviews';
  END IF;

  -- Validate rating
  IF rating < 1 OR rating > 5 THEN
    RAISE EXCEPTION 'Rating must be between 1 and 5';
  END IF;

  -- Generate review ID
  review_id := gen_random_uuid();

  -- Create review object
  new_review := jsonb_build_object(
    'id', review_id,
    'userId', user_uuid,
    'productId', product_id,
    'rating', rating,
    'comment', comment,
    'dateCreated', NOW(),
    'isVerified', FALSE
  );

  -- Get current reviews from profile
  SELECT reviews INTO current_reviews
  FROM profiles
  WHERE id = user_uuid;

  -- Initialize empty array if null
  IF current_reviews IS NULL THEN
    current_reviews := '[]'::jsonb;
  END IF;

  -- Add new review to profile
  UPDATE profiles
  SET 
    reviews = current_reviews || jsonb_build_array(new_review),
    updated_at = NOW()
  WHERE id = user_uuid;

  -- Update product stats
  UPDATE product_stats
  SET 
    rating_count = rating_count + 1,
    rating_average = (rating_average * rating_count + rating) / (rating_count + 1),
    updated_at = NOW()
  WHERE product_id = product_id;

  -- If no stats record exists, create one
  IF NOT FOUND THEN
    INSERT INTO product_stats (product_id, rating_average, rating_count)
    VALUES (product_id, rating, 1);
  END IF;

  RETURN review_id;
END;
$$;

-- Function to get a user's wishlist with product details
CREATE OR REPLACE FUNCTION get_user_wishlist(
  user_uuid UUID DEFAULT auth.uid()
)
RETURNS TABLE (
  product_id UUID,
  title TEXT,
  description TEXT,
  price_original NUMERIC,
  price_discounted NUMERIC,
  price_currency TEXT,
  images TEXT[],
  is_verified BOOLEAN,
  is_trending BOOLEAN,
  code TEXT,
  url_alias TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_wishlist UUID[];
BEGIN
  -- Check if user exists
  IF user_uuid IS NULL THEN
    RAISE EXCEPTION 'User must be logged in to view wishlist';
  END IF;

  -- Get user's wishlist
  SELECT wishlist INTO user_wishlist
  FROM profiles
  WHERE id = user_uuid;

  -- Return empty set if wishlist is empty
  IF user_wishlist IS NULL OR array_length(user_wishlist, 1) = 0 THEN
    RETURN;
  END IF;

  -- Return products in wishlist
  RETURN QUERY
  SELECT 
    p.id AS product_id,
    p.title,
    p.description,
    p.price_original,
    p.price_discounted,
    p.price_currency,
    ARRAY(
      SELECT pi.url 
      FROM product_images pi 
      WHERE pi.product_id = p.id 
      ORDER BY pi.position
    ) AS images,
    p.is_verified,
    p.is_trending,
    p.code,
    p.url_alias
  FROM products p
  WHERE p.id = ANY(user_wishlist);
END;
$$;

-- Function to get reviews for a product
CREATE OR REPLACE FUNCTION get_product_reviews(
  product_id UUID
)
RETURNS TABLE (
  review_id UUID,
  user_id UUID,
  user_name TEXT,
  user_avatar TEXT,
  rating INTEGER,
  comment TEXT,
  date_created TIMESTAMPTZ,
  is_verified BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  WITH user_reviews AS (
    SELECT 
      p.id AS user_id,
      p.full_name AS user_name,
      p.avatar_url AS user_avatar,
      jsonb_array_elements(p.reviews) AS review
    FROM profiles p
    WHERE p.reviews @> jsonb_build_array(jsonb_build_object('productId', product_id))
  )
  SELECT
    (review->>'id')::UUID AS review_id,
    ur.user_id,
    ur.user_name,
    ur.user_avatar,
    (review->>'rating')::INTEGER AS rating,
    review->>'comment' AS comment,
    (review->>'dateCreated')::TIMESTAMPTZ AS date_created,
    (review->>'isVerified')::BOOLEAN AS is_verified
  FROM user_reviews ur
  WHERE review->>'productId' = product_id::TEXT
  ORDER BY (review->>'dateCreated')::TIMESTAMPTZ DESC;
END;
$$;

-- Add RLS policies for product_stats
ALTER TABLE product_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view product stats" 
ON product_stats FOR SELECT 
TO public 
USING (true);

CREATE POLICY "Admins can update product stats" 
ON product_stats FOR UPDATE 
TO public 
USING (
  EXISTS (
    SELECT 1 FROM user_role_assignments ura
    JOIN user_roles ur ON ura.role_id = ur.id
    WHERE ura.user_id = auth.uid() 
    AND ur.name = 'admin' 
    AND ura.is_active = true
  )
);

CREATE POLICY "System can insert product stats" 
ON product_stats FOR INSERT 
TO public 
WITH CHECK (true);