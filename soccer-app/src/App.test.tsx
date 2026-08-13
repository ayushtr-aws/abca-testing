/**
 * End-to-end coverage of the authenticated app flow.
 *
 * These tests drive the real {@link App} shell through the {@link AuthProvider}
 * and a real {@link AuthService}, using an in-memory session store and the demo
 * authenticator. They exercise the full journey a user takes: signed-out gating,
 * failed and successful sign-in, protected-content access, sign-out, and
 * session restoration across "reloads".
 */

import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";
import {
  AuthProvider,
  BrowserSessionStore,
  MemoryKeyValueStore,
  createAuthService,
  createDemoAuthenticator,
  createFailingNetworkAuthenticator,
  DEMO_CREDENTIALS,
  type AuthService,
  type CredentialAuthenticator,
  type SessionStore,
} from "./auth";

function makeStore(): SessionStore {
  return new BrowserSessionStore(new MemoryKeyValueStore());
}

function makeService(options: {
  authenticator?: CredentialAuthenticator;
  store?: SessionStore;
  now?: () => number;
} = {}): AuthService {
  return createAuthService({
    authenticator:
      options.authenticator ?? createDemoAuthenticator({ now: options.now }),
    store: options.store ?? makeStore(),
    now: options.now,
  });
}

function renderApp(service: AuthService) {
  return render(
    <AuthProvider service={service}>
      <App />
    </AuthProvider>
  );
}

async function signIn(
  user: ReturnType<typeof userEvent.setup>,
  credentials = DEMO_CREDENTIALS
) {
  await user.type(screen.getByLabelText("Email"), credentials.email);
  await user.type(screen.getByLabelText("Password"), credentials.password);
  await user.click(screen.getByRole("button", { name: "Sign in" }));
}

beforeEach(() => {
  // The default browser store is shared via sessionStorage; each test uses its
  // own in-memory store, but clear jsdom storage defensively.
  window.sessionStorage.clear();
});

describe("App authentication flow (end-to-end)", () => {
  it("shows the sign-in screen and hides protected content when signed out", async () => {
    renderApp(makeService());

    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Sign in" })).toBeInTheDocument()
    );
    // Protected dashboard controls are absent.
    expect(
      screen.queryByPlaceholderText(/Search teams/i)
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Sign out" })
    ).not.toBeInTheDocument();
  });

  it("signs a user in with valid credentials and reveals protected content", async () => {
    const user = userEvent.setup();
    renderApp(makeService());

    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Sign in" })).toBeInTheDocument()
    );
    await signIn(user);

    // Protected content appears; the account area greets the user.
    await waitFor(() =>
      expect(screen.getByPlaceholderText(/Search teams/i)).toBeInTheDocument()
    );
    expect(screen.getByRole("button", { name: "Sign out" })).toBeInTheDocument();
    const header = screen.getByRole("banner");
    expect(within(header).getByText("Soccer Fan")).toBeInTheDocument();
    // The sign-in form is gone.
    expect(
      screen.queryByRole("button", { name: "Sign in" })
    ).not.toBeInTheDocument();
  });

  it("shows an error and stays signed out on invalid credentials", async () => {
    const user = userEvent.setup();
    renderApp(makeService());

    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Sign in" })).toBeInTheDocument()
    );
    await signIn(user, {
      email: "fan@soccer.app",
      password: "wrongpassword",
    });

    await waitFor(() =>
      expect(screen.getByRole("alert")).toHaveTextContent(
        "The email or password is incorrect."
      )
    );
    // Still on the sign-in screen; no protected content.
    expect(screen.getByRole("button", { name: "Sign in" })).toBeInTheDocument();
    expect(
      screen.queryByPlaceholderText(/Search teams/i)
    ).not.toBeInTheDocument();
  });

  it("surfaces a network error message when the service is unreachable", async () => {
    const user = userEvent.setup();
    renderApp(
      makeService({ authenticator: createFailingNetworkAuthenticator() })
    );

    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Sign in" })).toBeInTheDocument()
    );
    await signIn(user);

    await waitFor(() =>
      expect(screen.getByRole("alert")).toHaveTextContent(
        /couldn't reach the sign-in service/i
      )
    );
    expect(screen.getByRole("button", { name: "Sign in" })).toBeInTheDocument();
  });

  it("signs out and returns to the sign-in screen", async () => {
    const user = userEvent.setup();
    renderApp(makeService());

    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Sign in" })).toBeInTheDocument()
    );
    await signIn(user);
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Sign out" })).toBeInTheDocument()
    );

    await user.click(screen.getByRole("button", { name: "Sign out" }));

    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Sign in" })).toBeInTheDocument()
    );
    expect(
      screen.queryByPlaceholderText(/Search teams/i)
    ).not.toBeInTheDocument();
  });

  it("restores an active session on reload", async () => {
    const user = userEvent.setup();
    // Share one store across two independent renders to simulate a reload.
    const store = makeStore();
    const now = () => 1_000;

    const first = renderApp(makeService({ store, now }));
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Sign in" })).toBeInTheDocument()
    );
    await signIn(user);
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Sign out" })).toBeInTheDocument()
    );
    first.unmount();

    // Fresh app instance, same persisted session, same clock: still signed in.
    renderApp(makeService({ store, now }));
    await waitFor(() =>
      expect(screen.getByPlaceholderText(/Search teams/i)).toBeInTheDocument()
    );
    expect(screen.getByRole("button", { name: "Sign out" })).toBeInTheDocument();
  });

  it("does not restore an expired session and prompts to sign in again", async () => {
    const user = userEvent.setup();
    const store = makeStore();

    // Sign in at t=0 with a short-lived session.
    const first = renderApp(
      makeService({
        store,
        now: () => 0,
        authenticator: createDemoAuthenticator({ now: () => 0, sessionTtlMs: 1000 }),
      })
    );
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Sign in" })).toBeInTheDocument()
    );
    await signIn(user);
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Sign out" })).toBeInTheDocument()
    );
    first.unmount();

    // Reload well past expiry: should land signed out with an "expired" prompt.
    renderApp(makeService({ store, now: () => 10_000 }));
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Sign in" })).toBeInTheDocument()
    );
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Your session expired. Please sign in again."
    );
    expect(
      screen.queryByPlaceholderText(/Search teams/i)
    ).not.toBeInTheDocument();
  });
});
