"use client";

import Link from "next/link";
import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/text-field";
import { requestPasswordReset, type ResetResult } from "@/server/landlord/auth";

const initialState: ResetResult = { submitted: false };

// L01-LNK-RESET — "Sending a reset always shows the same confirmation
// whether or not the email exists."
export function ResetForm() {
  const [state, formAction, pending] = useActionState(
    requestPasswordReset,
    initialState,
  );

  if (state.submitted) {
    return (
      <div className="flex flex-col gap-3">
        <h1 className="type-h1 text-ink">Check your email</h1>
        <p className="type-body text-body">
          If an account exists for that email, we have sent a link to reset
          your password.
        </p>
        <Link href="/signin" className="type-small text-primary hover:underline">
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-4" noValidate>
      <h1 className="type-h1 text-ink">Reset your password</h1>
      <p className="type-small text-muted">
        Enter your email and we will send you a link to reset your password.
      </p>

      <TextField
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        autoFocusOnDesktop
        required
      />

      <Button type="submit" fullWidth loading={pending}>
        Send reset link
      </Button>

      <Link href="/signin" className="type-small text-primary hover:underline">
        Back to sign in
      </Link>
    </form>
  );
}
