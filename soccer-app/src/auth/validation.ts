/**
 * Validation and state-derivation helpers for the authentication model.
 *
 * These are pure functions with no side effects, safe to use from both the
 * UI and the service layer.
 */

import type { AuthState, User, UserSession } from "./types";

/** Reasonably strict email pattern for client-side validation. */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Returns true when the given value is a syntactically valid email address. */
export function isValidEmail(email: unknown): email is string {
  return typeof email === "string" && EMAIL_PATTERN.test(email.trim());
}

/**
 * Returns true when the password meets the minimum policy: a non-empty string
 * of at least 8 characters.
 */
export function isValidPassword(password: unknown): password is string {
  return typeof password === "string" && password.length >= 8;
}

/** Returns true when the value is a well-formed {@link User}. */
export function isValidUser(value: unknown): value is User {
  if (typeof value !== "object" || value === null) return false;
  const user = value as Record<string, unknown>;
  return (
    typeof user.id === "string" &&
    user.id.length > 0 &&
    isValidEmail(user.email) &&
    typeof user.displayName === "string" &&
    user.displayName.trim().length > 0
  );
}

/**
 * Returns true when the value is a well-formed {@link UserSession}. This
 * validates structure only; use {@link isSessionExpired} to check expiry.
 */
export function isValidSession(value: unknown): value is UserSession {
  if (typeof value !== "object" || value === null) return false;
  const session = value as Record<string, unknown>;
  return (
    isValidUser(session.user) &&
    typeof session.token === "string" &&
    session.token.length > 0 &&
    typeof session.expiresAt === "number" &&
    Number.isFinite(session.expiresAt)
  );
}

/**
 * Returns true when the session has expired relative to `now`.
 *
 * @param session The session to inspect.
 * @param now     The reference time in Unix epoch milliseconds. Defaults to
 *                the current time.
 */
export function isSessionExpired(
  session: UserSession,
  now: number = Date.now()
): boolean {
  return session.expiresAt <= now;
}

/**
 * Returns true when the session is structurally valid and not expired.
 */
export function isSessionActive(
  session: UserSession,
  now: number = Date.now()
): boolean {
  return isValidSession(session) && !isSessionExpired(session, now);
}

/**
 * Derives the correct {@link AuthState} for a session relative to `now`.
 *
 * - A `null`/`undefined` session yields `signedOut`.
 * - A structurally invalid session yields `signedOut`.
 * - An expired session yields `expired` (carrying the user).
 * - Otherwise yields `signedIn`.
 */
export function deriveAuthState(
  session: UserSession | null | undefined,
  now: number = Date.now()
): AuthState {
  if (session == null || !isValidSession(session)) {
    return { status: "signedOut" };
  }
  if (isSessionExpired(session, now)) {
    return { status: "expired", user: session.user };
  }
  return { status: "signedIn", session };
}

/** Narrowing helper: true when the state represents an authenticated user. */
export function isAuthenticated(state: AuthState): boolean {
  return state.status === "signedIn";
}
