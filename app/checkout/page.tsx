"use client";
import { getToken } from "@/lib/auth/auth-storage";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { MapPin, Phone, User, CreditCard, Smartphone, Banknote, ChevronRight, ShoppingBag, Tag, ArrowLeft } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useCart } from "@/lib/cart/cart-context";
import { useOrderStore } from "@/store/orderStore";
import Link from "next/link";

type PM = "cod"|"jazzcash"|"easypaisa"|"card";
const payOpts = [
  { id:"cod" as PM,    label:"Cash on Delivery",     desc:"Pay when your order arrives",        icon:Banknote,    color:"text-green-600", bg:"bg-green-50",  border:"border-green-200" },
  { id:"jazzcash" as PM, label:"JazzCash",            desc:"Pay via JazzCash mobile wallet",     icon:Smartphone,  color:"text-red-600",   bg:"bg-red-50",    border:"border-red-200"   },
  { id:"easypaisa" as PM,label:"EasyPaisa",           desc:"Pay via EasyPaisa mobile account",   icon:Smartphone,  color:"text-green-700", bg:"bg-green-50",  border:"border-green-200" },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, refreshCart } = useCart();
  const {
  items: guestItems,
  totalPrice,
  clearCart,
} = useCartStore();
  const { placeOrder } = useOrderStore();

  const items = cart?.items ?? guestItems;

const subtotal =
  cart?.subtotal ?? totalPrice();

const deliveryFee =
  cart?.deliveryFee ?? 0;

