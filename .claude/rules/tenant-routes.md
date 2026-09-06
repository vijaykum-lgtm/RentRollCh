# Tenant route boundary

Scope: everything under `src/app/(tenant)` (route `/u/:token`, T-01–T-05)
and any server code that serves it. This restates
`spec/cross-cutting.md` § E4 and the two universal rules
(`CLAUDE.md` rule 2) as concrete allow/deny checks for code in this
lane. It does not replace those files — read them first.

## Never, on any tenant route or its data path

- Rent amount, rent due, arrears, or any figure derived from
  `rent_entry` / `agreement.rent_amount`.
- Repair/maintenance cost — `request.cost`, `request.no_cost_confirmed`,
  or `deduction.amount`.
- Any other unit, tenant, tenancy, request, payment, or document than
  the one resolved from the current token.
- Landlord identifiers, internal record IDs, or error codes in
  tenant-facing text (`spec/cross-cutting.md` § Wording rules).
- Imports from `src/server/landlord` or `src/app/(landlord)`
  (enforced mechanically by `npm run check:boundaries`, backing this
  rule — see `scripts/check-boundaries.ts`).

## The one named exception

- `T-05` (`T05-LST-RECEIPTS`) shows the tenant's **own** payment
  amounts on their **own** receipts. This is the sole approved
  exception in the whole spec — it does not license showing rent
  *due*, arrears, or anyone else's payment. See
  `spec/screens/tenant/T-05-my-receipts.md` for the exact boundary
  ("current/ongoing liability" stays hidden; a past receipt of what
  they themselves paid does not).

## Two tokens — do not conflate them (D1)

- `unit.door_token` — durable, unit-level, never expires, resolves to
  `T-01` in anonymous mode (no name/phone prefill, no "my reports"
  link).
- `tenancy.tenant_token` — per-stay, stops resolving once the tenancy
  is no longer current, resolves to `T-01` (prefilled) and is the only
  way to reach `T-03`/`T-04`/`T-05`.
- A query that resolves a token must return which kind it is and the
  single tenancy/unit it belongs to — never a broader set "just in
  case."

## Invalid / expired token

- Render the exact message from `spec/cross-cutting.md` § E1:
  "This link is not valid. Please ask your landlord for your unit
  link." Nothing else — no hint about valid link shape, no internal
  status.
- A former tenant's token and a syntactically-altered token must both
  produce this same response (`spec/cross-cutting.md` § E4).

## What to do if a task seems to need an exception

Stop and escalate to the user — do not implement a workaround, a
"temporary" broader query, or a debug-only bypass. See `CLAUDE.md`
rule 2.
