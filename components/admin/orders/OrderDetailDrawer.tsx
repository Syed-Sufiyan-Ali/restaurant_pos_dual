// "use client";

// import { useCallback, useEffect, useState } from "react";
// import {
//   User,
//   MapPin,
//   Phone,
//   Mail,
//   CreditCard,
//   Package,
//   Clock,
//   Tag,
//   Hash,
// } from "lucide-react";

// import { Drawer } from "@/components/admin/ui/Drawer";
// import { LoadingScreen } from "@/components/admin/ui/LoadingScreen";
// import { ErrorState } from "@/components/admin/ui/ErrorState";
// import { useToast } from "@/components/admin/ui/Toaster";

// import { OrderStatusBadge } from "./OrderStatusBadge";
// import { OrderStatusButtons } from "@/components/admin/common/OrderStatusButtons";
// import { OrderTimeline } from "@/components/admin/common/OrderTimeline";

// import { fetchOrder, updateOrderStatus, updateOrderPaymentStatus } from "@/lib/admin/orders-api";
// import type { Order, OrderStatus } from "@/lib/admin/types";

// interface OrderDetailDrawerProps {
//   orderId: string | null;
//   onClose: () => void;
//   onStatusUpdated: () => void;
// }

// function formatPrice(n: number) {
//   return `Rs. ${n.toLocaleString("en-PK", { minimumFractionDigits: 0 })}`;
// }

// function formatDate(iso: string) {
//   return new Date(iso).toLocaleString("en-PK", {
//     day: "numeric",
//     month: "short",
//     year: "numeric",
//     hour: "2-digit",
//     minute: "2-digit",
//     hour12: true,
//   });
// }

// // ─── Section wrapper ──────────────────────────────────────────────────────────
// function Section({
//   icon: Icon,
//   title,
//   children,
// }: {
//   icon: React.ElementType;
//   title: string;
//   children: React.ReactNode;
// }) {
//   return (
//     <div className="rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface-2)] p-4">
//       <div className="mb-3 flex items-center gap-2">
//         <Icon size={13} className="text-[var(--admin-text-muted)]" />
//         <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--admin-text-muted)]">
//           {title}
//         </h3>
//       </div>
//       {children}
//     </div>
//   );
// }

// // ─── Info row ─────────────────────────────────────────────────────────────────
// function InfoRow({ label, value }: { label: React.ReactNode; value: React.ReactNode }) {
//   return (
//     <div className="flex items-start justify-between gap-4 py-1.5">
//       <span className="flex-shrink-0 text-xs text-[var(--admin-text-muted)]">{label}</span>
//       <span className="text-right text-xs font-medium text-[var(--admin-text)]">{value}</span>
//     </div>
//   );
// }

// // ─── Divider ──────────────────────────────────────────────────────────────────
// function Divider() {
//   return <div className="my-1 border-t border-[var(--admin-border)]" />;
// }

// // ─── Main component ───────────────────────────────────────────────────────────
// export function OrderDetailDrawer({
//   orderId,
//   onClose,
//   onStatusUpdated,
// }: OrderDetailDrawerProps) {
//   const { toast } = useToast();
//   const [order, setOrder] = useState<Order | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const load = useCallback(async () => {
//     if (!orderId) return;
//     setLoading(true);
//     setError(null);
//     const res = await fetchOrder(orderId);
//     setLoading(false);
//     if (res.success) setOrder(res.data);
//     else setError(res.message);
//   }, [orderId]);

//   useEffect(() => {
//     if (orderId) {
//       setOrder(null);
//       load();
//     }
//   }, [orderId, load]);

//   async function handleStatusUpdate(status: OrderStatus) {
//     if (!order) return;
//     const res = await updateOrderStatus(order.id, status);
//     if (res.success) {
//       setOrder(res.data);
//       onStatusUpdated();
//       toast(`Order ${order.orderNumber} marked as ${status.replace(/_/g, " ").toLowerCase()}.`, "success");
//     } else {
//       toast(res.message, "error");
//     }
//   }

//   const isOpen = Boolean(orderId);

//   return (
//     <Drawer
//       open={isOpen}
//       onClose={onClose}
//       title={order ? `Order ${order.orderNumber}` : "Order Details"}
//       description={order ? formatDate(order.createdAt) : undefined}
//     >
//       {loading && <LoadingScreen />}
//       {error && <ErrorState message={error} onRetry={load} />}

