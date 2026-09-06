import { addDays, monthKey, toISODate } from "../lib/dates";
import type {
  DemoDocument,
  DemoReminder,
  DemoRentEntry,
  DemoRequest,
  DemoTenant,
} from "../lib/types";

/**
 * Builds every date-sensitive part of the demo dataset relative to
 * `runDate`. See SPEC.md § Scenario map for the unit-by-unit rationale
 * behind each block below.
 */
export function buildScenarioData(runDate: Date) {
  const tenants: DemoTenant[] = [];
  const rentEntries: DemoRentEntry[] = [];
  const reminders: DemoReminder[] = [];
  const requests: DemoRequest[] = [];
  const documents: DemoDocument[] = [];

  let receiptCounter = 0;
  function nextReceiptNumber(): string {
    receiptCounter += 1;
    return `RR-${String(receiptCounter).padStart(4, "0")}`;
  }

  /** ~11-month leave-and-license term, the Indian norm this demo assumes. */
  function agreementDates(endOffsetDays: number, termDays = 335) {
    const agreementEnd = addDays(runDate, endOffsetDays);
    const agreementStart = addDays(agreementEnd, -termDays);
    return { agreementStart: toISODate(agreementStart), agreementEnd: toISODate(agreementEnd) };
  }

  /**
   * Two prior rent cycles (always paid in full, ~30 days apart) plus the
   * current cycle, whose due date and payment state are supplied by the
   * caller so each scenario can land on an exact day-count.
   */
  function buildRentHistory(opts: {
    unitId: string;
    rent: number;
    currentDueDate: Date;
    currentAmountPaid?: number;
    /** Days after the due date the current cycle was paid in full; omit if not (yet) fully paid. */
    currentPaidAfterDays?: number;
  }): DemoRentEntry[] {
    const { unitId, rent, currentDueDate } = opts;
    const entries: DemoRentEntry[] = [];

    for (const monthsBack of [2, 1]) {
      const dueDate = addDays(currentDueDate, -30 * monthsBack);
      const paidOn = addDays(dueDate, 2);
      entries.push({
        id: `rent-${unitId}-${monthKey(dueDate)}`,
        unitId,
        month: monthKey(dueDate),
        amountDue: rent,
        amountPaid: rent,
        dueDate: toISODate(dueDate),
        paidOn: toISODate(paidOn),
        receiptNumber: nextReceiptNumber(),
      });
    }

    const amountPaid = opts.currentAmountPaid ?? rent;
    const paidOn =
      opts.currentPaidAfterDays !== undefined
        ? toISODate(addDays(currentDueDate, opts.currentPaidAfterDays))
        : undefined;
    const fullyPaid = paidOn !== undefined && amountPaid >= rent;

    entries.push({
      id: `rent-${unitId}-${monthKey(currentDueDate)}`,
      unitId,
      month: monthKey(currentDueDate),
      amountDue: rent,
      amountPaid,
      dueDate: toISODate(currentDueDate),
      paidOn,
      receiptNumber: fullyPaid ? nextReceiptNumber() : undefined,
    });

    return entries;
  }

  function addMoveInDocs(
    unitId: string,
    agreementStart: string,
    opts: { skipPhoto?: boolean } = {},
  ) {
    documents.push({
      id: `doc-${unitId}-agreement`,
      unitId,
      type: "agreement",
      label: "Signed leave-and-license agreement",
      takenOn: agreementStart,
    });
    documents.push({
      id: `doc-${unitId}-id-proof`,
      unitId,
      type: "id_proof",
      label: "Tenant ID proof (Aadhaar)",
      takenOn: agreementStart,
    });
    if (!opts.skipPhoto) {
      documents.push({
        id: `doc-${unitId}-move-in-photo`,
        unitId,
        type: "photo",
        label: "Move-in condition photos",
        takenOn: agreementStart,
      });
    }
  }

  // ---------------------------------------------------------------------
  // unit-kr-g01 — Meera Joshi — plain normal: paid on time, nothing else
  // going on.
  // ---------------------------------------------------------------------
  {
    const unitId = "unit-kr-g01";
    const tenantId = "tenant-meera-joshi";
    const { agreementStart, agreementEnd } = agreementDates(240);
    tenants.push({
      id: tenantId,
      unitId,
      name: "Meera Joshi",
      phone: "+91 98765 43210",
      agreementStart,
      agreementEnd,
      depositPaid: 42000,
      noticeStatus: "none",
      isCurrent: true,
    });
    rentEntries.push(
      ...buildRentHistory({ unitId, rent: 14000, currentDueDate: addDays(runDate, -20), currentPaidAfterDays: 2 }),
    );
    addMoveInDocs(unitId, agreementStart);
  }

  // ---------------------------------------------------------------------
  // unit-kr-g02 — Sanjay Pawar — plain normal.
  // ---------------------------------------------------------------------
  {
    const unitId = "unit-kr-g02";
    const tenantId = "tenant-sanjay-pawar";
    const { agreementStart, agreementEnd } = agreementDates(200);
    tenants.push({
      id: tenantId,
      unitId,
      name: "Sanjay Pawar",
      phone: "+91 98221 09876",
      agreementStart,
      agreementEnd,
      depositPaid: 43500,
      noticeStatus: "none",
      isCurrent: true,
    });
    rentEntries.push(
      ...buildRentHistory({ unitId, rent: 14500, currentDueDate: addDays(runDate, -20), currentPaidAfterDays: 1 }),
    );
    addMoveInDocs(unitId, agreementStart);
  }

  // ---------------------------------------------------------------------
  // unit-kr-101 — Rahul Kulkarni — rent ~18 days overdue. Gentle (day 3)
  // and direct (day 10) reminders already sent; formal (day 20) not yet
  // due.
  // ---------------------------------------------------------------------
  {
    const unitId = "unit-kr-101";
    const tenantId = "tenant-rahul-kulkarni";
    const { agreementStart, agreementEnd } = agreementDates(170);
    tenants.push({
      id: tenantId,
      unitId,
      name: "Rahul Kulkarni",
      phone: "+91 90210 55667",
      agreementStart,
      agreementEnd,
      depositPaid: 57000,
      noticeStatus: "none",
      isCurrent: true,
    });
    const dueDate = addDays(runDate, -18);
    rentEntries.push(
      ...buildRentHistory({ unitId, rent: 19000, currentDueDate: dueDate, currentAmountPaid: 0 }),
    );
    reminders.push(
      { id: `reminder-${tenantId}-gentle`, tenantId, level: "gentle", sentOn: toISODate(addDays(dueDate, 3)), sentVia: "whatsapp" },
      { id: `reminder-${tenantId}-direct`, tenantId, level: "direct", sentOn: toISODate(addDays(dueDate, 10)), sentVia: "whatsapp" },
    );
    addMoveInDocs(unitId, agreementStart);
  }

  // ---------------------------------------------------------------------
  // unit-kr-102 — Neha Bhosale — rent ~5 days overdue (gentle sent only)
  // plus a freshly reported maintenance request.
  // ---------------------------------------------------------------------
  {
    const unitId = "unit-kr-102";
    const tenantId = "tenant-neha-bhosale";
    const { agreementStart, agreementEnd } = agreementDates(130);
    tenants.push({
      id: tenantId,
      unitId,
      name: "Neha Bhosale",
      phone: "+91 91582 33445",
      agreementStart,
      agreementEnd,
      depositPaid: 58500,
      noticeStatus: "none",
      isCurrent: true,
    });
    const dueDate = addDays(runDate, -5);
    rentEntries.push(
      ...buildRentHistory({ unitId, rent: 19500, currentDueDate: dueDate, currentAmountPaid: 0 }),
    );
    reminders.push({
      id: `reminder-${tenantId}-gentle`,
      tenantId,
      level: "gentle",
      sentOn: toISODate(addDays(dueDate, 3)),
      sentVia: "whatsapp",
    });
    requests.push({
      id: "request-kr102-lock",
      unitId,
      category: "Other",
      description: "Front door lock is stiff and hard to turn with the key.",
      urgency: "Normal",
      status: "New",
      reportedOn: toISODate(addDays(runDate, -4)),
    });
    addMoveInDocs(unitId, agreementStart);
  }

  // ---------------------------------------------------------------------
  // unit-kr-103 — Vikram Shinde — part-paid rent with an outstanding
  // balance. Gentle and direct reminders both sent; a partial payment
  // arrived between the two but did not clear the balance.
  // ---------------------------------------------------------------------
  {
    const unitId = "unit-kr-103";
    const tenantId = "tenant-vikram-shinde";
    const { agreementStart, agreementEnd } = agreementDates(110);
    tenants.push({
      id: tenantId,
      unitId,
      name: "Vikram Shinde",
      phone: "+91 99225 11223",
      agreementStart,
      agreementEnd,
      depositPaid: 60000,
      noticeStatus: "none",
      isCurrent: true,
    });
    const dueDate = addDays(runDate, -12);
    rentEntries.push(
      ...buildRentHistory({ unitId, rent: 20000, currentDueDate: dueDate, currentAmountPaid: 12000 }),
    );
    reminders.push(
      { id: `reminder-${tenantId}-gentle`, tenantId, level: "gentle", sentOn: toISODate(addDays(dueDate, 3)), sentVia: "whatsapp" },
      { id: `reminder-${tenantId}-direct`, tenantId, level: "direct", sentOn: toISODate(addDays(dueDate, 10)), sentVia: "whatsapp" },
    );
    addMoveInDocs(unitId, agreementStart);
  }

  // ---------------------------------------------------------------------
  // unit-kr-201 — Ashwini Gokhale — normal, paid rent, but the move-in
  // condition photo was never taken. The documentation-gap scenario.
  // ---------------------------------------------------------------------
  {
    const unitId = "unit-kr-201";
    const tenantId = "tenant-ashwini-gokhale";
    const { agreementStart, agreementEnd } = agreementDates(150);
    tenants.push({
      id: tenantId,
      unitId,
      name: "Ashwini Gokhale",
      phone: "+91 98903 44556",
      agreementStart,
      agreementEnd,
      depositPaid: 61500,
      noticeStatus: "none",
      isCurrent: true,
    });
    rentEntries.push(
      ...buildRentHistory({ unitId, rent: 20500, currentDueDate: addDays(runDate, -20), currentPaidAfterDays: 3 }),
    );
    addMoveInDocs(unitId, agreementStart, { skipPhoto: true });
  }

  // ---------------------------------------------------------------------
  // unit-kr-202 — Prashant Kale — agreement expiring in 30 days.
  // ---------------------------------------------------------------------
  {
    const unitId = "unit-kr-202";
    const tenantId = "tenant-prashant-kale";
    const { agreementStart, agreementEnd } = agreementDates(30);
    tenants.push({
      id: tenantId,
      unitId,
      name: "Prashant Kale",
      phone: "+91 96073 22118",
      agreementStart,
      agreementEnd,
      depositPaid: 78000,
      noticeStatus: "none",
      isCurrent: true,
    });
    rentEntries.push(
      ...buildRentHistory({ unitId, rent: 26000, currentDueDate: addDays(runDate, -20), currentPaidAfterDays: 2 }),
    );
    addMoveInDocs(unitId, agreementStart);
  }

  // ---------------------------------------------------------------------
  // unit-kr-203 — Deepa Nair — agreement expiring in 60 days.
  // ---------------------------------------------------------------------
  {
    const unitId = "unit-kr-203";
    const tenantId = "tenant-deepa-nair";
    const { agreementStart, agreementEnd } = agreementDates(60);
    tenants.push({
      id: tenantId,
      unitId,
      name: "Deepa Nair",
      phone: "+91 90962 88774",
      agreementStart,
      agreementEnd,
      depositPaid: 81000,
      noticeStatus: "none",
      isCurrent: true,
    });
    rentEntries.push(
      ...buildRentHistory({ unitId, rent: 27000, currentDueDate: addDays(runDate, -20), currentPaidAfterDays: 2 }),
    );
    addMoveInDocs(unitId, agreementStart);
  }

  // ---------------------------------------------------------------------
  // unit-bg-101 — Omkar Jadhav — agreement expiring in 90 days.
  // ---------------------------------------------------------------------
  {
    const unitId = "unit-bg-101";
    const tenantId = "tenant-omkar-jadhav";
    const { agreementStart, agreementEnd } = agreementDates(90);
    tenants.push({
      id: tenantId,
      unitId,
      name: "Omkar Jadhav",
      phone: "+91 87960 33221",
      agreementStart,
      agreementEnd,
      depositPaid: 45000,
      noticeStatus: "none",
      isCurrent: true,
    });
    rentEntries.push(
      ...buildRentHistory({ unitId, rent: 15000, currentDueDate: addDays(runDate, -20), currentPaidAfterDays: 4 }),
    );
    addMoveInDocs(unitId, agreementStart);
  }

  // ---------------------------------------------------------------------
  // unit-bg-102 — Snehal Patil — has given notice, moving out in ~20
  // days, ahead of her agreement's natural end. Still occupied, rent
  // current.
  // ---------------------------------------------------------------------
  {
    const unitId = "unit-bg-102";
    const tenantId = "tenant-snehal-patil";
    const { agreementStart, agreementEnd } = agreementDates(150);
    tenants.push({
      id: tenantId,
      unitId,
      name: "Snehal Patil",
      phone: "+91 89830 77665",
      agreementStart,
      agreementEnd,
      depositPaid: 46500,
      noticeStatus: "given",
      noticeGivenOn: toISODate(addDays(runDate, -10)),
      moveOutDate: toISODate(addDays(runDate, 20)),
      isCurrent: true,
    });
    rentEntries.push(
      ...buildRentHistory({ unitId, rent: 15500, currentDueDate: addDays(runDate, -20), currentPaidAfterDays: 2 }),
    );
    addMoveInDocs(unitId, agreementStart);
  }

  // ---------------------------------------------------------------------
  // unit-bg-201 — Abhijit More — rent ~22 days overdue: the full
  // escalation ladder (gentle, direct, formal) plus a logged call, per
  // product.md's rent lifecycle. Still unresolved as of runDate.
  //
  // TODO(schema): product.md's Reminder entity gives a single "level"
  // per row alongside "how it was sent" and optional call notes. It does
  // not say whether a follow-up phone call after a formal notice is its
  // own reminder row (reusing the "formal" level, as modelled here) or a
  // different concept entirely — the Scope diagram shows the call as a
  // distinct box after the day-20 notice. Treat this as provisional.
  // ---------------------------------------------------------------------
  {
    const unitId = "unit-bg-201";
    const tenantId = "tenant-abhijit-more";
    const { agreementStart, agreementEnd } = agreementDates(180);
    tenants.push({
      id: tenantId,
      unitId,
      name: "Abhijit More",
      phone: "+91 93731 44556",
      agreementStart,
      agreementEnd,
      depositPaid: 63000,
      noticeStatus: "none",
      isCurrent: true,
    });
    const dueDate = addDays(runDate, -22);
    rentEntries.push(
      ...buildRentHistory({ unitId, rent: 21000, currentDueDate: dueDate, currentAmountPaid: 0 }),
    );
    reminders.push(
      { id: `reminder-${tenantId}-gentle`, tenantId, level: "gentle", sentOn: toISODate(addDays(dueDate, 3)), sentVia: "whatsapp" },
      { id: `reminder-${tenantId}-direct`, tenantId, level: "direct", sentOn: toISODate(addDays(dueDate, 10)), sentVia: "whatsapp" },
      { id: `reminder-${tenantId}-formal`, tenantId, level: "formal", sentOn: toISODate(addDays(dueDate, 20)), sentVia: "whatsapp" },
      {
        id: `reminder-${tenantId}-call`,
        tenantId,
        level: "formal",
        sentOn: toISODate(addDays(dueDate, 21)),
        sentVia: "call",
        callNotes: "Tenant said the payment was delayed due to a salary credit issue; promised to pay by end of week.",
      },
    );
    addMoveInDocs(unitId, agreementStart);
  }

  // ---------------------------------------------------------------------
  // unit-bg-202 — Kavita Deshmukh — normal, paid rent; one maintenance
  // request "In progress".
  // ---------------------------------------------------------------------
  {
    const unitId = "unit-bg-202";
    const tenantId = "tenant-kavita-deshmukh";
    const { agreementStart, agreementEnd } = agreementDates(190);
    tenants.push({
      id: tenantId,
      unitId,
      name: "Kavita Deshmukh",
      phone: "+91 94221 66778",
      agreementStart,
      agreementEnd,
      depositPaid: 64500,
      noticeStatus: "none",
      isCurrent: true,
    });
    rentEntries.push(
      ...buildRentHistory({ unitId, rent: 21500, currentDueDate: addDays(runDate, -20), currentPaidAfterDays: 3 }),
    );
    const reportedOn = toISODate(addDays(runDate, -6));
    requests.push({
      id: "request-bg202-electrical",
      unitId,
      category: "Electrical",
      description: "Ceiling fan in the bedroom is wobbling and making noise.",
      urgency: "Normal",
      status: "In progress",
      vendorName: "Suresh Electricals",
      vendorPhone: "+91 98220 11111",
      reportedOn,
    });
    documents.push({
      id: "doc-request-bg202-electrical-before",
      unitId,
      type: "photo",
      label: "Ceiling fan — reported issue",
      relatedRequestId: "request-bg202-electrical",
      takenOn: reportedOn,
    });
    addMoveInDocs(unitId, agreementStart);
  }

  // ---------------------------------------------------------------------
  // unit-bg-301 — Ganesh Bhagat — normal, paid rent; one resolved
  // maintenance request ("Done", with cost and before/after photos) and
  // one freshly reported ("New").
  // ---------------------------------------------------------------------
  {
    const unitId = "unit-bg-301";
    const tenantId = "tenant-ganesh-bhagat";
    const { agreementStart, agreementEnd } = agreementDates(160);
    tenants.push({
      id: tenantId,
      unitId,
      name: "Ganesh Bhagat",
      phone: "+91 90492 55990",
      agreementStart,
      agreementEnd,
      depositPaid: 87000,
      noticeStatus: "none",
      isCurrent: true,
    });
    rentEntries.push(
      ...buildRentHistory({ unitId, rent: 29000, currentDueDate: addDays(runDate, -20), currentPaidAfterDays: 2 }),
    );

    const plumbingReportedOn = toISODate(addDays(runDate, -25));
    const plumbingResolvedOn = toISODate(addDays(runDate, -20));
    requests.push({
      id: "request-bg301-plumbing",
      unitId,
      category: "Plumbing",
      description: "Kitchen tap leaking continuously, water pooling on the counter.",
      urgency: "Urgent",
      status: "Done",
      vendorName: "Om Plumbing Services",
      vendorPhone: "+91 90211 22334",
      cost: 850,
      reportedOn: plumbingReportedOn,
      resolvedOn: plumbingResolvedOn,
    });
    documents.push(
      {
        id: "doc-request-bg301-plumbing-before",
        unitId,
        type: "photo",
        label: "Before — leaking kitchen tap",
        relatedRequestId: "request-bg301-plumbing",
        takenOn: plumbingReportedOn,
      },
      {
        id: "doc-request-bg301-plumbing-after",
        unitId,
        type: "photo",
        label: "After — tap replaced",
        relatedRequestId: "request-bg301-plumbing",
        takenOn: plumbingResolvedOn,
      },
    );

    requests.push({
      id: "request-bg301-appliance",
      unitId,
      category: "Appliance",
      description: "Geyser makes a loud rattling noise on startup.",
      urgency: "Normal",
      status: "New",
      reportedOn: toISODate(addDays(runDate, -1)),
    });

    addMoveInDocs(unitId, agreementStart);
  }

  // ---------------------------------------------------------------------
  // unit-bg-302 — Rutuja Kadam — PAST tenant. Gave notice, moved out,
  // and was settled; the unit is now vacant. Demonstrates a complete
  // notice -> move-out -> settlement lifecycle, and (unlike unit-kr-201)
  // has a full document trail including move-in photos.
  //
  // TODO(schema): product.md's ERD has no "deposit deduction" or
  // "settlement" entity — only prose describing the deposit ledger and
  // per-deduction reasons/photos. Deduction reasons and amounts are
  // therefore only readable here as free text in Document.label, not as
  // structured fields. This is a real gap for whoever designs the
  // schema, not an oversight in this seed.
  // ---------------------------------------------------------------------
  {
    const unitId = "unit-bg-302";
    const tenantId = "tenant-rutuja-kadam";
    const agreementStart = toISODate(addDays(runDate, -410));
    const agreementEnd = toISODate(addDays(runDate, 40)); // planned end; she left early via notice
    const noticeGivenOn = toISODate(addDays(runDate, -45));
    const moveOutDate = toISODate(addDays(runDate, -15));
    const settlementOn = toISODate(addDays(runDate, -10));

    tenants.push({
      id: tenantId,
      unitId,
      name: "Rutuja Kadam",
      phone: "+91 98501 22887",
      agreementStart,
      agreementEnd,
      depositPaid: 90000,
      noticeStatus: "given",
      noticeGivenOn,
      moveOutDate,
      isCurrent: false,
    });

    // Rent history while occupied: three cycles ending the month before
    // move-out, all paid in full.
    rentEntries.push(
      ...buildRentHistory({
        unitId,
        rent: 30000,
        currentDueDate: addDays(new Date(moveOutDate), -35),
        currentPaidAfterDays: 2,
      }),
    );

    addMoveInDocs(unitId, agreementStart);
    documents.push(
      {
        id: `doc-${unitId}-move-out-photo-1`,
        unitId,
        type: "photo",
        label: "Move-out condition — living room (wall damage, ₹4,000 deduction)",
        takenOn: moveOutDate,
      },
      {
        id: `doc-${unitId}-move-out-photo-2`,
        unitId,
        type: "photo",
        label: "Move-out condition — bathroom (broken mirror, ₹1,200 deduction)",
        takenOn: moveOutDate,
      },
      {
        id: `doc-${unitId}-settlement-statement`,
        unitId,
        type: "statement",
        label: "Deposit settlement statement — ₹90,000 held, ₹5,200 deducted, ₹84,800 refunded",
        takenOn: settlementOn,
      },
    );
  }

  return { tenants, rentEntries, reminders, requests, documents };
}
