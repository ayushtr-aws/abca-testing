/**
 * Unit coverage for the React auth binding, independent of the app shell.
 */

import { describe, it, expect } from "vitest";
import { render, screen, act, waitFor } from "@testing-library/react";
import { AuthProvider, useAuth, messageForError } from "./AuthContext";
import { createAuthService } from "./service";
import { BrowserSessionStore, MemoryKeyValueStore } from "./storage";
import {
  createDemoAuthenticator,
  createFailingNetworkAuthenticator,
  DEMO_CREDENTIALS,
} from "./demoAuthenticator";
import type { SessionStore } from "./storage";
import type { AuthService } from "./service";
import type { CredentialAuthenticator } from "./service";

function makeService(opts: {
  authenticator?: CredentialAuthenticator;
  store?: SessionStore;
  now?: () => number;
} = {}): AuthService {
  return createAuthService({
    authenticator: opts.authenticator ?? createDemoAuthenticator({ now: opts.now }),
    store: opts.store ?? new BrowserSessionStore(new MemoryKeyValueStore()),
    now: opts.now,
  });
}

/** A tiny probe component that renders the context for assertions. */
function Probe() {
  const { state, error, busy, signIn, signOut } = useAuth();
  return (
    <div>
      <span data-testid="status">{state.status}</span>
      <span data-testid="busy">{String(busy)}</span>
      <span data-testid="error">{error ?? ""}</span>
      <button onClick={() => void signIn(DEMO_CREDENTIALS)}>signin</button>
      <button onClick={() => signOut()}>signout</button>
    </div>
  );
}

function renderProbe(service: AuthService) {
  return render(
    <AuthProvider service={service}>
      <Probe />
    </AuthProvider>
  );
}

describe("messageForError", () => {
  it("maps each error code to a user-facing message", () => {
    expect(messageForError({ code: "invalid_credentials", message: "" })).toMatch(
      /incorrect/i
    );
    expect(messageForError({ code: "network_error", message: "" })).toMatch(
      /reach the sign-in service/i
    );
    expect(messageForError({ code: "session_expired", message: "" })).toMatch(
      /expired/i
    );
  });
});

describe("AuthProvider", () => {
  it("throws when useAuth is used outside a provider", () => {
    function Orphan() {
      useAuth();
      return null;
    }
    expect(() => render(<Orphan />)).toThrow(/within an <AuthProvider>/);
  });

  it("settles to signedOut after restoring with no persisted session", async () => {
    renderProbe(makeService());
    await waitFor(() =>
      expect(screen.getByTestId("status")).toHaveTextContent("signedOut")
    );
    expect(screen.getByTestId("busy")).toHaveTextContent("false");
    expect(screen.getByTestId("error")).toHaveTextContent("");
  });

  it("signs in and out through the context", async () => {
    const user = (await import("@testing-library/user-event")).default.setup();
    renderProbe(makeService());
    await waitFor(() =>
      expect(screen.getByTestId("status")).toHaveTextContent("signedOut")
    );

    await user.click(screen.getByText("signin"));
    await waitFor(() =>
      expect(screen.getByTestId("status")).toHaveTextContent("signedIn")
    );

    await user.click(screen.getByText("signout"));
    await waitFor(() =>
      expect(screen.getByTestId("status")).toHaveTextContent("signedOut")
    );
  });

  it("keeps signedOut and sets an error on a failed sign-in", async () => {
    const user = (await import("@testing-library/user-event")).default.setup();
    renderProbe(makeService({ authenticator: createFailingNetworkAuthenticator() }));
    await waitFor(() =>
      expect(screen.getByTestId("status")).toHaveTextContent("signedOut")
    );

    await user.click(screen.getByText("signin"));
    await waitFor(() =>
      expect(screen.getByTestId("error")).toHaveTextContent(
        /reach the sign-in service/i
      )
    );
    expect(screen.getByTestId("status")).toHaveTextContent("signedOut");
  });

  it("restores an active persisted session as signedIn", async () => {
    const store = new BrowserSessionStore(new MemoryKeyValueStore());
    const now = () => 5_000;
    // Seed a session by signing in with one service instance.
    const seeding = makeService({ store, now });
    await act(async () => {
      await seeding.signIn(DEMO_CREDENTIALS);
    });

    renderProbe(makeService({ store, now }));
    await waitFor(() =>
      expect(screen.getByTestId("status")).toHaveTextContent("signedIn")
    );
  });
});
