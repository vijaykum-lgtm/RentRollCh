"use client";

import Link from "next/link";
import { useActionState, useState } from "react";

import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/text-field";
import { passwordStrength } from "@/lib/password-strength";
import { signUp, type SignUpResult } from "@/server/landlord/auth";

const initialState: SignUpResult = {};

export function SignUpForm() {
  const [state, formAction, pending] = useActionState(signUp, initialState);
  const [strength, setStrength] = useState<string | null>(null);

  return (
    <form action={formAction} className="flex flex-col gap-4" noValidate>
      <h1 className="type-h1 text-ink">Create an account</h1>

      {state.error && (
        <p
          role="alert"
          className="rounded-sm bg-danger/10 px-3 py-2 type-small text-danger"
        >
          {state.error}
        </p>
      )}

      <TextField
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        autoFocusOnDesktop
        required
      />
      <TextField
        label="Password"
        name="password"
        type="password"
        autoComplete="new-password"
        minLength={8}
        required
        helperText={
          strength ? `Password strength: ${strength}` : "At least 8 characters."
        }
        onBlur={(event) => setStrength(passwordStrength(event.currentTarget.value))}
      />

      <Button type="submit" fullWidth loading={pending}>
        Create account
      </Button>

      <p className="type-small text-muted">
        Already have an account?{" "}
        <Link href="/signin" className="text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
