import { describe, it, expect } from "vitest";
import { authState } from "./types";
import type { UserSession, User } from "./types";
import {
  isValidEmail,
  isValidPassword,
  isValidUser,
  isValidSession,
  isSessionExpired,
  isSessionActive,
  deriveAuthState,
  isAuthenticated,
} from "./validation";

const validUser: User = {
  id: "u-1",
  email: "player@example.com",
  displayName: "Test Player",
};

function makeSession(overrides: Partial<UserSession> = {}): UserSession {
  return {
    user: validUser,
    token: "token-abc",
    expiresAt: 10_000,
    ...overrides,
  };
}

describe("authState constructors", () => {
  it("builds a loading state", () => {
    expect(authState.loading()).toEqual({ status: "loading" });
  });

  it("builds a signedOut state", () => {
    expect(authState.signedOut()).toEqual({ status: "signedOut" });
  });

  it("builds a signedIn state carrying the session", () => {
    const session = makeSession();
    expect(authState.signedIn(session)).toEqual({
      status: "signedIn",
      session,
    });
  });

  it("builds an expired state carrying the user", () => {
    expect(authState.expired(validUser)).toEqual({
      status: "expired",
      user: validUser,
    });
  });
});

describe("isValidEmail", () => {
  it("accepts well-formed addresses", () => {
    expect(isValidEmail("a@b.co")).toBe(true);
    expect(isValidEmail("  trimmed@example.com  ")).toBe(true);
  });

  it("rejects malformed or non-string values", () => {
    expect(isValidEmail("not-an-email")).toBe(false);
    expect(isValidEmail("missing@domain")).toBe(false);
    expect(isValidEmail("@no-local.com")).toBe(false);
    expect(isValidEmail("")).toBe(false);
    expect(isValidEmail(42)).toBe(false);
    expect(isValidEmail(null)).toBe(false);
  });
});

describe("isValidPassword", () => {
  it("accepts strings of at least 8 characters", () => {
    expect(isValidPassword("12345678")).toBe(true);
  });

  it("rejects short or non-string values", () => {
    expect(isValidPassword("short")).toBe(false);
    expect(isValidPassword("")).toBe(false);
    expect(isValidPassword(12345678)).toBe(false);
  });
});

describe("isValidUser", () => {
  it("accepts a well-formed user", () => {
    expect(isValidUser(validUser)).toBe(true);
  });

  it("rejects users with missing or invalid fields", () => {
    expect(isValidUser({ ...validUser, id: "" })).toBe(false);
    expect(isValidUser({ ...validUser, email: "bad" })).toBe(false);
    expect(isValidUser({ ...validUser, displayName: "   " })).toBe(false);
    expect(isValidUser(null)).toBe(false);
    expect(isValidUser("nope")).toBe(false);
  });
});

describe("isValidSession", () => {
  it("accepts a well-formed session", () => {
    expect(isValidSession(makeSession())).toBe(true);
  });

  it("rejects sessions with invalid structure", () => {
    expect(isValidSession(makeSession({ token: "" }))).toBe(false);
    expect(
      isValidSession(makeSession({ expiresAt: Number.NaN }))
    ).toBe(false);
    expect(isValidSession({ ...makeSession(), user: null })).toBe(false);
    expect(isValidSession(null)).toBe(false);
  });
});

describe("isSessionExpired", () => {
  it("is true when expiry is at or before now", () => {
    expect(isSessionExpired(makeSession({ expiresAt: 100 }), 100)).toBe(true);
    expect(isSessionExpired(makeSession({ expiresAt: 100 }), 200)).toBe(true);
  });

  it("is false when expiry is in the future", () => {
    expect(isSessionExpired(makeSession({ expiresAt: 100 }), 50)).toBe(false);
  });
});

describe("isSessionActive", () => {
  it("is true for a valid, non-expired session", () => {
    expect(isSessionActive(makeSession({ expiresAt: 100 }), 50)).toBe(true);
  });

  it("is false for an expired session", () => {
    expect(isSessionActive(makeSession({ expiresAt: 100 }), 150)).toBe(false);
  });

  it("is false for a structurally invalid session", () => {
    expect(isSessionActive(makeSession({ token: "" }), 50)).toBe(false);
  });
});

describe("deriveAuthState", () => {
  it("returns signedOut for null/undefined", () => {
    expect(deriveAuthState(null)).toEqual({ status: "signedOut" });
    expect(deriveAuthState(undefined)).toEqual({ status: "signedOut" });
  });

  it("returns signedOut for a structurally invalid session", () => {
    expect(deriveAuthState(makeSession({ token: "" }))).toEqual({
      status: "signedOut",
    });
  });

  it("returns expired (with user) for an expired session", () => {
    const session = makeSession({ expiresAt: 100 });
    expect(deriveAuthState(session, 200)).toEqual({
      status: "expired",
      user: validUser,
    });
  });

  it("returns signedIn for an active session", () => {
    const session = makeSession({ expiresAt: 100 });
    expect(deriveAuthState(session, 50)).toEqual({
      status: "signedIn",
      session,
    });
  });
});

describe("isAuthenticated", () => {
  it("is true only for signedIn state", () => {
    expect(isAuthenticated(authState.signedIn(makeSession()))).toBe(true);
    expect(isAuthenticated(authState.loading())).toBe(false);
    expect(isAuthenticated(authState.signedOut())).toBe(false);
    expect(isAuthenticated(authState.expired(validUser))).toBe(false);
  });
});
