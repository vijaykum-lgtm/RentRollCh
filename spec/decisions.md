# Decisions — schema-blocking product decisions

This is the canonical decision log for RentRoll. It exists because
RentRoll's database schema does not exist yet, and a schema cannot be
written on top of a spec that leaves conflicting requirements
unresolved — someone would have to guess, silently, per table. This
file makes those calls explicitly, on the record, before schema work
starts.

Scope: every decision here materially affects at least one of database
schema, security/privacy, tenant vs landlord behaviour, navigation,
payment/rent logic, maintenance behaviour, receipts, tokens, or
documents. Purely cosmetic or narrative mismatches between the two
source documents (see § Reviewed, not blocking) are noted but not
"decided," because there is nothing to decide — no product behaviour or
schema shape depends on them.

Each decision records: the conflicting source requirements, why they
cannot both be implemented literally, the decision, and its
consequences. Nothing here invents a table or field beyond what is
needed to make an already-described screen or rule implementable — see
each decision's rationale for the specific spec text that requires it.

**This supersedes the "rotation" resolution of `spec/index.md` open
contradiction #7** (recorded in an earlier pass, before the token model
below was corrected). Decision D1 below is the current, binding
resolution; the inline notes in `cross-cutting.md`, `product.md`,
`L-09-unit-detail.md`, and `spec/index.md` have been updated to match.

## Status

- **12 decisions resolved** (D1–D12 below), covering all 7 mandatory
  schema corrections plus 5 additional schema-blocking gaps found while
  reviewing every screen against the data model.
- **4 items reviewed and left intentionally open** (§ Reviewed, not
  blocking) — real mismatches between the two source documents, but
  none of them affect schema, security, navigation, or any behaviour;
  resolving them would be documentation busywork, not a product
  decision.
- **Nothing identified here should still block schema development.**
  See the closing note at the end of this file.

---

## D1. Two tokens, not one: `unit.door_token` and `tenancy.tenant_token`

**Conflicting source requirements.** `product.md` § Data model gives the
**Unit** entity "its own reporting link" — one durable, unit-level
token, matching Scope §5 stage 1 ("Setting up"): the app "creates a
link and a printable QR for every unit" *before any tenant exists*.
`T-01`'s route is likewise `/u/:unitToken`, "one unguessable token per
unit." But `cross-cutting.md`'s permission boundary tests (§ E4) require
a *former tenant's* link to stop working once their tenancy ends — a
requirement that only makes sense if the link is scoped to the
*tenancy*, not the unit for its lifetime.

**Why they cannot both be implemented literally, with one token.** A
single unit-level token that is also expected to expire per-tenancy is
self-contradictory. Worse, `P-03` (door QR card) and `L08-BTN-PRINTQR`
describe this token as a **physical, printed artifact** — "a sticker
inside the flat door" (Scope §12, connection 11). If that same token
had to expire or rotate every time a tenant moved in or out (an earlier
pass at this decision proposed exactly that), the landlord would need
to reprint and re-stick a physical door sticker at every tenancy
change — a real-world task nothing in this spec describes, and one that
directly contradicts the door card being a durable fixture.

**Decision.** Two separate tokens:

- **`unit.door_token`** — one per unit, created when the unit is added,
  never rotated. This is the physical door-sticker/QR token (`P-03`,
  `L08-BTN-PRINTQR`, `L09-BTN-QR`). It resolves to `T-01`'s report form
  in a generic, no-tenant-identified mode: blank fields, no
  pre-filled name/phone, no "My earlier reports" link — appropriate for
  anyone standing at the door (a new occupant, a guest, a vendor),
  since physical access to the door is itself the access control.
- **`tenancy.tenant_token`** — one per tenancy (one per stay, not one
  per unit-for-life), created at move-in, and valid only while that
  tenancy is current. This is the personal link every tenant is given
  and asked to save (Scope §4: "every tenant gets their own unit link";
  `T02-BTN-SAVE`). It also resolves to `T-01` (pre-filled name/phone,
  "My earlier reports" visible) and is the only way to reach `T-03`,
  `T-04`, `T-05`. It stops resolving the moment the tenancy is no
  longer current — satisfying `cross-cutting.md` § E4 row 2 without
  touching the door token at all.

Both tokens share the same route shape (`/u/:token`); which kind of
token a given value is gets resolved server-side, and the resulting
session context (anonymous-generic vs. a specific tenancy) differs
accordingly.

