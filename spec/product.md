# Product — vision, business rules, and data model

Source: `RentRoll — Product Scope Document` v1.0 (cited as **Scope §n**),
cross-referenced with `RentRoll — UI/UX Specification` v1.0 (cited as
**UIUX** or by screen ID) where the two overlap.

## Executive summary

RentRoll is a web app that keeps a rental business in one place. The
landlord signs in and sees everything — who has paid, what is broken, which
agreement is about to expire. The tenant does not sign in at all: they open
one saved link and use it to report a problem or check status. *(Scope §1)*

Most small landlords in India run their properties on a diary, a
spreadsheet and a WhatsApp group. That works until it doesn't: rent goes
uncollected because nobody is certain who has paid, an agreement expires
without anyone noticing, and a deposit argument at move-out is settled by
whoever remembers more confidently, because nobody has a photo. These are
not dramatic failures — they are quiet leaks that repeat every month.
*(Scope §2)*

RentRoll fixes them with four ideas:

- **One record for every unit.** Rent history, photos, repairs and
  documents live together, for years.
- **Dates that watch themselves.** Rent due dates and agreement expiry are
  tracked by the app, not by memory.
- **A link for the tenant.** No account, no password, no app to install.
  One page they can use in two minutes.
- **Everything ready to send.** Reminders, receipts and notices are drafted
  for the landlord to review and send in one tap.

The result: the landlord stops carrying the rental business in their head.
Both sides want the same thing — a clear record. The landlord wants to know
what is owed; the tenant wants proof of what they paid and what they
reported. One shared record solves both, and removes most of the tension
between them. *(Scope §2, "The insight")*

## The problem

**What the landlord lives with today** *(Scope §2)*:

- **Uncertainty about money.** Rent arrives by UPI to a personal number.
  The notification is buried. On the 12th, they are not sure who has paid.
- **Avoiding the awkward message.** They do not chase on day three because
  it feels rude, so they wait until day twenty-five and send something
  sharper than they meant to.
- **Dates that slip past.** Nothing announces an expiry. An agreement that
  lapsed in November is discovered in March, and four months of escalation
  are gone.
- **Interruptions.** Maintenance arrives as phone calls at inconvenient
  hours, and half are forgotten by the next morning.
- **Arguments without evidence.** At move-out, nobody has a photo of how the
  flat looked at move-in. The deposit is returned in full because arguing
  is not worth it.
- **March panic.** The accountant reconstructs a year of rental income from
  bank statements, because no receipts were ever issued.

**What the tenant lives with today** *(Scope §2)*:

- No receipt, which becomes a problem when they need proof of rent paid.
- No idea whether their repair request was noted, or when someone is coming.
- Uncertainty about the exact amount and where to send it.
- At move-out, a deposit deduction with no explanation attached.

## Vision and principles

A rental business should feel like a tidy folder, not a memory test.
*(Scope §3)*

| Principle | What it means in the product |
|---|---|
| The tenant never signs up | A tenant who must create an account to report a leaking tap will call instead. One saved link, no password, works on any phone. |
| Nothing sends by itself | Every message is drafted by the app and sent by the landlord. A firm reminder sent automatically to someone who paid yesterday damages a relationship permanently. |
| Money stays private | The tenant's pages never show rent figures, repair costs or anything about other units. |
| Dates are the product | Rent due and agreement expiry are the two things the app watches so the landlord does not have to. |
| Evidence, always | Photos at move-in, photos on every repair, a written reason on every deduction. This is what makes settlement calm. |
| One tap to act | Wherever the app shows a problem, the action to fix it is on the same screen. |

These five/six principles are the test for every feature added later: if a
proposed feature breaks one of these, it does not belong in RentRoll without
an explicit decision to change the principle itself.

## Personas

*(Scope §4)*

| | Landlord | Tenant |
|---|---|---|
| How they get in | Signs in with email and password | Opens a saved link. No account. |
| How often | A few times a week; more around the 1st to 10th | A few times a year, when something breaks |
| On what | Laptop mostly, phone sometimes | Phone, almost always |
| What they see | Everything — all units, all money, all history | Only their own unit, and no money |
| What they want | To know nothing is slipping | To be heard, and to have proof |

