/**
 * A2 status chip — spec/foundations.md § A2. Rounded pill, coloured
 * background at 12% opacity, text in the full colour. Always includes a
 * word — status is never carried by colour alone (§ A5).
 */
export type StatusChipTone =
  | "success"
  | "warning"
  | "danger"
  | "neutral"
  | "primary";

const TONE_CLASSES: Record<StatusChipTone, string> = {
  success: "bg-success/12 text-success",
  warning: "bg-warning/12 text-warning",
  danger: "bg-danger/12 text-danger",
  neutral: "bg-neutral/12 text-neutral",
  primary: "bg-primary-soft text-primary",
};

interface StatusChipProps {
  tone: StatusChipTone;
  label: string;
}

export function StatusChip({ tone, label }: StatusChipProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 type-small font-medium ${TONE_CLASSES[tone]}`}
    >
      {label}
    </span>
  );
}
