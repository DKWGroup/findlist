-- Add test products with codes and url_alias from mockData
-- This migration will populate the database with test products that have proper codes

-- First, ensure we have the required categories
INSERT INTO product_categories (id, name, code, icon, description) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Elektronika i akcesoria', 'EL', 'Smartphone', 'Urządzenia elektroniczne i akcesoria'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Dom i ogród', 'DO', 'Home', 'Produkty do domu i ogrodu'),
  ('550e8400-e29b-41d4-a716-446655440003', 'Moda i dodatki', 'MO', 'Shirt', 'Odzież i dodatki modowe'),
  ('550e8400-e29b-41d4-a716-446655440004', 'Uroda i zdrowie', 'UR', 'Heart', 'Kosmetyki i produkty do pielęgnacji'),
  ('550e8400-e29b-41d4-a716-446655440005', 'Zabawki i dzieci', 'ZA', 'Baby', 'Zabawki i gry dla dzieci'),
  ('550e8400-e29b-41d4-a716-446655440006', 'Sport i hobby', 'SP', 'Dumbbell', 'Sprzęt sportowy i fitness')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  code = EXCLUDED.code,
  icon = EXCLUDED.icon,
  description = EXCLUDED.description;

-- Add test products using the create_product function
DO $$
DECLARE
  v_product_id uuid;
