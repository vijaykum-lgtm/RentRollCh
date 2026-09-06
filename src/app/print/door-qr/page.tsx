import { doorQrFixture } from "./fixture";
import { DoorQrPrintView } from "./door-qr-print-view";

/**
 * P-03 door QR card. Renders from a fixture until the data layer can
 * resolve the selected unit(s) — see `fixture.ts`. `DoorQrPrintView`
 * itself already takes plain props (a `baseUrl`, phone, and unit list).
 */
export default function DoorQrPrintPage() {
  return <DoorQrPrintView {...doorQrFixture} />;
}
