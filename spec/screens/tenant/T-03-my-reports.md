# T-03 · My reports and their status

## Meta

| | |
|---|---|
| Access | Anyone holding the link. No sign-in. |
| Reached from | `T-01`, `T-02`, and the "My earlier reports" link on any tenant page |

## Components

| ID | Type | Content · what happens |
|---|---|---|
| `T03-LST-REPORTS` | List | Every request from this unit's current tenancy: number, category, date, status chip, and the landlord's latest update if any |
| `T03-CHP-STATUS` | Status chip | Received · Assigned · In progress · Done. Plain words, no internal jargon. |
| `T03-TML-ITEM` | Timeline | Expanding a report shows its history — reported, assigned, updated, completed — with tenant-safe wording only |

## States

| State | Display |
|---|---|
| No reports yet | "You have not reported anything yet." with a "Report a problem" action back to `T-01` (see `cross-cutting.md` § E2) |

Money, vendor names, vendor cost, and any other unit or tenant are never
present on this screen or in its underlying data — see `cross-cutting.md`
§ The two universal rules and § Permission boundary tests.
