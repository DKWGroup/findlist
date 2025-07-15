/*
  # Fix toggle_wishlist function

  1. Function Updates
    - Remove function overloading ambiguity
    - Ensure single clear function signature
    - Fix parameter handling and return values

  2. Changes
    - Drop all existing toggle_wishlist functions
    - Create single unambiguous function
    - Use proper parameter naming and validation
*/

-- Drop all existing toggle_wishlist functions to avoid overloading issues
DROP FUNCTION IF EXISTS toggle_wishlist(uuid);
DROP FUNCTION IF EXISTS toggle_wishlist(uuid, uuid);
DROP FUNCTION IF EXISTS toggle_wishlist(product_id uuid);
DROP FUNCTION IF EXISTS toggle_wishlist(product_id uuid, user_uuid uuid);

-- Create single, unambiguous toggle_wishlist function
CREATE OR REPLACE FUNCTION toggle_wishlist(
    p_product_id uuid,
    p_user_id uuid
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    current_wishlist jsonb;
    product_exists boolean := false;
    is_in_wishlist boolean := false;
    updated_wishlist jsonb;
BEGIN
    -- Validate that product exists
    SELECT EXISTS(SELECT 1 FROM products prod WHERE prod.id = p_product_id) INTO product_exists;
    
    IF NOT product_exists THEN
        RAISE EXCEPTION 'Product not found';
    END IF;
    
    -- Get current wishlist
    SELECT COALESCE(prof.wishlist, '[]'::jsonb) INTO current_wishlist
    FROM profiles prof
    WHERE prof.id = p_user_id;
    
    -- Check if product is already in wishlist
    SELECT EXISTS(
        SELECT 1 
        FROM jsonb_array_elements_text(current_wishlist) AS wishlist_item
        WHERE wishlist_item::uuid = p_product_id
    ) INTO is_in_wishlist;
    
    IF is_in_wishlist THEN
        -- Remove from wishlist
        SELECT jsonb_agg(wishlist_item)
        INTO updated_wishlist
        FROM jsonb_array_elements_text(current_wishlist) AS wishlist_item
        WHERE wishlist_item::uuid != p_product_id;
        
        -- Handle case where wishlist becomes empty
        IF updated_wishlist IS NULL THEN
            updated_wishlist := '[]'::jsonb;
        END IF;
        
        -- Update profile
        UPDATE profiles prof
        SET 
            wishlist = updated_wishlist,
            updated_at = NOW()
        WHERE prof.id = p_user_id;
        
        -- Log the action
        INSERT INTO user_security_logs (user_id, action, details)
        VALUES (
            p_user_id,
            'wishlist_remove',
            jsonb_build_object('product_id', p_product_id)
        );
        
        RETURN false; -- Product was removed
    ELSE
        -- Add to wishlist
        updated_wishlist := current_wishlist || jsonb_build_array(p_product_id::text);
        
        -- Update profile
        UPDATE profiles prof
        SET 
            wishlist = updated_wishlist,
            updated_at = NOW()
        WHERE prof.id = p_user_id;
        
        -- Log the action
        INSERT INTO user_security_logs (user_id, action, details)
        VALUES (
            p_user_id,
            'wishlist_add',
            jsonb_build_object('product_id', p_product_id)
        );
        
        RETURN true; -- Product was added
    END IF;
END;
$$;