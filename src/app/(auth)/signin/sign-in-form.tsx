"use client";

import Link from "next/link";
import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/text-field";
import { signIn, type SignInResult } from "@/server/landlord/auth";

const initialState: SignInResult = {};

// Components: L01-FLD-EMAIL, L01-FLD-PASS, L01-BTN-SIGNIN, L01-LNK-RESET,
// L01-LNK-SIGNUP — spec/screens/landlord/L-01-sign-in.md
export function SignInForm({ redirectTo }: { redirectTo: string }) {
  const [state, formAction, pending] = useActionState(signIn, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4" noValidate>
      <h1 className="type-h1 text-ink">Sign in</h1>

      {state.error && (
        <p
          role="alert"
          className="rounded-sm bg-danger/10 px-3 py-2 type-small text-danger"
        >
          {state.error}
        </p>
      )}

      <input type="hidden" name="redirectTo" value={redirectTo} />

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
        autoComplete="current-password"
        required
      />

      <Button type="submit" fullWidth loading={pending}>
        Sign in
      </Button>

      <div className="flex items-center justify-between type-small">
        <Link href="/reset" className="text-primary hover:underline">
          Forgot password
        </Link>
        <Link href="/signup" className="text-primary hover:underline">
          Create an account
        </Link>
      </div>
    </form>
  );
}
