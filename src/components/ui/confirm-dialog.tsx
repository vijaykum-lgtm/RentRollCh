"use client";

import { useEffect, useRef } from "react";

import { Button } from "./button";

/**
 * A2 confirm dialog — spec/foundations.md § A2. Title as a question, one
 * line of consequence, cancel plus a labelled action button. The action
 * button says what it does — "Delete unit," never "OK" — so `actionLabel`
 * is required and there is no default.
 */
interface ConfirmDialogProps {
  open: boolean;
  /** Phrased as a question, e.g. "Delete this unit?" */
  title: string;
  consequence: string;
  actionLabel: string;
  tone?: "default" | "danger";
  onCancel: () => void;
  onConfirm: () => void;
}

export function ConfirmDialog({
  open,
  title,
  consequence,
  actionLabel,
  tone = "default",
  onCancel,
  onConfirm,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<Element | null>(null);

  useEffect(() => {
    if (open) {
      triggerRef.current = document.activeElement;
      dialogRef.current?.focus();
    } else if (triggerRef.current instanceof HTMLElement) {
      triggerRef.current.focus();
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-ink/40" onClick={onCancel} aria-hidden="true" />
      <div
        ref={dialogRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-consequence"
        tabIndex={-1}
        className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-md bg-surface p-4 shadow-modal focus:outline-none md:p-6"
      >
        <h2 id="confirm-dialog-title" className="type-h2 text-ink">
          {title}
        </h2>
        <p id="confirm-dialog-consequence" className="mt-2 type-body text-body">
          {consequence}
        </p>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant={tone === "danger" ? "danger" : "primary"} onClick={onConfirm}>
            {actionLabel}
          </Button>
        </div>
      </div>
    </>
  );
}
