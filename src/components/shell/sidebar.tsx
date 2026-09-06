"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { isActiveHref } from "./is-active-href";
import { NavIcon } from "./icons";
import { SETTINGS_ITEM, SIDEBAR_ITEMS, type NavItem } from "./nav-items";

/**
 * Desktop sidebar — spec/foundations.md § A3 (contents/order), § A4
 * (breakpoints). Hidden below 640px (the bottom bar takes over), icon-only
 * from 640–1024px, full width with labels above 1024px.
 */
export function Sidebar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary"
      className="hidden shrink-0 flex-col border-r border-line bg-surface sm:flex sm:w-[72px] lg:w-[220px]"
    >
      <div className="flex h-16 shrink-0 items-center justify-center px-3 lg:justify-start lg:px-5">
        <span className="type-h2 text-ink lg:hidden" aria-hidden="true">
          RR
        </span>
        <span className="hidden type-h2 text-ink lg:inline">RentRoll</span>
      </div>

      <ul className="flex flex-1 flex-col gap-1 overflow-y-auto py-2">
        {SIDEBAR_ITEMS.map((item) => (
          <SidebarLink
            key={item.id}
            item={item}
            active={isActiveHref(pathname, item.href)}
          />
        ))}
      </ul>

      <ul className="shrink-0 border-t border-line py-2">
        <SidebarLink
          item={SETTINGS_ITEM}
          active={isActiveHref(pathname, SETTINGS_ITEM.href)}
        />
      </ul>
    </nav>
  );
}

function SidebarLink({ item, active }: { item: NavItem; active: boolean }) {
  return (
    <li className="relative">
      {active && (
        <span
          aria-hidden="true"
          className="absolute inset-y-1 left-0 w-[3px] rounded-r-full bg-primary"
        />
      )}
      <Link
        href={item.href}
        aria-current={active ? "page" : undefined}
        title={item.label}
        className={[
          "mx-2 flex items-center gap-3 rounded-sm px-3 py-2 type-body transition-colors",
          "justify-center lg:justify-start",
          active
            ? "bg-primary-soft text-primary"
            : "text-body hover:bg-canvas",
        ].join(" ")}
      >
        <NavIcon id={item.id} className="h-5 w-5 shrink-0" />
        <span className="hidden lg:inline">{item.label}</span>
      </Link>
    </li>
  );
}