**Consequences.** `T-01` needs two rendering modes (anonymous vs.
tenancy-scoped) instead of one — a real but small addition to what's
already described. `L09-TAB-OVERVIEW`'s "the unit's reporting link with
copy and share buttons" now specifically means `door_token`; the
tenant's personal link is generated and shown at move-in time instead
(`L-11`/`L-09-BTN-ADDTENANT` flow), not on the unit page. Ending a
tenancy (`L11-BTN-ENDTENANCY`) invalidates only that tenancy's
`tenant_token` — the unit's `door_token` and its printed sticker keep
working, unaffected, for the next occupant.

---

## D2. `payment` is a child of `rent_entry`

**Conflicting source requirements.** `product.md`'s **Rent entry**
entity has single fields for amount paid, paid-on date, and receipt
number — one payment per row, ever. But `L-04`'s own rules describe
**part payment**: "If the amount received is less than rent due, the
row shows 'Part paid — ₹4,000 pending'... **A receipt is issued for
the amount actually received**" — implying a rent entry can receive
more than one payment (a partial amount, then a top-up), each of which
gets its own receipt, date, and reference.

**Why they cannot both be implemented literally.** A rent entry with
singular `amount_paid`/`paid_on`/`receipt_number` fields cannot record
a second payment against the same month without overwriting the first
one's receipt number and date — silently destroying exactly the kind
of payment evidence the product exists to preserve (Scope §2's own
framing: "no receipts were ever issued" is the problem being solved).
It would also break `T-05` ("My receipts" — one row per receipt),
which would only ever be able to show the *last* of two partial
payments for a given month.

**Decision.** `payment` becomes its own entity, many per `rent_entry`:
amount, date received, payment reference, receipt number. Each
mark-paid action (full or partial) creates one `payment` row.
`rent_entry.amount_paid` is a derived value (sum of its payments'
amounts), not a field that gets overwritten.

**Consequences.** `T-05` and `P-01` operate on `payment` rows, not
`rent_entry` rows — which is actually the more natural reading of both
already ("Month · amount · receipt number... a print button **each**").
`L04-CHP-STATUS`'s "Part paid" state is `sum(payments) < amount_due`.
The mark-paid toast's 10-second Undo now reverses (deletes) the
just-created payment row specifically, rather than reverting a mutated
field — a cleaner operation than the current wording implies.

---

## D3. `agreement` is its own entity

**Conflicting source requirements.** `product.md`'s **Tenant** entity
bundles "agreement start/end" directly onto the tenant record. But
`L12-BTN-RENEW`'s own description says a renewal is a save that updates
"the agreement dates" — while `L-12`'s **Rules**, one paragraph later,
require: "**Rent changes take effect from the new start date. Rows
already generated for earlier months are not altered.**" `L13-SEC-DEPOSIT`
also cites an "agreement reference" as a distinct, citable thing, and
`L-09`'s lifetime figures ("This unit earned ₹2.1 lakh...") depend on
correctly attributing historical rent rows to whatever terms applied
at the time.

**Why they cannot both be implemented literally.** If a renewal
overwrites the single start/end/rent fields on Tenant in place (as the
literal wording of `L12-BTN-RENEW` describes), the pre-renewal rent
figure is gone the instant the renewal is saved — even though older
rent rows, created under the old terms, still need to be correctly
understood against what was in force when they were created. "Update
in place" and "preserve every prior term for historical accuracy" are
mutually exclusive on the same field. This also matters across the
11-month leave-and-license terms this spec's own examples assume are
the norm in India — a tenant renewed three times over three years needs
three distinct historical agreements, not one field overwritten three
times.

**Decision.** `agreement` becomes its own entity — one row per signed
or renewed term (start date, end date, rent amount, deposit amount at
the time) — with a tenancy able to accumulate many agreements over its
life. `L12-BTN-RENEW` closes out the current agreement and creates a
new one; it does not mutate the old row.

**Consequences.** `L11-SEC-AGREEMENT` displays the tenancy's *current*
agreement. `L-12`'s "rows already generated are not altered" is now
trivially true — old rent rows simply reference (or were generated
under) the old agreement row, which still exists. `L13-SEC-DEPOSIT`'s
"agreement reference" can cite a specific agreement row.

---

## D4. `agreement` owns `rent_due_day`

