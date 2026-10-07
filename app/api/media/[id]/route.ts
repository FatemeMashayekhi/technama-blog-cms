import { apiError, apiSuccess, handleApiError } from "@/lib/api-response";
import { assertJsonMutation, enforceApiRateLimit } from "@/lib/api-security";
import { requireRole } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/env";
import { assertMutationRequest } from "@/lib/request-security";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { mediaPatchSchema, uuidSchema } from "@/lib/validation";

type Context = { params: Promise<{ id: string }> };
export async function PATCH(request: Request, { params }: Context) {
  if (!isSupabaseConfigured) return apiError("اتصال Supabase تنظیم نشده است.", 503);
  try {
    assertJsonMutation(request, 8 * 1024);
    const access = await requireRole(["admin", "editor", "author"]);
    if (!access.ok) return apiError(access.error, access.status);
    await enforceApiRateLimit(request, "media-write", 60, 600, access.profile.id);
    const input = mediaPatchSchema.parse(await request.json()); const id = uuidSchema.parse((await params).id);
    const patch = { ...(input.name !== undefined ? { name: input.name } : {}), ...(input.altText !== undefined ? { alt_text: input.altText } : {}) };
    const userClient = await createSupabaseServerClient();
    const { data: permitted, error: permissionError } = await userClient.from("media").select("id").eq("id", id).single();
    if (permissionError || !permitted) return apiError("رسانه پیدا نشد یا دسترسی کافی ندارید.", 404);
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return apiError("سرویس امن رسانه موقتاً در دسترس نیست.", 503);
    const { data, error } = await createSupabaseAdminClient().from("media").update(patch).eq("id", id).select("*,owner:profiles!media_owner_id_fkey(id,display_name)").single();
    if (error) throw error;
    return apiSuccess(data);
  } catch (error) { return handleApiError(error); }
}
export async function DELETE(request: Request, { params }: Context) {
  if (!isSupabaseConfigured) return apiError("اتصال Supabase تنظیم نشده است.", 503);
  try {
    assertMutationRequest(request);
    const access = await requireRole(["admin", "editor", "author"]);
    if (!access.ok) return apiError(access.error, access.status);
    await enforceApiRateLimit(request, "media-delete", 30, 600, access.profile.id);
    const id = uuidSchema.parse((await params).id); const userClient = await createSupabaseServerClient();
    const { data, error: readError } = await userClient.from("media").select("path").eq("id", id).single();
    if (readError) throw readError;
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return apiError("سرویس امن رسانه موقتاً در دسترس نیست.", 503);
    const admin = createSupabaseAdminClient();
    const { error: storageError } = await admin.storage.from("media").remove([data.path]);
    if (storageError) throw storageError;
    const { error } = await admin.from("media").delete().eq("id", id);
    if (error) throw error;
    return apiSuccess({ id });
  } catch (error) { return handleApiError(error); }
}
