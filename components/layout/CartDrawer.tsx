"use client";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useCart } from "@/lib/cart/cart-context";
import Link from "next/link";
import Image from "next/image";

export default function CartDrawer() {
   const { cart, refreshCart } = useCart();
  const { items, isOpen, closeCart, removeItem, updateQty, totalPrice } = useCartStore();
  const displayItems = cart?.items ?? items;
  console.log("cart =", cart);
console.log("items =", items);
console.log("displayItems =", displayItems);
const handleDelete = async (itemId: string) => {
  if (cart) {
    const token = localStorage.getItem("pizza_token");

    const res = await fetch(`/api/cart/items/${itemId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      console.error("Delete failed");
      return;
    }

    await refreshCart();
  } else {
    removeItem(itemId);
  }
};
const handleUpdateQty = async (itemId: string, quantity: number) => {
  if (cart) {
    const token = localStorage.getItem("pizza_token");

    const res = await fetch(`/api/cart/items/${itemId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        quantity,
      }),
    });

    if (!res.ok) {
      console.error("Failed to update quantity");
      return;
    }

    await refreshCart();
  } else {
    updateQty(itemId, quantity);
  }
};
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeCart} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
          <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center"><ShoppingBag size={20} className="text-red-500" /></div>
                <div>
                  <h2 className="font-bold text-gray-900 text-lg">Your Cart</h2>
                  <p className="text-sm text-gray-400">{displayItems.length} item{items.length !== 1 ? "s" : ""}</p>
                </div>
              </div>
              <button onClick={closeCart} className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"><X size={20} /></button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <AnimatePresence>
                {displayItems.length === 0 ? (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center h-64 text-center">
                    <div className="text-6xl mb-4">🛒</div>
                    <h3 className="font-bold text-gray-900 text-lg mb-2">Your cart is empty</h3>
                    <p className="text-gray-400 text-sm mb-6">Add some delicious items to get started!</p>
                    <button onClick={closeCart} className="bg-red-500 text-white px-6 py-3 rounded-full font-semibold text-sm hover:bg-red-600 transition-colors">Browse Menu</button>
                  </motion.div>
                ) : (
                  <div className="space-y-4">
                    {displayItems.map((item: any) => {

  const image =
    item.image ??
    item.menuItem?.images?.[0]?.url ??
    "/placeholder.png";

  const name =
    item.name ??
    item.menuItem?.name;

const size =
  typeof item.size === "string"
    ? item.size
    : item.size?.label ?? "Standard";

  const extras =
    item.extras ??
    item.addons ??
    [];

  const totalPrice =
    item.totalPrice ??
    (
      Number(item.menuItem?.basePrice ?? 0) +
      Number(item.size?.priceAddon ?? 0) +
      extras.reduce((sum: number, e: any) => sum + Number(e.price ?? 0), 0)
    ) * item.quantity;

  return (
                      <motion.div key={item.id} layout initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex gap-4 p-4 bg-gray-50 rounded-2xl">
                        <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                         <Image
  src={image}
  alt={name}
  fill
  className="object-cover"
/>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-gray-900 text-sm truncate">{name}</h4>
                          <p className="text-xs text-gray-400 mt-0.5">{size}</p>
                          {extras.length > 0 && (
  <p className="text-xs text-gray-400">
    +{extras.map((e:any)=>e.label).join(", ")}
  </p>
)}
                          <div className="flex items-center justify-between mt-2">
                            <span className="font-bold text-red-500 text-sm">Rs. {totalPrice.toLocaleString()}</span>
                            <div className="flex items-center gap-2">
                              <button onClick={() => handleUpdateQty(item.id, item.quantity - 1)} className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center hover:border-red-300 hover:text-red-500 transition-colors"><Minus size={12} /></button>
                              <span className="font-bold text-sm w-4 text-center">{item.quantity}</span>
                              <button onClick={() => handleUpdateQty(item.id, item.quantity + 1)} className="w-7 h-7 rounded-lg bg-red-500 flex items-center justify-center text-white hover:bg-red-600 transition-colors"><Plus size={12} /></button>
                              <button onClick={() => handleDelete(item.id)} className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center hover:border-red-300 hover:text-red-500 transition-colors ml-1"><Trash2 size={12} /></button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )})}
                  </div>
                )}
              </AnimatePresence>
            </div>
            {displayItems.length > 0 && (
              <div className="px-6 py-5 border-t border-gray-100 space-y-4">
                <div className="flex items-center justify-between"><span className="text-gray-500 font-medium">Subtotal</span><span className="font-bold text-gray-900">Rs. {(cart?.subtotal ?? totalPrice()).toLocaleString()}</span></div>
                <div className="flex items-center justify-between"><span className="text-gray-500 font-medium">Delivery</span><span className="font-semibold text-green-600 text-sm">{cart? `Rs. ${cart.deliveryFee}`: "Free"}</span></div>
                <div className="h-px bg-gray-100" />
                <div className="flex items-center justify-between"><span className="font-bold text-gray-900 text-lg">Total</span><span className="font-black text-red-500 text-xl">Rs. {(cart?.totalAmount ?? totalPrice()).toLocaleString()}</span></div>
                <Link href="/checkout" onClick={closeCart}>
                  <button className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white py-4 rounded-2xl font-bold text-base hover:shadow-lg hover:shadow-red-500/30 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2">
                    Proceed to Checkout <ArrowRight size={18} />
                  </button>
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
