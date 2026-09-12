import { apiSuccess } from "@/lib/api-response";
import { isSupabaseConfigured } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET() {
  if (!isSupabaseConfigured) return apiSuccess({ status: "demo", database: "not-configured" });
  const { error } = await (await createSupabaseServerClient()).from("categories").select("id", { head: true, count: "exact" }).limit(1);
  return apiSuccess({ status: error ? "degraded" : "ok", database: error ? "unreachable" : "connected" }, error ? 503 : 200);
}