**Conflicting source requirements.** The rent lifecycle flowchart
(`product.md` § Rent lifecycle) says "**1st of the month** — a rent row
is created per unit," reading as a single, portfolio-wide constant. But
`L-04`'s **Mid-month move-in** rule ("the first month's row is created
with the pro-rata amount") and its own per-row **Due date** column
imply due dates are meaningful at the level of an individual tenancy,
not uniformly the 1st for every unit regardless of when that tenancy
began. No entity in `product.md`'s data model has a field to hold a
configurable due day at all.

**Why they cannot both be implemented literally.** If "the 1st" is a
hardcoded constant, there is no field anywhere for a specific tenancy
to run on a different recurring due day (e.g. a tenant who reliably
pays on the 5th, once salary clears) — a real practice, and one this
spec's own per-tenancy rent/deposit terms (`L-02`, `L-12`) already
assume is flexible everywhere else.

**Decision.** `rent_due_day` (day-of-month) is a field on `agreement`
(D3), not a global constant and not a landlord-wide setting. The
monthly rent-row generation job reads each unit's *current* agreement's
`rent_due_day` to compute that month's due date.

**Consequences.** Rent-row generation timing (the job runs on the 1st)
and the due-date *value* it assigns are decoupled — generation can run
on the 1st for everyone while still producing different due dates per
tenancy. The reminder ladder's day-3/10/20 offsets (`L15-TBL-LADDER`)
are naturally relative to each rent entry's own due date, which now
already varies correctly per agreement — no further change needed
there.

---

## D5. Notice fields and state belong on `tenancy`, not `tenant`

**Conflicting source requirements.** `product.md`'s **Tenant** entity
lists "notice status" directly on the tenant. But `L-10`'s filter
(Current · On notice · Past) and `L11-BTN-ENDTENANCY` both describe
notice/tenancy state as a lifecycle stage of one specific **stay**, and
Scope §4's ownership model treats "Tenant" as capable of having history
(a person could, in principle, tenant again after a gap).

**Why they cannot both be implemented literally.** Putting notice
status on the person conflates the person with one specific stay. If
the same person ever has a second tenancy (a new stay, possibly a
different unit, after a gap), a tenant-level notice field would either
need resetting — losing the historical notice record of their prior
stay — or would leak stale "on notice" state into a tenancy that never
gave notice.

**Decision.** Notice status and its fields (notice-given date, planned
and actual move-out date) belong on `tenancy`. `tenant` becomes a
lighter identity record (name, phone). This also matches
`scripts/seed/lib/types.ts`'s own `TODO(schema)` markers on
`noticeGivenOn`/`moveOutDate`, written during an earlier ticket for
exactly this reason.

**Consequences.** `L-10`'s filter and `L-11`'s "End tenancy" flow
operate on `tenancy` state. A tenant renting again later is simply a
new `tenancy` row — no reset logic needed.

---

## D6. `audit_event` is its own entity

**Conflicting source requirements.** Many screens describe writing "a
timeline entry" for a different kind of event each time: `L05-BTN-EDIT`
("any edit is recorded on the timeline with the old and new value"),
`L06` (dragging a card between columns, and reopening a request from
Done), `L07-TML-HISTORY` ("every status change, message sent and note
added"). `foundations.md` § A2 defines exactly one reusable **Timeline**
component for all of this. But the only history-shaped entity in
`product.md`'s data model is **Reminder** (level/sent-on/sent-via/call
notes) — a shape specific to rent-chasing communications, not to a
maintenance status change or a manual field edit.

**Why they cannot both be implemented literally.** A single reusable
Timeline UI component implies one underlying event shape it renders
generically. Forcing a maintenance status change or a reopen through
the Reminder entity would mean inventing fake reminder "levels" for
events that are not reminders at all.

