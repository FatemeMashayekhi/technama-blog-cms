import { apiError, apiSuccess, handleApiError } from "@/lib/api-response";
import { requireRole } from "@/lib/auth";
import { updateArticle } from "@/lib/cms-write";
import { isSupabaseConfigured } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { articlePatchSchema } from "@/lib/validation";

type Context = { params: Promise<{ id: string }> };
export async function PATCH(request: Request, { params }: Context) {
  if (!isSupabaseConfigured) return apiError("اتصال Supabase تنظیم نشده است.", 503);
  try {
    const access = await requireRole(["admin", "editor", "author"]);
    if (!access.ok) return apiError(access.error, access.status);
    const { id } = await params;
    const input = articlePatchSchema.parse(await request.json());
    const article = await updateArticle(await createSupabaseServerClient(), id, input, access.profile.id, access.profile.role !== "author");
    return apiSuccess(article);
  } catch (error) { return handleApiError(error); }
}

export async function DELETE(_request: Request, { params }: Context) {
  if (!isSupabaseConfigured) return apiError("اتصال Supabase تنظیم نشده است.", 503);
  try {
    const access = await requireRole(["admin", "editor", "author"]);
    if (!access.ok) return apiError(access.error, access.status);
    const { id } = await params;
    const { error } = await (await createSupabaseServerClient()).from("articles").delete().eq("id", id);
    if (error) throw error;
    return apiSuccess({ id });
  } catch (error) { return handleApiError(error); }
}
