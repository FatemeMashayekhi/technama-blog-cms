import { createHash } from "node:crypto";
import type { SupabaseClient } from "@supabase/supabase-js";

export async function checkRateLimit(supabase: SupabaseClient, source: Request | Headers, namespace: string, maxHits: number, windowSeconds: number, subject = "") {
  const headers = source instanceof Headers ? source : source.headers;
  const forwarded = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const address = process.env.VERCEL === "1" ? forwarded : process.env.CF_PAGES === "1" ? headers.get("cf-connecting-ip") : "local";
  const secret = process.env.RATE_LIMIT_SECRET;
  if (!secret || secret.length < 32) {
    if (process.env.NODE_ENV === "production") throw new Error("RATE_LIMIT_SECRET is not configured securely.");
  }
  const digest = createHash("sha256").update(`${secret ?? "development-only"}:${address ?? "unknown"}:${subject}`).digest("hex");
  const { data, error } = await supabase.rpc("check_rate_limit", { identifier: `${namespace}:${digest}`, max_hits: maxHits, window_seconds: windowSeconds });
  if (error) throw error;
  return data === true;
}