//       {order && !loading && (
//         <div className="flex flex-col gap-4">
//           {/* Status row */}
//           <div className="flex items-center justify-between">
//             <OrderStatusBadge status={order.status} />
//             <span className="text-xs text-[var(--admin-text-muted)]">
//               <Hash size={11} className="mr-0.5 inline" />
//               {order.orderNumber}
//             </span>
//           </div>

//           {/* Status actions */}
//           <Section icon={Clock} title="Update Status">
//             <OrderStatusButtons
//               currentStatus={order.status}
//               onUpdate={handleStatusUpdate}
//             />


//           </Section>

//           {/* user */}
//           <Section icon={User} title="user test 123">
//             {order.user ? (
//               <>
//                 <InfoRow label="Name" value={order.user.name} />
//                 {order.user.phone && (
//                   <InfoRow
//                     label="Phone"
//                     value={
//                       <a
//                         href={`tel:${order.user.phone}`}
//                         className="flex items-center gap-1 text-[var(--admin-accent)] hover:underline"
//                       >
//                         <Phone size={11} />
//                         {order.user.phone}
//                       </a>
//                     }
//                   />
//                 )}
//                 {order.user.email && (
//                   <InfoRow
//                     label="Email"
//                     value={
//                       <a
//                         href={`mailto:${order.user.email}`}
//                         className="flex items-center gap-1 text-[var(--admin-accent)] hover:underline"
//                       >
//                         <Mail size={11} />
//                         {order.user.email}
//                       </a>
//                     }
//                   />
//                 )}
//               </>
//             ) : (
//               <>
//                 {order.guestName && <InfoRow label="Name" value={order.guestName} />}
//                 {order.guestPhone && (
//                   <InfoRow
//                     label="Phone"
//                     value={
//                       <a
//                         href={`tel:${order.guestPhone}`}
//                         className="flex items-center gap-1 text-[var(--admin-accent)] hover:underline"
//                       >
//                         <Phone size={11} />
//                         {order.guestPhone}
//                       </a>
//                     }
//                   />
//                 )}
//                 {!order.guestName && !order.guestPhone && (
//                   <p className="text-xs text-[var(--admin-text-muted)]">Guest order</p>
//                 )}
//               </>
//             )}
//           </Section>

//           {/* Delivery address */}
//           {(order.address || order.guestAddress) && (
//             <Section icon={MapPin} title="Delivery Address">
//               {order.address ? (
//                 <>
//                   {order.address.label && (
//                     <InfoRow label="Label" value={order.address.label} />
//                   )}
//                   <InfoRow label="Street" value={order.address.street} />
//                   {order.address.city && (
//                     <InfoRow label="City" value={order.address.city} />
//                   )}
//                   {order.address.isDefault && (
//                     <InfoRow label="Default Address" value="Yes" />
//                   )}
//                 </>
//               ) : (
//                 <p className="text-xs text-[var(--admin-text)]">{order.guestAddress}</p>
//               )}
//             </Section>
//           )}

//           {/* Items */}
//           <Section icon={Package} title={`Items (${order.items.length})`}>
//             <div className="flex flex-col gap-3">
//               {order.items.map((item) => (
//                 <div
//                   key={item.id}
//                   className="flex gap-3 rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] p-3"
//                 >
//                   {/* Thumbnail */}
//                   {item.menuItem.images && item.menuItem.images.length > 0 ? (
//   <img
//     src={item.menuItem.images[0].url}
//     alt={item.menuItem.name}
//     className="h-12 w-12 flex-shrink-0 rounded-lg object-cover"
//   />
// ) : (
//                     <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-[var(--admin-surface-2)] text-lg">
//                       🍕
//                     </div>
//                   )}

//                   {/* Details */}
//                   <div className="flex flex-1 flex-col gap-0.5">
//                     <div className="flex items-start justify-between gap-2">
//                       <p className="text-xs font-semibold text-[var(--admin-text)]">
//                         {item.menuItem.name}
//                         <span className="ml-1 font-normal text-[var(--admin-text-muted)]">
//                           ×{item.quantity}
//                         </span>
//                       </p>
//                       <p className="flex-shrink-0 text-xs font-semibold text-[var(--admin-text)]">
//                         {formatPrice(item.totalPrice)}
//                       </p>
//                     </div>

