// "use client";

// import { useEffect, useState } from "react";
// import { Printer } from "lucide-react";
// import { Drawer } from "@/components/admin/common/Drawer";
// import { ConfirmDialog } from "@/components/admin/dialogs/ConfirmDialog";
// import { OrderStatusBadge } from "@/components/admin/common/StatusBadge";
// import { fetchOrder, updateOrderStatus,  updateOrderPaymentStatus } from "@/lib/admin/orders-api";
// import type { Order, OrderStatus } from "@/lib/admin/types";
// import { formatCurrency, formatDateTime } from "@/lib/admin/utils";
// import { useToast } from "@/lib/admin/toast";

// const STATUS_FLOW: OrderStatus[] = ["CONFIRMED", "PREPARING", "ON_THE_WAY", "DELIVERED"];

// interface OrderDetailsDrawerProps {
//   orderId: string | null;
//   onClose: () => void;
//   onStatusUpdated: () => void;
// }

// export function OrderDetailsDrawer({ orderId, onClose, onStatusUpdated }: OrderDetailsDrawerProps) {
//   const { showToast } = useToast();
//   const [order, setOrder] = useState<Order | null>(null);
//   const [loadState, setLoadState] = useState<"idle" | "loading" | "error" | "success">("idle");
//   const [updating, setUpdating] = useState(false);
//   const [pendingCancel, setPendingCancel] = useState(false);

//   useEffect(() => {
//     if (!orderId) {
//       setOrder(null);
//       setLoadState("idle");
//       return;
//     }
//     setLoadState("loading");
//     fetchOrder(orderId).then((res) => {
//       if (res.success) {
//         setOrder(res.data);
//         setLoadState("success");
//       } else {
//         setLoadState("error");
//         showToast(res.message, "error");
//       }
//     });
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [orderId]);

//   async function applyStatus(nextStatus: string) {
//     if (!order) return;
//     setUpdating(true);
//     const res = await updateOrderStatus(order.id, nextStatus);
//     setUpdating(false);
//     if (res.success) {
//       setOrder(res.data);
//       showToast(`Order #${order.orderNumber} marked ${nextStatus.toLowerCase().replace(/_/g, " ")}.`, "success");
//       onStatusUpdated();
//     } else {
//       showToast(res.message, "error");
//     }
//   }

//   const currentIndex = order ? STATUS_FLOW.indexOf(order.status as OrderStatus) : -1;
//   const nextStatus = currentIndex >= 0 ? STATUS_FLOW[currentIndex + 1] : undefined;
//   const isFinal = order ? order.status === "DELIVERED" || order.status === "CANCELLED" : true;

//   return (
//     <>
//       <Drawer
//         open={!!orderId}
//         onClose={onClose}
//         title={order ? `Order #${order.orderNumber}` : "Order details"}
//         description={order ? formatDateTime(order.createdAt) : undefined}
//         footer={
//           order ? (
           
//            <div className="flex flex-wrap items-center gap-2">
//             {order.paymentStatus !== "PAID" && (
//   <button
//     type="button"
//     disabled={updating}
//     onClick={async () => {
//      console.log(order?.paymentStatus);
//       if (!order) return;

//       setUpdating(true);

//       const res = await updateOrderPaymentStatus(
//         order.id,
//         "PAID"
//       );

//       setUpdating(false);

//       if (res.success) {
//         setOrder(res.data);
//         showToast("Payment marked as paid.", "success");
//         onStatusUpdated();
//       } else {
//         showToast(res.message, "error");
//       }
//     }}
//     className="rounded-lg bg-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-green-700"
//   >
//     Mark as Paid
//   </button>
// )}
//               {!isFinal && nextStatus && (
                

                
//                 <button
                
//                   type="button"
//                   disabled={updating}
//                   onClick={() => applyStatus(nextStatus)}
//                   className="rounded-lg bg-[var(--admin-ember)] px-3 py-2 text-sm font-medium text-white disabled:opacity-60"
//                 >
//                   {updating ? "Updating…" : `Mark as ${nextStatus.replace(/_/g, " ").toLowerCase()}`}
//                 </button>
//               )}
//               {!isFinal && (
//   <button
//     type="button"
//     disabled={updating}
//     onClick={() => setPendingCancel(true)}
//     className="rounded-lg border border-[var(--admin-crust-soft)] px-3 py-2 text-sm font-medium text-[var(--admin-crust)] hover:bg-[var(--admin-crust-soft)] disabled:opacity-60"
//   >
//     Cancel order
//   </button>
// )}
//               <button
//                 type="button"
//                 onClick={() => window.print()}
//                 className="ml-auto inline-flex items-center gap-1.5 rounded-lg border border-[var(--admin-border)] px-3 py-2 text-sm text-[var(--admin-text-muted)] hover:bg-[var(--admin-surface-hover)]"
//               >
//                 <Printer className="h-3.5 w-3.5" /> Print
//               </button>
//             </div>
//           ) : undefined
//         }
//       >
//         {loadState === "loading" && (
//           <div className="space-y-3">
//             {Array.from({ length: 5 }).map((_, i) => (
//               <div key={i} className="h-4 w-full animate-pulse rounded bg-[var(--admin-surface-2)]" />
//             ))}
//           </div>
//         )}
//         {loadState === "error" && <p className="text-sm text-[var(--admin-text-muted)]">Couldn&apos;t load this order.</p>}

