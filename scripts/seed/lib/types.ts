/**
 * Provisional demo-dataset shapes, mirroring the field lists in
 * spec/product.md § Data model as closely as possible.
 *
 * These are NOT a database schema. No table, column, index, or
 * constraint decision is made here — RentRoll's real schema does not
 * exist yet. Every field beyond what spec/product.md explicitly names is
 * marked TODO(schema) below and exists only to make the demo narrative
 * readable; it should be dropped or formalised once real migrations
 * land. See scripts/seed/SPEC.md § Schema dependency for the full list.
 */

export type ISODate = string; // "YYYY-MM-DD"

export interface DemoLandlord {
  id: string;
  name: string;
  phone: string;
  email: string;
  upiId: string;
  businessName: string;
}

export interface DemoProperty {
  id: string;
  landlordId: string;
  name: string;
  address: string;
  numberOfUnits: number;
}

export interface DemoUnit {
  id: string;
  propertyId: string;
  unitNumber: string;
  /** e.g. "1BHK" / "2BHK" / "3BHK" — product.md names the field, not an enum. */
  type: string;
  rent: number;
  depositAmount: number;
  occupied: boolean;
  /**
   * TODO(schema): spec/index.md open contradiction #7 — the data model
   * gives the unit its own durable reporting link, but the permission
   * boundary tests require a former tenant's link to stop working once
   * their tenancy ends. This is unresolved in the source spec. The demo
   * seeds one stable placeholder token per unit and does not attempt to
   * resolve the contradiction.
   */
  reportingLinkToken: string;
}

/** TODO(schema): product.md names "notice status" as a Tenant field but gives no enum. */
export type NoticeStatus = "none" | "given";

export interface DemoTenant {
  id: string;
  unitId: string;
  name: string;
  phone: string;
  agreementStart: ISODate;
  agreementEnd: ISODate;
  depositPaid: number;
  noticeStatus: NoticeStatus;
  /** TODO(schema): not a named product.md field; demo narrative only. */
  noticeGivenOn?: ISODate;
  /** TODO(schema): not a named product.md field; demo narrative only. */
  moveOutDate?: ISODate;
  /** true = the unit's current tenant; false = tenant history. Not itself a spec'd field — derivable from agreement/move-out dates once the schema exists. */
  isCurrent: boolean;
}

/** Reminder.level is explicitly enumerated in product.md § Data model. */
export type ReminderLevel = "gentle" | "direct" | "formal";

export interface DemoReminder {
  id: string;
  /** Reminders attach to the tenant, not the unit (product.md § Data model). */
  tenantId: string;
  level: ReminderLevel;
  sentOn: ISODate;
  /**
   * TODO(schema): product.md names "how it was sent" without an enum.
   * whatsapp/email/call are the three connections product.md attests for
   * this purpose (Scope §12, items 3/4/5).
   */
  sentVia: "whatsapp" | "email" | "call";
  /** Only meaningful when sentVia === "call", per product.md's "call notes if phoned". */
  callNotes?: string;
}

export interface DemoRentEntry {
  id: string;
  /** Rent entries attach to the unit, not the tenant (product.md § Data model). */
  unitId: string;
  /** "YYYY-MM" */
  month: string;
  amountDue: number;
  amountPaid: number;
  dueDate: ISODate;
  paidOn?: ISODate;
  receiptNumber?: string;
}

/**
 * TODO(schema): product.md's own "Suggested build order" table attests
 * only the two lifecycle endpoints — "Full lifecycle from New to Done"
 * (§ L-06/L-07 row). "In progress" is a provisional middle state added
 * for demo realism, not a confirmed value from the spec.
 */
export type RequestStatus = "New" | "In progress" | "Done";

/** TODO(schema): product.md names "urgency" as a Request field but gives no enum here (cross-cutting.md's T01-SEG-URGENCY is UI spec, out of scope for this ticket). */
export type RequestUrgency = "Normal" | "Urgent";

export interface DemoRequest {
  id: string;
  /** Requests attach to the unit, not the tenant (product.md § Data model). */
  unitId: string;
  category: string;
  description: string;
  urgency: RequestUrgency;
  status: RequestStatus;
  vendorName?: string;
  vendorPhone?: string;
  cost?: number;
  reportedOn: ISODate;
  resolvedOn?: ISODate;
}

/** Document.type is explicitly enumerated in product.md § Data model. */
export type DocumentType = "agreement" | "id_proof" | "photo" | "receipt" | "statement";

export interface DemoDocument {
  id: string;
  /**
   * Documents attach to the unit, not the tenant, per product.md § Data
   * model's ERD and its accompanying prose ("Rent entries, requests and
   * documents attach to the unit, not the tenant"). This holds even for
   * document types that are conceptually tenant-specific (id_proof), so
   * an id_proof document here still only carries a unitId.
   */
  unitId: string;
  type: DocumentType;
  /** Free-text description. Not a named product.md field; demo narrative only. */
  label: string;
  /**
   * TODO(schema): no field for this in product.md's Document entity —
   * there is no attested link from Document back to a specific Request.
   * Kept here only so the demo can show which photos belong to which
   * maintenance request; drop or formalise once the schema exists.
   */
  relatedRequestId?: string;
  /** TODO(schema): not a named product.md field; demo narrative only. */
  takenOn?: ISODate;
}

export interface DemoDataset {
  runDate: ISODate;
  landlords: DemoLandlord[];
  properties: DemoProperty[];
  units: DemoUnit[];
  tenants: DemoTenant[];
  rentEntries: DemoRentEntry[];
  reminders: DemoReminder[];
  requests: DemoRequest[];
  documents: DemoDocument[];
}
