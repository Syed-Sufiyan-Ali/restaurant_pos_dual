"use client";
import { useCartStore } from "@/store/cartStore";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { getToken } from "@/lib/auth/auth-storage";

interface CartContextType {
  cart: any;
  loading: boolean;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const setItems = useCartStore((state) => state.setItems);
  const clearLocalCart = useCartStore((state) => state.clearCart);

  async function refreshCart() {
    const token = getToken();

    if (!token) {
  clearLocalCart();   // clears the old guest/local cart
  setCart(null);
  setLoading(false);
  return;
}

    try {
      const res = await fetch("/api/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const json = await res.json();
     console.log(json.data.cart);
     if (json.success) {
  setCart(json.data.cart);

  const backendItems =
    json.data.cart?.items?.map((item: any) => ({
      id: item.id,
      productId: item.menuItem.id,
      name: item.menuItem.name,
      image: item.menuItem.images?.[0]?.url || "/placeholder.png",
      quantity: item.quantity,
      size: item.size?.label ?? "",
      sizePrice:
        Number(item.menuItem.basePrice) +
        Number(item.size?.priceAddon ?? 0),
      extras:
        item.addons?.map((a: any) => ({
          id: a.addon.id,
          label: a.addon.label,
          price: Number(a.addon.price),
        })) ?? [],
      totalPrice:
        (
          Number(item.menuItem.basePrice) +
          Number(item.size?.priceAddon ?? 0) +
          (item.addons?.reduce(
            (s: number, a: any) => s + Number(a.addon.price),
            0
          ) ?? 0)
        ) * item.quantity,
    })) ?? [];

  setItems(backendItems);
}
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  }

  useEffect(() => {
    refreshCart();
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);

  if (!ctx) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return ctx;
}