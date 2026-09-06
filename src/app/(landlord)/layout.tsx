import type { ReactNode } from "react";

import { BottomBar } from "@/components/shell/bottom-bar";
import { Sidebar } from "@/components/shell/sidebar";

/**
 * Shell for every signed-in landlord route — spec/foundations.md § A3/A4.
 * `<main>` is the sole scrolling region: the sidebar and bottom bar stay
 * fixed to the viewport, and any `PageHeader` a screen renders can stick
 * to this container's top edge while its table scrolls beneath it.
 */
export default function LandlordLayout({ children }: { children: ReactNode }) {
  return (
    <div data-scope="landlord" className="flex h-dvh bg-canvas">
      <Sidebar />
      <main className="min-h-0 min-w-0 flex-1 overflow-y-auto pb-16 sm:pb-0">
        {children}
      </main>
      <BottomBar />
    </div>
  );
}
