/*
  # Implement Product Review System

  1. New Tables
    - `product_reviews` - Stores user reviews for products
      - `id` (uuid, primary key)
      - `product_id` (uuid, foreign key to products)
      - `user_id` (uuid, foreign key to auth.users)
      - `rating` (integer, 1-5)
      - `comment` (text)
      - `created_at` (timestamp with time zone)
      - `is_verified` (boolean)
      - `likes` (integer)
      - `dislikes` (integer)
  
  2. Security
    - Enable RLS on `product_reviews` table
    - Add policies for authenticated users to create/update/delete their own reviews
    - Add policy for public read access to reviews
  
  3. Functions
    - `add_product_review` - Add or update a product review
    - `get_product_reviews` - Get all reviews for a product
    - `get_user_reviews` - Get all reviews by a user
    - `toggle_review_like` - Toggle like/dislike on a review
*/

-- Create product_reviews table
CREATE TABLE IF NOT EXISTS product_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  is_verified BOOLEAN DEFAULT false,
  likes INTEGER DEFAULT 0,
  dislikes INTEGER DEFAULT 0,
  UNIQUE(product_id, user_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_product_reviews_product_id ON product_reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_product_reviews_user_id ON product_reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_product_reviews_created_at ON product_reviews(created_at DESC);

-- Enable Row Level Security
ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Public read access for reviews" 
  ON product_reviews
  FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can insert reviews" 
  ON product_reviews
  FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authenticated users can update own reviews" 
  ON product_reviews
  FOR UPDATE 
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can delete own reviews" 
  ON product_reviews
  FOR DELETE 
  TO authenticated
  USING (auth.uid() = user_id);

-- Function to add or update a product review
CREATE OR REPLACE FUNCTION add_product_review(
  p_product_id UUID,
  p_user_id UUID,
  p_rating INTEGER,
  p_comment TEXT
) RETURNS UUID AS $$
DECLARE
  v_review_id UUID;
  v_old_rating INTEGER;
  v_old_count INTEGER;
  v_new_count INTEGER;
  v_new_avg NUMERIC;
BEGIN
  -- Validate inputs
  IF p_rating < 1 OR p_rating > 5 THEN
    RAISE EXCEPTION 'Rating must be between 1 and 5';
  END IF;
  
  IF p_comment IS NULL OR length(trim(p_comment)) = 0 THEN
    RAISE EXCEPTION 'Comment cannot be empty';
  END IF;
  
  -- Check if product exists
  IF NOT EXISTS (SELECT 1 FROM products WHERE id = p_product_id) THEN
    RAISE EXCEPTION 'Product does not exist';
  END IF;
  
  -- Check if user exists
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = p_user_id) THEN
    RAISE EXCEPTION 'User does not exist';
  END IF;
  
  -- Get current product stats
  SELECT rating_average, rating_count 
  INTO v_old_rating, v_old_count 
  FROM product_stats 
  WHERE product_id = p_product_id;
  
  -- If no stats exist yet, initialize with zeros
  IF v_old_rating IS NULL THEN
    v_old_rating := 0;
    v_old_count := 0;
  END IF;
  
  -- Insert or update the review
  INSERT INTO product_reviews (product_id, user_id, rating, comment)
  VALUES (p_product_id, p_user_id, p_rating, p_comment)
  ON CONFLICT (product_id, user_id) 
  DO UPDATE SET 
    rating = p_rating,
    comment = p_comment,
    created_at = now()
  RETURNING id INTO v_review_id;
  
  -- Update product stats
  -- Calculate new count and average
  SELECT COUNT(*) INTO v_new_count FROM product_reviews WHERE product_id = p_product_id;
  
  SELECT AVG(rating)::NUMERIC(3,1) INTO v_new_avg FROM product_reviews WHERE product_id = p_product_id;
  
  -- Update product_stats table
  INSERT INTO product_stats (product_id, rating_average, rating_count, updated_at)
  VALUES (p_product_id, v_new_avg, v_new_count, now())
  ON CONFLICT (product_id) 
  DO UPDATE SET 
    rating_average = v_new_avg,
    rating_count = v_new_count,
    updated_at = now();
  
  RETURN v_review_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get all reviews for a product
CREATE OR REPLACE FUNCTION get_product_reviews(p_product_id UUID)
RETURNS SETOF JSONB AS $$
BEGIN
  RETURN QUERY
  SELECT jsonb_build_object(
    'id', r.id,
    'userId', r.user_id,
    'userName', COALESCE(p.full_name, u.email),
    'userAvatar', p.avatar_url,
    'rating', r.rating,
    'comment', r.comment,
    'dateCreated', r.created_at,
    'isVerified', r.is_verified,
    'likes', r.likes,
    'dislikes', r.dislikes
  )
  FROM product_reviews r
  JOIN auth.users u ON r.user_id = u.id
  LEFT JOIN profiles p ON r.user_id = p.id
  WHERE r.product_id = p_product_id
  ORDER BY r.created_at DESC;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Function to get all reviews by a user
