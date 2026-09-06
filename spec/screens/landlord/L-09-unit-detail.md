# L-09 · Unit detail

## Meta

| | |
|---|---|
| Route | `/units/:unitId` — a full page, not a panel, because it holds a lot |
| Purpose | The unit's whole life: who lives there, what it earns, what it has cost, what it looked like at move-in. |

## Layout

Header with unit identity and status · four tabs: Overview · Rent history
· Maintenance history · Photos & documents.

## Components

| ID | Type | Content and behaviour |
|---|---|---|
| `L09-TAB-OVERVIEW` | Tab | Rent, deposit, current tenant card, the unit's **door token** link (durable, unit-level — see `spec/decisions.md` D1) with copy and share buttons, lifetime figures: total rent collected, total maintenance spend, net |
| `L09-TAB-RENT` | Tab | Every month, every tenant, ever. Paid or not, and how much. |
| `L09-TAB-MAINT` | Tab | Every request against this unit, with cost. A repeated category shows a quiet note: "Plumbing reported 4 times in 12 months." |
| `L09-TAB-PHOTOS` | Tab | Move-in condition photos grouped by tenancy, plus repair photos and documents |
| `L09-BTN-COPYLINK` | Icon button | Copies the unit's tenant link to the clipboard |
| `L09-BTN-SHARELINK` | Icon button | Opens the device share sheet; on desktop falls back to copy |
| `L09-BTN-QR` | Icon button | Shows the unit QR in a modal with a print option |
| `L09-BTN-MAP` | Icon button | Opens the property address in Maps in a new tab |
| `L09-BTN-ADDTENANT` | Primary button | Visible only when vacant. Opens the tenant form. |

> **The lifetime figures on the Overview tab are the quiet insight in this
> product.** "This unit earned ₹2.1 lakh and cost ₹34,000 last year" is a
> fact most landlords have never seen for a single flat. Give it space.

> RESOLVED: "the unit's reporting link" here and in `product.md` § Data
> model is actually two separate tokens — a durable, unit-level
> `door_token` (what `L09-BTN-COPYLINK` and `L09-BTN-SHARELINK` act on,
> on this screen) and a per-tenancy `tenant_token` given to the tenant
> directly at move-in, which is what goes invalid when their tenancy
> ends — satisfying the permission boundary tests in `cross-cutting.md`
> § E4 without the door token ever changing. See `spec/decisions.md`
> D1 and Open contradiction #7 in `spec/index.md` for the full decision
> record.
