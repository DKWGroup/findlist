import {
  AlertCircle,
  Award,
  CheckCircle,
  Clock,
  Edit,
  Filter,
  History,
  Plus,
  Search,
  Shield,
  Trash2,
  UserCheck,
  Users,
  UserX,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useSimplifiedAuthContext } from "../../contexts/SimplifiedAuthContext";
import {
  RoleAssignment,
  RoleAuditLog,
  roleService,
  UserRole,
} from "../../services/roleService";

interface UserWithRoles {
  id: string;
  email: string;
  name: string;
  created_at: string;
  primary_role?: UserRole;
  all_roles: RoleAssignment[];
}

export const UserRoleManagement: React.FC = () => {
  const { user: currentUser } = useSimplifiedAuthContext();
  const [users, setUsers] = useState<UserWithRoles[]>([]);
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserWithRoles | null>(null);
  const [userRoleHistory, setUserRoleHistory] = useState<RoleAuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [roleStats, setRoleStats] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [usersData, rolesData, statsData] = await Promise.all([
        roleService.getUsersWithRoles(),
        roleService.getRoles(),
        roleService.getRoleStats(),
      ]);

      setUsers(usersData);
      setRoles(rolesData);
      setRoleStats(statsData);
    } catch (error) {
      console.error("Błąd ładowania danych:", error);
      alert("Błąd ładowania danych użytkowników");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssignRole = async (
    userId: string,
    roleName: string,
    expiresAt?: string
  ) => {
    try {
      await roleService.assignRoleToUser(userId, roleName, expiresAt);
      await loadData();
      setShowRoleModal(false);
      alert("Rola została przypisana pomyślnie");
    } catch (error: any) {
      alert(`Błąd przypisywania roli: ${error.message}`);
    }
  };

  const handleRevokeRole = async (userId: string, roleName: string) => {
    if (!window.confirm("Czy na pewno chcesz odebrać tę rolę?")) return;

    try {
      await roleService.revokeRoleFromUser(userId, roleName);
      await loadData();
      alert("Rola została odebrana pomyślnie");
    } catch (error: any) {
      alert(`Błąd odbierania roli: ${error.message}`);
    }
  };

  const handleShowHistory = async (user: UserWithRoles) => {
    try {
      const history = await roleService.getUserRoleHistory(user.id);
      setUserRoleHistory(history);
      setSelectedUser(user);
      setShowHistoryModal(true);
    } catch (error: any) {
      alert(`Błąd pobierania historii: ${error.message}`);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole =
      !selectedRole ||
      user.all_roles.some(
        (assignment) => assignment.role.name === selectedRole
      );
    return matchesSearch && matchesRole;
  });

  const getRoleColor = (roleName: string) => {
    switch (roleName) {
      case "admin":
        return "bg-red-100 text-red-800";
      case "moderator":
        return "bg-orange-100 text-orange-800";
      case "editor":
        return "bg-blue-100 text-blue-800";
      case "user":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-purple-100 text-purple-800";
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case "assigned":
        return "text-green-600";
      case "revoked":
        return "text-red-600";
      case "expired":
        return "text-orange-600";
      default:
        return "text-gray-600";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Zarządzanie rolami użytkowników
            </h1>
            <p className="text-gray-600">
              Przypisuj i zarządzaj rolami użytkowników w systemie
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      {roleStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Użytkownicy</p>
                <p className="text-3xl font-bold text-gray-900">
                  {roleStats.totalUsers}
                </p>
              </div>
              <Users className="h-12 w-12 text-blue-600 bg-blue-100 rounded-lg p-3" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Role</p>
                <p className="text-3xl font-bold text-gray-900">
                  {roleStats.totalRoles}
                </p>
              </div>
              <Shield className="h-12 w-12 text-green-600 bg-green-100 rounded-lg p-3" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Uprawnienia</p>
                <p className="text-3xl font-bold text-gray-900">
                  {roleStats.totalPermissions}
                </p>
              </div>
              <Award className="h-12 w-12 text-purple-600 bg-purple-100 rounded-lg p-3" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Administratorzy</p>
                <p className="text-3xl font-bold text-gray-900">
                  {roleStats.roleDistribution.find(
                    (r: any) => r.role_name === "Administrator"
                  )?.user_count || 0}
                </p>
              </div>
              <UserCheck className="h-12 w-12 text-red-600 bg-red-100 rounded-lg p-3" />
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Szukaj użytkowników..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Wszystkie role</option>
              {roles.map((role) => (
                <option key={role.id} value={role.name}>
                  {role.display_name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Użytkownicy ({filteredUsers.length})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">
                  Użytkownik
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">
                  Role
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">
                  Data rejestracji
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">
                  Akcje
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-4 px-4">
                    <div>
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      {user.id === currentUser?.id && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          To Ty
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex flex-wrap gap-1">
                      {user.all_roles.length > 0 ? (
                        user.all_roles.map((assignment) => (
                          <span
                            key={assignment.id}
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(
                              assignment.role.name
                            )}`}
                          >
                            {assignment.role.display_name}
                            {assignment.expires_at && (
                              <Clock className="inline h-3 w-3 ml-1" />
                            )}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-400 text-sm">Brak ról</span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-600 text-sm">
                    {new Date(user.created_at).toLocaleDateString("pl-PL")}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setShowRoleModal(true);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Zarządzaj rolami"
                      >
                        <UserCheck className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleShowHistory(user)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Historia ról"
                      >
                        <History className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Brak użytkowników
            </h3>
            <p className="text-gray-600">
              {searchQuery || selectedRole
                ? "Nie znaleziono użytkowników spełniających kryteria wyszukiwania"
                : "Brak użytkowników w systemie"}
            </p>
          </div>
        )}
      </div>

      {/* Role Assignment Modal */}
      {showRoleModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">
                Zarządzaj rolami: {selectedUser.name}
              </h3>
            </div>

            <div className="p-6">
              {/* Current Roles */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">
                  Aktualne role:
                </h4>
                <div className="space-y-2">
                  {selectedUser.all_roles.length > 0 ? (
                    selectedUser.all_roles.map((assignment) => (
                      <div
                        key={assignment.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(
                              assignment.role.name
                            )}`}
                          >
                            {assignment.role.display_name}
                          </span>
                          {assignment.expires_at && (
                            <p className="text-xs text-gray-500 mt-1">
                              Wygasa:{" "}
                              {new Date(
                                assignment.expires_at
                              ).toLocaleDateString("pl-PL")}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() =>
                            handleRevokeRole(
                              selectedUser.id,
                              assignment.role.name
                            )
                          }
                          className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Odbierz rolę"
                        >
                          <UserX className="h-4 w-4" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">
                      Brak przypisanych ról
                    </p>
                  )}
                </div>
              </div>

              {/* Assign New Role */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">
                  Przypisz nową rolę:
                </h4>
                <div className="space-y-3">
                  {roles
                    .filter(
                      (role) =>
                        !selectedUser.all_roles.some(
                          (assignment) => assignment.role.id === role.id
                        )
                    )
                    .map((role) => (
                      <div
                        key={role.id}
                        className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                      >
                        <div>
                          <p className="font-medium text-gray-900">
                            {role.display_name}
                          </p>
                          {role.description && (
                            <p className="text-sm text-gray-600">
                              {role.description}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() =>
                            handleAssignRole(selectedUser.id, role.name)
                          }
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
                        >
                          Przypisz
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setShowRoleModal(false)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg transition-colors"
              >
                Zamknij
              </button>
            </div>
          </div>
        </div>
      )}

      {/* History Modal */}
      {showHistoryModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">
                Historia ról: {selectedUser.name}
              </h3>
            </div>

            <div className="p-6 overflow-y-auto max-h-96">
              {userRoleHistory.length > 0 ? (
                <div className="space-y-4">
                  {userRoleHistory.map((log) => (
                    <div
                      key={log.id}
                      className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg"
                    >
                      <div
                        className={`p-2 rounded-full ${
                          log.action === "assigned"
                            ? "bg-green-100"
                            : log.action === "revoked"
                            ? "bg-red-100"
                            : "bg-orange-100"
                        }`}
                      >
                        {log.action === "assigned" ? (
                          <CheckCircle
                            className={`h-4 w-4 ${getActionColor(log.action)}`}
                          />
                        ) : log.action === "revoked" ? (
                          <UserX
                            className={`h-4 w-4 ${getActionColor(log.action)}`}
                          />
                        ) : (
                          <Clock
                            className={`h-4 w-4 ${getActionColor(log.action)}`}
                          />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(
                              log.role.name
                            )}`}
                          >
                            {log.role.display_name}
                          </span>
                          <span
                            className={`text-sm font-medium ${getActionColor(
                              log.action
                            )}`}
                          >
                            {log.action === "assigned"
                              ? "Przypisano"
                              : log.action === "revoked"
                              ? "Odebrano"
                              : "Wygasła"}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {new Date(log.performed_at).toLocaleString("pl-PL")}
                          {log.performed_by_user && (
                            <span> przez {log.performed_by_user.name}</span>
                          )}
                        </p>
                        {log.details?.expires_at && (
                          <p className="text-xs text-gray-500 mt-1">
                            Data wygaśnięcia:{" "}
                            {new Date(
                              log.details.expires_at
                            ).toLocaleDateString("pl-PL")}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <History className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">Brak historii zmian ról</p>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setShowHistoryModal(false)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg transition-colors"
              >
                Zamknij
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