//                     {item.size && (
//                       <p className="text-[11px] text-[var(--admin-text-muted)]">
//                         Size: {item.size.label}
//                       </p>
//                     )}

//                     {item.addons && item.addons.length > 0 && (
//                       <p className="text-[11px] text-[var(--admin-text-muted)]">
//                         Add-ons:{" "}
//                         {item.addons.map((a) => a.label).join(", ")}
//                       </p>
//                     )}

//                     <p className="text-[11px] text-[var(--admin-text-muted)]">
//                       Unit price: {formatPrice(item.unitPrice)}
//                     </p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </Section>

//           {/* Payment */}
//           <Section icon={CreditCard} title="Payment">
//             <InfoRow label="Method" value={order.paymentMethod} />
//             <InfoRow
//               label="Payment Status"
//               value={
//                 <span
//                   className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
//                     order.paymentStatus === "PAID"
//                       ? "bg-emerald-500/10 text-emerald-500"
//                       : order.paymentStatus === "FAILED"
//                       ? "bg-red-500/10 text-red-500"
//                       : "bg-amber-400/10 text-amber-500"
//                   }`}
//                 >
//                   {order.paymentStatus}
//                 </span>
//               }
//             />
//             <Divider />
//             <InfoRow label="Subtotal" value={formatPrice(order.subtotal)} />
//             {order.discountAmount > 0 && (
//               <InfoRow
//                 label={
//                   order.coupon ? (
//                     <span className="flex items-center gap-1">
//                       <Tag size={11} />
//                       Discount ({order.coupon.code})
//                     </span>
//                   ) : (
//                     "Discount"
//                   )
//                 }
//                 value={
//                   <span className="text-emerald-500">−{formatPrice(order.discountAmount)}</span>
//                 }
//               />
//             )}
//             {order.taxAmount > 0 && (
//               <InfoRow label="Tax" value={formatPrice(order.taxAmount)} />
//             )}
//             <InfoRow label="Delivery Fee" value={formatPrice(order.deliveryFee)} />
//             <Divider />
//             <div className="flex items-center justify-between pt-1">
//               <span className="text-sm font-semibold text-[var(--admin-text)]">Total</span>
//               <span className="text-sm font-bold text-[var(--admin-text)]">
//                 {formatPrice(order.totalAmount)}
//               </span>
//             </div>
//           </Section>

//           {/* Timeline */}
//           <Section icon={Clock} title="Timeline">
//             <OrderTimeline timeline={order.timeline} />
//           </Section>
//         </div>
//       )}
//     </Drawer>
//   );
// }
"use client";

import { useCallback, useEffect, useState } from "react";
import {
  User,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  Package,
  Clock,
  Tag,
  Hash,
} from "lucide-react";

import { Drawer } from "@/components/admin/ui/Drawer";
import { LoadingScreen } from "@/components/admin/ui/LoadingScreen";
import { ErrorState } from "@/components/admin/ui/ErrorState";
import { useToast } from "@/components/admin/ui/Toaster";

import { OrderStatusBadge } from "./OrderStatusBadge";
import { OrderStatusButtons } from "@/components/admin/common/OrderStatusButtons";
import { OrderTimeline } from "@/components/admin/common/OrderTimeline";

import { fetchOrder, updateOrderStatus, updateOrderPaymentStatus,} from "@/lib/admin/orders-api";
import type { Order, OrderStatus } from "@/lib/admin/types";

interface OrderDetailDrawerProps {
  orderId: string | null;
  onClose: () => void;
  onStatusUpdated: () => void;
}

function formatPrice(n: number) {
  return `Rs. ${n.toLocaleString("en-PK", { minimumFractionDigits: 0 })}`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-PK", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

// ─── Section wrapper ──────────────────────────────────────────────────────────
function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface-2)] p-4">
      <div className="mb-3 flex items-center gap-2">
        <Icon size={13} className="text-[var(--admin-text-muted)]" />
        <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--admin-text-muted)]">
          {title}
        </h3>
      </div>
      {children}
    </div>
  );
}

