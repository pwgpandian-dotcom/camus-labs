"use client";

import { useId, useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";

/** Chips + free text entry. Suggestions toggle on tap; Enter or comma adds custom values. */
export function TagInput({
  value,
  onChange,
  suggestions = [],
  placeholder = "Type and press Enter",
  max = 20,
  label,
}: {
  value: string[];
  onChange: (v: string[]) => void;
  suggestions?: string[];
  placeholder?: string;
  max?: number;
  label: string;
}) {
  const [draft, setDraft] = useState("");
  const id = useId();
  const has = (s: string) => value.some((v) => v.toLowerCase() === s.toLowerCase());

  function add(raw: string) {
    const s = raw.trim().slice(0, 60);
    if (!s || has(s) || value.length >= max) return;
    onChange([...value, s]);
  }
  function remove(s: string) {
    onChange(value.filter((v) => v !== s));
  }

  return (
    <div>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <div className="flex min-h-12 flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-paper p-2 focus-within:border-signal focus-within:ring-2 focus-within:ring-signal/20">
        {value.map((v) => (
          <span key={v} className="inline-flex items-center gap-1 rounded-full bg-ink py-1 pl-3 pr-1 text-[13px] text-paper">
            {v}
            <button type="button" onClick={() => remove(v)} aria-label={`Remove ${v}`} className="flex h-6 w-6 items-center justify-center rounded-full hover:bg-slate-700">
              <X size={12} />
            </button>
          </span>
        ))}
        <input
          id={id}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              add(draft);
              setDraft("");
            } else if (e.key === "Backspace" && !draft && value.length) {
              remove(value[value.length - 1]);
            }
          }}
          onBlur={() => {
            if (draft) {
              add(draft);
              setDraft("");
            }
          }}
          placeholder={value.length ? "" : placeholder}
          className="min-w-[8rem] flex-1 bg-transparent px-2 py-1 text-base md:text-[15px] outline-none placeholder:text-slate-400"
          enterKeyHint="done"
        />
      </div>
      {suggestions.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {suggestions.map((s) => {
            const active = has(s);
            return (
              <button
                key={s}
                type="button"
                aria-pressed={active}
                onClick={() => (active ? remove(value.find((v) => v.toLowerCase() === s.toLowerCase())!) : add(s))}
                className={cn(
                  "min-h-9 rounded-full border px-3.5 text-[13px] transition-colors",
                  active ? "border-ink bg-ink text-paper" : "border-slate-200 bg-paper text-slate-600 hover:border-slate-400"
                )}
              >
                {s}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
