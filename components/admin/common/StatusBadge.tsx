import { cn } from "@/lib/admin/utils";

type Tone = "ember" | "basil" | "semolina" | "crust" | "neutral";

const toneClasses: Record<Tone, string> = {
  ember: "bg-[var(--admin-ember-soft)] text-[var(--admin-ember)]",
  basil: "bg-[var(--admin-basil-soft)] text-[var(--admin-basil)]",
  semolina: "bg-[var(--admin-semolina-soft)] text-[var(--admin-semolina)]",
  crust: "bg-[var(--admin-crust-soft)] text-[var(--admin-crust)]",
  neutral: "bg-[var(--admin-surface-2)] text-[var(--admin-text-muted)]",
};

interface StatusBadgeProps {
  label: string;
  tone?: Tone;
}

export function StatusBadge({ label, tone = "neutral" }: StatusBadgeProps) {
  return (
    <span className={cn("inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium capitalize", toneClasses[tone])}>
      {label.toLowerCase().replace(/_/g, " ")}
    </span>
  );
}

const ORDER_STATUS_TONES: Record<string, Tone> = {
  CONFIRMED: "ember",
  PREPARING: "semolina",
  OUT_FOR_DELIVERY: "ember",
  DELIVERED: "basil",
  CANCELLED: "crust",
};

export function OrderStatusBadge({ status }: { status: string }) {
  return <StatusBadge label={status} tone={ORDER_STATUS_TONES[status] ?? "neutral"} />;
}

const RESERVATION_STATUS_TONES: Record<string, Tone> = {
  PENDING: "semolina",
  ACCEPTED: "basil",
  REJECTED: "crust",
  COMPLETED: "neutral",
};

export function ReservationStatusBadge({ status }: { status: string }) {
  return <StatusBadge label={status} tone={RESERVATION_STATUS_TONES[status] ?? "neutral"} />;
}

export function GuestBadge({ isGuest }: { isGuest: boolean }) {
  return (
    <span
      className={cn(
        "rounded-full px-2 py-0.5 text-[10px] font-medium",
        isGuest ? "bg-[var(--admin-semolina-soft)] text-[var(--admin-semolina)]" : "bg-[var(--admin-basil-soft)] text-[var(--admin-basil)]"
      )}
    >
      {isGuest ? "Guest" : "Registered"}
    </span>
  );
}
