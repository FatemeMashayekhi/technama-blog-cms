import { createHash } from "node:crypto";
import type { SupabaseClient } from "@supabase/supabase-js";

export async function checkRateLimit(supabase: SupabaseClient, request: Request, namespace: string, maxHits: number, windowSeconds: number) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const address = request.headers.get("cf-connecting-ip") ?? forwarded ?? "unknown";
  const secret = process.env.RATE_LIMIT_SECRET ?? "technama-development-only";
  const digest = createHash("sha256").update(`${secret}:${address}`).digest("hex");
  const { data, error } = await supabase.rpc("check_rate_limit", { identifier: `${namespace}:${digest}`, max_hits: maxHits, window_seconds: windowSeconds });
  if (error) throw error;
  return data === true;
}
