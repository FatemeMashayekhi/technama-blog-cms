import { apiError, apiSuccess, handleApiError } from "@/lib/api-response";
import { assertJsonMutation, enforceApiRateLimit } from "@/lib/api-security";
import { isSupabaseConfigured } from "@/lib/env";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { newsletterSchema } from "@/lib/validation";
export async function POST(request: Request) {
  if (!isSupabaseConfigured) return apiError("اتصال Supabase تنظیم نشده است.", 503);
  try {
    assertJsonMutation(request, 4 * 1024);
    const { email } = newsletterSchema.parse(await request.json());
    await enforceApiRateLimit(request, "newsletter", 5, 3600);
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return apiError("سرویس خبرنامه موقتاً در دسترس نیست.", 503);
    const { error } = await createSupabaseAdminClient().from("newsletter_subscribers").insert({ email: email.toLowerCase(), is_active: true });
    if (error && error.code !== "23505") throw error;
    return apiSuccess({ subscribed: true }, 201);
  } catch (error) { return handleApiError(error); }
}
