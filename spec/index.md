# RentRoll — Implementation Specification

This is the working specification for RentRoll, converted from two source
documents so that independent implementation agents can build against it
without needing the original PDFs:

- **`RentRoll — Product Scope Document` (v1.0)** — the product's intent: who
  it is for, the problem, the eight modules, the data model, and what is in
  and out of scope. Cited below as **Scope §n**.
- **`RentRoll — UI/UX Specification` (v1.0)** — the build reference: every
  screen, component, interaction, state and rule, each with a stable ID.
  Cited below as **UIUX §X** or by screen ID (e.g. **L-03**).

Where the two documents agree, this spec merges them. Where they disagree,
**both positions are preserved** and the conflict is marked inline with
`> OPEN:` and also listed in [Open contradictions](#open-contradictions)
below. Do not silently resolve an `OPEN` marker — implement around it, or
raise it with the product owner.

## How to use this spec

1. Start with `foundations.md` for the design system (tokens, components,
   navigation shell, responsive and accessibility rules) and the identifier
   scheme.
2. Read `cross-cutting.md` for rules that apply across many screens: the
   messaging rule, wording rules, empty/loading states, permission boundary
   tests, and print-view conventions. Screens reference these rather than
   repeating them.
3. Read `product.md` for the business logic: personas, the rent lifecycle,
   the data model, the twelve external connections, and what is deliberately
   out of scope.
4. Build against `screens/**` — one file per screen, component, or print
   view, each self-contained enough to implement in isolation once
   foundations and cross-cutting rules are known.

## File map

| File | Contents |
|---|---|
| `spec/index.md` | This file — navigation, ID scheme summary, traceability, open contradictions |
| `spec/product.md` | Vision, personas, journey, the eight modules, information architecture, rent lifecycle, data model (ERD), the twelve connections, scope (in / excluded / later), success metrics |
| `spec/foundations.md` | Design tokens, type scale, spacing/radius/elevation, component library, global navigation, responsive breakpoints, accessibility floor, identifier scheme |
| `spec/cross-cutting.md` | The two universal rules, assistant governance, message/toast catalog, empty-state catalog, loading behaviour, permission boundary tests, wording rules, print-view contract |
| `spec/screens/landlord/L-01..L-15` | One file per landlord (signed-in) screen |
| `spec/screens/tenant/T-01..T-05` | One file per tenant (link-only, no sign-in) screen |
| `spec/screens/shared/S-01..S-04` | Shared components used from multiple screens (modal composer, payment sheet, share menu, photo uploader) |
| `spec/screens/print/P-01..P-03` | The three print views |

## Identifier scheme (summary — full version in `foundations.md`)

| Pattern | Example | Meaning |
|---|---|---|
| `L-nn` | `L-03` | Landlord screen, requires sign-in |
| `T-nn` | `T-01` | Tenant screen, public link, no sign-in |
| `S-nn` | `S-02` | Shared component used on several screens |
| `P-nn` | `P-01` | Print view |
| `Lnn-TYPE-NAME` | `L04-BTN-REMIND` | A specific element on a specific screen |

Element type codes: `BTN` button · `LNK` link · `FLD` input field · `SEL`
dropdown · `CHK` checkbox · `TAB` tab · `ROW` table/list row · `CRD` card ·
`MOD` modal · `TST` toast · `CHP` chip/badge · `SEG` segmented choice ·
`TBL` table · `LST` list · `TML` timeline · `HDR` header · `SEC` section/block ·
`GAL` photo gallery · `IMG` image · `UPL` uploader/drop zone · `ZONE` drop
zone · `THUMB` thumbnail · `ERR` inline error · `STRIP` summary strip ·
`CHT` chart · `COL` board column.

## Screen index

**Landlord (signed in):** L-01 Sign in · L-02 First-run setup · L-03
Portfolio dashboard (hub) · L-04 Rent due board · L-05 Rent detail panel ·
L-06 Maintenance board · L-07 Request detail panel · L-08 Unit register ·
L-09 Unit detail · L-10 Tenant list · L-11 Tenant detail · L-12 Agreement
tracker · L-13 Deposit and settlement · L-14 Documents and exports · L-15
Settings.

**Tenant (link only, no sign-in):** T-01 Report a problem (entry point) ·
T-02 Submitted confirmation · T-03 My reports and their status · T-04 My
unit and landlord contact · T-05 My receipts.

**Shared components:** S-01 Message composer · S-02 Payment sheet · S-03
Share and copy menu · S-04 Photo uploader.

**Print views:** P-01 Rent receipt · P-02 Settlement statement · P-03 Door
QR card.

## Traceability — every source section has a home

| Source | Section | Lands in |
|---|---|---|
| Scope | §1 Executive summary | `product.md` § Executive summary |
| Scope | §2 The problem we are solving | `product.md` § The problem |
| Scope | §3 Product vision and design principles | `product.md` § Vision and principles |
| Scope | §4 Who uses the product | `product.md` § Personas |
| Scope | §5 User journey map (Diagram 1) | `product.md` § User journey |
| Scope | §6 What the product does — eight modules | `product.md` § The eight modules |
| Scope | §7 Screen wireframes (Diagram 4) | `screens/**` (per-screen layout notes) + `product.md` note on OPEN-3 |
| Scope | §8 Information architecture (Diagram 5) | `product.md` § Information architecture |
| Scope | §9 User flow diagram (Diagram 2) | `product.md` § User flow summary |
| Scope | §10 Rent lifecycle flowchart (Diagram 3) | `product.md` § Rent lifecycle and escalation |
| Scope | §11 Where the assistant helps | `cross-cutting.md` § Assistant governance |
| Scope | §12 The twelve connections | `product.md` § The twelve connections |
| Scope | §13 System architecture (Diagram 6) | `product.md` § System architecture |
| Scope | §14 Data flow diagram (Diagram 7) | `product.md` § Data flow |
| Scope | §15 Entity relationship diagram (Diagram 8) | `product.md` § Data model |
| Scope | §16 Scope — included, excluded, later | `product.md` § Scope |
| Scope | §17 How this makes life easier | `product.md` § How this makes life easier |
| Scope | §18 How we will measure success | `product.md` § Success metrics |
| UIUX | How to read this document | `spec/index.md` (this section) + `foundations.md` § Identifier scheme |
| UIUX | Part A · Foundations (A1–A4) | `foundations.md` |
| UIUX | Screen map | `spec/index.md` § Screen index |
| UIUX | Part B · Landlord screens (L-01–L-15) | `screens/landlord/*.md` |
| UIUX | Part C · Tenant screens (T-01–T-05) | `screens/tenant/*.md` |
| UIUX | Part D · Shared components (S-01–S-04) + print views (P-01–P-03) | `screens/shared/*.md`, `screens/print/*.md` |
| UIUX | Part E · Cross-cutting behaviour (E1–E5) | `cross-cutting.md` |
| UIUX | Part F · Build tracker | `product.md` § Suggested build order (informational; not a spec requirement) |

## Open contradictions

These are preserved exactly as found — not resolved — because resolving
them would mean guessing at product intent. Each is also marked with
`> OPEN:` at its most specific location.

Contradictions #4, #6, and #7 have since been resolved by explicit
product decision — see `spec/decisions.md` for the full record (D1, D8,
and the urgency-default decision respectively). Their `> OPEN:` markers
have been replaced in place with short pointers, in `cross-cutting.md`,
`product.md`, `screens/landlord/L-09-unit-detail.md`, and
`screens/tenant/T-01-report-a-problem.md`.

1. **Landlord screen count.** UIUX cover page states "14 landlord screens."
   The Screen map and Part B document 15 (`L-01` through `L-15`). See
   `spec/index.md` screen index above and `foundations.md`.
2. **Shared component count.** UIUX cover page states "6 shared
   components." Part D documents exactly 4 (`S-01`–`S-04`); the 3 print
   views (`P-01`–`P-03`) are catalogued separately under "Print views," not
   as shared components. Neither 4 nor 4+3=7 equals 6. See
   `screens/shared/` and `screens/print/`.
3. **"Needs attention" example order vs. the defined sort rule.** Scope
   Diagram 4 (Wireframe A) shows an example list in the order: `4C` rent 18
   days overdue, `3B` agreement ends in 22 days, `1B` geyser leaking
   (urgent), `2A` rent 5 days overdue. Applying the UIUX `L-03` sort rule
   (urgent maintenance first, then overdue 10+ days, then agreements ≤30
   days, then overdue 1–9 days) to the same four items yields a different
   order: `1B`, `4C`, `3B`, `2A`. See `screens/landlord/L-03-portfolio-dashboard.md`.
4. **RESOLVED — Vendor as a persisted entity.** `L-07`'s vendor field
   "remembers previously used vendors as suggestions," implying some
   stored list of vendors. The Scope Document's entity relationship
   diagram (§15) has no Vendor entity — vendor name and phone appear to
   live only as free text on each Request record. **Decision:** no
   distinct Vendor entity — the field stays free text on Request, and
   "remembers... as suggestions" is a read-time autocomplete over past
   values, which fully satisfies the described behaviour without a new
   table. See `spec/decisions.md` D8 for the full rationale.
5. **What counts as one of "the eight modules."** Scope §6 lists eight
   modules and includes the tenant-facing "Tenant request portal" among
   them. The UIUX landlord sidebar (§A3) also has eight items, but
   substitutes "Documents" (`L-14`) for the tenant-facing module, which
   correctly sits on the tenant side per the Information Architecture
   diagram (Scope §8). The two "eights" are different sets. See
   `product.md` § The eight modules.
6. **RESOLVED — Default urgency vs. illustrative wireframe.** Scope
   Diagram 4 (Wireframe C) shows "Urgent" as the highlighted urgency
   option. UIUX `T01-SEG-URGENCY` states urgency "Defaults to Normal."
   **Decision:** default to Normal, per `T01-SEG-URGENCY`'s explicit
   spec text; the wireframe is an illustrative filled-in example, not a
   statement of default state (consistent with how contradiction #3
   above treats the same source document's wireframes). See
   `spec/decisions.md` for the full rationale. See
   `screens/tenant/T-01-report-a-problem.md`.

7. **RESOLVED — Unit-scoped link vs. tenancy-scoped expiry.** The Scope
   Document's data model gives each **unit** "its own reporting link"
   (§15) and UIUX's `T-01` route (`/u/:unitToken`) is likewise described
   as one token per unit. But `cross-cutting.md`'s permission boundary
   tests (UIUX §E4) require a former tenant's link to stop working once
   their tenancy ends — which only makes sense if the link (or its
   validity) is actually scoped to the *tenancy*, not the unit for its
   lifetime. The two framings were not reconciled in either source
   document.

   **Decision (superseding an earlier "single rotating token" pass at
   this contradiction):** two separate tokens. `unit.door_token` is
   created once, when the unit is added, and never changes — this is
   the physical door-sticker/QR token (Scope §5 stage 1 mints it before
   any tenant exists; Scope §12 connection 11 describes it as a
   sticker on the door). `tenancy.tenant_token` is created per tenancy
   (one per stay) and is the tenant's own saved personal link; it stops
   resolving once that tenancy is no longer current. Both satisfy their
   respective source statements at once: the unit still "has its own
   reporting link" (the durable door token), and a former tenant's
   personal link stops working exactly when their tenancy ends,
   without ever touching — or requiring the reprinting of — the
   physical door sticker. See `spec/decisions.md` D1 for the full
   rationale, `cross-cutting.md` § Permission boundary tests, and
   `screens/landlord/L-09-unit-detail.md`.

No other numeric, behavioural, or structural conflicts were found between
the two source documents during this conversion.
