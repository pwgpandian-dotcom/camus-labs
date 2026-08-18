import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./types";

/**
 * Supabase client for use in Client Components ("use client").
 * Safe to call anywhere on the client — uses the public URL + publishable key.
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
