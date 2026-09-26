import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types";

/**
 * Cookie-less anonymous client for public, cacheable reads (pricing, plans,
 * catalog). Never use it for anything user-specific — RLS sees `anon`.
 */
export function createPublicClient() {
  return createSupabaseClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
