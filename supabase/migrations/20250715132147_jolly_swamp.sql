/*
  # Fix toggle_wishlist function for JSONB arrays

  1. Updates
    - Replace the toggle_wishlist function to properly handle JSONB arrays
    - Use JSONB operations instead of array operations
    - Handle empty arrays correctly with JSONB format

  2. Changes
    - Use jsonb_array_elements_text() to check if product exists
    - Use || operator for JSONB array concatenation
    - Use - operator for JSONB array removal
    - Return boolean indicating if product is now in wishlist
*/

-- Drop the existing function
DROP FUNCTION IF EXISTS toggle_wishlist(uuid);

-- Create the updated function that properly handles JSONB arrays
CREATE OR REPLACE FUNCTION toggle_wishlist(product_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    current_wishlist jsonb;
    is_in_wishlist boolean := false;
    new_wishlist jsonb;
BEGIN
    -- Get current user's wishlist
    SELECT COALESCE(wishlist, '[]'::jsonb) INTO current_wishlist
    FROM profiles 
    WHERE id = auth.uid();
    
    -- Check if product is already in wishlist
    SELECT EXISTS(
        SELECT 1 FROM jsonb_array_elements_text(current_wishlist) AS item
        WHERE item = product_id::text
    ) INTO is_in_wishlist;
    
    -- Toggle the product in wishlist
    IF is_in_wishlist THEN
        -- Remove product from wishlist
        SELECT jsonb_agg(item) INTO new_wishlist
        FROM jsonb_array_elements_text(current_wishlist) AS item
        WHERE item != product_id::text;
        
        -- Handle case where wishlist becomes empty
        IF new_wishlist IS NULL THEN
            new_wishlist := '[]'::jsonb;
        END IF;
    ELSE
        -- Add product to wishlist
        new_wishlist := current_wishlist || jsonb_build_array(product_id::text);
    END IF;
    
    -- Update the user's wishlist
    UPDATE profiles 
    SET wishlist = new_wishlist,
        updated_at = now()
    WHERE id = auth.uid();
    
    -- Return whether product is now in wishlist
    RETURN NOT is_in_wishlist;
END;
$$;