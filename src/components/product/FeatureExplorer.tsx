"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/cn";
import { ScreenFrame } from "./ScreenFrame";
import type { AppDetail } from "@/lib/app-details";

/** Tabbed "what it does" explorer: pick a capability, see the story and the screen. */
export function FeatureExplorer({ items }: { items: AppDetail["explore"] }) {
  const [i, setI] = useState(0);
  const cur = items[i];
  return (
    <div>
      <div role="tablist" aria-label="Capabilities" className="-mx-6 flex gap-2 overflow-x-auto px-6 pb-1 md:mx-0 md:flex-wrap md:justify-center md:px-0">
        {items.map((t, k) => (
          <button key={t.tab} type="button" role="tab" aria-selected={k === i} onClick={() => setI(k)}
            className={cn("shrink-0 rounded-full px-5 py-3 text-[15px] font-semibold transition-colors md:text-base",
              k === i ? "bg-signal text-white shadow-[0_8px_20px_-8px_rgba(44,110,158,0.7)]" : "border border-slate-300 bg-white text-slate-700 hover:border-signal hover:text-signal-dark")}>
            {t.tab}
          </button>
        ))}
      </div>
      <div className="mt-8 grid grid-cols-1 items-center gap-8 rounded-[28px] border border-[#D6E3EE] bg-white p-6 shadow-[0_30px_80px_-40px_rgba(30,43,56,0.35)] md:p-10 lg:grid-cols-[380px_1fr] lg:gap-12">
        <div key={cur.tab} className="animate-[fade-in_.35s_ease]">
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-signal">{cur.tab}</p>
          <h3 className="mt-3 text-[26px] font-semibold leading-tight tracking-tight text-ink md:text-[32px]">{cur.title}</h3>
          <p className="mt-4 text-[17px] leading-relaxed text-slate-700">{cur.body}</p>
          <ul className="mt-6 space-y-3">
            {cur.points.map((p) => (
              <li key={p} className="flex gap-3 text-[16px] font-medium text-slate-800">
                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-signal-50"><Check size={15} className="text-signal" strokeWidth={3} /></span>{p}
              </li>
            ))}
          </ul>
        </div>
        <div><ScreenFrame id={cur.screen} /><p className="mt-3 text-sm text-slate-500">Sample data shown for illustration.</p></div>
      </div>
    </div>
  );
}
