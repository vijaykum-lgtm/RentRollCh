import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";

/**
 * A2 button variants — spec/foundations.md § A2. Heights: 40px default
 * (this component), 32px compact for table rows and 48px for tenant
 * screens are applied by the caller via `className`, not built in here.
 */
type ButtonVariant = "primary" | "secondary" | "quiet" | "danger";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  /** Shows an inline spinner and disables the button — never a full-page block. */
  loading?: boolean;
  fullWidth?: boolean;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: "border border-primary bg-primary text-white hover:bg-primary/90",
  secondary:
    "border border-primary bg-surface text-primary hover:bg-primary-soft",
  quiet: "border border-transparent bg-transparent text-body hover:bg-canvas",
  danger: "border border-danger bg-surface text-danger hover:bg-danger/10",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = "primary",
      loading = false,
      fullWidth = false,
      disabled,
      className = "",
      children,
      ...props
    },
    ref,
  ) {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        className={[
          "inline-flex h-10 items-center justify-center gap-2 rounded-sm px-4 type-body transition-colors disabled:cursor-not-allowed disabled:opacity-50",
          fullWidth ? "w-full" : "",
          VARIANT_CLASSES[variant],
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      >
        {loading && (
          <span
            aria-hidden="true"
            className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
          />
        )}
        {children}
      </button>
    );
  },
);
