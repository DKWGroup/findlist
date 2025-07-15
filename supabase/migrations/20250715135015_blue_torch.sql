/*
  # Dodanie Google OAuth Provider

  1. Konfiguracja
    - Dodanie Google jako dostawcy uwierzytelniania OAuth
    - Konfiguracja domyślnych ustawień dla Google OAuth
  
  2. Funkcje pomocnicze
    - Dodanie funkcji do obsługi danych profilu z Google
    - Aktualizacja profilu użytkownika po logowaniu przez Google
*/

-- Funkcja do aktualizacji profilu użytkownika po logowaniu przez Google
CREATE OR REPLACE FUNCTION public.handle_google_oauth_login()
RETURNS TRIGGER AS $$
BEGIN
  -- Sprawdź czy użytkownik już istnieje w tabeli profiles
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = NEW.id) THEN
    -- Jeśli nie, utwórz nowy profil
    INSERT INTO public.profiles (
      id,
      email,
      full_name,
      avatar_url,
      created_at,
      updated_at
    ) VALUES (
      NEW.id,
      NEW.email,
      NEW.raw_user_meta_data->>'name',
      NEW.raw_user_meta_data->>'avatar_url',
      NOW(),
      NOW()
    );
  ELSE
    -- Jeśli istnieje, zaktualizuj dane
    UPDATE public.profiles
    SET 
      email = NEW.email,
      full_name = COALESCE(NEW.raw_user_meta_data->>'name', full_name),
      avatar_url = COALESCE(NEW.raw_user_meta_data->>'avatar_url', avatar_url),
      updated_at = NOW()
    WHERE id = NEW.id;
  END IF;
  
  -- Sprawdź czy użytkownik ma ustawienia
  IF NOT EXISTS (SELECT 1 FROM public.user_settings WHERE id = NEW.id) THEN
    -- Jeśli nie, utwórz nowe ustawienia
    INSERT INTO public.user_settings (
      id,
      email_notifications,
      marketing_consent,
      theme,
      language,
      created_at,
      updated_at
    ) VALUES (
      NEW.id,
      TRUE,
      FALSE,
      'light',
      'pl',
      NOW(),
      NOW()
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger dla nowych użytkowników logujących się przez Google
DROP TRIGGER IF EXISTS on_google_oauth_login ON auth.users;
CREATE TRIGGER on_google_oauth_login
AFTER INSERT ON auth.users
FOR EACH ROW
WHEN (NEW.raw_user_meta_data->>'provider' = 'google')
EXECUTE FUNCTION public.handle_google_oauth_login();

-- Trigger dla aktualizacji danych użytkownika logującego się przez Google
DROP TRIGGER IF EXISTS on_google_oauth_update ON auth.users;
CREATE TRIGGER on_google_oauth_update
AFTER UPDATE ON auth.users
FOR EACH ROW
WHEN (NEW.raw_user_meta_data->>'provider' = 'google')
EXECUTE FUNCTION public.handle_google_oauth_login();

-- Funkcja do obsługi wishlisty dla użytkowników Google
CREATE OR REPLACE FUNCTION public.toggle_wishlist_google(product_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  user_wishlist JSONB;
  product_exists BOOLEAN;
  updated_wishlist JSONB;
BEGIN
  -- Pobierz aktualną wishlistę użytkownika
  SELECT wishlist INTO user_wishlist FROM profiles WHERE id = auth.uid();
  
  -- Jeśli wishlist jest NULL, utwórz nową pustą tablicę
  IF user_wishlist IS NULL THEN
    user_wishlist := '[]'::JSONB;
  END IF;
  
  -- Sprawdź czy produkt już istnieje w wishliście
  SELECT EXISTS (
    SELECT 1 FROM jsonb_array_elements_text(user_wishlist) AS item
    WHERE item = product_id::TEXT
  ) INTO product_exists;
  
  IF product_exists THEN
    -- Usuń produkt z wishlisty
    WITH filtered AS (
      SELECT jsonb_agg(item) AS items
      FROM jsonb_array_elements_text(user_wishlist) AS item
      WHERE item <> product_id::TEXT
    )
    SELECT COALESCE(items, '[]'::JSONB) INTO updated_wishlist FROM filtered;
  ELSE
    -- Dodaj produkt do wishlisty
    updated_wishlist := user_wishlist || to_jsonb(product_id::TEXT);
  END IF;
  
  -- Aktualizuj wishlistę użytkownika
  UPDATE profiles
  SET 
    wishlist = updated_wishlist,
    updated_at = NOW()
  WHERE id = auth.uid();
  
  -- Zwróć true jeśli produkt został dodany, false jeśli usunięty
  RETURN NOT product_exists;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;