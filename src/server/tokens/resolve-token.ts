import "server-only";

import { createServiceClient } from "@/server/db/service-client";

/**
 * spec/decisions.md D1 -- two tokens, one route shape (`/u/:token`).
 * Resolving which kind a value is, and whether it's still valid, happens
 * here, server-side, using the service-role client (tenant tables carry
 * no `anon` RLS policies -- this resolver is the only path in).
 *
 * Deliberately returns nothing beyond ids and a kind: no rent, no cost,
 * no other unit or tenant's data can leak through this function by
 * accident, because it never selects those columns in the first place
 * (spec/cross-cutting.md § E4 row 4).
 *
 * "Doesn't exist", "belonged to a tenancy that's no longer current", and
 * "was a valid token with one character changed" all collapse to the
 * same `invalid` result -- spec/cross-cutting.md § E1's single "This link
 * is not valid…" message deliberately doesn't distinguish them (rows 1-3).
 */
export type TokenResolution =
  | { kind: "door"; unitId: string }
  | { kind: "tenant"; tenancyId: string; unitId: string }
  | { kind: "invalid" };

export interface TokenRow {
  [key: string]: unknown;
}

export interface TokenQueryClient {
  from(table: string): {
    select(columns: string): {
      eq(
        column: string,
        value: string,
      ): {
        maybeSingle(): Promise<{ data: TokenRow | null }>;
      };
    };
  };
}

export async function resolveToken(
  token: string,
  client?: TokenQueryClient,
): Promise<TokenResolution> {
  const activeClient = client ?? (createServiceClient() as unknown as TokenQueryClient);

  // Run both lookups concurrently rather than door-then-tenancy in
  // sequence: a door token wastes one query this way, but a tenant token
  // or an invalid one (arguably the more common case day to day, since a
  // saved personal link is what a tenant actually uses) no longer pays
  // for two round trips back to back.
  const [{ data: unit }, { data: tenancy }] = await Promise.all([
    activeClient.from("unit").select("id").eq("door_token", token).maybeSingle(),
    activeClient
      .from("tenancy")
      .select("id, unit_id, status")
      .eq("tenant_token", token)
      .maybeSingle(),
  ]);

  if (unit) {
    return { kind: "door", unitId: unit.id as string };
  }

  if (tenancy && tenancy.status !== "past") {
    return {
      kind: "tenant",
      tenancyId: tenancy.id as string,
      unitId: tenancy.unit_id as string,
    };
  }

  return { kind: "invalid" };
}
