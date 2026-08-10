"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { CheckCircle2, ChefHat, Bike, Package, Phone, MessageCircle, ArrowRight, Clock, MapPin } from "lucide-react";
import { getToken } from "@/lib/auth/auth-storage";
import { OrderStatus } from "@/types";
interface TrackOrderItem {
  id: string;

  menuItem?: {
    name: string;
  };

  name?: string;

  size?: {
    label: string;
  };

  quantity: number;

  totalPrice: number | string;
}

interface TrackOrder {
     id: string;
  orderNumber?: string;

  status: OrderStatus;

  subtotal?: number | string;
  deliveryFee?: number | string;
  taxAmount?: number | string;
  totalAmount?: number | string;

  total?: number;

  estimatedTime: string;
  paymentMethod: string;

  address?:
    | {
        addressLine1: string;
      }
    | string;

  phone?: string;

  items: TrackOrderItem[];
}

const steps: { key: OrderStatus; label: string; desc: string; icon: React.ElementType }[] = [
  { key:"confirmed", label:"Order Confirmed", desc:"We've received your order!", icon:CheckCircle2 },
  { key:"preparing", label:"Preparing",       desc:"Our chefs are cooking your food", icon:ChefHat },
  { key:"ontheway",  label:"On the Way",      desc:"Your rider is heading to you", icon:Bike },
  { key:"delivered", label:"Delivered",       desc:"Enjoy your meal! Bon appétit 🎉", icon:Package },
];
const statusIndex: Record<OrderStatus, number> = { confirmed:0, preparing:1, ontheway:2, delivered:3 };

function TrackContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order");
  const [order, setOrder] = useState<TrackOrder | null>(null);
  useEffect(() => {
  if (!orderNumber) return;

  const loadOrder = async () => {
  const token = getToken();

  const endpoint = token
    ? `/api/orders/${orderNumber}`
    : `/api/guest-orders/${orderNumber}`;

  const res = await fetch(endpoint, {
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {},
  });

  const json = await res.json();

console.log("TRACK RESPONSE");
console.log(json);
console.log("TRACK DATA");
console.log(JSON.stringify(json.data, null, 2));;

if (json.success) {
  setOrder(json.data);
}
};

  loadOrder();
}, [orderNumber]);

  if (!order) return (
    <div className="min-h-screen bg-gray-50 pt-28 flex items-center justify-center">
      <motion.div initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} className="text-center px-4">
        <div className="text-7xl mb-5">🔍</div>
        <h2 className="text-2xl font-black text-gray-900 mb-3">No order found</h2>
        <p className="text-gray-400 mb-8">Place a new order to get started!</p>
        <Link href="/menu"><button className="bg-red-500 text-white px-8 py-4 rounded-2xl font-bold hover:bg-red-600 transition-colors inline-flex items-center gap-2">Order Now <ArrowRight size={18} /></button></Link>
      </motion.div>
    </div>
  );

  const currentStep = statusIndex[order.status];
  const isDelivered = order.status === "delivered";

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} className="text-center mb-8">
          {isDelivered ? (
            <><motion.div initial={{ scale:0 }} animate={{ scale:1 }} transition={{ type:"spring",stiffness:200,damping:15 }} className="text-7xl mb-4">🎉</motion.div>
            <h1 className="text-3xl font-black text-gray-900">Order Delivered!</h1>
            <p className="text-gray-400 mt-2">Hope you enjoyed your meal. Come back soon!</p></>
          ) : (
            <><div className="relative w-20 h-20 mx-auto mb-4">
              <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center"><span className="text-4xl">🍕</span></div>
              <span className="absolute -top-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-2 border-white flex items-center justify-center"><span className="w-2 h-2 bg-white rounded-full animate-ping" /></span>
            </div>
            <h1 className="text-3xl font-black text-gray-900">Tracking Order</h1>
            <p className="text-gray-400 mt-2">Your food is on its way! 🛵</p></>
          )}
        </motion.div>
        <motion.div initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.1 }} className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 mb-5">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div><p className="text-xs text-gray-400 font-semibold uppercase tracking-widest">Order ID</p><p className="font-black text-xl text-gray-900 mt-0.5">#{order.id}</p></div>
            <div className="text-right"><p className="text-xs text-gray-400 font-semibold uppercase tracking-widest">Total Paid</p><p className="font-black text-xl text-red-500 mt-0.5">Rs. {Number(order.totalAmount).toLocaleString()}</p></div>
            <div><p className="text-xs text-gray-400 font-semibold uppercase tracking-widest flex items-center gap-1"><Clock size={10} />Est. Delivery</p><p className="font-bold text-gray-900 mt-0.5">{order.estimatedTime}</p></div>
            <div><p className="text-xs text-gray-400 font-semibold uppercase tracking-widest">Payment</p><p className="font-bold text-gray-900 mt-0.5 capitalize">{order.paymentMethod==="cod"?"Cash on Delivery":order.paymentMethod}</p></div>
          </div>
        </motion.div>
        <motion.div initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.2 }} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-5">
          <h2 className="font-bold text-gray-900 text-lg mb-6">Order Status</h2>
          <div className="space-y-0">
            {steps.map((step, i) => {
              const isDone = i < currentStep;
              const isActive = i === currentStep;
              const isPending = i > currentStep;
              return (
                <div key={step.key} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <motion.div initial={false} animate={{ backgroundColor: isDone||isActive ? "#EF4444" : "#F3F4F6", scale: isActive ? 1.15 : 1 }} transition={{ duration:0.4 }}
                      className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 border-2 border-white shadow-sm">
                      {isDone ? <motion.span initial={{ scale:0 }} animate={{ scale:1 }} className="text-white text-sm font-black">✓</motion.span> : <step.icon size={18} className={isActive ? "text-white" : "text-gray-400"} />}
                    </motion.div>
                    {i < steps.length-1 && (
                      <div className="w-0.5 flex-1 my-1 relative overflow-hidden rounded-full bg-gray-100" style={{ minHeight:32 }}>
                        <motion.div initial={{ height:"0%" }} animate={{ height: isDone ? "100%" : "0%" }} transition={{ duration:0.6,delay:0.2 }} className="absolute inset-x-0 top-0 bg-red-500 rounded-full" />
                      </div>
                    )}
                  </div>
                  <div className="pb-6 flex-1">
                    <div className="flex items-center justify-between">
                      <p className={`font-bold text-sm ${isPending ? "text-gray-400" : "text-gray-900"}`}>{step.label}</p>
                      {isActive && <motion.span animate={{ opacity:[1,0.4,1] }} transition={{ repeat:Infinity,duration:1.5 }} className="text-xs bg-red-100 text-red-600 font-bold px-2.5 py-1 rounded-full">Live</motion.span>}
                      {isDone && <span className="text-xs bg-green-100 text-green-600 font-bold px-2.5 py-1 rounded-full">Done</span>}
                    </div>
                    <p className={`text-xs mt-0.5 ${isPending ? "text-gray-300" : "text-gray-400"}`}>{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
        <motion.div initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.3 }} className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 mb-5">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0"><MapPin size={18} className="text-red-500" /></div>
            <div><p className="text-xs text-gray-400 font-semibold uppercase tracking-widest mb-1">Delivering To</p><p className="font-semibold text-gray-900 text-sm">{typeof order.address === "string"
  ? order.address
  : order.address?.addressLine1 ?? "No address"}</p><p className="text-gray-400 text-xs mt-0.5">{order.phone ?? "No phone"}</p></div>
          </div>
        </motion.div>
        <motion.div initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.35 }} className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 mb-5">
          <h3 className="font-bold text-gray-900 mb-4">Items Ordered</h3>
          <div className="space-y-3">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 bg-red-100 text-red-600 text-xs font-black rounded-lg flex items-center justify-center">{item.quantity}×</span>
                  <div><p className="text-sm font-semibold text-gray-900">{item.menuItem?.name ?? item.name}</p><p className="text-xs text-gray-400">{item.size?.label}</p></div>
                </div>
                <span className="text-sm font-bold text-gray-900">Rs. {Number(item.totalPrice).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </motion.div>
        <motion.div initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.4 }} className="grid grid-cols-2 gap-3">
          <a href="tel:+923315633133" className="flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 py-3.5 rounded-2xl font-bold text-sm hover:border-red-300 hover:text-red-600 transition-colors shadow-sm"><Phone size={16} />Call Restaurant</a>
          <a href={`https://wa.me/923315633133?text=Hi! My order ID is %23${order.id}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-green-500 text-white py-3.5 rounded-2xl font-bold text-sm hover:bg-green-600 transition-colors shadow-md shadow-green-500/30"><MessageCircle size={16} />WhatsApp</a>
        </motion.div>
        {isDelivered && (
          <motion.div initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.5 }} className="mt-4">
            <Link href="/menu"><button className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white py-4 rounded-2xl font-bold text-base hover:shadow-xl transition-all hover:scale-[1.02] flex items-center justify-center gap-2">Order Again 🍕 <ArrowRight size={18} /></button></Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default function TrackPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 pt-28 flex items-center justify-center"><div className="text-center"><div className="w-12 h-12 border-4 border-red-200 border-t-red-500 rounded-full animate-spin mx-auto mb-4" /><p className="text-gray-400">Loading order details...</p></div></div>}>
      <TrackContent />
    </Suspense>
  );
}
