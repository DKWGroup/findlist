-- Add unique constraint on product_id in product_stats table
-- This is required for ON CONFLICT (product_id) to work in increment_product_views function

-- First, remove any duplicate rows that might exist
DELETE FROM product_stats 
WHERE id NOT IN (
    SELECT MIN(id) 
    FROM product_stats 
    GROUP BY product_id
);

-- Add unique constraint on product_id
ALTER TABLE product_stats 
ADD CONSTRAINT unique_product_id UNIQUE (product_id);

-- Recreate the increment_product_views function to ensure it works correctly
CREATE OR REPLACE FUNCTION increment_product_views(p_product_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- First, try to update existing record
  UPDATE product_stats 
  SET views = views + 1, updated_at = now()
  WHERE product_id = p_product_id;
  
  -- If no row was updated, insert new record
  IF NOT FOUND THEN
    INSERT INTO product_stats (product_id, views, updated_at)
    VALUES (p_product_id, 1, now())
    ON CONFLICT (product_id) 
    DO UPDATE SET 
      views = product_stats.views + 1,
      updated_at = now();
  END IF;
    
  RETURN true;
EXCEPTION
  WHEN OTHERS THEN
    RAISE LOG 'Error in increment_product_views: %', SQLERRM;
    RETURN false;
END;
$$;
