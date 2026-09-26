"use client";

export function RetryButton() {
  return (
    <button onClick={() => window.location.reload()} className="mt-6 inline-flex min-h-11 items-center rounded-full bg-ink px-6 text-sm font-medium text-paper hover:bg-slate-800">
      Try again
    </button>
  );
}