//         {order && loadState === "success" && (
//           <div className="space-y-6 text-sm">
//            <div className="flex items-center justify-between">
//   <OrderStatusBadge status={order.status} />

//   <div className="flex items-center gap-2">
//     {order.paymentStatus !== "PAID" && (
//       <button
//         type="button"
//         disabled={updating}
//         onClick={async () => {
//           setUpdating(true);

//           const res = await updateOrderPaymentStatus(
//             order.id,
//             "PAID"
//           );

//           setUpdating(false);

//           if (res.success) {
//             setOrder(res.data);
//             showToast("Payment marked as paid.", "success");
//             onStatusUpdated();
//           } else {
//             showToast(res.message, "error");
//           }
//         }}
//         className="rounded-lg bg-green-600 px-3 py-1 text-xs font-medium text-white hover:bg-green-700 disabled:opacity-60"
//       >
//         Mark as Paid
//       </button>
//     )}

//     <span className="text-xs text-[var(--admin-text-faint)]">
//       {order.paymentMethod} · {order.paymentStatus}
//     </span>
//   </div>
// </div>

//             <section>
//               <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--admin-text-faint)]">Customer</h3>
//               <p className="text-[var(--admin-text)]">{order.user?.name ?? order.guestName ?? "—"}</p>
//               <p className="text-[var(--admin-text-muted)]">{order.user?.phone ?? order.guestPhone ?? "—"}</p>
//               <p className="text-[var(--admin-text-muted)]">
//                 {order.address ? [order.address.street, order.address.city].filter(Boolean).join(", ") : order.guestAddress ?? "—"}
//               </p>
//             </section>

//             <section>
//               <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--admin-text-faint)]">Items</h3>
//               <ul className="space-y-2">
//                 {order.items.map((item) => (
//                   <li key={item.id} className="flex items-center justify-between gap-3">
//                     <div className="min-w-0">
//                       <p className="text-[var(--admin-text)]">
//                         {item.quantity}× {item.menuItem.name}
//                         {item.size ? ` (${item.size.label})` : ""}
//                       </p>
//                       {item.addons && item.addons.length > 0 && (
//                         <p className="text-xs text-[var(--admin-text-faint)]">+ {item.addons.map((a) => a.label).join(", ")}</p>
//                       )}
//                     </div>
//                     <span className="shrink-0 text-[var(--admin-text-muted)]">{formatCurrency(item.totalPrice)}</span>
//                   </li>
//                 ))}
//               </ul>
//             </section>

//             <section className="space-y-1 border-t border-[var(--admin-border)] pt-3">
//               <div className="flex justify-between text-[var(--admin-text-muted)]">
//                 <span>Subtotal</span>
//                 <span>{formatCurrency(order.subtotal)}</span>
//               </div>
//               {order.discountAmount > 0 && (
//                 <div className="flex justify-between text-[var(--admin-basil)]">
//                   <span>Discount{order.coupon ? ` (${order.coupon.code})` : ""}</span>
//                   <span>-{formatCurrency(order.discountAmount)}</span>
//                 </div>
//               )}
//               <div className="flex justify-between text-[var(--admin-text-muted)]">
//                 <span>Delivery fee</span>
//                 <span>{formatCurrency(order.deliveryFee)}</span>
//               </div>
//               <div className="flex justify-between text-[var(--admin-text-muted)]">
//                 <span>Tax</span>
//                 <span>{formatCurrency(order.taxAmount)}</span>
//               </div>
//               <div className="flex justify-between pt-1 text-base font-semibold text-[var(--admin-text)]">
//                 <span>Total</span>
//                 <span>{formatCurrency(order.totalAmount)}</span>
//               </div>
//             </section>

