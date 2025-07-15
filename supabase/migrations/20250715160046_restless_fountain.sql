/*
  # Fix get_product_reviews function

  1. Function Updates
    - Ensure proper parameter naming to avoid ambiguity
    - Fix any column reference issues
    - Return consistent JSON structure

  2. Changes
    - Use clear parameter naming (p_product_id)
    - Ensure proper JSON array handling
    - Add error handling for edge cases
*/

-- Drop existing function if it exists
DROP FUNCTION IF EXISTS get_product_reviews(uuid);

-- Create improved get_product_reviews function
CREATE OR REPLACE FUNCTION get_product_reviews(p_product_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result jsonb := '[]'::jsonb;
BEGIN
    -- Validate that product exists
    IF NOT EXISTS (SELECT 1 FROM products prod WHERE prod.id = p_product_id) THEN
        RETURN '[]'::jsonb;
    END IF;
    
    -- Get all reviews for this product from all users
    SELECT COALESCE(
        jsonb_agg(review_data ORDER BY (review_data->>'dateCreated')::timestamp DESC),
        '[]'::jsonb
    ) INTO result
    FROM (
        SELECT review_elem AS review_data
        FROM profiles prof,
        LATERAL jsonb_array_elements(COALESCE(prof.reviews, '[]'::jsonb)) AS review_elem
        WHERE (review_elem->>'productId')::uuid = p_product_id
    ) AS product_reviews;
    
    RETURN COALESCE(result, '[]'::jsonb);
END;
$$;