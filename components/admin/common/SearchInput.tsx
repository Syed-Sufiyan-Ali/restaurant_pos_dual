"use client";

import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
   className?: string;
}

export function SearchInput({ value, onChange, placeholder = "Search…", className = "", }: SearchInputProps) {
  const [local, setLocal] = useState(value);

  useEffect(() => setLocal(value), [value]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (local !== value) onChange(local);
    }, 250);
    return () => clearTimeout(timeout);
    // Intentionally only re-runs when the local (typed) value changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [local]);

  return (
     <div className={`flex w-full items-center gap-2 rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface-2)] px-3 py-2 transition-colors focus-within:border-[var(--admin-accent)] ${className}`}>
      <Search className="h-4 w-4 shrink-0 text-[var(--admin-text-faint)]" />
      <input
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        placeholder={placeholder}
        className="flex-1 bg-transparent text-sm text-[var(--admin-text)] outline-none placeholder:text-[var(--admin-text-faint)]"
      />
      {local && (
        <button
    type="button"
    onClick={() => setLocal("")}
    aria-label="Clear search"
    className="rounded-md p-1 transition-colors hover:bg-[var(--admin-surface)]"
>
          <X className="h-3.5 w-3.5 text-[var(--admin-text-faint)]" />
        </button>
      )}
    </div>
  );
}
