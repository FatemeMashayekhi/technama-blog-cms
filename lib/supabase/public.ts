import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseEnvironment } from "@/lib/env";

let publicClient: SupabaseClient | undefined;

export function createSupabasePublicClient() {
  if (publicClient) return publicClient;
  const { url, publishableKey } = getSupabaseEnvironment();
  publicClient = createClient(url, publishableKey, {
    auth: { autoRefreshToken: false, detectSessionInUrl: false, persistSession: false },
  });
  return publicClient;
}

