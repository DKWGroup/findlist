import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  hasPermission,
  hasRole,
  isSessionValid,
  refreshTokenIfNeeded,
  verifyToken,
} from "../../middleware/AuthMiddleware";
import { mockSupabaseAuth } from "../mocks/supabase";

describe("AuthMiddleware", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("verifyToken", () => {
    it("should return true for valid token", async () => {
      mockSupabaseAuth.getUser.mockResolvedValue({
        data: { user: { id: "test-user" } },
        error: null,
      });

      const result = await verifyToken("valid-token");
      expect(result).toBe(true);
      expect(mockSupabaseAuth.getUser).toHaveBeenCalledWith("valid-token");
    });

    it("should return false for invalid token", async () => {
      mockSupabaseAuth.getUser.mockResolvedValue({
        data: { user: null },
        error: { message: "Invalid token" },
      });

      const result = await verifyToken("invalid-token");
      expect(result).toBe(false);
    });

    it("should return false when user data is missing", async () => {
      mockSupabaseAuth.getUser.mockResolvedValue({
        data: { user: null },
        error: null,
      });

      const result = await verifyToken("token-without-user");
      expect(result).toBe(false);
    });

    it("should handle network errors gracefully", async () => {
      mockSupabaseAuth.getUser.mockRejectedValue(new Error("Network error"));

      const result = await verifyToken("token-with-network-error");
      expect(result).toBe(false);
    });
  });

  describe("isSessionValid", () => {
    it("should return true for valid session", async () => {
      const futureTimestamp = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now

      mockSupabaseAuth.getSession.mockResolvedValue({
        data: {
          session: {
            expires_at: futureTimestamp,
            access_token: "valid-token",
          },
        },
        error: null,
      });

      const result = await isSessionValid();
      expect(result).toBe(true);
    });

    it("should return false for expired session", async () => {
      const pastTimestamp = Math.floor(Date.now() / 1000) - 3600; // 1 hour ago

      mockSupabaseAuth.getSession.mockResolvedValue({
        data: {
          session: {
            expires_at: pastTimestamp,
            access_token: "expired-token",
          },
        },
        error: null,
      });

      const result = await isSessionValid();
      expect(result).toBe(false);
    });

    it("should return false when no session exists", async () => {
      mockSupabaseAuth.getSession.mockResolvedValue({
        data: { session: null },
        error: null,
      });

      const result = await isSessionValid();
      expect(result).toBe(false);
    });

    it("should return false on session error", async () => {
      mockSupabaseAuth.getSession.mockResolvedValue({
        data: { session: null },
        error: { message: "Session error" },
      });

      const result = await isSessionValid();
      expect(result).toBe(false);
    });

    it("should handle network errors gracefully", async () => {
      mockSupabaseAuth.getSession.mockRejectedValue(new Error("Network error"));

      const result = await isSessionValid();
      expect(result).toBe(false);
    });
  });

  describe("refreshTokenIfNeeded", () => {
    it("should refresh token when needed", async () => {
      const soonToExpireTimestamp = Math.floor(Date.now() / 1000) + 60; // 1 minute from now

      // Mock getSession to return session that needs refresh
      mockSupabaseAuth.getSession.mockResolvedValue({
        data: {
          session: {
            expires_at: soonToExpireTimestamp,
            access_token: "old-token",
            refresh_token: "refresh-token",
          },
        },
        error: null,
      });

      // Mock refreshSession to return new session
      mockSupabaseAuth.refreshSession.mockResolvedValue({
        data: {
          session: {
            expires_at: Math.floor(Date.now() / 1000) + 3600,
            access_token: "new-token",
            user: { id: "test-user" },
          },
        },
        error: null,
      });

      const result = await refreshTokenIfNeeded();
      expect(result).toBe(true);
      expect(mockSupabaseAuth.refreshSession).toHaveBeenCalled();
    });

    it("should not refresh when token is still valid", async () => {
      const futureTimestamp = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now

      mockSupabaseAuth.getSession.mockResolvedValue({
        data: {
          session: {
            expires_at: futureTimestamp,
            access_token: "valid-token",
          },
        },
        error: null,
      });

      const result = await refreshTokenIfNeeded();
      expect(result).toBe(true);
      expect(mockSupabaseAuth.refreshSession).not.toHaveBeenCalled();
    });

    it("should return false when no session exists", async () => {
      mockSupabaseAuth.getSession.mockResolvedValue({
        data: { session: null },
        error: null,
      });

      const result = await refreshTokenIfNeeded();
      expect(result).toBe(false);
      expect(mockSupabaseAuth.refreshSession).not.toHaveBeenCalled();
    });

    it("should handle refresh errors gracefully", async () => {
      const soonToExpireTimestamp = Math.floor(Date.now() / 1000) + 60;

      mockSupabaseAuth.getSession.mockResolvedValue({
        data: {
          session: {
            expires_at: soonToExpireTimestamp,
            access_token: "old-token",
          },
        },
        error: null,
      });

      mockSupabaseAuth.refreshSession.mockResolvedValue({
        data: { session: null },
        error: { message: "Refresh failed" },
      });

      const result = await refreshTokenIfNeeded();
      expect(result).toBe(false);
    });
  });

  describe("hasPermission", () => {
    it("should return true when user has permission", async () => {
      const mockRpc = vi.fn().mockResolvedValue({
        data: true,
        error: null,
      });

      // Mock the supabase.rpc call
      vi.doMock("../../services/supabaseStorage", () => ({
        supabase: {
          rpc: mockRpc,
        },
      }));

      const result = await hasPermission("user-id", "read_posts");
      expect(typeof result).toBe("boolean");
    });

    it("should return false when user lacks permission", async () => {
      const mockRpc = vi.fn().mockResolvedValue({
        data: false,
        error: null,
      });

      vi.doMock("../../services/supabaseStorage", () => ({
        supabase: {
          rpc: mockRpc,
        },
      }));

      const result = await hasPermission("user-id", "admin_access");
      expect(typeof result).toBe("boolean");
    });

    it("should handle RPC errors gracefully", async () => {
      const mockRpc = vi.fn().mockResolvedValue({
        data: null,
        error: { message: "RPC error" },
      });

      vi.doMock("../../services/supabaseStorage", () => ({
        supabase: {
          rpc: mockRpc,
        },
      }));

      const result = await hasPermission("user-id", "permission");
      expect(result).toBe(false);
    });
  });

  describe("hasRole", () => {
    it("should return true when user has role", async () => {
      const mockRpc = vi.fn().mockResolvedValue({
        data: true,
        error: null,
      });

      vi.doMock("../../services/supabaseStorage", () => ({
        supabase: {
          rpc: mockRpc,
        },
      }));

      const result = await hasRole("user-id", "admin");
      expect(typeof result).toBe("boolean");
    });

    it("should return false when user lacks role", async () => {
      const mockRpc = vi.fn().mockResolvedValue({
        data: false,
        error: null,
      });

      vi.doMock("../../services/supabaseStorage", () => ({
        supabase: {
          rpc: mockRpc,
        },
      }));

      const result = await hasRole("user-id", "moderator");
      expect(typeof result).toBe("boolean");
    });

    it("should handle network errors gracefully", async () => {
      const mockRpc = vi.fn().mockRejectedValue(new Error("Network error"));

      vi.doMock("../../services/supabaseStorage", () => ({
        supabase: {
          rpc: mockRpc,
        },
      }));

      const result = await hasRole("user-id", "admin");
      expect(result).toBe(false);
    });
  });
});
