export function StatTile({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-paper p-6">
      <p className="text-xs font-mono uppercase tracking-[0.08em] text-slate-400">{label}</p>
      <p className="mt-2 text-3xl font-medium tracking-tight text-ink">{value}</p>
      {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
    </div>
  );
}