**Ownership model:** one landlord has many properties. Each property has
many units. Each unit has one *current* tenant and a history of past
tenants. Every tenant gets their own unit link. *(Scope §4)*

## User journey

*(Scope §5, Diagram 1 — six stages, read left to right)*

| Stage | Landlord does | Tenant does | The app does | Result |
|---|---|---|---|---|
| 1 · Setting up | Adds properties and units. Enters rent, deposit and his UPI ID. | Not involved yet | Creates a link and a printable QR for every unit. | Everything is in one place. |
| 2 · Move-in | Adds the tenant, agreement dates, and photos of the flat's condition. | Gets a welcome message with their unit link. Saves it. Sees the QR too. | Stores the photos. Starts counting down to agreement expiry. | Both sides agree on the starting point. |
| 3 · Every month | Glances at dues. Sends the drafted reminder. Marks payment received. | Taps the pay link, amount already filled. Receives a numbered receipt. | Creates the month's rent rows, drafts reminders, issues the receipt. | No chasing and no guessing. |
| 4 · Something breaks | Assigns a vendor, sends him the address, records what it cost. | Opens the link, reports the problem with a photo. Checks status later. | Sorts the request, keeps its status, files the cost against the unit. | No late-night calls. Nothing forgotten. |
| 5 · Renewal | Reviews what is expiring. Sends the renewal notice, with new rent. | Confirms renewal, or gives notice. Knows the new rent in advance. | Warns at 90, 60 and 30 days. Works out the escalated rent. | No agreement ever lapses again. |
| 6 · Move-out | Notes deductions with a reason and a photo for each one. | Receives a written settlement showing every deduction and its photo. | Builds the settlement statement from the deposit ledger and the repair history. | A calm settlement instead of a row. |

## The eight modules

*(Scope §6)*

