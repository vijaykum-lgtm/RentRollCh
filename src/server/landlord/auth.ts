"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import {
  afterFailedAttempt,
  afterSuccessfulAttempt,
  checkLockout,
} from "./auth-lockout";
import { readLockoutState, writeLockoutState } from "./auth-lockout-store";
import { isSafeRedirectTarget } from "./auth-redirect";

// spec/screens/landlord/L-01-sign-in.md § Interactions — never say which
// of email/password was wrong.
const GENERIC_SIGNIN_ERROR = "Email or password is incorrect.";

export interface SignInResult {
  error?: string;
}

export async function signIn(
  _prevState: SignInResult,
  formData: FormData,
): Promise<SignInResult> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const redirectTo = String(formData.get("redirectTo") ?? "/");
  const destination = isSafeRedirectTarget(redirectTo) ? redirectTo : "/";

  if (!email || !password) {
    return { error: GENERIC_SIGNIN_ERROR };
  }

  const now = Date.now();
  const state = await readLockoutState();
  const retryAfterSeconds = checkLockout(state, now);
  if (retryAfterSeconds !== null) {
    return {
      error: `Too many attempts. Please wait ${retryAfterSeconds} seconds and try again.`,
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    await writeLockoutState(afterFailedAttempt(state, now));
    return { error: GENERIC_SIGNIN_ERROR };
  }

  await writeLockoutState(afterSuccessfulAttempt());
  redirect(destination);
}

export interface SignUpResult {
  error?: string;
}

export async function signUp(
  _prevState: SignUpResult,
  formData: FormData,
): Promise<SignUpResult> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Enter an email and password." };
  }
  // spec/screens/landlord/L-01-sign-in.md § Rules — 8 char minimum on sign-up.
  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({ email, password });
  if (error) {
    return { error: "Could not create your account. Try again." };
  }

  redirect("/");
}

export interface ResetResult {
  submitted: boolean;
}

export async function requestPasswordReset(
  _prevState: ResetResult,
  formData: FormData,
): Promise<ResetResult> {
  const email = String(formData.get("email") ?? "").trim();

  if (email) {
    const supabase = await createClient();
    // spec/screens/landlord/L-01-sign-in.md § Interactions — the same
    // confirmation is shown whether or not the email exists, so any
    // error here is deliberately swallowed rather than surfaced.
    await supabase.auth
      .resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/reset/confirm`,
      })
      .catch(() => {});
  }

  return { submitted: true };
}

export interface ConfirmResetResult {
  error?: string;
}

export async function confirmPasswordReset(
  _prevState: ConfirmResetResult,
  formData: FormData,
): Promise<ConfirmResetResult> {
  const password = String(formData.get("password") ?? "");

  // spec/screens/landlord/L-01-sign-in.md § Rules — 8 char minimum.
  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    return {
      error: "This reset link has expired. Request a new one.",
    };
  }

  redirect("/signin");
}
