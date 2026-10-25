import { apiError, apiSuccess, handleApiError } from "@/lib/api-response";
import { enforceApiRateLimit, readJsonMutation } from "@/lib/api-security";
import { requireWriteRole } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/env";
import { assertMutationRequest } from "@/lib/request-security";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { tagInputSchema, uuidSchema } from "@/lib/validation";

type Context = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Context) {
  if (!isSupabaseConfigured) return apiError("اتصال Supabase تنظیم نشده است.", 503);
  try {
    const access = await requireWriteRole(["admin", "editor"]);
    if (!access.ok) return apiError(access.error, access.status);
    await enforceApiRateLimit(request, "taxonomy-write", 60, 600, access.profile.id);
    const schema = tagInputSchema.partial().refine((value) => Object.keys(value).length > 0);
    const input = schema.parse(await readJsonMutation(request, 8 * 1024));
    const id = uuidSchema.parse((await params).id);
    const { data, error } = await (await createSupabaseServerClient()).from("tags").update(input).eq("id", id).select("*").single();
    if (error) throw error;
    return apiSuccess(data);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: Request, { params }: Context) {
  if (!isSupabaseConfigured) return apiError("اتصال Supabase تنظیم نشده است.", 503);
  try {
    assertMutationRequest(request);
    const access = await requireWriteRole(["admin", "editor"]);
    if (!access.ok) return apiError(access.error, access.status);
    await enforceApiRateLimit(request, "taxonomy-delete", 20, 600, access.profile.id);
    const id = uuidSchema.parse((await params).id);
    const { data, error } = await (await createSupabaseServerClient()).from("tags").delete().eq("id", id).select("id").maybeSingle();
    if (error) throw error;
    if (!data) return apiError("برچسب پیدا نشد.", 404);
    return apiSuccess({ id });
  } catch (error) {
    return handleApiError(error);
  }
}
