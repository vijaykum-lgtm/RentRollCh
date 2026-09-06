import "server-only";

import { cookies } from "next/headers";

import { INITIAL_LOCKOUT_STATE, type LockoutState } from "./auth-lockout";

const COOKIE_NAME = "ll_signin_attempts";

export async function readLockoutState(): Promise<LockoutState> {
  const store = await cookies();
  const raw = store.get(COOKIE_NAME)?.value;
  if (!raw) return INITIAL_LOCKOUT_STATE;

  try {
    const parsed = JSON.parse(raw) as Partial<LockoutState>;
    return {
      failCount: typeof parsed.failCount === "number" ? parsed.failCount : 0,
      lockedUntil:
        typeof parsed.lockedUntil === "number" ? parsed.lockedUntil : null,
    };
  } catch {
    return INITIAL_LOCKOUT_STATE;
  }
}

export async function writeLockoutState(state: LockoutState): Promise<void> {
  const store = await cookies();
  store.set(COOKIE_NAME, JSON.stringify(state), {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60,
    path: "/signin",
  });
}