**Decision.** `audit_event` becomes its own generic, polymorphic,
append-only entity (what happened, when, optionally an old/new value),
attachable to any parent record. `reminder` remains a separate,
domain-specific entity for rent-chasing communications specifically,
since its fields (level, channel, call notes) are genuinely structured
and worth querying on their own (e.g. "which tenants are at formal
level").

**Consequences.** `foundations.md`'s Timeline component now has one
real data shape behind it across `L-05`, `L-06`, and `L-07`. Amount
edits, status changes, and reopens all become `audit_event` rows.
Payment corrections (D2) and deduction changes (D9) can use the same
mechanism for a clean audit trail without further schema additions.

---

## D7. `document.is_protected`

**Conflicting source requirements.** `L-14` offers a uniform "download,
share, **delete**" on every document row, with no distinction by type.
But `L-13`'s own rule states: "**Once marked settled, the statement
becomes read-only. Corrections require a new statement that references
the first.**" — an explicit immutability requirement for exactly one
document type, with nowhere in the schema to hold it.

**Why they cannot both be implemented literally.** A uniform delete
action on every row directly contradicts a rule that says one specific
row must not be deletable or editable. Without a schema-level flag,
this constraint could only be enforced by special-casing document type
inside one screen's button logic — meaning an export, an API, or a
future admin tool could still delete it.

**Decision.** `document` gains `is_protected`. A settlement statement
is marked protected the moment the tenancy is settled (`L13-BTN-CLOSE`).
Move-in condition photos are also marked protected at creation — this
is a small extension beyond what any single screen states outright,
justified directly by the product's own success metric ("Units with
move-in photos attached — if this is low, the settlement feature is
decorative," `product.md` § Success metrics): these photos are exactly
the evidence a future settlement depends on, and losing one to a casual
`L-14` cleanup would quietly undermine the same feature the metric is
watching for. `L-14`'s delete action refuses (with an explanation, not
a silent no-op) on any protected document.

**Consequences.** `L-13`'s existing "read-only once settled" rule now
has a schema-level home instead of only living in one screen's logic.
`L-14` needs a small rule addition (refuse-with-explanation on
protected rows) — not built here, since no application code is touched
by this ticket, but recorded for whoever builds `L-14`.

---

## D8. No `vendor` entity — vendor stays free text on `request`

**Conflicting source requirements.** `L07-FLD-VENDOR` "remembers
previously used vendors as suggestions," implying a persisted,
recallable list. `product.md`'s data model has no Vendor entity —
vendor name and phone are free text on `request` only.

**Why this does not actually require a new entity.** Unlike the other
decisions above, "remembers... as suggestions" is fully satisfiable
without a distinct table: autocomplete over the *distinct* vendor
name/phone pairs already present in the landlord's own past `request`
rows produces exactly the described behaviour. No screen anywhere in
this 26-file spec browses, edits, rates, or reports on vendors as
first-class objects — there is no vendor list, no vendor detail page,
nothing a Vendor entity would exist to serve beyond the autocomplete
`L07-FLD-VENDOR` already describes.

**Decision.** No `vendor` entity. Vendor name and phone remain free
text on `request`. The "remembers... as suggestions" behaviour is a
read-time query (distinct past values), not a foreign key.

**Consequences.** If a future need arises to rename a vendor across all
past jobs, or track a vendor's reliability, that would justify
revisiting this decision — flagged here as a considered-for-later item,
matching the pattern `product.md` § Scope already uses for other
deferred features, not something built now.

---

## D9. `deduction` is its own entity

**Conflicting source requirements.** `product.md`'s data model has no
deduction or settlement entity anywhere. But `L13-TBL-DEDUCTIONS` is an
"editable table" of multiple rows (description, reason, amount, photo)
per settlement, with a running total and a computed balance
(`L13-SEC-BALANCE`), and `L13-BTN-FROMREQUESTS` explicitly pulls costs
from the tenancy's past maintenance requests, "carrying their photos
across."

**Why they cannot both be implemented literally.** A screen cannot
render, save, and edit a multi-row deductions table with per-row photo
evidence and optional links back to specific maintenance requests if no
entity exists anywhere to persist those rows. "Deposit held − total
deductions = refund due" requires summing real, persisted rows, not a
number computed over nothing.

**Decision.** `deduction` becomes its own entity, scoped to the
tenancy being settled: description, reason, amount, an optional
document reference (the photo — see D10), and an optional `request_id`
when pulled from repair history via `L13-BTN-FROMREQUESTS`. The deposit
balance is computed from `tenancy.deposit_paid` minus the sum of that
tenancy's deductions, not tracked as a separately maintained ledger
field.

