"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

/**
 * A2 toast — spec/foundations.md § A2. Bottom-centre, 4 seconds by
 * default, one optional Undo. Never used for errors that need a decision
 * (those need a confirm dialog instead). One toast at a time, matching
 * every toast example in `spec/cross-cutting.md`'s message catalog.
 */
interface ToastOptions {
  message: string;
  durationMs?: number;
  undo?: { label: string; onUndo: () => void };
}

interface ToastContextValue {
  showToast: (options: ToastOptions) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within a ToastProvider");
  return context;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastOptions | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const showToast = useCallback((options: ToastOptions) => {
    clearTimeout(timeoutRef.current);
    setToast(options);
    timeoutRef.current = setTimeout(() => setToast(null), options.durationMs ?? 4000);
  }, []);

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-md bg-ink px-4 py-3 shadow-modal"
        >
          <p className="type-body text-white">{toast.message}</p>
          {toast.undo && (
            <button
              type="button"
              onClick={() => {
                toast.undo?.onUndo();
                setToast(null);
              }}
              className="type-body font-medium text-white underline underline-offset-2"
            >
              {toast.undo.label}
            </button>
          )}
        </div>
      )}
    </ToastContext.Provider>
  );
}
