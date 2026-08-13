/**
 * React binding for the framework-agnostic {@link AuthService}.
 *
 * This module adapts the imperative, result-returning service into the
 * declarative model React components want: a single {@link AuthState} plus
 * async `signIn`/`signOut` actions and a human-friendly error message.
 *
 * Responsibilities:
 * - restore any persisted session on mount (session restoration), moving from
 *   `loading` to `signedIn`/`signedOut`/`expired`;
 * - expose `signIn`, which on success flips the app to `signedIn` and on
 *   failure surfaces a user-facing message without changing the signed-out
 *   state;
 * - expose `signOut`, which returns to `signedOut` and clears any error.
 *
 * The provider accepts an {@link AuthService} so tests can inject a service
 * wired to an in-memory store and a fake authenticator, and so the real app
 * can supply the demo authenticator.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ReactNode } from "react";
import type { AuthState } from "./types";
import { authState } from "./types";
import type { AuthService, Credentials } from "./service";
import type { AuthError, AuthErrorCode } from "./errors";

/** The value exposed by {@link useAuth}. */
export interface AuthContextValue {
  /** The current authentication state. */
  state: AuthState;
  /**
   * A user-facing error message for the most recent failed sign-in or a
   * restored-but-expired session, or `null` when there is nothing to show.
   */
  error: string | null;
  /** True while an auth action (restore or sign-in) is in flight. */
  busy: boolean;
  /**
   * Submits credentials. Resolves `true` on success and `false` on failure;
   * on failure {@link AuthContextValue.error} is populated. Never rejects.
   */
  signIn: (credentials: Credentials) => Promise<boolean>;
  /** Signs the current user out and clears any error. */
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/** Maps a service {@link AuthError} onto a message safe to show to users. */
export function messageForError(error: AuthError): string {
  const byCode: Record<AuthErrorCode, string> = {
    invalid_input: "Please check your email and password and try again.",
    invalid_credentials: "The email or password is incorrect.",
    network_error:
      "We couldn't reach the sign-in service. Check your connection and try again.",
    no_session: "Please sign in to continue.",
    session_expired: "Your session expired. Please sign in again.",
    storage_error:
      "We couldn't save your session on this device. Please try again.",
    unknown: "Something went wrong signing in. Please try again.",
  };
  return byCode[error.code] ?? byCode.unknown;
}

export interface AuthProviderProps {
  /** The service used to perform auth operations. */
  service: AuthService;
  children: ReactNode;
}

/**
 * Provides authentication state and actions to the tree. Restores any
 * persisted session once on mount.
 */
export function AuthProvider({ service, children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>(() => authState.loading());
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(true);

  // Guard against setting state after unmount (e.g. StrictMode double-invoke
  // in development, or a fast unmount in tests).
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  // Restore a persisted session on mount (session restoration).
  useEffect(() => {
    const result = service.restore();
    if (!mounted.current) return;

    if (result.ok) {
      setState(result.value);
      setError(null);
    } else if (result.error.code === "session_expired") {
      // A session existed but has expired: surface a prompt to sign in again.
      setState(authState.signedOut());
      setError(messageForError(result.error));
    } else {
      // no_session / storage_error: land signed out without a scary message.
      setState(authState.signedOut());
      setError(null);
    }
    setBusy(false);
  }, [service]);

  const signIn = useCallback(
    async (credentials: Credentials): Promise<boolean> => {
      setBusy(true);
      setError(null);
      const result = await service.signIn(credentials);
      if (!mounted.current) return result.ok;

      if (result.ok) {
        setState(authState.signedIn(result.value));
        setError(null);
        setBusy(false);
        return true;
      }
      setError(messageForError(result.error));
      setBusy(false);
      return false;
    },
    [service]
  );

  const signOut = useCallback(() => {
    service.signOut();
    if (!mounted.current) return;
    setState(authState.signedOut());
    setError(null);
    setBusy(false);
  }, [service]);

  const value = useMemo<AuthContextValue>(
    () => ({ state, error, busy, signIn, signOut }),
    [state, error, busy, signIn, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Accesses the current auth context. Throws if used outside an
 * {@link AuthProvider} so misuse fails fast during development.
 */
export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext);
  if (value == null) {
    throw new Error("useAuth must be used within an <AuthProvider>.");
  }
  return value;
}