**Consequences.** `L13-TBL-DEDUCTIONS` becomes a CRUD view over
`deduction` rows. `L13-BTN-CLOSE` ("mark settled") transitions the
tenancy and, per D7, marks the generated `P-02` statement document
protected. This closes the gap already flagged in
`scripts/seed/SPEC.md` § Schema dependency item 6 ("deposit deductions
have no entity") during the earlier demo-seed design work.

---

## D10. `document.request_id` (optional)

**Conflicting source requirements.** `product.md`'s **Document** entity
says documents attach to the unit, not the tenant — with no mention of
a request. But `L07-GAL-PHOTOS` displays before/after photos scoped to
**one specific maintenance request**, and `L09-TAB-MAINT`'s "repeated
category" note (e.g. "Plumbing reported 4 times in 12 months") depends
on being able to tell which photos and costs belong to which of a
unit's many repairs over the years.

**Why they cannot both be implemented literally.** If a document's
only parent is the unit, there is no way to answer "which photos belong
to request #482 specifically" once a unit has accumulated years of
maintenance photos — only "which photos belong to this unit" in
general, which cannot power a single request's before/after gallery.

**Decision.** `document` gains an optional `request_id`, additive to
(not replacing) `unit_id`. Most documents — agreements, ID proofs,
move-in photos — leave it null and stay unit-scoped, exactly as
`product.md` describes. Maintenance before/after photos set it.

**Consequences.** `L07-GAL-PHOTOS` queries by `request_id`.
`L09-TAB-PHOTOS`'s general library queries by `unit_id`, optionally
grouped by request. This resolves the `relatedRequestId` gap already
flagged `TODO(schema)` in `scripts/seed/lib/types.ts` during the
earlier demo-seed ticket.

---

## D11. Receipts are not persisted as documents

**Conflicting source requirements.** `product.md`'s **Document** type
enum explicitly includes `"receipt"`, implying every receipt is (or
can be) a stored document. But `P-01` is described purely as a print
view generated on load from rent/payment data, and neither `L-04`'s nor
`L-05`'s mark-paid flow ever mentions creating a document — only
assigning a receipt number.

**Why they cannot both be implemented literally.** If every payment
(D2) automatically created a persisted receipt document, `L-14`'s
document table would carry one machine-generated row per payment across
a portfolio's entire history — a volume nothing in `L-14`'s own
description ("every **uploaded** file") suggests, which reads as things
a person explicitly uploaded (agreements, ID proofs, photos), not a
print artifact regenerated on every open. Left undecided, the
`"receipt"` document type is unreachable dead code in the schema.

**Decision.** Receipts are not persisted as `document` rows. `P-01`
always renders live from `payment` (D2) plus `rent_entry`/`tenant`/
`unit`/`landlord` data; `payment.receipt_number` is sufficient to
identify and re-print a receipt at any time. `document.type = "receipt"`
is kept in the enum only for the real, separate case of a landlord
manually uploading a scanned/external receipt (e.g. from before
RentRoll was adopted) — an exception path, not the normal one.

**Consequences.** `L-14`'s document table will rarely show
receipt-typed rows in normal use — expected, not a bug. This matches
the approach `scripts/seed/SPEC.md` § Schema dependency item 7 already
took independently ("the seed does not generate a receipt Document for
every paid rent entry... a deliberate simplification"), confirming the
two pieces of work agree.

---

## D12. `request.no_cost_confirmed`, distinct from an empty `cost`

**Conflicting source requirements.** `L-06`'s rule: "Moving a card to
Done requires either a cost figure **or an explicit 'no cost'**." But
`product.md`'s **Request** entity has a single `cost` field with no way
to represent "explicitly confirmed there was no cost" as distinct from
"nobody has entered a cost yet."

**Why they cannot both be implemented literally.** A single nullable
numeric field has exactly two states (has a number / doesn't); the
rule needs three (not yet decided / confirmed zero-cost / has a
specific cost) to actually block the Done transition only when a cost
decision is genuinely missing.

**Decision.** `request` keeps `cost` (nullable) and adds a boolean
`no_cost_confirmed`, set only via an explicit landlord action. The
Done-transition check is `cost IS NOT NULL OR no_cost_confirmed = true`
— never inferred from an empty field.

**Consequences.** `L-07` needs an explicit "No cost" action alongside
`L07-FLD-COST` (not currently a named component in `L-07`'s file — a
small addition for whoever builds that screen, not built here).

---

## Reviewed, not blocking

These are real mismatches between the two source documents, reviewed
against every category in this ticket's scope. None of them affect
schema, security, tenant/landlord behaviour, navigation, payment logic,
maintenance behaviour, receipts, tokens, or documents — there is no
product decision to make, only a documentation note.

- **`spec/index.md` #1 — landlord screen count (14 vs. 15).** Cover-page
  prose vs. the actual screen appendix. The screen list itself
  (`L-01`–`L-15`) is unambiguous and already used consistently
  everywhere else in the spec. No schema or behavioural impact.
- **`spec/index.md` #2 — shared component count (6 vs. 4+3).** Same
  kind of cover-page-prose-vs-appendix mismatch. `S-01`–`S-04` and
  `P-01`–`P-03` are each unambiguously catalogued. No impact.
- **`spec/index.md` #3 — "Needs attention" example order.** Already
  self-resolving: `L-03`'s own file states the sort-rule table "is
  authoritative for implementation; the wireframe's ordering should be
  treated as illustrative only, not as an alternate spec." Sort order
  is presentation logic with zero data-model impact either way.
- **`spec/index.md` #5 — "the eight modules" framing.** Two different
  lists (Scope's product-narrative "eight modules" vs. the UIUX
  sidebar's eight nav items) happen to both have eight members but
  aren't the same set. `foundations.md` § A3 already states one
  canonical navigation order ("the canonical order for any list of
  landlord sections in this spec") — actual navigation is unambiguous.
  Purely an expository overlap between two prose lists.

## Also resolved: `spec/index.md` #6 — urgency default

Not schema-blocking (the `urgency` field exists and is an enum either
way), but it does affect tenant-facing behaviour, one of this ticket's
named categories, and had no existing resolution.

**Conflicting source requirements.** Scope Diagram 4 (Wireframe C)
shows "Urgent" pre-selected. `T01-SEG-URGENCY`'s own spec text states
urgency "Defaults to Normal."

**Why they cannot both be implemented literally.** A segmented control
has exactly one default selection.

**Decision.** Default to Normal, per `T01-SEG-URGENCY`'s explicit spec
text — consistent with this spec's own established precedent (index.md
#3, above: an illustrative wireframe showing a filled-in example is not
a claim about default state). Defaulting to "Urgent" would also bias
every tenant toward over-flagging urgency, undermining `L-06`'s sort
order and `L-03`'s "urgent maintenance first" rule, both of which only
work if "Urgent" is a meaningful minority signal.

**Consequences.** `T01-SEG-URGENCY` ships with "Normal" pre-selected,
as its own text already said. No schema impact.

---

## Resulting entities (informal — not a schema)

For whoever writes the actual schema next. This is a consistency aid,
not a specification — field types, constraints, indexes, and RLS
policies are schema work, deliberately not decided here.

| Entity | Key fields (beyond `id` / `created_at`) | Notes |
|---|---|---|
| `landlord` | name, phone, email, upi_id, business_name | Unchanged from `product.md`. |
| `property` | landlord_id, name, address | Unchanged. |
| `unit` | property_id, unit_number, type, rent, deposit_amount, occupied, **door_token** | D1. |
| `tenant` | name, phone | Lightened — agreement/notice fields moved off (D3, D5). |
| `tenancy` | unit_id, tenant_id, status, **tenant_token**, notice_given_on, planned_move_out_on, actual_move_out_on | D1, D5. One row per stay. |
| `agreement` | tenancy_id, start_date, end_date, rent_amount, deposit_amount, **rent_due_day** | D3, D4. Many per tenancy. |
| `rent_entry` | unit_id, month, amount_due, due_date | D2 — `amount_paid`/`paid_on`/`receipt_number` move to `payment`. |
| `payment` | rent_entry_id, amount, received_on, reference, receipt_number | D2. Many per rent_entry. |
| `reminder` | tenant_id, level, sent_on, sent_via, call_notes | Unchanged — kept separate from `audit_event` (D6). |
| `request` | unit_id, category, description, urgency, status, vendor_name, vendor_phone, cost, **no_cost_confirmed**, **reported_via** | D8 (no vendor entity), D12, and `reported_via` from the L06-BTN-NEW gap noted in D12's neighbourhood. |
| `deduction` | tenancy_id, description, reason, amount, document_id?, request_id? | D9. |
| `document` | unit_id, type, **request_id?**, **is_protected** | D7, D10. `type = "receipt"` reserved for manual uploads only (D11). |
| `audit_event` | parent_type, parent_id, event_type, occurred_on, actor, from_value?, to_value?, note? | D6. |

---

## Closing note

Nothing identified during this review should still block schema
development. The four items in § Reviewed, not blocking are
deliberately left open in `spec/index.md` — they are documentation
mismatches, not product questions, and resolving them would be
busywork rather than a decision. Everything else that touched database
schema, security/privacy, tenant vs. landlord behaviour, navigation,
payment/rent logic, maintenance behaviour, receipts, tokens, or
documents has a recorded decision above.