BEGIN
  -- Product 1: Inteligentna Lampa LED z Bluetooth
  SELECT create_product(
    'Inteligentna Lampa LED z Bluetooth',
    'Rewolucyjna lampa LED z głośnikiem Bluetooth, która zmienia kolory w rytm muzyki. Idealna do sypialni, salonu czy jako lampka nocna.',
    '550e8400-e29b-41d4-a716-446655440001'::uuid,
    'smart-home',
    89.99,
    39.99,
    'PLN',
    true,
    true,
    'EL-SH-001',
    'inteligentna-lampa-led-bluetooth',
    ARRAY['smart home', 'bluetooth', 'led', 'muzyka', 'dekoracja'],
    ARRAY[
      'https://images.pexels.com/photos/1112598/pexels-photo-1112598.jpeg',
      'https://images.pexels.com/photos/1029757/pexels-photo-1029757.jpeg'
    ],
    '{"temu": "https://temu.com/product-123", "aliexpress": "https://aliexpress.com/item/123", "amazon": "https://amazon.com/dp/123"}'::jsonb,
    '{"tiktok": "https://tiktok.com/@user/video/123", "instagram": "https://instagram.com/p/123"}'::jsonb
  ) INTO v_product_id;

  -- Product 2: Magiczny Organizer do Szafy
  SELECT create_product(
    'Magiczny Organizer do Szafy',
    'Składany organizer do szafy, który podwaja przestrzeń na ubrania. Łatwy montaż, trwały materiał, idealne rozwiązanie dla małych mieszkań.',
    '550e8400-e29b-41d4-a716-446655440002'::uuid,
    'organization',
    45.99,
    19.99,
    'PLN',
    false,
    true,
    'DO-OR-001',
    'magiczny-organizer-szafy',
    ARRAY['organizacja', 'szafa', 'przechowywanie', 'dom'],
    ARRAY[
      'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg',
      'https://images.pexels.com/photos/1080696/pexels-photo-1080696.jpeg'
    ],
    '{"temu": "https://temu.com/product-124", "aliexpress": "https://aliexpress.com/item/124"}'::jsonb,
    '{"tiktok": "https://tiktok.com/@user/video/124"}'::jsonb
  ) INTO v_product_id;

  -- Product 3: Zestaw Silikonowych Masek do Twarzy
  SELECT create_product(
    'Zestaw Silikonowych Masek do Twarzy',
    'Wielorazowe silikonowe maski do twarzy, które maksymalizują wchłanianie składników aktywnych. Zestaw 3 sztuk w różnych kolorach.',
    '550e8400-e29b-41d4-a716-446655440004'::uuid,
    'skincare',
    34.99,
    14.99,
    'PLN',
    true,
    false,
    'UR-SK-001',
    'silikonowe-maski-twarzy',
    ARRAY['uroda', 'pielęgnacja', 'maski', 'skóra', 'silikon'],
    ARRAY[
      'https://images.pexels.com/photos/3785103/pexels-photo-3785103.jpeg',
      'https://images.pexels.com/photos/3997991/pexels-photo-3997991.jpeg'
    ],
    '{"temu": "https://temu.com/product-125", "aliexpress": "https://aliexpress.com/item/125"}'::jsonb,
    '{"tiktok": "https://tiktok.com/@user/video/125"}'::jsonb
  ) INTO v_product_id;

  -- Product 4: Magnetyczne Etui na Telefon
  SELECT create_product(
    'Magnetyczne Etui na Telefon z Portfelem',
    'Eleganckie etui z magnetycznym zamknięciem i miejscem na karty. Kompatybilne z większością smartfonów, dostępne w kilku kolorach.',
    '550e8400-e29b-41d4-a716-446655440001'::uuid,
    'smartphone',
    29.99,
    12.99,
    'PLN',
    false,
    true,
    'EL-SM-001',
    'magnetyczne-etui-telefon-portfel',
    ARRAY['telefon', 'etui', 'magnetyczne', 'portfel', 'akcesoria'],
    ARRAY[
      'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg',
      'https://images.pexels.com/photos/1618200/pexels-photo-1618200.jpeg'
    ],
    '{"temu": "https://temu.com/product-126", "aliexpress": "https://aliexpress.com/item/126"}'::jsonb,
    '{"tiktok": "https://tiktok.com/@user/video/126", "instagram": "https://instagram.com/p/126"}'::jsonb
  ) INTO v_product_id;

  -- Product 5: Składane Krzesło Kempingowe
  SELECT create_product(
    'Ultra Lekkie Składane Krzesło Kempingowe',
    'Wytrzymałe i lekkie krzesło idealnie do kempu, plaży czy ogrodu. Składa się do kompaktowych rozmiarów, wytrzymuje do 120kg.',
    '550e8400-e29b-41d4-a716-446655440006'::uuid,
    'outdoor',
    79.99,
    34.99,
    'PLN',
    true,
    false,
    'SP-OD-001',
    'skladane-krzeslo-kempingowe',
    ARRAY['kemping', 'krzesło', 'outdoor', 'składane', 'lekkie'],
    ARRAY[
      'https://images.pexels.com/photos/1061640/pexels-photo-1061640.jpeg',
      'https://images.pexels.com/photos/1061644/pexels-photo-1061644.jpeg'
    ],
    '{"temu": "https://temu.com/product-127", "amazon": "https://amazon.com/dp/127"}'::jsonb,
    '{"tiktok": "https://tiktok.com/@user/video/127"}'::jsonb
  ) INTO v_product_id;

  -- Product 6: Automatyczny Dozownik Mydła
  SELECT create_product(
    'Bezdotykowy Automatyczny Dozownik Mydła',
    'Higieniczny dozownik na podczerwień z regulowaną ilością mydła. Wodoodporny, działa na baterie, idealny do kuchni i łazienki.',
    '550e8400-e29b-41d4-a716-446655440002'::uuid,
    'kitchen',
    24.99,
    9.99,
    'PLN',
    true,
    true,
    'DO-KI-001',
    'automatyczny-dozownik-mydla',
    ARRAY['dozownik', 'mydło', 'automatyczny', 'higiena', 'sensor'],
    ARRAY[
      'https://images.pexels.com/photos/4239113/pexels-photo-4239113.jpeg',
      'https://images.pexels.com/photos/6190327/pexels-photo-6190327.jpeg'
    ],
    '{"temu": "https://temu.com/product-128", "aliexpress": "https://aliexpress.com/item/128"}'::jsonb,
    '{"tiktok": "https://tiktok.com/@user/video/128", "instagram": "https://instagram.com/p/128"}'::jsonb
  ) INTO v_product_id;

END $$;

-- Update product stats with some realistic values
UPDATE product_stats SET
  views = floor(random() * 100000) + 1000,
  likes = floor(random() * 10000) + 100,
  shares = floor(random() * 1000) + 10,
  rating_average = (random() * 2 + 3)::numeric(3,2), -- Random rating between 3.0 and 5.0
  rating_count = floor(random() * 500) + 10
WHERE product_id IN (
  SELECT id FROM products WHERE code IS NOT NULL
);
