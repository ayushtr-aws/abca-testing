import { useAuth } from "./auth";
import { TeamsDashboard } from "./components/TeamsDashboard";
import { SignInPage } from "./components/SignInPage";
import "./App.css";

/**
 * The application shell. It renders the header (with a session-aware account
 * area) and switches the body between the sign-in screen and the protected
 * dashboard based on the shared auth state:
 *
 * - `loading`  – while a persisted session is being restored, show a neutral
 *                placeholder so protected content never flashes.
 * - `signedIn` – render the protected {@link TeamsDashboard}.
 * - otherwise  – render the {@link SignInPage}.
 */
function App() {
  const { state, signOut } = useAuth();

  const signedIn = state.status === "signedIn";
  const displayName = signedIn ? state.session.user.displayName : null;

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-left">
          <span className="header-icon">⚽</span>
          <div>
            <h1>Soccer Teams</h1>
            <p>Top European Club Statistics</p>
          </div>
        </div>
        <div className="header-right">
          {signedIn ? (
            <div className="account">
              <span className="account-name">{displayName}</span>
              <button
                type="button"
                className="signout-btn"
                onClick={signOut}
              >
                Sign out
              </button>
            </div>
          ) : null}
        </div>
      </header>

      {state.status === "loading" ? (
        <div className="app-loading" role="status" aria-live="polite">
          <span>Loading…</span>
        </div>
      ) : signedIn ? (
        <TeamsDashboard />
      ) : (
        <SignInPage />
      )}
    </div>
  );
}

export default App;
