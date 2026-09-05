# T-02 · Submitted confirmation

## Meta

| | |
|---|---|
| Access | Anyone holding the link. No sign-in. |
| Reached from | `T-01` on successful submission |
| Leads to | `T-03` |

## Components

| ID | Type | Content · what happens |
|---|---|---|
| `T02-SEC-CONFIRM` | Confirmation block | Tick icon · "Reported. Your request number is **R-0412**." · "Your landlord has been notified." |
| `T02-SEC-SUMMARY` | Summary block | What they reported, so they can see it was captured correctly |
| `T02-BTN-TRACK` | Primary button | "Check the status" → `T-03` |
| `T02-BTN-SAVE` | Secondary button | "Save this link" → opens the device share sheet so they can bookmark or message it to themselves. On desktop, copies to clipboard with a toast. |
| `T02-BTN-ANOTHER` | Quiet button | "Report something else" → back to `T-01`, blank |

> **`T02-BTN-SAVE` is more important than it looks.** A tenant who loses
> the link phones the landlord instead. This is the one moment they are
> guaranteed to be looking at the screen, so this is where we ask them to
> keep it.
