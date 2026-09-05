# S-01 · Message composer

## Meta

| | |
|---|---|
| Type | Modal, 560px on desktop, full screen on mobile |
| Opened from | `L-03`, `L-04`, `L-05`, `L-07`, `L-12`, `L-13` |
| Purpose | The single place where every outgoing message is reviewed and sent. This component is where the "nothing sends by itself" rule is enforced in code. |

See `cross-cutting.md` § The two universal rules and § Assistant
governance for the policy this component implements.

## Components

| ID | Type | Content and behaviour |
|---|---|---|
| `S01-HDR` | Modal header | "Message to Suresh Khan · Flat 4C" |
| `S01-CHP-CONTEXT` | Chip row | Context reminder — e.g. "Rent · 18 days overdue · Level 3 of 3" |
| `S01-SEG-TONE` | Segmented choice | Gentle · Direct · Formal. Pre-selected by days overdue. Changing it regenerates the draft. |
| `S01-FLD-MESSAGE` | Text area | The drafted message, fully editable. Auto-grows. This is a normal editable field, not a preview. |
| `S01-CHK-PAYLINK` | Checkbox | "Include a payment link" — ticked by default for rent messages, absent for others |
| `S01-BTN-REGENERATE` | Quiet button | "Write it differently" — requests a new draft, keeping any edits in a restorable state |
| `S01-BTN-WHATSAPP` | Primary button | "Open in WhatsApp" |
| `S01-BTN-COPY` | Secondary button | "Copy" |
| `S01-BTN-EMAIL` | Quiet button | "Email instead" — only when an email address exists |
| `S01-BTN-CANCEL` | Quiet button | "Cancel" |

## Interactions

| Trigger | Result |
|---|---|
| Modal opens | Draft is requested and a skeleton shows in the text area for up to 4 seconds. If it does not arrive, a plain template appears with a quiet note: "Wrote this from a template — edit as needed." The composer is never blocked by the assistant. |
| `S01-BTN-WHATSAPP` | Opens WhatsApp in a new tab with the current text pre-filled → the modal switches to a second state: "Did you send it?" with Yes and Not yet. Only "Yes" writes the reminder to the timeline. |
| `S01-BTN-COPY` | Copies to clipboard, toast confirms, and the same "Did you send it?" prompt appears |
| `S01-SEG-TONE` | If the message has been edited, warn before regenerating: "This will replace your edits." |
| `S01-BTN-CANCEL` | Closes with no record written. If edited, confirm first. |

> **The "Did you send it?" step is not optional.** The app hands the
> message to WhatsApp; it cannot know whether the landlord actually
> pressed send there. Recording a reminder that was never sent would
> corrupt the escalation history and produce a wrong tone next time.
