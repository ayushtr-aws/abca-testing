/**
 * Public entry point for the shared authentication and user-session model.
 */

export type { AuthStatus, User, UserSession, AuthState } from "./types";
export { authState } from "./types";
export {
  isValidEmail,
  isValidPassword,
  isValidUser,
  isValidSession,
  isSessionExpired,
  isSessionActive,
  deriveAuthState,
  isAuthenticated,
} from "./validation";

export type { AuthErrorCode, AuthError, AuthResult } from "./errors";
export {
  ok,
  fail,
  InvalidCredentialsError,
  AuthNetworkError,
} from "./errors";

export type { KeyValueStore, SessionStore } from "./storage";
export {
  SESSION_STORAGE_KEY,
  BrowserSessionStore,
  MemoryKeyValueStore,
  createDefaultSessionStore,
} from "./storage";

export type {
  Credentials,
  CredentialAuthenticator,
  AuthServiceOptions,
} from "./service";
export { AuthService, createAuthService } from "./service";

export type {
  DemoAccount,
  DemoAuthenticatorOptions,
} from "./demoAuthenticator";
export {
  DEFAULT_DEMO_ACCOUNTS,
  DEFAULT_SESSION_TTL_MS,
  DEMO_CREDENTIALS,
  createDemoAuthenticator,
  createFailingNetworkAuthenticator,
} from "./demoAuthenticator";

export type { AuthContextValue, AuthProviderProps } from "./AuthContext";
export { AuthProvider, useAuth, messageForError } from "./AuthContext";

export { createAppAuthService } from "./createAppAuthService";
