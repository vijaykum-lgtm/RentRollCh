"use client";

import Link from "next/link";
import { useActionState, useState } from "react";

import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/text-field";
import { passwordStrength } from "@/lib/password-strength";
import {
  confirmPasswordReset,
  type ConfirmResetResult,
} from "@/server/landlord/auth";

const initialState: ConfirmResetResult = {};

export function ConfirmResetForm({ code }: { code?: string }) {
  const [state, formAction, pending] = useActionState(
    confirmPasswordReset,
    initialState,
  );
  const [strength, setStrength] = useState<string | null>(null);

  if (!code) {
    return (
      <div className="flex flex-col gap-3">
        <h1 className="type-h1 text-ink">This reset link has expired</h1>
        <p className="type-body text-body">Request a new one.</p>
        <Link href="/reset" className="type-small text-primary hover:underline">
          Back to reset password
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-4" noValidate>
      <h1 className="type-h1 text-ink">Choose a new password</h1>

      {state.error && (
        <p
          role="alert"
          className="rounded-sm bg-danger/10 px-3 py-2 type-small text-danger"
        >
          {state.error}
        </p>
      )}

      <input type="hidden" name="code" value={code} />

      <TextField
        label="New password"
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
        Set new password
      </Button>
    </form>
  );
}
