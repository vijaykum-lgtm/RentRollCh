import type { DemoDataset } from "./lib/types";

/**
 * TODO(schema): Not implemented. RentRoll's database schema/migrations
 * do not exist yet, and this ticket (C2 — demo seed design) explicitly
 * forbids inventing tables or fields ahead of that. Once real Supabase
 * migrations land, replace this with actual inserts — in dependency
 * order: landlords -> properties -> units -> tenants -> rent_entries ->
 * reminders -> requests -> documents — and call it from
 * scripts/seed/index.ts. See SPEC.md § Schema dependency.
 */
export async function writeToSupabase(dataset: DemoDataset): Promise<never> {
  void dataset;
  throw new Error(
    "writeToSupabase() is not implemented — the database schema does not exist yet. See scripts/seed/SPEC.md § Schema dependency.",
  );
}
