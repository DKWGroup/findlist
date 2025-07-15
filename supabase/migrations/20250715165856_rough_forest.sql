/*
  # Create product_reviews table and fix RPC functions

  1. New Tables
    - `product_reviews`
      - `id` (uuid, primary key)
      - `product_id` (uuid, foreign key to products)
      - `user_id` (uuid, foreign key to auth.users)
      - `rating` (integer, 1-5)
      - `comment` (text)
      - `created_at` (timestamp)
      - `is_verified` (boolean)
      - `likes` (integer)
      - `dislikes` (integer)

  2. Security
    - Enable RLS on `product_reviews` table
    - Add policies for public read access
    - Add policies for authenticated users to manage their own reviews

  3. Functions
    - Fix `add_product_review` to use correct table references
    - Fix `get_product_reviews` to query from product_reviews table
*/

-- Create product_reviews table
CREATE TABLE IF NOT EXISTS public.product_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  is_verified BOOLEAN DEFAULT FALSE,
  likes INTEGER DEFAULT 0,
  dislikes INTEGER DEFAULT 0,
  UNIQUE(product_id, user_id)
);

-- Enable RLS
ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;

-- Add RLS policies
CREATE POLICY "Public read access for reviews" 
  ON public.product_reviews
  FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can insert reviews" 
  ON public.product_reviews
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authenticated users can update own reviews" 
  ON public.product_reviews
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can delete own reviews" 
  ON public.product_reviews
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_product_reviews_product_id ON public.product_reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_product_reviews_user_id ON public.product_reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_product_reviews_created_at ON public.product_reviews(created_at DESC);

-- Drop existing functions if they exist
DROP FUNCTION IF EXISTS public.add_product_review(UUID, UUID, INTEGER, TEXT);
DROP FUNCTION IF EXISTS public.add_product_review(p_product_id UUID, p_user_id UUID, p_rating INTEGER, p_comment TEXT);
DROP FUNCTION IF EXISTS public.get_product_reviews(UUID);
DROP FUNCTION IF EXISTS public.get_product_reviews(p_product_id UUID);

-- Create add_product_review function
CREATE OR REPLACE FUNCTION public.add_product_review(
  p_product_id UUID,
  p_user_id UUID,
  p_rating INTEGER,
  p_comment TEXT
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_review_id UUID;
  v_product_exists BOOLEAN;
  v_user_exists BOOLEAN;
BEGIN
  -- Validate inputs
  IF p_product_id IS NULL OR p_user_id IS NULL THEN
    RAISE EXCEPTION 'Product ID and User ID are required';
  END IF;
  
  IF p_rating < 1 OR p_rating > 5 THEN
    RAISE EXCEPTION 'Rating must be between 1 and 5';
  END IF;
  
  IF p_comment IS NULL OR LENGTH(TRIM(p_comment)) = 0 THEN
    RAISE EXCEPTION 'Comment is required';
  END IF;
  
  -- Check if product exists
  SELECT EXISTS(SELECT 1 FROM public.products WHERE id = p_product_id) INTO v_product_exists;
  IF NOT v_product_exists THEN
    RAISE EXCEPTION 'Product not found';
  END IF;
  
  -- Check if user exists
  SELECT EXISTS(SELECT 1 FROM auth.users WHERE id = p_user_id) INTO v_user_exists;
  IF NOT v_user_exists THEN
    RAISE EXCEPTION 'User not found';
  END IF;
  
  -- Insert or update review
  INSERT INTO public.product_reviews (product_id, user_id, rating, comment)
  VALUES (p_product_id, p_user_id, p_rating, TRIM(p_comment))
  ON CONFLICT (product_id, user_id)
  DO UPDATE SET 
    rating = EXCLUDED.rating,
    comment = EXCLUDED.comment,
    created_at = NOW()
  RETURNING id INTO v_review_id;
  
  -- Update product stats
  UPDATE public.product_stats 
  SET 
    rating_average = (
      SELECT AVG(rating)::NUMERIC(3,2) 
      FROM public.product_reviews 
      WHERE product_id = p_product_id
    ),
    rating_count = (
      SELECT COUNT(*) 
      FROM public.product_reviews 
      WHERE product_id = p_product_id
    ),
    updated_at = NOW()
  WHERE product_id = p_product_id;
  
  -- If product_stats doesn't exist, create it
  IF NOT FOUND THEN
    INSERT INTO public.product_stats (product_id, rating_average, rating_count)
    SELECT 
      p_product_id,
      AVG(rating)::NUMERIC(3,2),
      COUNT(*)
    FROM public.product_reviews 
    WHERE product_id = p_product_id;
  END IF;
  
  RETURN v_review_id;
END;
$$;

-- Create get_product_reviews function
CREATE OR REPLACE FUNCTION public.get_product_reviews(p_product_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_reviews JSONB;
BEGIN
  -- Validate input
  IF p_product_id IS NULL THEN
    RAISE EXCEPTION 'Product ID is required';
  END IF;
  
  -- Get reviews with user information
  SELECT COALESCE(
    jsonb_agg(
      jsonb_build_object(
        'id', pr.id,
        'userId', pr.user_id,
        'userName', COALESCE(p.full_name, au.email, 'Anonymous User'),
        'userAvatar', p.avatar_url,
        'rating', pr.rating,
        'comment', pr.comment,
        'dateCreated', pr.created_at,
        'isVerified', COALESCE(pr.is_verified, false),
        'likes', COALESCE(pr.likes, 0),
        'dislikes', COALESCE(pr.dislikes, 0)
      ) ORDER BY pr.created_at DESC
    ),
    '[]'::jsonb
  ) INTO v_reviews
  FROM public.product_reviews pr
  LEFT JOIN auth.users au ON pr.user_id = au.id
  LEFT JOIN public.profiles p ON pr.user_id = p.id
  WHERE pr.product_id = p_product_id;
  
  RETURN v_reviews;
END;
$$;