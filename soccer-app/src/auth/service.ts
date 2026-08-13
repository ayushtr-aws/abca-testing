/**
 * Authentication service operations.
 *
 * This is the stable service contract the UI depends on. It exposes three
 * operations:
 *
 * - {@link AuthService.signIn}       – submit credentials and, on success,
 *                                      persist and return the session.
 * - {@link AuthService.restore}      – restore a previously persisted session,
 *                                      resolving its current auth state.
 * - {@link AuthService.signOut}      – clear the persisted session.
 *
 * Every operation returns an {@link AuthResult}: expected failures are modelled
 * as typed errors rather than thrown exceptions, so callers get deterministic,
 * exhaustively-handleable outcomes. The service is framework-agnostic and
 * accepts its authenticator and session store via dependency injection, which
 * keeps it fully testable without a network or a browser.
 */

import type { AuthState, UserSession } from "./types";
import {
  deriveAuthState,
  isValidEmail,
  isValidPassword,
  isValidSession,
} from "./validation";
import {
  AuthNetworkError,
  InvalidCredentialsError,
  fail,
  ok,
  type AuthResult,
} from "./errors";
import {
  createDefaultSessionStore,
  type SessionStore,
} from "./storage";

/** Credentials submitted to {@link AuthService.signIn}. */
export interface Credentials {
  email: string;
  password: string;
}

/**
 * Authenticates credentials against some backend and returns a session.
 *
 * Implementations should:
 * - resolve with a {@link UserSession} on success;
 * - throw {@link InvalidCredentialsError} when the credentials are rejected;
 * - throw {@link AuthNetworkError} (or any error) on transport failures.
 *
 * The service maps these outcomes onto deterministic {@link AuthResult}s.
 */
export type CredentialAuthenticator = (
  credentials: Credentials
) => Promise<UserSession>;

/** Options for constructing an {@link AuthService}. */
export interface AuthServiceOptions {
  /** Authenticates credentials against a backend. */
  authenticator: CredentialAuthenticator;
  /**
   * Where sessions are persisted. Defaults to the browser session store
   * (in-memory fallback outside the browser).
   */
  store?: SessionStore;
  /**
   * Clock used to evaluate session expiry. Defaults to `Date.now`. Injectable
   * for deterministic tests.
   */
  now?: () => number;
}

/**
 * The authentication service. Construct one via {@link createAuthService}.
 */
export class AuthService {
  private readonly authenticator: CredentialAuthenticator;
  private readonly store: SessionStore;
  private readonly now: () => number;

  constructor(options: AuthServiceOptions) {
    this.authenticator = options.authenticator;
    this.store = options.store ?? createDefaultSessionStore();
    this.now = options.now ?? Date.now;
  }

  /**
   * Submits credentials for authentication.
   *
   * On success the returned session is persisted and returned. Local
   * validation runs first so obviously malformed input never reaches the
   * authenticator.
   */
  async signIn(credentials: Credentials): Promise<AuthResult<UserSession>> {
    if (!isValidEmail(credentials?.email)) {
      return fail("invalid_input", "A valid email address is required.");
    }
    if (!isValidPassword(credentials?.password)) {
      return fail(
        "invalid_input",
        "Password must be at least 8 characters long."
      );
    }

    let session: UserSession;
    try {
      session = await this.authenticator({
        email: credentials.email.trim(),
        password: credentials.password,
      });
    } catch (cause) {
      return this.mapAuthenticatorError(cause);
    }

    if (!isValidSession(session)) {
      return fail(
        "unknown",
        "The authentication service returned an invalid session.",
        session
      );
    }

    const persisted = this.persist(session);
    if (!persisted.ok) {
      return persisted;
    }
    return ok(session);
  }

  /**
   * Restores the persisted session and resolves its current auth state.
   *
   * - Returns `signedIn` when an active session is found.
   * - Returns a `session_expired` failure (and clears the stale session) when
   *   the persisted session has expired.
   * - Returns a `no_session` failure when nothing is persisted.
   */
  restore(): AuthResult<AuthState> {
    let session: UserSession | null;
    try {
      session = this.store.load();
    } catch (cause) {
      return fail("storage_error", "Failed to read the persisted session.", cause);
    }

    if (session == null) {
      return fail("no_session", "There is no persisted session to restore.");
    }

    const state = deriveAuthState(session, this.now());
    if (state.status === "expired") {
      // Proactively clear the stale session so it cannot be reused.
      this.store.clear();
      return fail("session_expired", "The persisted session has expired.");
    }
    if (state.status === "signedOut") {
      // Structurally invalid despite passing the store's own check; clear it.
      this.store.clear();
      return fail("no_session", "There is no persisted session to restore.");
    }
    return ok(state);
  }

  /**
   * Signs the current user out by clearing the persisted session. This is
   * idempotent: clearing when already signed out is a success.
   */
  signOut(): AuthResult<void> {
    try {
      this.store.clear();
    } catch (cause) {
      return fail("storage_error", "Failed to clear the persisted session.", cause);
    }
    return ok(undefined);
  }

  /** Persists a session, mapping storage failures to a deterministic error. */
  private persist(session: UserSession): AuthResult<void> {
    try {
      this.store.save(session);
    } catch (cause) {
      return fail("storage_error", "Failed to persist the session.", cause);
    }
    return ok(undefined);
  }

  /** Maps an authenticator exception onto a deterministic {@link AuthResult}. */
  private mapAuthenticatorError<T>(cause: unknown): AuthResult<T> {
    if (cause instanceof InvalidCredentialsError) {
      return fail("invalid_credentials", cause.message, cause);
    }
    if (cause instanceof AuthNetworkError) {
      return fail("network_error", cause.message, cause);
    }
    return fail(
      "unknown",
      "Sign-in failed due to an unexpected error.",
      cause
    );
  }
}

/** Convenience factory mirroring the constructor. */
export function createAuthService(options: AuthServiceOptions): AuthService {
  return new AuthService(options);
}
