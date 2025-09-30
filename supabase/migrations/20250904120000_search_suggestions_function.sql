-- Upewnij się, że rozszerzenie unaccent jest włączone w Twoim projekcie Supabase.
-- Możesz to zrobić w panelu Supabase: Database -> Extensions -> Wyszukaj "unaccent" i włącz.
CREATE EXTENSION IF NOT EXISTS unaccent;

CREATE OR REPLACE FUNCTION search_products_suggestions(search_term TEXT)
RETURNS TABLE (
    id UUID,
    title TEXT,
    image_url TEXT,
    category_name TEXT,
    relevance_score BIGINT
) AS $$
BEGIN
    RETURN QUERY
    WITH ranked_products AS (
        SELECT
            p.id,
            p.title,
            p.images[1] AS image_url,
            c.name AS category_name,
            -- Obliczanie trafności: prefiks > podciąg + bonus za popularność
            (CASE
                -- Wyższy wynik za dopasowanie na początku (prefix)
                WHEN lower(unaccent(p.title)) LIKE lower(unaccent(search_term)) || '%' THEN 100
                -- Niższy wynik za dopasowanie w środku (substring)
                WHEN lower(unaccent(p.title)) LIKE '%' || lower(unaccent(search_term)) || '%' THEN 50
                ELSE 0
            END) + COALESCE((p.popularity ->> 'views')::BIGINT / 10000, 0) AS score
        FROM
            products p
        LEFT JOIN
            categories c ON p.category_id = c.id
        WHERE
            -- Wyszukiwanie bez uwzględniania wielkości liter i akcentów
            lower(unaccent(p.title)) LIKE '%' || lower(unaccent(search_term)) || '%'
    )
    SELECT
        rp.id,
        rp.title,
        rp.image_url,
        rp.category_name,
        rp.score AS relevance_score
    FROM
        ranked_products
    WHERE
        rp.score > 0 -- Zwracaj tylko pasujące wyniki
    ORDER BY
        relevance_score DESC, -- Sortuj po trafności
        rp.title ASC
    LIMIT 10; -- Ogranicz do 10 wyników
END;
$$ LANGUAGE plpgsql;
