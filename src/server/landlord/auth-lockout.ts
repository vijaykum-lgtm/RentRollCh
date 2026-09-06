/**
 * Sign-in lockout logic — spec/screens/landlord/L-01-sign-in.md § Rules:
 * "After five failed attempts, add a 30-second delay and say so plainly."
 *
 * Pure and framework-free so it can be unit tested without cookies or
 * Supabase — see `src/server/landlord/auth-lockout-store.ts` for the
 * cookie-backed state this operates on.
 */
export const MAX_ATTEMPTS = 5;
export const LOCKOUT_MS = 30_000;

export interface LockoutState {
  failCount: number;
  lockedUntil: number | null;
}

export const INITIAL_LOCKOUT_STATE: LockoutState = {
  failCount: 0,
  lockedUntil: null,
};

/** Returns whole seconds remaining if locked, otherwise null. */
export function checkLockout(state: LockoutState, now: number): number | null {
  if (state.lockedUntil !== null && now < state.lockedUntil) {
    return Math.ceil((state.lockedUntil - now) / 1000);
  }
  return null;
}

export function afterFailedAttempt(
  state: LockoutState,
  now: number,
): LockoutState {
  const failCount = state.failCount + 1;
  if (failCount >= MAX_ATTEMPTS) {
    return { failCount: 0, lockedUntil: now + LOCKOUT_MS };
  }
  return { failCount, lockedUntil: state.lockedUntil };
}

export function afterSuccessfulAttempt(): LockoutState {
  return INITIAL_LOCKOUT_STATE;
}
