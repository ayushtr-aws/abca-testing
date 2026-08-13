import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SignInForm } from "./SignInForm";

function renderForm(props: Partial<Parameters<typeof SignInForm>[0]> = {}) {
  const onSubmit = props.onSubmit ?? vi.fn();
  const utils = render(<SignInForm onSubmit={onSubmit} {...props} />);
  return { onSubmit, ...utils };
}

describe("SignInForm", () => {
  it("renders accessible email and password fields and a submit button", () => {
    renderForm();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Sign in" })
    ).toBeInTheDocument();
  });

  it("shows validation errors and does not submit when fields are empty", async () => {
    const user = userEvent.setup();
    const { onSubmit } = renderForm();

    await user.click(screen.getByRole("button", { name: "Sign in" }));

    expect(screen.getByText("Email is required.")).toBeInTheDocument();
    expect(screen.getByText("Password is required.")).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("validates email format and password length", async () => {
    const user = userEvent.setup();
    const { onSubmit } = renderForm();

    await user.type(screen.getByLabelText("Email"), "not-an-email");
    await user.type(screen.getByLabelText("Password"), "short");
    await user.click(screen.getByRole("button", { name: "Sign in" }));

    expect(screen.getByText("Enter a valid email address.")).toBeInTheDocument();
    expect(
      screen.getByText("Password must be at least 8 characters.")
    ).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("marks invalid fields with aria-invalid and links error messages", async () => {
    const user = userEvent.setup();
    renderForm();

    await user.click(screen.getByRole("button", { name: "Sign in" }));

    const emailInput = screen.getByLabelText("Email");
    expect(emailInput).toHaveAttribute("aria-invalid", "true");
    const describedBy = emailInput.getAttribute("aria-describedby");
    expect(describedBy).toBeTruthy();
    expect(document.getElementById(describedBy as string)).toHaveTextContent(
      "Email is required."
    );
  });

  it("submits validated credentials", async () => {
    const user = userEvent.setup();
    const { onSubmit } = renderForm();

    await user.type(screen.getByLabelText("Email"), "player@example.com");
    await user.type(screen.getByLabelText("Password"), "supersecret");
    await user.click(screen.getByRole("button", { name: "Sign in" }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith({
      email: "player@example.com",
      password: "supersecret",
    });
  });

  it("clears field errors as the user corrects input after a failed attempt", async () => {
    const user = userEvent.setup();
    renderForm();

    await user.click(screen.getByRole("button", { name: "Sign in" }));
    expect(screen.getByText("Email is required.")).toBeInTheDocument();

    await user.type(screen.getByLabelText("Email"), "player@example.com");
    expect(screen.queryByText("Email is required.")).not.toBeInTheDocument();
  });

  it("shows a loading state and disables inputs while submitting", async () => {
    const user = userEvent.setup();
    let resolve!: () => void;
    const onSubmit = vi.fn(
      () => new Promise<void>((r) => (resolve = r))
    );
    renderForm({ onSubmit });

    await user.type(screen.getByLabelText("Email"), "player@example.com");
    await user.type(screen.getByLabelText("Password"), "supersecret");
    await user.click(screen.getByRole("button", { name: "Sign in" }));

    const button = screen.getByRole("button", { name: "Signing in…" });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(screen.getByLabelText("Email")).toBeDisabled();
    expect(screen.getByLabelText("Password")).toBeDisabled();

    resolve();
    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: "Sign in" })
      ).toBeEnabled()
    );
  });

  it("renders an alert with the rejection message when submission fails", async () => {
    const user = userEvent.setup();
    const onSubmit = vi
      .fn()
      .mockRejectedValue(new Error("Invalid credentials"));
    renderForm({ onSubmit });

    await user.type(screen.getByLabelText("Email"), "player@example.com");
    await user.type(screen.getByLabelText("Password"), "supersecret");
    await user.click(screen.getByRole("button", { name: "Sign in" }));

    await waitFor(() =>
      expect(screen.getByRole("alert")).toHaveTextContent("Invalid credentials")
    );
  });

  it("displays an externally-provided error", () => {
    renderForm({ error: "Your session expired. Please sign in again." });
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Your session expired. Please sign in again."
    );
  });

  it("reflects an externally-controlled loading flag", () => {
    renderForm({ loading: true });
    const button = screen.getByRole("button", { name: "Signing in…" });
    expect(button).toBeDisabled();
    expect(screen.getByLabelText("Email")).toBeDisabled();
  });

  it("is operable with the keyboard", async () => {
    const user = userEvent.setup();
    const { onSubmit } = renderForm();

    await user.tab();
    expect(screen.getByLabelText("Email")).toHaveFocus();
    await user.keyboard("player@example.com");

    await user.tab();
    expect(screen.getByLabelText("Password")).toHaveFocus();
    await user.keyboard("supersecret{Enter}");

    expect(onSubmit).toHaveBeenCalledWith({
      email: "player@example.com",
      password: "supersecret",
    });
  });
});
