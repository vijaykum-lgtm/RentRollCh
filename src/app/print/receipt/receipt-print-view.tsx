import { amountInWordsIndian, buildUpiPaymentUri, formatDate, formatINR, formatMonthYear } from "@/lib/format";
import { AutoPrint } from "../_shared/auto-print";
import { QrImage } from "../_shared/qr-image";

export interface ReceiptPrintProps {
  landlord: {
    name: string;
    businessName?: string;
    logoUrl?: string;
    /** Printed only when present — spec/decisions.md's landlord entity
     * has no PAN field; this is additive for HRA claims above the
     * exemption threshold, per this ticket's brief. */
    pan?: string;
    /** Omit entirely (no QR at all) when the landlord hasn't saved one —
     * never render a broken image in its place. */
    upiId?: string;
  };
  tenant: {
    name: string;
  };
  unit: {
    unitNumber: string;
    propertyName: string;
  };
  receiptNumber: string;
  /** The rent month this payment applies to, e.g. "2026-02-01". */
  rentMonth: string;
  /** The amount this payment actually covers (D2 — a `payment` row, not
   * necessarily the full rent due if it was a part payment). */
  amount: number;
  dateReceived: string;
  paymentReference?: string;
}

export function ReceiptPrintView({
  landlord,
  tenant,
  unit,
  receiptNumber,
  rentMonth,
  amount,
  dateReceived,
  paymentReference,
}: ReceiptPrintProps) {
  const upiUri = landlord.upiId
    ? buildUpiPaymentUri({
        vpa: landlord.upiId,
        payeeName: landlord.businessName ?? landlord.name,
        amount,
        note: `Rent ${formatMonthYear(rentMonth)} - ${unit.unitNumber}`,
      })
    : null;

  return (
    <main className="mx-auto min-h-[297mm] w-[210mm] p-[16mm]">
      <AutoPrint />

      <header className="flex items-start justify-between gap-6 border-b border-line pb-4">
        <div className="flex items-center gap-4">
          {landlord.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- static print asset, not next/image
            <img
              src={landlord.logoUrl}
              alt={`${landlord.businessName ?? landlord.name} logo`}
              className="h-14 w-14 object-contain"
            />
          ) : null}
          <div>
            <div className="type-h1 text-ink">{landlord.businessName ?? landlord.name}</div>
            {landlord.businessName ? (
              <div className="type-small text-muted">{landlord.name}</div>
            ) : null}
            {landlord.pan ? (
              <div className="type-small text-muted">PAN: {landlord.pan}</div>
            ) : null}
          </div>
        </div>
        <div className="text-right">
          <div className="type-label text-muted">Rent receipt</div>
          <div className="type-h2 text-ink">{receiptNumber}</div>
        </div>
      </header>

      <section className="mt-6 grid grid-cols-2 gap-x-8 gap-y-3">
        <div>
          <div className="type-label text-muted">Received from</div>
          <div className="type-body text-ink">{tenant.name}</div>
        </div>
        <div>
          <div className="type-label text-muted">Unit</div>
          <div className="type-body text-ink">
            {unit.unitNumber} · {unit.propertyName}
          </div>
        </div>
        <div>
          <div className="type-label text-muted">For the month of</div>
          <div className="type-body text-ink">{formatMonthYear(rentMonth)}</div>
        </div>
        <div>
          <div className="type-label text-muted">Date received</div>
          <div className="type-body text-ink">{formatDate(dateReceived)}</div>
        </div>
        {paymentReference ? (
          <div>
            <div className="type-label text-muted">Payment reference</div>
            <div className="type-body text-ink">{paymentReference}</div>
          </div>
        ) : null}
      </section>

      <section className="mt-8 rounded-md border border-line bg-canvas p-4">
        <div className="type-label text-muted">Amount received</div>
        <div className="type-display text-ink">{formatINR(amount)}</div>
        <div className="type-small mt-1 text-body">
          {amountInWordsIndian(amount)}
        </div>
      </section>

      <section className="mt-8 flex items-end justify-between gap-8">
        <div className="flex-1 border-t border-line pt-2">
          <div className="type-small text-muted">Landlord signature</div>
        </div>
        {upiUri ? (
          <div className="flex flex-col items-center gap-1">
            <QrImage value={upiUri} size={96} alt="Scan to pay by UPI" />
            <div className="type-small text-muted">Pay by UPI</div>
          </div>
        ) : null}
      </section>
    </main>
  );
}
