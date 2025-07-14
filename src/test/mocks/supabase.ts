import { vi } from "vitest";

// Set up default mock responses
export const mockSupabaseAuth = {
  signInWithPassword: vi.fn().mockResolvedValue({
    data: {
      user: { id: "test-user", email: "test@example.com" },
      session: { access_token: "token" },
    },
    error: null,
  }),
  signUp: vi.fn().mockResolvedValue({
    data: {
      user: { id: "test-user", email: "test@example.com" },
      session: null,
    },
    error: null,
  }),
  signOut: vi.fn().mockResolvedValue({ error: null }),
  resetPasswordForEmail: vi.fn().mockResolvedValue({ data: {}, error: null }),
  updateUser: vi.fn().mockResolvedValue({
    data: { user: { id: "test-user", email: "test@example.com" } },
    error: null,
  }),
  getSession: vi.fn().mockResolvedValue({
    data: {
      session: { access_token: "token", expires_at: Date.now() + 3600000 },
    },
    error: null,
  }),
  getUser: vi.fn().mockResolvedValue({
    data: { user: { id: "test-user", email: "test@example.com" } },
    error: null,
  }),
  refreshSession: vi.fn().mockResolvedValue({
    data: { session: { access_token: "new-token" } },
    error: null,
  }),
  onAuthStateChange: vi.fn(() => ({
    data: { subscription: { unsubscribe: vi.fn() } },
  })),
};

export const mockSupabaseFrom = vi.fn(() => ({
  select: vi.fn().mockReturnThis(),
  insert: vi.fn().mockReturnThis(),
  update: vi.fn().mockReturnThis(),
  delete: vi.fn().mockReturnThis(),
  eq: vi.fn().mockReturnThis(),
  neq: vi.fn().mockReturnThis(),
  gt: vi.fn().mockReturnThis(),
  gte: vi.fn().mockReturnThis(),
  lt: vi.fn().mockReturnThis(),
  lte: vi.fn().mockReturnThis(),
  like: vi.fn().mockReturnThis(),
  ilike: vi.fn().mockReturnThis(),
  is: vi.fn().mockReturnThis(),
  in: vi.fn().mockReturnThis(),
  contains: vi.fn().mockReturnThis(),
  containedBy: vi.fn().mockReturnThis(),
  range: vi.fn().mockReturnThis(),
  match: vi.fn().mockReturnThis(),
  not: vi.fn().mockReturnThis(),
  or: vi.fn().mockReturnThis(),
  filter: vi.fn().mockReturnThis(),
  order: vi.fn().mockReturnThis(),
  limit: vi.fn().mockReturnThis(),
  single: vi
    .fn()
    .mockResolvedValue({ data: { id: 1, permission: "read" }, error: null }),
  maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
}));

export const mockSupabaseRpc = vi
  .fn()
  .mockResolvedValue({ data: [], error: null });

export const mockSupabase = {
  auth: mockSupabaseAuth,
  from: mockSupabaseFrom,
  rpc: mockSupabaseRpc,
};

// Mock the entire supabase module
vi.mock("../services/supabaseStorage", () => ({
  supabase: mockSupabase,
}));

export { mockSupabase as supabase };
