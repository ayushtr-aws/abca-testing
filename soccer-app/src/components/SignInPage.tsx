import { useAuth } from "../auth";
import { SignInForm } from "./SignInForm";
import type { SignInCredentials } from "./SignInForm";
import "./SignInPage.css";

/**
 * The signed-out screen. Connects the presentational {@link SignInForm} to the
 * shared auth context: it forwards submitted credentials to `signIn`, and
 * surfaces the context's error/busy state on the form. On success the provider
 * flips the app to its signed-in state, which unmounts this page.
 */
export function SignInPage() {
  const { signIn, error, busy } = useAuth();

  async function handleSubmit(credentials: SignInCredentials) {
    await signIn(credentials);
  }

  return (
    <div className="signin-page">
      <div className="signin-page-panel">
        <p className="signin-page-lead">
          Sign in to explore live club statistics.
        </p>
        <SignInForm onSubmit={handleSubmit} error={error} loading={busy} />
        <p className="signin-page-hint">
          Demo account: <code>fan@soccer.app</code> / <code>goalkeeper</code>
        </p>
      </div>
    </div>
  );
}
