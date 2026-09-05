# L-15 · Settings

## Meta

| | |
|---|---|
| Route | `/settings` |
| Purpose | The landlord's own defaults: payment identity, branding, rent escalation, the reminder ladder, and the accountant's email. |

## Components

| ID | Type | Content · what happens |
|---|---|---|
| `L15-FLD-UPI` | Text field | UPI ID used in every payment link and QR |
| `L15-FLD-RECEIPTNAME` | Text field | Name printed on receipts and statements |
| `L15-UPL-LOGO` | Photo uploader | Optional logo for print views |
| `L15-FLD-ESCDEFAULT` | Text field | Default rent escalation percentage |
| `L15-TBL-LADDER` | Editable table | The reminder ladder: day 3 gentle, day 10 direct, day 20 formal. Days are editable; the three levels are fixed. |
| `L15-FLD-CAEMAIL` | Text field | Accountant's email, used by `L14-BTN-EMAILCA` |

## Rules

- `L15-TBL-LADDER`'s three tone levels (gentle, direct, formal) cannot be
  reordered, renamed, or removed — only their day-offset triggers are
  editable. See `product.md` § Rent lifecycle and escalation.
- `L15-FLD-ESCDEFAULT` is the default consumed by `L12-FLD-ESCALATION`; it
  does not retroactively change escalation percentages already applied to
  in-flight renewals.
