export interface NavItem {
  id: string;
  label: string;
  href: string;
}

/**
 * Canonical sidebar order — spec/foundations.md § A3: "Dashboard, Rent,
 * Maintenance, Units, Tenants, Agreements, Deposits, Documents." Settings
 * is deliberately excluded here; it is pinned to the bottom of the
 * sidebar separately (see `SETTINGS_ITEM`).
 */
export const SIDEBAR_ITEMS: NavItem[] = [
  { id: "dashboard", label: "Dashboard", href: "/" },
  { id: "rent", label: "Rent", href: "/rent" },
  { id: "maintenance", label: "Maintenance", href: "/maintenance" },
  { id: "units", label: "Units", href: "/units" },
  { id: "tenants", label: "Tenants", href: "/tenants" },
  { id: "agreements", label: "Agreements", href: "/agreements" },
  { id: "deposits", label: "Deposits", href: "/deposits" },
  { id: "documents", label: "Documents", href: "/documents" },
];

export const SETTINGS_ITEM: NavItem = {
  id: "settings",
  label: "Settings",
  href: "/settings",
};

/**
 * Bottom bar keeps five items only — spec/foundations.md § A3. The first
 * four are the sidebar's leading items; "More" (rendered separately by
 * the bottom bar itself) opens a sheet with everything else.
 */
export const BOTTOM_BAR_ITEMS: NavItem[] = SIDEBAR_ITEMS.slice(0, 4);

export const MORE_SHEET_ITEMS: NavItem[] = [
  ...SIDEBAR_ITEMS.slice(4),
  SETTINGS_ITEM,
];
