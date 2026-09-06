import { receiptFixture } from "./fixture";
import { ReceiptPrintView } from "./receipt-print-view";

/**
 * P-01 rent receipt. Renders from a fixture until the data layer can
 * resolve a real payment — see `fixture.ts`. Swapping that for a real
 * lookup (by payment id, presumably a route param) is out of this
 * lane's scope; `ReceiptPrintView` itself already takes plain props.
 */
export default function ReceiptPrintPage() {
  return <ReceiptPrintView {...receiptFixture} />;
}