| Module | What it shows | What the landlord can do from it |
|---|---|---|
| Portfolio dashboard | Occupied against vacant, collected this month, dues outstanding, agreements expiring soon, income over time | Jump straight to whatever is red — the "is anything wrong" screen |
| Rent due board | A grid of month against unit — paid, pending, or overdue by so many days | Send the drafted reminder, share a payment link, mark payment received, issue and send the receipt |
| Tenant request portal *(the tenant's page)* | To the tenant: a simple form and the status of what they reported | Nothing — this page belongs to the tenant. No rent, no costs, no other units. |
| Maintenance board | Every request by status, with photos, the vendor assigned and what it cost | Assign a vendor with the address, update the tenant, record the cost against the unit |
| Unit register | Every unit, its rent, its deposit, its condition photos and its full repair history | Add units, print the door QR, review what a unit has cost over the years |
| Tenant record | Contact details, agreement dates, rent paid to date, deposit held, documents | Call, message, share the unit link, attach agreement |
| Agreement tracker | Everything expiring in 90, 60 and 30 days, with the renewal value calculated | Send a renewal notice, add the date to a calendar, record a notice served |
| Deposit and settlement | Deposit held, each deduction with its reason and photo, the balance due back | Build the settlement statement, print it, send it to the tenant |

> OPEN: this table names eight modules and includes the tenant-facing
> "Tenant request portal" among them. The UIUX landlord sidebar (Part A3)
> separately lists eight *landlord* navigation items — Dashboard, Rent,
> Maintenance, Units, Tenants, Agreements, Deposits, **Documents** — which
> swaps in Documents & exports (`L-14`, not named as one of the eight here)
> in place of the tenant-facing module. Both "eights" are real but they are
> different sets; see Open contradiction #5 in `spec/index.md`.

**Deliberately not in the product** (condensed form — full list under
Scope below): listing vacant flats, tenant background checks, accounting
software integration, and anything that sends a message without the
landlord reading it first. Each either belongs to a different product or
breaks a principle above. *(Scope §6)*

## Information architecture

*(Scope §8, Diagram 5)*

Two separate worlds share one set of records. Everything on the landlord
side needs sign-in; everything on the tenant side needs only a link.

```
                              RentRoll
                 ┌────────────────┴────────────────┐
          Landlord workspace                  Tenant link
        (requires sign-in)                (one link per unit, no sign-in)
                 │                                   │
   ┌─────────────┼─────────────┐         ┌───────────┼───────────┐
   Portfolio dashboard   Unit register     Report a problem   My unit and
   Rent due board        Tenant records    Track what I       contact details
   Maintenance board     Deposit & settle. reported            My receipts
   Agreement tracker     Documents & exp.
                 │                                   │
                 └───────── both read/write the same shared records ─────────┘
```

The tenant side has no path to any money screen. *(Scope §8)*

## User flow summary

*(Scope §9, Diagram 2)*

**Tenant (no sign-in):** opens the saved unit link → reports a problem
(category, description, photo, urgency) → sees a confirmation with a
request number → returns to the same link later to check status or find a
receipt. Tenants also arrive by message: a rent reminder with a payment
link, a receipt, or a status update.

**Landlord (signs in):** signs in → lands on the portfolio dashboard ("what
needs attention today") → the dashboard routes to whichever board holds
today's problem:
- **Rent due board** → send reminder, share payment link, mark paid →
  receipt, print or export.
- **Maintenance board** → assign a vendor, send him the address, record the
  cost, update the tenant.
- **Agreement tracker** → send renewal notice, add date to calendar, settle
  a deposit, print the statement.
- **Units & tenants** → add a unit or tenant, upload condition photos,
  share the unit link, print the door QR.

Every board carries its own actions; the landlord is never routed away to a
generic "settings" area to get something done.

## Rent lifecycle and escalation

*(Scope §10, Diagram 3 — "the one rule set worth writing down precisely")*

Every reminder is **drafted by the app and sent by the landlord** — the app
never sends anything on its own. This applies without exception across the
whole product (see `cross-cutting.md` § The two universal rules).

```
1st of the month — a rent row is created per unit
        │
        ▼
   Paid by the due date? ──Yes──▶ Landlord marks it paid
        │ No                       (receipt is numbered, printed or sent)
        ▼
Day 3 — gentle nudge (drafted, landlord reviews and sends)
        │
        ▼
   Paid now? ──Yes──▶ Marked paid · receipt issued (reminder history kept)
        │ No
        ▼
Day 10 — direct reminder (states the amount and the date)
        │
        ▼
   Paid now? ──Yes──▶ Marked paid · receipt issued (the month closes on the board)
        │ No
        ▼
Day 20 — formal notice (quotes the agreement clause)
        │
        ▼
Landlord calls the tenant (the call is logged on the record)
```

Three escalation steps at day 3, 10 and 20, each with a different tone
(gentle → direct → formal). The landlord approves every message. Whatever
happens is written to the record, so the history is complete either way.
The reminder ladder's day offsets are editable per landlord in settings
(`L15-TBL-LADDER`); only the day numbers are editable — the three tone
levels themselves (gentle, direct, formal) are fixed. *(UIUX L-15)*

## Assistant governance

*(Scope §11)* The product has a built-in assistant used in exactly three
places, and it never sends anything itself:

| Where | What it does | Why it matters |
|---|---|---|
| Rent reminders | Writes the message at the tone appropriate to how late the payment is — gentle at day 3, direct at day 10, formal at day 20 | Landlords avoid chasing early because the words feel rude; having the right words ready removes that hesitation |
| Maintenance requests | Reads what the tenant typed and suggests a category and an urgency | Consistent sorting is what makes the "what keeps breaking" view possible later |
| Deposit settlement | Turns the deposit amount, the deductions and their reasons into a written statement | A clear statement that explains each deduction turns an argument into a signature |

**Firm rule:** the assistant drafts, the landlord decides. Nothing written
by the assistant reaches a tenant without the landlord reading it first.
This is a product rule, not a preference — see `cross-cutting.md` § The two
universal rules and `screens/shared/S-01-message-composer.md` for the
interaction-level enforcement (the "did you send it?" confirmation step).

## The twelve connections

*(Scope §12)* All twelve are available from day one. None is a screen of
its own — each appears inside the workflow where it is needed, often in
several different places. The design decision behind this list: RentRoll
opens apps the landlord and tenant already use, rather than asking them to
adopt anything new. Nothing to install, nothing to configure, nothing that
can stop working or start charging.

| # | Connection | Where it is used |
|---|---|---|
| 1 | Pay by UPI | Opens the tenant's payment app with the exact amount filled in. Monthly rent from a reminder · deposit at move-in · a repair the tenant is liable for · a late fee. |
| 2 | Payment QR | The same payment, as a scannable code. Printed on every receipt · shown on the rent screen so the landlord can hold up his laptop · shared with a tenant whose phone will not open links. |
| 3 | Send on WhatsApp | Opens WhatsApp with the message already typed, for the landlord to review and send. Rent reminders · receipts · maintenance updates · sending a vendor the job and address · welcoming a new tenant with their link · renewal notices. |
| 4 | Send by email | Opens the email app with subject and body ready. The year's rent records to the accountant in March · a copy of the agreement to a tenant who needs it for their office · a monthly statement to a property owner. |
| 5 | Tap to call | Dials without copying the number, then offers to log the call. Calling a tenant from an overdue rent row · calling a vendor · and on the tenant's own page, so they can reach the landlord without saving his number. |
| 6 | Open in Maps | Turns an address into directions. The vendor being sent to a flat · a prospective tenant coming to view a vacant unit · the location shown on the property record. |
| 7 | Copy in one tap | Puts text on the clipboard. Any drafted message · a unit's link · the landlord's UPI ID · a receipt number. |
| 8 | Share | Opens the phone's own share menu. Sending a new tenant their unit link · passing a receipt to someone · sharing vacancy details with a broker. |
| 9 | Add to calendar | Creates a calendar entry in whatever calendar the landlord already uses. Agreement expiry · the notice period ending · a scheduled vendor visit · a rent due date. |
| 10 | Print or save as PDF | A clean printable page. Rent receipts · the monthly statement · the deposit settlement · a one-page summary of an agreement. |
| 11 | Unit QR code | A printable code that opens that unit's reporting page. A sticker inside the flat door · the welcome sheet handed over at move-in · a notice board in the building. |
| 12 | Export to a spreadsheet | Downloads the data as a file. The rent ledger for the accountant · maintenance spend per unit · the current tenant list · the deposit register. |

## System architecture

*(Scope §13, Diagram 6 — plain-terms description, not an implementation
mandate)*

- **Who uses it:** the landlord workspace (signed in, sees everything) and
  the tenant link (no sign-in, one unit only).
- **The product core:** three functional groups — *the records* (units,
  tenants, rent, requests, documents and photos), *the rules and dates*
  (monthly rent rows, due dates, expiry countdowns, escalation), and *the
  assistant* (drafts reminders, sorts requests, writes settlement
  statements).
- **How people act:** through the twelve connections above.
- **Apps they already have:** payment apps, WhatsApp & phone, email &
  calendar, printer & files. Nothing new to install, nothing to configure,
  no third-party account required for either user.

## Data flow

*(Scope §14, Diagram 7)*

| People | What the app does | Where it is kept |
|---|---|---|
| Landlord | 1 · Record units, tenants and condition photos | Units, properties and tenants |
| Tenant | 2 · Receive and sort a reported problem | Rent ledger — one row per unit per month · Maintenance requests and vendors · Photos, agreements and receipts |
| Vendor | 3 · Assign, resolve and record the cost | Reminder and call history |
| — | 4 · Remind, receipt and settle | Deposit ledger and deductions |

Reminders, receipts and status updates go back out to the landlord and the
tenant from these same stored records — nothing is drafted from a separate
copy of the data.

## Data model

*(Scope §15, Diagram 8 — entity relationships)*

```
Landlord 1───┬───many Property 1───many Unit 1───many Tenant
             │                        │  │
             │                        │  └──1───many Reminder
             │                        │
             │                        ├──1───many Rent entry
             │                        ├──1───many Request
             │                        └──1───many Document
```

| Entity | Key fields |
|---|---|
| Landlord | name, phone, email, UPI ID, business name for receipts |
| Property | name, address, number of units |
| Unit | unit number, type, rent, deposit amount, occupied or vacant, its own reporting link |
| Tenant | name, phone, agreement start/end, deposit paid, notice status |
| Reminder | level (gentle/direct/formal), sent on, how it was sent, call notes if phoned |
| Rent entry | month, amount due, amount paid, due date, paid on, receipt number |
| Request | category, description, urgency, status, vendor assigned, cost, before/after photos |
| Document | type (agreement, ID proof, photo, receipt, statement), what it belongs to |

Relationships are all 1-to-many, reading top to bottom: one landlord has
many properties; each property has many units; each unit has a tenant now
and a record of tenants before. Rent entries, requests and documents attach
to the **unit**, not the tenant — this is what makes years of history
possible even as tenants change. Reminders attach to the tenant.

The Unit's reporting link is a single, unit-level field, but the token
it holds **rotates** every time the unit's current-tenant relationship
changes (a new tenant moving in, or the current tenant moving out to
vacancy) — see `spec/index.md` open contradiction #7 for why this
decision reconciles the field's unit-level ownership with the
requirement that a former tenant's link stop working.

> OPEN: `L-07`'s vendor field ("remembers previously used vendors as
> suggestions," UIUX Part B) implies some persisted, recallable list of
> vendors, but there is no Vendor entity in this diagram — vendor name and
> phone appear to live only as free text on each Request record. It is not
> specified whether a distinct Vendor entity is intended (so vendors can be
> reused, edited, or reported on across units) or whether "remembers" means
> nothing more than autocomplete over the landlord's own past Request
> entries. See Open contradiction #4 in `spec/index.md`.

## Scope

*(Scope §16)*

### Included in version one

| Area | What is included |
|---|---|
| Landlord workspace | All eight modules, with sign-in |
| Tenant pages | Report a problem, track it, see unit details and receipts — no sign-in |
| Money tracking | Rent recorded per unit per month, receipts issued and numbered, deposit ledger |
| Dates | Rent due dates and agreement expiry, with warnings at 90, 60 and 30 days |
| Photos and documents | Condition photos, repair photos, agreements, ID proofs |
| Assistant | Reminder drafting, request sorting, settlement statements |
| Connections | All twelve, available from day one |

### Deliberately excluded

- **Automatic sending.** Every message is approved by the landlord. This is
  a principle, not a limitation to be removed later.
- **Listing vacant units publicly.** That is a different product with a
  different business model.
- **Tenant background or credit checks.** Not meaningfully available to
  individual landlords in India.
- **Accounting software integration.** A spreadsheet export serves the
  accountant and avoids a fragile dependency.
- **Society or apartment-complex management.** Different buyer, different
  problem.
- **A separate tenant mobile app.** The whole point is that the tenant
  installs nothing.

### Considered for later, once the product is in real use

| Possible addition | Why it is not in version one |
|---|---|
| Collecting rent through a payment gateway, with the rent row updating on its own | Requires the landlord to complete merchant registration, and money would then settle a day later instead of arriving instantly. Worth it for operators with many small payments; a step backwards for a landlord with fourteen flats. |
| Sending messages automatically over WhatsApp's business service | Requires business verification, a separately dedicated phone number, and approval of each message format. Adds a monthly cost that only makes sense across many landlords at once. |
| Automatic monthly rent reminders without review | Would break the approval principle. Revisit only if landlords in real use ask for it. |
| Separate access for a caretaker or assistant | Most landlords in this range work alone. Add it when a customer with staff asks. |

## How this makes life easier

*(Scope §17)*

| Today | With RentRoll — landlord | With RentRoll — tenant |
|---|---|---|
| Not sure who has paid this month | One screen, one glance, twelve green and two red | Gets a numbered receipt every time, without asking |
| Avoids sending the awkward reminder | The right words are already written for day three, ten and twenty | Receives a fair reminder early instead of an angry one late |
| Agreement lapses unnoticed | Warned at 90, 60 and 30 days, with the new rent already calculated | Knows well in advance what is changing and when |
| Repairs reported by phone at odd hours | Requests arrive in a list with photos, in order of urgency | Reports in two minutes with a photo and can check the status |
| Deposit argument at move-out | Move-in photos, every repair and every cost, held for years | Receives a written statement explaining each deduction |
| Accountant rebuilds the year from bank statements | One export, one file, done in March in a minute | Has receipts on hand for their own proof of rent |

> **The one sentence:** the landlord stops carrying the business in his
> head, and the tenant stops wondering whether anyone heard them. Both
> changes come from the same thing — a shared, written record.

## Success metrics

*(Scope §18)*

| What we will look at | Why it tells us the product is working |
|---|---|
| Rent rows marked paid within the month | The core promise. If collection does not improve, nothing else matters. |
| Days from due date to payment | Should fall once reminders go out on day three instead of day twenty-five. |
| Requests raised through the tenant link rather than by phone | Shows tenants have accepted the link, which is the biggest adoption risk. |
| Agreements renewed before expiry, not after | The clearest money-saving outcome, and easy to demonstrate to a prospect. |
| Units with move-in photos attached | If this is low, the settlement feature is decorative. Worth watching from week one. |
| Landlords still signing in after three months | The honest test of whether the product replaced the diary or joined it. |

## Suggested build order (informational)

*(UIUX Part F — "Build tracker."* This is the source document's suggested
implementation sequence, preserved here for planning context. It is
**not** an application-code requirement of this spec repository and
implementation agents are free to sequence work differently; nothing in a
later phase blocks anything in an earlier one.)

| Phase | Screens/refs | Ticket | Done when |
|---|---|---|---|
| 1 | A1, A2 | Design tokens and component library | Every component exists in isolation with all its states |
| 1 | A3, A4 | App shell, navigation, responsive rules | Sidebar, bottom bar and breakpoints behave as specified |
| 1 | L-01 | Sign in, sign up, password reset | All three flows, plus the five-attempt delay |
| 2 | L-08, L-09 | Unit register and unit detail | Units can be created, listed and opened; tokens generated |
| 2 | L-10, L-11 | Tenant list and detail | A tenant can be attached to a unit with agreement dates |
| 2 | L-02 | First-run setup | A new account reaches a populated dashboard without help |
| 3 | T-01, T-02 | Tenant report form and confirmation | A request submitted from a phone appears in the database |
| 3 | S-04 | Photo uploader with compression | A 6MB photo uploads in under 5 seconds on a normal connection |
| 3 | L-06, L-07 | Maintenance board and request detail | Full lifecycle from New to Done, with cost captured |
| 4 | L-04 | Rent due board | Rows generated monthly; filters, statuses and mark-paid all work |
| 4 | L-05 | Rent detail panel with reminder history | Timeline shows every reminder and logged call |
| 4 | P-01 | Rent receipt print view | Prints cleanly to A4 with the landlord's branding |
| 5 | S-01 | Message composer with the three tones | Draft arrives, is editable, and the send-confirmation step records correctly |
| 5 | S-02 | Payment sheet, link and QR | A phone opens the payment app with the right amount; desktop shows the QR |
| 5 | S-03 | Share and copy across all screens | Desktop fallback verified; no broken share icons |
| 6 | L-03 | Portfolio dashboard | All four cards route correctly; needs-attention sorted as specified |
| 6 | L-12 | Agreement tracker with calendar file | Countdowns correct; the calendar file opens in a real calendar app |
| 6 | T-03, T-04, T-05 | Tenant status, unit and receipt pages | Verified against every test in `cross-cutting.md` § Permission boundary tests |
| 7 | L-13, P-02 | Deposit settlement and its statement | Deductions pull from repair history with photos attached |
| 7 | L-14, L-15 | Exports, documents and settings | All four CSVs open correctly with the rupee symbol intact |
| 7 | P-03 | Door QR cards | Four to a page, scannable from print |
| 8 | E1–E3 (see `cross-cutting.md`) | Message, empty and loading state pass | Every state matches the specified wording |
| 8 | § Permission boundary tests (`cross-cutting.md`) | Permission boundary testing | All boundary tests pass |
| 8 | § Accessibility floor (`foundations.md`) | Accessibility pass | Keyboard-only run through every screen completes |

A note on order from the source document: the tenant report form is built
in phase 3, before the rent board. That is deliberate — it is the screen
most likely to be judged by a real user, it is the smallest, and having
real requests in the system makes every later screen easier to build
against.
