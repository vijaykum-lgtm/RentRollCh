"use client";

import { useEffect } from "react";

/**
 * cross-cutting.md § Print-view contract: "the print dialog is triggered
 * on load — the user does not have to find a print button." This is the
 * only client-side piece of any print view; everything else renders as
 * plain server-rendered markup.
 */
export function AutoPrint() {
  useEffect(() => {
    window.print();
  }, []);

  return null;
}
