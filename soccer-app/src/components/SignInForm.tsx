import { useId, useState } from "react";
import type { FormEvent } from "react";
import { isValidEmail, isValidPassword } from "../auth";
import "./SignInForm.css";

/** Credentials collected by the sign-in form. */
export interface SignInCredentials {
  email: string;
  password: string;
}

export interface SignInFormProps {
  /**
   * Called with the validated credentials when the form is submitted. May
   * return a promise; while it is pending the form shows a loading state and
   * inputs are disabled. If it rejects, the rejection message (or a generic
   * fallback) is shown as a form-level error.
   */
  onSubmit: (credentials: SignInCredentials) => void | Promise<void>;
  /**
   * Optional externally-controlled error message (e.g. surfaced from the
   * shared auth state). Displayed as a form-level error.
   */
  error?: string | null;
  /**
   * Optional externally-controlled loading flag. When true the form is shown
   * in its loading state regardless of any in-flight internal submission.
   */
  loading?: boolean;
}

interface FieldErrors {
  email?: string;
  password?: string;
}

function validate({ email, password }: SignInCredentials): FieldErrors {
  const errors: FieldErrors = {};
  if (email.trim().length === 0) {
    errors.email = "Email is required.";
  } else if (!isValidEmail(email)) {
    errors.email = "Enter a valid email address.";
  }
  if (password.length === 0) {
    errors.password = "Password is required.";
  } else if (!isValidPassword(password)) {
    errors.password = "Password must be at least 8 characters.";
  }
  return errors;
}

export function SignInForm({ onSubmit, error, loading }: SignInFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [attempted, setAttempted] = useState(false);

  const baseId = useId();
  const emailId = `${baseId}-email`;
  const passwordId = `${baseId}-password`;
  const emailErrorId = `${emailId}-error`;
  const passwordErrorId = `${passwordId}-error`;
  const formErrorId = `${baseId}-form-error`;

  const isBusy = submitting || loading === true;
  const formError = error ?? submitError;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAttempted(true);
    setSubmitError(null);

    const credentials: SignInCredentials = { email, password };
    const errors = validate(credentials);
    setFieldErrors(errors);
    if (errors.email || errors.password) {
      return;
    }

    try {
      setSubmitting(true);
      await onSubmit(credentials);
    } catch (err) {
      setSubmitError(
        err instanceof Error && err.message
          ? err.message
          : "Sign in failed. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  // Re-validate a field after the first submit attempt so users get live
  // feedback as they correct their input.
  function revalidate(next: Partial<SignInCredentials>) {
    if (!attempted) return;
    setFieldErrors(validate({ email, password, ...next }));
  }

  return (
    <form className="signin-form" onSubmit={handleSubmit} noValidate aria-label="Sign in">
      <h2 className="signin-title">Sign in</h2>

      {formError ? (
        <div className="signin-error" id={formErrorId} role="alert">
          {formError}
        </div>
      ) : null}

      <div className="signin-field">
        <label htmlFor={emailId}>Email</label>
        <input
          id={emailId}
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          value={email}
          disabled={isBusy}
          aria-invalid={fieldErrors.email ? true : undefined}
          aria-describedby={fieldErrors.email ? emailErrorId : undefined}
          onChange={(e) => {
            setEmail(e.target.value);
            revalidate({ email: e.target.value });
          }}
        />
        {fieldErrors.email ? (
          <span className="signin-field-error" id={emailErrorId} role="alert">
            {fieldErrors.email}
          </span>
        ) : null}
      </div>

      <div className="signin-field">
        <label htmlFor={passwordId}>Password</label>
        <input
          id={passwordId}
          name="password"
          type="password"
          autoComplete="current-password"
          value={password}
          disabled={isBusy}
          aria-invalid={fieldErrors.password ? true : undefined}
          aria-describedby={fieldErrors.password ? passwordErrorId : undefined}
          onChange={(e) => {
            setPassword(e.target.value);
            revalidate({ password: e.target.value });
          }}
        />
        {fieldErrors.password ? (
          <span className="signin-field-error" id={passwordErrorId} role="alert">
            {fieldErrors.password}
          </span>
        ) : null}
      </div>

      <button type="submit" className="signin-submit" disabled={isBusy} aria-busy={isBusy}>
        {isBusy ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
