"use client";

import { useState, useTransition } from "react";
import { updateUserRole } from "@/app/actions/admin";
import type { Database } from "@/lib/supabase/types";

type Role = Database["public"]["Enums"]["user_role"];
const roles: Role[] = ["client", "operator", "sales", "admin"];

export function RoleSelect({
  userId,
  currentRole,
  disabled,
}: {
  userId: string;
  currentRole: Role;
  disabled?: boolean;
}) {
  const [role, setRole] = useState<Role>(currentRole);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleChange(next: Role) {
    const previous = role;
    setRole(next);
    setError(null);
    startTransition(async () => {
      const result = await updateUserRole(userId, next);
      if (!result.success) {
        setRole(previous);
        setError(result.error || "Couldn't update role.");
      }
    });
  }

  return (
    <div className="flex flex-col gap-1">
      <select
        value={role}
        disabled={disabled || pending}
        onChange={(e) => handleChange(e.target.value as Role)}
        className="rounded-lg border border-slate-300 bg-paper px-3 py-1.5 text-sm text-ink outline-none focus:border-ink disabled:opacity-50"
      >
        {roles.map((r) => (
          <option key={r} value={r}>
            {r}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}
