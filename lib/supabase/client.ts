"use client";

import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseEnvironment } from "@/lib/env";

let browserClient: ReturnType<typeof createBrowserClient> | undefined;
export function createSupabaseBrowserClient() {
  const { url, publishableKey } = getSupabaseEnvironment();
  browserClient ??= createBrowserClient(url, publishableKey);
  return browserClient;
}
