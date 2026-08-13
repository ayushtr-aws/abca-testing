import { describe, it, expect } from "vitest";
import {
  DEMO_CREDENTIALS,
  DEFAULT_SESSION_TTL_MS,
  createDemoAuthenticator,
  createFailingNetworkAuthenticator,
} from "./demoAuthenticator";
import { AuthNetworkError, InvalidCredentialsError } from "./errors";
import { isValidSession } from "./validation";

describe("createDemoAuthenticator", () => {
  it("mints a valid session for the built-in demo account", async () => {
    const authenticate = createDemoAuthenticator({ now: () => 1000 });
    const session = await authenticate(DEMO_CREDENTIALS);

    expect(isValidSession(session)).toBe(true);
    expect(session.user.email).toBe(DEMO_CREDENTIALS.email);
    expect(session.expiresAt).toBe(1000 + DEFAULT_SESSION_TTL_MS);
    expect(session.token.length).toBeGreaterThan(0);
  });

  it("matches the email case-insensitively and trims whitespace", async () => {
    const authenticate = createDemoAuthenticator();
    const session = await authenticate({
      email: "  FAN@Soccer.App  ",
      password: DEMO_CREDENTIALS.password,
    });
    expect(session.user.id).toBe("demo-fan");
  });

  it("rejects an unknown email with InvalidCredentialsError", async () => {
    const authenticate = createDemoAuthenticator();
    await expect(
      authenticate({ email: "nobody@example.com", password: "whatever!" })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it("rejects a wrong password with InvalidCredentialsError", async () => {
    const authenticate = createDemoAuthenticator();
    await expect(
      authenticate({ email: DEMO_CREDENTIALS.email, password: "wrongpass" })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it("honours a custom account directory and TTL", async () => {
    const authenticate = createDemoAuthenticator({
      now: () => 500,
      sessionTtlMs: 60,
      accounts: [
        {
          user: { id: "u9", email: "keeper@club.io", displayName: "Keeper" },
          password: "cleansheet",
        },
      ],
    });
    const session = await authenticate({
      email: "keeper@club.io",
      password: "cleansheet",
    });
    expect(session.user.displayName).toBe("Keeper");
    expect(session.expiresAt).toBe(560);
    await expect(
      authenticate({ email: DEMO_CREDENTIALS.email, password: DEMO_CREDENTIALS.password })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});

describe("createFailingNetworkAuthenticator", () => {
  it("always fails with an AuthNetworkError", async () => {
    const authenticate = createFailingNetworkAuthenticator();
    await expect(
      authenticate(DEMO_CREDENTIALS)
    ).rejects.toBeInstanceOf(AuthNetworkError);
  });
});
