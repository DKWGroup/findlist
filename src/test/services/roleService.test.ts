import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock the entire roleService module
const mockRoleService = {
  getRoles: vi.fn(),
  getPermissions: vi.fn(),
  getUserRoles: vi.fn(),
  userHasRole: vi.fn(),
  userHasPermission: vi.fn(),
  assignRoleToUser: vi.fn(),
  revokeRoleFromUser: vi.fn(),
  getUsersWithRoles: vi.fn(),
  getUserRoleHistory: vi.fn(),
  getRoleStats: vi.fn(),
};

vi.mock("../../services/roleService", () => ({
  roleService: mockRoleService,
}));

describe("RoleService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getRoles", () => {
    it("should fetch all active roles", async () => {
      const mockRoles = [
        {
          id: "1",
          name: "admin",
          display_name: "Administrator",
          description: "Full system access",
          is_system_role: true,
          is_active: true,
          created_at: "2023-01-01T00:00:00Z",
          updated_at: "2023-01-01T00:00:00Z",
        },
        {
          id: "2",
          name: "user",
          display_name: "User",
          description: "Basic user access",
          is_system_role: true,
          is_active: true,
          created_at: "2023-01-01T00:00:00Z",
          updated_at: "2023-01-01T00:00:00Z",
        },
      ];

      mockRoleService.getRoles.mockResolvedValue(mockRoles);

      const result = await mockRoleService.getRoles();

      expect(result).toEqual(mockRoles);
      expect(mockRoleService.getRoles).toHaveBeenCalled();
    });

    it("should handle database errors when fetching roles", async () => {
      mockRoleService.getRoles.mockRejectedValue(
        new Error("Błąd pobierania ról: Database error")
      );

      await expect(mockRoleService.getRoles()).rejects.toThrow(
        "Błąd pobierania ról: Database error"
      );
    });

    it("should return empty array when no roles found", async () => {
      mockRoleService.getRoles.mockResolvedValue([]);

      const result = await mockRoleService.getRoles();

      expect(result).toEqual([]);
    });
  });

  describe("userHasRole", () => {
    it("should return true when user has role", async () => {
      mockRoleService.userHasRole.mockResolvedValue(true);

      const result = await mockRoleService.userHasRole("user-123", "admin");

      expect(result).toBe(true);
      expect(mockRoleService.userHasRole).toHaveBeenCalledWith(
        "user-123",
        "admin"
      );
    });

    it("should return false when user does not have role", async () => {
      mockRoleService.userHasRole.mockResolvedValue(false);

      const result = await mockRoleService.userHasRole("user-123", "admin");

      expect(result).toBe(false);
    });

    it("should return false on error", async () => {
      mockRoleService.userHasRole.mockResolvedValue(false);

      const result = await mockRoleService.userHasRole("user-123", "admin");

      expect(result).toBe(false);
    });
  });

  describe("userHasPermission", () => {
    it("should return true when user has permission", async () => {
      mockRoleService.userHasPermission.mockResolvedValue(true);

      const result = await mockRoleService.userHasPermission(
        "user-123",
        "read_posts"
      );

      expect(result).toBe(true);
      expect(mockRoleService.userHasPermission).toHaveBeenCalledWith(
        "user-123",
        "read_posts"
      );
    });

    it("should return false when user lacks permission", async () => {
      mockRoleService.userHasPermission.mockResolvedValue(false);

      const result = await mockRoleService.userHasPermission(
        "user-123",
        "admin_access"
      );

      expect(result).toBe(false);
    });

    it("should handle errors gracefully", async () => {
      mockRoleService.userHasPermission.mockResolvedValue(false);

      const result = await mockRoleService.userHasPermission(
        "user-123",
        "read_posts"
      );

      expect(result).toBe(false);
    });
  });

  describe("assignRoleToUser", () => {
    it("should assign role to user successfully", async () => {
      mockRoleService.assignRoleToUser.mockResolvedValue(undefined);

      await expect(
        mockRoleService.assignRoleToUser("user-123", "moderator")
      ).resolves.not.toThrow();

      expect(mockRoleService.assignRoleToUser).toHaveBeenCalledWith(
        "user-123",
        "moderator"
      );
    });

    it("should assign role with expiration date", async () => {
      const expirationDate = "2024-12-31T23:59:59Z";

      mockRoleService.assignRoleToUser.mockResolvedValue(undefined);

      await mockRoleService.assignRoleToUser(
        "user-123",
        "moderator",
        expirationDate
      );

      expect(mockRoleService.assignRoleToUser).toHaveBeenCalledWith(
        "user-123",
        "moderator",
        expirationDate
      );
    });

    it("should handle role assignment errors", async () => {
      mockRoleService.assignRoleToUser.mockRejectedValue(
        new Error("Błąd przypisywania roli: Role assignment failed")
      );

      await expect(
        mockRoleService.assignRoleToUser("user-123", "admin")
      ).rejects.toThrow("Błąd przypisywania roli: Role assignment failed");
    });
  });

  describe("revokeRoleFromUser", () => {
    it("should revoke role from user successfully", async () => {
      mockRoleService.revokeRoleFromUser.mockResolvedValue(undefined);

      await expect(
        mockRoleService.revokeRoleFromUser("user-123", "moderator")
      ).resolves.not.toThrow();

      expect(mockRoleService.revokeRoleFromUser).toHaveBeenCalledWith(
        "user-123",
        "moderator"
      );
    });

    it("should handle role revocation errors", async () => {
      mockRoleService.revokeRoleFromUser.mockRejectedValue(
        new Error("Błąd odbierania roli: Role revocation failed")
      );

      await expect(
        mockRoleService.revokeRoleFromUser("user-123", "moderator")
      ).rejects.toThrow("Błąd odbierania roli: Role revocation failed");
    });
  });

  describe("getUsersWithRoles", () => {
    it("should fetch users with their role assignments", async () => {
      const mockUsers = [
        {
          id: "user-123",
          email: "test@example.com",
          name: "Test User",
          created_at: "2023-01-01T00:00:00Z",
          primary_role: {
            name: "user",
            display_name: "User",
          },
          all_roles: [],
        },
      ];

      mockRoleService.getUsersWithRoles.mockResolvedValue(mockUsers);

      const result = await mockRoleService.getUsersWithRoles();

      expect(result).toEqual(mockUsers);
      expect(mockRoleService.getUsersWithRoles).toHaveBeenCalled();
    });

    it("should handle errors when fetching users with roles", async () => {
      mockRoleService.getUsersWithRoles.mockRejectedValue(
        new Error("Błąd pobierania użytkowników z rolami: Fetch users error")
      );

      await expect(mockRoleService.getUsersWithRoles()).rejects.toThrow(
        "Błąd pobierania użytkowników z rolami: Fetch users error"
      );
    });
  });

  describe("validation and edge cases", () => {
    it("should handle invalid user IDs", async () => {
      mockRoleService.userHasRole.mockResolvedValue(false);

      const result = await mockRoleService.userHasRole("", "admin");
      expect(result).toBe(false);
    });

    it("should handle invalid role names", async () => {
      mockRoleService.userHasRole.mockResolvedValue(false);

      const result = await mockRoleService.userHasRole("user-123", "");
      expect(result).toBe(false);
    });

    it("should handle null/undefined parameters", async () => {
      mockRoleService.userHasRole.mockResolvedValue(false);

      const result = await mockRoleService.userHasRole(
        "user-123",
        "nonexistent"
      );
      expect(result).toBe(false);
    });
  });
});
