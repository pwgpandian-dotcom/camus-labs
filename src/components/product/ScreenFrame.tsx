"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { screens, type ScreenId } from "./ProductScreens";

/** Browser-window frame that scales a 1280×800 product screen to fit its width. */
export function ScreenFrame({ id, className }: { id: ScreenId; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.7);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setScale(e.contentRect.width / 1280));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const { Component, url, label } = screens[id];
  return (
    <figure className={cn("overflow-hidden rounded-2xl border border-[#D6E3EE] bg-white shadow-[0_24px_60px_-20px_rgba(30,43,56,0.28)]", className)}>
      <div className="flex items-center gap-2 border-b border-[#E5E9EF] bg-[#F7F9FB] px-4 py-2.5" aria-hidden="true">
        <span className="h-2.5 w-2.5 rounded-full bg-[#F0A79A]" /><span className="h-2.5 w-2.5 rounded-full bg-[#F3D27A]" /><span className="h-2.5 w-2.5 rounded-full bg-[#9FD8B5]" />
        <span className="mx-auto rounded-md bg-white px-4 py-1 text-xs font-medium text-slate-500 ring-1 ring-[#E5E9EF]">{url}</span>
      </div>
      <div ref={ref} className="relative w-full overflow-hidden" style={{ aspectRatio: "1280 / 800" }} role="img" aria-label={`Camus ${label} screen`}>
        <div className="pointer-events-none absolute left-0 top-0 origin-top-left select-none" style={{ transform: `scale(${scale})` }} aria-hidden="true">
          <Component />
        </div>
      </div>
    </figure>
  );
}

/** Tabbed showcase of all product screens. */
export function ProductShowcase({ initial = "dashboard", ids = ["dashboard", "pos", "crm", "clinic"] }: { initial?: ScreenId; ids?: ScreenId[] }) {
  const [id, setId] = useState<ScreenId>(initial);
  return (
    <div className="w-full">
      <div role="tablist" aria-label="Product screens" className="mb-5 flex flex-wrap justify-center gap-2">
        {ids.map((s) => (
          <button key={s} role="tab" aria-selected={s === id} type="button" onClick={() => setId(s)}
            className={cn("rounded-full px-5 py-2.5 text-[15px] font-semibold transition-colors", s === id ? "bg-signal text-white" : "border border-slate-300 bg-white text-slate-700 hover:border-signal hover:text-signal-dark")}>
            {screens[s].label}
          </button>
        ))}
      </div>
      <ScreenFrame id={id} />
      <p className="mt-3 text-center text-sm text-slate-500">Sample data shown for illustration.</p>
    </div>
  );
}
