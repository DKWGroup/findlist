import { supabase } from './supabaseStorage';

export interface UserRole {
  id: string;
  name: string;
  display_name: string;
  description?: string;
  is_system_role: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserPermission {
  id: string;
  name: string;
  display_name: string;
  description?: string;
  resource: string;
  action: string;
  is_active: boolean;
  created_at: string;
}

export interface RoleAssignment {
  id: string;
  user_id: string;
  role_id: string;
  assigned_at: string;
  assigned_by: string;
  expires_at?: string;
  is_active: boolean;
  role: UserRole;
  assigned_by_user?: {
    name: string;
    email: string;
  };
}

export interface RoleAuditLog {
  id: string;
  user_id: string;
  role_id: string;
  action: 'assigned' | 'revoked' | 'expired';
  performed_by?: string;
  performed_at: string;
  details?: any;
  role: UserRole;
  performed_by_user?: {
    name: string;
    email: string;
  };
}

class RoleService {
  // Pobierz wszystkie dostępne role
  async getRoles(): Promise<UserRole[]> {
    const { data, error } = await supabase
      .from('user_roles')
      .select('*')
      .eq('is_active', true)
      .order('display_name');

    if (error) {
      throw new Error(`Błąd pobierania ról: ${error.message}`);
    }

    return data || [];
  }

  // Pobierz wszystkie uprawnienia
  async getPermissions(): Promise<UserPermission[]> {
    const { data, error } = await supabase
      .from('user_permissions')
      .select('*')
      .eq('is_active', true)
      .order('resource', { ascending: true })
      .order('action', { ascending: true });

    if (error) {
      throw new Error(`Błąd pobierania uprawnień: ${error.message}`);
    }

    return data || [];
  }

  // Pobierz uprawnienia dla konkretnej roli
  async getRolePermissions(roleId: string): Promise<UserPermission[]> {
    const { data, error } = await supabase
      .from('role_permissions')
      .select(`
        permission:user_permissions(*)
      `)
      .eq('role_id', roleId);

    if (error) {
      throw new Error(`Błąd pobierania uprawnień roli: ${error.message}`);
    }

    return data?.map(item => item.permission).filter(Boolean) || [];
  }

  // Pobierz role użytkownika
  async getUserRoles(userId: string): Promise<RoleAssignment[]> {
    const { data, error } = await supabase
      .from('user_role_assignments')
      .select(`
        *,
        role:user_roles(*),
        assigned_by_user:profiles!user_role_assignments_assigned_by_fkey(name, email)
      `)
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('assigned_at', { ascending: false });

    if (error) {
      throw new Error(`Błąd pobierania ról użytkownika: ${error.message}`);
    }

    return data || [];
  }

  // Sprawdź czy użytkownik ma określoną rolę
  async userHasRole(userId: string, roleName: string): Promise<boolean> {
    const { data, error } = await supabase
      .rpc('user_has_role', {
        user_uuid: userId,
        role_name: roleName
      });

    if (error) {
      console.error('Błąd sprawdzania roli:', error);
      return false;
    }

    return data || false;
  }

  // Sprawdź czy użytkownik ma określone uprawnienie
  async userHasPermission(userId: string, permissionName: string): Promise<boolean> {
    const { data, error } = await supabase
      .rpc('user_has_permission', {
        user_uuid: userId,
        permission_name: permissionName
      });

    if (error) {
      console.error('Błąd sprawdzania uprawnienia:', error);
      return false;
    }

    return data || false;
  }

  // Przypisz rolę użytkownikowi
  async assignRoleToUser(
    userId: string, 
    roleName: string, 
    expiresAt?: string
  ): Promise<boolean> {
    const { data, error } = await supabase
      .rpc('assign_role_to_user', {
        target_user_id: userId,
        role_name: roleName,
        expires_at: expiresAt || null
      });

    if (error) {
      throw new Error(`Błąd przypisywania roli: ${error.message}`);
    }

    return data || false;
  }

  // Odbierz rolę użytkownikowi
  async revokeRoleFromUser(userId: string, roleName: string): Promise<boolean> {
    const { data, error } = await supabase
      .rpc('revoke_role_from_user', {
        target_user_id: userId,
        role_name: roleName
      });

    if (error) {
      throw new Error(`Błąd odbierania roli: ${error.message}`);
    }

    return data || false;
  }

