/*
  # System zarządzania rolami użytkowników

  1. Nowe tabele
    - `profiles` - profile użytkowników z podstawowymi informacjami
    - `user_roles` - definicje ról systemowych
    - `user_permissions` - definicje uprawnień
    - `role_permissions` - mapowanie ról do uprawnień
    - `user_role_assignments` - przypisania ról do użytkowników
    - `role_audit_log` - audyt zmian ról

  2. Funkcje
    - `user_has_role()` - sprawdza czy użytkownik ma określoną rolę
    - `user_has_permission()` - sprawdza czy użytkownik ma określone uprawnienie
    - `assign_role_to_user()` - przypisuje rolę użytkownikowi
    - `revoke_role_from_user()` - odbiera rolę użytkownikowi
    - `handle_new_user()` - automatycznie tworzy profil dla nowych użytkowników

  3. Bezpieczeństwo
    - RLS włączone dla wszystkich tabel
    - Odpowiednie policies dla każdej tabeli
    - Audyt wszystkich operacji na rolach

  4. Role systemowe
    - admin - pełny dostęp
    - moderator - zarządzanie treścią
    - editor - tworzenie treści
    - user - podstawowy użytkownik
*/

-- Najpierw utwórz tabelę profiles jeśli nie istnieje
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Włącz RLS dla profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Podstawowe policies dla profiles
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Tabela definicji ról
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  description TEXT,
  is_system_role BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela uprawnień
CREATE TABLE IF NOT EXISTS user_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  description TEXT,
  resource TEXT NOT NULL, -- np. 'products', 'users', 'blog'
  action TEXT NOT NULL,   -- np. 'create', 'read', 'update', 'delete'
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela mapowania ról do uprawnień
CREATE TABLE IF NOT EXISTS role_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id UUID REFERENCES user_roles(id) ON DELETE CASCADE,
  permission_id UUID REFERENCES user_permissions(id) ON DELETE CASCADE,
  granted_at TIMESTAMPTZ DEFAULT NOW(),
  granted_by UUID REFERENCES auth.users(id),
  UNIQUE(role_id, permission_id)
);

-- Tabela przypisań ról do użytkowników
CREATE TABLE IF NOT EXISTS user_role_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role_id UUID REFERENCES user_roles(id) ON DELETE CASCADE,
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  assigned_by UUID REFERENCES auth.users(id),
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  UNIQUE(user_id, role_id)
);

-- Tabela audytu zmian ról
CREATE TABLE IF NOT EXISTS role_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  role_id UUID REFERENCES user_roles(id),
  action TEXT NOT NULL, -- 'assigned', 'revoked', 'expired'
  performed_by UUID REFERENCES auth.users(id),
  performed_at TIMESTAMPTZ DEFAULT NOW(),
  details JSONB
);

-- Teraz dodaj kolumny do tabeli profiles (po jej utworzeniu)
DO $$
BEGIN
  -- Dodaj kolumny jeśli nie istnieją
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'primary_role_id'
  ) THEN
    ALTER TABLE profiles ADD COLUMN primary_role_id UUID REFERENCES user_roles(id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'role_updated_at'
  ) THEN
    ALTER TABLE profiles ADD COLUMN role_updated_at TIMESTAMPTZ;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'role_updated_by'
  ) THEN
    ALTER TABLE profiles ADD COLUMN role_updated_by UUID REFERENCES auth.users(id);
  END IF;
END $$;

-- Włącz RLS dla wszystkich tabel ról
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_role_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_audit_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies dla user_roles
CREATE POLICY "Anyone can view active roles" ON user_roles
  FOR SELECT USING (is_active = true);

CREATE POLICY "Only admins can manage roles" ON user_roles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_role_assignments ura
      JOIN user_roles ur ON ura.role_id = ur.id
      WHERE ura.user_id = auth.uid() 
      AND ur.name = 'admin' 
      AND ura.is_active = true
    )
  );

-- RLS Policies dla user_permissions
CREATE POLICY "Anyone can view permissions" ON user_permissions
  FOR SELECT USING (is_active = true);

CREATE POLICY "Only admins can manage permissions" ON user_permissions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_role_assignments ura
      JOIN user_roles ur ON ura.role_id = ur.id
      WHERE ura.user_id = auth.uid() 
      AND ur.name = 'admin' 
      AND ura.is_active = true
    )
  );

-- RLS Policies dla role_permissions
CREATE POLICY "Anyone can view role permissions" ON role_permissions
  FOR SELECT USING (true);

