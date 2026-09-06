"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

import { isActiveHref } from "./is-active-href";
import { NavIcon } from "./icons";
import type { NavItem } from "./nav-items";

interface MoreSheetProps {
  open: boolean;
  onClose: () => void;
  items: NavItem[];
  pathname: string;
}

/**
 * Mobile "More" sheet — spec/foundations.md § A3. Holds every sidebar
 * section that doesn't fit in the five-item bottom bar, plus Settings.
 * Traps Escape-to-close and backdrop click per the A5 accessibility floor
 * (same close behaviour as the A2 detail panel / modal, applied to a
 * bottom sheet since A2 doesn't define one yet).
 *
 * // PROMOTE: generic bottom-sheet/action-sheet overlay — S-02 (payment
 * sheet) and S-03 (share/copy menu) look like the same pattern and may
 * want this promoted to src/components/ui instead of re-built per lane.
 */
export function MoreSheet({ open, onClose, items, pathname }: MoreSheetProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleKeyDown);
    closeButtonRef.current?.focus();

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 sm:hidden">
      <button
        type="button"
        aria-label="Close menu"
        onClick={onClose}
        className="absolute inset-0 bg-ink/40"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="More"
        className="absolute inset-x-0 bottom-0 rounded-t-md bg-surface p-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-modal"
      >
        <div className="flex items-center justify-between px-2 pb-2 pt-1">
          <span className="type-label text-muted">More</span>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="rounded-sm px-2 py-1 type-small text-body hover:bg-canvas"
          >
            Close
          </button>
        </div>
        <ul className="flex flex-col gap-1">
          {items.map((item) => {
            const active = isActiveHref(pathname, item.href);
            return (
              <li key={item.id}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  aria-current={active ? "page" : undefined}
                  className={[
                    "flex min-h-12 items-center gap-3 rounded-sm px-3 type-body",
                    active ? "bg-primary-soft text-primary" : "text-body",
                  ].join(" ")}
                >
                  <NavIcon id={item.id} className="h-5 w-5 shrink-0" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
