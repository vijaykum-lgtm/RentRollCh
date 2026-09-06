import QRCode from "qrcode";

/**
 * Renders a QR code as a self-contained `<img>` (a data: URI) — no
 * client JS, no external request, so it survives straight into a
 * printed page. Callers await this or render it directly, since Next.js
 * server components may be async.
 */
export async function QrImage({
  value,
  size,
  alt,
  className,
}: {
  value: string;
  size: number;
  alt: string;
  className?: string;
}) {
  const dataUrl = await QRCode.toDataURL(value, {
    margin: 0,
    width: size,
    // QR pixels are generated server-side, outside the CSS cascade, so
    // the `ink` / `surface` A1 tokens (foundations.md § A1) have to be
    // duplicated here as hex rather than referenced as CSS variables.
    color: { dark: "#14202B", light: "#FFFFFF" },
  });

  return (
    // A print page needs a self-contained <img> from a data: URI, not next/image's runtime optimizer.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={dataUrl}
      alt={alt}
      width={size}
      height={size}
      className={className}
    />
  );
}
