import { apiError, apiSuccess, handleApiError } from "@/lib/api-response";
import { assertJsonMutation, enforceApiRateLimit } from "@/lib/api-security";
import { getCurrentProfile, requireRole } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ownProfilePatchSchema } from "@/lib/validation";

export async function GET() {
  if (!isSupabaseConfigured) return apiSuccess(null);
  try {
    const profile = await getCurrentProfile();
    if (!profile) return apiError("وارد حساب نشده‌اید.", 401);
    return apiSuccess(profile);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: Request) {
  if (!isSupabaseConfigured) return apiError("اتصال Supabase تنظیم نشده است.", 503);
  try {
    assertJsonMutation(request, 16 * 1024);
    const access = await requireRole(["admin", "editor", "author"]);
    if (!access.ok) return apiError(access.error, access.status);
    await enforceApiRateLimit(request, "own-profile-write", 20, 600, access.profile.id);
    const input = ownProfilePatchSchema.parse(await request.json());
    const { data, error } = await (await createSupabaseServerClient()).from("profiles").update({
      display_name: input.displayName,
      username: input.username,
      avatar_url: input.avatarUrl || null,
      bio: input.bio,
    }).eq("id", access.profile.id).select("id,display_name,username,avatar_url,bio,role,is_active").single();
    if (error) throw error;
    return apiSuccess(data);
  } catch (error) {
    return handleApiError(error);
  }
}
