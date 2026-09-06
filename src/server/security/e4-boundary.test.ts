/**
 * spec/cross-cutting.md § E4 — the seven permission boundary tests, "the
 * highest-severity test cases in the product" per that section's own
 * framing. These are written once, here, and never deleted to make CI
 * green — a row stays red until the feature it guards actually exists.
 *
 * Per the schema/RLS lane's scope, this file mocks the Supabase client
 * rather than exercising real Postgres RLS (no Docker/psql/Supabase CLI
 * is available to this lane's environment — see the migration for the
 * real RLS policies, which are the actual enforcement mechanism in
 * production).
 *
 * Honesty note: rows 1, 2, 3, 6, and part of 4 are asserted against real
 * application code built in this same ticket (the token resolver and the
 * route guard) and genuinely pass. Rows 5 and 7 depend on a landlord
 * data-fetch layer that does not exist yet — that is a different lane's
 * work — so they are written as real, failing assertions rather than
 * `.todo()` (which would not fail the suite and would defeat the point).
 */
import { describe, expect, it } from "vitest";

import { requiresSignIn } from "../landlord/route-guard";
import {
  resolveToken,
  type TokenQueryClient,
  type TokenRow,
} from "../tokens/resolve-token";

function fakeTokenClient(rows: {
  unit?: TokenRow;
  tenancy?: TokenRow;
}): TokenQueryClient {
  return {
    from(table: string) {
      return {
        select() {
          return {
            eq() {
              return {
                async maybeSingle() {
                  const row = table === "unit" ? rows.unit : rows.tenancy;
                  return { data: row ?? null };
                },
              };
            },
          };
        },
      };
    },
  };
}

describe("E4 row 1 — open a unit link belonging to another landlord's unit", () => {
  it("resolves an unrecognized token as invalid, never as someone else's data", async () => {
    // A token minted for a different landlord's install is, from this
    // database's point of view, just a value that matches no unit or
    // tenancy row — the resolver cannot distinguish "foreign" from
    // "never existed", by design (E1's single "not valid" message).
    const client = fakeTokenClient({});

    await expect(resolveToken("foreign-token", client)).resolves.toEqual({
      kind: "invalid",
    });
  });
});

describe("E4 row 2 — open a former tenant's link after the tenancy ended", () => {
  it("resolves a tenant_token whose tenancy is no longer current as invalid", async () => {
    const client = fakeTokenClient({
      tenancy: { id: "tenancy-1", unit_id: "unit-1", status: "past" },
    });

    await expect(resolveToken("former-tenant-token", client)).resolves.toEqual({
      kind: "invalid",
    });
  });
});

describe("E4 row 3 — alter the token in a valid tenant URL", () => {
  it("resolves a tampered token (no longer matching any row) as invalid", async () => {
    const client = fakeTokenClient({});

    await expect(resolveToken("valid-token-x", client)).resolves.toEqual({
      kind: "invalid",
    });
  });
});

describe("E4 row 4 — the data behind any tenant page has no rent, cost, or other unit/tenant", () => {
  it("the resolver's own return shape never carries money/cost fields", async () => {
    const client = fakeTokenClient({
      tenancy: {
        id: "tenancy-1",
        unit_id: "unit-1",
        status: "current",
        rent_amount: 25000,
        deposit_paid: 50000,
      },
    });

    const result = await resolveToken("some-token", client);

    expect(Object.keys(result)).not.toContain("rent_amount");
    expect(Object.keys(result)).not.toContain("deposit_paid");
  });

  it("a real tenant page exists whose full payload can be inspected end to end", () => {
    // TODO: T-01 (spec/screens/tenant/T-01-report-a-problem.md) is out
    // of this lane's scope — no tenant-facing page exists yet to assert
    // a full rendered payload against. Using a plain failing assertion
    // rather than `.todo()`/`.fails()` because both of those pass the
    // suite on an expected failure, which would defeat "never green
    // until real". Must stay red until T-01 exists.
    const tenantPageExists = false;
    expect(tenantPageExists).toBe(true);
  });
});

describe("E4 row 5 — request another landlord's rent/unit/tenant/request record while signed in", () => {
  it("returns not found, not forbidden, for a cross-landlord record", () => {
    // TODO: no landlord data-fetch layer exists yet (a future lane's
    // work — the L-03/L-04/etc. screens). The migration's RLS policies
    // (app.unit_landlord / app.tenancy_landlord) already make a
    // cross-landlord row unreachable at the database level; what's
    // missing is the application code that turns "zero rows" into an
    // explicit "not found" response instead of leaking a 403/forbidden
    // shape. This must stay red until that layer exists.
    const landlordDataFetchLayerExists = false;
    expect(landlordDataFetchLayerExists).toBe(true);
  });
});

describe("E4 row 6 — reach any landlord route while signed out", () => {
  it("redirects to L-01 (/signin) rather than rendering the route", () => {
    expect(requiresSignIn("/units", false)).toBe(true);
  });

  it("does not redirect once a session exists", () => {
    expect(requiresSignIn("/units", true)).toBe(false);
  });
});

describe("E4 row 7 — open a document belonging to another landlord", () => {
  it("returns not found for a cross-landlord document", () => {
    // TODO: no document access-check layer exists yet (L-14's lane).
    // Same underlying RLS policy (document_owner, via app.unit_landlord)
    // already denies the row; the missing piece is the application code
    // that serves/downloads a document and must translate "zero rows"
    // into "not found". Must stay red until that layer exists.
    const documentAccessLayerExists = false;
    expect(documentAccessLayerExists).toBe(true);
  });
});
