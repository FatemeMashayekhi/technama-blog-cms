import { apiError, apiSuccess, handleApiError } from "@/lib/api-response";
import { requireRole } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { commentModerationSchema } from "@/lib/validation";

type Context = { params: Promise<{ id: string }> };
export async function PATCH(request: Request, { params }: Context) {
  if (!isSupabaseConfigured) return apiError("اتصال Supabase تنظیم نشده است.", 503);
  try {
    const access = await requireRole(["admin", "editor"]);
    if (!access.ok) return apiError(access.error, access.status);
    const { id } = await params;
    const input = commentModerationSchema.parse(await request.json());
    const { data, error } = await (await createSupabaseServerClient()).from("comments").update({ status: input.status }).eq("id", id).select("*").single();
    if (error) throw error;
    return apiSuccess(data);
  } catch (error) { return handleApiError(error); }
}
export async function DELETE(_request: Request, { params }: Context) {
  if (!isSupabaseConfigured) return apiError("اتصال Supabase تنظیم نشده است.", 503);
  try {
    const access = await requireRole(["admin", "editor"]);
    if (!access.ok) return apiError(access.error, access.status);
    const { id } = await params;
    const { error } = await (await createSupabaseServerClient()).from("comments").delete().eq("id", id);
    if (error) throw error;
    return apiSuccess({ id });
  } catch (error) { return handleApiError(error); }
}