  // Pobierz wszystkich użytkowników z ich rolami
  async getUsersWithRoles(): Promise<Array<{
    id: string;
    email: string;
    name: string;
    created_at: string;
    primary_role?: UserRole;
    all_roles: RoleAssignment[];
  }>> {
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        id,
        email,
        name,
        created_at,
        primary_role:user_roles(*),
        role_assignments:user_role_assignments(
          *,
          role:user_roles(*)
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Błąd pobierania użytkowników: ${error.message}`);
    }

    return data?.map(user => ({
      ...user,
      all_roles: user.role_assignments?.filter((assignment: any) => assignment.is_active) || []
    })) || [];
  }

  // Pobierz historię zmian ról dla użytkownika
  async getUserRoleHistory(userId: string): Promise<RoleAuditLog[]> {
    const { data, error } = await supabase
      .from('role_audit_log')
      .select(`
        *,
        role:user_roles(*),
        performed_by_user:profiles!role_audit_log_performed_by_fkey(name, email)
      `)
      .eq('user_id', userId)
      .order('performed_at', { ascending: false });

    if (error) {
      throw new Error(`Błąd pobierania historii ról: ${error.message}`);
    }

    return data || [];
  }

  // Utwórz nową rolę
  async createRole(roleData: {
    name: string;
    display_name: string;
    description?: string;
    permissions?: string[];
  }): Promise<UserRole> {
    const { data, error } = await supabase
      .from('user_roles')
      .insert({
        name: roleData.name,
        display_name: roleData.display_name,
        description: roleData.description,
        is_system_role: false
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Błąd tworzenia roli: ${error.message}`);
    }

    // Przypisz uprawnienia do roli jeśli zostały podane
    if (roleData.permissions && roleData.permissions.length > 0) {
      await this.assignPermissionsToRole(data.id, roleData.permissions);
    }

    return data;
  }

  // Przypisz uprawnienia do roli
  async assignPermissionsToRole(roleId: string, permissionNames: string[]): Promise<void> {
    // Pobierz ID uprawnień
    const { data: permissions, error: permError } = await supabase
      .from('user_permissions')
      .select('id, name')
      .in('name', permissionNames);

    if (permError) {
      throw new Error(`Błąd pobierania uprawnień: ${permError.message}`);
    }

    // Utwórz mapowania rola-uprawnienie
    const rolePermissions = permissions?.map(permission => ({
      role_id: roleId,
      permission_id: permission.id
    })) || [];

    const { error } = await supabase
      .from('role_permissions')
      .upsert(rolePermissions);

    if (error) {
      throw new Error(`Błąd przypisywania uprawnień: ${error.message}`);
    }
  }

  // Usuń uprawnienia z roli
  async removePermissionsFromRole(roleId: string, permissionNames: string[]): Promise<void> {
    // Pobierz ID uprawnień
    const { data: permissions, error: permError } = await supabase
      .from('user_permissions')
      .select('id')
      .in('name', permissionNames);

    if (permError) {
      throw new Error(`Błąd pobierania uprawnień: ${permError.message}`);
    }

    const permissionIds = permissions?.map(p => p.id) || [];

    const { error } = await supabase
      .from('role_permissions')
      .delete()
      .eq('role_id', roleId)
      .in('permission_id', permissionIds);

    if (error) {
      throw new Error(`Błąd usuwania uprawnień: ${error.message}`);
    }
  }

  // Wygaś role użytkowników (funkcja do uruchamiania okresowo)
  async expireUserRoles(): Promise<void> {
    const { error } = await supabase.rpc('expire_user_roles');

    if (error) {
      throw new Error(`Błąd wygaszania ról: ${error.message}`);
    }
  }

  // Pobierz statystyki ról
  async getRoleStats(): Promise<{
    totalUsers: number;
    totalRoles: number;
    totalPermissions: number;
    roleDistribution: Array<{ role_name: string; user_count: number }>;
  }> {
    // Pobierz podstawowe statystyki
    const [usersResult, rolesResult, permissionsResult] = await Promise.all([
      supabase.from('profiles').select('id', { count: 'exact', head: true }),
      supabase.from('user_roles').select('id', { count: 'exact', head: true }).eq('is_active', true),
      supabase.from('user_permissions').select('id', { count: 'exact', head: true }).eq('is_active', true)
    ]);

    // Pobierz dystrybucję ról
    const { data: roleDistribution, error: distError } = await supabase
      .from('user_role_assignments')
      .select(`
        role:user_roles(name, display_name)
      `)
      .eq('is_active', true);

    if (distError) {
      throw new Error(`Błąd pobierania dystrybucji ról: ${distError.message}`);
    }

    // Policz użytkowników dla każdej roli
    const distribution = roleDistribution?.reduce((acc: any, assignment: any) => {
      const roleName = assignment.role?.display_name || 'Nieznana';
      acc[roleName] = (acc[roleName] || 0) + 1;
      return acc;
    }, {});

    return {
      totalUsers: usersResult.count || 0,
      totalRoles: rolesResult.count || 0,
      totalPermissions: permissionsResult.count || 0,
      roleDistribution: Object.entries(distribution || {}).map(([role_name, user_count]) => ({
        role_name,
        user_count: user_count as number
      }))
    };
  }
}

export const roleService = new RoleService();