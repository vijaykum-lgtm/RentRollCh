import { describe, expect, it } from "vitest";

import { resolveToken, type TokenQueryClient, type TokenRow } from "./resolve-token";

function fakeClient(rows: {
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

describe("resolveToken", () => {
  it("resolves a door token to its unit", async () => {
    const client = fakeClient({ unit: { id: "unit-1" } });

    await expect(resolveToken("some-token", client)).resolves.toEqual({
      kind: "door",
      unitId: "unit-1",
    });
  });

  it("resolves a current tenant token to its tenancy and unit", async () => {
    const client = fakeClient({
      tenancy: { id: "tenancy-1", unit_id: "unit-1", status: "current" },
    });

    await expect(resolveToken("some-token", client)).resolves.toEqual({
      kind: "tenant",
      tenancyId: "tenancy-1",
      unitId: "unit-1",
    });
  });

  it("resolves a tenancy on notice as still valid", async () => {
    const client = fakeClient({
      tenancy: { id: "tenancy-1", unit_id: "unit-1", status: "notice" },
    });

    await expect(resolveToken("some-token", client)).resolves.toEqual({
      kind: "tenant",
      tenancyId: "tenancy-1",
      unitId: "unit-1",
    });
  });

  it("treats a token matching no unit or tenancy as invalid", async () => {
    const client = fakeClient({});

    await expect(resolveToken("unknown-token", client)).resolves.toEqual({
      kind: "invalid",
    });
  });

  it("treats a former tenant's token (tenancy no longer current) as invalid — E4 row 2", async () => {
    const client = fakeClient({
      tenancy: { id: "tenancy-1", unit_id: "unit-1", status: "past" },
    });

    await expect(resolveToken("some-token", client)).resolves.toEqual({
      kind: "invalid",
    });
  });

  it("never returns anything beyond ids and a kind — E4 row 4", async () => {
    const client = fakeClient({
      tenancy: {
        id: "tenancy-1",
        unit_id: "unit-1",
        status: "current",
        // A buggy query might select extra columns; the resolver's
        // return shape must never surface them even if the row has them.
        rent_amount: 25000,
        deposit_paid: 50000,
      },
    });

    const result = await resolveToken("some-token", client);

    expect(Object.keys(result).sort()).toEqual(
      ["kind", "tenancyId", "unitId"].sort(),
    );
  });
});
