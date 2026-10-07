import { checkRateLimit } from "@/lib/rate-limit";
import { assertMutationRequest, RequestSecurityError } from "@/lib/request-security";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export function assertJsonMutation(request: Request, maxBytes = 64 * 1024) {
  assertMutationRequest(request, {
    maxBytes,
    contentTypes: ["application/json"],
    requireBody: true,
  });
}

export async function enforceApiRateLimit(
  request: Request,
  namespace: string,
  maxHits: number,
  windowSeconds: number,
  subject = "",
) {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("SUPABASE_SERVICE_ROLE_KEY is required for distributed rate limiting.");
    }
    return;
  }
  const allowed = await checkRateLimit(createSupabaseAdminClient(), request, namespace, maxHits, windowSeconds, subject);
  if (!allowed) throw new RequestSecurityError("تعداد درخواست‌ها زیاد است؛ کمی بعد دوباره تلاش کنید.", 429, "RATE_LIMITED");
}

