# Demo seed

Design and generator for a realistic RentRoll demo dataset. See
`SPEC.md` for the full design rationale — this file is just "how do I
run it."

## Status

**Design only — not wired to a database.** RentRoll's schema doesn't
exist yet, so this produces an in-memory dataset (and a JSON snapshot
for inspection), not database rows. `write-to-supabase.ts` is an
unimplemented stub that throws, clearly marked `TODO(schema)`, for
whoever wires this up once migrations exist.

## Run it

```sh
npm run seed:demo
```

This prints a summary and writes `scripts/seed/output/demo-dataset.json`
(gitignored — regenerate it rather than committing it, since its exact
dates shift with the run date by design).

## What you get

2 properties, 15 units (13 occupied, 2 vacant), 14 tenants (13 current,
1 past), and their rent history, reminders, maintenance requests, and
documents — covering normal/overdue/part-paid rent, agreement expiry,
notice, move-out/settlement, multiple maintenance states, and a missing
move-in-photo case. See `SPEC.md` § Scenario map for the unit-by-unit
breakdown.

Every date-sensitive scenario (e.g. "18 days overdue") is computed
relative to the moment you run the script, so it stays true no matter
when you run it — see `SPEC.md` § Why dates are relative.

## Once the schema exists

1. Replace the `TODO(schema)` shapes in `lib/types.ts` with the real
   generated types (or keep them as a thin mapping layer).
2. Implement `write-to-supabase.ts` and call it from `index.ts`.
3. Work through `SPEC.md` § Schema dependency — those are the concrete
   decisions (notice status enum, request status enum, deposit
   deduction structure, etc.) this seed could not make on its own.
