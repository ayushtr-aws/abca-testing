/**
 * A demo {@link CredentialAuthenticator} that stands in for a real backend.
 *
 * The application has no server, so authentication is resolved locally against
 * a small, in-memory directory of demo accounts. It faithfully models the two
 * failure modes the service maps onto typed errors:
 *
 * - unknown email / wrong password  → {@link InvalidCredentialsError}
 * - a simulated transport failure   → {@link AuthNetworkError}
 *
 * On success it mints a {@link UserSession} whose token is opaque and whose
 * expiry is a fixed lifetime past "now", so session expiry and restoration can
 * be exercised end-to-end.
 */

import type { UserSession, User } from "./types";
import type { CredentialAuthenticator, Credentials } from "./service";
import { AuthNetworkError, InvalidCredentialsError } from "./errors";

/** A demo account: a user profile plus the password that authenticates it. */
export interface DemoAccount {
  user: User;
  password: string;
}

/** Options for {@link createDemoAuthenticator}. */
export interface DemoAuthenticatorOptions {
  /** The accounts recognised by the authenticator. */
  accounts?: readonly DemoAccount[];
  /** Session lifetime in milliseconds. Defaults to one hour. */
  sessionTtlMs?: number;
  /** Clock used to compute session expiry. Defaults to `Date.now`. */
  now?: () => number;
  /**
   * Simulated network latency in milliseconds. Defaults to `0` so tests are
   * fast; the real app can pass a small value for a more realistic feel.
   */
  latencyMs?: number;
}

/** One hour, the default demo session lifetime. */
export const DEFAULT_SESSION_TTL_MS = 60 * 60 * 1000;

/**
 * The credentials of the built-in demo account, surfaced so the sign-in screen
 * and tests can reference a single source of truth.
 */
export const DEMO_CREDENTIALS: Credentials = {
  email: "fan@soccer.app",
  password: "goalkeeper",
};

/** The default account directory: a single demo fan account. */
export const DEFAULT_DEMO_ACCOUNTS: readonly DemoAccount[] = [
  {
    user: {
      id: "demo-fan",
      email: DEMO_CREDENTIALS.email,
      displayName: "Soccer Fan",
    },
    password: DEMO_CREDENTIALS.password,
  },
];

let tokenCounter = 0;

/** Generates an opaque, unique-enough demo token. */
function mintToken(): string {
  tokenCounter += 1;
  return `demo-${Date.now().toString(36)}-${tokenCounter.toString(36)}`;
}

function delay(ms: number): Promise<void> {
  if (ms <= 0) return Promise.resolve();
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Creates a {@link CredentialAuthenticator} backed by an in-memory directory of
 * demo accounts. Email comparison is case-insensitive and trims surrounding
 * whitespace; passwords must match exactly.
 */
export function createDemoAuthenticator(
  options: DemoAuthenticatorOptions = {}
): CredentialAuthenticator {
  const accounts = options.accounts ?? DEFAULT_DEMO_ACCOUNTS;
  const ttl = options.sessionTtlMs ?? DEFAULT_SESSION_TTL_MS;
  const now = options.now ?? Date.now;
  const latency = options.latencyMs ?? 0;

  return async function authenticate(
    credentials: Credentials
  ): Promise<UserSession> {
    await delay(latency);

    const email = credentials.email.trim().toLowerCase();
    const account = accounts.find(
      (candidate) => candidate.user.email.toLowerCase() === email
    );

    if (!account || account.password !== credentials.password) {
      throw new InvalidCredentialsError();
    }

    return {
      user: account.user,
      token: mintToken(),
      expiresAt: now() + ttl,
    };
  };
}

/**
 * A {@link CredentialAuthenticator} that always fails with a network error.
 * Useful for exercising the "service unreachable" branch in tests.
 */
export function createFailingNetworkAuthenticator(): CredentialAuthenticator {
  return async function authenticate(): Promise<UserSession> {
    throw new AuthNetworkError();
  };
}