//             {order.timeline && order.timeline.length > 0 && (
//               <section>
//                 <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--admin-text-faint)]">Timeline</h3>
//                 <ul className="space-y-2">
//                   {order.timeline.map((entry, i) => (
//                     <li key={i} className="flex items-center gap-2 text-xs">
//                       <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--admin-ember)]" />
//                       <span className="text-[var(--admin-text)]">{entry.status.replace(/_/g, " ")}</span>
//                       <span className="ml-auto shrink-0 text-[var(--admin-text-faint)]">{formatDateTime(entry.createdAt)}</span>
//                     </li>
//                   ))}
//                 </ul>
//               </section>
//             )}
//           </div>
//         )}
//       </Drawer>

//       <ConfirmDialog
//         open={pendingCancel}
//         title="Cancel this order?"
//         description="This will notify the customer and can't be undone from here."
//         confirmLabel="Cancel order"
//         tone="crust"
//         isLoading={updating}
//         onCancel={() => setPendingCancel(false)}
//         onConfirm={async () => {
//           await applyStatus("CANCELLED");
//           setPendingCancel(false);
//         }}
//       />
//     </>
//   );
// }
"use client";

import { useEffect, useState } from "react";
import { Printer } from "lucide-react";
import { Drawer } from "@/components/admin/common/Drawer";
import { ConfirmDialog } from "@/components/admin/dialogs/ConfirmDialog";
import { OrderStatusBadge } from "@/components/admin/common/StatusBadge";
import { fetchOrder, updateOrderStatus, updateOrderPaymentStatus} from "@/lib/admin/orders-api";
import type { Order, OrderStatus } from "@/lib/admin/types";
import { formatCurrency, formatDateTime } from "@/lib/admin/utils";
import { useToast } from "@/lib/admin/toast";

const STATUS_FLOW: OrderStatus[] = ["CONFIRMED", "PREPARING", "ON_THE_WAY", "DELIVERED"];

interface OrderDetailsDrawerProps {
  orderId: string | null;
  onClose: () => void;
  onStatusUpdated: () => void;
}

