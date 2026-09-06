import { AutoPrint } from "../_shared/auto-print";
import { QrImage } from "../_shared/qr-image";

export interface DoorQrUnit {
  unitNumber: string;
  propertyName: string;
  /** D1 — the unit's durable `door_token`, never the per-stay
   * `tenant_token`: this is a physical, printed sticker meant to
   * outlive any one tenancy. */
  doorToken: string;
}

export interface DoorQrPrintProps {
  /** Origin the QR should resolve against, e.g. "https://app.rentroll.in". */
  baseUrl: string;
  landlordPhone: string;
  /** One card per unit. Cards lay out four to an A4 page (a 2x2 grid),
   * wrapping onto further pages past four. */
  units: DoorQrUnit[];
}

export function DoorQrPrintView({ baseUrl, landlordPhone, units }: DoorQrPrintProps) {
  const pages: DoorQrUnit[][] = [];
  for (let i = 0; i < units.length; i += 4) {
    pages.push(units.slice(i, i + 4));
  }
  if (pages.length === 0) pages.push([]);

  return (
    <main>
      <AutoPrint />
      {pages.map((page, pageIndex) => (
        <div
          key={pageIndex}
          className={[
            "grid h-[297mm] w-[210mm] grid-cols-2 grid-rows-2",
            pageIndex < pages.length - 1 ? "break-after-page" : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {page.map((unit) => (
            <DoorQrCard
              key={unit.doorToken}
              unit={unit}
              baseUrl={baseUrl}
              landlordPhone={landlordPhone}
            />
          ))}
        </div>
      ))}
    </main>
  );
}

function DoorQrCard({
  unit,
  baseUrl,
  landlordPhone,
}: {
  unit: DoorQrUnit;
  baseUrl: string;
  landlordPhone: string;
}) {
  const reportUrl = `${baseUrl.replace(/\/$/, "")}/u/${unit.doorToken}`;

  return (
    <div className="flex flex-col items-center justify-center gap-3 border border-line p-6 text-center">
      <div>
        <div className="type-h1 text-ink">{unit.unitNumber}</div>
        <div className="type-small text-muted">{unit.propertyName}</div>
      </div>
      <QrImage value={reportUrl} size={140} alt={`QR code to report a problem for ${unit.unitNumber}`} />
      <div className="type-body text-ink">Scan to report a problem</div>
      <div className="type-small text-muted">Or call {landlordPhone}</div>
    </div>
  );
}