CREATE OR REPLACE FUNCTION get_user_reviews(p_user_id UUID)
RETURNS SETOF JSONB AS $$
BEGIN
  RETURN QUERY
  SELECT jsonb_build_object(
    'id', r.id,
    'productId', r.product_id,
    'product', jsonb_build_object(
      'id', p.id,
      'title', p.title,
      'image', (SELECT url FROM product_images WHERE product_id = p.id ORDER BY position LIMIT 1)
    ),
    'rating', r.rating,
    'comment', r.comment,
    'dateCreated', r.created_at,
    'isVerified', r.is_verified,
    'likes', r.likes,
    'dislikes', r.dislikes
  )
  FROM product_reviews r
  JOIN products p ON r.product_id = p.id
  WHERE r.user_id = p_user_id
  ORDER BY r.created_at DESC;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Function to toggle like/dislike on a review
CREATE OR REPLACE FUNCTION toggle_review_like(
  p_review_id UUID,
  p_user_id UUID,
  p_is_like BOOLEAN
) RETURNS BOOLEAN AS $$
DECLARE
  v_current_status JSONB;
  v_likes_array JSONB;
  v_dislikes_array JSONB;
  v_new_likes INTEGER;
  v_new_dislikes INTEGER;
  v_result BOOLEAN;
BEGIN
  -- Get current likes/dislikes arrays
  SELECT 
    COALESCE(likes_users, '[]'::JSONB),
    COALESCE(dislikes_users, '[]'::JSONB)
  INTO v_likes_array, v_dislikes_array
  FROM product_reviews_meta
  WHERE review_id = p_review_id;
  
  -- Initialize if not exists
  IF v_likes_array IS NULL THEN
    v_likes_array := '[]'::JSONB;
  END IF;
  
  IF v_dislikes_array IS NULL THEN
    v_dislikes_array := '[]'::JSONB;
  END IF;
  
  -- Check if user already liked/disliked
  IF p_is_like THEN
    -- User wants to like
    IF v_likes_array ? p_user_id::TEXT THEN
      -- Remove like (toggle off)
      v_likes_array := v_likes_array - p_user_id::TEXT;
      v_result := false;
    ELSE
      -- Add like
      v_likes_array := v_likes_array || to_jsonb(p_user_id::TEXT);
      -- Remove from dislikes if present
      v_dislikes_array := v_dislikes_array - p_user_id::TEXT;
      v_result := true;
    END IF;
  ELSE
    -- User wants to dislike
    IF v_dislikes_array ? p_user_id::TEXT THEN
      -- Remove dislike (toggle off)
      v_dislikes_array := v_dislikes_array - p_user_id::TEXT;
      v_result := false;
    ELSE
      -- Add dislike
      v_dislikes_array := v_dislikes_array || to_jsonb(p_user_id::TEXT);
      -- Remove from likes if present
      v_likes_array := v_likes_array - p_user_id::TEXT;
      v_result := true;
    END IF;
  END IF;
  
  -- Count new totals
  v_new_likes := jsonb_array_length(v_likes_array);
  v_new_dislikes := jsonb_array_length(v_dislikes_array);
  
  -- Update review with new counts
  UPDATE product_reviews
  SET 
    likes = v_new_likes,
    dislikes = v_new_dislikes
  WHERE id = p_review_id;
  
  -- Update or insert meta information
  INSERT INTO product_reviews_meta (review_id, likes_users, dislikes_users)
  VALUES (p_review_id, v_likes_array, v_dislikes_array)
  ON CONFLICT (review_id)
  DO UPDATE SET
    likes_users = v_likes_array,
    dislikes_users = v_dislikes_array;
  
  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create meta table for tracking who liked/disliked reviews
CREATE TABLE IF NOT EXISTS product_reviews_meta (
  review_id UUID PRIMARY KEY REFERENCES product_reviews(id) ON DELETE CASCADE,
  likes_users JSONB DEFAULT '[]',
  dislikes_users JSONB DEFAULT '[]'
);

-- Function to toggle wishlist (for reference/compatibility)
CREATE OR REPLACE FUNCTION toggle_wishlist(
  p_product_id UUID,
  p_user_id UUID
) RETURNS BOOLEAN AS $$
DECLARE
  v_wishlist JSONB;
  v_result BOOLEAN;
BEGIN
  -- Get current wishlist
  SELECT wishlist INTO v_wishlist FROM profiles WHERE id = p_user_id;
  
  -- Initialize if not exists
  IF v_wishlist IS NULL THEN
    v_wishlist := '[]'::JSONB;
  END IF;
  
  -- Check if product is already in wishlist
  IF v_wishlist ? p_product_id::TEXT THEN
    -- Remove from wishlist
    v_wishlist := v_wishlist - p_product_id::TEXT;
    v_result := false;
  ELSE
    -- Add to wishlist
    v_wishlist := v_wishlist || to_jsonb(p_product_id::TEXT);
    v_result := true;
  END IF;
  
  -- Update profile
  UPDATE profiles
  SET wishlist = v_wishlist
  WHERE id = p_user_id;
  
  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;