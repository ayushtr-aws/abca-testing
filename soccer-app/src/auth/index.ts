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
