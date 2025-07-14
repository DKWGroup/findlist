/*
  # Add products and related tables

  1. New Tables
    - `products` - Main products table
    - `product_categories` - Categories for products
    - `product_tags` - Tags for products
    - `product_images` - Images associated with products
    - `product_codes` - Unique product codes

  2. Security
    - Enable RLS on all tables
    - Add policies for admin access
    - Add policies for public read access
*/

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  category_id uuid,
  product_type text,
  price_original numeric,
  price_discounted numeric,
  price_currency text DEFAULT 'PLN',
  is_verified boolean DEFAULT false,
  is_trending boolean DEFAULT false,
  code text,
  url_alias text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

-- Create product_categories table
CREATE TABLE IF NOT EXISTS product_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  code text NOT NULL,
  icon text,
  description text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create product_tags table
CREATE TABLE IF NOT EXISTS product_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  tag text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create product_images table
CREATE TABLE IF NOT EXISTS product_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  url text NOT NULL,
  position integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create product_codes table
CREATE TABLE IF NOT EXISTS product_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  code text NOT NULL UNIQUE,
  category_code text NOT NULL,
  type_code text NOT NULL,
  sequence_number integer NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create product_affiliate_links table
CREATE TABLE IF NOT EXISTS product_affiliate_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  platform text NOT NULL,
  url text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create product_social_links table
CREATE TABLE IF NOT EXISTS product_social_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  platform text NOT NULL,
  url text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create product_stats table
CREATE TABLE IF NOT EXISTS product_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  views integer DEFAULT 0,
  likes integer DEFAULT 0,
  shares integer DEFAULT 0,
  rating_average numeric DEFAULT 0,
  rating_count integer DEFAULT 0,
  updated_at timestamptz DEFAULT now()
);

-- Add foreign key to products table
ALTER TABLE products ADD CONSTRAINT fk_products_category
  FOREIGN KEY (category_id) REFERENCES product_categories(id);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_affiliate_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_stats ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies

-- Products policies
CREATE POLICY "Public can view products" ON products
  FOR SELECT USING (true);

CREATE POLICY "Admins can insert products" ON products
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_role_assignments ura
      JOIN user_roles ur ON ura.role_id = ur.id
      WHERE ura.user_id = auth.uid()
      AND ur.name = 'admin'
      AND ura.is_active = true
    )
  );

CREATE POLICY "Admins can update products" ON products
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM user_role_assignments ura
      JOIN user_roles ur ON ura.role_id = ur.id
      WHERE ura.user_id = auth.uid()
      AND ur.name = 'admin'
      AND ura.is_active = true
    )
  );

CREATE POLICY "Admins can delete products" ON products
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM user_role_assignments ura
      JOIN user_roles ur ON ura.role_id = ur.id
      WHERE ura.user_id = auth.uid()
      AND ur.name = 'admin'
      AND ura.is_active = true
    )
  );

-- Similar policies for other tables
CREATE POLICY "Public can view product categories" ON product_categories
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage product categories" ON product_categories
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_role_assignments ura
      JOIN user_roles ur ON ura.role_id = ur.id
      WHERE ura.user_id = auth.uid()
      AND ur.name = 'admin'
      AND ura.is_active = true
    )
  );

-- Create functions for product management

-- Function to create a product with all related data
CREATE OR REPLACE FUNCTION create_product(
  p_title text,
  p_description text,
  p_category_id uuid,
  p_product_type text,
  p_price_original numeric,
  p_price_discounted numeric,
  p_price_currency text,
  p_is_verified boolean,
  p_is_trending boolean,
  p_code text,
  p_url_alias text,
  p_tags text[],
  p_images text[],
  p_affiliate_links jsonb,
  p_social_links jsonb
) RETURNS uuid AS $$
DECLARE
  v_product_id uuid;
  v_tag text;
  v_image text;
  v_image_position integer := 0;
  v_platform text;
  v_url text;
