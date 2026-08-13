import { describe, it, expect, vi } from "vitest";
import type { User, UserSession } from "./types";
import {
  AuthService,
  createAuthService,
  type CredentialAuthenticator,
  type Credentials,
} from "./service";
import {
  AuthNetworkError,
  InvalidCredentialsError,
} from "./errors";
import {
  BrowserSessionStore,
  MemoryKeyValueStore,
  SESSION_STORAGE_KEY,
  type SessionStore,
} from "./storage";

const validUser: User = {
  id: "u-1",
  email: "player@example.com",
  displayName: "Test Player",
};

function makeSession(overrides: Partial<UserSession> = {}): UserSession {
  return {
    user: validUser,
    token: "token-abc",
    expiresAt: 10_000,
    ...overrides,
  };
}

const validCredentials: Credentials = {
  email: "player@example.com",
  password: "supersecret",
};

/** Builds a service with an in-memory store and a fixed clock. */
function makeService(options: {
  authenticator: CredentialAuthenticator;
  store?: SessionStore;
  now?: number;
}) {
  const store = options.store ?? new BrowserSessionStore(new MemoryKeyValueStore());
  const service = createAuthService({
    authenticator: options.authenticator,
    store,
    now: () => options.now ?? 0,
  });
  return { service, store };
}

describe("AuthService.signIn", () => {
  it("authenticates valid credentials and persists the session", async () => {
    const session = makeSession();
    const authenticator = vi.fn(async () => session);
    const { service, store } = makeService({ authenticator });

    const result = await service.signIn(validCredentials);

    expect(result).toEqual({ ok: true, value: session });
    expect(authenticator).toHaveBeenCalledTimes(1);
    expect(store.load()).toEqual(session);
  });

  it("trims the email before authenticating", async () => {
    const authenticator = vi.fn(async () => makeSession());
    const { service } = makeService({ authenticator });

    await service.signIn({ email: "  player@example.com  ", password: "supersecret" });

    expect(authenticator).toHaveBeenCalledWith({
      email: "player@example.com",
      password: "supersecret",
    });
  });

  it("rejects an invalid email without calling the authenticator", async () => {
    const authenticator = vi.fn(async () => makeSession());
    const { service } = makeService({ authenticator });

    const result = await service.signIn({ email: "nope", password: "supersecret" });

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe("invalid_input");
    expect(authenticator).not.toHaveBeenCalled();
  });

  it("rejects a short password without calling the authenticator", async () => {
    const authenticator = vi.fn(async () => makeSession());
    const { service } = makeService({ authenticator });

    const result = await service.signIn({ email: validCredentials.email, password: "short" });

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe("invalid_input");
    expect(authenticator).not.toHaveBeenCalled();
  });

  it("maps rejected credentials to invalid_credentials and persists nothing", async () => {
    const authenticator = vi.fn(async () => {
      throw new InvalidCredentialsError();
    });
    const { service, store } = makeService({ authenticator });

    const result = await service.signIn(validCredentials);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("invalid_credentials");
      expect(result.error.cause).toBeInstanceOf(InvalidCredentialsError);
    }
    expect(store.load()).toBeNull();
  });

  it("maps transport failures to network_error", async () => {
    const authenticator = vi.fn(async () => {
      throw new AuthNetworkError();
    });
    const { service } = makeService({ authenticator });

    const result = await service.signIn(validCredentials);

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe("network_error");
  });

  it("maps an unexpected authenticator error to unknown", async () => {
    const authenticator = vi.fn(async () => {
      throw new Error("boom");
    });
    const { service } = makeService({ authenticator });

    const result = await service.signIn(validCredentials);

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe("unknown");
  });

  it("rejects a malformed session returned by the authenticator", async () => {
    const authenticator = vi.fn(async () => makeSession({ token: "" }));
    const { service, store } = makeService({ authenticator });

    const result = await service.signIn(validCredentials);

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe("unknown");
    expect(store.load()).toBeNull();
  });

  it("returns a storage_error when persistence fails", async () => {
    const authenticator = vi.fn(async () => makeSession());
    const failingStore: SessionStore = {
      load: () => null,
      save: () => {
        throw new Error("disk full");
      },
      clear: () => {},
    };
    const { service } = makeService({ authenticator, store: failingStore });

    const result = await service.signIn(validCredentials);

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe("storage_error");
  });
});

