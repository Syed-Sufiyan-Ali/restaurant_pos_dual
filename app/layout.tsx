import { CartProvider } from "@/lib/cart/cart-context";
import { AuthProvider } from "@/lib/auth/auth-context";
import type { Metadata } from "next";

import "./globals.css";

import LayoutContent from "@/components/layout/LayoutContext";

export const metadata: Metadata = {
  title: "Pizza Town Sukkur — Best Pizza & Burgers",
  description:
    "Order online from Pizza Town Sukkur. 16 pizza flavours, loaded burgers, deals. Free home delivery.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 antialiased">
        <AuthProvider>
          <CartProvider>
            <LayoutContent>
              {children}
            </LayoutContent>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}