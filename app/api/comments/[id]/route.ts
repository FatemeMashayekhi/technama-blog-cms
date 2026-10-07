import { apiError, apiSuccess, handleApiError } from "@/lib/api-response";
import { assertJsonMutation, enforceApiRateLimit } from "@/lib/api-security";
import { requireRole } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/env";
import { assertMutationRequest } from "@/lib/request-security";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { commentModerationSchema, uuidSchema } from "@/lib/validation";

type Context = { params: Promise<{ id: string }> };
export async function PATCH(request: Request, { params }: Context) {
  if (!isSupabaseConfigured) return apiError("اتصال Supabase تنظیم نشده است.", 503);
  try {
    assertJsonMutation(request, 4 * 1024);
    const access = await requireRole(["admin", "editor"]);
    if (!access.ok) return apiError(access.error, access.status);
    await enforceApiRateLimit(request, "comment-moderation", 60, 600, access.profile.id);
    const id = uuidSchema.parse((await params).id);
    const input = commentModerationSchema.parse(await request.json());
    const { data, error } = await (await createSupabaseServerClient()).from("comments").update({ status: input.status }).eq("id", id).select("*").single();
    if (error) throw error;
    return apiSuccess(data);
  } catch (error) { return handleApiError(error); }
}
export async function DELETE(request: Request, { params }: Context) {
  if (!isSupabaseConfigured) return apiError("اتصال Supabase تنظیم نشده است.", 503);
  try {
    assertMutationRequest(request);
    const access = await requireRole(["admin", "editor"]);
    if (!access.ok) return apiError(access.error, access.status);
    await enforceApiRateLimit(request, "comment-delete", 30, 600, access.profile.id);
    const id = uuidSchema.parse((await params).id);
    const { error } = await (await createSupabaseServerClient()).from("comments").delete().eq("id", id);
    if (error) throw error;
    return apiSuccess({ id });
  } catch (error) { return handleApiError(error); }
}
