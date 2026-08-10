import type { Metadata } from "next";
import { Outfit, Inter, JetBrains_Mono } from "next/font/google";
import { AdminShell } from "@/components/admin/common/AdminShell";
import "./admin-theme.css";

// Fonts are scoped to /admin via CSS variables on this layout's wrapper —
// the customer-facing site's typography is untouched.
const displayFont = Outfit({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-admin-display",
});
const bodyFont = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-admin-body",
});
const monoFont = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-admin-mono",
});

export const metadata: Metadata = {
  title: "Pizza Town Admin",
  description: "Manage orders, menu, and operations for Pizza Town.",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${displayFont.variable} ${bodyFont.variable} ${monoFont.variable}`}>
      <AdminShell>{children}</AdminShell>
    </div>
  );
}
