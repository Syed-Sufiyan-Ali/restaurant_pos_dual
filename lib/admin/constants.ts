import {
  LayoutDashboard,
  ShoppingBag,
  UtensilsCrossed,
  LayoutGrid,
  TicketPercent,
  CalendarCheck,
  Star,
  Users,
  BarChart3,
  Settings,
  type LucideIcon,
} from "lucide-react";

export type AdminRole = "SUPER_ADMIN" | "ADMIN" | "MANAGER";

export const ADMIN_ROLES: AdminRole[] = ["SUPER_ADMIN", "ADMIN", "MANAGER"];

// Matches the existing auth flow exactly: token lives in localStorage and is
// sent as `Authorization: Bearer <token>`. Confirm the key name matches what
// the customer-facing app already uses if it differs from "token".
export const AUTH_TOKEN_KEY = "pizza_token";

export const THEME_STORAGE_KEY = "admin-theme";
export const SIDEBAR_STORAGE_KEY = "admin-sidebar-collapsed";

// TODO: point this at the real login route if it lives somewhere else
// (e.g. "/admin/login" or a shared "/login" used by the customer site too).
export const LOGIN_ROUTE = "/login";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  roles: AdminRole[];
}

// Role visibility below is a reasonable default, not a confirmed permission
// matrix. Adjust per item to match how Users/Roles are actually enforced
// server-side (the server remains the source of truth either way).
export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard, roles: ["SUPER_ADMIN", "ADMIN", "MANAGER"] },
  { label: "Orders", href: "/admin/orders", icon: ShoppingBag, roles: ["SUPER_ADMIN", "ADMIN", "MANAGER"] },
  { label: "Menu", href: "/admin/menu", icon: UtensilsCrossed, roles: ["SUPER_ADMIN", "ADMIN"] },
  { label: "Categories", href: "/admin/categories", icon: LayoutGrid, roles: ["SUPER_ADMIN", "ADMIN"] },
  { label: "Coupons", href: "/admin/coupons", icon: TicketPercent, roles: ["SUPER_ADMIN", "ADMIN"] },
  { label: "Reservations", href: "/admin/reservations", icon: CalendarCheck, roles: ["SUPER_ADMIN", "ADMIN", "MANAGER"] },
  { label: "Reviews", href: "/admin/reviews", icon: Star, roles: ["SUPER_ADMIN", "ADMIN", "MANAGER"] },
  { label: "Customers", href: "/admin/customers", icon: Users, roles: ["SUPER_ADMIN", "ADMIN"] },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3, roles: ["SUPER_ADMIN", "ADMIN"] },
  { label: "Settings", href: "/admin/settings", icon: Settings, roles: ["SUPER_ADMIN"] },
];
