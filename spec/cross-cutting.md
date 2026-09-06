# Cross-cutting behaviour

Source: `RentRoll — UI/UX Specification` v1.0, Part E, plus rule statements
repeated throughout Parts B–D, cited as **UIUX**. These rules apply across
many screens; individual screen files reference this document instead of
repeating the rule.

## The two universal rules

Stated on the UIUX "How to read this document" page as applying to *every*
screen in the specification:

1. **No message ever leaves the system without the landlord pressing
   send.** The assistant drafts into an editable field and never
   dispatches on its own.
2. **No tenant-facing screen ever queries or displays rent amounts, repair
   costs, other units, or other tenants.**

> Any ticket that appears to breach either rule should be escalated, not
> implemented.

## Assistant governance

The assistant (see `product.md` § Assistant governance for the three
places it operates) drafts; it never sends. This is enforced at the
interaction level in `screens/shared/S-01-message-composer.md`:

- Opening the composer requests a draft; if the assistant does not respond
  within 4 seconds, a plain template is used instead, with a quiet note
  ("Wrote this from a template — edit as needed."). The composer is never
  blocked waiting on the assistant.
- The draft is always presented in a normal, fully editable text area —
  never as a preview or a locked block.
- Pressing "Open in WhatsApp" (or the equivalent send action) opens the
  target app with the text pre-filled, then the modal switches to a
  confirmation state: **"Did you send it?"** with Yes / Not yet. Only "Yes"
  writes the reminder to the timeline.
- This confirmation step is not optional: the app hands off to WhatsApp
  (or email) and cannot know whether the landlord actually pressed send
  there. Recording a reminder that was never sent would corrupt the
  escalation history and produce a wrong tone next time.

## E1 · Every message the system shows

| Situation | Message | Type |
|---|---|---|
| Payment recorded | "Payment recorded. Receipt RR-0847 created." | Toast with Undo |
| Reminder logged | "Reminder recorded on the tenant's history." | Toast |
| Copied | "Copied." | Toast, 2 seconds |
| Export ready | "Downloaded rent-2026-02.csv." | Toast |
| Calendar file | "Added — open the file to save it to your calendar." | Toast |
| Request submitted (tenant) | "Reported. Your request number is R-0412." | Full screen — T-02 |
| Save failed | "Could not save. Your changes are still here — try again." | Inline, above the form |
| Network lost | "You are offline. We will save this when you reconnect." | Banner |
| Assistant unavailable | "Wrote this from a template — edit as needed." | Quiet note inside S-01 |
| Invalid tenant link | "This link is not valid. Please ask your landlord for your unit link." | Full screen |
| Rent rows missing | "This month's rent rows have not been created." | Banner with action |

### Wording rules

- Never blame the user.
- Never show a code or an internal identifier in tenant-facing text.
- Never use the words *error*, *invalid*, *failed*, or *unauthorised* in
  tenant-facing text.
- Always say what happens next.

## E2 · Empty states

Every empty state names what would appear and offers the action that
creates the first one — never a bare "No data."

| Screen | Message | Action offered |
|---|---|---|
| L-04 Rent, no units | "Add a unit and this month's rent will appear here." | Add unit |
| L-04 Rent, all paid | "Everything is paid for February. Nice." | None |
| L-06 Maintenance | "No open requests. Tenants report problems through their unit link." | Print door QR codes |
| L-08 Units | "Your properties and units live here." | Add your first unit |
| L-12 Agreements | "Nothing expiring in the next 90 days." | Switch to All |
| L-13 Deposits | "Deposits appear here once you add tenants." | Add tenant |
| T-03 Tenant reports | "You have not reported anything yet." | Report a problem |
| T-05 Tenant receipts | "Receipts appear here once your landlord records a payment." | None |

`L-03`'s "nothing needing attention" state is a distinct, deliberate reward
state (not a generic empty state) — see
`screens/landlord/L-03-portfolio-dashboard.md` § States.

## E3 · Loading

- **Page load** — skeleton shapes matching the real layout. Never a
  centred spinner on a blank page.
- **Row action** — spinner inside the button only; the rest of the screen
  stays usable.
- **Assistant draft** — skeleton lines inside the text area, with a
  4-second ceiling before falling back to a template (see § Assistant
  governance above).
- **Photo upload** — thumbnail appears instantly from the local file, with
  a progress ring over it (see `screens/shared/S-04-photo-uploader.md`).
- Anything expected to take over 10 seconds does not exist in version one.
  If a feature needs that long, it is scoped wrong.

## E4 · Permissions — the boundary tests

QA should treat these as the highest-severity test cases in the product,
because they are the direct enforcement of universal rule #2 above.

| Test | Expected |
|---|---|
| Open a unit link belonging to another landlord's unit | Invalid link message |
| Open a former tenant's link after the tenancy ended | Invalid link message |
| Alter the token in a valid tenant URL | Invalid link message |
| Inspect the data behind any tenant page | Contains no rent amount, no cost, no other unit, no other tenant |
| Request another landlord's rent, unit, tenant or request record while signed in | Not found |
| Reach any landlord route while signed out | Redirect to L-01, then return to the intended screen after signing in |
| Open a document belonging to another landlord | Not found |

Implementation note: a former tenant's link failing (row 2) means the
token is **rotated** whenever a unit's current-tenant relationship
changes — a new tenant moving in, or the current tenant moving out to
vacancy. The unit still has exactly one *active* reporting link at any
given time (`Unit.reportingLinkToken` in `product.md` § Data model
remains a single, unit-level field), but rotation on every tenancy
change is what makes a departed tenant's copy of the link stop
resolving. See spec/index.md open contradiction #7 for the full
decision record; this replaces what was previously an open
contradiction between "one durable link per unit" and "a former
tenant's link must expire."

## A5 · Accessibility floor

See `foundations.md` § A5 — accessibility is treated as a foundational,
always-on requirement rather than a per-screen checklist, so it is
specified once there.

## Print-view contract

*(UIUX Part D, "Print views")* Applies to `P-01`, `P-02`, and `P-03`
uniformly:

- Each print view is a **separate page** — its own route, not a modal over
  the app.
- **No navigation, no buttons, no app chrome** — white background only.
- Opened in a **new tab**.
- The print dialog is **triggered on load** — the user does not have to
  find a print button.
- Do not attempt to hide the app's own interface with print CSS media
  queries; the print view is a distinct, minimal page from the start, not
  the main app with parts hidden.

## Reminder ladder (cross-screen reference)

The three-tone escalation ladder (gentle at day 3, direct at day 10, formal
at day 20 — see `product.md` § Rent lifecycle and escalation) is configured
once in `L-15` (`L15-TBL-LADDER`) and consumed by:

- `L-04` (`L04-CHP-STATUS`, `L04-BTN-REMIND`) — which tone to offer based on
  days late.
- `L-05` (`L05-BTN-REMIND`) — opens `S-01` "at the correct escalation
  level."
- `S-01` (`S01-SEG-TONE`) — pre-selected by days overdue, but always
  changeable by the landlord before sending.

Only the day thresholds are landlord-editable; the three tone levels
themselves are fixed by the product.
