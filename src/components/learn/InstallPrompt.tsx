"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { Download, Share, SquarePlus, X } from "lucide-react";
import { cn } from "@/lib/cn";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

type Platform = "ios" | "android" | "desktop" | "other";
const DISMISS_KEY = "camus.install.dismissedAt";
const DISMISS_DAYS = 30;

/* --- module-level store so every InstallPrompt shares one deferred event --- */
let deferred: BeforeInstallPromptEvent | null = null;
let installed = false;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferred = e as BeforeInstallPromptEvent;
    emit();
  });
  window.addEventListener("appinstalled", () => {
    installed = true;
    deferred = null;
    emit();
  });
}
function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

export function detectPlatform(ua: string, maxTouchPoints = 0): Platform {
  const isIOS = /iPhone|iPad|iPod/i.test(ua) || (/Macintosh/i.test(ua) && maxTouchPoints > 1); // iPadOS reports as Mac
  if (isIOS) return "ios";
  if (/Android/i.test(ua)) return "android";
  if (/Windows|Macintosh|Linux|CrOS/i.test(ua)) return "desktop";
  return "other";
}

function isStandalone() {
  return (
    window.matchMedia?.("(display-mode: standalone)").matches ||
    // iOS Safari
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

function readDismissed() {
  try {
    const v = localStorage.getItem(DISMISS_KEY);
    return v ? Date.now() - Number(v) < DISMISS_DAYS * 86_400_000 : false;
  } catch {
    return false;
  }
}

export function useInstall() {
  const hasPrompt = useSyncExternalStore(subscribe, () => deferred !== null, () => false);
  const wasInstalled = useSyncExternalStore(subscribe, () => installed, () => false);
  const [env, setEnv] = useState<{ platform: Platform; standalone: boolean; dismissed: boolean } | null>(null);

  useEffect(() => {
    // Reading browser-only APIs after mount avoids a hydration mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEnv({ platform: detectPlatform(navigator.userAgent, navigator.maxTouchPoints), standalone: isStandalone(), dismissed: readDismissed() });
  }, []);

  const install = useCallback(async () => {
    if (!deferred) return false;
    await deferred.prompt();
    const { outcome } = await deferred.userChoice;
    deferred = null;
    emit();
    return outcome === "accepted";
  }, []);

  const dismiss = useCallback(() => {
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {
      /* storage unavailable (private mode) — just hide for this session */
    }
    setEnv((e) => (e ? { ...e, dismissed: true } : e));
  }, []);

  const canInstall = !!env && !env.standalone && !wasInstalled && (hasPrompt || env.platform === "ios");
  return { env, canInstall, hasPrompt, install, dismiss };
}

/**
 * Platform-aware install UI.
 *  - variant="banner": shown once inside the app until dismissed (30 days)
 *  - variant="inline": a button/instructions block for marketing pages
 */
export function InstallPrompt({ variant = "banner", className }: { variant?: "banner" | "inline"; className?: string }) {
  const { env, canInstall, hasPrompt, install, dismiss } = useInstall();
  const [showIosSteps, setShowIosSteps] = useState(false);

  if (!env || !canInstall) return null;
  if (variant === "banner" && env.dismissed) return null;

  const isIOS = env.platform === "ios";
  const title = isIOS ? "Add Camus Learn to your Home Screen" : "Install Camus Learn";
  const body = isIOS
    ? "Open it like an app — full screen, one tap away."
    : env.platform === "desktop"
      ? "Get a dedicated window and launch it from your dock or taskbar."
      : "Faster to open, full screen, works like a native app.";

  const iosSteps = (
    <ol className="mt-3 flex flex-col gap-2 text-sm text-slate-600">
      <li className="flex items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-ink">1</span>
        Tap <Share size={16} className="text-signal" aria-label="Share" /> <span className="font-medium text-ink">Share</span> in Safari
      </li>
      <li className="flex items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-ink">2</span>
        Choose <SquarePlus size={16} className="text-ink" aria-hidden /> <span className="font-medium text-ink">Add to Home Screen</span>
      </li>
      <li className="flex items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-ink">3</span>
        Tap <span className="font-medium text-ink">Add</span>
      </li>
    </ol>
  );

  if (variant === "inline") {
    return (
      <div className={cn("rounded-2xl border border-slate-200 bg-paper p-5", className)}>
        <p className="text-[15px] font-medium text-ink">{title}</p>
        <p className="mt-1 text-sm text-slate-500">{body}</p>
        {isIOS ? (
          iosSteps
        ) : (
          hasPrompt && (
            <button onClick={install} className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-full bg-ink px-5 text-sm font-medium text-paper hover:bg-slate-800">
              <Download size={16} aria-hidden /> Install app
            </button>
          )
        )}
      </div>
    );
  }

  return (
    <div
      role="dialog"
      aria-label={title}
      className={cn(
        "no-print fade-in fixed z-50 rounded-2xl border border-slate-200 bg-paper p-4 shadow-md",
        "inset-x-3 bottom-[calc(var(--bottom-nav-h)+var(--safe-bottom)+12px)] md:inset-x-auto md:bottom-6 md:right-6 md:w-[360px]",
        className
      )}
    >
      <button onClick={dismiss} aria-label="Dismiss" className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full text-slate-400 hover:bg-slate-50 hover:text-ink">
        <X size={18} />
      </button>
      <div className="flex items-start gap-3 pr-8">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ink text-paper">
          <Download size={18} aria-hidden />
        </span>
        <div className="min-w-0">
          <p className="text-[15px] font-medium text-ink">{title}</p>
          <p className="mt-0.5 text-[13px] text-slate-500">{body}</p>
        </div>
      </div>
      {isIOS ? (
        showIosSteps ? (
          iosSteps
        ) : (
          <div className="mt-3 flex gap-2">
            <button onClick={() => setShowIosSteps(true)} className="min-h-10 flex-1 rounded-full bg-ink px-4 text-sm font-medium text-paper">Show me how</button>
            <button onClick={dismiss} className="min-h-10 rounded-full px-4 text-sm text-slate-600 hover:bg-slate-50">Not now</button>
          </div>
        )
      ) : (
        <div className="mt-3 flex gap-2">
          <button onClick={install} className="min-h-10 flex-1 rounded-full bg-ink px-4 text-sm font-medium text-paper hover:bg-slate-800">Install</button>
          <button onClick={dismiss} className="min-h-10 rounded-full px-4 text-sm text-slate-600 hover:bg-slate-50">Not now</button>
        </div>
      )}
    </div>
  );
}
