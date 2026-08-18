"use client";

import { useState, useTransition } from "react";

type ActionResult = { success: boolean; error?: string };

export function StatusSelect<T extends string>({
  id,
  currentValue,
  options,
  action,
}: {
  id: string;
  currentValue: T;
  options: readonly T[];
  action: (id: string, value: T) => Promise<ActionResult>;
}) {
  const [value, setValue] = useState<T>(currentValue);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleChange(next: T) {
    const previous = value;
    setValue(next);
    setError(null);
    startTransition(async () => {
      const result = await action(id, next);
      if (!result.success) {
        setValue(previous);
        setError(result.error || "Update failed.");
      }
    });
  }

  return (
    <div className="flex flex-col gap-1">
      <select
        value={value}
        disabled={pending}
        onChange={(e) => handleChange(e.target.value as T)}
        className="rounded-lg border border-slate-300 bg-paper px-3 py-1.5 text-sm text-ink outline-none focus:border-ink disabled:opacity-50"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt.replace(/_/g, " ")}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}
