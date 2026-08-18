"use client";

import { useState, useTransition } from "react";
import { getDocumentSignedUrl } from "@/app/actions/admin";

export function DocumentLink({ path }: { path: string }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleClick() {
    setError(null);
    startTransition(async () => {
      const url = await getDocumentSignedUrl(path);
      if (!url) {
        setError("Couldn't generate a link.");
        return;
      }
      window.open(url, "_blank", "noopener,noreferrer");
    });
  }

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={pending}
        className="text-sm font-medium text-signal hover:text-signal-dark disabled:opacity-50"
      >
        {pending ? "Generating link…" : "Open"}
      </button>
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}
