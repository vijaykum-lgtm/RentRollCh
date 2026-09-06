# Demo seed — design (ticket C2)

Source used: `spec/product.md` (the product specification) and the
"Open contradictions" section of `spec/index.md` (the standing product
decisions/tensions). No UI/UX screen files were consulted for this
design, in keeping with the ticket's scope — see § Provisional values
below for where that shows up.

**RentRoll's database schema does not exist yet.** This document and
everything under `scripts/seed/**` design a demo dataset in terms of the
entities and fields `spec/product.md` § Data model already names.
Nothing here creates a table, a column, or a persistence decision —
`scripts/seed/write-to-supabase.ts` is an explicit `TODO(schema)` stub
until real migrations exist.

## Goals

A demo dataset that:

1. Covers every story in the ticket: multiple properties, occupied and
   vacant units, normal/overdue/part-paid rent, maintenance requests,
   agreement expiry, notice, move-out/settlement, and a
   document/photo gap.
2. Reads as a real small Pune landlord's portfolio, not placeholder
   data (`Unit 1`, `Tenant A`).
3. Stays correct forever. Every day-count ("18 days overdue") is
   computed from the run date, not hardcoded to a calendar date — see
   § Why dates are relative.
4. Never invents schema. Every field either traces to a name in
   `spec/product.md` § Data model, or is marked `TODO(schema)` in
   `lib/types.ts` as a demo-only convenience pending real design.

## Portfolio shape

| | Target (ticket) | Seeded | Why |
|---|---|---|---|
| Properties | ~2 | 2 | — |
| Units | ~15 | 15 | — |
| Occupied | ~11 | 13 | The ticket's occupied/vacant/total numbers don't sum (11+2=13≠15). Vacant=2 and total=15 are both concrete numbers with a specific story attached to each vacant unit (see below); occupied is whatever is left over (15−2=13). If exactly 11 occupied is wanted, drop two of the "plain normal" units (`unit-kr-g01`/`unit-kr-g02` or `unit-bg-201` before it was repurposed — see § Scenario map) and mark two more units vacant. |
| Vacant | ~2 | 2 | One never-occupied unit, one post-settlement unit — see § Scenario map. |

**Kothrud Residency** (9 units) and **Baner Greenview** (6 units), both
in Pune, owned by one landlord — matching product.md's ownership model
(one landlord, many properties, many units per property, one current
tenant per unit plus history).

## Scenario map

One block per unit in `data/scenarios.ts`, in this order:

| Unit | Tenant | Story |
|---|---|---|
| unit-kr-g01 | Meera Joshi | Plain normal — paid on time, nothing else happening. |
| unit-kr-g02 | Sanjay Pawar | Plain normal. |
| unit-kr-101 | Rahul Kulkarni | Rent ~18 days overdue. Gentle (day 3) and direct (day 10) reminders sent; formal (day 20) not yet due. |
| unit-kr-102 | Neha Bhosale | Rent ~5 days overdue (gentle sent only) + a freshly reported maintenance request ("New"). |
| unit-kr-103 | Vikram Shinde | Part-paid rent: ₹12,000 of ₹20,000 paid, ₹8,000 outstanding. Gentle and direct both sent; the partial payment didn't clear the balance. |
| unit-kr-201 | Ashwini Gokhale | Rent normal and paid, but the move-in condition photo was never taken — the documentation-gap case (see product.md § Success metrics: "if this is low, the settlement feature is decorative"). |
| unit-kr-202 | Prashant Kale | Agreement expires in exactly 30 days. |
| unit-kr-203 | Deepa Nair | Agreement expires in exactly 60 days. |
| unit-bg-101 | Omkar Jadhav | Agreement expires in exactly 90 days. |
| unit-bg-102 | Snehal Patil | Has given notice; moving out in ~20 days, ahead of her agreement's natural end. Still occupied today. |
| unit-bg-201 | Abhijit More | Rent ~22 days overdue — the *complete* escalation ladder: gentle, direct, formal, and a logged follow-up call, all unresolved as of today. Demonstrates the full rent lifecycle in product.md, not just two points on it. |
| unit-bg-202 | Kavita Deshmukh | Rent normal; one maintenance request "In progress", vendor assigned. |
| unit-bg-301 | Ganesh Bhagat | Rent normal; one maintenance request "Done" (with cost and before/after photos) and one "New" (just reported) — two different lifecycle points on the same unit. |
| unit-bg-302 | Rutuja Kadam (past tenant) | Gave notice 45 days ago, moved out 15 days ago, deposit settled 10 days ago. Unit now vacant. Unlike unit-kr-201, has a *complete* document trail (move-in photo, move-out photos, settlement statement) — the contrast is deliberate. |
| unit-kr-301 | — | Never occupied. Vacant with no tenant history at all — distinct from unit-bg-302's "vacant after a full tenancy." |

