import { describe, expect, it } from "vitest";
import {
  INITIAL_LOCKOUT_STATE,
  LOCKOUT_MS,
  MAX_ATTEMPTS,
  afterFailedAttempt,
  afterSuccessfulAttempt,
  checkLockout,
} from "./auth-lockout";

describe("checkLockout", () => {
  it("is not locked from the initial state", () => {
    expect(checkLockout(INITIAL_LOCKOUT_STATE, Date.now())).toBeNull();
  });

  it("is not locked once lockedUntil has passed", () => {
    const now = 10_000;
    expect(checkLockout({ failCount: 0, lockedUntil: now - 1 }, now)).toBeNull();
  });

  it("reports whole seconds remaining while locked", () => {
    const now = 10_000;
    expect(
      checkLockout({ failCount: 0, lockedUntil: now + 30_000 }, now),
    ).toBe(30);
  });
});

describe("afterFailedAttempt", () => {
  it("increments the fail count below the threshold", () => {
    const state = { failCount: 3, lockedUntil: null };
    expect(afterFailedAttempt(state, 0)).toEqual({
      failCount: 4,
      lockedUntil: null,
    });
  });

  it(`locks out for ${LOCKOUT_MS}ms on the ${MAX_ATTEMPTS}th failure and resets the count`, () => {
    const state = { failCount: MAX_ATTEMPTS - 1, lockedUntil: null };
    expect(afterFailedAttempt(state, 1_000)).toEqual({
      failCount: 0,
      lockedUntil: 1_000 + LOCKOUT_MS,
    });
  });
});

describe("afterSuccessfulAttempt", () => {
  it("resets to the initial state", () => {
    expect(afterSuccessfulAttempt()).toEqual(INITIAL_LOCKOUT_STATE);
  });
});
