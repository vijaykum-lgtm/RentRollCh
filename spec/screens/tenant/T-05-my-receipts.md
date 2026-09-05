# T-05 · My receipts

## Meta

| | |
|---|---|
| Access | Anyone holding the link. No sign-in. |

## Components

| ID | Type | Content · what happens |
|---|---|---|
| `T05-LST-RECEIPTS` | List | Month · amount · receipt number · a print button each |
| `T05-BTN-PRINT` | Icon button | Opens `P-01` for that receipt |

## States

| State | Display |
|---|---|
| No receipts yet | "Receipts appear here once your landlord records a payment." No action offered (see `cross-cutting.md` § E2). |

This is the one tenant screen that intentionally shows a money figure —
the tenant's own payment amount, on their own receipt. This does not
conflict with the "no rent figure" rule on `T-04`: that rule concerns
displaying the tenant's *current/ongoing* rent liability; a past receipt of
what they themselves paid is the exception the source document names
explicitly.
