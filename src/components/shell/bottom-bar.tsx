"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { isActiveHref } from "./is-active-href";
import { NavIcon } from "./icons";
import { BOTTOM_BAR_ITEMS, MORE_SHEET_ITEMS, type NavItem } from "./nav-items";
import { MoreSheet } from "./more-sheet";

/**
 * Mobile bottom bar — spec/foundations.md § A3: five items only, visible
 * below the 640px breakpoint (§ A4). "More" opens a sheet with the rest.
 */
export function BottomBar() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);
  const moreActive = MORE_SHEET_ITEMS.some((item) =>
    isActiveHref(pathname, item.href),
  );

  return (
    <>
      <nav
        aria-label="Primary"
        className="fixed inset-x-0 bottom-0 z-30 flex h-16 border-t border-line bg-surface pb-[env(safe-area-inset-bottom)] sm:hidden"
      >
        {BOTTOM_BAR_ITEMS.map((item) => (
          <BottomBarLink
            key={item.id}
            item={item}
            active={isActiveHref(pathname, item.href)}
          />
        ))}
        <button
          type="button"
          onClick={() => setMoreOpen(true)}
          aria-haspopup="dialog"
          aria-expanded={moreOpen}
          className={[
            "flex flex-1 flex-col items-center justify-center gap-1 type-label",
            moreActive ? "text-primary" : "text-muted",
          ].join(" ")}
        >
          <NavIcon id="more" className="h-5 w-5" />
          More
        </button>
      </nav>

      <MoreSheet
        open={moreOpen}
        onClose={() => setMoreOpen(false)}
        items={MORE_SHEET_ITEMS}
        pathname={pathname}
      />
    </>
  );
}

function BottomBarLink({ item, active }: { item: NavItem; active: boolean }) {
  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={[
        "flex flex-1 flex-col items-center justify-center gap-1 type-label",
        active ? "text-primary" : "text-muted",
      ].join(" ")}
    >
      <NavIcon id={item.id} className="h-5 w-5" />
      {item.label}
    </Link>
  );
}