// ─── Info row ─────────────────────────────────────────────────────────────────
function InfoRow({ label, value }: { label: React.ReactNode; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-1.5">
      <span className="flex-shrink-0 text-xs text-[var(--admin-text-muted)]">{label}</span>
      <span className="text-right text-xs font-medium text-[var(--admin-text)]">{value}</span>
    </div>
  );
}

// ─── Divider ──────────────────────────────────────────────────────────────────
function Divider() {
  return <div className="my-1 border-t border-[var(--admin-border)]" />;
}

// ─── Main component ───────────────────────────────────────────────────────────
export function OrderDetailDrawer({
  orderId,
  onClose,
  onStatusUpdated,
}: OrderDetailDrawerProps) {
  const { toast } = useToast();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!orderId) return;
    setLoading(true);
    setError(null);
    const res = await fetchOrder(orderId);
    setLoading(false);
    if (res.success) setOrder(res.data);
    else setError(res.message);
  }, [orderId]);

  useEffect(() => {
    if (orderId) {
      setOrder(null);
      load();
    }
  }, [orderId, load]);

  async function handleStatusUpdate(status: OrderStatus) {
    if (!order) return;
    const res = await updateOrderStatus(order.id, status);
    if (res.success) {
      setOrder(res.data);
      onStatusUpdated();
      toast(`Order ${order.orderNumber} marked as ${status.replace(/_/g, " ").toLowerCase()}.`, "success");
    } else {
      toast(res.message, "error");
    }
  }
