/**
 * Session persistence for the authentication service.
 *
 * Persistence is abstracted behind {@link SessionStore} so the service can be
 * driven with a real browser store in the app and an in-memory store in tests,
 * without any change to the service itself.
 *
 * The default browser implementation is deliberately conservative about what
 * it persists and how:
 * - It stores the session under a single, namespaced key.
 * - It validates the structure on read and discards anything malformed, so a
 *   tampered or partially written value can never surface as an "active"
 *   session.
 * - It fails closed: any storage exception results in `null` on read and is
 *   surfaced as a storage error on write, never a thrown exception that could
 *   crash a caller.
 */

import type { UserSession } from "./types";
import { isValidSession } from "./validation";

/**
 * A minimal, synchronous key/value store abstraction compatible with the
 * browser `Storage` interface (e.g. `sessionStorage`/`localStorage`).
 */
export interface KeyValueStore {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

/** Persistence contract used by the authentication service. */
export interface SessionStore {
  /** Returns the persisted session, or `null` if none/invalid. */
  load(): UserSession | null;
  /** Persists the given session, replacing any existing one. */
  save(session: UserSession): void;
  /** Removes any persisted session. */
  clear(): void;
}

/** The namespaced key under which the session is persisted. */
export const SESSION_STORAGE_KEY = "soccer-app.auth.session";

/**
 * A {@link SessionStore} backed by a {@link KeyValueStore} (browser storage by
 * default). Values are JSON-encoded and validated on read.
 */
export class BrowserSessionStore implements SessionStore {
  private readonly store: KeyValueStore;
  private readonly key: string;

  constructor(store: KeyValueStore, key: string = SESSION_STORAGE_KEY) {
    this.store = store;
    this.key = key;
  }

  load(): UserSession | null {
    let raw: string | null;
    try {
      raw = this.store.getItem(this.key);
    } catch {
      // Fail closed: an unreadable store is treated as "no session".
      return null;
    }
    if (raw == null) return null;

    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      // Corrupt payload – discard it so it cannot linger.
      this.clear();
      return null;
    }

    if (!isValidSession(parsed)) {
      this.clear();
      return null;
    }
    return parsed;
  }

  save(session: UserSession): void {
    // Throws are intentional here; the service wraps this in a storage error.
    this.store.setItem(this.key, JSON.stringify(session));
  }

  clear(): void {
    try {
      this.store.removeItem(this.key);
    } catch {
      // Best-effort: nothing more we can do if removal fails.
    }
  }
}

/**
 * A simple in-memory {@link KeyValueStore}, useful for tests and for
 * server/non-browser environments where no persistent store exists.
 */
export class MemoryKeyValueStore implements KeyValueStore {
  private readonly map = new Map<string, string>();

  getItem(key: string): string | null {
    return this.map.has(key) ? (this.map.get(key) as string) : null;
  }

  setItem(key: string, value: string): void {
    this.map.set(key, value);
  }

  removeItem(key: string): void {
    this.map.delete(key);
  }
}

/**
 * Creates the default {@link SessionStore}. Prefers the browser's
 * `sessionStorage` (cleared when the tab closes, so credentials do not linger
 * on shared machines); falls back to an in-memory store when no browser
 * storage is available (e.g. SSR or tests).
 */
export function createDefaultSessionStore(): SessionStore {
  const browserStore = resolveBrowserStorage();
  return new BrowserSessionStore(browserStore ?? new MemoryKeyValueStore());
}

/** Returns the browser `sessionStorage` if usable, otherwise `null`. */
function resolveBrowserStorage(): KeyValueStore | null {
  try {
    if (typeof globalThis !== "undefined" && "sessionStorage" in globalThis) {
      const candidate = (globalThis as { sessionStorage?: KeyValueStore })
        .sessionStorage;
      if (candidate) {
        // Probe access; some environments throw on access (e.g. blocked cookies).
        const probeKey = `${SESSION_STORAGE_KEY}.probe`;
        candidate.setItem(probeKey, "1");
        candidate.removeItem(probeKey);
        return candidate;
      }
    }
  } catch {
    // Storage exists but is not usable; fall through to in-memory.
  }
  return null;
}
