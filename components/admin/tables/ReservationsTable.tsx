"use client";

import { Check, CheckCheck, Phone, X, type LucideIcon } from "lucide-react";
import type { Reservation } from "@/lib/admin/types";
import { ReservationStatusBadge } from "@/components/admin/common/StatusBadge";
import { formatDate } from "@/lib/admin/utils";

interface ReservationsTableProps {
  reservations: Reservation[];
  updatingId: string | null;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
  onComplete: (id: string) => void;
}

export function ReservationsTable({ reservations, updatingId, onAccept, onReject, onComplete }: ReservationsTableProps) {
  return (
    <>
      <table className="hidden w-full text-left text-sm md:table">
        <thead>
          <tr className="border-b border-[var(--admin-border)] text-xs uppercase tracking-wide text-[var(--admin-text-faint)]">
            <th className="px-4 py-3 font-medium">Guest</th>
            <th className="px-4 py-3 font-medium">Party</th>
            <th className="px-4 py-3 font-medium">Date &amp; time</th>
            <th className="px-4 py-3 font-medium">Phone</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 text-right font-medium">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--admin-border)]">
          {reservations.map((r) => (
            <tr key={r.id}>
              <td className="px-4 py-3 text-[var(--admin-text)]">{r.name}</td>
              <td className="px-4 py-3 text-[var(--admin-text-muted)]">{r.partySize}</td>
              <td className="px-4 py-3 text-[var(--admin-text-muted)]">
                {formatDate(r.date)} · {r.time}
              </td>
              <td className="px-4 py-3 text-[var(--admin-text-muted)]">
                <a href={`tel:${r.phone}`} className="inline-flex items-center gap-1 hover:text-[var(--admin-ember)]">
                  <Phone className="h-3.5 w-3.5" /> {r.phone}
                </a>
              </td>
              <td className="px-4 py-3">
                <ReservationStatusBadge status={r.status} />
              </td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-1.5">
                  <RowActions r={r} updatingId={updatingId} onAccept={onAccept} onReject={onReject} onComplete={onComplete} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="divide-y divide-[var(--admin-border)] md:hidden">
        {reservations.map((r) => (
          <div key={r.id} className="space-y-2 px-4 py-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[var(--admin-text)]">{r.name}</span>
              <ReservationStatusBadge status={r.status} />
            </div>
            <p className="text-xs text-[var(--admin-text-muted)]">
              {formatDate(r.date)} · {r.time} · Party of {r.partySize}
            </p>
            <div className="flex gap-1.5 pt-1">
              <RowActions r={r} updatingId={updatingId} onAccept={onAccept} onReject={onReject} onComplete={onComplete} />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function RowActions({
  r,
  updatingId,
  onAccept,
  onReject,
  onComplete,
}: {
  r: Reservation;
  updatingId: string | null;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
  onComplete: (id: string) => void;
}) {
  const busy = updatingId === r.id;
  if (r.status === "PENDING") {
    return (
      <>
        <ActionButton disabled={busy} tone="basil" icon={Check} label="Accept" onClick={() => onAccept(r.id)} />
        <ActionButton disabled={busy} tone="crust" icon={X} label="Reject" onClick={() => onReject(r.id)} />
      </>
    );
  }
  if (r.status === "ACCEPTED") {
    return <ActionButton disabled={busy} tone="ember" icon={CheckCheck} label="Complete" onClick={() => onComplete(r.id)} />;
  }
  return null;
}

function ActionButton({
  tone,
  icon: Icon,
  label,
  onClick,
  disabled,
}: {
  tone: "basil" | "crust" | "ember";
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  const toneClasses: Record<typeof tone, string> = {
    basil: "border-[var(--admin-basil-soft)] text-[var(--admin-basil)] hover:bg-[var(--admin-basil-soft)]",
    crust: "border-[var(--admin-crust-soft)] text-[var(--admin-crust)] hover:bg-[var(--admin-crust-soft)]",
    ember: "border-[var(--admin-ember-soft)] text-[var(--admin-ember)] hover:bg-[var(--admin-ember-soft)]",
  };
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-medium disabled:opacity-50 ${toneClasses[tone]}`}
    >
      <Icon className="h-3.5 w-3.5" /> {label}
    </button>
  );
}