async function handlePaymentUpdate() {
  if (!order) return;

  const res = await updateOrderPaymentStatus(order.id, "PAID");

console.log("API RESPONSE", res);
 if (res.success) {
  const refreshed = await fetchOrder(order.id);

  if (refreshed.success) {
    setOrder(refreshed.data);
  }

  onStatusUpdated();

  toast(
    `Payment for Order ${order.orderNumber} marked as paid.`,
    "success"
  );
} else {
    toast(res.message, "error");
  }
}
  const isOpen = Boolean(orderId);

  return (
    <Drawer
      open={isOpen}
      onClose={onClose}
      title={order ? `Order ${order.orderNumber}` : "Order Details"}
      description={order ? formatDate(order.createdAt) : undefined}
    >
      {loading && <LoadingScreen />}
      {error && <ErrorState message={error} onRetry={load} />}

      {order && !loading && (
        <div className="flex flex-col gap-4">
          {/* Status row */}
          <div className="flex items-center justify-between">
            <OrderStatusBadge status={order.status} />
            <span className="text-xs text-[var(--admin-text-muted)]">
              <Hash size={11} className="mr-0.5 inline" />
              {order.orderNumber}
            </span>
          </div>

          {/* Status actions */}
          <Section icon={Clock} title="Update Status">
            <OrderStatusButtons
              currentStatus={order.status}
              onUpdate={handleStatusUpdate}
            />
          </Section>

          {/* user */}
          <Section icon={User} title="user">
            {order.user ? (
              <>
                <InfoRow label="Name" value={order.user.name} />
                {order.user.phone && (
                  <InfoRow
                    label="Phone"
                    value={
                      <a
                        href={`tel:${order.user.phone}`}
                        className="flex items-center gap-1 text-[var(--admin-accent)] hover:underline"
                      >
                        <Phone size={11} />
                        {order.user.phone}
                      </a>
                    }
                  />
                )}
                {order.user.email && (
                  <InfoRow
                    label="Email"
                    value={
                      <a
                        href={`mailto:${order.user.email}`}
                        className="flex items-center gap-1 text-[var(--admin-accent)] hover:underline"
                      >
                        <Mail size={11} />
                        {order.user.email}
                      </a>
                    }
                  />
                )}
              </>
            ) : (
              <>
                {order.guestName && <InfoRow label="Name" value={order.guestName} />}
                {order.guestPhone && (
                  <InfoRow
                    label="Phone"
                    value={
                      <a
                        href={`tel:${order.guestPhone}`}
                        className="flex items-center gap-1 text-[var(--admin-accent)] hover:underline"
                      >
                        <Phone size={11} />
                        {order.guestPhone}
                      </a>
                    }
                  />
                )}
                {!order.guestName && !order.guestPhone && (
                  <p className="text-xs text-[var(--admin-text-muted)]">Guest order</p>
                )}
              </>
            )}
          </Section>

          {/* Delivery address */}
          {(order.address || order.guestAddress) && (
            <Section icon={MapPin} title="Delivery Address">
              {order.address ? (
                <>
                  {order.address.label && (
                    <InfoRow label="Label" value={order.address.label} />
                  )}
                  <InfoRow label="Street" value={order.address.street} />
                  {order.address.city && (
                    <InfoRow label="City" value={order.address.city} />
                  )}
                  {order.address.isDefault && (
                    <InfoRow label="Default Address" value="Yes" />
                  )}
                </>
              ) : (
                <p className="text-xs text-[var(--admin-text)]">{order.guestAddress}</p>
              )}
            </Section>
          )}

          {/* Items */}
          <Section icon={Package} title={`Items (${order.items.length})`}>
            <div className="flex flex-col gap-3">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] p-3"
                >
                  {/* Thumbnail */}
                  {item.menuItem.images && item.menuItem.images.length > 0 ? (
  <img
    src={item.menuItem.images[0].url}
    alt={item.menuItem.name}
    className="h-12 w-12 flex-shrink-0 rounded-lg object-cover"
  />
) : (
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-[var(--admin-surface-2)] text-lg">
                      🍕
                    </div>
                  )}

                  {/* Details */}
                  <div className="flex flex-1 flex-col gap-0.5">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-semibold text-[var(--admin-text)]">
                        {item.menuItem.name}
                        <span className="ml-1 font-normal text-[var(--admin-text-muted)]">
                          ×{item.quantity}
                        </span>
                      </p>
                      <p className="flex-shrink-0 text-xs font-semibold text-[var(--admin-text)]">
                        {formatPrice(item.totalPrice)}
                      </p>
                    </div>

                    {item.size && (
                      <p className="text-[11px] text-[var(--admin-text-muted)]">
                        Size: {item.size.label}
                      </p>
                    )}

                    {item.addons && item.addons.length > 0 && (
                      <p className="text-[11px] text-[var(--admin-text-muted)]">
                        Add-ons:{" "}
                        {item.addons.map((a) => a.label).join(", ")}
                      </p>
                    )}

                    <p className="text-[11px] text-[var(--admin-text-muted)]">
                      Unit price: {formatPrice(item.unitPrice)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* Payment */}
          <Section icon={CreditCard} title="Payment">
            <InfoRow label="Method" value={order.paymentMethod} />
            <InfoRow
              label="Payment Status"
              value={
                <span
                  className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                    order.paymentStatus === "PAID"
                      ? "bg-emerald-500/10 text-emerald-500"
                      : order.paymentStatus === "FAILED"
                      ? "bg-red-500/10 text-red-500"
                      : "bg-amber-400/10 text-amber-500"
                  }`}
                >
                  {order.paymentStatus}
                </span>
              }
            />
            {order.paymentStatus !== "PAID" && (
  <div className="mt-3">
    <button
      onClick={handlePaymentUpdate}
      className="rounded-lg bg-emerald-500 px-4 py-2 text-xs font-medium text-white transition hover:bg-emerald-600"
    >
      Mark as Paid
    </button>
  </div>
)}
            <Divider />
            <InfoRow label="Subtotal" value={formatPrice(order.subtotal)} />
            {order.discountAmount > 0 && (
              <InfoRow
                label={
                  order.coupon ? (
                    <span className="flex items-center gap-1">
                      <Tag size={11} />
                      Discount ({order.coupon.code})
                    </span>
                  ) : (
                    "Discount"
                  )
                }
                value={
                  <span className="text-emerald-500">−{formatPrice(order.discountAmount)}</span>
                }
              />
            )}
            {order.taxAmount > 0 && (
              <InfoRow label="Tax" value={formatPrice(order.taxAmount)} />
            )}
            <InfoRow label="Delivery Fee" value={formatPrice(order.deliveryFee)} />
            <Divider />
            <div className="flex items-center justify-between pt-1">
              <span className="text-sm font-semibold text-[var(--admin-text)]">Total</span>
              <span className="text-sm font-bold text-[var(--admin-text)]">
                {formatPrice(order.totalAmount)}
              </span>
            </div>
          </Section>

          {/* Timeline */}
          <Section icon={Clock} title="Timeline">
            <OrderTimeline timeline={order.timeline} />
          </Section>
        </div>
      )}
    </Drawer>
  );
}
