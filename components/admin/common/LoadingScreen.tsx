export function LoadingScreen() {
  return (
    <div className="admin-root flex min-h-screen items-center justify-center bg-[var(--admin-bg)]">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--admin-border-strong)] border-t-[var(--admin-ember)]" />
        <p className="text-sm text-[var(--admin-text-muted)]">Checking your session…</p>
      </div>
    </div>
  );
}
