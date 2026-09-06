import { forwardRef } from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";

import { Tooltip } from "./tooltip";

/**
 * A2 button — spec/foundations.md § A2. Five variants (primary, secondary,
 * quiet, danger, icon), three heights (40 default, 32 compact for table
 * rows, 48 for tenant screens). Disabled buttons show a tooltip explaining
 * why — `disabledReason` is required whenever `disabled` is true so that
 * explanation can never be silently skipped.
 */
type ButtonVariant = "primary" | "secondary" | "quiet" | "danger" | "icon";
type ButtonHeight = "compact" | "default" | "tenant";

const HEIGHT_CLASSES: Record<ButtonHeight, string> = {
  compact: "h-8 px-3",
  default: "h-10 px-4",
  tenant: "h-12 px-5",
};

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: "border border-primary bg-primary text-white hover:bg-primary/90",
  secondary:
    "border border-primary bg-surface text-primary hover:bg-primary-soft",
  quiet: "border border-transparent bg-transparent text-body hover:bg-canvas",
  danger: "border border-danger bg-surface text-danger hover:bg-danger/10",
  icon: "border border-transparent bg-transparent text-body hover:bg-canvas",
};

interface BaseButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  height?: ButtonHeight;
  /** Shows an inline spinner and disables the button — never a full-page block. */
  loading?: boolean;
  fullWidth?: boolean;
  /** Accessible label — required for the icon variant, since it carries no visible text. */
  "aria-label"?: string;
}

interface DisabledWithReason {
  disabled: true;
  /** Shown in a tooltip on hover/focus — disabled buttons must always explain why. */
  disabledReason: string;
}
interface NotDisabled {
  disabled?: false;
  disabledReason?: never;
}

type ButtonProps = BaseButtonProps & (DisabledWithReason | NotDisabled);

const Spinner = () => (
  <span
    aria-hidden="true"
    className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
  />
);

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = "primary",
      height = "default",
      loading = false,
      fullWidth = false,
      disabled,
      disabledReason,
      className = "",
      children,
      ...props
    },
    ref,
  ) {
    const isIcon = variant === "icon";
    const buttonClassName = [
      "inline-flex items-center justify-center gap-2 rounded-sm type-body transition-colors disabled:cursor-not-allowed disabled:opacity-50",
      isIcon ? "h-8 w-8 p-0" : HEIGHT_CLASSES[height],
      fullWidth && !isIcon ? "w-full" : "",
      VARIANT_CLASSES[variant],
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const button = (describedById?: string): ReactNode => (
      <button
        ref={ref}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        aria-describedby={describedById}
        className={buttonClassName}
        {...props}
      >
        {loading ? <Spinner /> : children}
      </button>
    );

    if (disabled && disabledReason) {
      return (
        <Tooltip label={disabledReason}>
          {(describedById) => button(describedById)}
        </Tooltip>
      );
    }

    if (isIcon) {
      return (
        <Tooltip label={props["aria-label"] ?? ""}>
          {(describedById) => button(describedById)}
        </Tooltip>
      );
    }

    return button();
  },
);
