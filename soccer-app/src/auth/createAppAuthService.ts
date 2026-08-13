/**
 * Builds the {@link AuthService} the running application uses.
 *
 * It wires the shared service to the demo authenticator (there is no backend)
 * and the default session store (browser `sessionStorage`, in-memory fallback).
 * Kept separate from React so it can be constructed once and passed to the
 * {@link AuthProvider}.
 */

import { createAuthService, type AuthService } from "./service";
import { createDemoAuthenticator } from "./demoAuthenticator";

/** Creates the application's default authentication service. */
export function createAppAuthService(): AuthService {
  return createAuthService({
    // A small, realistic delay so the loading state is observable.
    authenticator: createDemoAuthenticator({ latencyMs: 400 }),
  });
}
