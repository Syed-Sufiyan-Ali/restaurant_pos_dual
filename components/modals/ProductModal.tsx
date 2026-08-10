"use client";
import { getToken } from "@/lib/auth/auth-storage";
import { useAuth } from "@/lib/auth/useAuth";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, ShoppingCart, Star, Flame } from "lucide-react";
import Image from "next/image";
import { Product } from "@/types";
import { useCartStore } from "@/store/cartStore";
import { useCart } from "@/lib/cart/cart-context";
interface Props { product: Product | null; onClose: () => void; }

export default function ProductModal({ product, onClose }: Props) {
 
  const [selectedSize, setSelectedSize] = useState(0);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [qty, setQty] = useState(1);
  const { addItem } = useCartStore();
  const { refreshCart } = useCart();
   const { user } = useAuth();
  const sizePrice = product?.sizes ? product.sizes[selectedSize].price + product.basePrice : product?.basePrice || 0;
  const extrasPrice = selectedExtras.reduce((sum, id) => {
    const extra = product?.extras?.find((e) => e.id === id);
    return sum + (extra?.price || 0);
  }, 0);
  const unitPrice = sizePrice + extrasPrice;
  const total = unitPrice * qty;

  const toggleExtra = (id: string) =>
    setSelectedExtras((prev) => prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]);

  const handleAdd = async () => {
    if (!product) return;
    const size = product.sizes
  ? product.sizes[selectedSize]
  : {
      id: undefined,
      label: "Standard",
      price: 0,
      serves: "",
    };
    const extras = selectedExtras.map((id) => {
      const e = product.extras?.find((ex) => ex.id === id)!;
      return { id: e.id, label: e.label, price: e.price };
    });

const token = getToken();

if (user && token) {
  const res = await fetch("/api/cart", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      menuItemId: product.id,
      sizeId: size.id,
      addonIds: extras.map((e) => e.id),
      quantity: qty,
    }),
  });

  const json = await res.json();

  if (!res.ok) {
    alert(json.message || "Failed to add item.");
    return;
  }
  await refreshCart();
  alert("🍕 Added to your cart!");
} else {
  addItem({
    id: `${product.id}-${size.label}-${selectedExtras.sort().join("-")}`,
    productId: product.id,
    name: product.name,
    image: product.image,

    sizeId: size.id ?? null,
    size: size.label,
    sizePrice: size.price + product.basePrice,

    extras,

    quantity: qty,
    totalPrice: total,
  });
}

    setSelectedSize(0); 
    setSelectedExtras([]); 
    setQty(1);
     onClose();
  };

  return (
    <AnimatePresence>
      {product && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />
          <motion.div initial={{ opacity: 0, scale: 0.9, y: 40 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 40 }} transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div className="bg-white w-full max-w-lg max-h-[95vh] sm:rounded-3xl overflow-hidden flex flex-col shadow-2xl">
              <div className="relative h-56 sm:h-64 flex-shrink-0">
                <Image src={product.image || "/placeholder.png"} alt={product.name} fill className="object-cover"/>
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                {product.tag && (
                  <span className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide flex items-center gap-1">
                    {product.tag === "spicy" ? <Flame size={12} /> : <Star size={12} />}{product.tag}
                  </span>
                )}
                <button onClick={onClose} className="absolute top-4 right-4 bg-black/40 backdrop-blur-sm text-white p-2 rounded-full hover:bg-black/60 transition-colors"><X size={18} /></button>
                <div className="absolute bottom-4 left-4 right-4"><h2 className="text-white font-black text-2xl">{product.name}</h2></div>
              </div>
              <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">
                <p className="text-gray-500 text-sm leading-relaxed">{product.description}</p>
                {product.ingredients && (
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Ingredients</p>
                    <div className="flex flex-wrap gap-2">
                      {product.ingredients.map((ing) => (
                        <span key={ing} className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full font-medium">{ing}</span>
                      ))}
                    </div>
                  </div>
                )}
                {product.sizes && (
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Select Size</p>
                    <div className="grid grid-cols-3 gap-2">
                      {product.sizes.map((size, i) => (
                        <button key={size.label} onClick={() => setSelectedSize(i)}
                          className={`relative p-3 rounded-2xl border-2 text-center transition-all ${selectedSize === i ? "border-red-500 bg-red-50" : "border-gray-200 hover:border-red-200"}`}>
                          {selectedSize === i && <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center"><span className="text-white text-xs font-bold">✓</span></span>}
                          <p className={`font-bold text-sm ${selectedSize === i ? "text-red-600" : "text-gray-700"}`}>{size.label}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{size.serves}</p>
                          <p className={`text-sm font-bold mt-1 ${selectedSize === i ? "text-red-500" : "text-gray-600"}`}>Rs. {(product.basePrice + size.price).toLocaleString()}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {product.extras && (
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Add Extras</p>
                    <div className="space-y-2">
                      {product.extras.map((extra) => {
                        const checked = selectedExtras.includes(extra.id);
                        return (
                          <button key={extra.id} onClick={() => toggleExtra(extra.id)}
                            className={`w-full flex items-center justify-between p-3.5 rounded-xl border-2 transition-all ${checked ? "border-red-500 bg-red-50" : "border-gray-200 hover:border-red-200"}`}>
                            <div className="flex items-center gap-3">
                              <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${checked ? "bg-red-500 border-red-500" : "border-gray-300"}`}>
                                {checked && <span className="text-white text-xs font-bold">✓</span>}
                              </div>
                              <span className={`font-semibold text-sm ${checked ? "text-red-700" : "text-gray-700"}`}>{extra.label}</span>
                            </div>
                            <span className={`font-bold text-sm ${checked ? "text-red-500" : "text-gray-400"}`}>+Rs. {extra.price}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
              <div className="px-6 py-5 border-t border-gray-100 flex-shrink-0">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-10 h-10 rounded-xl border-2 border-gray-200 flex items-center justify-center hover:border-red-300 transition-colors"><Minus size={16} /></button>
                    <span className="font-black text-xl w-6 text-center">{qty}</span>
                    <button onClick={() => setQty(qty + 1)} className="w-10 h-10 rounded-xl bg-red-500 flex items-center justify-center text-white hover:bg-red-600 transition-colors"><Plus size={16} /></button>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">Total</p>
                    <p className="font-black text-2xl text-red-500">Rs. {total.toLocaleString()}</p>
                  </div>
                </div>
                <button onClick={handleAdd} className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white py-4 rounded-2xl font-bold text-base hover:shadow-lg hover:shadow-red-500/30 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2">
                  <ShoppingCart size={18} />Add to Cart — Rs. {total.toLocaleString()}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