BEGIN
  -- Insert product
  INSERT INTO products (
    title, description, category_id, product_type,
    price_original, price_discounted, price_currency,
    is_verified, is_trending, code, url_alias, created_by
  ) VALUES (
    p_title, p_description, p_category_id, p_product_type,
    p_price_original, p_price_discounted, p_price_currency,
    p_is_verified, p_is_trending, p_code, p_url_alias, auth.uid()
  ) RETURNING id INTO v_product_id;

  -- Insert tags
  FOREACH v_tag IN ARRAY p_tags LOOP
    INSERT INTO product_tags (product_id, tag)
    VALUES (v_product_id, v_tag);
  END LOOP;

  -- Insert images
  FOREACH v_image IN ARRAY p_images LOOP
    INSERT INTO product_images (product_id, url, position)
    VALUES (v_product_id, v_image, v_image_position);
    v_image_position := v_image_position + 1;
  END LOOP;

  -- Insert affiliate links
  FOR v_platform, v_url IN SELECT * FROM jsonb_each_text(p_affiliate_links) LOOP
    IF v_url IS NOT NULL AND v_url != '' THEN
      INSERT INTO product_affiliate_links (product_id, platform, url)
      VALUES (v_product_id, v_platform, v_url);
    END IF;
  END LOOP;

  -- Insert social links
  FOR v_platform, v_url IN SELECT * FROM jsonb_each_text(p_social_links) LOOP
    IF v_url IS NOT NULL AND v_url != '' THEN
      INSERT INTO product_social_links (product_id, platform, url)
      VALUES (v_product_id, v_platform, v_url);
    END IF;
  END LOOP;

  -- Initialize stats
  INSERT INTO product_stats (product_id)
  VALUES (v_product_id);

  RETURN v_product_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get complete product data
CREATE OR REPLACE FUNCTION get_product_complete(p_product_id uuid)
RETURNS jsonb AS $$
DECLARE
  v_product jsonb;
  v_tags jsonb;
  v_images jsonb;
  v_affiliate_links jsonb;
  v_social_links jsonb;
  v_stats jsonb;
BEGIN
  -- Get product
  SELECT jsonb_build_object(
    'id', p.id,
    'title', p.title,
    'description', p.description,
    'category_id', p.category_id,
    'product_type', p.product_type,
    'price', jsonb_build_object(
      'original', p.price_original,
      'discounted', p.price_discounted,
      'currency', p.price_currency
    ),
    'is_verified', p.is_verified,
    'is_trending', p.is_trending,
    'code', p.code,
    'url_alias', p.url_alias,
    'created_at', p.created_at,
    'updated_at', p.updated_at
  )
  INTO v_product
  FROM products p
  WHERE p.id = p_product_id;

  -- Get tags
  SELECT jsonb_agg(tag)
  INTO v_tags
  FROM product_tags
  WHERE product_id = p_product_id;

  -- Get images
  SELECT jsonb_agg(url ORDER BY position)
  INTO v_images
  FROM product_images
  WHERE product_id = p_product_id;

  -- Get affiliate links
  SELECT jsonb_object_agg(platform, url)
  INTO v_affiliate_links
  FROM product_affiliate_links
  WHERE product_id = p_product_id;

  -- Get social links
  SELECT jsonb_object_agg(platform, url)
  INTO v_social_links
  FROM product_social_links
  WHERE product_id = p_product_id;

  -- Get stats
  SELECT jsonb_build_object(
    'views', views,
    'likes', likes,
    'shares', shares,
    'ratings', jsonb_build_object(
      'average', rating_average,
      'count', rating_count
    )
  )
  INTO v_stats
  FROM product_stats
  WHERE product_id = p_product_id;

  -- Combine all data
  v_product := v_product || 
    jsonb_build_object(
      'tags', COALESCE(v_tags, '[]'::jsonb),
      'images', COALESCE(v_images, '[]'::jsonb),
      'affiliate_links', COALESCE(v_affiliate_links, '{}'::jsonb),
      'social_links', COALESCE(v_social_links, '{}'::jsonb),
      'popularity', COALESCE(v_stats, '{}'::jsonb)
    );

  RETURN v_product;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert initial categories
INSERT INTO product_categories (name, code, icon, description)
VALUES 
  ('Elektronika', 'EL', 'Smartphone', 'Urządzenia elektroniczne i akcesoria'),
  ('Dom i Ogród', 'DO', 'Home', 'Produkty do domu i ogrodu'),
  ('Moda', 'MO', 'Shirt', 'Odzież i dodatki modowe'),
  ('Uroda', 'UR', 'Heart', 'Kosmetyki i produkty do pielęgnacji'),
  ('Zabawki', 'ZA', 'Baby', 'Zabawki i gry dla dzieci'),
  ('Sport', 'SP', 'Dumbbell', 'Sprzęt sportowy i fitness'),
  ('Motoryzacja', 'AU', 'Car', 'Akcesoria samochodowe i narzędzia'),
  ('Zwierzęta', 'PE', 'Dog', 'Produkty dla zwierząt domowych'),
  ('Torby i Podróże', 'TR', 'Luggage', 'Bagaże i akcesoria podróżne'),
  ('Okazje', 'OC', 'Gift', 'Produkty okolicznościowe i prezenty')
ON CONFLICT DO NOTHING;