const total =
  cart?.totalAmount ?? subtotal + deliveryFee;
  const [form, setForm] = useState({ name:"", phone:"", address:"", note:"" });
  const [payment, setPayment] = useState<PM>("cod");
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState("");
  const [errors, setErrors] = useState<Record<string,string>>({});
  const [placing, setPlacing] = useState(false);
  const discount = promoApplied ? Math.floor(subtotal * 0.1) : 0;
  const finalTotal = total - discount;
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setErrors((er) => ({ ...er, [e.target.name]: "" }));
  };
  const applyPromo = () => {
    if (promoCode.toUpperCase() === "PIZZA10") { setPromoApplied(true); setPromoError(""); }
    else { setPromoError("Invalid promo code. Try PIZZA10"); setPromoApplied(false); }
  };
  const validate = () => {
    const errs: Record<string,string> = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.phone.trim()) errs.phone = "Phone number is required";
    if (!form.address.trim()) errs.address = "Delivery address is required";
    setErrors(errs); return Object.keys(errs).length === 0;
  };
  const placeOrderHandler = async () => {
    if (!validate()) return;
    setPlacing(true);
    await new Promise((r) => setTimeout(r, 1500));
    const token = getToken();
    const endpoint = token
  ? "/api/orders"
  : "/api/guest-orders";

const res = await fetch(endpoint, {
  method: "POST",

headers: {
  "Content-Type": "application/json",
  ...(token && {
    Authorization: `Bearer ${token}`,
  }),
},
  body: JSON.stringify({
    guestName: form.name,
    guestPhone: form.phone,
    guestAddress: form.address,
    type: "DELIVERY",
    paymentMethod: payment,
    note: form.note,
    items,
  }),
});

const json = await res.json();

if (!res.ok) {
  alert(json.message || "Failed to place order.");
  setPlacing(false);
  return;
}

console.log(json);

// Clear the cart
clearCart();

// Stop loading
setPlacing(false);

// Show success message
alert("🎉 Order placed successfully!");

clearCart();

setPlacing(false);

router.push(`/track?order=${json.data.orderNumber}`);
  };

  if (items.length === 0) return (
    <div className="min-h-screen bg-gray-50 pt-28 flex items-center justify-center">
      <motion.div initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} className="text-center px-4">
        <div className="text-7xl mb-5">🛒</div>
        <h2 className="text-2xl font-black text-gray-900 mb-3">Your cart is empty</h2>
        <p className="text-gray-400 mb-8">Add some delicious items before checking out.</p>
        <Link href="/menu"><button className="bg-red-500 text-white px-8 py-4 rounded-2xl font-bold hover:bg-red-600 transition-colors inline-flex items-center gap-2"><ArrowLeft size={18} />Browse Menu</button></Link>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} className="mb-8">
          <Link href="/menu" className="text-gray-400 hover:text-gray-600 text-sm flex items-center gap-1 mb-4 w-fit transition-colors"><ArrowLeft size={16} /> Back to Menu</Link>
          <h1 className="text-3xl font-black text-gray-900">Checkout</h1>
          <p className="text-gray-400 mt-1">Complete your order below</p>
        </motion.div>
        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 space-y-6">
            <motion.div initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.1 }} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h2 className="font-bold text-gray-900 text-lg mb-5 flex items-center gap-2"><MapPin size={20} className="text-red-500" />Delivery Details</h2>
              <div className="space-y-4">
                {[{name:"name",label:"Full Name",icon:User,ph:"e.g. Ahmed Khan",type:"input"},{name:"phone",label:"Phone Number",icon:Phone,ph:"e.g. 0331-5633133",type:"input"},{name:"address",label:"Delivery Address",icon:MapPin,ph:"House no., Street, Area, Sukkur",type:"textarea"},{name:"note",label:"Order Note (optional)",icon:null,ph:"e.g. Extra spicy...",type:"input"}].map((field) => (
                  <div key={field.name}>
                    <label className="text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                      {field.icon && <field.icon size={14} />}{field.label}
                    </label>
                    {field.type === "textarea" ? (
                      <textarea name={field.name} value={(form as any)[field.name]} onChange={handleChange} placeholder={field.ph} rows={3}
                        className={`w-full border rounded-xl px-4 py-3 text-sm outline-none transition-all resize-none ${errors[field.name] ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-red-400 focus:ring-2 focus:ring-red-100"}`} />
                    ) : (
                      <input name={field.name} value={(form as any)[field.name]} onChange={handleChange} placeholder={field.ph}
                        className={`w-full border rounded-xl px-4 py-3 text-sm outline-none transition-all ${errors[field.name] ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-red-400 focus:ring-2 focus:ring-red-100"}`} />
                    )}
                    {errors[field.name] && <p className="text-red-500 text-xs mt-1">{errors[field.name]}</p>}
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.2 }} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h2 className="font-bold text-gray-900 text-lg mb-5 flex items-center gap-2"><CreditCard size={20} className="text-red-500" />Payment Method</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {payOpts.map((opt) => (
                  <button key={opt.id} onClick={() => setPayment(opt.id)}
                    className={`flex items-start gap-3 p-4 rounded-2xl border-2 text-left transition-all ${payment===opt.id ? `${opt.border} ${opt.bg}` : "border-gray-100 hover:border-gray-200 bg-gray-50"}`}>
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${payment===opt.id ? opt.bg : "bg-white"} border ${payment===opt.id ? opt.border : "border-gray-200"}`}>
                      <opt.icon size={18} className={payment===opt.id ? opt.color : "text-gray-400"} />
                    </div>
                    <div><p className={`font-bold text-sm ${payment===opt.id ? "text-gray-900" : "text-gray-700"}`}>{opt.label}</p><p className="text-xs text-gray-400 mt-0.5">{opt.desc}</p></div>
                  </button>
                ))}
              </div>
              {(payment==="jazzcash"||payment==="easypaisa") && (
                <motion.div initial={{ opacity:0,height:0 }} animate={{ opacity:1,height:"auto" }} className="mt-4 bg-yellow-50 border border-yellow-200 rounded-2xl p-4">
                  <p className="text-yellow-800 text-sm font-semibold mb-1">📱 Mobile Payment Instructions</p>
                  <p className="text-yellow-700 text-xs">Send payment to: <strong>0331-5633133</strong> ({payment==="jazzcash"?"JazzCash":"EasyPaisa"})<br />Account Name: <strong>Pizza Town Sukkur</strong><br />Send screenshot to WhatsApp after payment.</p>
                </motion.div>
              )}
            </motion.div>
          </div>
          <div className="lg:col-span-2">
            <motion.div initial={{ opacity:0,x:20 }} animate={{ opacity:1,x:0 }} transition={{ delay:0.15 }} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 sticky top-24">
              <h2 className="font-bold text-gray-900 text-lg mb-5 flex items-center gap-2"><ShoppingBag size={20} className="text-red-500" />Order Summary</h2>
              <div className="space-y-3 mb-5 max-h-56 overflow-y-auto pr-1">
               
            {items.map((item: any) => {
  const image =
    item.image ??
    item.menuItem?.images?.[0]?.url ??
    "/placeholder.png";

  const name =
    item.name ??
    item.menuItem?.name;

  const size =
    item.size?.label ??
    item.size ??
    "Standard";

  const price =
    item.totalPrice ??
    (
      Number(item.menuItem?.basePrice ?? 0) +
      Number(item.size?.priceAddon ?? 0) +
      (
        item.addons?.reduce(
          (sum: number, a: any) =>
            sum + Number(a.addon?.price ?? a.price ?? 0),
          0
        ) ?? 0
      )
    ) * item.quantity;

  return (
    <div key={item.id} className="flex gap-3">
      <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover"
        />
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900 text-sm truncate">
          {name}
        </p>

        <p className="text-xs text-gray-400">
          {size} × {item.quantity}
        </p>
      </div>

      <span className="font-bold text-sm text-gray-900 whitespace-nowrap">
        Rs. {price.toLocaleString()}
      </span>
    </div>
  );
})}

              </div>
              <div className="h-px bg-gray-100 mb-4" />
              <div className="mb-4">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-1"><Tag size={12} />Promo Code</label>
                <div className="flex gap-2">
                  <input value={promoCode} onChange={(e) => { setPromoCode(e.target.value); setPromoError(""); }} placeholder="Try PIZZA10"
                    className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-red-400 transition-all" />
                  <button onClick={applyPromo} className="bg-gray-900 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-gray-700 transition-colors">Apply</button>
                </div>
                {promoApplied && <p className="text-green-600 text-xs mt-1 font-semibold">✓ 10% discount applied!</p>}
                {promoError && <p className="text-red-500 text-xs mt-1">{promoError}</p>}
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>Rs. {subtotal.toLocaleString()}</span></div>
                {promoApplied && <div className="flex justify-between text-green-600 font-semibold"><span>Discount (10%)</span><span>− Rs. {discount.toLocaleString()}</span></div>}
                <div className="flex justify-between text-gray-500">
  <span>Delivery</span>
  <span className="text-green-600 font-semibold">
    Rs. {deliveryFee.toLocaleString()}
  </span>
</div>
                <div className="h-px bg-gray-100 my-2" />
                <div className="flex justify-between font-black text-lg text-gray-900"><span>Total</span><span className="text-red-500">
  Rs. {finalTotal.toLocaleString()}
</span></div>
              </div>
              <button onClick={placeOrderHandler} disabled={placing}
                className="w-full mt-6 bg-gradient-to-r from-red-500 to-orange-500 text-white py-4 rounded-2xl font-black text-base hover:shadow-xl hover:shadow-red-500/30 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                {placing ? (<><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Placing Order...</>) : (<>Place Order<ChevronRight size={18} /></>)}
              </button>
              <p className="text-center text-gray-400 text-xs mt-3">🔒 Your information is safe and secure</p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
