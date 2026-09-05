# S-02 · Payment sheet

## Meta

| | |
|---|---|
| Opened from | `L-05`, `L-07` (when tenant-liable), `L-13` |
| Purpose | Turn an outstanding amount into a payment the tenant can complete in one tap, or a QR they can scan. |

## Components

| ID | Type | Content · what happens |
|---|---|---|
| `S02-FLD-AMOUNT` | Money field | Pre-filled with the outstanding amount, editable |
| `S02-FLD-NOTE` | Text field | Pre-filled "Rent Feb 2026 — Flat 2A". Appears in the tenant's payment app. |
| `S02-IMG-QR` | QR image | Regenerates whenever the amount changes. Large enough to scan from a laptop screen. |
| `S02-BTN-PAY` | Primary button | "Open payment app" — works on the tenant's phone; on desktop it is disabled with a tooltip: "Scan the code with your phone instead." |
| `S02-BTN-COPYLINK` | Secondary button | Copies the payment link so it can be pasted into any message |
| `S02-BTN-SENDLINK` | Secondary button | Opens `S-01` with the payment link already embedded |
| `S02-BTN-DOWNLOADQR` | Quiet button | Saves the QR as an image |

## Rules

- If no UPI ID is saved, the sheet shows a prompt with a link to `L-15`
  rather than a broken QR.
- The sheet never claims payment has been received. Marking paid is always
  a separate, deliberate act by the landlord (`L04-BTN-MARKPAID` /
  `L05-BTN-MARKPAID`).
