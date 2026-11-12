/**
 * Shared authentication and user-session model.
 *
 * This module defines the typed states the application UI and service layer
 * use to reason about a user's authentication status. It is intentionally
 * free of React or framework code so it can be consumed by both the UI and
 * the service layer.
 */

/**
 * The distinct authentication states a session can be in.
 *
 * - `loading`  – authentication status is being determined (e.g. an in-flight
 *                request to restore a session on app start).
 * - `signedIn` – a valid, authenticated user session is active.
 * - `signedOut`– there is no authenticated user.
 * - `expired`  – there was an authenticated session but it has expired and the
 *                user must sign in again.
 */
export type AuthStatus = "loading" | "signedIn" | "signedOut" | "expired";

/** A minimal, authenticated user profile. */
export interface User {
  /** Stable unique identifier for the user. */
  id: string;
  /** The user's email address. */
  email: string;
  /** Human-readable display name. */
  displayName: string;
}

/**
 * An authenticated user session, including the tokens and expiry metadata
 * needed to keep the session alive and detect expiry.
 */
export interface UserSession {
  /** The authenticated user this session belongs to. */
  user: User;
  /** Opaque access token used to authorize requests. */
  token: string;
  /** Unix epoch (milliseconds) at which the session expires. */
  expiresAt: number;
}

/**
 * Discriminated union describing the full authentication state.
 * Consumers should switch on `status` to narrow to the relevant shape.
 */
export type AuthState =
  | { status: "loading" }
  | { status: "signedOut" }
  | { status: "signedIn"; session: UserSession }
  | { status: "expired"; user: User };

/** Convenience constructors for each authentication state. */
export const authState = {
  loading(): AuthState {
    return { status: "loading" };
  },
  signedOut(): AuthState {
    return { status: "signedOut" };
  },
  signedIn(session: UserSession): AuthState {
    return { status: "signedIn", session };
  },
  expired(user: User): AuthState {
    return { status: "expired", user };
  },
} as const;
