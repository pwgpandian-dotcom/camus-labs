"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteCaseStudy } from "@/app/actions/admin";

export function DeleteCaseStudyButton({ id }: { id: string }) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (!confirm("Delete this case study? This can't be undone.")) return;
        startTransition(async () => {
          await deleteCaseStudy(id);
          router.push("/admin/case-studies");
          router.refresh();
        });
      }}
      className="text-sm text-danger hover:underline disabled:opacity-50"
    >
      {pending ? "Deleting…" : "Delete"}
    </button>
  );
}
