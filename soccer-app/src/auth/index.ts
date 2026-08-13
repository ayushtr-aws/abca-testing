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