export function OrderDetailsDrawer({ orderId, onClose, onStatusUpdated }: OrderDetailsDrawerProps) {
  const { showToast } = useToast();
  const [order, setOrder] = useState<Order | null>(null);
  const [loadState, setLoadState] = useState<"idle" | "loading" | "error" | "success">("idle");
  const [updating, setUpdating] = useState(false);
  const [pendingCancel, setPendingCancel] = useState(false);

  useEffect(() => {
    if (!orderId) {
      setOrder(null);
      setLoadState("idle");
      return;
    }
    setLoadState("loading");
    fetchOrder(orderId).then((res) => {
      if (res.success) {
        setOrder(res.data);
        setLoadState("success");
      } else {
        setLoadState("error");
        showToast(res.message, "error");
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  async function applyStatus(nextStatus: string) {
    if (!order) return;
    setUpdating(true);
    const res = await updateOrderStatus(order.id, nextStatus);
    setUpdating(false);
    if (res.success) {
      setOrder(res.data);
      showToast(`Order #${order.orderNumber} marked ${nextStatus.toLowerCase().replace(/_/g, " ")}.`, "success");
      onStatusUpdated();
    } else {
      showToast(res.message, "error");
    }
  }

  const currentIndex = order ? STATUS_FLOW.indexOf(order.status as OrderStatus) : -1;
  const nextStatus = currentIndex >= 0 ? STATUS_FLOW[currentIndex + 1] : undefined;
  const isFinal = order ? order.status === "DELIVERED" || order.status === "CANCELLED" : true;

  return (
    <>
      <Drawer
        open={!!orderId}
        onClose={onClose}
        title={order ? `Order #${order.orderNumber}` : "Order details"}
        description={order ? formatDateTime(order.createdAt) : undefined}
        footer={
          order && !isFinal ? (
            <div className="flex flex-wrap items-center gap-2">
              {nextStatus && (
                <button
                  type="button"
                  disabled={updating}
                  onClick={() => applyStatus(nextStatus)}
                  className="rounded-lg bg-[var(--admin-ember)] px-3 py-2 text-sm font-medium text-white disabled:opacity-60"
                >
                  {updating ? "Updating…" : `Mark as ${nextStatus.replace(/_/g, " ").toLowerCase()}`}
                </button>
              )}
              <button
                type="button"
                disabled={updating}
                onClick={() => setPendingCancel(true)}
                className="rounded-lg border border-[var(--admin-crust-soft)] px-3 py-2 text-sm font-medium text-[var(--admin-crust)] hover:bg-[var(--admin-crust-soft)] disabled:opacity-60"
              >
                Cancel order
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="ml-auto inline-flex items-center gap-1.5 rounded-lg border border-[var(--admin-border)] px-3 py-2 text-sm text-[var(--admin-text-muted)] hover:bg-[var(--admin-surface-hover)]"
              >
                <Printer className="h-3.5 w-3.5" /> Print
              </button>
            </div>
          ) : undefined
        }
      >
        {loadState === "loading" && (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-4 w-full animate-pulse rounded bg-[var(--admin-surface-2)]" />
            ))}
          </div>
        )}

        {loadState === "error" && <p className="text-sm text-[var(--admin-text-muted)]">Couldn&apos;t load this order.</p>}

        {order && loadState === "success" && (
          <div className="space-y-6 text-sm">
            <div className="flex items-center justify-between">
  <OrderStatusBadge status={order.status} />

  <div className="flex items-center gap-2">
    <span className="text-xs text-[var(--admin-text-faint)]">
      {order.paymentMethod} · {order.paymentStatus}
    </span>

    {order.paymentStatus !== "PAID" && (
      <button
        type="button"
        disabled={updating}
        onClick={async () => {
          setUpdating(true);

          const res = await updateOrderPaymentStatus(
            order.id,
            "PAID"
          );

          setUpdating(false);

          if (res.success) {
            setOrder(res.data);
            showToast("Payment marked as paid.", "success");
            onStatusUpdated();
          } else {
            showToast(res.message, "error");
          }
        }}
        className="rounded bg-green-600 px-2 py-1 text-xs font-medium text-white hover:bg-green-700"
      >
        Mark as Paid
      </button>
    )}
  </div>
</div>

            <section>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--admin-text-faint)]">user test 123</h3>
              <p className="text-[var(--admin-text)]">{order.user?.name ?? order.guestName ?? "—"}</p>
              <p className="text-[var(--admin-text-muted)]">{order.user?.phone ?? order.guestPhone ?? "—"}</p>
              <p className="text-[var(--admin-text-muted)]">
                {order.address ? [order.address.street, order.address.city].filter(Boolean).join(", ") : order.guestAddress ?? "—"}
              </p>
            </section>

            <section>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--admin-text-faint)]">Items</h3>
              <ul className="space-y-2">
                {order.items.map((item) => (
                  <li key={item.id} className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[var(--admin-text)]">
                        {item.quantity}× {item.menuItem.name}
                        {item.size ? ` (${item.size.label})` : ""}
                      </p>
                      {item.addons && item.addons.length > 0 && (
                        <p className="text-xs text-[var(--admin-text-faint)]">+ {item.addons.map((a) => a.label).join(", ")}</p>
                      )}
                    </div>
                    <span className="shrink-0 text-[var(--admin-text-muted)]">{formatCurrency(item.totalPrice)}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="space-y-1 border-t border-[var(--admin-border)] pt-3">
              <div className="flex justify-between text-[var(--admin-text-muted)]">
                <span>Subtotal</span>
                <span>{formatCurrency(order.subtotal)}</span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-[var(--admin-basil)]">
                  <span>Discount{order.coupon ? ` (${order.coupon.code})` : ""}</span>
                  <span>-{formatCurrency(order.discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-[var(--admin-text-muted)]">
                <span>Delivery fee</span>
                <span>{formatCurrency(order.deliveryFee)}</span>
              </div>
              <div className="flex justify-between text-[var(--admin-text-muted)]">
                <span>Tax</span>
                <span>{formatCurrency(order.taxAmount)}</span>
              </div>
              <div className="flex justify-between pt-1 text-base font-semibold text-[var(--admin-text)]">
                <span>Total</span>
                <span>{formatCurrency(order.totalAmount)}</span>
              </div>
            </section>

            {order.timeline && order.timeline.length > 0 && (
              <section>
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--admin-text-faint)]">Timeline</h3>
                <ul className="space-y-2">
                  {order.timeline.map((entry, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--admin-ember)]" />
                      <span className="text-[var(--admin-text)]">{entry.status.replace(/_/g, " ")}</span>
                      <span className="ml-auto shrink-0 text-[var(--admin-text-faint)]">{formatDateTime(entry.createdAt)}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        )}
      </Drawer>

      <ConfirmDialog
        open={pendingCancel}
        title="Cancel this order?"
        description="This will notify the user and can't be undone from here."
        confirmLabel="Cancel order"
        tone="crust"
        isLoading={updating}
        onCancel={() => setPendingCancel(false)}
        onConfirm={async () => {
          await applyStatus("CANCELLED");
          setPendingCancel(false);
        }}
      />
    </>
  );
}

