"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

import { ConfirmDialog } from "./confirm-dialog";

/**
 * A2 detail panel — spec/foundations.md § A2 and § A5. Slides in from the
 * right, 480px wide on desktop, full screen on mobile. Closes on Escape,
 * on backdrop click, and on the close button — but warns first if
 * `isDirty`, via a confirm dialog naming the discard action, never a bare
 * "OK". Traps focus while open and returns it to whatever triggered the
 * panel once it closes.
 */
interface DetailPanelProps {
  open: boolean;
  title: string;
  onClose: () => void;
  isDirty?: boolean;
  children: ReactNode;
}

export function DetailPanel({
  open,
  title,
  onClose,
  isDirty = false,
  children,
}: DetailPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<Element | null>(null);
  const [confirmingClose, setConfirmingClose] = useState(false);

  // Read by the keydown listener below, which only re-subscribes on
  // open/confirmingClose changes — without these refs it would close over
  // a stale `isDirty`/`onClose` from whichever render last (re)subscribed
  // it, and warn based on dirtiness at open time rather than close time.
  const isDirtyRef = useRef(isDirty);
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    isDirtyRef.current = isDirty;
    onCloseRef.current = onClose;
  }, [isDirty, onClose]);

  useEffect(() => {
    if (open) {
      triggerRef.current = document.activeElement;
      panelRef.current?.focus();
    } else if (triggerRef.current instanceof HTMLElement) {
      triggerRef.current.focus();
    }
  }, [open]);

  const requestClose = () => {
    if (isDirtyRef.current) {
      setConfirmingClose(true);
    } else {
      onCloseRef.current();
    }
  };

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !confirmingClose) {
        requestClose();
        return;
      }
      if (event.key !== "Tab") return;

      const focusable = panelRef.current?.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable || focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, confirmingClose]);

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-20 bg-ink/40"
        onClick={requestClose}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className="fixed inset-y-0 right-0 z-30 flex w-full flex-col bg-surface shadow-modal focus:outline-none md:w-[480px]"
      >
        <div className="flex items-center justify-between border-b border-line px-4 py-3 md:px-6">
          <h2 className="type-h2 text-ink">{title}</h2>
          <button
            type="button"
            onClick={requestClose}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-sm text-body hover:bg-canvas"
          >
            ×
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 md:p-6">{children}</div>
      </div>
      <ConfirmDialog
        open={confirmingClose}
        title="Discard unsaved changes?"
        consequence="Your edits to this record have not been saved."
        actionLabel="Discard changes"
        onCancel={() => setConfirmingClose(false)}
        onConfirm={() => {
          setConfirmingClose(false);
          onClose();
        }}
      />
    </>
  );
}