Reminder levels (`gentle`/`direct`/`formal`) and their day offsets (3,
10, 20) come directly from `spec/product.md` § Rent lifecycle and
escalation. Agreement-expiry warning windows (90/60/30 days) come
directly from the same document's § Data flow and § Scope tables.

## Why dates are relative

Every scenario's dates are computed as an offset from `runDate`
(`lib/dates.ts`), not a fixed calendar date. Regenerating the seed a
year from now still produces a tenant whose rent is exactly 18 days
overdue as of that run — the ticket's "the demo remains stable later"
requirement. `data/index.ts#buildDemoDataset(runDate)` takes the run
date as a parameter (defaulting to `new Date()`) specifically so this
is testable and overridable, not just implicit in `Date.now()` calls
scattered through the data.

Rent history uses 30-day steps between cycles as a demo simplification,
not calendar-accurate month boundaries — acceptable here because the
scenarios care about days-overdue counts, not which calendar month a
row nominally belongs to.

## Schema dependency

These are the concrete gaps between what `spec/product.md` § Data model
names and what a real schema will need to decide. Each is also called
out at its point of use in `lib/types.ts` as `TODO(schema)`.

1. **Reporting link scoping** (spec/index.md open contradiction #7).
   The data model gives the *unit* a durable reporting link; the
   permission boundary tests require a *former tenant's* link to stop
   working. Unresolved in the source spec. The seed gives every unit a
   stable placeholder token and does not attempt to fix the scoping.
2. **Notice status enum.** product.md names the field, not its values.
   The seed uses `"none" | "given"` plus two demo-only fields
   (`noticeGivenOn`, `moveOutDate`) that have no home in the ERD yet.
3. **Request status enum.** product.md's own build-order table attests
   only the lifecycle endpoints ("New to Done"). The seed adds
   `"In progress"` as a provisional middle state.
4. **Request urgency enum.** product.md names the field, not its
   values. The seed uses `"Normal" | "Urgent"` (this pair is attested in
   the UI spec, which this ticket was scoped to not read, so treat it
   as a reasonable guess rather than a confirmed decision).
5. **Document ↔ Request linkage.** product.md's ERD attaches documents
   only to the unit — there's no attested link from a photo document
   back to the maintenance request it illustrates. The seed adds
   `relatedRequestId` purely so the demo narrative is legible.
6. **Deposit deductions have no entity.** The ERD has no
   "deduction"/"settlement" table — only prose about a deposit ledger
   with per-deduction reasons and photos. The seed can only express
   deduction reasons and amounts as free text inside
   `Document.label` (see `unit-bg-302`'s settlement documents), never
   as structured fields. Whoever designs the real schema needs to add
   something here; this seed cannot decide it for them.
7. **Receipts as documents.** product.md's Document type enum includes
   `"receipt"`, implying a stored artifact distinct from
   `RentEntry.receiptNumber`. It's unclear whether every paid rent
   entry should produce one or whether receipts are generated on
   demand. The seed does not generate a receipt Document for every
   paid rent entry (that would be ~30 near-identical rows); this is a
   deliberate simplification, not a claim about the real behaviour.

## Files

- `lib/types.ts` — provisional TypeScript shapes for the demo dataset,
  annotated against product.md field-by-field. Not a schema.
- `lib/dates.ts` — run-date-relative date helpers.
- `data/landlord.ts`, `data/units.ts` — the static portfolio roster.
- `data/scenarios.ts` — all date-sensitive, per-tenant scenario data.
- `data/index.ts` — composes the above into one `DemoDataset`.
- `write-to-supabase.ts` — `TODO(schema)` stub; throws until real
  migrations exist.
- `index.ts` — CLI entry point (`npm run seed:demo`). Builds the
  dataset, prints a summary, and writes a JSON snapshot to
  `scripts/seed/output/` (gitignored — it's a regenerable, date-relative
  artifact, not something to keep in version control).
