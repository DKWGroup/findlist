/*
  # Populate product categories table

  1. New Data
    - Insert all product categories with their codes and names
    - Categories include: Dom i Ogród, Uroda, Elektronika, Moda, Sport, Zabawki, Motoryzacja, Zdrowie, Biuro, Inne
  
  2. Security
    - Uses existing RLS policies from previous migration
*/

-- Insert product categories
INSERT INTO product_categories (id, name, code, icon, description, is_active) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Dom i Ogród', 'DO', '🏠', 'Produkty do domu i ogrodu', true),
  ('550e8400-e29b-41d4-a716-446655440002', 'Uroda', 'UR', '💄', 'Kosmetyki i produkty do pielęgnacji', true),
  ('550e8400-e29b-41d4-a716-446655440003', 'Elektronika', 'EL', '📱', 'Urządzenia elektroniczne i gadżety', true),
  ('550e8400-e29b-41d4-a716-446655440004', 'Moda', 'MO', '👗', 'Odzież i akcesoria modowe', true),
  ('550e8400-e29b-41d4-a716-446655440005', 'Sport i Rekreacja', 'SP', '⚽', 'Sprzęt sportowy i rekreacyjny', true),
  ('550e8400-e29b-41d4-a716-446655440006', 'Zabawki', 'ZA', '🧸', 'Zabawki dla dzieci', true),
  ('550e8400-e29b-41d4-a716-446655440007', 'Motoryzacja', 'MT', '🚗', 'Akcesoria samochodowe', true),
  ('550e8400-e29b-41d4-a716-446655440008', 'Zdrowie', 'ZD', '💊', 'Produkty zdrowotne i suplementy', true),
  ('550e8400-e29b-41d4-a716-446655440009', 'Biuro i Szkoła', 'BI', '📚', 'Artykuły biurowe i szkolne', true),
  ('550e8400-e29b-41d4-a716-446655440010', 'Inne', 'IN', '📦', 'Pozostałe produkty', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  code = EXCLUDED.code,
  icon = EXCLUDED.icon,
  description = EXCLUDED.description,
  is_active = EXCLUDED.is_active,
  updated_at = now();