describe("AuthService.restore", () => {
  it("restores an active session as signedIn", async () => {
    const session = makeSession({ expiresAt: 100 });
    const store = new BrowserSessionStore(new MemoryKeyValueStore());
    store.save(session);
    const { service } = makeService({
      authenticator: vi.fn(),
      store,
      now: 50,
    });

    const result = service.restore();

    expect(result).toEqual({ ok: true, value: { status: "signedIn", session } });
  });

  it("returns no_session when nothing is persisted", () => {
    const { service } = makeService({ authenticator: vi.fn(), now: 0 });

    const result = service.restore();

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe("no_session");
  });

  it("returns session_expired and clears the stale session", () => {
    const session = makeSession({ expiresAt: 100 });
    const store = new BrowserSessionStore(new MemoryKeyValueStore());
    store.save(session);
    const { service } = makeService({
      authenticator: vi.fn(),
      store,
      now: 200,
    });

    const result = service.restore();

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe("session_expired");
    expect(store.load()).toBeNull();
  });

  it("returns storage_error when the store throws on load", () => {
    const failingStore: SessionStore = {
      load: () => {
        throw new Error("blocked");
      },
      save: () => {},
      clear: () => {},
    };
    const { service } = makeService({ authenticator: vi.fn(), store: failingStore });

    const result = service.restore();

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe("storage_error");
  });
});

describe("AuthService.signOut", () => {
  it("clears the persisted session", async () => {
    const session = makeSession();
    const store = new BrowserSessionStore(new MemoryKeyValueStore());
    store.save(session);
    const { service } = makeService({ authenticator: vi.fn(), store });

    const result = service.signOut();

    expect(result.ok).toBe(true);
    expect(store.load()).toBeNull();
  });

  it("is idempotent when already signed out", () => {
    const { service, store } = makeService({ authenticator: vi.fn() });

    expect(service.signOut().ok).toBe(true);
    expect(service.signOut().ok).toBe(true);
    expect(store.load()).toBeNull();
  });

  it("returns storage_error when clearing throws", () => {
    const failingStore: SessionStore = {
      load: () => null,
      save: () => {},
      clear: () => {
        throw new Error("locked");
      },
    };
    const { service } = makeService({ authenticator: vi.fn(), store: failingStore });

    const result = service.signOut();

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe("storage_error");
  });
});

describe("service end-to-end", () => {
  it("supports sign-in, restore, then sign-out against a shared store", async () => {
    const session = makeSession({ expiresAt: 1_000 });
    const store = new BrowserSessionStore(new MemoryKeyValueStore());
    const service = new AuthService({
      authenticator: async () => session,
      store,
      now: () => 500,
    });

    const signIn = await service.signIn(validCredentials);
    expect(signIn.ok).toBe(true);

    const restored = service.restore();
    expect(restored).toEqual({ ok: true, value: { status: "signedIn", session } });

    expect(service.signOut().ok).toBe(true);
    expect(service.restore().ok).toBe(false);
  });
});

describe("BrowserSessionStore", () => {
  it("round-trips a valid session", () => {
    const kv = new MemoryKeyValueStore();
    const store = new BrowserSessionStore(kv);
    const session = makeSession();

    store.save(session);

    expect(store.load()).toEqual(session);
    expect(kv.getItem(SESSION_STORAGE_KEY)).toBe(JSON.stringify(session));
  });

  it("discards and clears corrupt JSON", () => {
    const kv = new MemoryKeyValueStore();
    kv.setItem(SESSION_STORAGE_KEY, "{not json");
    const store = new BrowserSessionStore(kv);

    expect(store.load()).toBeNull();
    expect(kv.getItem(SESSION_STORAGE_KEY)).toBeNull();
  });

  it("discards a structurally invalid persisted session", () => {
    const kv = new MemoryKeyValueStore();
    kv.setItem(SESSION_STORAGE_KEY, JSON.stringify({ token: "x" }));
    const store = new BrowserSessionStore(kv);

    expect(store.load()).toBeNull();
    expect(kv.getItem(SESSION_STORAGE_KEY)).toBeNull();
  });

  it("returns null when the underlying store throws on read", () => {
    const throwingKv = {
      getItem: () => {
        throw new Error("blocked");
      },
      setItem: () => {},
      removeItem: () => {},
    };
    const store = new BrowserSessionStore(throwingKv);

    expect(store.load()).toBeNull();
  });
});
