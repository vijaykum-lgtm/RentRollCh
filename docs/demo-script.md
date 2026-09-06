# RentRoll — five-slice demo script

Five self-contained slices, each landable in under two minutes, each
proving one thing a diary and a WhatsApp group cannot do. Run them in
order — they build from "the tenant is heard" to "the money is
provable" to "nothing ever slips" to "the messy exit becomes a
document" — but each also stands alone if you only have time for one.

Two things to say once, before slice 1, because every slice depends on
them: **the tenant never signs in** — one saved link, no password, no
app — and **nothing the assistant drafts leaves the building until you
press send.** Everything below is a demonstration of those two rules,
not an exception to them.

Screen IDs in brackets (e.g. `[T-01]`) point at the full spec under
`spec/screens/` if a question comes up mid-demo.

---

## Slice 1 — A tenant reports a leak on their phone, and I see it on mine

**Devices:** tenant phone, landlord laptop, side by side.

**Click sequence — tenant phone:**
1. Open the saved unit link (or scan the door sticker QR) — lands
   directly on the report form, no login screen, header reads "Flat
   2A, Kulkarni Apartments" `[T-01]`.
2. Tap the problem dropdown → **Plumbing**.
3. Tap the description box → type "Geyser is leaking from the bottom
   since yesterday."
4. Tap **Add a photo** → attach one photo of the leak `[T01-UPL-PHOTO]`.
5. Tap **Urgent** on the urgency control (it starts on Normal — the
   tenant is choosing this, not the app defaulting to it)
   `[T01-SEG-URGENCY]`.
6. Tap **Submit** → spinner → confirmation screen with a request
   number `[T-02]`.

**Click sequence — landlord laptop (already open on the dashboard):**
1. Point at the **Needs attention** list — the new report is already
   sitting at the top, above overdue rent and expiring agreements,
   because urgent maintenance always sorts first `[L03-LST-ATTENTION]`.
2. Click the row → opens the request detail panel `[L-07]`.
3. Point at the report text — the tenant's own words, verbatim, with
   the photo right below it `[L07-SEC-REPORT]`, `[L07-GAL-PHOTOS]`.

**The line:** "She typed nine words and dropped in a photo from her
sofa — I saw it appear on my screen before she'd even put the phone
down, and I know exactly what's wrong without calling her back."

---

## Slice 2 — The awkward reminder gets written for me, and I still have to press send

**Device:** landlord laptop.

**Click sequence:**
1. Open the rent due board, filter to **Overdue** `[L-04]`.
2. Point at a row showing "12 days late" in danger colour
   `[L04-CHP-STATUS]`.
3. Click **Remind** on that row `[L04-BTN-REMIND]` → opens the message
   composer, already on the **Direct** tone (day-10 escalation),
   context chip reads "Rent · 12 days overdue · Level 2 of 3" `[S-01]`.
4. Point at the drafted message in the text box — editable, not a
   preview. Change one word to show it's real text, not a locked
   template.
5. Click **Open in WhatsApp** → WhatsApp opens in a new tab with the
   message already typed in, nothing sent yet.
6. Back in RentRoll, the composer now asks **"Did you send it?"** —
   click **Yes**. Only now does it write to the timeline.

**The line:** "It wrote the message I always put off writing — in the
right tone for day twelve, not day three and not day twenty-five — and
it still didn't leave my hands until I said so."

---

## Slice 3 — He gets a numbered receipt before he thinks to ask for one

**Devices:** landlord laptop, then tenant phone.

**Click sequence — landlord laptop:**
1. On the rent due board, find a **Pending** row for this month
   `[L-04]`.
2. Click **Mark paid** → inline row form appears, amount pre-filled
   with rent due, date defaults to today `[L04-BTN-MARKPAID]`.
3. Click **Confirm** → the row flips to **Paid**, and a toast reads
   "Payment recorded. Receipt RR-0847 created." with a 10-second Undo.
4. Click the print icon on that row → the receipt opens in a new tab,
   fully formatted, ready to hand over or file `[L04-BTN-RECEIPT]`,
   `[P-01]`.

**Click sequence — tenant phone (later the same day):**
1. Open the same saved unit link → navigate to **My receipts**
   `[T-05]`.
2. Point at the new row: month, amount, receipt number
   `[T05-LST-RECEIPTS]` — this is the one tenant screen allowed to show
   a money figure, and only their own.
3. Tap the print icon on that row → opens the same receipt, on their
   own phone, no message from the landlord required to get it there.

**The line:** "He never had to ask 'can I get a receipt for that?' —
it was already numbered and sitting on his own link before he
remembered to check."

---

## Slice 4 — An agreement that would have lapsed unnoticed gets caught 90 days out

**Device:** landlord laptop.

**Click sequence:**
1. On the dashboard, click the **Agreements expiring** stat card
   `[L03-CRD-EXPIRING]` → routes straight to the agreement tracker,
   90-day filter already applied `[L-12]`.
2. Point at the top row: "Ends in 22 days" in danger colour, current
   rent, and a suggested new rent already calculated
   `[L12-CHP-COUNTDOWN]`.
3. Edit the escalation percentage inline → the suggested new rent
   recalculates in the same row, no page reload
   `[L12-FLD-ESCALATION]`.
4. Click **Send renewal notice** → opens the message composer with the
   current rent, the new rent and the effective date already filled in
   `[L12-BTN-NOTICE]`, `[S-01]`.
5. Send it the same way as slice 2 — open in WhatsApp, then confirm
   "Yes" — and, optionally, click the calendar icon to add the expiry
   date to the landlord's own calendar, with a reminder 30 days before
   `[L12-BTN-CALENDAR]`.

**The line:** "This is the agreement that used to lapse in November
and get discovered in March — here it's flagged with ninety days of
runway and the new rent already worked out, before anyone had to
remember it existed."

---

## Slice 5 — The messy exit becomes a document nobody argues with

**Device:** landlord laptop.

**Click sequence:**
1. Open the deposit and settlement screen for the tenancy that's
   ending `[L-13]`.
2. Point at the deposit block: amount held, date received, agreement
   reference — already on file, not retyped `[L13-SEC-DEPOSIT]`.
3. Click **Pull from repair history** → tick one past repair the
   tenant was liable for → it drops into the deductions table with its
   photo carried across automatically `[L13-BTN-FROMREQUESTS]`.
4. Add one more row by hand: description, reason, amount, a photo —
   point out that a reason is required, a photo is not, but the row
   visibly warns you when one's missing `[L13-TBL-DEDUCTIONS]`.
5. Point at the balance block — deposit held minus every deduction,
   large and unmissable, recalculating live `[L13-SEC-BALANCE]`.
6. Click **Prepare settlement statement**, then **Print** → the
   statement opens, every deduction listed with its reason and its
   photo `[L13-BTN-GENERATE]`, `[L13-BTN-PRINT]`, `[P-02]`.
7. Click **Mark settled** → confirm → the tenancy closes, the unit
   goes back to vacant, and the statement locks — it can never be
   quietly edited after this point, only superseded by a new one
   `[L13-BTN-CLOSE]`.

**The line:** "Every deduction already had a reason and a photo
attached — the statement wrote itself, and by the time he read it
there was nothing left to argue about."
