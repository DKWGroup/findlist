-- Add function to check for duplicate URL aliases
CREATE OR REPLACE FUNCTION check_duplicate_url_aliases()
RETURNS TABLE (
  url_alias text,
  count bigint
) 
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    p.url_alias,
    COUNT(*) as count
  FROM products p
  WHERE p.url_alias IS NOT NULL 
    AND p.url_alias != ''
  GROUP BY p.url_alias
  HAVING COUNT(*) > 1;
$$;

-- Function to check for duplicate URLs
CREATE OR REPLACE FUNCTION check_duplicate_urls()
RETURNS TABLE (
  product_id uuid,
  title text,
  code text,
  url_alias text,
  long_url text,
  short_url text,
  has_duplicate boolean
) 
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  WITH product_urls AS (
    SELECT 
      p.id,
      p.title,
      p.code,
      p.url_alias,
      -- Generate long URL from title
      CASE 
        WHEN p.url_alias IS NOT NULL AND p.url_alias != '' 
        THEN p.url_alias
        ELSE regexp_replace(
          regexp_replace(
            regexp_replace(
              lower(trim(p.title)), 
              '[^a-z0-9\s-]', '', 'g'
            ), 
            '\s+', '-', 'g'
          ), 
          '-+', '-', 'g'
        )
      END as generated_long_url,
      -- Generate short URL from code
      UPPER(COALESCE(p.code, '')) as generated_short_url
    FROM products p
    WHERE p.title IS NOT NULL AND p.title != ''
  ),
  url_counts AS (
    SELECT 
      generated_long_url,
      generated_short_url,
      COUNT(*) as url_count
    FROM product_urls
    WHERE generated_long_url != '' OR generated_short_url != ''
    GROUP BY generated_long_url, generated_short_url
  )
  SELECT 
    pu.id as product_id,
    pu.title,
    pu.code,
    pu.url_alias,
    pu.generated_long_url as long_url,
    pu.generated_short_url as short_url,
    COALESCE(uc.url_count > 1, false) as has_duplicate
  FROM product_urls pu
  LEFT JOIN url_counts uc ON (
    pu.generated_long_url = uc.generated_long_url 
    AND pu.generated_short_url = uc.generated_short_url
  )
  ORDER BY pu.title;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION check_duplicate_urls() TO authenticated;
GRANT EXECUTE ON FUNCTION check_duplicate_urls() TO anon;
