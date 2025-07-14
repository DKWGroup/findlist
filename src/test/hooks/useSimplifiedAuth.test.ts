import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useSimplifiedAuth } from "../../hooks/useSimplifiedAuth";
import { mockSupabaseAuth } from "../mocks/supabase";

describe("useSimplifiedAuth Hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  describe("initialization", () => {
    it("should initialize with loading state", () => {
      const { result } = renderHook(() => useSimplifiedAuth());

      expect(result.current.isLoading).toBe(true);
      expect(result.current.user).toBe(null);
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.error).toBe(null);
    });

    it("should set user when session exists", async () => {
      const mockUser = {
        id: "user-123",
        email: "test@example.com",
        created_at: "2023-01-01T00:00:00Z",
      };

      mockSupabaseAuth.getSession.mockResolvedValue({
        data: { session: { user: mockUser } },
        error: null,
      });

      const { result } = renderHook(() => useSimplifiedAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isAuthenticated).toBe(true);
    });

    it("should handle session retrieval errors", async () => {
      mockSupabaseAuth.getSession.mockRejectedValue(new Error("Session error"));

      const { result } = renderHook(() => useSimplifiedAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.user).toBe(null);
      expect(result.current.isAuthenticated).toBe(false);
    });
  });

  describe("login function", () => {
    it("should login successfully with valid credentials", async () => {
      const mockUser = {
        id: "user-123",
        email: "test@example.com",
      };

      mockSupabaseAuth.signInWithPassword.mockResolvedValue({
        data: { user: mockUser, session: { access_token: "token" } },
        error: null,
      });

      const { result } = renderHook(() => useSimplifiedAuth());

      let loginResult;
      await act(async () => {
        loginResult = await result.current.login({
          email: "test@example.com",
          password: "password123",
        });
      });

      expect(loginResult).toEqual({ success: true });
      expect(mockSupabaseAuth.signInWithPassword).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });
    });

    it("should handle login errors", async () => {
      mockSupabaseAuth.signInWithPassword.mockResolvedValue({
        data: { user: null, session: null },
        error: { message: "Invalid credentials" },
      });

      const { result } = renderHook(() => useSimplifiedAuth());

      let loginResult;
      await act(async () => {
        loginResult = await result.current.login({
          email: "test@example.com",
          password: "wrongpassword",
        });
      });

      expect(loginResult).toEqual({ success: false });
      expect(result.current.error).toBe("Invalid credentials");
    });

    it("should trim and lowercase email", async () => {
      mockSupabaseAuth.signInWithPassword.mockResolvedValue({
        data: { user: { id: "user-123" }, session: { access_token: "token" } },
        error: null,
      });

      const { result } = renderHook(() => useSimplifiedAuth());

      await act(async () => {
        await result.current.login({
          email: "  TEST@EXAMPLE.COM  ",
          password: "password123",
        });
      });

      expect(mockSupabaseAuth.signInWithPassword).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });
    });

    it("should handle network errors during login", async () => {
      mockSupabaseAuth.signInWithPassword.mockRejectedValue(
        new Error("Network error")
      );

      const { result } = renderHook(() => useSimplifiedAuth());

      let loginResult;
      await act(async () => {
        loginResult = await result.current.login({
          email: "test@example.com",
          password: "password123",
        });
      });

      expect(loginResult).toEqual({ success: false });
      expect(result.current.error).toBe("Network error");
    });
  });

  describe("logout function", () => {
    it("should logout successfully", async () => {
      mockSupabaseAuth.signOut.mockResolvedValue({ error: null });

      const { result } = renderHook(() => useSimplifiedAuth());

      await act(async () => {
        await result.current.logout();
      });

      expect(mockSupabaseAuth.signOut).toHaveBeenCalled();
    });

    it("should handle logout errors gracefully", async () => {
      mockSupabaseAuth.signOut.mockRejectedValue(new Error("Logout error"));

      const { result } = renderHook(() => useSimplifiedAuth());

      await act(async () => {
        await result.current.logout();
      });

      expect(mockSupabaseAuth.signOut).toHaveBeenCalled();
      // Should not throw error even if logout fails
    });
  });

  describe("register function", () => {
    it("should register successfully with valid data", async () => {
      mockSupabaseAuth.signUp.mockResolvedValue({
        data: { user: { id: "new-user" }, session: null },
        error: null,
      });

      const { result } = renderHook(() => useSimplifiedAuth());

      let registerResult;
      await act(async () => {
        registerResult = await result.current.register({
          email: "newuser@example.com",
          password: "Password123!",
          confirmPassword: "Password123!",
        });
      });

      expect(registerResult).toEqual({ success: true });
      expect(mockSupabaseAuth.signUp).toHaveBeenCalledWith({
        email: "newuser@example.com",
        password: "Password123!",
      });
    });

    it("should reject registration when passwords do not match", async () => {
      const { result } = renderHook(() => useSimplifiedAuth());

      let registerResult;
      await act(async () => {
        registerResult = await result.current.register({
          email: "newuser@example.com",
          password: "Password123!",
          confirmPassword: "DifferentPassword!",
        });
      });

      expect(registerResult).toEqual({ success: false });
      expect(result.current.error).toBe("Hasła nie są identyczne");
      expect(mockSupabaseAuth.signUp).not.toHaveBeenCalled();
    });

    it("should handle registration errors", async () => {
      mockSupabaseAuth.signUp.mockResolvedValue({
        data: { user: null, session: null },
        error: { message: "Email already exists" },
      });

      const { result } = renderHook(() => useSimplifiedAuth());

      let registerResult;
      await act(async () => {
        registerResult = await result.current.register({
          email: "existing@example.com",
          password: "Password123!",
          confirmPassword: "Password123!",
        });
      });

      expect(registerResult).toEqual({ success: false });
      expect(result.current.error).toBe("Email already exists");
    });
  });

  describe("password validation", () => {
    it("should validate strong passwords", () => {
      const { result } = renderHook(() => useSimplifiedAuth());

      const strongPasswords = ["Password123!", "SecureP@ss1", "MyStr0ng#Pass"];

      strongPasswords.forEach((password) => {
        expect(result.current.validatePassword(password)).toBe(true);
      });
    });

    it("should reject weak passwords", () => {
      const { result } = renderHook(() => useSimplifiedAuth());

      const weakPasswords = [
        "password", // no uppercase, no number, no special char
        "PASSWORD", // no lowercase, no number, no special char
        "Password", // no number, no special char
        "Password123", // no special char
        "Pass123!", // too short
        "", // empty
      ];

      weakPasswords.forEach((password) => {
        expect(result.current.validatePassword(password)).toBe(false);
      });
    });
  });

  describe("resetPassword function", () => {
    it("should send reset password email successfully", async () => {
      mockSupabaseAuth.resetPasswordForEmail.mockResolvedValue({
        data: {},
        error: null,
      });

      const { result } = renderHook(() => useSimplifiedAuth());

      let resetResult;
      await act(async () => {
        resetResult = await result.current.resetPassword("test@example.com");
      });

      expect(resetResult).toEqual({ success: true });
      expect(mockSupabaseAuth.resetPasswordForEmail).toHaveBeenCalledWith(
        "test@example.com",
        { redirectTo: "http://localhost:3000/update-password" }
      );
    });

    it("should handle reset password errors", async () => {
      mockSupabaseAuth.resetPasswordForEmail.mockResolvedValue({
        data: {},
        error: { message: "Email not found" },
      });

      const { result } = renderHook(() => useSimplifiedAuth());

      let resetResult;
      await act(async () => {
        resetResult = await result.current.resetPassword(
          "nonexistent@example.com"
        );
      });

      expect(resetResult).toEqual({ success: false });
      expect(result.current.error).toBe("Email not found");
    });
  });

  describe("updatePassword function", () => {
    it("should update password successfully", async () => {
      mockSupabaseAuth.updateUser.mockResolvedValue({
        data: { user: { id: "user-123" } },
        error: null,
      });

      const { result } = renderHook(() => useSimplifiedAuth());

      let updateResult;
      await act(async () => {
        updateResult = await result.current.updatePassword("NewPassword123!");
      });

      expect(updateResult).toEqual({ success: true });
      expect(mockSupabaseAuth.updateUser).toHaveBeenCalledWith({
        password: "NewPassword123!",
      });
    });

    it("should handle password update errors", async () => {
      mockSupabaseAuth.updateUser.mockResolvedValue({
        data: { user: null },
        error: { message: "Password update failed" },
      });

      const { result } = renderHook(() => useSimplifiedAuth());

      let updateResult;
      await act(async () => {
        updateResult = await result.current.updatePassword("NewPassword123!");
      });

      expect(updateResult).toEqual({ success: false });
      expect(result.current.error).toBe("Password update failed");
    });
  });
});