CREATE POLICY "Only admins can manage role permissions" ON role_permissions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_role_assignments ura
      JOIN user_roles ur ON ura.role_id = ur.id
      WHERE ura.user_id = auth.uid() 
      AND ur.name = 'admin' 
      AND ura.is_active = true
    )
  );

-- RLS Policies dla user_role_assignments
CREATE POLICY "Users can view own role assignments" ON user_role_assignments
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can view all role assignments" ON user_role_assignments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_role_assignments ura
      JOIN user_roles ur ON ura.role_id = ur.id
      WHERE ura.user_id = auth.uid() 
      AND ur.name = 'admin' 
      AND ura.is_active = true
    )
  );

CREATE POLICY "Only admins can manage role assignments" ON user_role_assignments
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_role_assignments ura
      JOIN user_roles ur ON ura.role_id = ur.id
      WHERE ura.user_id = auth.uid() 
      AND ur.name = 'admin' 
      AND ura.is_active = true
    )
  );

CREATE POLICY "Only admins can update role assignments" ON user_role_assignments
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM user_role_assignments ura
      JOIN user_roles ur ON ura.role_id = ur.id
      WHERE ura.user_id = auth.uid() 
      AND ur.name = 'admin' 
      AND ura.is_active = true
    )
  );

-- RLS Policies dla role_audit_log
CREATE POLICY "Admins can view audit log" ON role_audit_log
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_role_assignments ura
      JOIN user_roles ur ON ura.role_id = ur.id
      WHERE ura.user_id = auth.uid() 
      AND ur.name = 'admin' 
      AND ura.is_active = true
    )
  );

CREATE POLICY "System can insert audit log" ON role_audit_log
  FOR INSERT WITH CHECK (true);

