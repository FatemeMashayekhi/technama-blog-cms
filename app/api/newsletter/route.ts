import { apiError, apiSuccess, handleApiError } from "@/lib/api-response";
import { enforceApiRateLimit, readJsonMutation } from "@/lib/api-security";
import { isSupabaseConfigured } from "@/lib/env";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { newsletterSchema } from "@/lib/validation";
export async function POST(request: Request) {
  if (!isSupabaseConfigured) return apiError("اتصال Supabase تنظیم نشده است.", 503);
  try {
    const { email } = newsletterSchema.parse(await readJsonMutation(request, 4 * 1024));
    await enforceApiRateLimit(request, "newsletter", 5, 3600);
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return apiError("سرویس خبرنامه موقتاً در دسترس نیست.", 503);
    const { error } = await createSupabaseAdminClient().from("newsletter_subscribers").insert({ email: email.toLowerCase(), is_active: true });
    if (error && error.code !== "23505") throw error;
    return apiSuccess({ subscribed: true }, 201);
  } catch (error) { return handleApiError(error); }
}
