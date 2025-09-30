-- Dodaj przykładowe kody produktów do istniejących produktów
-- Ta migracja dodaje przykładowe kody do pierwszych kilku produktów do testowania

-- Najpierw sprawdzamy czy są jakieś produkty
DO $$
DECLARE
    product_record RECORD;
    counter INT := 1;
BEGIN
    -- Pobieramy pierwsze 10 produktów i nadajemy im kody
    FOR product_record IN 
        SELECT id FROM products 
        WHERE code IS NULL OR code = ''
        ORDER BY created_at 
        LIMIT 10
    LOOP
        CASE counter
            WHEN 1 THEN UPDATE products SET code = 'ZA-ED-001' WHERE id = product_record.id;
            WHEN 2 THEN UPDATE products SET code = 'ZA-ED-002' WHERE id = product_record.id;
            WHEN 3 THEN UPDATE products SET code = 'ZA-ED-003' WHERE id = product_record.id;
            WHEN 4 THEN UPDATE products SET code = 'KU-WY-001' WHERE id = product_record.id;
            WHEN 5 THEN UPDATE products SET code = 'KU-WY-002' WHERE id = product_record.id;
            WHEN 6 THEN UPDATE products SET code = 'SP-GR-001' WHERE id = product_record.id;
            WHEN 7 THEN UPDATE products SET code = 'SP-GR-002' WHERE id = product_record.id;
            WHEN 8 THEN UPDATE products SET code = 'EL-GA-001' WHERE id = product_record.id;
            WHEN 9 THEN UPDATE products SET code = 'EL-GA-002' WHERE id = product_record.id;
            WHEN 10 THEN UPDATE products SET code = 'DO-KU-001' WHERE id = product_record.id;
        END CASE;
        
        counter := counter + 1;
    END LOOP;
    
    RAISE NOTICE 'Dodano kody do % produktów', counter - 1;
END $$;
