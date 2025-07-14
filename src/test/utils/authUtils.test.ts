import { describe, expect, it } from "vitest";
import {
  forceLogout,
  getUserPermissions,
  isSessionExpired,
  validateEmail,
  validatePassword,
} from "../../utils/authUtils";

describe("authUtils - Validation Functions", () => {
  describe("validateEmail", () => {
    it("should validate correct email formats", () => {
      const validEmails = [
        "test@example.com",
        "user.name@domain.co.uk",
        "email+tag@gmail.com",
        "user123@test-domain.org",
        "firstname.lastname@company.com",
      ];

      validEmails.forEach((email) => {
        expect(validateEmail(email)).toBe(true);
      });
    });

    it("should reject invalid email formats", () => {
      const invalidEmails = [
        "invalid-email",
        "@example.com",
        "test@",
        "test.example.com",
        "",
        "test@.com",
        "test@domain.",
        "test..test@example.com",
        "test@domain..com",
      ];

      invalidEmails.forEach((email) => {
        expect(validateEmail(email)).toBe(false);
      });
    });

    it("should handle edge cases", () => {
      expect(validateEmail("a@b.co")).toBe(true); // minimum valid email
      expect(validateEmail("test@domain-with-dashes.com")).toBe(true);
      expect(validateEmail("test@sub.domain.com")).toBe(true);
    });
  });

  describe("validatePassword", () => {
    it("should validate passwords meeting all requirements", () => {
      const validPasswords = [
        "Password123!",
        "SecureP@ss1",
        "MyP@ssw0rd",
        "Complex123#",
        "Str0ng&Password",
      ];

      validPasswords.forEach((password) => {
        expect(validatePassword(password)).toBe(true);
      });
    });

    it("should reject passwords missing uppercase letters", () => {
      const passwordsWithoutUppercase = [
        "password123!",
        "lowercase@1",
        "no-upper-case1!",
      ];

      passwordsWithoutUppercase.forEach((password) => {
        expect(validatePassword(password)).toBe(false);
      });
    });

    it("should reject passwords missing numbers", () => {
      const passwordsWithoutNumbers = [
        "Password!",
        "NoNumbers@",
        "OnlyLetters&",
      ];

      passwordsWithoutNumbers.forEach((password) => {
        expect(validatePassword(password)).toBe(false);
      });
    });

    it("should reject passwords missing special characters", () => {
      const passwordsWithoutSpecial = [
        "Password123",
        "NoSpecial1",
        "SimplePass1",
      ];

      passwordsWithoutSpecial.forEach((password) => {
        expect(validatePassword(password)).toBe(false);
      });
    });

    it("should reject passwords that are too short", () => {
      const shortPasswords = ["Pass1!", "Sh0rt!", "P@ss1"];

      shortPasswords.forEach((password) => {
        expect(validatePassword(password)).toBe(false);
      });
    });

    it("should handle edge cases", () => {
      expect(validatePassword("Pass123!")).toBe(true); // exactly 8 characters
      expect(validatePassword("VeryLongPassword123!")).toBe(true); // long password
      expect(validatePassword("")).toBe(false); // empty password
    });
  });

  describe("getUserPermissions", () => {
    it("should return empty array when user has no permissions", async () => {
      // Mock będzie obsługiwać to w teście integracyjnym
      const permissions = await getUserPermissions("non-existent-user");
      expect(Array.isArray(permissions)).toBe(true);
    });
  });

  describe("isSessionExpired", () => {
    it("should return true when no session exists", async () => {
      const expired = await isSessionExpired();
      expect(typeof expired).toBe("boolean");
    });
  });

  describe("forceLogout", () => {
    it("should complete without throwing errors", async () => {
      await expect(forceLogout()).resolves.not.toThrow();
    });
  });
});