-- Funkcja sprawdzająca czy użytkownik ma określoną rolę
CREATE OR REPLACE FUNCTION user_has_role(user_uuid UUID, role_name TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM user_role_assignments ura
    JOIN user_roles ur ON ura.role_id = ur.id
    WHERE ura.user_id = user_uuid 
    AND ur.name = role_name 
    AND ura.is_active = true
    AND (ura.expires_at IS NULL OR ura.expires_at > NOW())
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Funkcja sprawdzająca czy użytkownik ma określone uprawnienie
CREATE OR REPLACE FUNCTION user_has_permission(user_uuid UUID, permission_name TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM user_role_assignments ura
    JOIN role_permissions rp ON ura.role_id = rp.role_id
    JOIN user_permissions up ON rp.permission_id = up.id
    WHERE ura.user_id = user_uuid 
    AND up.name = permission_name 
    AND ura.is_active = true
    AND up.is_active = true
    AND (ura.expires_at IS NULL OR ura.expires_at > NOW())
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Funkcja przypisywania roli użytkownikowi
CREATE OR REPLACE FUNCTION assign_role_to_user(
  target_user_id UUID,
  role_name TEXT,
  assigned_by_user_id UUID DEFAULT auth.uid(),
  expires_at TIMESTAMPTZ DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
  role_record user_roles%ROWTYPE;
  existing_assignment user_role_assignments%ROWTYPE;
BEGIN
  -- Sprawdź czy wykonujący ma uprawnienia administratora (lub czy to pierwsze przypisanie admin)
  IF assigned_by_user_id IS NOT NULL AND NOT user_has_role(assigned_by_user_id, 'admin') THEN
    -- Pozwól na pierwsze przypisanie roli admin jeśli nie ma jeszcze żadnych adminów
    IF role_name = 'admin' AND NOT EXISTS (
      SELECT 1 FROM user_role_assignments ura
      JOIN user_roles ur ON ura.role_id = ur.id
      WHERE ur.name = 'admin' AND ura.is_active = true
    ) THEN
      -- OK, pierwsze przypisanie admin
      NULL;
    ELSE
      RAISE EXCEPTION 'Brak uprawnień do przypisywania ról';
    END IF;
  END IF;

  -- Znajdź rolę
  SELECT * INTO role_record FROM user_roles WHERE name = role_name AND is_active = true;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Rola % nie istnieje lub jest nieaktywna', role_name;
  END IF;

  -- Sprawdź czy użytkownik już ma tę rolę
  SELECT * INTO existing_assignment 
  FROM user_role_assignments 
  WHERE user_id = target_user_id AND role_id = role_record.id;

  IF FOUND THEN
    -- Aktualizuj istniejące przypisanie
    UPDATE user_role_assignments 
    SET 
      is_active = true,
      expires_at = assign_role_to_user.expires_at,
      assigned_by = assigned_by_user_id,
      assigned_at = NOW()
    WHERE id = existing_assignment.id;
  ELSE
    -- Utwórz nowe przypisanie
    INSERT INTO user_role_assignments (user_id, role_id, assigned_by, expires_at)
    VALUES (target_user_id, role_record.id, assigned_by_user_id, assign_role_to_user.expires_at);
  END IF;

  -- Utwórz profil użytkownika jeśli nie istnieje
  INSERT INTO profiles (id, primary_role_id, role_updated_at, role_updated_by)
  VALUES (target_user_id, role_record.id, NOW(), assigned_by_user_id)
  ON CONFLICT (id) DO UPDATE SET
    primary_role_id = COALESCE(profiles.primary_role_id, role_record.id),
    role_updated_at = NOW(),
    role_updated_by = assigned_by_user_id;

  -- Dodaj wpis do audytu
  INSERT INTO role_audit_log (user_id, role_id, action, performed_by, details)
  VALUES (
    target_user_id, 
    role_record.id, 
    'assigned', 
    assigned_by_user_id,
    jsonb_build_object('expires_at', assign_role_to_user.expires_at)
  );

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Funkcja odbierania roli użytkownikowi
CREATE OR REPLACE FUNCTION revoke_role_from_user(
  target_user_id UUID,
  role_name TEXT,
  revoked_by_user_id UUID DEFAULT auth.uid()
)
RETURNS BOOLEAN AS $$
DECLARE
  role_record user_roles%ROWTYPE;
BEGIN
  -- Sprawdź czy wykonujący ma uprawnienia administratora
  IF NOT user_has_role(revoked_by_user_id, 'admin') THEN
    RAISE EXCEPTION 'Brak uprawnień do odbierania ról';
  END IF;

  -- Znajdź rolę
  SELECT * INTO role_record FROM user_roles WHERE name = role_name AND is_active = true;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Rola % nie istnieje lub jest nieaktywna', role_name;
  END IF;

  -- Dezaktywuj przypisanie roli
  UPDATE user_role_assignments 
  SET is_active = false
  WHERE user_id = target_user_id AND role_id = role_record.id;

  -- Jeśli to była primary role, znajdź nową
  UPDATE profiles 
  SET 
    primary_role_id = (
      SELECT ura.role_id 
      FROM user_role_assignments ura 
      WHERE ura.user_id = target_user_id 
      AND ura.is_active = true 
      AND (ura.expires_at IS NULL OR ura.expires_at > NOW())
      ORDER BY ura.assigned_at DESC 
      LIMIT 1
    ),
    role_updated_at = NOW(),
    role_updated_by = revoked_by_user_id
  WHERE id = target_user_id AND primary_role_id = role_record.id;

  -- Dodaj wpis do audytu
  INSERT INTO role_audit_log (user_id, role_id, action, performed_by)
  VALUES (target_user_id, role_record.id, 'revoked', revoked_by_user_id);

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger do automatycznego wygasania ról
CREATE OR REPLACE FUNCTION expire_user_roles()
RETURNS void AS $$
BEGIN
  UPDATE user_role_assignments 
  SET is_active = false
  WHERE expires_at <= NOW() AND is_active = true;

  -- Dodaj wpisy do audytu dla wygasłych ról
  INSERT INTO role_audit_log (user_id, role_id, action, performed_by, details)
  SELECT 
    ura.user_id,
    ura.role_id,
    'expired',
    NULL,
    jsonb_build_object('expired_at', NOW())
  FROM user_role_assignments ura
  WHERE ura.expires_at <= NOW() AND ura.is_active = false
  AND NOT EXISTS (
    SELECT 1 FROM role_audit_log ral 
    WHERE ral.user_id = ura.user_id 
    AND ral.role_id = ura.role_id 
    AND ral.action = 'expired'
    AND ral.performed_at > ura.expires_at
  );
END;
$$ LANGUAGE plpgsql;

-- Funkcja do automatycznego tworzenia profilu przy rejestracji
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_role_id UUID;
BEGIN
  -- Znajdź rolę 'user'
  SELECT id INTO user_role_id FROM user_roles WHERE name = 'user' AND is_active = true;
  
  -- Utwórz profil
  INSERT INTO profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  
  -- Przypisz domyślną rolę 'user' jeśli istnieje
  IF user_role_id IS NOT NULL THEN
    INSERT INTO user_role_assignments (user_id, role_id)
    VALUES (NEW.id, user_role_id);
    
    -- Ustaw jako primary role
    UPDATE profiles 
    SET primary_role_id = user_role_id, role_updated_at = NOW()
    WHERE id = NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Utwórz trigger dla nowych użytkowników
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Wstaw podstawowe role systemowe
INSERT INTO user_roles (name, display_name, description, is_system_role) VALUES
  ('admin', 'Administrator', 'Pełny dostęp do systemu', true),
  ('moderator', 'Moderator', 'Zarządzanie treścią i użytkownikami', true),
  ('editor', 'Edytor', 'Tworzenie i edycja treści', true),
  ('user', 'Użytkownik', 'Podstawowy użytkownik systemu', true)
ON CONFLICT (name) DO NOTHING;

-- Wstaw podstawowe uprawnienia
INSERT INTO user_permissions (name, display_name, description, resource, action) VALUES
  ('admin.full', 'Pełny dostęp administratora', 'Wszystkie uprawnienia w systemie', 'system', 'all'),
  ('users.manage', 'Zarządzanie użytkownikami', 'Tworzenie, edycja i usuwanie użytkowników', 'users', 'manage'),
  ('products.manage', 'Zarządzanie produktami', 'Tworzenie, edycja i usuwanie produktów', 'products', 'manage'),
  ('products.create', 'Tworzenie produktów', 'Dodawanie nowych produktów', 'products', 'create'),
  ('products.edit', 'Edycja produktów', 'Modyfikacja istniejących produktów', 'products', 'update'),
  ('products.delete', 'Usuwanie produktów', 'Usuwanie produktów z systemu', 'products', 'delete'),
  ('blog.manage', 'Zarządzanie blogiem', 'Pełne zarządzanie wpisami blogowymi', 'blog', 'manage'),
  ('blog.create', 'Tworzenie wpisów', 'Dodawanie nowych wpisów blogowych', 'blog', 'create'),
  ('blog.edit', 'Edycja wpisów', 'Modyfikacja wpisów blogowych', 'blog', 'update'),
  ('blog.publish', 'Publikowanie wpisów', 'Publikowanie i ukrywanie wpisów', 'blog', 'publish'),
  ('reviews.moderate', 'Moderacja recenzji', 'Zarządzanie recenzjami użytkowników', 'reviews', 'moderate'),
  ('analytics.view', 'Podgląd analityki', 'Dostęp do statystyk i analityki', 'analytics', 'read')
ON CONFLICT (name) DO NOTHING;

-- Przypisz uprawnienia do ról
DO $$
DECLARE
  admin_role_id UUID;
  moderator_role_id UUID;
  editor_role_id UUID;
  perm_rec RECORD;
BEGIN
  -- Pobierz ID ról
  SELECT id INTO admin_role_id FROM user_roles WHERE name = 'admin';
  SELECT id INTO moderator_role_id FROM user_roles WHERE name = 'moderator';
  SELECT id INTO editor_role_id FROM user_roles WHERE name = 'editor';

  -- Przypisz wszystkie uprawnienia do roli admin
  FOR perm_rec IN SELECT id FROM user_permissions LOOP
    INSERT INTO role_permissions (role_id, permission_id) 
    VALUES (admin_role_id, perm_rec.id)
    ON CONFLICT (role_id, permission_id) DO NOTHING;
  END LOOP;

  -- Przypisz wybrane uprawnienia do roli moderator
  INSERT INTO role_permissions (role_id, permission_id)
  SELECT moderator_role_id, up.id FROM user_permissions up
  WHERE up.name IN ('products.manage', 'blog.manage', 'reviews.moderate', 'analytics.view')
  ON CONFLICT (role_id, permission_id) DO NOTHING;

  -- Przypisz wybrane uprawnienia do roli editor
  INSERT INTO role_permissions (role_id, permission_id)
  SELECT editor_role_id, up.id FROM user_permissions up
  WHERE up.name IN ('products.create', 'products.edit', 'blog.create', 'blog.edit', 'blog.publish')
  ON CONFLICT (role_id, permission_id) DO NOTHING;
END $$;

-- Utwórz indeksy dla lepszej wydajności
CREATE INDEX IF NOT EXISTS idx_user_role_assignments_user_id ON user_role_assignments(user_id);
CREATE INDEX IF NOT EXISTS idx_user_role_assignments_role_id ON user_role_assignments(role_id);
CREATE INDEX IF NOT EXISTS idx_user_role_assignments_active ON user_role_assignments(user_id, is_active);
CREATE INDEX IF NOT EXISTS idx_role_permissions_role_id ON role_permissions(role_id);
CREATE INDEX IF NOT EXISTS idx_role_audit_log_user_id ON role_audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_primary_role_id ON profiles(primary_role_id);