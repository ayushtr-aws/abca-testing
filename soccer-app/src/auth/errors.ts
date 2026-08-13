/**
 * Deterministic error model for the authentication service.
 *
 * The service never throws for expected failure modes. Instead every
 * operation returns an {@link AuthResult}, so callers get a stable, typed
 * outcome they can switch on. Unexpected/underlying failures are captured on
 * {@link AuthError.cause} while still being mapped to a known {@link AuthErrorCode}.
 */

/**
 * The closed set of failure reasons the service can report.
 *
 * - `invalid_input`        – the supplied credentials failed local validation.
 * - `invalid_credentials`  – the authenticator rejected the credentials.
 * - `network_error`        – the authenticator could not be reached.
 * - `no_session`           – there is no persisted session to restore.
 * - `session_expired`      – a persisted session existed but has expired.
 * - `storage_error`        – reading from or writing to persistence failed.
 * - `unknown`              – an unexpected error the service could not classify.
 */
export type AuthErrorCode =
  | "invalid_input"
  | "invalid_credentials"
  | "network_error"
  | "no_session"
  | "session_expired"
  | "storage_error"
  | "unknown";

/** A structured, serializable authentication error. */
export interface AuthError {
  /** Stable, machine-readable classification of the failure. */
  code: AuthErrorCode;
  /** Human-readable description, safe to surface to developers/logs. */
  message: string;
  /** The underlying error, if any, preserved for diagnostics. */
  cause?: unknown;
}

/**
 * Discriminated result type returned by every service operation.
 *
 * Callers switch on `ok` to narrow to either the success `value` or the
 * failure `error`.
 */
export type AuthResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: AuthError };

/** Builds a successful {@link AuthResult}. */
export function ok<T>(value: T): AuthResult<T> {
  return { ok: true, value };
}

/** Builds a failed {@link AuthResult} carrying a structured {@link AuthError}. */
export function fail<T = never>(
  code: AuthErrorCode,
  message: string,
  cause?: unknown
): AuthResult<T> {
  const error: AuthError = { code, message };
  if (cause !== undefined) {
    error.cause = cause;
  }
  return { ok: false, error };
}

/**
 * Error thrown by a {@link CredentialAuthenticator} to signal that the
 * credentials were understood but rejected (as opposed to a transport
 * failure). The service maps this to the `invalid_credentials` code.
 */
export class InvalidCredentialsError extends Error {
  constructor(message = "The email or password is incorrect.") {
    super(message);
    this.name = "InvalidCredentialsError";
  }
}

/**
 * Error thrown by a {@link CredentialAuthenticator} to signal that the
 * authentication endpoint could not be reached. The service maps this to the
 * `network_error` code.
 */
export class AuthNetworkError extends Error {
  constructor(message = "Unable to reach the authentication service.", cause?: unknown) {
    super(message);
    this.name = "AuthNetworkError";
    if (cause !== undefined) {
      this.cause = cause;
    }
  }
}
