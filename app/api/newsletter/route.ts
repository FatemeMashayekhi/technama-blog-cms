import { apiError, apiSuccess, handleApiError } from "@/lib/api-response";
import { isSupabaseConfigured } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { newsletterSchema } from "@/lib/validation";
import { checkRateLimit } from "@/lib/rate-limit";
export async function POST(request: Request) {
  if (!isSupabaseConfigured) return apiError("اتصال Supabase تنظیم نشده است.", 503);
  try {
    const { email } = newsletterSchema.parse(await request.json());
    const supabase = await createSupabaseServerClient();
    if (!await checkRateLimit(supabase, request, "newsletter", 5, 3600)) return apiError("تعداد درخواست‌ها زیاد است؛ بعداً دوباره تلاش کنید.", 429);
    const { error } = await supabase.from("newsletter_subscribers").insert({ email: email.toLowerCase(), is_active: true });
    if (error && error.code !== "23505") throw error;
    return apiSuccess({ subscribed: true }, 201);
  } catch (error) { return handleApiError(error); }
}
