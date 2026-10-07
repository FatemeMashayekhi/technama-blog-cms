import { revalidatePath } from "next/cache";
import { apiError, apiSuccess, handleApiError } from "@/lib/api-response";
import { assertJsonMutation, enforceApiRateLimit } from "@/lib/api-security";
import { requireRole } from "@/lib/auth";
import { updateArticle } from "@/lib/cms-write";
import { isSupabaseConfigured } from "@/lib/env";
import { assertMutationRequest } from "@/lib/request-security";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { articlePatchSchema, uuidSchema } from "@/lib/validation";

type Context = { params: Promise<{ id: string }> };
export async function PATCH(request: Request, { params }: Context) {
  if (!isSupabaseConfigured) return apiError("اتصال Supabase تنظیم نشده است.", 503);
  try {
    assertJsonMutation(request, 220 * 1024);
    const access = await requireRole(["admin", "editor", "author"]);
    if (!access.ok) return apiError(access.error, access.status);
    await enforceApiRateLimit(request, "article-write", 60, 600, access.profile.id);
    const id = uuidSchema.parse((await params).id);
    const input = articlePatchSchema.parse(await request.json());
    const article = await updateArticle(await createSupabaseServerClient(), id, input, access.profile.id, access.profile.role !== "author");
    revalidatePath("/");
    revalidatePath("/articles");
    revalidatePath(`/articles/${article.slug}`);
    return apiSuccess(article);
  } catch (error) { return handleApiError(error); }
}

export async function DELETE(request: Request, { params }: Context) {
  if (!isSupabaseConfigured) return apiError("اتصال Supabase تنظیم نشده است.", 503);
  try {
    assertMutationRequest(request);
    const access = await requireRole(["admin", "editor", "author"]);
    if (!access.ok) return apiError(access.error, access.status);
    await enforceApiRateLimit(request, "article-delete", 20, 600, access.profile.id);
    const id = uuidSchema.parse((await params).id);
    const supabase = await createSupabaseServerClient();
    const { data: existing } = await supabase.from("articles").select("slug").eq("id", id).maybeSingle();
    const { error } = await supabase.from("articles").delete().eq("id", id);
    if (error) throw error;
    revalidatePath("/");
    revalidatePath("/articles");
    if (existing?.slug) revalidatePath(`/articles/${existing.slug}`);
    return apiSuccess({ id });
  } catch (error) { return handleApiError(error); }
}
