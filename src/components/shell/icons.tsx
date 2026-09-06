import type { SVGProps } from "react";

type IconId =
  | "dashboard"
  | "rent"
  | "maintenance"
  | "units"
  | "tenants"
  | "agreements"
  | "deposits"
  | "documents"
  | "settings"
  | "more";

const PATHS: Record<IconId, string> = {
  dashboard:
    "M4 4h7v7H4V4Zm9 0h7v4h-7V4Zm0 7h7v9h-7v-9ZM4 14h7v6H4v-6Z",
  rent: "M6 3h9l3 3v15H6V3Zm3 6h6M9 12h6M9 15h4",
  maintenance:
    "M14.7 6.3a4 4 0 0 1-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 0 1 5.4-5.4l-2.3 2.3-2-2 2.3-2.3Z",
  units: "M4 21V7l8-4 8 4v14M9 21v-6h6v6M4 21h16",
  tenants:
    "M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm7 1a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM3 20c0-3 2.7-5 6-5s6 2 6 5m2-4c2.5 0 5 1.4 5 4",
  agreements:
    "M7 3h8l3 3v15H7V3Zm2 6h6M9 12h6M9 15h6M9 18h4",
  deposits:
    "M4 10c0-2.2 3.6-4 8-4s8 1.8 8 4-3.6 4-8 4-8-1.8-8-4Zm0 0v7c0 2.2 3.6 4 8 4s8-1.8 8-4v-7M4 14c0 2.2 3.6 4 8 4s8-1.8 8-4",
  documents:
    "M6 2h9l3 3v17H6V2Zm9 0v3h3M9 12h6M9 16h6",
  settings:
    "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm8-3-.6-2.3 1.4-2-2-2-2.1 1.3L14.4 6 14 4h-4l-.4 2-2.3.7L5.2 5.7l-2 2 1.3 2.1L4 12l-2.3.7v4L4 17l.7 2.3 2 2 2.1-1.3 2.3.7.4 2h4l.4-2 2.3-.7 2.1 1.3 2-2-1.3-2.1.7-2.3 2-.4v-4L20 12Z",
  more: "M5 12h.01M12 12h.01M19 12h.01",
};

/** Nav icons for the shell — spec/foundations.md § A3. 24×24, stroke-based. */
export function NavIcon({
  id,
  ...props
}: { id: string } & SVGProps<SVGSVGElement>) {
  const d = PATHS[id as IconId];
  if (!d) return null;

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d={d} />
    </svg>
  );
}
