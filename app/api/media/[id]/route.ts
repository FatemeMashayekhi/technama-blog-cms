import { apiError, apiSuccess, handleApiError } from "@/lib/api-response";
import { requireRole } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { mediaPatchSchema } from "@/lib/validation";

type Context = { params: Promise<{ id: string }> };
export async function PATCH(request: Request, { params }: Context) {
  if (!isSupabaseConfigured) return apiError("اتصال Supabase تنظیم نشده است.", 503);
  try {
    const access = await requireRole(["admin", "editor", "author"]);
    if (!access.ok) return apiError(access.error, access.status);
    const input = mediaPatchSchema.parse(await request.json()); const { id } = await params;
    const patch = { ...(input.name !== undefined ? { name: input.name } : {}), ...(input.altText !== undefined ? { alt_text: input.altText } : {}) };
    const { data, error } = await (await createSupabaseServerClient()).from("media").update(patch).eq("id", id).select("*,owner:profiles!media_owner_id_fkey(id,display_name)").single();
    if (error) throw error;
    return apiSuccess(data);
  } catch (error) { return handleApiError(error); }
}
export async function DELETE(_request: Request, { params }: Context) {
  if (!isSupabaseConfigured) return apiError("اتصال Supabase تنظیم نشده است.", 503);
  try {
    const access = await requireRole(["admin", "editor", "author"]);
    if (!access.ok) return apiError(access.error, access.status);
    const { id } = await params; const supabase = await createSupabaseServerClient();
    const { data, error: readError } = await supabase.from("media").select("path").eq("id", id).single();
    if (readError) throw readError;
    const { error: storageError } = await supabase.storage.from("media").remove([data.path]);
    if (storageError) throw storageError;
    const { error } = await supabase.from("media").delete().eq("id", id);
    if (error) throw error;
    return apiSuccess({ id });
  } catch (error) { return handleApiError(error); }
}
